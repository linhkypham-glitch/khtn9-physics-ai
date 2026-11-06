import type { FullQuestion, QuestionResult, StudentAnswer } from "@/modules/question-bank/types";

/**
 * Điểm câu Đúng – Sai theo số ý trả lời đúng (tỉ lệ của điểm câu):
 * 1 ý: 0,1 · 2 ý: 0,25 · 3 ý: 0,5 · 4 ý: 1.
 */
export const TRUE_FALSE_SCALE = [0, 0.1, 0.25, 0.5, 1] as const;

/** Đọc số từ câu trả lời học sinh: chấp nhận dấu phẩy thập phân, bỏ đơn vị. */
export function parseNumberAnswer(text: string): number | null {
  let cleaned = text.replace(/\s+/g, "");
  // "3.600.000" (nhiều dấu chấm) → dấu chấm phân cách hàng nghìn; một dấu chấm → dấu thập phân
  if (/^[-+]?\d{1,3}(\.\d{3}){2,}/.test(cleaned)) cleaned = cleaned.replace(/\./g, "");
  cleaned = cleaned.replace(",", ".");
  const m = cleaned.match(/^[-+]?(\d+(\.\d+)?|\.\d+)/);
  if (!m) return null;
  const n = Number(m[0]);
  return Number.isFinite(n) ? n : null;
}

function fmt(n: number) {
  return n.toLocaleString("vi-VN", { maximumFractionDigits: 6 });
}

export function gradeQuestion(q: FullQuestion, answer: StudentAnswer | undefined): QuestionResult {
  const base = {
    questionId: q.id,
    max: q.points,
    explanation: q.explanation,
    formula: q.formula,
    remember: q.remember,
  };

  if (q.type === "multiple_choice") {
    const correct = q.options.find((o) => o.isCorrect)?.label ?? "";
    const choice = answer?.type === "multiple_choice" ? answer.choice : null;
    const ok = choice !== null && choice === correct;
    return {
      ...base,
      status: choice === null ? "blank" : ok ? "correct" : "wrong",
      earned: ok ? q.points : 0,
      correctUnits: ok ? 1 : 0,
      totalUnits: 1,
      correctAnswer: correct,
      studentAnswer: choice ?? "",
    };
  }

  if (q.type === "true_false") {
    const given = answer?.type === "true_false" ? answer.items : {};
    const items = q.subitems.map((s) => {
      const g = given[s.label] ?? null;
      return { label: s.label, content: s.content, isTrue: s.isTrue, given: g, correct: g !== null && g === s.isTrue, explanation: s.explanation };
    });
    const k = items.filter((i) => i.correct).length;
    const answered = items.filter((i) => i.given !== null).length;
    const earned = Math.round(q.points * TRUE_FALSE_SCALE[Math.min(k, 4)] * 1000) / 1000;
    return {
      ...base,
      status: answered === 0 ? "blank" : k === items.length ? "correct" : k === 0 ? "wrong" : "partial",
      earned,
      correctUnits: k,
      totalUnits: items.length,
      correctAnswer: items.map((i) => `${i.label}) ${i.isTrue ? "Đúng" : "Sai"}`).join("; "),
      studentAnswer: items.map((i) => `${i.label}) ${i.given === null ? "—" : i.given ? "Đúng" : "Sai"}`).join("; "),
      items,
    };
  }

  if (q.type === "short_answer") {
    const text = answer?.type === "short_answer" ? answer.text.trim() : "";
    let ok = false;
    if (text) {
      if (q.answerNumber !== null) {
        const n = parseNumberAnswer(text);
        ok = n !== null && Math.abs(n - q.answerNumber) <= q.tolerance + 1e-9;
      } else if (q.answerText) {
        const norm = (s: string) => s.normalize("NFC").toLocaleLowerCase("vi").replace(/\s+/g, " ").trim();
        ok = q.answerText.split("|").some((a) => norm(a) === norm(text));
      }
    }
    const correctAnswer = q.answerNumber !== null ? `${fmt(q.answerNumber)}${q.unit ? ` ${q.unit}` : ""}` : (q.answerText ?? "").split("|")[0];
    return {
      ...base,
      status: !text ? "blank" : ok ? "correct" : "wrong",
      earned: ok ? q.points : 0,
      correctUnits: ok ? 1 : 0,
      totalUnits: 1,
      correctAnswer,
      studentAnswer: text,
    };
  }

  // Tự luận: KHÔNG tự chấm – chờ giáo viên chấm (AI chỉ được gợi ý)
  const text = answer?.type === "essay" || answer?.type === "short_answer" ? answer.text.trim() : "";
  return {
    ...base,
    status: text ? "pending" : "blank",
    earned: 0,
    correctUnits: 0,
    totalUnits: 1,
    correctAnswer: "Giáo viên chấm theo hướng dẫn",
    studentAnswer: text,
  };
}

export function summarize(results: QuestionResult[]) {
  const earned = results.reduce((s, r) => s + r.earned, 0);
  const max = results.reduce((s, r) => s + r.max, 0);
  return {
    earned,
    max,
    score10: max > 0 ? Math.round((earned / max) * 1000) / 100 : 0,
    correctUnits: results.reduce((s, r) => s + r.correctUnits, 0),
    totalUnits: results.reduce((s, r) => s + r.totalUnits, 0),
    correct: results.filter((r) => r.status === "correct").length,
    partial: results.filter((r) => r.status === "partial").length,
    wrong: results.filter((r) => r.status === "wrong").length,
    blank: results.filter((r) => r.status === "blank").length,
    pending: results.filter((r) => r.status === "pending").length,
  };
}
