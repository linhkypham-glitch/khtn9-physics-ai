"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth/session";
import { suggestEssayScore, writeStudentComment } from "@/modules/ai-generator/assist";
import { GradingError, listEssaysForAssignment, saveEssayGrade } from "./essay-grading";
import { getStudentReport, ReportError } from "./reports";

async function staff() {
  const user = await getCurrentUser();
  if (!user || user.authMode !== "account" || (user.role !== "teacher" && user.role !== "admin")) return null;
  return user;
}

/** Giáo viên lưu điểm tự luận (điểm chính thức). */
export async function gradeEssayAction(
  assignmentId: string,
  attemptId: string,
  questionId: string,
  score: number,
  feedback: string,
  aiSuggested: number | null,
): Promise<{ ok: boolean; message: string }> {
  const user = await staff();
  if (!user) return { ok: false, message: "Bạn không có quyền." };
  if (![assignmentId, attemptId, questionId].every((x) => z.guid().safeParse(x).success) || !Number.isFinite(score)) return { ok: false, message: "Dữ liệu không hợp lệ." };
  try {
    await saveEssayGrade({ attemptId, questionId, score: Math.round(score * 100) / 100, feedback: feedback.trim().slice(0, 3000) || null, aiSuggested, teacherId: user.id });
  } catch (e) {
    if (e instanceof GradingError) return { ok: false, message: e.message };
    throw e;
  }
  revalidatePath(`/teacher/assignments/${assignmentId}`);
  return { ok: true, message: "Đã lưu điểm." };
}

/** AI gợi ý điểm (KHÔNG lưu – giáo viên xem rồi tự quyết định). */
export async function suggestEssayAction(assignmentId: string, attemptId: string, questionId: string) {
  const user = await staff();
  if (!user) return { ok: false as const, error: "Bạn không có quyền." };
  try {
    const items = await listEssaysForAssignment(assignmentId);
    const item = items.find((i) => i.attemptId === attemptId && i.questionId === questionId);
    if (!item) return { ok: false as const, error: "Không tìm thấy bài làm." };
    const r = await suggestEssayScore({ question: item.question, rubric: item.rubric, sample: item.sample, answer: item.answer, maxPoints: item.maxPoints });
    return r.ok ? { ok: true as const, ...r.data } : { ok: false as const, error: r.error };
  } catch (e) {
    if (e instanceof GradingError) return { ok: false as const, error: e.message };
    throw e;
  }
}

/** AI viết bản nháp nhận xét từ dữ liệu học tập (giáo viên chỉnh sửa trước khi lưu). */
export async function aiCommentDraftAction(studentId: string) {
  const user = await staff();
  if (!user || !z.guid().safeParse(studentId).success) return { ok: false as const, error: "Bạn không có quyền." };
  try {
    const r = await getStudentReport(studentId);
    const res = await writeStudentComment({
      name: r.student.fullName,
      assessments: r.assessments.map((a) => ({ title: a.title, score: a.score, date: new Date(a.submittedAt).toLocaleDateString("vi-VN") })),
      practice: r.practice.map((p) => ({ lesson: p.lesson, score: p.score })),
      byChapter: r.groups.byChapter,
      byLevel: r.groups.byLevel,
      byType: r.groups.byType,
      labRuns: r.labRuns,
    });
    return res.ok ? { ok: true as const, comment: res.data.comment } : { ok: false as const, error: res.error };
  } catch (e) {
    if (e instanceof ReportError) return { ok: false as const, error: e.message };
    throw e;
  }
}
