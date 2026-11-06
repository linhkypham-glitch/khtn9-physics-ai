"use client";

import { useActionState, useState, useTransition } from "react";
import { CheckCircle2, Loader2, Plus, Trash2, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  addStudentAction,
  claimClassAction,
  createClassAction,
  removeStudentAction,
  setClassLeaderboardAction,
  setSelfJoinAction,
  type ActionState,
} from "../actions";

const initial: ActionState = { ok: false, message: null };

function Message({ state }: { state: ActionState }) {
  if (!state.message) return null;
  return (
    <p role="status" className={cn("flex items-center gap-1.5 text-sm", state.ok ? "text-success" : "text-destructive")}>
      {state.ok && <CheckCircle2 className="size-4" />} {state.message}
    </p>
  );
}

export function CreateClassForm() {
  const [state, action, pending] = useActionState(createClassAction, initial);
  return (
    <form action={action} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input name="name" placeholder="Tên lớp, ví dụ 9A" maxLength={20} className="uppercase" aria-label="Tên lớp" required />
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <Plus />} Tạo lớp
        </Button>
      </div>
      <Message state={state} />
    </form>
  );
}

export function AddStudentForm({ classId }: { classId: string }) {
  const [state, action, pending] = useActionState(addStudentAction, initial);
  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="classId" value={classId} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input name="fullName" placeholder="Họ và tên học sinh" maxLength={80} aria-label="Họ và tên học sinh" required />
        <Input name="studentCode" placeholder="Mã HS (tuỳ chọn)" maxLength={30} aria-label="Mã học sinh" className="sm:w-40" />
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <UserPlus />} Thêm
        </Button>
      </div>
      <Message state={state} />
    </form>
  );
}

export function ClaimClassButton({ classId }: { classId: string }) {
  const [pending, start] = useTransition();
  const [state, setState] = useState<ActionState>(initial);
  return (
    <div className="flex flex-col items-end gap-1">
      <Button size="sm" variant="outline" disabled={pending} onClick={() => start(async () => setState(await claimClassAction(classId)))}>
        {pending && <Loader2 className="animate-spin" />} Nhận lớp
      </Button>
      {!state.ok && <Message state={state} />}
    </div>
  );
}

export function SelfJoinToggle({ classId, allow }: { classId: string; allow: boolean }) {
  const [pending, start] = useTransition();
  const [state, setState] = useState<ActionState>(initial);
  return (
    <div className="flex flex-col gap-2">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 size-4 accent-primary"
          defaultChecked={allow}
          disabled={pending}
          onChange={(e) => {
            const checked = e.target.checked;
            start(async () => setState(await setSelfJoinAction(classId, checked)));
          }}
        />
        <span className="text-sm">
          <span className="font-medium">Cho phép học sinh mới tự vào lớp</span>
          <span className="block text-muted-foreground">
            Tắt để chỉ những học sinh có tên trong danh sách mới vào được.
          </span>
        </span>
      </label>
      <Message state={state} />
    </div>
  );
}

export function ClassLeaderboardToggle({ classId, show }: { classId: string; show: boolean }) {
  const [pending, start] = useTransition();
  const [state, setState] = useState<ActionState>(initial);
  return (
    <div className="flex flex-col gap-2">
      <label className="flex cursor-pointer items-start gap-3">
        <input type="checkbox" className="mt-1 size-4 accent-primary" defaultChecked={show} disabled={pending} onChange={(e) => { const c = e.target.checked; start(async () => setState(await setClassLeaderboardAction(classId, c))); }} />
        <span className="text-sm">
          <span className="font-medium">Công khai bảng xếp hạng lớp với học sinh</span>
          <span className="block text-muted-foreground">Theo tháng và học kỳ. Chỉ hiện họ tên, lớp, điểm, thời gian, số ý đúng.</span>
        </span>
      </label>
      <Message state={state} />
    </div>
  );
}

export function RemoveStudentButton({ classId, studentId, name }: { classId: string; studentId: string; name: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      size="icon"
      variant="ghost"
      className="size-8 text-muted-foreground hover:text-destructive"
      aria-label={`Xoá ${name} khỏi lớp`}
      disabled={pending}
      onClick={() => {
        if (!window.confirm(`Xoá ${name} khỏi lớp? Kết quả học tập vẫn được lưu.`)) return;
        start(async () => {
          const r = await removeStudentAction(classId, studentId);
          if (!r.ok && r.message) window.alert(r.message);
        });
      }}
    >
      {pending ? <Loader2 className="animate-spin" /> : <Trash2 />}
    </Button>
  );
}
