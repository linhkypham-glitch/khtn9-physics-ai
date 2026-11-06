import type { PublicQuestion, StudentAnswer } from "./types";

/** Câu trả lời trống (dùng được cả ở máy chủ). */
export function emptyAnswerServer(q: PublicQuestion): StudentAnswer {
  if (q.type === "multiple_choice") return { type: "multiple_choice", choice: null };
  if (q.type === "true_false") return { type: "true_false", items: Object.fromEntries(q.subitems.map((s) => [s.label, null])) };
  return { type: "short_answer", text: "" };
}
