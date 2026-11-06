import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye } from "lucide-react";

import { ErrorState } from "@/components/dashboard/states";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/auth/session";
import { LessonContentEditor } from "@/modules/curriculum/components/content-editor";
import { getLessonBySlug } from "@/modules/curriculum/repository";

export const metadata: Metadata = { title: "Sửa nội dung bài học" };

export default async function Page({ params }: PageProps<"/teacher/curriculum/[slug]/edit">) {
  const user = await requireRole(["teacher", "admin"]);
  if (user.authMode !== "account") notFound();
  const { slug } = await params;
  const res = await getLessonBySlug(slug);
  if (!res.ok) {
    if (res.reason === "not_found") notFound();
    return <ErrorState description="Không tải được bài học." />;
  }
  const l = res.lesson;
  return (
    <>
      <PageHeader
        title={`Sửa nội dung – Bài ${l.number}. ${l.title}`}
        description="Mục tiêu, yêu cầu cần đạt và học liệu theo từng khu vực. Học liệu ở trạng thái “Bản nháp” chỉ giáo viên nhìn thấy."
        actions={<Button asChild variant="outline"><Link href={`/teacher/curriculum/${l.slug}`}><Eye /> Xem bài học</Link></Button>}
      />
      <LessonContentEditor lessonId={l.id} objectives={l.objectives} materials={l.materials} />
    </>
  );
}
