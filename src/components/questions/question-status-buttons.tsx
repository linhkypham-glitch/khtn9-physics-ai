"use client";

import { useTransition } from "react";
import { CheckCircle2, Loader2, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { setQuestionStatusAction } from "@/modules/question-bank/actions";

export function QuestionStatusButtons({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();
  const run = (s: "draft" | "published") =>
    start(async () => {
      const r = await setQuestionStatusAction(id, s);
      if (!r.ok) window.alert(r.message);
    });
  return status === "draft" || status === "reviewed" ? (
    <Button size="sm" onClick={() => run("published")} disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <CheckCircle2 />} Duyệt
    </Button>
  ) : (
    <Button size="sm" variant="ghost" onClick={() => run("draft")} disabled={pending} className="text-muted-foreground">
      {pending ? <Loader2 className="animate-spin" /> : <Undo2 />} Về nháp
    </Button>
  );
}
