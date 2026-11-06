import type { Metadata } from "next";

import { requireRole } from "@/lib/auth/session";
import { CurriculumPage } from "@/modules/curriculum/components/curriculum-page";

export const metadata: Metadata = { title: "Chương trình học" };

export default async function Page() {
  await requireRole(["admin"]);
  return <CurriculumPage basePath="/admin/curriculum" />;
}
