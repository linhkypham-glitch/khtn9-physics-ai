import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { StudentAnswer } from "@/modules/question-bank/types";

export class GradingError extends Error {}

type Detail = { q: string; s: string; e: number; m: number; a?: string; c?: string; cu?: number; tu?: number };

export type EssayItem = {
  attemptId: string;
  studentId: string;
  studentName: string;
  questionId: string;
  question: string;
  rubric: string;
  sample: string;
  maxPoints: number;
  answer: string;
  grade: { score: number; feedback: string | null; aiSuggested: number | null } | null;
};

/** Danh sách câu tự luận cần/đã chấm của một bài giao (giáo viên của lớp / admin). */
export async function listEssaysForAssignment(assignmentId: string): Promise<EssayItem[]> {
  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();
  if (!supabase || !admin) throw new GradingError("Hệ thống chưa cấu hình đầy đủ.");
  const { data: asg } = await supabase.from("assessment_assignments").select("id, assessment_id").eq("id", assignmentId).maybeSingle();
  if (!asg) throw new GradingError("Không có quyền với bài giao này.");

  const { data: essays } = await admin
    .from("assessment_questions")
    .select("points, question_bank!inner(id, content, rubric, explanation, type)")
    .eq("assessment_id", asg.assessment_id)
    .eq("question_bank.type", "essay")
    .order("sort_order");
  if (!essays?.length) return [];

  const { data: attempts } = await admin
    .from("assessment_attempts")
    .select("id, user_id, answers, profiles(full_name)")
    .eq("assignment_id", assignmentId)
    .eq("status", "submitted")
    .order("submitted_at");
  const ids = (attempts ?? []).map((a) => a.id);
  const { data: grades } = ids.length ? await admin.from("essay_grades").select("attempt_id, question_id, score, feedback, ai_suggested_score").in("attempt_id", ids) : { data: [] };

  const items: EssayItem[] = [];
  for (const at of attempts ?? []) {
    const answers = at.answers as Record<string, StudentAnswer>;
    for (const e of essays) {
      const q = e.question_bank;
      const ans = answers[q.id];
      const g = (grades ?? []).find((x) => x.attempt_id === at.id && x.question_id === q.id);
      items.push({
        attemptId: at.id,
        studentId: at.user_id,
        studentName: at.profiles?.full_name ?? "",
        questionId: q.id,
        question: q.content,
        rubric: q.rubric ?? "",
        sample: q.explanation,
        maxPoints: Number(e.points),
        answer: ans && (ans.type === "essay" || ans.type === "short_answer") ? ans.text : "",
        grade: g ? { score: Number(g.score), feedback: g.feedback, aiSuggested: g.ai_suggested_score === null ? null : Number(g.ai_suggested_score) } : null,
      });
    }
  }
  return items;
}

/**
 * Lưu điểm tự luận do giáo viên chấm và tính lại điểm bài làm.
 * Quyền: giáo viên dạy học sinh (kiểm tra qua RLS của bảng bài làm) hoặc admin.
 */
export async function saveEssayGrade(input: { attemptId: string; questionId: string; score: number; feedback: string | null; aiSuggested: number | null; teacherId: string }) {
  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();
  if (!supabase || !admin) throw new GradingError("Hệ thống chưa cấu hình đầy đủ.");
  const { data: visible } = await supabase.from("assessment_attempts").select("id").eq("id", input.attemptId).maybeSingle();
  if (!visible) throw new GradingError("Bạn không có quyền chấm bài làm này.");

  const { data: at } = await admin.from("assessment_attempts").select("id, status, details, max_points").eq("id", input.attemptId).single();
  if (!at || at.status !== "submitted") throw new GradingError("Bài làm chưa được nộp.");
  const details = (at.details as Detail[]) ?? [];
  const entry = details.find((d) => d.q === input.questionId);
  if (!entry) throw new GradingError("Câu hỏi không thuộc bài làm.");
  if (!(input.score >= 0 && input.score <= entry.m)) throw new GradingError(`Điểm phải từ 0 đến ${entry.m}.`);

  const { error } = await admin.from("essay_grades").upsert({
    attempt_id: input.attemptId,
    question_id: input.questionId,
    score: input.score,
    feedback: input.feedback,
    ai_suggested_score: input.aiSuggested,
    graded_by: input.teacherId,
    graded_at: new Date().toISOString(),
  });
  if (error) throw new GradingError("Không lưu được điểm.");

  entry.e = input.score;
  entry.s = input.score >= entry.m ? "correct" : input.score <= 0 ? "wrong" : "partial";
  entry.cu = input.score >= entry.m ? 1 : 0;
  entry.tu = 1;
  const earned = details.reduce((s, d) => s + Number(d.e), 0);
  const max = Number(at.max_points) || details.reduce((s, d) => s + Number(d.m), 0);
  await admin
    .from("assessment_attempts")
    .update({
      details,
      earned_points: earned,
      score: max > 0 ? Math.round((earned / max) * 1000) / 100 : 0,
      correct_units: details.reduce((s, d) => s + (d.cu ?? 0), 0),
      needs_grading: details.some((d) => d.s === "pending"),
    })
    .eq("id", input.attemptId);
}
