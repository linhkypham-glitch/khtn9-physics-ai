import { describe, expect, it } from "vitest";

import { gradeQuestion, parseNumberAnswer, summarize } from "@/modules/grading/grade";
import type { FullQuestion } from "@/modules/question-bank/types";

const base = { level: "biet" as const, content: "?", unit: null, points: 1, explanation: "giải thích", formula: null, remember: null, answerText: null, answerNumber: null, tolerance: 0 };

const mcq: FullQuestion = {
  ...base, id: "q1", type: "multiple_choice", subitems: [],
  options: ["A", "B", "C", "D"].map((l) => ({ label: l, content: l, isCorrect: l === "C" })),
};
const tf: FullQuestion = {
  ...base, id: "q2", type: "true_false", options: [],
  subitems: [
    { label: "a", content: "a", isTrue: true, explanation: "" },
    { label: "b", content: "b", isTrue: false, explanation: "" },
    { label: "c", content: "c", isTrue: true, explanation: "" },
    { label: "d", content: "d", isTrue: false, explanation: "" },
  ],
};
const sa: FullQuestion = { ...base, id: "q3", type: "short_answer", options: [], subitems: [], answerNumber: 0.2, tolerance: 0.001, unit: "A" };

describe("Đọc số trả lời ngắn", () => {
  it("chấp nhận dấu phẩy, dấu chấm, đơn vị, khoảng trắng", () => {
    expect(parseNumberAnswer("0,2")).toBe(0.2);
    expect(parseNumberAnswer("0.2 A")).toBe(0.2);
    expect(parseNumberAnswer(" 1 500 ")).toBe(1500);
    expect(parseNumberAnswer("3.600.000")).toBe(3600000);
    expect(parseNumberAnswer("-4,5°")).toBe(-4.5);
    expect(parseNumberAnswer("0.200")).toBe(0.2);
    expect(parseNumberAnswer("abc")).toBeNull();
  });
});

describe("Chấm điểm", () => {
  it("trắc nghiệm: đúng, sai, bỏ trống", () => {
    expect(gradeQuestion(mcq, { type: "multiple_choice", choice: "C" })).toMatchObject({ status: "correct", earned: 1, correctAnswer: "C" });
    expect(gradeQuestion(mcq, { type: "multiple_choice", choice: "A" })).toMatchObject({ status: "wrong", earned: 0 });
    expect(gradeQuestion(mcq, undefined)).toMatchObject({ status: "blank", earned: 0 });
  });

  it("đúng – sai: thang điểm 0,1 / 0,25 / 0,5 / 1", () => {
    const ans = (a: boolean | null, b: boolean | null, c: boolean | null, d: boolean | null) => ({ type: "true_false" as const, items: { a, b, c, d } });
    expect(gradeQuestion(tf, ans(true, false, true, false))).toMatchObject({ earned: 1, status: "correct", correctUnits: 4 });
    expect(gradeQuestion(tf, ans(true, false, true, true)).earned).toBe(0.5);
    expect(gradeQuestion(tf, ans(true, false, false, true)).earned).toBe(0.25);
    expect(gradeQuestion(tf, ans(true, true, false, true))).toMatchObject({ earned: 0.1, status: "partial" });
    expect(gradeQuestion(tf, ans(false, true, false, true))).toMatchObject({ earned: 0, status: "wrong" });
    expect(gradeQuestion(tf, ans(null, null, null, null))).toMatchObject({ earned: 0, status: "blank" });
  });

  it("trả lời ngắn: trong sai số được điểm", () => {
    expect(gradeQuestion(sa, { type: "short_answer", text: "0,2" }).status).toBe("correct");
    expect(gradeQuestion(sa, { type: "short_answer", text: "0.2005" }).status).toBe("correct");
    expect(gradeQuestion(sa, { type: "short_answer", text: "0,25" }).status).toBe("wrong");
    expect(gradeQuestion(sa, { type: "short_answer", text: "" }).status).toBe("blank");
    expect(gradeQuestion(sa, undefined).correctAnswer).toBe("0,2 A");
  });

  it("tổng hợp điểm thang 10", () => {
    const r = [
      gradeQuestion(mcq, { type: "multiple_choice", choice: "C" }),
      gradeQuestion(tf, { type: "true_false", items: { a: true, b: false, c: true, d: true } }),
      gradeQuestion(sa, { type: "short_answer", text: "9" }),
      gradeQuestion(mcq, undefined),
    ];
    const s = summarize(r);
    expect(s.earned).toBe(1.5);
    expect(s.max).toBe(4);
    expect(s.score10).toBe(3.75);
    expect(s).toMatchObject({ correct: 1, partial: 1, wrong: 1, blank: 1, correctUnits: 4, totalUnits: 7 });
  });
});
