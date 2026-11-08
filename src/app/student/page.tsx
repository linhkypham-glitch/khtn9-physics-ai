import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, BookOpen, Layers, School } from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState, ErrorState } from "@/components/dashboard/states";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { listStudentAssignments } from "@/modules/assessments/student";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/session";
import { requestTime } from "@/lib/time";
import { getStudentClasses } from "@/modules/classes/repository";
import { CurriculumList } from "@/modules/curriculum/components/curriculum-list";
import { getCurriculum } from "@/modules/curriculum/repository";
import { countLessons, formatLessonLabel } from "@/modules/curriculum/types";

export const metadata: Metadata = { title: "Tổng quan học sinh" };

export default async function StudentDashboard() {
  const user = await requireRole(["student"]);
  const [classes, curriculum] = await Promise.all([getStudentClasses(user.id), getCurriculum()]);

  const myClass = classes.ok ? classes.data[0] : undefined;
  const admin = createSupabaseAdminClient();
  const [{ data: attempts }, { count: labRuns }] = admin
    ? await Promise.all([
        admin.from("practice_attempts").select("lesson_id, score").eq("user_id", user.id).eq("mode", "self_assessment"),
        admin.from("experiment_attempts").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ])
    : [{ data: [] as { lesson_id: string; score: number }[] }, { count: 0 }];
  const [assignments, { data: comments }] = await Promise.all([
    listStudentAssignments(user.id).catch(() => []),
    admin ? admin.from("student_comments").select("id, content, created_at, profiles!student_comments_teacher_id_fkey(full_name)").eq("student_id", user.id).order("created_at", { ascending: false }).limit(3) : Promise.resolve({ data: [] }),
  ]);
  const openAssignments = assignments.filter((a) => !a.isClosed && requestTime() <= new Date(a.dueAt).getTime() && !a.attempts.some((x) => x.status === "submitted"));
  const doneLessons = new Set((attempts ?? []).map((a) => a.lesson_id)).size;
  const avgScore = attempts?.length ? attempts.reduce((s, a) => s + Number(a.score), 0) / attempts.length : null;
  const firstLesson = curriculum.ok ? curriculum.chapters[0]?.lessons[0] : undefined;

  return (
    <>
      <WelcomeBanner
        title={`Xin chào, ${user.fullName}! 👋`}
        subtitle={myClass ? `Lớp ${myClass.name}${myClass.academicYear ? ` · Năm học ${myClass.academicYear}` : ""} · Hôm nay mình cùng khám phá khoa học nhé!` : "Chúc em học tốt môn KHTN!"}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Lớp" value={myClass?.name ?? "—"} hint={myClass?.teacherNames.length ? `GV: ${myClass.teacherNames.join(", ")}` : "Chưa có giáo viên"} icon={School} tone="blue" />
        <StatCard label="Chương" value={curriculum.ok ? curriculum.chapters.length : "—"} icon={Layers} tone="amber" />
        <StatCard label="Bài học" value={curriculum.ok ? countLessons(curriculum.chapters) : "—"} icon={BookOpen} tone="violet" />
      </div>

      {!classes.ok && <div className="mt-4"><ErrorState description={classes.error} /></div>}
      {classes.ok && classes.data.length === 0 && (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-soft px-4 py-3 text-sm text-amber-900">
          Bạn chưa được xếp vào lớp nào. Hãy liên hệ giáo viên để được thêm vào lớp.
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {firstLesson && (
            <Card className="overflow-hidden border-0 bg-primary text-primary-foreground">
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-orange-50">Bắt đầu lộ trình học</p>
                  <p className="mt-1 text-lg font-semibold">{formatLessonLabel(firstLesson)}</p>
                </div>
                <Button asChild variant="secondary" className="bg-white text-primary hover:bg-orange-50">
                  <Link href={`/student/lessons/${firstLesson.slug}`}>Vào bài học <ArrowRight /></Link>
                </Button>
              </CardContent>
            </Card>
          )}
          {curriculum.ok ? (
            <CurriculumList
              chapters={curriculum.chapters}
              lessonHref={curriculum.source === "database" ? (slug) => `/student/lessons/${slug}` : null}
              compact
            />
          ) : (
            <ErrorState title="Không tải được chương trình học" description={curriculum.error} />
          )}
        </div>

        <div className="flex flex-col gap-6">
          <Card className={openAssignments.length ? "border-orange-300 bg-orange-50/50" : undefined}>
            <CardHeader>
              <CardTitle>Bài được giao</CardTitle>
              <CardDescription>{openAssignments.length ? `${openAssignments.length} bài cần làm` : "Không có bài cần làm"}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {openAssignments.slice(0, 3).map((a) => (
                <div key={a.id} className="rounded-lg border bg-white px-3 py-2 text-sm">
                  <p className="font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">Hạn: {new Date(a.dueAt).toLocaleString("vi-VN")}</p>
                </div>
              ))}
              <Link href="/student/assignments" className="text-sm font-semibold text-primary hover:underline">Xem tất cả →</Link>
            </CardContent>
          </Card>
          {(comments?.length ?? 0) > 0 && (
            <Card>
              <CardHeader><CardTitle>Nhận xét của giáo viên</CardTitle></CardHeader>
              <CardContent className="flex flex-col gap-2">
                {comments!.map((c) => (
                  <div key={c.id} className="rounded-lg bg-amber-50 px-3 py-2 text-sm">
                    <p className="whitespace-pre-line">{c.content}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{c.profiles?.full_name} · {new Date(c.created_at).toLocaleDateString("vi-VN")}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Tiến độ học tập</CardTitle>
              <CardDescription>Ghi nhận từ bài luyện tập và kiểm tra</CardDescription>
            </CardHeader>
            <CardContent>
              {(attempts?.length ?? 0) === 0 && !labRuns ? (
                <EmptyState
                  icon={BarChart3}
                  title="Chưa có dữ liệu học tập"
                  description="Làm thí nghiệm và bài Tự đánh giá ở mỗi bài học – tiến độ sẽ hiện ở đây."
                  className="border-0 bg-muted/50 py-8"
                />
              ) : (
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="mb-1 flex justify-between text-sm"><span>Bài đã tự đánh giá</span><b className="tabular-nums">{doneLessons}/{curriculum.ok ? countLessons(curriculum.chapters) : 16}</b></div>
                    <Progress value={(doneLessons / (curriculum.ok ? Math.max(1, countLessons(curriculum.chapters)) : 16)) * 100} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-orange-50 py-2"><p className="text-xl font-bold tabular-nums text-orange-700">{attempts?.length ?? 0}</p><p className="text-xs text-muted-foreground">Lần tự đánh giá</p></div>
                    <div className="rounded-xl bg-amber-50 py-2"><p className="text-xl font-bold tabular-nums text-amber-700">{avgScore === null ? "—" : avgScore.toLocaleString("vi-VN", { maximumFractionDigits: 1 })}</p><p className="text-xs text-muted-foreground">Điểm TB</p></div>
                    <div className="rounded-xl bg-teal-50 py-2"><p className="text-xl font-bold tabular-nums text-teal-700">{labRuns ?? 0}</p><p className="text-xs text-muted-foreground">Thí nghiệm</p></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
