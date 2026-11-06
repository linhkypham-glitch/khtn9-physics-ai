"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Bot, CheckCircle2, EyeOff, Loader2, Lock, Plus, Send, Trash2, Trophy, Unlock, Wand2, X } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  addQuestionToAssessment,
  aiGenerateForAssessment,
  assignAssessment,
  autoFillAssessment,
  deleteAssessment,
  removeQuestionFromAssessment,
  setAssessmentStatus,
  setAssignmentClosed,
  setAssignmentLeaderboard,
  updateQuestionInAssessment,
  type ActionResult,
} from "../actions";

function Feedback({ r }: { r: ActionResult | null }) {
  if (!r) return null;
  return (
    <Alert variant={r.ok ? "success" : "destructive"} className="mt-2">
      <AlertDescription>
        <p>{r.message}</p>
        {r.warnings?.map((w) => <p key={w} className="text-xs">• {w}</p>)}
      </AlertDescription>
    </Alert>
  );
}

export function QuestionRowActions({ assessmentId, questionId, points, editable }: { assessmentId: string; questionId: string; points: number; editable: boolean }) {
  const [pending, start] = useTransition();
  const [val, setVal] = useState(String(points));
  if (!editable) return <span className="text-sm font-semibold tabular-nums">{points.toLocaleString("vi-VN")} đ</span>;
  const run = (fn: () => Promise<ActionResult>) =>
    start(async () => {
      const r = await fn();
      if (!r.ok) window.alert(r.message);
    });
  return (
    <div className="flex items-center gap-1">
      <Input
        aria-label="Điểm câu hỏi"
        className="h-8 w-16 px-2 text-sm"
        inputMode="decimal"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={() => {
          const n = Number(val.replace(",", "."));
          if (n !== points) run(() => updateQuestionInAssessment(assessmentId, questionId, { points: n }));
        }}
      />
      <span className="text-xs text-muted-foreground">đ</span>
      <Button size="icon" variant="ghost" className="size-8" aria-label="Lên" disabled={pending} onClick={() => run(() => updateQuestionInAssessment(assessmentId, questionId, { move: -1 }))}><ArrowUp /></Button>
      <Button size="icon" variant="ghost" className="size-8" aria-label="Xuống" disabled={pending} onClick={() => run(() => updateQuestionInAssessment(assessmentId, questionId, { move: 1 }))}><ArrowDown /></Button>
      <Button size="icon" variant="ghost" className="size-8 text-muted-foreground hover:text-destructive" aria-label="Bỏ khỏi đề" disabled={pending} onClick={() => run(() => removeQuestionFromAssessment(assessmentId, questionId))}>
        {pending ? <Loader2 className="animate-spin" /> : <X />}
      </Button>
    </div>
  );
}

export function AddFromBankButton({ assessmentId, questionId, points }: { assessmentId: string; questionId: string; points: number }) {
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);
  return (
    <Button size="sm" variant={done ? "ghost" : "outline"} disabled={pending || done} onClick={() => start(async () => { const r = await addQuestionToAssessment(assessmentId, questionId, points); if (r.ok) setDone(true); else window.alert(r.message); })}>
      {pending ? <Loader2 className="animate-spin" /> : done ? <CheckCircle2 /> : <Plus />} {done ? "Đã thêm" : "Thêm"}
    </Button>
  );
}

export function AutoFillButton({ assessmentId }: { assessmentId: string }) {
  const [pending, start] = useTransition();
  const [r, setR] = useState<ActionResult | null>(null);
  return (
    <div>
      <Button variant="outline" disabled={pending} onClick={() => start(async () => setR(await autoFillAssessment(assessmentId)))}>
        {pending ? <Loader2 className="animate-spin" /> : <Wand2 />} Tự bổ sung cho đủ cấu trúc
      </Button>
      <Feedback r={r} />
    </div>
  );
}

export function AiGeneratePanel({ assessmentId, aiConfigured }: { assessmentId: string; aiConfigured: boolean }) {
  const [counts, setCounts] = useState({ multiple_choice: 4, true_false: 1, short_answer: 2 });
  const [note, setNote] = useState("");
  const [pending, start] = useTransition();
  const [r, setR] = useState<ActionResult | null>(null);
  if (!aiConfigured) {
    return <p className="text-sm text-muted-foreground">Chức năng AI chưa được cấu hình (cần <code>ANTHROPIC_API_KEY</code> trên máy chủ).</p>;
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        {([["multiple_choice", "Trắc nghiệm"], ["true_false", "Đúng – sai"], ["short_answer", "Trả lời ngắn"]] as const).map(([k, l]) => (
          <div key={k} className="flex flex-col gap-1">
            <Label className="text-xs">{l}</Label>
            <Input type="number" min={0} max={20} value={counts[k]} onChange={(e) => setCounts({ ...counts, [k]: Math.max(0, Number(e.target.value)) })} />
          </div>
        ))}
      </div>
      <Input value={note} maxLength={500} onChange={(e) => setNote(e.target.value)} placeholder="Yêu cầu thêm (tuỳ chọn)" />
      <Button disabled={pending} onClick={() => start(async () => setR(await aiGenerateForAssessment(assessmentId, counts, note)))} className="self-start bg-gradient-to-r from-violet-600 to-fuchsia-500">
        {pending ? <Loader2 className="animate-spin" /> : <Bot />} {pending ? "AI đang soạn… (1–3 phút)" : "AI tạo thêm câu hỏi"}
      </Button>
      <Feedback r={r} />
    </div>
  );
}

export function PublishControls({ assessmentId, status, canDelete }: { assessmentId: string; status: string; canDelete: boolean }) {
  const [pending, start] = useTransition();
  const [r, setR] = useState<ActionResult | null>(null);
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {status === "draft" ? (
          <Button disabled={pending} onClick={() => start(async () => setR(await setAssessmentStatus(assessmentId, "published")))}>
            {pending ? <Loader2 className="animate-spin" /> : <Lock />} Duyệt & xuất bản đề
          </Button>
        ) : (
          <Button variant="outline" disabled={pending} onClick={() => start(async () => setR(await setAssessmentStatus(assessmentId, "draft")))}>
            <Unlock /> Chuyển về nháp để sửa
          </Button>
        )}
        {canDelete && (
          <Button variant="ghost" className="text-destructive" disabled={pending} onClick={() => window.confirm("Xoá đề kiểm tra này?") && start(async () => setR((await deleteAssessment(assessmentId)) ?? null))}>
            <Trash2 /> Xoá đề
          </Button>
        )}
      </div>
      <Feedback r={r} />
    </div>
  );
}

function localInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function AssignForm({ assessmentId, classes }: { assessmentId: string; classes: { id: string; name: string }[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [startAt, setStartAt] = useState(() => localInput(new Date()));
  const [dueAt, setDueAt] = useState(() => localInput(new Date(Date.now() + 7 * 24 * 3600 * 1000)));
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [showAnswers, setShowAnswers] = useState<"immediately" | "after_due" | "never">("after_due");
  const [pending, start] = useTransition();
  const [r, setR] = useState<ActionResult | null>(null);
  if (!classes.length) return <p className="text-sm text-muted-foreground">Bạn chưa phụ trách lớp nào. Hãy tạo hoặc nhận lớp trong trang Lớp học.</p>;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Giao cho lớp</Label>
        <div className="flex flex-wrap gap-1.5">
          {classes.map((c) => (
            <button key={c.id} type="button" onClick={() => setSelected(selected.includes(c.id) ? selected.filter((x) => x !== c.id) : [...selected, c.id])} className={cn("rounded-full border px-3 py-1 text-sm", selected.includes(c.id) ? "border-primary bg-primary text-primary-foreground" : "bg-card")}>
              Lớp {c.name}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5"><Label htmlFor="start">Bắt đầu</Label><Input id="start" type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} /></div>
        <div className="flex flex-col gap-1.5"><Label htmlFor="due">Hạn nộp</Label><Input id="due" type="datetime-local" value={dueAt} onChange={(e) => setDueAt(e.target.value)} /></div>
        <div className="flex flex-col gap-1.5"><Label htmlFor="att">Số lần được làm</Label><Input id="att" type="number" min={1} max={10} value={maxAttempts} onChange={(e) => setMaxAttempts(Number(e.target.value))} /></div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="show">Công bố đáp án, lời giải</Label>
          <select id="show" className="h-10 rounded-lg border border-input bg-card px-3 text-sm" value={showAnswers} onChange={(e) => setShowAnswers(e.target.value as typeof showAnswers)}>
            <option value="immediately">Ngay sau khi nộp bài</option>
            <option value="after_due">Sau hạn nộp</option>
            <option value="never">Không công bố (chỉ xem điểm)</option>
          </select>
        </div>
      </div>
      <Button
        className="self-start"
        disabled={pending || !selected.length}
        onClick={() =>
          start(async () =>
            setR(await assignAssessment(assessmentId, { classIds: selected, startAt: new Date(startAt).toISOString(), dueAt: new Date(dueAt).toISOString(), maxAttempts, showAnswers })),
          )
        }
      >
        {pending ? <Loader2 className="animate-spin" /> : <Send />} Giao bài
      </Button>
      <Feedback r={r} />
    </div>
  );
}

export function CloseAssignmentButton({ assignmentId, closed }: { assignmentId: string; closed: boolean }) {
  const [pending, start] = useTransition();
  return (
    <Button variant="outline" disabled={pending} onClick={() => start(async () => { const r = await setAssignmentClosed(assignmentId, !closed); if (!r.ok) window.alert(r.message); })}>
      {pending ? <Loader2 className="animate-spin" /> : closed ? <Unlock /> : <Lock />} {closed ? "Mở lại bài giao" : "Đóng bài giao"}
    </Button>
  );
}

export function LeaderboardToggle({ assignmentId, enabled }: { assignmentId: string; enabled: boolean }) {
  const [pending, start] = useTransition();
  return (
    <Button variant="outline" disabled={pending} onClick={() => start(async () => { const r = await setAssignmentLeaderboard(assignmentId, !enabled); if (!r.ok) window.alert(r.message); })}>
      {pending ? <Loader2 className="animate-spin" /> : enabled ? <EyeOff /> : <Trophy />} {enabled ? "Ẩn bảng xếp hạng" : "Công bố bảng xếp hạng"}
    </Button>
  );
}
