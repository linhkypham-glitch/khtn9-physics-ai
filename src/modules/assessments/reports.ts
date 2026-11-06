import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LEVEL_LABELS, TYPE_LABELS, type CognitiveLevel, type QuestionType } from "@/modules/question-bank/types";
import { describeScores, suggestComment, type TopicStat } from "./logic";

export class ReportError extends Error {}

type Detail = { q: string; s: "correct" | "partial" | "wrong" | "blank"; e: number; m: number; a?: string; c?: string; cu?: number; tu?: number };
type QMeta = { id: string; content: string; type: QuestionType; level: CognitiveLevel; lessonNumber: number; lessonTitle: string; chapterNumber: number; chapterRoman: string; chapterTitle: string };

async function staffClient() {
  const supabase = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();
  if (!supabase || !admin) throw new ReportError("Hệ thống chưa cấu hình đầy đủ.");
  return { supabase, admin };
}

async function loadQuestionMeta(ids: string[]): Promise<Map<string, QMeta>> {
  const admin = createSupabaseAdminClient();
  const map = new Map<string, QMeta>();
  if (!admin || !ids.length) return map;
  const { data } = await admin
    .from("question_bank")
    .select("id, content, type, level, lessons!inner(number, title, chapters!inner(number, roman, title))")
    .in("id", [...new Set(ids)]);
  for (const q of data ?? []) {
    map.set(q.id, {
      id: q.id,
      content: q.content,
      type: q.type,
      level: q.level,
      lessonNumber: q.lessons.number,
      lessonTitle: q.lessons.title,
      chapterNumber: q.lessons.chapters.number,
      chapterRoman: q.lessons.chapters.roman,
      chapterTitle: q.lessons.chapters.title,
    });
  }
  return map;
}

/** Tổng hợp tỉ lệ đúng (theo đơn vị trả lời) theo chương, mức độ, dạng câu, bài học. */
export function aggregateDetails(details: Detail[], meta: Map<string, QMeta>) {
  const groups = { chapter: new Map<string, TopicStat & { order: number }>(), level: new Map<string, TopicStat & { order: number }>(), type: new Map<string, TopicStat & { order: number }>(), lesson: new Map<string, TopicStat & { order: number }>() };
  const add = (m: Map<string, TopicStat & { order: number }>, label: string, order: number, c: number, t: number) => {
    const g = m.get(label) ?? { label, correct: 0, total: 0, order };
    g.correct += c;
    g.total += t;
    m.set(label, g);
  };
  for (const d of details) {
    const q = meta.get(d.q);
    if (!q) continue;
    const t = d.tu ?? (q.type === "true_false" ? 4 : 1);
    const c = d.cu ?? (d.s === "correct" ? t : 0);
    add(groups.chapter, `Chương ${q.chapterRoman}. ${q.chapterTitle}`, q.chapterNumber, c, t);
    add(groups.level, LEVEL_LABELS[q.level], ["biet", "hieu", "van_dung"].indexOf(q.level), c, t);
    add(groups.type, TYPE_LABELS[q.type], ["multiple_choice", "true_false", "short_answer", "essay"].indexOf(q.type), c, t);
    add(groups.lesson, `Bài ${q.lessonNumber}. ${q.lessonTitle}`, q.lessonNumber, c, t);
  }
  const list = (m: Map<string, TopicStat & { order: number }>) => [...m.values()].sort((a, b) => a.order - b.order).map(({ label, correct, total }) => ({ label, correct, total }));
  return { byChapter: list(groups.chapter), byLevel: list(groups.level), byType: list(groups.type), byLesson: list(groups.lesson) };
}

export type AssignmentReport = Awaited<ReturnType<typeof getAssignmentReport>>;

/** Báo cáo một bài giao (giáo viên của lớp / admin). */
export async function getAssignmentReport(assignmentId: string) {
  const { supabase, admin } = await staffClient();
  const { data: asg } = await supabase
    .from("assessment_assignments")
    .select("id, code, class_id, assessment_id, start_at, due_at, max_attempts, show_answers, show_leaderboard, is_closed, created_at, classes(name), assessments(title, duration_minutes)")
    .eq("id", assignmentId)
    .maybeSingle();
  if (!asg) throw new ReportError("Không tìm thấy bài giao hoặc bạn không phụ trách lớp này.");

  const [{ data: members }, { data: attempts }, { data: aqs }] = await Promise.all([
    admin.from("class_members").select("user_id, profiles!inner(full_name, student_code)").eq("class_id", asg.class_id).eq("member_role", "student"),
    admin.from("assessment_attempts").select("id, user_id, attempt_no, status, score, started_at, submitted_at, correct_units, total_units, details").eq("assignment_id", assignmentId).order("attempt_no"),
    admin.from("assessment_questions").select("question_id, points, sort_order").eq("assessment_id", asg.assessment_id).order("sort_order"),
  ]);
  const meta = await loadQuestionMeta((aqs ?? []).map((q) => q.question_id));

  const students = (members ?? [])
    .map((m) => {
      const mine = (attempts ?? []).filter((a) => a.user_id === m.user_id);
      const submitted = mine.filter((a) => a.status === "submitted");
      const best = submitted.reduce<(typeof submitted)[number] | null>((b, a) => (!b || Number(a.score) > Number(b.score) ? a : b), null);
      return {
        id: m.user_id,
        fullName: m.profiles.full_name,
        studentCode: m.profiles.student_code,
        status: best ? ("submitted" as const) : mine.some((a) => a.status === "in_progress") ? ("in_progress" as const) : ("not_started" as const),
        attempts: mine.length,
        score: best ? Number(best.score) : null,
        correctUnits: best?.correct_units ?? null,
        totalUnits: best?.total_units ?? null,
        durationSeconds: best?.submitted_at ? Math.round((new Date(best.submitted_at).getTime() - new Date(best.started_at).getTime()) / 1000) : null,
        submittedAt: best?.submitted_at ?? null,
        details: (best?.details as Detail[] | undefined) ?? [],
      };
    })
    .sort((a, b) => a.fullName.split(" ").at(-1)!.localeCompare(b.fullName.split(" ").at(-1)!, "vi"));

  const done = students.filter((s) => s.status === "submitted");
  const allDetails = done.flatMap((s) => s.details);
  const questionStats = (aqs ?? []).map((aq, i) => {
    const ds = allDetails.filter((d) => d.q === aq.question_id);
    const m = meta.get(aq.question_id);
    const earned = ds.reduce((s, d) => s + d.e, 0);
    const max = ds.reduce((s, d) => s + d.m, 0);
    return {
      index: i + 1,
      id: aq.question_id,
      content: m?.content ?? "",
      type: m?.type ?? "multiple_choice",
      level: m?.level ?? "biet",
      lesson: m ? `Bài ${m.lessonNumber}` : "",
      points: Number(aq.points),
      answered: ds.filter((d) => d.s !== "blank").length,
      correctRate: max > 0 ? (earned / max) * 100 : null,
    };
  });

  return {
    assignment: {
      id: asg.id,
      code: asg.code,
      title: asg.assessments?.title ?? "",
      className: asg.classes?.name ?? "",
      durationMinutes: asg.assessments?.duration_minutes ?? 0,
      startAt: asg.start_at,
      dueAt: asg.due_at,
      maxAttempts: asg.max_attempts,
      showAnswers: asg.show_answers,
      isClosed: asg.is_closed,
      showLeaderboard: asg.show_leaderboard,
      assessmentId: asg.assessment_id,
      createdAt: asg.created_at,
    },
    students,
    stats: { ...describeScores(done.map((s) => s.score!)), completionRate: students.length ? (done.length / students.length) * 100 : 0, total: students.length },
    questionStats,
    groups: aggregateDetails(allDetails, meta),
  };
}

export type StudentReport = Awaited<ReturnType<typeof getStudentReport>>;

/** Hồ sơ học tập của một học sinh (giáo viên dạy học sinh đó / admin). */
export async function getStudentReport(studentId: string) {
  const { supabase, admin } = await staffClient();
  const { data: profile } = await supabase.from("profiles").select("id, full_name, student_code, role").eq("id", studentId).maybeSingle();
  if (!profile || profile.role !== "student") throw new ReportError("Không tìm thấy học sinh hoặc bạn không dạy học sinh này.");

  const [{ data: classes }, { data: attempts }, { data: practice }, { count: labRuns }, { data: comments }] = await Promise.all([
    admin.from("class_members").select("classes(name)").eq("user_id", studentId).eq("member_role", "student"),
    admin
      .from("assessment_attempts")
      .select("id, attempt_no, score, started_at, submitted_at, correct_units, total_units, details, assessment_assignments!inner(id, code, due_at, assessments(title))")
      .eq("user_id", studentId)
      .eq("status", "submitted")
      .order("submitted_at"),
    admin.from("practice_attempts").select("score, submitted_at, details, lessons(number, title)").eq("user_id", studentId).eq("mode", "self_assessment").order("submitted_at"),
    admin.from("experiment_attempts").select("id", { count: "exact", head: true }).eq("user_id", studentId),
    supabase.from("student_comments").select("id, content, created_at, teacher_id, assignment_id, profiles!student_comments_teacher_id_fkey(full_name)").eq("student_id", studentId).order("created_at", { ascending: false }),
  ]);

  const allDetails: Detail[] = [
    ...(attempts ?? []).flatMap((a) => (a.details as Detail[]) ?? []),
    ...(practice ?? []).flatMap((p) => ((p.details as { q: string; s: Detail["s"]; e: number; m: number }[]) ?? []).map((d) => ({ ...d }))),
  ];
  const meta = await loadQuestionMeta(allDetails.map((d) => d.q));
  const groups = aggregateDetails(allDetails, meta);
  const assessmentScores = (attempts ?? []).map((a) => Number(a.score));
  const name = profile.full_name;

  return {
    student: { id: profile.id, fullName: name, studentCode: profile.student_code, classNames: (classes ?? []).map((c) => c.classes?.name).filter(Boolean) as string[] },
    assessments: (attempts ?? []).map((a) => ({
      id: a.id,
      title: a.assessment_assignments.assessments?.title ?? "",
      code: a.assessment_assignments.code,
      attemptNo: a.attempt_no,
      score: Number(a.score),
      correctUnits: a.correct_units,
      totalUnits: a.total_units,
      submittedAt: a.submitted_at!,
      durationSeconds: a.submitted_at ? Math.round((new Date(a.submitted_at).getTime() - new Date(a.started_at).getTime()) / 1000) : null,
    })),
    practice: (practice ?? []).map((p) => ({ lesson: p.lessons ? `Bài ${p.lessons.number}. ${p.lessons.title}` : "", score: Number(p.score), submittedAt: p.submitted_at })),
    labRuns: labRuns ?? 0,
    groups,
    stats: describeScores(assessmentScores),
    suggestion: suggestComment(name, { scores: assessmentScores.length ? assessmentScores : (practice ?? []).map((p) => Number(p.score)), ...groups }),
    comments: (comments ?? []).map((c) => ({ id: c.id, content: c.content, createdAt: c.created_at, teacherId: c.teacher_id, teacherName: c.profiles?.full_name ?? "", assignmentId: c.assignment_id })),
  };
}
