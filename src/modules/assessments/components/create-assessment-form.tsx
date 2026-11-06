"use client";

import { useMemo, useState, useTransition } from "react";
import { Bot, Database, Hand, Loader2, Sparkles } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { chapterTheme } from "@/lib/chapter-theme";
import { cn } from "@/lib/utils";
import { createAssessmentAction } from "../actions";
import { DEFAULT_STRUCTURE, type AssessmentStructure } from "../logic";

type Lesson = { id: string; number: number; title: string; chapterNumber: number; chapterRoman: string; chapterTitle: string; published: number };

const MODES = [
  { value: "auto", icon: Database, title: "Tự động từ ngân hàng", text: "Hệ thống chọn câu hỏi đã duyệt theo cấu trúc và tỉ lệ mức độ. Bạn chỉnh sửa lại được." },
  { value: "manual", icon: Hand, title: "Giáo viên tự soạn", text: "Tạo đề trống rồi tự chọn từng câu trong ngân hàng hoặc thêm câu hỏi mới." },
  { value: "ai", icon: Bot, title: "AI soạn câu hỏi mới", text: "AI tạo câu hỏi mới theo nội dung bài học. Câu AI tạo ở trạng thái nháp – bạn duyệt trước khi giao." },
] as const;

export function CreateAssessmentForm({ lessons, aiConfigured }: { lessons: Lesson[]; aiConfigured: boolean }) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(45);
  const [selected, setSelected] = useState<string[]>([]);
  const [mode, setMode] = useState<"auto" | "manual" | "ai">("auto");
  const [s, setS] = useState<AssessmentStructure>(DEFAULT_STRUCTURE);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const chapters = useMemo(() => {
    const m = new Map<number, { roman: string; title: string; lessons: Lesson[] }>();
    lessons.forEach((l) => m.set(l.chapterNumber, { roman: l.chapterRoman, title: l.chapterTitle, lessons: [...(m.get(l.chapterNumber)?.lessons ?? []), l] }));
    return [...m.entries()];
  }, [lessons]);

  const available = lessons.filter((l) => selected.includes(l.id)).reduce((sum, l) => sum + l.published, 0);
  const essay = s.essay ?? { count: 0, points: 1 };
  const total = s.multiple_choice.count + s.true_false.count + s.short_answer.count + essay.count;
  const units = s.multiple_choice.count + s.true_false.count * 4 + s.short_answer.count + essay.count;
  const rawPoints = s.multiple_choice.count * s.multiple_choice.points + s.true_false.count * s.true_false.points + s.short_answer.count * s.short_answer.points + essay.count * essay.points;
  const levelSum = s.levels.biet + s.levels.hieu + s.levels.van_dung;

  const toggleLesson = (id: string) => setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  const part = (k: "multiple_choice" | "true_false" | "short_answer" | "essay", f: "count" | "points", v: number) =>
    setS({ ...s, [k]: { ...(s[k] ?? { count: 0, points: 1 }), [f]: v } });

  const submit = () =>
    start(async () => {
      setError(null);
      const r = await createAssessmentAction({ title, durationMinutes: duration, lessonIds: selected, structure: s, mode, aiNote: note });
      if (r && !r.ok) setError(r.message);
    });

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader><CardTitle>1. Thông tin đề</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[1fr_200px]">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Tên đề kiểm tra</Label>
            <Input id="title" value={title} maxLength={200} onChange={(e) => setTitle(e.target.value)} placeholder="Ví dụ: Kiểm tra giữa kì I – Chương I, II" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="duration">Thời gian làm bài (phút)</Label>
            <Input id="duration" type="number" min={5} max={180} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Phạm vi kiến thức</CardTitle>
          <CardDescription>Chọn chương hoặc từng bài. Số trong ngoặc là số câu hỏi đã duyệt trong ngân hàng.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {chapters.map(([num, ch]) => {
            const ids = ch.lessons.map((l) => l.id);
            const all = ids.every((id) => selected.includes(id));
            const theme = chapterTheme(num);
            return (
              <div key={num} className="rounded-xl border p-3">
                <button
                  type="button"
                  onClick={() => setSelected(all ? selected.filter((x) => !ids.includes(x)) : [...new Set([...selected, ...ids])])}
                  className={cn("mb-2 w-full rounded-lg bg-gradient-to-r px-3 py-1.5 text-left text-sm font-semibold text-white", theme.gradient)}
                >
                  {all ? "✓ " : ""}Chương {ch.roman}. {ch.title}
                </button>
                <div className="flex flex-col gap-1">
                  {ch.lessons.map((l) => (
                    <label key={l.id} className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-0.5 text-sm hover:bg-accent">
                      <input type="checkbox" className="size-4 accent-primary" checked={selected.includes(l.id)} onChange={() => toggleLesson(l.id)} />
                      Bài {l.number}. {l.title} <span className="text-xs text-muted-foreground">({l.published})</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Cấu trúc đề & mức độ nhận thức</CardTitle>
          <CardDescription>
            Mặc định của ứng dụng: 18 trắc nghiệm + 2 đúng – sai + 6 trả lời ngắn (26 câu, 32 đơn vị trả lời). Đây là cấu hình riêng của ứng dụng,
            không phải cấu trúc bắt buộc của Công văn 7991 – bạn được thay đổi tuỳ ý. Điểm quy về thang 10.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="py-1">Dạng câu hỏi</th>
                  <th className="py-1">Số câu</th>
                  <th className="py-1">Điểm mỗi câu</th>
                </tr>
              </thead>
              <tbody>
                {([
                  ["multiple_choice", "Trắc nghiệm 4 lựa chọn"],
                  ["true_false", "Đúng – sai (4 ý)"],
                  ["short_answer", "Trả lời ngắn"],
                  ["essay", "Tự luận (giáo viên chấm)"],
                ] as const).map(([k, label]) => (
                  <tr key={k} className="border-t">
                    <td className="py-2 font-medium">{label}</td>
                    <td className="py-2"><Input type="number" min={0} max={60} className="w-24" value={(s[k] ?? essay).count} onChange={(e) => part(k, "count", Math.max(0, Number(e.target.value)))} /></td>
                    <td className="py-2"><Input type="number" min={0.05} max={10} step={0.05} className="w-24" value={(s[k] ?? essay).points} onChange={(e) => part(k, "points", Number(e.target.value))} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground">
            Tổng: <b>{total}</b> câu · <b>{units}</b> đơn vị trả lời · điểm thô {rawPoints.toLocaleString("vi-VN")} → quy về thang 10.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {([
              ["biet", "Biết"],
              ["hieu", "Hiểu"],
              ["van_dung", "Vận dụng"],
            ] as const).map(([k, label]) => (
              <div key={k} className="flex flex-col gap-1.5">
                <Label>{label} (%)</Label>
                <Input type="number" min={0} max={100} value={s.levels[k]} onChange={(e) => setS({ ...s, levels: { ...s.levels, [k]: Number(e.target.value) } })} />
              </div>
            ))}
          </div>
          {levelSum !== 100 && <p className="text-sm text-amber-700">Tổng tỉ lệ mức độ đang là {levelSum}% (nên bằng 100%).</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>4. Cách tạo đề</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-3 md:grid-cols-3">
            {MODES.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMode(m.value)}
                  className={cn("flex flex-col gap-2 rounded-2xl border-2 p-4 text-left transition-all", mode === m.value ? "border-primary bg-orange-50 shadow-sm" : "border-border hover:border-orange-200")}
                >
                  <span className="flex items-center gap-2 font-semibold"><Icon className="size-5 text-primary" /> {m.title}</span>
                  <span className="text-sm text-muted-foreground">{m.text}</span>
                </button>
              );
            })}
          </div>
          {mode === "auto" && selected.length > 0 && available < total && (
            <Alert variant="warning"><AlertDescription><p>Phạm vi đã chọn có {available} câu đã duyệt – ít hơn {total} câu cần. Hệ thống sẽ lấy tối đa có thể; bạn có thể thêm câu hoặc dùng AI tạo thêm.</p></AlertDescription></Alert>
          )}
          {mode === "ai" && (
            aiConfigured ? (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="note">Yêu cầu thêm cho AI (tuỳ chọn)</Label>
                <textarea id="note" value={note} maxLength={1000} onChange={(e) => setNote(e.target.value)} className="min-h-20 rounded-lg border border-input bg-card px-3 py-2 text-sm" placeholder="Ví dụ: ưu tiên bài tập gắn với thực tế, số liệu đơn giản" />
                <p className="text-xs text-muted-foreground">AI chỉ dùng nội dung bài học trong hệ thống. Mỗi lần tạo tối đa 30 câu; quá trình có thể mất 1–3 phút.</p>
              </div>
            ) : (
              <Alert variant="warning">
                <Sparkles />
                <AlertTitle>Chức năng AI chưa được cấu hình</AlertTitle>
                <AlertDescription>
                  <p>Quản trị viên cần thêm biến môi trường <code>ANTHROPIC_API_KEY</code> trên Vercel (Settings → Environment Variables) rồi Redeploy. Trong lúc chờ, hãy dùng “Tự động từ ngân hàng”.</p>
                </AlertDescription>
              </Alert>
            )
          )}
        </CardContent>
      </Card>

      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
      <Button size="lg" className="self-start" disabled={pending || (mode === "ai" && !aiConfigured)} onClick={submit}>
        {pending ? <Loader2 className="animate-spin" /> : mode === "ai" ? <Bot /> : null}
        {pending ? (mode === "ai" ? "AI đang soạn câu hỏi…" : "Đang tạo đề…") : mode === "ai" ? "TẠO ĐỀ BẰNG AI" : "Tạo đề"}
      </Button>
    </div>
  );
}
