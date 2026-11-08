import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { LessonMaterialRow, LearningObjectiveRow } from "@/types/database";
import { SUBJECTS, type SubjectFilter, type SubjectKey } from "./catalog";
import type { CurriculumChapter, CurriculumResult } from "./types";

function catalogChapters(subject: SubjectFilter): CurriculumChapter[] {
  const source = subject === "all" ? (Object.keys(SUBJECTS) as SubjectKey[]).flatMap((k) => SUBJECTS[k].curriculum) : SUBJECTS[subject].curriculum;
  return source.map((c) => ({
    id: null,
    number: c.number,
    roman: c.roman,
    title: c.title,
    lessons: c.lessons.map((l) => ({
      id: null,
      number: l.number,
      title: l.title,
      slug: l.slug,
      lessonType: l.lessonType,
    })),
  }));
}

/** Lấy mục lục chương trình học (chương + bài) của một môn hoặc của tất cả các môn ("all") từ database. Mặc định: tất cả. */
export async function getCurriculum(subject: SubjectFilter = "all"): Promise<CurriculumResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: true, source: "catalog", chapters: catalogChapters(subject) };

  const { data, error } = await supabase
    .from("chapters")
    .select("id, number, roman, title, sort_order, textbooks!inner(code), lessons(id, number, title, slug, lesson_type, sort_order)")
    .in("textbooks.code", subject === "all" ? (Object.keys(SUBJECTS) as SubjectKey[]).map((k) => SUBJECTS[k].textbook.code) : [SUBJECTS[subject].textbook.code])
    .order("sort_order", { ascending: true })
    .order("sort_order", { referencedTable: "lessons", ascending: true });

  if (error) {
    console.error("[curriculum] getCurriculum", error);
    return { ok: false, error: "Không tải được chương trình học từ database." };
  }

  return {
    ok: true,
    source: "database",
    chapters: (data ?? []).map((c) => ({
      id: c.id,
      number: c.number,
      roman: c.roman,
      title: c.title,
      lessons: (c.lessons ?? []).map((l) => ({
        id: l.id,
        number: l.number,
        title: l.title,
        slug: l.slug,
        lessonType: l.lesson_type,
      })),
    })),
  };
}

export type LessonDetail = {
  id: string;
  number: number;
  title: string;
  slug: string;
  lessonType: "theory" | "practice";
  summary: string | null;
  chapter: { number: number; roman: string; title: string };
  objectives: LearningObjectiveRow[];
  materials: LessonMaterialRow[];
  prev: { slug: string; number: number; title: string } | null;
  next: { slug: string; number: number; title: string } | null;
};

export type LessonDetailResult =
  | { ok: true; lesson: LessonDetail }
  | { ok: false; reason: "not_configured" | "not_found" | "error" };

/** Chi tiết bài học + mục tiêu + học liệu (RLS tự lọc học liệu chưa xuất bản với học sinh). */
export async function getLessonBySlug(slug: string): Promise<LessonDetailResult> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, reason: "not_configured" };

  const { data: lesson, error } = await supabase
    .from("lessons")
    .select("id, number, title, slug, lesson_type, summary, chapters(number, roman, title, textbook_id)")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[curriculum] getLessonBySlug", error);
    return { ok: false, reason: "error" };
  }
  if (!lesson || !lesson.chapters) return { ok: false, reason: "not_found" };

  const [objectivesRes, materialsRes, siblingsRes] = await Promise.all([
    supabase.from("learning_objectives").select("*").eq("lesson_id", lesson.id).order("sort_order"),
    supabase.from("lesson_materials").select("*").eq("lesson_id", lesson.id).order("sort_order"),
    // Bài trước / bài sau chỉ trong cùng một sách (cùng môn)
    supabase.from("lessons").select("slug, number, title, chapters!inner(textbook_id)").eq("chapters.textbook_id", lesson.chapters.textbook_id).order("number"),
  ]);

  if (objectivesRes.error || materialsRes.error || siblingsRes.error) {
    console.error("[curriculum] lesson relations", objectivesRes.error ?? materialsRes.error ?? siblingsRes.error);
    return { ok: false, reason: "error" };
  }

  const siblings = siblingsRes.data ?? [];
  const index = siblings.findIndex((s) => s.slug === lesson.slug);

  return {
    ok: true,
    lesson: {
      id: lesson.id,
      number: lesson.number,
      title: lesson.title,
      slug: lesson.slug,
      lessonType: lesson.lesson_type,
      summary: lesson.summary,
      chapter: lesson.chapters,
      objectives: objectivesRes.data ?? [],
      materials: materialsRes.data ?? [],
      prev: index > 0 ? siblings[index - 1] : null,
      next: index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null,
    },
  };
}
