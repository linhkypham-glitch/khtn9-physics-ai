import type { Metadata } from "next";
import Link from "next/link";
import { Trophy } from "lucide-react";

import { EmptyState, ErrorState } from "@/components/dashboard/states";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import { LeaderboardTable, PeriodTabs } from "@/modules/leaderboard/components/leaderboard-table";
import { assignmentLeaderboard, classLeaderboard, LeaderboardError, studentLeaderboardOptions, type ClassPeriodKey } from "@/modules/leaderboard/service";

export const metadata: Metadata = { title: "Bảng xếp hạng" };

const KEYS = ["all", "month", "hk1", "hk2"] as const;

export default async function Page({ searchParams }: PageProps<"/student/leaderboard">) {
  const user = await requireRole(["student"]);
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const opts = await studentLeaderboardOptions(user.id);

  if (!opts.enabled || (!opts.classes.length && !opts.assignments.length)) {
    return (
      <>
        <PageHeader title="Bảng xếp hạng" />
        <EmptyState icon={Trophy} title="Chưa có bảng xếp hạng" description={opts.enabled ? "Giáo viên chưa công bố bảng xếp hạng nào cho lớp của em." : "Nhà trường đang tắt chức năng bảng xếp hạng."} />
      </>
    );
  }

  const bai = one(sp.bai);
  const lop = one(sp.lop) ?? (bai ? undefined : opts.classes[0]?.id);
  const ky = (KEYS as readonly string[]).includes(one(sp.ky) ?? "") ? (one(sp.ky) as ClassPeriodKey) : "all";

  type Loaded =
    | { kind: "assignment"; lb: Awaited<ReturnType<typeof assignmentLeaderboard>> }
    | { kind: "class"; lb: Awaited<ReturnType<typeof classLeaderboard>> }
    | { kind: "none" }
    | { kind: "error"; message: string };
  let loaded: Loaded = { kind: "none" };
  try {
    if (bai && opts.assignments.some((a) => a.id === bai)) loaded = { kind: "assignment", lb: await assignmentLeaderboard(user, bai) };
    else if (lop && opts.classes.some((c) => c.id === lop)) loaded = { kind: "class", lb: await classLeaderboard(user, lop, ky) };
  } catch (e) {
    loaded = { kind: "error", message: e instanceof LeaderboardError ? e.message : "Không tải được bảng xếp hạng." };
  }

  let content: React.ReactNode;
  if (loaded.kind === "assignment") {
    const lb = loaded.lb;
    content = (
      <Card>
        <CardHeader><CardTitle>{lb.title}</CardTitle><CardDescription>Lớp {lb.className} · điểm cao nhất của mỗi bạn; bằng điểm thì ai làm nhanh hơn xếp trước.</CardDescription></CardHeader>
        <CardContent><LeaderboardTable rows={lb.rows} highlightId={user.id} /></CardContent>
      </Card>
    );
  } else if (loaded.kind === "class") {
    const lb = loaded.lb;
    content = (
      <Card>
        <CardHeader>
          <CardTitle>Lớp {lb.className} – {lb.periodLabel}</CardTitle>
          <CardDescription>Điểm trung bình các bài kiểm tra đã nộp (lấy lần làm cao nhất của mỗi bài).</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <PeriodTabs base="/student/leaderboard" current={ky} semesters={lb.semesters} extra={{ lop: lop! }} />
          <LeaderboardTable rows={lb.rows} highlightId={user.id} showCount durationLabel="Tổng thời gian" />
        </CardContent>
      </Card>
    );
  } else if (loaded.kind === "error") {
    content = <ErrorState description={loaded.message} />;
  } else {
    content = <p className="text-sm text-muted-foreground">Hãy chọn một bảng xếp hạng ở trên.</p>;
  }

  const pill = (active: boolean) => cn("rounded-full border px-3 py-1 text-sm", active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted");
  return (
    <>
      <PageHeader title="Bảng xếp hạng" description="Chỉ hiển thị họ tên, lớp, điểm, thời gian làm bài và số ý đúng." />
      <div className="mb-4 flex flex-col gap-2">
        {opts.classes.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm text-muted-foreground">Theo lớp:</span>
            {opts.classes.map((c) => <Link key={c.id} href={`/student/leaderboard?lop=${c.id}`} className={pill(!bai && lop === c.id)}>Lớp {c.name}</Link>)}
          </div>
        )}
        {opts.assignments.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm text-muted-foreground">Theo bài kiểm tra:</span>
            {opts.assignments.map((a) => <Link key={a.id} href={`/student/leaderboard?bai=${a.id}`} className={pill(bai === a.id)}>{a.title}</Link>)}
          </div>
        )}
      </div>
      {content}
    </>
  );
}
