"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Giáo viên lưu nhận xét cho học sinh (RLS: chỉ học sinh mình dạy). */
export async function addCommentAction(studentId: string, content: string, assignmentId: string | null): Promise<{ ok: boolean; message: string }> {
  const user = await getCurrentUser();
  if (!user || user.authMode !== "account" || (user.role !== "teacher" && user.role !== "admin")) return { ok: false, message: "Bạn không có quyền." };
  const text = content.trim();
  if (!z.guid().safeParse(studentId).success || (assignmentId && !z.guid().safeParse(assignmentId).success)) return { ok: false, message: "Dữ liệu không hợp lệ." };
  if (text.length < 2 || text.length > 3000) return { ok: false, message: "Nhận xét từ 2 đến 3000 ký tự." };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase!.from("student_comments").insert({ student_id: studentId, teacher_id: user.id, assignment_id: assignmentId, content: text });
  if (error) return { ok: false, message: error.code === "42501" ? "Bạn chỉ nhận xét được học sinh lớp mình dạy." : "Không lưu được nhận xét." };
  revalidatePath(`/teacher/students/${studentId}`);
  if (assignmentId) revalidatePath(`/teacher/assignments/${assignmentId}`);
  return { ok: true, message: "Đã lưu nhận xét." };
}

export async function deleteCommentAction(commentId: string, studentId: string): Promise<{ ok: boolean; message: string }> {
  const user = await getCurrentUser();
  if (!user || user.authMode !== "account" || !z.guid().safeParse(commentId).success) return { ok: false, message: "Bạn không có quyền." };
  const supabase = await createSupabaseServerClient();
  const { error, count } = await supabase!.from("student_comments").delete({ count: "exact" }).eq("id", commentId);
  if (error || !count) return { ok: false, message: "Không xoá được nhận xét." };
  revalidatePath(`/teacher/students/${studentId}`);
  return { ok: true, message: "Đã xoá nhận xét." };
}
