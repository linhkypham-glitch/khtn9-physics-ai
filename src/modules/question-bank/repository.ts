import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { FullQuestion, PublicQuestion } from "./types";

const SELECT =
  "id, type, level, content, unit, points, answer_number, answer_text, tolerance, explanation, formula, remember, sort_order, question_options(label, content, is_correct), question_subitems(label, content, is_true, explanation)";

type Row = {
  id: string;
  type: FullQuestion["type"];
  level: FullQuestion["level"];
  content: string;
  unit: string | null;
  points: number;
  answer_number: number | null;
  answer_text: string | null;
  tolerance: number;
  explanation: string;
  formula: string | null;
  remember: string | null;
  question_options: { label: string; content: string; is_correct: boolean }[];
  question_subitems: { label: string; content: string; is_true: boolean; explanation: string }[];
};

function toFull(r: Row): FullQuestion {
  return {
    id: r.id,
    type: r.type,
    level: r.level,
    content: r.content,
    unit: r.unit,
    points: Number(r.points),
    answerNumber: r.answer_number === null ? null : Number(r.answer_number),
    answerText: r.answer_text,
    tolerance: Number(r.tolerance),
    explanation: r.explanation,
    formula: r.formula,
    remember: r.remember,
    options: [...r.question_options].sort((a, b) => a.label.localeCompare(b.label)).map((o) => ({ label: o.label, content: o.content, isCorrect: o.is_correct })),
    subitems: [...r.question_subitems].sort((a, b) => a.label.localeCompare(b.label)).map((s) => ({ label: s.label, content: s.content, isTrue: s.is_true, explanation: s.explanation })),
  };
}

/** Lược bỏ mọi thông tin đáp án trước khi gửi xuống trình duyệt. */
export function toPublic(q: FullQuestion): PublicQuestion {
  return {
    id: q.id,
    type: q.type,
    level: q.level,
    content: q.content,
    unit: q.unit,
    points: q.points,
    options: q.options.map(({ label, content }) => ({ label, content })),
    subitems: q.subitems.map(({ label, content }) => ({ label, content })),
  };
}

/** Câu hỏi đã xuất bản của bài học (đầy đủ đáp án – CHỈ dùng phía máy chủ). */
export async function loadLessonQuestions(lessonId: string, ids?: string[]): Promise<FullQuestion[] | null> {
  const admin = createSupabaseAdminClient();
  if (!admin) return null;
  let query = admin.from("question_bank").select(SELECT).eq("lesson_id", lessonId).eq("status", "published").neq("type", "essay");
  if (ids) query = query.in("id", ids);
  const { data, error } = await query.order("sort_order");
  if (error) {
    console.error("[question-bank] loadLessonQuestions", error);
    return null;
  }
  return (data as unknown as Row[]).map(toFull);
}

export async function loadPublicLessonQuestions(lessonId: string): Promise<PublicQuestion[] | null> {
  const full = await loadLessonQuestions(lessonId);
  return full ? full.map(toPublic) : null;
}
