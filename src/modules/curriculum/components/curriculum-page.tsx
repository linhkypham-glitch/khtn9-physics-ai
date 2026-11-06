import { BookX } from "lucide-react";

import { EmptyState, ErrorState } from "@/components/dashboard/states";
import { PageHeader } from "@/components/layout/page-header";
import { getCurriculum } from "../repository";
import { countLessons } from "../types";
import { CurriculumList } from "./curriculum-list";
import { CurriculumSourceNotice } from "./curriculum-source-notice";

/** Trang danh sách chương trình học dùng chung cho các vai trò. */
export async function CurriculumPage({ basePath, title = "Chương trình học" }: { basePath: string; title?: string }) {
  const result = await getCurriculum();

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
        description={`KHTN 9 – Vật lý · ${result.chapters.length} chương · ${lessonCount} bài học${range}`}
      />
      <CurriculumSourceNotice source={result.source} />
      {result.chapters.length === 0 ? (
        <EmptyState
          icon={BookX}
          title="Database chưa có dữ liệu chương trình học"
          description="Chạy file seed supabase/seed/01_curriculum.sql để nhập 5 chương và các bài học."
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
