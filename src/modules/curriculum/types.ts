import type { LessonType } from "@/types/database";

export type CurriculumLesson = {
  id: string | null;
  number: number;
  title: string;
  slug: string;
  lessonType: LessonType;
};

export type CurriculumChapter = {
  id: string | null;
  number: number;
  roman: string;
  title: string;
  lessons: CurriculumLesson[];
};

/**
 * - "database": đọc từ Supabase.
 * - "catalog": Supabase chưa được cấu hình → hiển thị mục lục chuẩn trong mã nguồn,
 *   giao diện phải ghi rõ đây là dữ liệu tĩnh, chưa kết nối database.
 */
export type CurriculumSource = "database" | "catalog";

export type CurriculumResult =
  | { ok: true; source: CurriculumSource; chapters: CurriculumChapter[] }
  | { ok: false; error: string };

export function formatLessonLabel(lesson: Pick<CurriculumLesson, "number" | "title">) {
  return `Bài ${lesson.number}. ${lesson.title}.`;
}

export function formatChapterLabel(chapter: Pick<CurriculumChapter, "roman" | "title">) {
  return `Chương ${chapter.roman}. ${chapter.title}`;
}

export function countLessons(chapters: CurriculumChapter[]) {
  return chapters.reduce((sum, c) => sum + c.lessons.length, 0);
}
