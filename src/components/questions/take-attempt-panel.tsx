"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Clock, CloudOff, Flag, Loader2, Save, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { saveAttemptAction } from "@/modules/assessments/student-actions";
import type { PublicQuestion, StudentAnswer } from "@/modules/question-bank/types";
import { emptyAnswer, isAnswered, QuestionBody, QuestionHeader } from "./question-view";

function fmtClock(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h ? `${h}:` : ""}${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function readLocal(key: string): Record<string, StudentAnswer> | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function writeLocal(key: string, v: Record<string, StudentAnswer> | null) {
  try {
    if (v) window.localStorage.setItem(key, JSON.stringify(v));
    else window.localStorage.removeItem(key);
  } catch {
    /* bộ nhớ trình duyệt không khả dụng */
  }
}

/** Giao diện làm bài kiểm tra được giao. */
export function TakeAttemptPanel({
  attemptId,
  title,
  deadlineAt,
  questions,
  initialAnswers,
}: {
  attemptId: string;
  title: string;
  deadlineAt: string;
  questions: PublicQuestion[];
  initialAnswers: Record<string, StudentAnswer>;
}) {
  const router = useRouter();
  const storageKey = `khtn9:attempt:${attemptId}`;
  const [answers, setAnswers] = useState<Record<string, StudentAnswer>>(() => ({
    ...Object.fromEntries(questions.map((q) => [q.id, emptyAnswer(q)])),
    ...initialAnswers,
  }));
  const [flags, setFlags] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [status, setStatus] = useState<{ kind: "saved" | "saving" | "offline" | "error"; text: string } | null>(null);
  const [pending, start] = useTransition();
  const dirty = useRef(false);
  const submitted = useRef(false);
  const deadline = new Date(deadlineAt).getTime();
  const remaining = deadline - now;

  const answered = useMemo(() => questions.filter((q) => isAnswered(answers[q.id])).length, [questions, answers]);

  const sync = useCallback(
    async (submit: boolean) => {
      if (submitted.current) return;
      setStatus({ kind: "saving", text: submit ? "Đang nộp bài…" : "Đang lưu…" });
      const r = await saveAttemptAction(attemptId, answers, submit).catch(() => null);
      if (!r) {
        setStatus({ kind: "offline", text: "Mất kết nối – bài làm đang được lưu tạm trên máy, sẽ gửi lại khi có mạng." });
        return;
      }
      if (!r.ok) {
        setStatus({ kind: "error", text: r.message });
        return;
      }
      dirty.current = false;
      if (r.submitted) {
        submitted.current = true;
        writeLocal(storageKey, null);
        router.refresh();
        return;
      }
      setStatus({ kind: "saved", text: `Đã lưu lúc ${new Date().toLocaleTimeString("vi-VN")}` });
    },
    [answers, attemptId, router, storageKey],
  );

  // Khôi phục bản lưu tạm trên máy (nếu mất mạng trước khi kịp gửi lên máy chủ)
  const restored = useRef(false);
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const local = readLocal(storageKey);
    if (local) {
      const t = window.setTimeout(() => {
        setAnswers((a) => ({ ...a, ...local }));
        dirty.current = true;
      }, 0);
      return () => window.clearTimeout(t);
    }
  }, [storageKey]);

  // Đồng hồ + tự lưu mỗi 15 giây + tự nộp khi hết giờ
  const syncRef = useRef(sync);
  useEffect(() => {
    syncRef.current = sync;
  });
  useEffect(() => {
    let tick = 0;
    const t = window.setInterval(() => {
      setNow(Date.now());
      tick++;
      if (Date.now() >= deadline && !submitted.current) {
        syncRef.current(true);
        return;
      }
      if (tick % 15 === 0 && dirty.current) syncRef.current(false);
    }, 1000);
    const onOnline = () => dirty.current && syncRef.current(false);
    window.addEventListener("online", onOnline);
    return () => {
      window.clearInterval(t);
      window.removeEventListener("online", onOnline);
    };
  }, [deadline]);

  const update = (qid: string, a: StudentAnswer) => {
    const next = { ...answers, [qid]: a };
    setAnswers(next);
    writeLocal(storageKey, next);
    dirty.current = true;
  };

  const q = questions[current];
  const lowTime = remaining < 5 * 60 * 1000;

  return (
    <div className="flex flex-col gap-4">
      <Card className="sticky top-16 z-20 gap-2 border-orange-200 py-3 shadow-md">
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold">{title}</p>
            <span className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1 font-mono text-lg font-bold tabular-nums", lowTime ? "animate-pulse bg-red-100 text-red-700" : "bg-orange-100 text-orange-800")}>
              <Clock className="size-5" /> {fmtClock(remaining)}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span>Đã trả lời <b>{answered}/{questions.length}</b></span>
            <Progress value={(answered / questions.length) * 100} className="flex-1" />
          </div>
          <div className="flex flex-wrap gap-1.5" aria-label="Danh sách câu hỏi">
            {questions.map((qq, i) => (
              <button
                key={qq.id}
                type="button"
                onClick={() => setCurrent(i)}
                className={cn(
                  "relative flex size-8 items-center justify-center rounded-lg border-2 text-xs font-semibold",
                  i === current ? "border-primary bg-primary text-white" : isAnswered(answers[qq.id]) ? "border-orange-300 bg-orange-100 text-orange-800" : "border-slate-200 bg-white",
                )}
                aria-label={`Câu ${i + 1}${flags.includes(qq.id) ? " (cần xem lại)" : ""}`}
              >
                {i + 1}
                {flags.includes(qq.id) && <Flag className="absolute -top-1.5 -right-1.5 size-3.5 fill-red-500 text-red-500" />}
              </button>
            ))}
          </div>
          {status && (
            <p className={cn("flex items-center gap-1.5 text-xs", status.kind === "offline" || status.kind === "error" ? "text-red-600" : "text-muted-foreground")}>
              {status.kind === "offline" && <CloudOff className="size-3.5" />}
              {status.kind === "saving" && <Loader2 className="size-3.5 animate-spin" />}
              {status.text}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="gap-4">
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <QuestionHeader q={q} index={current + 1} />
            <Button size="sm" variant={flags.includes(q.id) ? "destructive" : "outline"} onClick={() => setFlags(flags.includes(q.id) ? flags.filter((x) => x !== q.id) : [...flags, q.id])}>
              <Flag /> {flags.includes(q.id) ? "Bỏ đánh dấu" : "Xem lại sau"}
            </Button>
          </div>
          <QuestionBody q={q} value={answers[q.id] ?? emptyAnswer(q)} onChange={(a) => update(q.id, a)} />
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-between gap-2">
        <div className="flex gap-2">
          <Button variant="outline" disabled={current === 0} onClick={() => setCurrent(current - 1)}><ChevronLeft /> Câu trước</Button>
          <Button variant="outline" disabled={current === questions.length - 1} onClick={() => setCurrent(current + 1)}>Câu sau <ChevronRight /></Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={pending} onClick={() => start(() => sync(false))}><Save /> Lưu bài</Button>
          <Button
            className="bg-gradient-to-r from-orange-600 to-amber-500"
            disabled={pending}
            onClick={() => {
              const blank = questions.length - answered;
              const flagged = flags.length;
              const msg = [blank ? `Còn ${blank} câu chưa trả lời.` : "", flagged ? `${flagged} câu đánh dấu xem lại.` : "", "Nộp bài? Sau khi nộp không sửa được."].filter(Boolean).join(" ");
              if (window.confirm(msg)) start(() => sync(true));
            }}
          >
            {pending ? <Loader2 className="animate-spin" /> : <Send />} Nộp bài
          </Button>
        </div>
      </div>
    </div>
  );
}
