"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { QuestionInputSchema, type QuestionInput } from "./input-schema";

export type SaveResult = { ok: true; id: string; message: string } | { ok: false; message: string };

async function staff() {
  const user = await getCurrentUser();
  if (!user || user.authMode !== "account" || (user.role !== "teacher" && user.role !== "admin")) return null;
  const supabase = await createSupabaseServerClient();
  return supabase ? { user, supabase } : null;
}

/** Thêm mới hoặc cập nhật câu hỏi (RLS: chỉ giáo viên, admin). */
export async function saveQuestionAction(input: QuestionInput): Promise<SaveResult> {
  const ctx = await staff();
  if (!ctx) return { ok: false, message: "Bạn không có quyền thực hiện thao tác này." };
  const parsed = QuestionInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const q = parsed.data;
  const { supabase, user } = ctx;

  const row = {
    lesson_id: q.lessonId,
    type: q.type,
    level: q.level,
    content: q.content,
    answer_number: q.type === "short_answer" ? q.answerNumber : null,
    tolerance: q.type === "short_answer" ? q.tolerance : 0,
    unit: q.type === "short_answer" ? q.unit || null : null,
    explanation: q.explanation,
    formula: q.formula || null,
    remember: q.remember || null,
    status: q.publish ? ("published" as const) : ("draft" as const),
  };

  let id = q.id;
  if (id) {
    const { error } = await supabase.from("question_bank").update(row).eq("id", id);
    if (error) return { ok: false, message: "Không lưu được câu hỏi." };
    await supabase.from("question_options").delete().eq("question_id", id);
    await supabase.from("question_subitems").delete().eq("question_id", id);
  } else {
    const { data, error } = await supabase
      .from("question_bank")
      .insert({ ...row, source: `Giáo viên: ${user.fullName}`, created_by: user.id, sort_order: 100 })
      .select("id")
      .single();
    if (error || !data) return { ok: false, message: "Không tạo được câu hỏi." };
    id = data.id;
  }

  if (q.type === "multiple_choice") {
    const { error } = await supabase
      .from("question_options")
      .insert(q.options.map((content, i) => ({ question_id: id!, label: "ABCD"[i], content, is_correct: "ABCD"[i] === q.correct })));
    if (error) return { ok: false, message: "Không lưu được phương án trả lời." };
  }
  if (q.type === "true_false") {
    const { error } = await supabase
      .from("question_subitems")
      .insert(q.items.map((it, i) => ({ question_id: id!, label: "abcd"[i], content: it.content, is_true: it.isTrue, explanation: it.explanation })));
    if (error) return { ok: false, message: "Không lưu được các ý đúng – sai." };
  }

  revalidatePath("/teacher/questions");
  return { ok: true, id: id!, message: q.id ? "Đã cập nhật câu hỏi." : "Đã thêm câu hỏi mới." };
}

export async function deleteQuestionAction(id: string): Promise<{ ok: boolean; message: string }> {
  const ctx = await staff();
  if (!ctx || !z.guid().safeParse(id).success) return { ok: false, message: "Không có quyền hoặc dữ liệu không hợp lệ." };
  const { error } = await ctx.supabase.from("question_bank").delete().eq("id", id);
  if (error) {
    return {
      ok: false,
      message: error.code === "23503" ? "Câu hỏi đang được dùng trong đề kiểm tra – hãy chuyển về Nháp thay vì xoá." : "Không xoá được câu hỏi.",
    };
  }
  revalidatePath("/teacher/questions");
  return { ok: true, message: "Đã xoá câu hỏi." };
}

/** Duyệt / xuất bản hoặc chuyển về nháp (câu AI tạo phải được duyệt mới dùng chính thức). */
export async function setQuestionStatusAction(id: string, status: "draft" | "approved" | "published"): Promise<{ ok: boolean; message: string }> {
  const ctx = await staff();
  if (!ctx || !z.guid().safeParse(id).success) return { ok: false, message: "Không có quyền hoặc dữ liệu không hợp lệ." };
  const { error } = await ctx.supabase.from("question_bank").update({ status }).eq("id", id);
  if (error) return { ok: false, message: "Không cập nhật được trạng thái." };
  revalidatePath("/teacher/questions");
  return { ok: true, message: status === "draft" ? "Đã chuyển về nháp." : "Đã duyệt câu hỏi." };
}
