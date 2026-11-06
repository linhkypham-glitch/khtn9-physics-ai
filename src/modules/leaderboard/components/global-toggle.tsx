"use client";

import { useState, useTransition } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { setGlobalLeaderboardAction } from "../actions";

export function GlobalLeaderboardToggle({ enabled }: { enabled: boolean }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; message: string } | null>(null);
  return (
    <div className="flex flex-col gap-2">
      <label className="flex cursor-pointer items-start gap-3">
        <input type="checkbox" className="mt-1 size-4 accent-primary" defaultChecked={enabled} disabled={pending} onChange={(e) => { const c = e.target.checked; start(async () => setMsg(await setGlobalLeaderboardAction(c))); }} />
        <span className="text-sm">
          <span className="font-medium">Cho phép học sinh xem bảng xếp hạng</span>
          <span className="block text-muted-foreground">Khi tắt, học sinh không thấy bảng xếp hạng nào, kể cả khi giáo viên đã bật cho lớp hoặc bài giao.</span>
        </span>
      </label>
      {msg && <Alert variant={msg.ok ? "success" : "destructive"}><AlertDescription>{msg.message}</AlertDescription></Alert>}
    </div>
  );
}
