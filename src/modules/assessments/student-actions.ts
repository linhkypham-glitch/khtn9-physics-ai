"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth/session";
import type { StudentAnswer } from "@/modules/question-bank/types";
import { saveOrSubmitAttempt, startOrResumeAttempt, StudentError } from "./student";

const answerSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("multiple_choice"), choice: z.enum(["A", "B", "C", "D"]).nullable() }),
  z.object({ type: z.literal("true_false"), items: z.record(z.enum(["a", "b", "c", "d"]), z.boolean().nullable()) }),
  z.object({ type: z.literal("short_answer"), text: z.string().max(200) }),
  z.object({ type: z.literal("essay"), text: z.string().max(5000) }),
]);
const answersSchema = z.record(z.guid(), answerSchema);

async function student() {
  const user = await getCurrentUser();
  if (!user || user.role !== "student") throw new StudentError("Hãy vào học (nhập họ tên và lớp) để làm bài.");
  return user;
}

export async function startAttemptAction(assignmentId: string): Promise<{ ok: false; message: string }> {
  let attemptId: string;
  try {
    const user = await student();
    if (!z.guid().safeParse(assignmentId).success) return { ok: false, message: "Dữ liệu không hợp lệ." };
    attemptId = await startOrResumeAttempt(assignmentId, user.id);
  } catch (e) {
    if (e instanceof StudentError) return { ok: false, message: e.message };
    console.error("[assessments] start", e);
    return { ok: false, message: "Đã xảy ra lỗi, vui lòng thử lại." };
  }
  redirect(`/student/attempts/${attemptId}`);
}

export async function saveAttemptAction(attemptId: string, answers: Record<string, StudentAnswer>, submit: boolean) {
  try {
    const user = await student();
    const parsed = answersSchema.safeParse(answers);
    if (!z.guid().safeParse(attemptId).success || !parsed.success) return { ok: false as const, message: "Dữ liệu bài làm không hợp lệ." };
    const r = await saveOrSubmitAttempt(attemptId, user.id, parsed.data, submit);
    return { ok: true as const, ...r };
  } catch (e) {
    if (e instanceof StudentError) return { ok: false as const, message: e.message };
    console.error("[assessments] save", e);
    return { ok: false as const, message: "Không lưu được – kiểm tra kết nối mạng." };
  }
}
