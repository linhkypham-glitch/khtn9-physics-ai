import type { Metadata } from "next";
import Link from "next/link";
import { School, Trophy } from "lucide-react";

import { EmptyState, ErrorState } from "@/components/dashboard/states";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { ClassLeaderboardToggle } from "@/modules/classes/components/class-forms";
import { LeaderboardTable, PeriodTabs } from "@/modules/leaderboard/components/leaderboard-table";
import { classLeaderboard, LeaderboardError, type ClassPeriodKey } from "@/modules/leaderboard/service";

export const metadata: Metadata = { title: "Bảng xếp hạng" };

const KEYS = ["all", "month", "hk1", "hk2"] as const;

export default async function Page({ searchParams }: PageProps<"/teacher/leaderboard">) {
  const user = await requireRole(["teacher", "admin"]);
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const supabase = await createSupabaseServerClient();
  const { data: classes } = supabase ? await supabase.from("classes").select("id, name, show_leaderboard").order("name") : { data: [] };
  if (!classes?.length) {
    return (
      <>
        <PageHeader title="Bảng xếp hạng" />
        <EmptyState icon={School} title="Chưa có lớp" description="Bạn chưa phụ trách lớp nào." />
      </>
    );
  }
  const lop = classes.some((c) => c.id === one(sp.lop)) ? one(sp.lop)! : classes[0].id;
  const cls = classes.find((c) => c.id === lop)!;
  const ky = (KEYS as readonly string[]).includes(one(sp.ky) ?? "") ? (one(sp.ky) as ClassPeriodKey) : "all";

  let lb: Awaited<ReturnType<typeof classLeaderboard>> | null = null;
  let error: string | null = null;
  try {
    lb = await classLeaderboard(user, lop, ky);
  } catch (e) {
    error = e instanceof LeaderboardError ? e.message : "Không tải được bảng xếp hạng.";
  }
  const { data: asg } = await supabase!.from("assessment_assignments").select("id, show_leaderboard, assessments(title)").eq("class_id", lop).order("created_at", { ascending: false });

  const body = !lb ? (
    <ErrorState description={error} />
  ) : (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Lớp {lb.className} – {lb.periodLabel}</CardTitle>
          <CardDescription>Điểm trung bình các bài kiểm tra (lần làm cao nhất của mỗi bài). Bằng điểm thì tổng thời gian ngắn hơn xếp trước.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <PeriodTabs base="/teacher/leaderboard" current={ky} semesters={lb.semesters} extra={{ lop }} />
            <ClassLeaderboardToggle key={lop} classId={lop} show={cls.show_leaderboard} />
          </div>
          <LeaderboardTable rows={lb.rows} showCount durationLabel="Tổng thời gian" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Theo từng bài giao</CardTitle><CardDescription>Bật/tắt công bố bảng xếp hạng từng bài trong trang kết quả bài giao.</CardDescription></CardHeader>
        <CardContent className="flex flex-col gap-2">
          {asg?.length ? asg.map((a) => (
            <Link key={a.id} href={`/teacher/assignments/${a.id}`} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm hover:bg-muted">
              <span>{a.assessments?.title}</span>
              {a.show_leaderboard ? <Badge variant="teal">Đã công bố</Badge> : <Badge variant="secondary">Chưa công bố</Badge>}
            </Link>
          )) : <p className="text-sm text-muted-foreground">Lớp chưa có bài giao.</p>}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      <PageHeader title="Bảng xếp hạng" description="Học sinh chỉ thấy bảng xếp hạng khi bạn bật công bố." />
      <div className="mb-4 flex flex-wrap gap-1.5">
        {classes.map((c) => (
          <Link key={c.id} href={`/teacher/leaderboard?lop=${c.id}`} className={cn("flex items-center gap-1 rounded-full border px-3 py-1 text-sm", c.id === lop ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted")}>
            {c.show_leaderboard && <Trophy className="size-3.5" />} Lớp {c.name}
          </Link>
        ))}
      </div>
      {body}
    </>
  );
}
