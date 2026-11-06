import type { AiQuestion } from "./schema";

export type ValidQuestion = AiQuestion & { reason?: never };
export type ValidationReport = { valid: AiQuestion[]; rejected: { question: AiQuestion; reason: string }[] };

/** Chuẩn hoá nội dung để so trùng. */
export function normalizeText(s: string) {
  return s
    .normalize("NFC")
    .toLocaleLowerCase("vi")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Độ giống nhau Jaccard theo từ (0–1). */
export function similarity(a: string, b: string) {
  const A = new Set(normalizeText(a).split(" "));
  const B = new Set(normalizeText(b).split(" "));
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter++;
  return inter / (A.size + B.size - inter);
}

/**
 * Kiểm soát chất lượng câu hỏi AI tạo:
 * - đúng dạng, đủ trường; trắc nghiệm 4 phương án khác nhau, 1 đáp án;
 * - đúng – sai đủ 4 ý, mỗi ý có giải thích;
 * - trả lời ngắn có đáp số hợp lệ, sai số không âm;
 * - đúng phạm vi bài đã chọn; có lời giải;
 * - không trùng câu đã có và không trùng nhau.
 */
export function validateAiQuestions(questions: AiQuestion[], opts: { lessonNumbers: number[]; existing: string[] }): ValidationReport {
  const valid: AiQuestion[] = [];
  const rejected: ValidationReport["rejected"] = [];
  const seen = [...opts.existing];
  const reject = (question: AiQuestion, reason: string) => rejected.push({ question, reason });

  for (const q of questions) {
    if (!opts.lessonNumbers.includes(q.lesson_number)) {
      reject(q, `Ngoài phạm vi bài đã chọn (Bài ${q.lesson_number}).`);
      continue;
    }
    if (q.content.trim().length < 15) {
      reject(q, "Nội dung câu hỏi quá ngắn.");
      continue;
    }
    if (q.explanation.trim().length < 10) {
      reject(q, "Thiếu lời giải.");
      continue;
    }
    if (q.type === "multiple_choice") {
      const opt = (q.options ?? []).map((o) => o.trim());
      if (opt.length !== 4 || opt.some((o) => !o)) { reject(q, "Trắc nghiệm phải có đúng 4 phương án."); continue; }
      if (new Set(opt.map(normalizeText)).size !== 4) { reject(q, "Các phương án bị trùng nhau."); continue; }
      if (!q.correct) { reject(q, "Thiếu đáp án đúng."); continue; }
    } else if (q.type === "true_false") {
      const items = q.items ?? [];
      if (items.length !== 4) { reject(q, "Câu đúng – sai phải có đúng 4 ý."); continue; }
      if (items.some((i) => i.content.trim().length < 5 || i.explanation.trim().length < 5)) { reject(q, "Mỗi ý đúng – sai cần nội dung và giải thích."); continue; }
    } else if (q.type === "short_answer") {
      if (q.answer_number === null || !Number.isFinite(q.answer_number)) { reject(q, "Trả lời ngắn cần đáp số dạng số."); continue; }
      if (q.tolerance !== null && (q.tolerance < 0 || q.tolerance > Math.max(1, Math.abs(q.answer_number) * 0.1))) {
        reject(q, "Sai số cho phép không hợp lệ.");
        continue;
      }
    }
    if (seen.some((s) => similarity(s, q.content) >= 0.85)) {
      reject(q, "Trùng hoặc gần trùng câu hỏi đã có.");
      continue;
    }
    seen.push(q.content);
    valid.push(q);
  }
  return { valid, rejected };
}
