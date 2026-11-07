/**
 * NỘI DUNG HOÁ HỌC 9 (Bài 18 – 35): kiến thức + thí nghiệm theo SGK.
 * Các khối "Thí nghiệm…" / "Hoạt động tìm hiểu…" trong phần biên soạn được tách sang khu vực
 * "Thí nghiệm" của bài; phần còn lại là khu vực "Kiến thức".
 */
import { BOOK_EXPERIMENTS_HOA_EXTRA } from "./book-experiments-hoa.ts";
import type { ContentBlock, LessonContent } from "./lessons";
import { LESSON_CONTENT_HOA_1 } from "./lessons-hoa-1.ts";
import { LESSON_CONTENT_HOA_2 } from "./lessons-hoa-2.ts";

const isExperiment = (b: ContentBlock) => /^(Thí nghiệm|Hoạt động tìm hiểu)/.test(b.title);
const SOURCE = [...LESSON_CONTENT_HOA_1, ...LESSON_CONTENT_HOA_2];

export const LESSON_CONTENT_HOA: LessonContent[] = SOURCE.map((l) => ({ ...l, knowledge: l.knowledge.filter((b) => !isExperiment(b)) }));

export const BOOK_EXPERIMENTS_HOA: Record<number, ContentBlock[]> = {};
for (const l of SOURCE) {
  const blocks = [...(BOOK_EXPERIMENTS_HOA_EXTRA[l.lessonNumber] ?? []), ...l.knowledge.filter(isExperiment)];
  if (blocks.length > 0) BOOK_EXPERIMENTS_HOA[l.lessonNumber] = blocks;
}
