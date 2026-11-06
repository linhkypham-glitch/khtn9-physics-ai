"use client";

import { Check, CircleCheck, CircleX, Lightbulb, Sigma, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LEVEL_LABELS, TYPE_LABELS, type PublicQuestion, type QuestionResult, type StudentAnswer } from "@/modules/question-bank/types";

export function emptyAnswer(q: PublicQuestion): StudentAnswer {
  if (q.type === "multiple_choice") return { type: "multiple_choice", choice: null };
  if (q.type === "true_false") return { type: "true_false", items: Object.fromEntries(q.subitems.map((s) => [s.label, null])) };
  return { type: "short_answer", text: "" };
}

export function isAnswered(a: StudentAnswer | undefined): boolean {
  if (!a) return false;
  if (a.type === "multiple_choice") return a.choice !== null;
  if (a.type === "true_false") return Object.values(a.items).some((v) => v !== null);
  return a.text.trim().length > 0;
}

const LEVEL_VARIANT = { biet: "teal", hieu: "amber", van_dung: "violet" } as const;

export function QuestionHeader({ q, index }: { q: PublicQuestion; index: number }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-lg bg-primary px-2.5 py-1 text-sm font-bold text-primary-foreground">Câu {index}</span>
      <Badge variant="secondary">{TYPE_LABELS[q.type]}</Badge>
      <Badge variant={LEVEL_VARIANT[q.level]}>{LEVEL_LABELS[q.level]}</Badge>
    </div>
  );
}

/** Hiển thị câu hỏi + vùng trả lời; khi có `result` thì tô màu đúng/sai. */
export function QuestionBody({
  q,
  value,
  onChange,
  result,
}: {
  q: PublicQuestion;
  value: StudentAnswer;
  onChange?: (a: StudentAnswer) => void;
  result?: QuestionResult | null;
}) {
  const locked = Boolean(result);
  return (
    <div className="flex flex-col gap-4">
      <p className="whitespace-pre-line text-[15px] leading-relaxed font-medium">{q.content}</p>

      {q.type === "multiple_choice" && value.type === "multiple_choice" && (
        <div className="grid gap-2 sm:grid-cols-2" role="radiogroup">
          {q.options.map((o) => {
            const chosen = value.choice === o.label;
            const isCorrect = result?.correctAnswer === o.label;
            return (
              <button
                key={o.label}
                type="button"
                role="radio"
                aria-checked={chosen}
                disabled={locked}
                onClick={() => onChange?.({ type: "multiple_choice", choice: o.label })}
                className={cn(
                  "flex items-start gap-3 rounded-xl border-2 bg-card px-3 py-2.5 text-left text-sm transition-all",
                  !locked && "hover:border-orange-300 hover:bg-orange-50",
                  chosen && !locked && "border-primary bg-orange-50 shadow-sm",
                  locked && isCorrect && "border-green-500 bg-green-50",
                  locked && chosen && !isCorrect && "border-red-400 bg-red-50",
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold",
                    chosen ? "border-primary bg-primary text-white" : "border-slate-300 text-slate-600",
                    locked && isCorrect && "border-green-600 bg-green-600 text-white",
                    locked && chosen && !isCorrect && "border-red-500 bg-red-500 text-white",
                  )}
                >
                  {o.label}
                </span>
                <span className="pt-0.5">{o.content}</span>
              </button>
            );
          })}
        </div>
      )}

      {q.type === "true_false" && value.type === "true_false" && (
        <div className="overflow-hidden rounded-xl border">
          {q.subitems.map((s, i) => {
            const v = value.items[s.label] ?? null;
            const item = result?.items?.find((x) => x.label === s.label);
            return (
              <div key={s.label} className={cn("flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-center", i > 0 && "border-t", item && (item.correct ? "bg-green-50" : "bg-red-50/70"))}>
                <p className="flex-1 text-sm">
                  <b>{s.label})</b> {s.content}
                  {item && (
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {item.correct ? <CircleCheck className="mr-1 inline size-3.5 text-green-600" /> : <CircleX className="mr-1 inline size-3.5 text-red-500" />}
                      Đáp án: <b>{item.isTrue ? "Đúng" : "Sai"}</b>. {item.explanation}
                    </span>
                  )}
                </p>
                <div className="flex shrink-0 gap-1.5">
                  {[true, false].map((opt) => (
                    <button
                      key={String(opt)}
                      type="button"
                      disabled={locked}
                      aria-pressed={v === opt}
                      onClick={() => onChange?.({ type: "true_false", items: { ...value.items, [s.label]: v === opt ? null : opt } })}
                      className={cn(
                        "flex items-center gap-1 rounded-lg border-2 px-3 py-1.5 text-xs font-semibold transition-colors",
                        v === opt
                          ? opt
                            ? "border-green-600 bg-green-600 text-white"
                            : "border-red-500 bg-red-500 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                      )}
                    >
                      {opt ? <Check className="size-3.5" /> : <X className="size-3.5" />} {opt ? "Đúng" : "Sai"}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {q.type === "short_answer" && value.type === "short_answer" && (
        <div className="flex items-center gap-2">
          <Input
            value={value.text}
            disabled={locked}
            inputMode="decimal"
            maxLength={60}
            onChange={(e) => onChange?.({ type: "short_answer", text: e.target.value })}
            placeholder="Nhập đáp số (dùng dấu phẩy cho số thập phân)"
            className={cn("h-11 max-w-xs text-base", result && (result.status === "correct" ? "border-green-500 bg-green-50" : "border-red-400 bg-red-50"))}
            aria-label="Đáp số"
          />
          {q.unit && <span className="text-sm font-medium text-muted-foreground">{q.unit}</span>}
        </div>
      )}
    </div>
  );
}

const STATUS = {
  correct: { label: "Đúng", cls: "border-green-200 bg-green-50 text-green-800", icon: CircleCheck },
  partial: { label: "Đúng một phần", cls: "border-amber-200 bg-amber-50 text-amber-900", icon: CircleCheck },
  wrong: { label: "Sai", cls: "border-red-200 bg-red-50 text-red-800", icon: CircleX },
  blank: { label: "Chưa trả lời", cls: "border-slate-200 bg-slate-50 text-slate-700", icon: CircleX },
} as const;

/** Khối giải thích sau mỗi câu: kết quả, đáp án đúng, lời giải, công thức, kiến thức cần nhớ. */
export function ResultExplanation({ result }: { result: QuestionResult }) {
  const st = STATUS[result.status];
  const Icon = st.icon;
  return (
    <div className={cn("flex flex-col gap-3 rounded-xl border px-4 py-3 text-sm", st.cls)}>
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-semibold">
        <span className="flex items-center gap-1.5"><Icon className="size-4" /> {st.label}</span>
        <span className="font-normal">
          Đáp án đúng: <b>{result.correctAnswer}</b>
        </span>
        {result.studentAnswer && result.items === undefined && (
          <span className="font-normal">Em chọn: <b>{result.studentAnswer}</b></span>
        )}
        <span className="ml-auto font-normal tabular-nums">+{result.earned.toLocaleString("vi-VN")} / {result.max.toLocaleString("vi-VN")} điểm</span>
      </p>
      <div className="rounded-lg bg-white/70 px-3 py-2 text-foreground">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Giải thích</p>
        <p className="whitespace-pre-line leading-relaxed">{result.explanation}</p>
      </div>
      {result.formula && (
        <p className="flex items-start gap-2 rounded-lg bg-orange-100/70 px-3 py-2 font-mono text-orange-900">
          <Sigma className="mt-0.5 size-4 shrink-0" /> {result.formula}
        </p>
      )}
      {result.remember && (
        <p className="flex items-start gap-2 rounded-lg bg-yellow-100/70 px-3 py-2 text-yellow-900">
          <Lightbulb className="mt-0.5 size-4 shrink-0" /> <span><b>Ghi nhớ:</b> {result.remember}</span>
        </p>
      )}
    </div>
  );
}
