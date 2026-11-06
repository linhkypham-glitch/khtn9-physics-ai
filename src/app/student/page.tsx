import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BarChart3, BookOpen, Layers, School } from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState, ErrorState } from "@/components/dashboard/states";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/session";
import { getStudentClasses } from "@/modules/classes/repository";
import { CurriculumList } from "@/modules/curriculum/components/curriculum-list";
import { getCurriculum } from "@/modules/curriculum/repository";
import { countLessons, formatLessonLabel } from "@/modules/curriculum/types";

export const metadata: Metadata = { title: "Tổng quan học sinh" };

export default async function StudentDashboard() {
  const user = await requireRole(["student"]);
  const [classes, curriculum] = await Promise.all([getStudentClasses(user.id), getCurriculum()]);

  const myClass = classes.ok ? classes.data[0] : undefined;
  const firstLesson = curriculum.ok ? curriculum.chapters[0]?.lessons[0] : undefined;

  return (
    <>
      <PageHeader
        title={`Xin chào, ${user.fullName}`}
        description={myClass ? `Lớp ${myClass.name}${myClass.academicYear ? ` · Năm học ${myClass.academicYear}` : ""}` : "Chúc bạn học tốt môn Vật lý!"}
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
                  <p className="text-sm text-blue-100">Bắt đầu lộ trình học</p>
                  <p className="mt-1 text-lg font-semibold">{formatLessonLabel(firstLesson)}</p>
                </div>
                <Button asChild variant="secondary" className="bg-white text-primary hover:bg-blue-50">
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
          <Card>
            <CardHeader>
              <CardTitle>Tiến độ học tập</CardTitle>
              <CardDescription>Ghi nhận từ bài luyện tập và kiểm tra</CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={BarChart3}
                title="Chưa có dữ liệu học tập"
                description="Tiến độ, điểm số và nội dung cần ôn tập sẽ xuất hiện khi bạn bắt đầu luyện tập và làm bài."
                className="border-0 bg-muted/50 py-8"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
