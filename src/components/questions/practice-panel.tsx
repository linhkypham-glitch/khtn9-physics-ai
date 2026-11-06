"use client";

import { useState, useTransition } from "react";
import { Loader2, RotateCcw, SearchCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { checkPracticeAnswer } from "@/modules/grading/actions";
import type { PublicQuestion, QuestionResult, StudentAnswer } from "@/modules/question-bank/types";
import { emptyAnswer, isAnswered, QuestionBody, QuestionHeader, ResultExplanation } from "./question-view";

function PracticeItem({ lessonId, q, index }: { lessonId: string; q: PublicQuestion; index: number }) {
  const [answer, setAnswer] = useState<StudentAnswer>(() => emptyAnswer(q));
  const [result, setResult] = useState<QuestionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <Card className="gap-4">
      <CardContent className="flex flex-col gap-4">
        <QuestionHeader q={q} index={index} />
        <QuestionBody q={q} value={answer} onChange={setAnswer} result={result} />
        {error && <p className="text-sm text-destructive">{error}</p>}
        {result ? (
          <>
            <ResultExplanation result={result} />
            <Button
              variant="outline"
              className="self-start"
              onClick={() => {
                setResult(null);
                setAnswer(emptyAnswer(q));
              }}
            >
              <RotateCcw /> Làm lại câu này
            </Button>
          </>
        ) : (
          <Button
            className="self-start"
            disabled={!isAnswered(answer) || pending}
            onClick={() =>
              start(async () => {
                setError(null);
                const r = await checkPracticeAnswer(lessonId, q.id, answer);
                if (r.ok) setResult(r.result);
                else setError(r.error);
              })
            }
          >
            {pending ? <Loader2 className="animate-spin" /> : <SearchCheck />} Kiểm tra đáp án
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

/** Luyện tập: làm từng câu, kiểm tra ngay và xem giải thích (không tính điểm). */
export function PracticePanel({ lessonId, questions }: { lessonId: string; questions: PublicQuestion[] }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-xl bg-orange-50 px-4 py-3 text-sm text-orange-900">
        Làm từng câu và bấm <b>Kiểm tra đáp án</b> để xem lời giải ngay. Phần luyện tập không tính điểm – hãy vào{" "}
        <b>Tự đánh giá</b> để làm bài có chấm điểm.
      </p>
      {questions.map((q, i) => (
        <PracticeItem key={q.id} lessonId={lessonId} q={q} index={i + 1} />
      ))}
    </div>
  );
}
