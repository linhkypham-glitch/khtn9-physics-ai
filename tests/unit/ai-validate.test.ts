import { describe, expect, it } from "vitest";

import type { AiQuestion } from "@/modules/ai-generator/schema";
import { similarity, validateAiQuestions } from "@/modules/ai-generator/validate";

const base: AiQuestion = {
  type: "multiple_choice",
  lesson_number: 11,
  level: "hieu",
  content: "Khi hiệu điện thế giữa hai đầu điện trở tăng 2 lần thì cường độ dòng điện thay đổi thế nào?",
  options: ["Tăng 2 lần", "Giảm 2 lần", "Tăng 4 lần", "Không đổi"],
  correct: "A",
  items: null,
  answer_number: null,
  tolerance: null,
  unit: null,
  explanation: "Theo định luật Ohm I = U/R, R không đổi nên I tỉ lệ thuận với U.",
  formula: "I = U/R",
  remember: null,
};

describe("Kiểm soát chất lượng câu hỏi AI", () => {
  it("chấp nhận câu hợp lệ", () => {
    expect(validateAiQuestions([base], { lessonNumbers: [11], existing: [] }).valid).toHaveLength(1);
  });

  it("loại câu ngoài phạm vi bài", () => {
    const r = validateAiQuestions([{ ...base, lesson_number: 5 }], { lessonNumbers: [11], existing: [] });
    expect(r.rejected[0].reason).toContain("Ngoài phạm vi");
  });

  it("loại trắc nghiệm thiếu phương án hoặc phương án trùng", () => {
    expect(validateAiQuestions([{ ...base, options: ["a", "b", "c"] }], { lessonNumbers: [11], existing: [] }).valid).toHaveLength(0);
    expect(validateAiQuestions([{ ...base, options: ["Tăng", "tăng", "Giảm", "Không"] }], { lessonNumbers: [11], existing: [] }).valid).toHaveLength(0);
  });

  it("loại câu thiếu lời giải", () => {
    expect(validateAiQuestions([{ ...base, explanation: "" }], { lessonNumbers: [11], existing: [] }).valid).toHaveLength(0);
  });

  it("loại câu trùng ngân hàng hoặc trùng nhau", () => {
    const r = validateAiQuestions([base, { ...base }], { lessonNumbers: [11], existing: [] });
    expect(r.valid).toHaveLength(1);
    expect(r.rejected[0].reason).toContain("Trùng");
    expect(validateAiQuestions([base], { lessonNumbers: [11], existing: [base.content] }).valid).toHaveLength(0);
    expect(similarity("Định luật Ohm là gì?", "định luật ohm là gì")).toBe(1);
  });

  it("đúng – sai cần đủ 4 ý có giải thích; trả lời ngắn cần đáp số", () => {
    const tf: AiQuestion = { ...base, type: "true_false", options: null, correct: null, items: [{ content: "Ý thứ nhất", is_true: true, explanation: "vì sao vậy" }] };
    expect(validateAiQuestions([tf], { lessonNumbers: [11], existing: [] }).valid).toHaveLength(0);
    const sa: AiQuestion = { ...base, type: "short_answer", options: null, correct: null, answer_number: null };
    expect(validateAiQuestions([sa], { lessonNumbers: [11], existing: [] }).valid).toHaveLength(0);
    expect(validateAiQuestions([{ ...sa, answer_number: 0.5, tolerance: 0.01, unit: "A" }], { lessonNumbers: [11], existing: [] }).valid).toHaveLength(1);
  });
});
