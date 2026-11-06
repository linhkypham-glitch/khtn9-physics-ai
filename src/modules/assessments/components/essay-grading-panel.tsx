"use client";

import { useState, useTransition } from "react";
import { Bot, CheckCircle2, Loader2, Save } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { EssayItem } from "../essay-grading";
import { gradeEssayAction, suggestEssayAction } from "../grading-actions";

function EssayCard({ assignmentId, item, aiConfigured }: { assignmentId: string; item: EssayItem; aiConfigured: boolean }) {
  const [score, setScore] = useState(item.grade ? String(item.grade.score) : "");
  const [feedback, setFeedback] = useState(item.grade?.feedback ?? "");
  const [ai, setAi] = useState<{ score: number; reasoning: string } | null>(null);
  const [aiScore, setAiScore] = useState<number | null>(item.grade?.aiSuggested ?? null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const graded = Boolean(item.grade) || msg?.ok;
  return (
    <Card className="gap-3 py-4">
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <b>{item.studentName}</b>
          {graded ? <Badge variant="teal"><CheckCircle2 /> Đã chấm</Badge> : <Badge variant="amber">Chờ chấm</Badge>}
          <span className="ml-auto text-sm text-muted-foreground">Tối đa {item.maxPoints.toLocaleString("vi-VN")} điểm</span>
        </div>
        <p className="text-sm font-medium">{item.question}</p>
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-xl border bg-white px-3 py-2">
            <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Bài làm của học sinh</p>
            <p className="whitespace-pre-line text-sm">{item.answer || <i className="text-muted-foreground">(bỏ trống)</i>}</p>
          </div>
          <div className="rounded-xl bg-orange-50 px-3 py-2 text-sm">
            <p className="mb-1 text-xs font-semibold uppercase text-orange-800">Hướng dẫn chấm</p>
            <p className="whitespace-pre-line">{item.rubric}</p>
            <p className="mt-2 mb-1 text-xs font-semibold uppercase text-orange-800">Đáp án mẫu</p>
            <p className="whitespace-pre-line">{item.sample}</p>
          </div>
        </div>
        {ai && (
          <div className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm text-violet-950">
            <p><b>AI gợi ý: {ai.score.toLocaleString("vi-VN")} điểm</b> (chỉ tham khảo – điểm chính thức do giáo viên quyết định)</p>
            <p className="mt-1 whitespace-pre-line">{ai.reasoning}</p>
          </div>
        )}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="flex flex-col gap-1 text-sm">
            Điểm
            <Input className="w-24" inputMode="decimal" value={score} onChange={(e) => setScore(e.target.value)} aria-label={`Điểm tự luận của ${item.studentName}`} />
          </label>
          <label className="flex flex-1 flex-col gap-1 text-sm">
            Nhận xét cho học sinh
            <Input value={feedback} maxLength={3000} onChange={(e) => setFeedback(e.target.value)} />
          </label>
          <div className="flex gap-2">
            {aiConfigured && (
              <Button
                variant="outline"
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    const r = await suggestEssayAction(assignmentId, item.attemptId, item.questionId);
                    if (!r.ok) setMsg({ ok: false, text: r.error });
                    else {
                      setAi({ score: r.score, reasoning: r.reasoning });
                      setAiScore(r.score);
                      if (!score) setScore(String(r.score));
                      if (!feedback) setFeedback(r.feedback_for_student);
                    }
                  })
                }
              >
                <Bot /> AI gợi ý
              </Button>
            )}
            <Button
              disabled={pending || score.trim() === ""}
              onClick={() =>
                start(async () => {
                  const r = await gradeEssayAction(assignmentId, item.attemptId, item.questionId, Number(score.replace(",", ".")), feedback, aiScore);
                  setMsg({ ok: r.ok, text: r.message });
                })
              }
            >
              {pending ? <Loader2 className="animate-spin" /> : <Save />} Lưu điểm
            </Button>
          </div>
        </div>
        {msg && <p className={msg.ok ? "text-sm text-success" : "text-sm text-destructive"}>{msg.text}</p>}
      </CardContent>
    </Card>
  );
}

export function EssayGradingPanel({ assignmentId, items, aiConfigured }: { assignmentId: string; items: EssayItem[]; aiConfigured: boolean }) {
  const [onlyPending, setOnlyPending] = useState(true);
  const shown = onlyPending ? items.filter((i) => !i.grade) : items;
  return (
    <div className="flex flex-col gap-3">
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" className="size-4 accent-primary" checked={onlyPending} onChange={(e) => setOnlyPending(e.target.checked)} /> Chỉ hiện bài chưa chấm
      </label>
      {shown.length === 0 ? <p className="text-sm text-muted-foreground">Không còn bài tự luận cần chấm.</p> : shown.map((i) => <EssayCard key={`${i.attemptId}-${i.questionId}`} assignmentId={assignmentId} item={i} aiConfigured={aiConfigured} />)}
    </div>
  );
}
