"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { safeRedirectPath } from "@/lib/auth/roles";
import { toLoginEmail } from "@/lib/auth/student-account";
import { STUDENT_COOKIE } from "@/lib/auth/student-session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validation/auth";

export type LoginState = {
  error: string | null;
  fieldErrors?: { identifier?: string; password?: string };
  identifier?: string;
};

export async function signInAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const rawEmail = String(formData.get("identifier") ?? "");
  const parsed = loginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors: LoginState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if ((key === "identifier" || key === "password") && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: null, fieldErrors, identifier: rawEmail };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { error: "Hệ thống chưa được cấu hình Supabase. Vui lòng liên hệ quản trị viên.", identifier: rawEmail };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: toLoginEmail(parsed.data.identifier),
    password: parsed.data.password,
  });
  if (error || !data.user) {
    return { error: "Tên đăng nhập/email hoặc mật khẩu không đúng.", identifier: rawEmail };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile || !profile.is_active) {
    await supabase.auth.signOut();
    return {
      error: "Tài khoản chưa được kích hoạt hoặc đã bị khóa. Vui lòng liên hệ quản trị viên.",
      identifier: rawEmail,
    };
  }

  redirect(safeRedirectPath(String(formData.get("next") ?? ""), profile.role));
}

export async function signOutAction() {
  const jar = await cookies();
  const wasStudent = Boolean(jar.get(STUDENT_COOKIE)?.value);
  jar.delete(STUDENT_COOKIE);
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect(wasStudent ? "/vao-hoc" : "/login");
}
