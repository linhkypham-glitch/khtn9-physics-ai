"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { generateQuestionsWithAi } from "@/modules/ai-generator/generate";
import { validateAiQuestions } from "@/modules/ai-generator/validate";
import { DEFAULT_STRUCTURE, pickQuestions, type AssessmentStructure, type BankItem } from "./logic";

export type ActionResult = { ok: boolean; message: string; warnings?: string[] };

async function staffCtx() {
  const user = await getCurrentUser();
  if (!user || user.authMode !== "account" || (user.role !== "teacher" && user.role !== "admin")) return null;
  const supabase = await createSupabaseServerClient();
  return supabase ? { user, supabase } : null;
}

const partSchema = z.object({ count: z.number().int().min(0).max(60), points: z.number().positive().max(10) });
const structureSchema = z.object({
  multiple_choice: partSchema,
  true_false: partSchema,
  short_answer: partSchema,
  levels: z.object({ biet: z.number().min(0).max(100), hieu: z.number().min(0).max(100), van_dung: z.number().min(0).max(100) }),
});

const createSchema = z.object({
  title: z.string().trim().min(3, "Tên đề tối thiểu 3 ký tự.").max(200),
  description: z.string().trim().max(2000).optional(),
  durationMinutes: z.number().int().min(5, "Thời gian tối thiểu 5 phút.").max(180, "Thời gian tối đa 180 phút."),
  lessonIds: z.array(z.guid()).min(1, "Chọn ít nhất một bài học."),
  structure: structureSchema,
  mode: z.enum(["manual", "auto", "ai"]),
  aiNote: z.string().trim().max(1000).optional(),
});
export type CreateAssessmentInput = z.infer<typeof createSchema>;

/** Thêm câu hỏi vào đề (bỏ qua câu đã có), đánh số thứ tự nối tiếp. */
async function appendQuestions(assessmentId: string, items: { id: string; points: number }[]) {
  const admin = createSupabaseAdminClient();
  if (!admin || !items.length) return;
  const { data: existing } = await admin.from("assessment_questions").select("question_id, sort_order").eq("assessment_id", assessmentId);
  const have = new Set((existing ?? []).map((e) => e.question_id));
  let order = Math.max(0, ...(existing ?? []).map((e) => e.sort_order));
  const rows = items.filter((i) => !have.has(i.id)).map((i) => ({ assessment_id: assessmentId, question_id: i.id, points: i.points, sort_order: ++order }));
  if (rows.length) await admin.from("assessment_questions").insert(rows);
}

async function loadBank(lessonIds: string[]): Promise<BankItem[]> {
  const admin = createSupabaseAdminClient();
  if (!admin) return [];
  const { data } = await admin
    .from("question_bank")
    .select("id, type, level, lessons!inner(number)")
    .in("lesson_id", lessonIds)
    .in("status", ["approved", "published"])
    .neq("type", "essay");
  return (data ?? []).map((q) => ({ id: q.id, type: q.type, level: q.level, lessonNumber: q.lessons.number }));
}

/** Dùng AI soạn câu hỏi mới → kiểm tra chất lượng → lưu vào ngân hàng ở trạng thái NHÁP → thêm vào đề. */
async function runAiGeneration(
  assessmentId: string,
  userId: string,
  lessonIds: string[],
  counts: { multiple_choice: number; true_false: number; short_answer: number },
  structure: AssessmentStructure,
  note?: string,
): Promise<ActionResult> {
  const admin = createSupabaseAdminClient();
  if (!admin) return { ok: false, message: "Máy chủ chưa cấu hình SUPABASE_SECRET_KEY." };
  const total = counts.multiple_choice + counts.true_false + counts.short_answer;
  if (total === 0) return { ok: false, message: "Chọn số câu cần AI tạo." };
  if (total > 30) return { ok: false, message: "Mỗi lần AI tạo tối đa 30 câu." };

  const { data: lessons } = await admin
    .from("lessons")
    .select("id, number, title, learning_objectives(content), lesson_materials(title, body, section, is_published)")
    .in("id", lessonIds)
    .order("number");
  const { data: existing } = await admin.from("question_bank").select("content").in("lesson_id", lessonIds);
  const ctx = (lessons ?? []).map((l) => ({
    number: l.number,
    title: l.title,
    objectives: l.learning_objectives.map((o) => o.content),
    knowledge: l.lesson_materials
      .filter((m) => m.section === "knowledge" && m.is_published)
      .map((m) => `${m.title}\n${m.body ?? ""}`)
      .join("\n\n")
      .slice(0, 8000),
  }));

  const res = await generateQuestionsWithAi({ lessons: ctx, counts, levels: structure.levels, existingQuestions: (existing ?? []).map((e) => e.content), note });
  if (!res.ok) {
    await admin.from("ai_generation_jobs").insert({ created_by: userId, assessment_id: assessmentId, provider: "anthropic", request: { counts, lessonIds }, status: "failed", error: res.error });
    return { ok: false, message: res.error };
  }

  const lessonByNumber = new Map(ctx.map((l, i) => [l.number, (lessons ?? [])[i].id]));
  const report = validateAiQuestions(res.questions, { lessonNumbers: [...lessonByNumber.keys()], existing: (existing ?? []).map((e) => e.content) });
  const newIds: { id: string; points: number }[] = [];
  for (const q of report.valid) {
    const { data: row, error } = await admin
      .from("question_bank")
      .insert({
        lesson_id: lessonByNumber.get(q.lesson_number)!,
        type: q.type,
        level: q.level,
        content: q.content,
        answer_number: q.type === "short_answer" ? q.answer_number : null,
        tolerance: q.type === "short_answer" ? (q.tolerance ?? 0) : 0,
        unit: q.type === "short_answer" ? q.unit : null,
        explanation: q.explanation,
        formula: q.formula,
        remember: q.remember,
        source: `AI (${res.model})`,
        status: "draft",
        created_by: userId,
        sort_order: 200,
      })
      .select("id")
      .single();
    if (error || !row) continue;
    if (q.type === "multiple_choice" && q.options) {
      await admin.from("question_options").insert(q.options.map((content, i) => ({ question_id: row.id, label: "ABCD"[i], content, is_correct: "ABCD"[i] === q.correct })));
    }
    if (q.type === "true_false" && q.items) {
      await admin.from("question_subitems").insert(q.items.map((it, i) => ({ question_id: row.id, label: "abcd"[i], content: it.content, is_true: it.is_true, explanation: it.explanation })));
    }
    newIds.push({ id: row.id, points: structure[q.type].points });
  }
  await appendQuestions(assessmentId, newIds);
  const warnings = report.rejected.map((r) => `Loại 1 câu: ${r.reason}`);
  await admin.from("ai_generation_jobs").insert({
    created_by: userId,
    assessment_id: assessmentId,
    provider: "anthropic",
    model: res.model,
    request: { counts, lessonIds, levels: structure.levels },
    status: "succeeded",
    question_ids: newIds.map((n) => n.id),
    warnings,
  });
  return {
    ok: true,
    message: `AI đã tạo ${newIds.length} câu hỏi (trạng thái NHÁP). Hãy kiểm tra, sửa nếu cần và bấm “Duyệt” trước khi xuất bản đề.`,
    warnings,
  };
}

export async function createAssessmentAction(input: CreateAssessmentInput): Promise<ActionResult> {
  const ctx = await staffCtx();
  if (!ctx) return { ok: false, message: "Bạn không có quyền thực hiện thao tác này." };
  const parsed = createSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const d = parsed.data;

  const { data: a, error } = await ctx.supabase
    .from("assessments")
    .insert({
      title: d.title,
      description: d.description || null,
      duration_minutes: d.durationMinutes,
      lesson_ids: d.lessonIds,
      structure: d.structure,
      source: d.mode,
      created_by: ctx.user.id,
    })
    .select("id")
    .single();
  if (error || !a) return { ok: false, message: "Không tạo được đề kiểm tra." };

  let warnings: string[] = [];
  if (d.mode === "auto") {
    const { picked, warnings: w } = pickQuestions(await loadBank(d.lessonIds), d.structure);
    await appendQuestions(a.id, picked);
    warnings = w;
  } else if (d.mode === "ai") {
    const r = await runAiGeneration(a.id, ctx.user.id, d.lessonIds, { multiple_choice: d.structure.multiple_choice.count, true_false: d.structure.true_false.count, short_answer: d.structure.short_answer.count }, d.structure, d.aiNote);
    warnings = [r.message, ...(r.warnings ?? [])];
  }
  const qs = warnings.length ? `?w=${encodeURIComponent(warnings.slice(0, 6).join("\n"))}` : "";
  redirect(`/teacher/assessments/${a.id}${qs}`);
}

async function ownAssessment(id: string) {
  const ctx = await staffCtx();
  if (!ctx || !z.guid().safeParse(id).success) return null;
  const { data } = await ctx.supabase.from("assessments").select("id, status, lesson_ids, structure, created_by").eq("id", id).maybeSingle();
  if (!data || (data.created_by !== ctx.user.id && ctx.user.role !== "admin")) return null;
  return { ...ctx, assessment: data };
}

export async function addQuestionToAssessment(assessmentId: string, questionId: string, points: number): Promise<ActionResult> {
  const c = await ownAssessment(assessmentId);
  if (!c) return { ok: false, message: "Không có quyền sửa đề này." };
  if (c.assessment.status !== "draft") return { ok: false, message: "Đề đã xuất bản – không thể sửa câu hỏi." };
  await appendQuestions(assessmentId, [{ id: questionId, points: Math.min(10, Math.max(0.05, points)) }]);
  revalidatePath(`/teacher/assessments/${assessmentId}`);
  return { ok: true, message: "Đã thêm câu hỏi vào đề." };
}

export async function autoFillAssessment(assessmentId: string): Promise<ActionResult> {
  const c = await ownAssessment(assessmentId);
  if (!c) return { ok: false, message: "Không có quyền sửa đề này." };
  if (c.assessment.status !== "draft") return { ok: false, message: "Đề đã xuất bản." };
  const structure = { ...DEFAULT_STRUCTURE, ...(c.assessment.structure as Partial<AssessmentStructure>) } as AssessmentStructure;
  const { data: current } = await c.supabase.from("assessment_questions").select("question_id, question_bank(type)").eq("assessment_id", assessmentId);
  const have = { multiple_choice: 0, true_false: 0, short_answer: 0, essay: 0 };
  (current ?? []).forEach((q) => q.question_bank && have[q.question_bank.type]++);
  const remaining: AssessmentStructure = {
    ...structure,
    multiple_choice: { ...structure.multiple_choice, count: Math.max(0, structure.multiple_choice.count - have.multiple_choice) },
    true_false: { ...structure.true_false, count: Math.max(0, structure.true_false.count - have.true_false) },
    short_answer: { ...structure.short_answer, count: Math.max(0, structure.short_answer.count - have.short_answer) },
  };
  const { picked, warnings } = pickQuestions(await loadBank(c.assessment.lesson_ids), remaining, new Set((current ?? []).map((q) => q.question_id)));
  await appendQuestions(assessmentId, picked);
  revalidatePath(`/teacher/assessments/${assessmentId}`);
  return { ok: true, message: picked.length ? `Đã thêm ${picked.length} câu cho đủ cấu trúc đề.` : "Đề đã đủ cấu trúc.", warnings };
}

export async function aiGenerateForAssessment(
  assessmentId: string,
  counts: { multiple_choice: number; true_false: number; short_answer: number },
  note: string,
): Promise<ActionResult> {
  const c = await ownAssessment(assessmentId);
  if (!c) return { ok: false, message: "Không có quyền sửa đề này." };
  if (c.assessment.status !== "draft") return { ok: false, message: "Đề đã xuất bản." };
  const structure = { ...DEFAULT_STRUCTURE, ...(c.assessment.structure as Partial<AssessmentStructure>) } as AssessmentStructure;
  const r = await runAiGeneration(assessmentId, c.user.id, c.assessment.lesson_ids, counts, structure, note.slice(0, 1000));
  revalidatePath(`/teacher/assessments/${assessmentId}`);
  return r;
}

export async function removeQuestionFromAssessment(assessmentId: string, questionId: string): Promise<ActionResult> {
  const c = await ownAssessment(assessmentId);
  if (!c) return { ok: false, message: "Không có quyền sửa đề này." };
  if (c.assessment.status !== "draft") return { ok: false, message: "Đề đã xuất bản." };
  await c.supabase.from("assessment_questions").delete().eq("assessment_id", assessmentId).eq("question_id", questionId);
  revalidatePath(`/teacher/assessments/${assessmentId}`);
  return { ok: true, message: "Đã bỏ câu hỏi khỏi đề." };
}

export async function updateQuestionInAssessment(assessmentId: string, questionId: string, patch: { points?: number; move?: -1 | 1 }): Promise<ActionResult> {
  const c = await ownAssessment(assessmentId);
  if (!c) return { ok: false, message: "Không có quyền sửa đề này." };
  if (c.assessment.status !== "draft") return { ok: false, message: "Đề đã xuất bản." };
  if (patch.points !== undefined) {
    if (!(patch.points > 0 && patch.points <= 10)) return { ok: false, message: "Điểm mỗi câu từ 0,05 đến 10." };
    await c.supabase.from("assessment_questions").update({ points: patch.points }).eq("assessment_id", assessmentId).eq("question_id", questionId);
  }
  if (patch.move) {
    const { data: list } = await c.supabase.from("assessment_questions").select("question_id, sort_order").eq("assessment_id", assessmentId).order("sort_order");
    const arr = list ?? [];
    const i = arr.findIndex((x) => x.question_id === questionId);
    const j = i + patch.move;
    if (i >= 0 && j >= 0 && j < arr.length) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      await Promise.all(arr.map((x, k) => c.supabase.from("assessment_questions").update({ sort_order: k + 1 }).eq("assessment_id", assessmentId).eq("question_id", x.question_id)));
    }
  }
  revalidatePath(`/teacher/assessments/${assessmentId}`);
  return { ok: true, message: "Đã cập nhật." };
}

/** Xuất bản đề: chỉ khi mọi câu hỏi đã được giáo viên duyệt. */
export async function setAssessmentStatus(assessmentId: string, status: "draft" | "published"): Promise<ActionResult> {
  const c = await ownAssessment(assessmentId);
  if (!c) return { ok: false, message: "Không có quyền sửa đề này." };
  if (status === "published") {
    const { data: qs } = await c.supabase.from("assessment_questions").select("question_bank(status)").eq("assessment_id", assessmentId);
    if (!qs?.length) return { ok: false, message: "Đề chưa có câu hỏi." };
    const pending = qs.filter((q) => q.question_bank && !["approved", "published"].includes(q.question_bank.status)).length;
    if (pending) return { ok: false, message: `Còn ${pending} câu hỏi chưa được duyệt (câu AI tạo). Hãy duyệt trong Ngân hàng câu hỏi trước khi xuất bản đề.` };
  } else {
    const { count } = await c.supabase.from("assessment_assignments").select("id", { count: "exact", head: true }).eq("assessment_id", assessmentId);
    if (count) return { ok: false, message: "Đề đã được giao cho lớp – không thể chuyển về nháp." };
  }
  await c.supabase.from("assessments").update({ status }).eq("id", assessmentId);
  revalidatePath(`/teacher/assessments/${assessmentId}`);
  return { ok: true, message: status === "published" ? "Đã xuất bản đề – có thể giao cho lớp." : "Đã chuyển đề về nháp." };
}

export async function deleteAssessment(assessmentId: string): Promise<ActionResult> {
  const c = await ownAssessment(assessmentId);
  if (!c) return { ok: false, message: "Không có quyền." };
  const { count } = await c.supabase.from("assessment_assignments").select("id", { count: "exact", head: true }).eq("assessment_id", assessmentId);
  if (count) return { ok: false, message: "Đề đã giao cho lớp – không thể xoá (để giữ lịch sử kết quả)." };
  await c.supabase.from("assessments").delete().eq("id", assessmentId);
  redirect("/teacher/assessments");
}

const assignSchema = z.object({
  classIds: z.array(z.guid()).min(1, "Chọn ít nhất một lớp."),
  startAt: z.string().min(1),
  dueAt: z.string().min(1),
  maxAttempts: z.number().int().min(1).max(10),
  showAnswers: z.enum(["immediately", "after_due", "never"]),
});

/** Giao đề cho các lớp (RLS: giáo viên chỉ giao được cho lớp mình phụ trách). */
export async function assignAssessment(assessmentId: string, input: z.infer<typeof assignSchema>): Promise<ActionResult> {
  const c = await ownAssessment(assessmentId);
  if (!c) return { ok: false, message: "Không có quyền giao đề này." };
  if (c.assessment.status !== "published") return { ok: false, message: "Hãy xuất bản đề trước khi giao." };
  const parsed = assignSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const start = new Date(parsed.data.startAt);
  const due = new Date(parsed.data.dueAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(due.getTime()) || due <= start) return { ok: false, message: "Hạn nộp phải sau thời gian bắt đầu." };
  const { error } = await c.supabase.from("assessment_assignments").insert(
    parsed.data.classIds.map((classId) => ({
      assessment_id: assessmentId,
      class_id: classId,
      assigned_by: c.user.id,
      start_at: start.toISOString(),
      due_at: due.toISOString(),
      max_attempts: parsed.data.maxAttempts,
      show_answers: parsed.data.showAnswers,
    })),
  );
  if (error) return { ok: false, message: error.code === "42501" ? "Bạn chỉ giao được đề cho lớp mình phụ trách." : "Không giao được bài." };
  revalidatePath(`/teacher/assessments/${assessmentId}`);
  return { ok: true, message: `Đã giao bài cho ${parsed.data.classIds.length} lớp.` };
}

export async function setAssignmentClosed(assignmentId: string, closed: boolean): Promise<ActionResult> {
  const ctx = await staffCtx();
  if (!ctx || !z.guid().safeParse(assignmentId).success) return { ok: false, message: "Không có quyền." };
  const { error, count } = await ctx.supabase.from("assessment_assignments").update({ is_closed: closed }, { count: "exact" }).eq("id", assignmentId);
  if (error || !count) return { ok: false, message: "Không cập nhật được bài giao." };
  revalidatePath(`/teacher/assignments/${assignmentId}`);
  return { ok: true, message: closed ? "Đã đóng bài giao." : "Đã mở lại bài giao." };
}
