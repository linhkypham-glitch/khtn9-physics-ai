import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, GraduationCap, School, ShieldCheck, Users } from "lucide-react";

import { CurriculumOverviewCard } from "@/components/dashboard/curriculum-overview-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { ErrorState } from "@/components/dashboard/states";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ClassesTable } from "@/modules/classes/components/classes-table";
import { listVisibleClasses } from "@/modules/classes/repository";
import { getCurriculum } from "@/modules/curriculum/repository";
import { countLessons } from "@/modules/curriculum/types";
import type { UserRole } from "@/types/database";

export const metadata: Metadata = { title: "Tổng quan quản trị" };

async function countUsersByRole(): Promise<Record<UserRole, number> | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const roles: UserRole[] = ["admin", "teacher", "student"];
  const results = await Promise.all(
    roles.map((r) => supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", r)),
  );
  if (results.some((r) => r.error)) {
    console.error("[admin] countUsersByRole", results.find((r) => r.error)?.error);
    return null;
  }
  return Object.fromEntries(roles.map((r, i) => [r, results[i].count ?? 0])) as Record<UserRole, number>;
}

export default async function AdminDashboard() {
  const user = await requireRole(["admin"]);
  const [counts, classes, curriculum] = await Promise.all([countUsersByRole(), listVisibleClasses(), getCurriculum()]);

  return (
    <>
      <WelcomeBanner title={`Xin chào, ${user.fullName}!`} subtitle="Tổng quan toàn hệ thống KHTN 9 – PHYSICS AI.">
        <Button asChild size="sm" className="bg-white text-orange-700 hover:bg-orange-50"><Link href="/teacher/classes">Quản lý lớp</Link></Button>
        <Button asChild size="sm" variant="outline" className="border-white/50 bg-white/10 text-white hover:bg-white/20 hover:text-white"><Link href="/admin/settings">Cấu hình hệ thống</Link></Button>
      </WelcomeBanner>

      {!counts && <div className="mb-4"><ErrorState description="Không tải được thống kê tài khoản." /></div>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Học sinh" value={counts?.student ?? "—"} icon={GraduationCap} tone="blue" />
        <StatCard label="Giáo viên" value={counts?.teacher ?? "—"} icon={Users} tone="teal" />
        <StatCard label="Quản trị viên" value={counts?.admin ?? "—"} icon={ShieldCheck} tone="violet" />
        <StatCard label="Lớp học" value={classes.ok ? classes.data.length : "—"} icon={School} tone="amber" />
        <StatCard label="Bài học" value={curriculum.ok ? countLessons(curriculum.chapters) : "—"} icon={BookOpen} tone="blue" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <h2 className="mb-3 font-semibold">Lớp học</h2>
          {classes.ok ? (
            <ClassesTable classes={classes.data} hrefBase="/teacher/classes" emptyDescription="Chưa có lớp học nào trong hệ thống." />
          ) : (
            <ErrorState description={classes.error} />
          )}
        </div>
        <div className="xl:col-span-2">
          <CurriculumOverviewCard curriculum={curriculum} href="/admin/curriculum" />
        </div>
      </div>
    </>
  );
}
