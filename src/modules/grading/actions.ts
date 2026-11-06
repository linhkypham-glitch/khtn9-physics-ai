"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { loadLessonQuestions } from "@/modules/question-bank/repository";
import type { QuestionResult, StudentAnswer } from "@/modules/question-bank/types";
import { gradeQuestion, summarize } from "./grade";

const answerSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("multiple_choice"), choice: z.enum(["A", "B", "C", "D"]).nullable() }),
  z.object({ type: z.literal("true_false"), items: z.record(z.enum(["a", "b", "c", "d"]), z.boolean().nullable()) }),
  z.object({ type: z.literal("short_answer"), text: z.string().max(200) }),
]);
const answersSchema = z.record(z.guid(), answerSchema);

/** Luyện tập: kiểm tra từng câu (không lưu điểm). */
export async function checkPracticeAnswer(
  lessonId: string,
  questionId: string,
  answer: StudentAnswer,
): Promise<{ ok: true; result: QuestionResult } | { ok: false; error: string }> {
  const parsedAnswer = answerSchema.safeParse(answer);
  if (!z.guid().safeParse(lessonId).success || !z.guid().safeParse(questionId).success || !parsedAnswer.success) {
    return { ok: false, error: "Dữ liệu không hợp lệ." };
  }
  const questions = await loadLessonQuestions(lessonId, [questionId]);
  if (!questions?.length) return { ok: false, error: "Không tìm thấy câu hỏi." };
  return { ok: true, result: gradeQuestion(questions[0], parsedAnswer.data) };
}

export type SubmitResult =
  | { ok: true; saved: boolean; results: QuestionResult[]; summary: ReturnType<typeof summarize> }
  | { ok: false; error: string };

/** Tự đánh giá: chấm toàn bộ bài ở máy chủ và lưu kết quả cho người dùng hiện tại. */
export async function submitSelfAssessment(lessonId: string, answers: Record<string, StudentAnswer>, durationSeconds: number): Promise<SubmitResult> {
  const parsed = answersSchema.safeParse(answers);
  if (!z.guid().safeParse(lessonId).success || !parsed.success) return { ok: false, error: "Dữ liệu bài làm không hợp lệ." };

  const questions = await loadLessonQuestions(lessonId);
  if (!questions) return { ok: false, error: "Chưa tải được câu hỏi (máy chủ chưa cấu hình SUPABASE_SECRET_KEY)." };
  if (questions.length === 0) return { ok: false, error: "Bài học chưa có câu hỏi." };

  const results = questions.map((q) => gradeQuestion(q, parsed.data[q.id]));
  const summary = summarize(results);

  const user = await getCurrentUser();
  let saved = false;
  if (user) {
    const admin = createSupabaseAdminClient();
    const res = await admin?.from("practice_attempts").insert({
      user_id: user.id,
      lesson_id: lessonId,
      mode: "self_assessment",
      score: summary.score10,
      correct_units: summary.correctUnits,
      total_units: summary.totalUnits,
      duration_seconds: Math.max(0, Math.min(Math.round(durationSeconds), 6 * 3600)),
      details: results.map((r) => ({ q: r.questionId, s: r.status, e: r.earned, m: r.max })),
    });
    saved = Boolean(res && !res.error);
    if (res?.error) console.error("[grading] save attempt", res.error);
    revalidatePath("/student", "layout");
  }
  return { ok: true, saved, results, summary };
}
