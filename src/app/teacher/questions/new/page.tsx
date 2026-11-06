import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { QuestionEditor } from "@/components/questions/question-editor";
import { emptyQuestionInput } from "@/modules/question-bank/input-schema";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/auth/session";
import { loadLessonsForEditor } from "@/modules/question-bank/load-editor";

export const metadata: Metadata = { title: "Thêm câu hỏi" };

export default async function Page({ searchParams }: PageProps<"/teacher/questions/new">) {
  await requireRole(["teacher", "admin"]);
  const { bai } = await searchParams;
  const lessons = await loadLessonsForEditor();
  const lesson = lessons.find((l) => String(l.number) === bai) ?? lessons[0];
  const back = `/teacher/questions${lesson ? `?bai=${lesson.number}` : ""}`;
  return (
    <>
      <PageHeader title="Thêm câu hỏi" description="Câu hỏi được thêm vào ngân hàng của bài học đã chọn." actions={<Button asChild variant="outline"><Link href={back}><ChevronLeft /> Ngân hàng câu hỏi</Link></Button>} />
      {lesson ? <QuestionEditor initial={emptyQuestionInput(lesson.id)} lessons={lessons} returnTo={back} /> : <p>Chưa có bài học.</p>}
    </>
  );
}
