import { EXPERIMENTS } from "../virtual-lab/catalog.ts";
import { QUESTIONS_CH1_CH2 } from "../question-bank/seed/chapter1-2.ts";
import { QUESTIONS_CH3_CH5 } from "../question-bank/seed/chapter3-5.ts";
import type { SeedQuestion } from "../question-bank/seed/types.ts";
import { BOOK_EXPERIMENTS } from "./content/book-experiments.ts";
import { LESSON_CONTENT } from "./content/lessons.ts";

export const ALL_SEED_QUESTIONS = [...QUESTIONS_CH1_CH2, ...QUESTIONS_CH3_CH5];

/** Escape SQL literal; null → NULL. */
function q(value: string | null | undefined): string {
  if (value === null || value === undefined) return "null";
  return `'${value.replace(/'/g, "''")}'`;
}
function num(value: number | null | undefined): string {
  return value === null || value === undefined ? "null" : String(value);
}

const HEADER = (title: string) =>
  [
    "-- =====================================================================",
    `-- ${title}`,
    "-- File được sinh tự động – npm run seed:generate. KHÔNG sửa tay.",
    "-- Idempotent: chạy lại nhiều lần không tạo bản ghi trùng.",
    "-- =====================================================================",
    "",
  ].join("\n");

const lessonIdByNumber = (n: number) =>
  `(select l.id from public.lessons l join public.chapters c on c.id = l.chapter_id join public.textbooks t on t.id = c.textbook_id where t.code = 'KHTN9-KNTT-VL' and l.number = ${n})`;

/** 03 – Nội dung kiến thức: tóm tắt, mục tiêu, yêu cầu cần đạt, học liệu. */
export function buildLessonContentSql(): string {
  const out: string[] = [HEADER("NỘI DUNG KIẾN THỨC MẪU CHO 16 BÀI HỌC")];
  for (const lc of LESSON_CONTENT) {
    const lid = lessonIdByNumber(lc.lessonNumber);
    out.push(`-- Bài ${lc.lessonNumber}`);
    out.push(`update public.lessons set summary = ${q(lc.summary)} where id = ${lid} and summary is null;`);
    const objectives = [
      ...lc.objectives.map((c, i) => ({ kind: "objective", content: c, order: i + 1 })),
      ...lc.requirements.map((c, i) => ({ kind: "requirement", content: c, order: i + 1 })),
    ];
    for (const o of objectives) {
      out.push(
        `insert into public.learning_objectives (lesson_id, kind, content, sort_order) select ${lid}, '${o.kind}', ${q(o.content)}, ${o.order} ` +
          `where not exists (select 1 from public.learning_objectives x where x.lesson_id = ${lid} and x.content = ${q(o.content)});`,
      );
    }
    lc.knowledge.forEach((m, i) => {
      out.push(
        `insert into public.lesson_materials (lesson_id, section, kind, title, body, sort_order, is_published) ` +
          `select ${lid}, 'knowledge', '${m.kind}', ${q(m.title)}, ${q(m.body)}, ${i + 1}, true ` +
          `where not exists (select 1 from public.lesson_materials x where x.lesson_id = ${lid} and x.section = 'knowledge' and x.title = ${q(m.title)});`,
      );
    });
    (BOOK_EXPERIMENTS[lc.lessonNumber] ?? []).forEach((m, i) => {
      out.push(
        `insert into public.lesson_materials (lesson_id, section, kind, title, body, sort_order, is_published) ` +
          `select ${lid}, 'experiment', '${m.kind}', ${q(m.title)}, ${q(m.body)}, ${i + 1}, true ` +
          `where not exists (select 1 from public.lesson_materials x where x.lesson_id = ${lid} and x.section = 'experiment' and x.title = ${q(m.title)});`,
      );
    });
    out.push("");
  }
  return out.join("\n");
}

function questionSql(lessonNumber: number, question: SeedQuestion, order: number): string[] {
  const lid = lessonIdByNumber(lessonNumber);
  const isShort = question.type === "short_answer";
  const lines = [
    `insert into public.question_bank (code, lesson_id, type, level, content, answer_number, tolerance, unit, explanation, formula, remember, points, source, status, sort_order) values (` +
      [
        q(question.code), lid, `'${question.type}'`, `'${question.level}'`, q(question.content),
        isShort ? num(question.answerNumber) : "null",
        isShort ? num(question.tolerance) : "0",
        isShort ? q(question.unit) : "null",
        q(question.explanation), q(question.formula), q(question.remember),
        question.type === "true_false" ? "1" : "1",
        "'PHYSICS AI – câu hỏi mẫu'", "'published'", String(order),
      ].join(", ") +
      `) on conflict (code) do update set lesson_id = excluded.lesson_id, type = excluded.type, level = excluded.level, content = excluded.content, ` +
      `answer_number = excluded.answer_number, tolerance = excluded.tolerance, unit = excluded.unit, explanation = excluded.explanation, ` +
      `formula = excluded.formula, remember = excluded.remember, sort_order = excluded.sort_order;`,
  ];
  const qid = `(select id from public.question_bank where code = ${q(question.code)})`;
  if (question.type === "multiple_choice") {
    question.options.forEach((opt, i) => {
      const label = "ABCD"[i];
      lines.push(
        `insert into public.question_options (question_id, label, content, is_correct) values (${qid}, '${label}', ${q(opt)}, ${label === question.correct}) ` +
          `on conflict (question_id, label) do update set content = excluded.content, is_correct = excluded.is_correct;`,
      );
    });
  }
  if (question.type === "true_false") {
    question.items.forEach((it, i) => {
      const label = "abcd"[i];
      lines.push(
        `insert into public.question_subitems (question_id, label, content, is_true, explanation) values (${qid}, '${label}', ${q(it.content)}, ${it.isTrue}, ${q(it.explanation)}) ` +
          `on conflict (question_id, label) do update set content = excluded.content, is_true = excluded.is_true, explanation = excluded.explanation;`,
      );
    });
  }
  return lines;
}

/** 04 – Ngân hàng câu hỏi mẫu (đã duyệt, trạng thái published). */
export function buildQuestionBankSql(): string {
  const out: string[] = [HEADER("NGÂN HÀNG CÂU HỎI MẪU – 7 CÂU MỖI BÀI")];
  for (const lq of ALL_SEED_QUESTIONS) {
    out.push(`-- Bài ${lq.lessonNumber}`);
    lq.questions.forEach((qq, i) => out.push(...questionSql(lq.lessonNumber, qq, i + 1)));
    out.push("");
  }
  return out.join("\n");
}

/** 05 – Danh mục thí nghiệm ảo. */
export function buildExperimentsSql(): string {
  const out: string[] = [HEADER("DANH MỤC THÍ NGHIỆM ẢO – 16 MÔ PHỎNG")];
  for (const e of EXPERIMENTS) {
    out.push(
      `insert into public.experiments (key, lesson_id, title, summary, sort_order) values (${q(e.key)}, ${lessonIdByNumber(e.lessonNumber)}, ${q(e.title)}, ${q(e.summary)}, 1) ` +
        `on conflict (key) do update set lesson_id = excluded.lesson_id, title = excluded.title, summary = excluded.summary;`,
    );
  }
  out.push("");
  return out.join("\n");
}
