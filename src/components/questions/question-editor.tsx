"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Save, Trash2, X } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { deleteQuestionAction, saveQuestionAction } from "@/modules/question-bank/actions";
import type { QuestionInput } from "@/modules/question-bank/input-schema";
import { LEVEL_LABELS, TYPE_LABELS } from "@/modules/question-bank/types";

const TEXTAREA = "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30";

function Choice<T extends string>({ value, options, onChange }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn("rounded-full border px-3 py-1 text-sm", value === o.value ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-accent")}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function QuestionEditor({
  initial,
  lessons,
  returnTo,
}: {
  initial: QuestionInput;
  lessons: { id: string; number: number; title: string }[];
  returnTo: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState<QuestionInput>(initial);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const set = <K extends keyof QuestionInput>(k: K, v: QuestionInput[K]) => setQ({ ...q, [k]: v });

  const save = () =>
    start(async () => {
      const r = await saveQuestionAction(q);
      setMsg({ ok: r.ok, text: r.message });
      if (r.ok) {
        router.push(returnTo);
        router.refresh();
      }
    });

  return (
    <Card>
      <CardContent className="flex flex-col gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lesson">Bài học</Label>
            <select id="lesson" className="h-10 rounded-lg border border-input bg-card px-3 text-sm" value={q.lessonId} onChange={(e) => set("lessonId", e.target.value)}>
              {lessons.map((l) => (
                <option key={l.id} value={l.id}>Bài {l.number}. {l.title}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Mức độ nhận thức</Label>
            <Choice value={q.level} options={(Object.keys(LEVEL_LABELS) as (keyof typeof LEVEL_LABELS)[]).map((k) => ({ value: k, label: LEVEL_LABELS[k] }))} onChange={(v) => set("level", v)} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Dạng câu hỏi</Label>
          <Choice
            value={q.type}
            options={(["multiple_choice", "true_false", "short_answer"] as const).map((k) => ({ value: k, label: TYPE_LABELS[k] }))}
            onChange={(v) => set("type", v)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="content">{q.type === "true_false" ? "Tình huống / đề dẫn" : "Nội dung câu hỏi"}</Label>
          <textarea id="content" className={cn(TEXTAREA, "min-h-24")} value={q.content} onChange={(e) => set("content", e.target.value)} maxLength={2000} />
        </div>

        {q.type === "multiple_choice" && (
          <div className="flex flex-col gap-2">
            <Label>Phương án (bấm chữ cái để chọn đáp án đúng)</Label>
            {q.options.map((o, i) => {
              const label = "ABCD"[i] as "A" | "B" | "C" | "D";
              return (
                <div key={label} className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={`Chọn ${label} là đáp án đúng`}
                    onClick={() => set("correct", label)}
                    className={cn("flex size-9 shrink-0 items-center justify-center rounded-full border-2 font-bold", q.correct === label ? "border-green-600 bg-green-600 text-white" : "border-slate-300")}
                  >
                    {label}
                  </button>
                  <Input value={o} maxLength={500} onChange={(e) => set("options", q.options.map((x, j) => (j === i ? e.target.value : x)))} placeholder={`Phương án ${label}`} />
                </div>
              );
            })}
          </div>
        )}

        {q.type === "true_false" && (
          <div className="flex flex-col gap-3">
            <Label>4 ý a, b, c, d</Label>
            {q.items.map((it, i) => (
              <div key={i} className="grid gap-2 rounded-xl border p-3 md:grid-cols-[auto_1fr]">
                <span className="font-bold">{"abcd"[i]})</span>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input value={it.content} maxLength={500} placeholder="Nội dung ý" onChange={(e) => set("items", q.items.map((x, j) => (j === i ? { ...x, content: e.target.value } : x)))} />
                    <div className="flex shrink-0 gap-1">
                      {[true, false].map((v) => (
                        <button key={String(v)} type="button" onClick={() => set("items", q.items.map((x, j) => (j === i ? { ...x, isTrue: v } : x)))} className={cn("flex items-center gap-1 rounded-lg border-2 px-3 py-1.5 text-xs font-semibold", it.isTrue === v ? (v ? "border-green-600 bg-green-600 text-white" : "border-red-500 bg-red-500 text-white") : "border-slate-200")}>
                          {v ? <Check className="size-3.5" /> : <X className="size-3.5" />} {v ? "Đúng" : "Sai"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Input value={it.explanation} maxLength={1000} placeholder="Giải thích cho ý này" onChange={(e) => set("items", q.items.map((x, j) => (j === i ? { ...x, explanation: e.target.value } : x)))} />
                </div>
              </div>
            ))}
          </div>
        )}

        {q.type === "short_answer" && (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ans">Đáp số</Label>
              <Input id="ans" inputMode="decimal" defaultValue={q.answerNumber ?? ""} onChange={(e) => set("answerNumber", e.target.value.trim() === "" ? null : Number(e.target.value.replace(",", ".")))} placeholder="ví dụ 0,5" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tol">Sai số cho phép (±)</Label>
              <Input id="tol" inputMode="decimal" defaultValue={q.tolerance} onChange={(e) => set("tolerance", Number(e.target.value.replace(",", ".")) || 0)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="unit">Đơn vị</Label>
              <Input id="unit" value={q.unit ?? ""} maxLength={30} onChange={(e) => set("unit", e.target.value || null)} placeholder="ví dụ A, Ω, J" />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="exp">Lời giải / giải thích</Label>
          <textarea id="exp" className={cn(TEXTAREA, "min-h-24")} value={q.explanation} maxLength={3000} onChange={(e) => set("explanation", e.target.value)} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="formula">Công thức liên quan (tuỳ chọn)</Label>
            <Input id="formula" value={q.formula ?? ""} maxLength={500} onChange={(e) => set("formula", e.target.value || null)} placeholder="ví dụ I = U/R" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="remember">Kiến thức cần ghi nhớ (tuỳ chọn)</Label>
            <Input id="remember" value={q.remember ?? ""} maxLength={1000} onChange={(e) => set("remember", e.target.value || null)} />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="size-4 accent-primary" checked={q.publish} onChange={(e) => set("publish", e.target.checked)} />
          Duyệt và xuất bản (học sinh thấy trong Luyện tập / Tự đánh giá, dùng được trong đề kiểm tra)
        </label>

        {msg && (
          <Alert variant={msg.ok ? "success" : "destructive"}>
            <AlertDescription>{msg.text}</AlertDescription>
          </Alert>
        )}
        <div className="flex flex-wrap justify-between gap-2">
          <Button onClick={save} disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : <Save />} Lưu câu hỏi
          </Button>
          {q.id && (
            <Button
              variant="outline"
              className="text-destructive"
              disabled={pending}
              onClick={() => {
                if (!window.confirm("Xoá câu hỏi này?")) return;
                start(async () => {
                  const r = await deleteQuestionAction(q.id!);
                  setMsg({ ok: r.ok, text: r.message });
                  if (r.ok) {
                    router.push(returnTo);
                    router.refresh();
                  }
                });
              }}
            >
              <Trash2 /> Xoá
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
