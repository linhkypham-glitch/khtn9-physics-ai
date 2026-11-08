import Link from "next/link";
import { BookX } from "lucide-react";

import { EmptyState, ErrorState } from "@/components/dashboard/states";
import { PageHeader } from "@/components/layout/page-header";
import { cn } from "@/lib/utils";
import { SUBJECTS, type SubjectFilter, type SubjectKey } from "../catalog";
import { getCurriculum } from "../repository";
import { countLessons } from "../types";
import { CurriculumList } from "./curriculum-list";
import { CurriculumSourceNotice } from "./curriculum-source-notice";

/** Trang danh sách chương trình học dùng chung cho các vai trò. */
export async function CurriculumPage({ basePath, title = "Chương trình học", subject = "all" }: { basePath: string; title?: string; subject?: SubjectFilter }) {
  const result = await getCurriculum(subject);

  if (!result.ok) {
    return (
      <>
        <PageHeader title={title} />
        <ErrorState title="Không tải được chương trình học" description={result.error} />
      </>
    );
  }

  const lessonCount = countLessons(result.chapters);
  const numbers = result.chapters.flatMap((c) => c.lessons.map((l) => l.number));
  const range = numbers.length ? ` (Bài ${Math.min(...numbers)} – Bài ${Math.max(...numbers)})` : "";

  return (
    <>
      <PageHeader
        title={title}
        description={`KHTN 9 – ${subject === "all" ? "Vật lý và Hoá học" : SUBJECTS[subject].label} · ${result.chapters.length} chương · ${lessonCount} bài học${range}`}
      />
      <nav aria-label="Chọn môn" className="mb-4 flex flex-wrap gap-1.5">
        {(["all", ...Object.keys(SUBJECTS)] as (SubjectKey | "all")[]).map((k) => (
          <Link key={k} href={k === "all" ? basePath : `${basePath}?mon=${k}`} className={cn("rounded-full border px-4 py-1.5 text-sm font-medium", k === subject ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted")}>
            {k === "all" ? "Tất cả" : SUBJECTS[k].label}
          </Link>
        ))}
      </nav>
      <CurriculumSourceNotice source={result.source} />
      {result.chapters.length === 0 ? (
        <EmptyState
          icon={BookX}
          title="Database chưa có dữ liệu chương trình học"
          description="Chạy file seed supabase/seed/01_curriculum.sql để nhập các chương và bài học."
        />
      ) : (
        <CurriculumList
          chapters={result.chapters}
          lessonHref={result.source === "database" ? (slug) => `${basePath}/${slug}` : null}
        />
      )}
    </>
  );
}
