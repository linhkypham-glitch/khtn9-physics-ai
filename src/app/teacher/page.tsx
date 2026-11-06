import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Layers, School, Users } from "lucide-react";

import { CurriculumOverviewCard } from "@/components/dashboard/curriculum-overview-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState, ErrorState } from "@/components/dashboard/states";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/session";
import { listVisibleClasses } from "@/modules/classes/repository";
import { getCurriculum } from "@/modules/curriculum/repository";
import { countLessons } from "@/modules/curriculum/types";

export const metadata: Metadata = { title: "Tổng quan giáo viên" };

export default async function TeacherDashboard() {
  const user = await requireRole(["teacher", "admin"]);
  const [classes, curriculum] = await Promise.all([listVisibleClasses(), getCurriculum()]);

  const classList = classes.ok ? classes.data : [];
  const studentTotal = classList.reduce((s, c) => s + c.studentCount, 0);

  return (
    <>
      <WelcomeBanner title={`Xin chào, ${user.fullName}!`} subtitle="Tổng quan lớp học và chương trình giảng dạy KHTN 9 – Vật lý.">
        <Button asChild size="sm" className="bg-white text-orange-700 hover:bg-orange-50"><Link href="/teacher/classes">Quản lý lớp</Link></Button>
        <Button asChild size="sm" variant="outline" className="border-white/50 bg-white/10 text-white hover:bg-white/20 hover:text-white"><Link href="/teacher/questions">Ngân hàng câu hỏi</Link></Button>
      </WelcomeBanner>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Lớp phụ trách" value={classes.ok ? classList.length : "—"} icon={School} tone="blue" />
        <StatCard label="Học sinh" value={classes.ok ? studentTotal : "—"} hint="Tổng sĩ số các lớp" icon={Users} tone="teal" />
        <StatCard label="Chương" value={curriculum.ok ? curriculum.chapters.length : "—"} icon={Layers} tone="amber" />
        <StatCard label="Bài học" value={curriculum.ok ? countLessons(curriculum.chapters) : "—"} icon={BookOpen} tone="violet" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <CurriculumOverviewCard curriculum={curriculum} href="/teacher/curriculum" />
        </div>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Lớp của tôi</CardTitle>
            <CardDescription>Năm học hiện hành</CardDescription>
            <CardAction>
              <Button asChild variant="outline" size="sm"><Link href="/teacher/classes">Quản lý</Link></Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {!classes.ok ? (
              <ErrorState description={classes.error} />
            ) : classList.length === 0 ? (
              <EmptyState icon={School} title="Chưa được phân công lớp" description="Quản trị viên sẽ phân công lớp cho bạn." />
            ) : (
              <ul className="flex flex-col gap-2">
                {classList.map((c) => (
                  <li key={c.id}><Link href={`/teacher/classes/${c.id}`} className="flex items-center gap-3 rounded-lg border px-3 py-2.5 hover:bg-accent">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-blue-soft text-sm font-bold text-primary">{c.name}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">Lớp {c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.academicYear ?? "—"}</p>
                    </div>
                    <span className="text-sm tabular-nums text-muted-foreground">{c.studentCount} HS</span>
                  </Link></li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
