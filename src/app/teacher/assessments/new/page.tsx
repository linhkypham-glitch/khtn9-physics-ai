import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { getAiConfigStatus } from "@/lib/ai/config";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CreateAssessmentForm } from "@/modules/assessments/components/create-assessment-form";

export const metadata: Metadata = { title: "Tạo đề kiểm tra" };

export default async function Page() {
  await requireRole(["teacher", "admin"]);
  const supabase = await createSupabaseServerClient();
  const [{ data: lessons }, { data: counts }] = await Promise.all([
    supabase!.from("lessons").select("id, number, title, chapters!inner(number, roman, title)").order("number"),
    supabase!.from("question_bank").select("lesson_id").in("status", ["approved", "published"]),
  ]);
  const countBy = new Map<string, number>();
  (counts ?? []).forEach((c) => countBy.set(c.lesson_id, (countBy.get(c.lesson_id) ?? 0) + 1));
  return (
    <>
      <PageHeader title="Tạo đề kiểm tra" actions={<Button asChild variant="outline"><Link href="/teacher/assessments"><ChevronLeft /> Đề kiểm tra</Link></Button>} />
      <CreateAssessmentForm
        aiConfigured={getAiConfigStatus().configured}
        lessons={(lessons ?? []).map((l) => ({ id: l.id, number: l.number, title: l.title, chapterNumber: l.chapters.number, chapterRoman: l.chapters.roman, chapterTitle: l.chapters.title, published: countBy.get(l.id) ?? 0 }))}
      />
    </>
  );
}
