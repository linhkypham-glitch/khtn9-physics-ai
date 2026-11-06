import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { QuestionInput } from "./input-schema";

export async function loadLessonsForEditor() {
  const supabase = await createSupabaseServerClient();
  const { data } = supabase ? await supabase.from("lessons").select("id, number, title").order("number") : { data: [] };
  return data ?? [];
}

/** Tải câu hỏi (kèm đáp án) để giáo viên sửa – qua RLS (chỉ giáo viên, admin). */
export async function loadQuestionForEdit(id: string): Promise<QuestionInput | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data: q } = await supabase
    .from("question_bank")
    .select("id, lesson_id, type, level, content, answer_number, tolerance, unit, explanation, formula, remember, status, question_options(label, content, is_correct), question_subitems(label, content, is_true, explanation)")
    .eq("id", id)
    .maybeSingle();
  if (!q || q.type === "essay") return null;
  const opts = [...q.question_options].sort((a, b) => a.label.localeCompare(b.label));
  const items = [...q.question_subitems].sort((a, b) => a.label.localeCompare(b.label));
  return {
    id: q.id,
    lessonId: q.lesson_id,
    type: q.type,
    level: q.level,
    content: q.content,
    options: [0, 1, 2, 3].map((i) => opts[i]?.content ?? ""),
    correct: (opts.find((o) => o.is_correct)?.label as "A" | "B" | "C" | "D" | undefined) ?? null,
    items: [0, 1, 2, 3].map((i) => ({ content: items[i]?.content ?? "", isTrue: items[i]?.is_true ?? true, explanation: items[i]?.explanation ?? "" })),
    answerNumber: q.answer_number === null ? null : Number(q.answer_number),
    tolerance: Number(q.tolerance),
    unit: q.unit,
    explanation: q.explanation,
    formula: q.formula,
    remember: q.remember,
    publish: q.status === "published" || q.status === "approved",
  };
}
