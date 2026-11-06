import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { gradeQuestion, summarize } from "@/modules/grading/grade";
import { toPublic } from "@/modules/question-bank/repository";
import type { FullQuestion, PublicQuestion, QuestionResult, StudentAnswer } from "@/modules/question-bank/types";
import type { Database } from "@/types/supabase";

type Admin = SupabaseClient<Database>;
/** Thời gian ân hạn khi nộp bài (mất mạng, độ trễ). */
export const SUBMIT_GRACE_MS = 2 * 60 * 1000;

export class StudentError extends Error {}

function admin(): Admin {
  const a = createSupabaseAdminClient();
  if (!a) throw new StudentError("Máy chủ chưa cấu hình SUPABASE_SECRET_KEY.");
  return a;
}

export type StudentAssignment = {
  id: string;
  code: string;
  title: string;
  className: string;
  durationMinutes: number;
  questionCount: number;
  startAt: string;
  dueAt: string;
  maxAttempts: number;
  isClosed: boolean;
  attempts: { id: string; status: "in_progress" | "submitted"; score: number | null; submittedAt: string | null; attemptNo: number }[];
};

/** Danh sách bài được giao cho các lớp của học sinh. `userId` phải đã được xác minh ở máy chủ. */
export async function listStudentAssignments(userId: string): Promise<StudentAssignment[]> {
  const db = admin();
  const { data: memberships } = await db.from("class_members").select("class_id").eq("user_id", userId).eq("member_role", "student");
  const classIds = (memberships ?? []).map((m) => m.class_id);
  if (!classIds.length) return [];
  const { data: rows } = await db
    .from("assessment_assignments")
    .select("id, code, start_at, due_at, max_attempts, is_closed, classes(name), assessments(title, duration_minutes, assessment_questions(count))")
    .in("class_id", classIds)
    .order("due_at", { ascending: false });
  const ids = (rows ?? []).map((r) => r.id);
  const { data: attempts } = ids.length
    ? await db.from("assessment_attempts").select("id, assignment_id, status, score, submitted_at, attempt_no, deadline_at, answers").eq("user_id", userId).in("assignment_id", ids)
    : { data: [] };
  // Tự nộp các bài đã hết giờ nhưng chưa nộp
  for (const at of attempts ?? []) {
    if (at.status === "in_progress" && Date.now() > new Date(at.deadline_at).getTime() + SUBMIT_GRACE_MS) {
      const r = await finalizeAttempt(db, at.id, at.answers as Record<string, StudentAnswer>);
      at.status = "submitted";
      at.score = r?.score ?? null;
      at.submitted_at = new Date().toISOString();
    }
  }
  return (rows ?? []).map((r) => ({
    id: r.id,
    code: r.code,
    title: r.assessments?.title ?? "",
    className: r.classes?.name ?? "",
    durationMinutes: r.assessments?.duration_minutes ?? 45,
    questionCount: (r.assessments?.assessment_questions as unknown as { count: number }[] | undefined)?.[0]?.count ?? 0,
    startAt: r.start_at,
    dueAt: r.due_at,
    maxAttempts: r.max_attempts,
    isClosed: r.is_closed,
    attempts: (attempts ?? [])
      .filter((a) => a.assignment_id === r.id)
      .map((a) => ({ id: a.id, status: a.status, score: a.score === null ? null : Number(a.score), submittedAt: a.submitted_at, attemptNo: a.attempt_no }))
      .sort((a, b) => a.attemptNo - b.attemptNo),
  }));
}

/** Câu hỏi của đề (đầy đủ đáp án – CHỈ dùng ở máy chủ), điểm lấy theo cấu hình của đề. */
export async function loadAssessmentQuestions(db: Admin, assessmentId: string): Promise<FullQuestion[]> {
  const { data } = await db
    .from("assessment_questions")
    .select(
      "points, sort_order, question_bank(id, type, level, content, unit, points, answer_number, answer_text, tolerance, explanation, formula, remember, question_options(label, content, is_correct), question_subitems(label, content, is_true, explanation))",
    )
    .eq("assessment_id", assessmentId)
    .order("sort_order");
  return (data ?? [])
    .filter((r) => r.question_bank)
    .map((r) => {
      const q = r.question_bank!;
      return {
        id: q.id,
        type: q.type,
        level: q.level,
        content: q.content,
        unit: q.unit,
        points: Number(r.points),
        answerNumber: q.answer_number === null ? null : Number(q.answer_number),
        answerText: q.answer_text,
        tolerance: Number(q.tolerance),
        explanation: q.explanation,
        formula: q.formula,
        remember: q.remember,
        options: [...q.question_options].sort((a, b) => a.label.localeCompare(b.label)).map((o) => ({ label: o.label, content: o.content, isCorrect: o.is_correct })),
        subitems: [...q.question_subitems].sort((a, b) => a.label.localeCompare(b.label)).map((s) => ({ label: s.label, content: s.content, isTrue: s.is_true, explanation: s.explanation })),
      };
    });
}

async function loadAssignmentForStudent(db: Admin, assignmentId: string, userId: string) {
  const { data: asg } = await db
    .from("assessment_assignments")
    .select("id, class_id, assessment_id, start_at, due_at, max_attempts, show_answers, is_closed, assessments(title, duration_minutes, description)")
    .eq("id", assignmentId)
    .maybeSingle();
  if (!asg) throw new StudentError("Không tìm thấy bài được giao.");
  const { data: member } = await db.from("class_members").select("user_id").eq("class_id", asg.class_id).eq("user_id", userId).eq("member_role", "student").maybeSingle();
  if (!member) throw new StudentError("Bài này không được giao cho lớp của em.");
  return asg;
}

/** Bắt đầu (hoặc tiếp tục) một lần làm bài. */
export async function startOrResumeAttempt(assignmentId: string, userId: string) {
  const db = admin();
  const asg = await loadAssignmentForStudent(db, assignmentId, userId);
  const now = Date.now();
  const { data: attempts } = await db.from("assessment_attempts").select("id, status, attempt_no, deadline_at, answers").eq("assignment_id", assignmentId).eq("user_id", userId).order("attempt_no");
  const open = (attempts ?? []).find((a) => a.status === "in_progress");
  if (open) {
    if (now > new Date(open.deadline_at).getTime() + SUBMIT_GRACE_MS) {
      await finalizeAttempt(db, open.id, open.answers as Record<string, StudentAnswer>);
    } else {
      return open.id;
    }
  }
  if (asg.is_closed) throw new StudentError("Giáo viên đã đóng bài này.");
  if (now < new Date(asg.start_at).getTime()) throw new StudentError("Chưa đến thời gian làm bài.");
  if (now > new Date(asg.due_at).getTime()) throw new StudentError("Đã hết hạn nộp bài.");
  const used = (attempts ?? []).length;
  if (used >= asg.max_attempts) throw new StudentError(`Em đã dùng hết ${asg.max_attempts} lần làm bài.`);
  const deadline = Math.min(now + (asg.assessments?.duration_minutes ?? 45) * 60_000, new Date(asg.due_at).getTime());
  const { data: created, error } = await db
    .from("assessment_attempts")
    .insert({ assignment_id: assignmentId, user_id: userId, attempt_no: used + 1, deadline_at: new Date(deadline).toISOString() })
    .select("id")
    .single();
  if (error || !created) throw new StudentError("Không bắt đầu được bài làm, vui lòng thử lại.");
  return created.id;
}

export type AttemptView =
  | {
      mode: "taking";
      attemptId: string;
      title: string;
      deadlineAt: string;
      questions: PublicQuestion[];
      answers: Record<string, StudentAnswer>;
    }
  | {
      mode: "result";
      attemptId: string;
      title: string;
      score: number | null;
      submittedAt: string | null;
      startedAt: string;
      summary: ReturnType<typeof summarize> | null;
      reveal: boolean;
      revealNote: string | null;
      pendingEssays: boolean;
      questions: PublicQuestion[];
      answers: Record<string, StudentAnswer>;
      results: QuestionResult[];
      assignmentId: string;
    };

/** Dữ liệu một lần làm bài cho học sinh (chủ bài làm). Đáp án chỉ trả về khi được phép. */
export async function getAttemptView(attemptId: string, userId: string): Promise<AttemptView> {
  const db = admin();
  const { data: at } = await db.from("assessment_attempts").select("*").eq("id", attemptId).eq("user_id", userId).maybeSingle();
  if (!at) throw new StudentError("Không tìm thấy bài làm.");
  const asg = await loadAssignmentForStudent(db, at.assignment_id, userId);
  const full = await loadAssessmentQuestions(db, asg.assessment_id);
  const title = asg.assessments?.title ?? "Bài kiểm tra";

  let attempt = at;
  if (at.status === "in_progress" && Date.now() > new Date(at.deadline_at).getTime() + SUBMIT_GRACE_MS) {
    await finalizeAttempt(db, at.id, at.answers as Record<string, StudentAnswer>);
    attempt = (await db.from("assessment_attempts").select("*").eq("id", attemptId).single()).data!;
  }
  if (attempt.status === "in_progress") {
    return { mode: "taking", attemptId, title, deadlineAt: attempt.deadline_at, questions: full.map(toPublic), answers: attempt.answers as Record<string, StudentAnswer> };
  }
  const dueReached = Date.now() > new Date(asg.due_at).getTime();
  const reveal = asg.show_answers === "immediately" || (asg.show_answers === "after_due" && dueReached);
  const answers = attempt.answers as Record<string, StudentAnswer>;
  const { data: essayGrades } = await db.from("essay_grades").select("question_id, score, feedback").eq("attempt_id", attemptId);
  const results = reveal ? full.map((q) => applyEssayGrade(gradeQuestion(q, answers[q.id]), essayGrades ?? [])) : [];
  return {
    mode: "result",
    attemptId,
    title,
    score: attempt.score === null ? null : Number(attempt.score),
    submittedAt: attempt.submitted_at,
    startedAt: attempt.started_at,
    summary: reveal ? summarize(results) : null,
    reveal,
    pendingEssays: Boolean(attempt.needs_grading),
    revealNote: reveal ? null : asg.show_answers === "after_due" ? "Đáp án và lời giải sẽ được công bố sau hạn nộp bài." : "Giáo viên không công bố đáp án cho bài này.",
    questions: full.map(toPublic),
    answers,
    results,
    assignmentId: asg.id,
  };
}

/** Ghép điểm tự luận giáo viên đã chấm vào kết quả câu hỏi. */
export function applyEssayGrade(r: QuestionResult, grades: { question_id: string; score: number; feedback: string | null }[]): QuestionResult {
  const g = grades.find((x) => x.question_id === r.questionId);
  if (!g) return r;
  const score = Number(g.score);
  return {
    ...r,
    earned: score,
    correctUnits: score >= r.max ? 1 : 0,
    status: score >= r.max ? "correct" : score <= 0 ? "wrong" : "partial",
    explanation: `${g.feedback ? `Nhận xét của giáo viên: ${g.feedback}\n\n` : ""}${r.explanation}`,
  };
}

/** Chấm và khoá bài làm. */
export async function finalizeAttempt(db: Admin, attemptId: string, answers: Record<string, StudentAnswer>) {
  const { data: at } = await db.from("assessment_attempts").select("id, assignment_id, status").eq("id", attemptId).single();
  if (!at || at.status !== "in_progress") return null;
  const { data: asg } = await db.from("assessment_assignments").select("assessment_id").eq("id", at.assignment_id).single();
  const full = await loadAssessmentQuestions(db, asg!.assessment_id);
  const results = full.map((q) => gradeQuestion(q, answers[q.id]));
  const s = summarize(results);
  const { error } = await db
    .from("assessment_attempts")
    .update({
      status: "submitted",
      submitted_at: new Date().toISOString(),
      answers,
      score: s.score10,
      earned_points: s.earned,
      max_points: s.max,
      correct_units: s.correctUnits,
      total_units: s.totalUnits,
      needs_grading: s.pending > 0,
      details: results.map((r) => ({ q: r.questionId, s: r.status, e: r.earned, m: r.max, a: r.studentAnswer, c: r.correctAnswer, cu: r.correctUnits, tu: r.totalUnits })),
    })
    .eq("id", attemptId)
    .eq("status", "in_progress");
  if (error) throw new StudentError("Không lưu được bài làm.");
  return { score: s.score10 };
}

/** Lưu nháp hoặc nộp bài. Sau hạn giờ + ân hạn, bài mới bị bỏ qua và bài nháp đã lưu được chấm. */
export async function saveOrSubmitAttempt(attemptId: string, userId: string, answers: Record<string, StudentAnswer>, submit: boolean) {
  const db = admin();
  const { data: at } = await db.from("assessment_attempts").select("id, status, deadline_at, answers").eq("id", attemptId).eq("user_id", userId).maybeSingle();
  if (!at) throw new StudentError("Không tìm thấy bài làm.");
  if (at.status !== "in_progress") return { submitted: true };
  const late = Date.now() > new Date(at.deadline_at).getTime() + SUBMIT_GRACE_MS;
  if (late) {
    await finalizeAttempt(db, attemptId, at.answers as Record<string, StudentAnswer>);
    return { submitted: true, late: true };
  }
  if (submit) {
    await finalizeAttempt(db, attemptId, answers);
    return { submitted: true };
  }
  await db.from("assessment_attempts").update({ answers }).eq("id", attemptId).eq("status", "in_progress");
  return { submitted: false };
}
