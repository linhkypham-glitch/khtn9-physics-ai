import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { QuestionEditor } from "@/components/questions/question-editor";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/auth/session";
import { loadLessonsForEditor, loadQuestionForEdit } from "@/modules/question-bank/load-editor";

export const metadata: Metadata = { title: "Sửa câu hỏi" };

export default async function Page({ params }: PageProps<"/teacher/questions/[id]">) {
  await requireRole(["teacher", "admin"]);
  const { id } = await params;
  const [q, lessons] = await Promise.all([loadQuestionForEdit(id), loadLessonsForEditor()]);
  if (!q) notFound();
  const lesson = lessons.find((l) => l.id === q.lessonId);
  const back = `/teacher/questions${lesson ? `?bai=${lesson.number}` : ""}`;
  return (
    <>
      <PageHeader title="Sửa câu hỏi" actions={<Button asChild variant="outline"><Link href={back}><ChevronLeft /> Ngân hàng câu hỏi</Link></Button>} />
      <QuestionEditor initial={q} lessons={lessons} returnTo={back} />
    </>
  );
}
