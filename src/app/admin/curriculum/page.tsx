import type { Metadata } from "next";

import { requireRole } from "@/lib/auth/session";
import { parseSubject } from "@/modules/curriculum/catalog";
import { CurriculumPage } from "@/modules/curriculum/components/curriculum-page";

export const metadata: Metadata = { title: "Chương trình học" };

export default async function Page({ searchParams }: PageProps<"/admin/curriculum">) {
  await requireRole(["admin"]);
  return <CurriculumPage subject={parseSubject((await searchParams).mon)} basePath="/admin/curriculum" />;
}
