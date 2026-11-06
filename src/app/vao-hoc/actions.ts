"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createStudentToken, isStudentSessionAvailable, STUDENT_COOKIE, studentCookieOptions } from "@/lib/auth/student-session";
import { enterClassSchema } from "@/lib/validation/auth";
import { enterClassAsStudent, ServiceError } from "@/modules/classes/service";

export type EnterState = {
  error: string | null;
  fieldErrors?: { fullName?: string; className?: string };
  values?: { fullName: string; className: string };
};

export async function enterClassAction(_prev: EnterState, formData: FormData): Promise<EnterState> {
  const values = { fullName: String(formData.get("fullName") ?? ""), className: String(formData.get("className") ?? "") };
  const parsed = enterClassSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: EnterState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if ((key === "fullName" || key === "className") && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: null, fieldErrors, values };
  }
  if (!isStudentSessionAvailable()) {
    return { error: "Máy chủ chưa được cấu hình đầy đủ (thiếu SUPABASE_SECRET_KEY). Vui lòng báo giáo viên.", values };
  }

  try {
    const result = await enterClassAsStudent(parsed.data.fullName, parsed.data.className);
    (await cookies()).set(STUDENT_COOKIE, createStudentToken(result.studentId), studentCookieOptions);
  } catch (e) {
    if (e instanceof ServiceError) return { error: e.message, values };
    console.error("[vao-hoc]", e);
    return { error: "Đã xảy ra lỗi, vui lòng thử lại.", values };
  }
  redirect("/student");
}
