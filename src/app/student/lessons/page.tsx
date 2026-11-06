import type { Metadata } from "next";

import { requireRole } from "@/lib/auth/session";
import { CurriculumPage } from "@/modules/curriculum/components/curriculum-page";

export const metadata: Metadata = { title: "Bài học" };

export default async function Page() {
  await requireRole(["student"]);
  return <CurriculumPage basePath="/student/lessons" title="Bài học" />;
}
