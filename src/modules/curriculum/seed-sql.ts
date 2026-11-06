import { CURRICULUM, TEXTBOOK, type CatalogChapter } from "./catalog.ts";

/** Escape chuỗi cho SQL literal. */
function q(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

/**
 * Sinh nội dung file seed chương trình học từ danh mục chuẩn.
 * Seed có tính idempotent (chạy lại nhiều lần không tạo bản ghi trùng).
 */
export function buildCurriculumSeedSql(curriculum: CatalogChapter[] = CURRICULUM): string {
  const lines: string[] = [];
  lines.push(
    "-- =====================================================================",
    "-- SEED CHƯƠNG TRÌNH HỌC KHTN 9 – VẬT LÝ (5 chương, 17 bài)",
    "-- File được sinh tự động từ src/modules/curriculum/catalog.ts",
    "--   npm run seed:generate",
    "-- KHÔNG sửa tay. Có thể chạy trên Supabase Cloud (SQL Editor) – idempotent.",
    "-- =====================================================================",
    "",
    "insert into public.textbooks (code, name, series, subject, grade)",
    `values (${q(TEXTBOOK.code)}, ${q(TEXTBOOK.name)}, ${q(TEXTBOOK.series)}, ${q(TEXTBOOK.subject)}, ${TEXTBOOK.grade})`,
    "on conflict (code) do update set",
    "  name = excluded.name, series = excluded.series, subject = excluded.subject, grade = excluded.grade;",
    "",
  );

  lines.push("insert into public.chapters (textbook_id, number, roman, title, sort_order)");
  lines.push("select t.id, v.number, v.roman, v.title, v.number");
  lines.push("from public.textbooks t");
  lines.push("cross join (values");
  lines.push(
    curriculum
      .map((c) => `  (${c.number}, ${q(c.roman)}, ${q(c.title)})`)
      .join(",\n"),
  );
  lines.push(") as v(number, roman, title)");
  lines.push(`where t.code = ${q(TEXTBOOK.code)}`);
  lines.push("on conflict (textbook_id, number) do update set");
  lines.push("  roman = excluded.roman, title = excluded.title, sort_order = excluded.sort_order;");
  lines.push("");

  lines.push("insert into public.lessons (chapter_id, number, title, slug, lesson_type, sort_order)");
  lines.push("select c.id, v.number, v.title, v.slug, v.lesson_type::public.lesson_type, v.number");
  lines.push("from (values");
  const lessonRows: string[] = [];
  for (const chapter of curriculum) {
    for (const lesson of chapter.lessons) {
      lessonRows.push(
        `  (${chapter.number}, ${lesson.number}, ${q(lesson.title)}, ${q(lesson.slug)}, ${q(lesson.lessonType)})`,
      );
    }
  }
  lines.push(lessonRows.join(",\n"));
  lines.push(") as v(chapter_number, number, title, slug, lesson_type)");
  lines.push("join public.chapters c on c.number = v.chapter_number");
  lines.push(`join public.textbooks t on t.id = c.textbook_id and t.code = ${q(TEXTBOOK.code)}`);
  lines.push("on conflict (slug) do update set");
  lines.push("  chapter_id = excluded.chapter_id, number = excluded.number, title = excluded.title,");
  lines.push("  lesson_type = excluded.lesson_type, sort_order = excluded.sort_order;");
  lines.push("");
  return lines.join("\n");
}
