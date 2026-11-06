import { requireRole } from "@/lib/auth/session";
import { LessonPage } from "@/modules/curriculum/components/lesson-page";

export default async function Page({ params }: PageProps<"/student/lessons/[slug]">) {
  await requireRole(["student"]);
  const { slug } = await params;
  return <LessonPage slug={slug} basePath="/student/lessons" viewer="student" />;
}
