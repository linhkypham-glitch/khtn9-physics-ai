import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, ClipboardCheck } from "lucide-react";

import { EmptyState } from "@/components/dashboard/states";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/session";
import { requestTime } from "@/lib/time";
import { StartAttemptButton } from "@/modules/assessments/components/start-button";
import { listStudentAssignments } from "@/modules/assessments/student";

export const metadata: Metadata = { title: "Bài được giao" };

const dt = new Intl.DateTimeFormat("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });

export default async function Page() {
  const user = await requireRole(["student"]);
  const items = await listStudentAssignments(user.id);
  const now = requestTime();
  return (
    <>
      <PageHeader title="Bài được giao" description="Các bài kiểm tra giáo viên giao cho lớp của em." />
      {items.length === 0 ? (
        <EmptyState icon={ClipboardCheck} title="Chưa có bài được giao" description="Khi giáo viên giao bài kiểm tra cho lớp, bài sẽ hiện ở đây." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((a) => {
            const open = !a.isClosed && now >= new Date(a.startAt).getTime() && now <= new Date(a.dueAt).getTime();
            const notYet = now < new Date(a.startAt).getTime();
            const inProgress = a.attempts.find((x) => x.status === "in_progress");
            const submitted = a.attempts.filter((x) => x.status === "submitted");
            const best = submitted.reduce<number | null>((b, x) => (x.score !== null && (b === null || x.score > b) ? x.score : b), null);
            const canStart = open && (inProgress || a.attempts.length < a.maxAttempts);
            return (
              <Card key={a.id} className="gap-3">
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-lg font-semibold">{a.title}</p>
                      <p className="text-sm text-muted-foreground">Lớp {a.className} · {a.questionCount} câu · {a.durationMinutes} phút · mã {a.code}</p>
                    </div>
                    {best !== null ? <Badge variant="teal">Điểm {best.toLocaleString("vi-VN")}</Badge> : a.isClosed ? <Badge variant="secondary">Đã đóng</Badge> : notYet ? <Badge variant="secondary">Sắp mở</Badge> : open ? <Badge variant="amber">Đang mở</Badge> : <Badge variant="destructive">Hết hạn</Badge>}
                  </div>
                  <p className="flex items-center gap-1.5 text-sm"><CalendarClock className="size-4 text-primary" /> Hạn nộp: <b>{dt.format(new Date(a.dueAt))}</b> · đã làm {a.attempts.length}/{a.maxAttempts} lần</p>
                  <div className="flex flex-wrap gap-2">
                    {canStart && <StartAttemptButton assignmentId={a.id} label={inProgress ? "Tiếp tục làm bài" : submitted.length ? "Làm lại" : "Bắt đầu làm bài"} />}
                    {submitted.map((s) => (
                      <Button key={s.id} asChild variant="outline" size="sm"><Link href={`/student/attempts/${s.id}`}>Xem kết quả lần {s.attemptNo}</Link></Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
