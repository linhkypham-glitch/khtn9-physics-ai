import { notFound } from "next/navigation";

import { ErrorState } from "@/components/dashboard/states";
import { getLessonBySlug } from "../repository";
import { LessonView } from "./lesson-view";

export async function LessonPage({ slug, basePath, viewer }: { slug: string; basePath: string; viewer: "student" | "staff" }) {
  const result = await getLessonBySlug(slug);
  if (!result.ok) {
    if (result.reason === "not_found") notFound();
    return (
      <ErrorState
        title="Không tải được bài học"
        description={result.reason === "not_configured" ? "Supabase chưa được cấu hình." : "Vui lòng thử lại sau."}
      />
    );
  }
  return <LessonView lesson={result.lesson} basePath={basePath} viewer={viewer} />;
}
