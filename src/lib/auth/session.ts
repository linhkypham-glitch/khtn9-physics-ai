import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";
import { homePathForRole } from "./roles";
import { STUDENT_COOKIE, verifyStudentToken } from "./student-session";

export type CurrentUser = {
  id: string;
  email: string | null;
  fullName: string;
  role: UserRole;
  studentCode: string | null;
  /** "account": đăng nhập Supabase (GV, admin) · "link": học sinh vào bằng họ tên + lớp */
  authMode: "account" | "link";
};

async function getAccountUser(): Promise<CurrentUser | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, role, full_name, email, student_code, is_active")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (error || !profile || !profile.is_active) return null;

  return {
    id: profile.id,
    email: profile.email ?? userData.user.email ?? null,
    fullName: profile.full_name,
    role: profile.role,
    studentCode: profile.student_code,
    authMode: "account",
  };
}

async function getLinkStudent(): Promise<CurrentUser | null> {
  const token = (await cookies()).get(STUDENT_COOKIE)?.value;
  const profileId = verifyStudentToken(token);
  if (!profileId) return null;
  const admin = createSupabaseAdminClient();
  if (!admin) return null;
  const { data: profile } = await admin
    .from("profiles")
    .select("id, role, full_name, student_code, is_active")
    .eq("id", profileId)
    .maybeSingle();
  // Phiên không mật khẩu CHỈ dành cho học sinh
  if (!profile || !profile.is_active || profile.role !== "student") return null;
  return {
    id: profile.id,
    email: null,
    fullName: profile.full_name,
    role: "student",
    studentCode: profile.student_code,
    authMode: "link",
  };
}

/**
 * Người dùng hiện tại: ưu tiên tài khoản Supabase (giáo viên/admin), sau đó phiên học sinh.
 * Được cache theo request.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  return (await getAccountUser()) ?? (await getLinkStudent());
});

/** Bắt buộc có vai trò phù hợp; học sinh chưa vào lớp được đưa tới trang /vao-hoc. */
export async function requireRole(allowed: UserRole[]): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(allowed.includes("student") && allowed.length === 1 ? "/vao-hoc" : "/login");
  if (!allowed.includes(user.role)) redirect(homePathForRole(user.role));
  return user;
}
