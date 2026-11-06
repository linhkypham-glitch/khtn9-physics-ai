import { requireRole } from "@/lib/auth/session";
import { LessonPage } from "@/modules/curriculum/components/lesson-page";

export default async function Page({ params }: PageProps<"/teacher/curriculum/[slug]">) {
  await requireRole(["teacher", "admin"]);
  const { slug } = await params;
  return <LessonPage slug={slug} basePath="/teacher/curriculum" viewer="staff" />;
}
