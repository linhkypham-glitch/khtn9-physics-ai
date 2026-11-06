"use client";

import { useState, useTransition } from "react";
import { Loader2, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { startAttemptAction } from "../student-actions";

export function StartAttemptButton({ assignmentId, label }: { assignmentId: string; label: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-start gap-1">
      <Button disabled={pending} onClick={() => start(async () => { const r = await startAttemptAction(assignmentId); if (r && !r.ok) setError(r.message); })}>
        {pending ? <Loader2 className="animate-spin" /> : <Play />} {label}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
