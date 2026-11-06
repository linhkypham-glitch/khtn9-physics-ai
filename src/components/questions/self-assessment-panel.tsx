"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Clock, Flag, Loader2, Play, RotateCcw, Send, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { submitSelfAssessment, type SubmitResult } from "@/modules/grading/actions";
import type { PublicQuestion, StudentAnswer } from "@/modules/question-bank/types";
import { emptyAnswer, isAnswered, QuestionBody, QuestionHeader, ResultExplanation } from "./question-view";

type Draft = { answers: Record<string, StudentAnswer>; flagged: string[]; startedAt: number };

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function readDraft(key: string): Draft | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
}
function writeDraft(key: string, d: Draft | null) {
  try {
    if (d) window.localStorage.setItem(key, JSON.stringify(d));
    else window.localStorage.removeItem(key);
  } catch {
    /* bộ nhớ trình duyệt không khả dụng – vẫn làm bài bình thường */
  }
}

/** Tự đánh giá: làm toàn bộ bài, tự lưu nháp, nộp để chấm điểm và xem giải thích. */
export function SelfAssessmentPanel({ lessonId, questions, canSave }: { lessonId: string; questions: PublicQuestion[]; canSave: boolean }) {
  const storageKey = `khtn9:self-assessment:${lessonId}`;
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [current, setCurrent] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [result, setResult] = useState<(Extract<SubmitResult, { ok: true }> & { durationSeconds: number }) | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  useEffect(() => {
    if (!draft || result) return;
    writeDraft(storageKey, draft);
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [draft, result, storageKey]);

  const answered = useMemo(() => questions.filter((q) => isAnswered(draft?.answers[q.id])).length, [questions, draft]);

  const begin = () => {
    // Khôi phục bài đang làm dở (ví dụ sau khi tải lại trang hoặc mất kết nối)
    const saved = result ? null : readDraft(storageKey);
    if (saved && window.confirm("Em có bài làm dở. Tiếp tục làm bài đó?")) {
      setDraft(saved);
      setCurrent(0);
      setNow(Date.now());
      return;
    }
    const d: Draft = { answers: Object.fromEntries(questions.map((q) => [q.id, emptyAnswer(q)])), flagged: [], startedAt: Date.now() };
    setDraft(d);
    setCurrent(0);
    setResult(null);
    setNow(Date.now());
  };

  const submit = () => {
    if (!draft) return;
    const blank = questions.length - answered;
    if (!window.confirm(blank > 0 ? `Còn ${blank} câu chưa trả lời. Em vẫn muốn nộp bài?` : "Nộp bài và xem kết quả?")) return;
    start(async () => {
      setError(null);
      const durationSeconds = Math.round((Date.now() - draft.startedAt) / 1000);
      const r = await submitSelfAssessment(lessonId, draft.answers, durationSeconds);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      setResult({ ...r, durationSeconds });
      writeDraft(storageKey, null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      router.refresh();
    });
  };

  if (!draft) {
    return (
      <Card className="items-center gap-4 bg-gradient-to-br from-orange-50 to-amber-50 py-10 text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/30">
          <Trophy className="size-8" />
        </span>
        <div>
          <p className="text-lg font-bold">Bài tự đánh giá</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {questions.length} câu · chấm điểm tự động thang 10 · có giải thích sau khi nộp bài
          </p>
          {!canSave && <p className="mt-1 text-xs text-muted-foreground">(Xem trước – kết quả không được lưu)</p>}
        </div>
        <Button size="lg" onClick={begin}><Play /> Bắt đầu làm bài</Button>
        <p className="text-xs text-muted-foreground">Bài làm dở được lưu trên thiết bị – bấm Bắt đầu để tiếp tục.</p>
      </Card>
    );
  }

  if (result) {
    const s = result.summary;
    const duration = result.durationSeconds;
    return (
      <div className="flex flex-col gap-4">
        <Card className="overflow-hidden py-0">
          <div className="flex flex-col items-center gap-1 bg-gradient-to-r from-orange-600 to-amber-500 px-6 py-6 text-white">
            <p className="text-sm text-orange-50">Điểm của em</p>
            <p className="text-5xl font-bold tabular-nums">{s.score10.toLocaleString("vi-VN")}</p>
            <p className="text-sm text-orange-50">/ 10 điểm</p>
          </div>
          <CardContent className="grid grid-cols-2 gap-3 py-4 text-center sm:grid-cols-5">
            {[
              ["Đúng", s.correct, "text-green-600"],
              ["Đúng một phần", s.partial, "text-amber-600"],
              ["Sai", s.wrong, "text-red-600"],
              ["Bỏ trống", s.blank, "text-slate-500"],
              ["Thời gian", formatDuration(duration), "text-foreground"],
            ].map(([label, value, cls]) => (
              <div key={String(label)} className="rounded-xl bg-muted px-2 py-2">
                <p className={cn("text-xl font-bold tabular-nums", String(cls))}>{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <p className="text-sm text-muted-foreground">
          {result.saved ? "✅ Kết quả đã được lưu vào mục Kết quả học tập." : "Kết quả chưa được lưu (chế độ xem trước)."}
        </p>
        {questions.map((q, i) => {
          const r = result.results.find((x) => x.questionId === q.id)!;
          return (
            <Card key={q.id} className="gap-4">
              <CardContent className="flex flex-col gap-4">
                <QuestionHeader q={q} index={i + 1} />
                <QuestionBody q={q} value={draft.answers[q.id] ?? emptyAnswer(q)} onChange={() => {}} result={r} />
                <ResultExplanation result={r} />
              </CardContent>
            </Card>
          );
        })}
        <Button onClick={begin} className="self-start"><RotateCcw /> Làm lại bài</Button>
      </div>
    );
  }

  const q = questions[current];
  const flagged = new Set(draft.flagged);
  const elapsed = Math.max(0, Math.round((now - draft.startedAt) / 1000));

  return (
    <div className="flex flex-col gap-4">
      <Card className="gap-3 py-4">
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="font-medium">Đã trả lời {answered}/{questions.length} câu</span>
            <span className="flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 font-mono tabular-nums"><Clock className="size-4" /> {formatDuration(elapsed)}</span>
          </div>
          <Progress value={(answered / questions.length) * 100} />
          <div className="flex flex-wrap gap-1.5" aria-label="Danh sách câu hỏi">
            {questions.map((qq, i) => (
              <button
                key={qq.id}
                type="button"
                onClick={() => setCurrent(i)}
                className={cn(
                  "relative flex size-9 items-center justify-center rounded-lg border-2 text-sm font-semibold transition-colors",
                  i === current ? "border-primary bg-primary text-white" : isAnswered(draft.answers[qq.id]) ? "border-orange-300 bg-orange-100 text-orange-800" : "border-slate-200 bg-white",
                )}
                aria-label={`Câu ${i + 1}${flagged.has(qq.id) ? " (cần xem lại)" : ""}`}
              >
                {i + 1}
                {flagged.has(qq.id) && <Flag className="absolute -top-1.5 -right-1.5 size-3.5 fill-red-500 text-red-500" />}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="gap-4">
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <QuestionHeader q={q} index={current + 1} />
            <Button
              size="sm"
              variant={flagged.has(q.id) ? "destructive" : "outline"}
              onClick={() =>
                setDraft({ ...draft, flagged: flagged.has(q.id) ? draft.flagged.filter((x) => x !== q.id) : [...draft.flagged, q.id] })
              }
            >
              <Flag /> {flagged.has(q.id) ? "Bỏ đánh dấu" : "Xem lại sau"}
            </Button>
          </div>
          <QuestionBody
            q={q}
            value={draft.answers[q.id] ?? emptyAnswer(q)}
            onChange={(a) => setDraft({ ...draft, answers: { ...draft.answers, [q.id]: a } })}
          />
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex flex-wrap justify-between gap-2">
        <div className="flex gap-2">
          <Button variant="outline" disabled={current === 0} onClick={() => setCurrent(current - 1)}><ChevronLeft /> Câu trước</Button>
          <Button variant="outline" disabled={current === questions.length - 1} onClick={() => setCurrent(current + 1)}>Câu sau <ChevronRight /></Button>
        </div>
        <Button onClick={submit} disabled={pending} className="bg-gradient-to-r from-orange-600 to-amber-500">
          {pending ? <Loader2 className="animate-spin" /> : <Send />} Nộp bài
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">Bài làm được tự động lưu trên thiết bị – tải lại trang vẫn tiếp tục làm được.</p>
    </div>
  );
}
