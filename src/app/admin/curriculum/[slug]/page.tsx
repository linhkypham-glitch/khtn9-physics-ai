import { requireRole } from "@/lib/auth/session";
import { LessonPage } from "@/modules/curriculum/components/lesson-page";

export default async function Page({ params }: PageProps<"/admin/curriculum/[slug]">) {
  await requireRole(["admin"]);
  const { slug } = await params;
  return <LessonPage slug={slug} basePath="/admin/curriculum" viewer="staff" />;
}
