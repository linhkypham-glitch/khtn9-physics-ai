import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ErrorState } from "@/components/dashboard/states";
import { QuestionBody, QuestionHeader, ResultExplanation } from "@/components/questions/question-view";
import { TakeAttemptPanel } from "@/components/questions/take-attempt-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import { getAttemptView, StudentError } from "@/modules/assessments/student";
import { emptyAnswerServer } from "@/modules/question-bank/empty-answer";

export const metadata: Metadata = { title: "Làm bài kiểm tra" };

export default async function Page({ params }: PageProps<"/student/attempts/[id]">) {
  const user = await requireRole(["student"]);
  const { id } = await params;
  let view;
  try {
    view = await getAttemptView(id, user.id);
  } catch (e) {
    if (e instanceof StudentError) return <ErrorState title="Không mở được bài làm" description={e.message} />;
    throw e;
  }
  if (!view) notFound();

  if (view.mode === "taking") {
    return <TakeAttemptPanel attemptId={view.attemptId} title={view.title} deadlineAt={view.deadlineAt} questions={view.questions} initialAnswers={view.answers} />;
  }

  const duration = view.submittedAt ? Math.round((new Date(view.submittedAt).getTime() - new Date(view.startedAt).getTime()) / 1000) : null;
  const s = view.summary;
  return (
    <div className="flex flex-col gap-4">
      <Card className="overflow-hidden py-0">
        <div className="flex flex-col items-center gap-1 bg-gradient-to-r from-orange-600 to-amber-500 px-6 py-6 text-white">
          <p className="text-sm text-orange-50">{view.title}</p>
          <p className="text-5xl font-bold tabular-nums">{view.score === null ? "—" : view.score.toLocaleString("vi-VN")}</p>
          <p className="text-sm text-orange-50">/ 10 điểm</p>
        </div>
        <CardContent className="grid grid-cols-2 gap-3 py-4 text-center sm:grid-cols-5">
          {[
            ["Đúng", s?.correct ?? "—", "text-green-600"],
            ["Đúng một phần", s?.partial ?? "—", "text-amber-600"],
            ["Sai", s?.wrong ?? "—", "text-red-600"],
            ["Bỏ trống", s?.blank ?? "—", "text-slate-500"],
            ["Thời gian", duration === null ? "—" : `${Math.floor(duration / 60)}′${String(duration % 60).padStart(2, "0")}″`, "text-foreground"],
          ].map(([l, v, c]) => (
            <div key={String(l)} className="rounded-xl bg-muted px-2 py-2"><p className={cn("text-xl font-bold tabular-nums", String(c))}>{v}</p><p className="text-xs text-muted-foreground">{l}</p></div>
          ))}
        </CardContent>
      </Card>
      {view.revealNote && <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">{view.revealNote}</p>}
      {view.reveal &&
        view.questions.map((q, i) => {
          const r = view.results.find((x) => x.questionId === q.id)!;
          return (
            <Card key={q.id} className="gap-4">
              <CardContent className="flex flex-col gap-4">
                <QuestionHeader q={q} index={i + 1} />
                <QuestionBody q={q} value={view.answers[q.id] ?? emptyAnswerServer(q)} result={r} />
                <ResultExplanation result={r} />
              </CardContent>
            </Card>
          );
        })}
      <Button asChild variant="outline" className="self-start"><Link href="/student/assignments">← Bài được giao</Link></Button>
    </div>
  );
}
