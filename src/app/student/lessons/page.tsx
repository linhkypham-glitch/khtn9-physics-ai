import type { Metadata } from "next";

import { requireRole } from "@/lib/auth/session";
import { parseSubject } from "@/modules/curriculum/catalog";
import { CurriculumPage } from "@/modules/curriculum/components/curriculum-page";

export const metadata: Metadata = { title: "Bài học" };

export default async function Page({ searchParams }: PageProps<"/student/lessons">) {
  await requireRole(["student"]);
  return <CurriculumPage subject={parseSubject((await searchParams).mon)} basePath="/student/lessons" title="Bài học" />;
}
