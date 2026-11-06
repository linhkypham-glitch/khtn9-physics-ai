"use client";

import { useState, useTransition } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Loader2, MessageSquarePlus, Sparkles, Trash2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { addCommentAction, deleteCommentAction } from "../comment-actions";

/** Biểu đồ phổ điểm (một chuỗi – một màu). */
export function DistributionChart({ distribution }: { distribution: number[] }) {
  const data = ["Dưới 5", "5 – 6,4", "6,5 – 7,9", "Từ 8"].map((label, i) => ({ label, count: distribution[i] ?? 0 }));
  return (
    <div className="h-52" role="img" aria-label="Phổ điểm của lớp">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid vertical={false} stroke="#f0e4d8" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip formatter={(v) => [`${v} học sinh`, "Số lượng"]} />
          <Bar dataKey="count" fill="#ea580c" radius={[4, 4, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Tỉ lệ đúng (%) theo nhóm – thanh ngang, tô màu theo mức đạt (kèm nhãn số). */
export function AccuracyBars({ items }: { items: { label: string; correct: number; total: number }[] }) {
  if (!items.length) return <p className="text-sm text-muted-foreground">Chưa có dữ liệu.</p>;
  const data = items.map((i) => ({ label: i.label, rate: i.total ? Math.round((i.correct / i.total) * 100) : 0, detail: `${i.correct}/${i.total}` }));
  return (
    <div style={{ height: Math.max(120, data.length * 38) }} role="img" aria-label="Tỉ lệ trả lời đúng theo nhóm">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 36, bottom: 4, left: 8 }}>
          <CartesianGrid horizontal={false} stroke="#f0e4d8" />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
          <YAxis type="category" dataKey="label" width={170} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v, _n, p) => [`${v}% (${(p.payload as { detail: string }).detail} ý)`, "Tỉ lệ đúng"]} />
          <Bar dataKey="rate" radius={[0, 4, 4, 0]} maxBarSize={22} label={{ position: "right", fontSize: 11, formatter: (v: unknown) => `${v}%` }}>
            {data.map((d) => (
              <Cell key={d.label} fill={d.rate >= 80 ? "#16a34a" : d.rate >= 50 ? "#f59e0b" : "#dc2626"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CommentForm({ studentId, assignmentId, suggestion }: { studentId: string; assignmentId: string | null; suggestion?: string }) {
  const [text, setText] = useState("");
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; message: string } | null>(null);
  return (
    <div className="flex flex-col gap-2">
      <textarea
        className="min-h-24 rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30"
        value={text}
        maxLength={3000}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nhận xét, đánh giá quá trình học tập của học sinh…"
        aria-label="Nhận xét của giáo viên"
      />
      <div className="flex flex-wrap gap-2">
        <Button
          disabled={pending || text.trim().length < 2}
          onClick={() =>
            start(async () => {
              const r = await addCommentAction(studentId, text, assignmentId);
              setMsg(r);
              if (r.ok) setText("");
            })
          }
        >
          {pending ? <Loader2 className="animate-spin" /> : <MessageSquarePlus />} Lưu nhận xét
        </Button>
        {suggestion && (
          <Button variant="outline" type="button" onClick={() => setText(suggestion)}>
            <Sparkles /> Dùng gợi ý từ dữ liệu
          </Button>
        )}
      </div>
      {msg && <Alert variant={msg.ok ? "success" : "destructive"}><AlertDescription>{msg.message}</AlertDescription></Alert>}
    </div>
  );
}

export function DeleteCommentButton({ commentId, studentId }: { commentId: string; studentId: string }) {
  const [pending, start] = useTransition();
  return (
    <Button size="icon" variant="ghost" className="size-7 text-muted-foreground hover:text-destructive" aria-label="Xoá nhận xét" disabled={pending} onClick={() => window.confirm("Xoá nhận xét này?") && start(async () => { const r = await deleteCommentAction(commentId, studentId); if (!r.ok) window.alert(r.message); })}>
      {pending ? <Loader2 className="animate-spin" /> : <Trash2 />}
    </Button>
  );
}
