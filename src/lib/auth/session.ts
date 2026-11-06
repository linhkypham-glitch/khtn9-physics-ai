import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";
import { homePathForRole } from "./roles";

export type CurrentUser = {
  id: string;
  email: string | null;
  fullName: string;
  role: UserRole;
  studentCode: string | null;
};

/**
 * Lấy người dùng hiện tại (đã xác thực với Supabase Auth) kèm hồ sơ trong bảng profiles.
 * Được cache theo request bằng React.cache.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
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
    role: profile.role as UserRole,
    studentCode: profile.student_code,
  };
});

/**
 * Bắt buộc đăng nhập với một trong các vai trò cho phép.
 * Sai vai trò → chuyển về dashboard của vai trò đó.
 */
export async function requireRole(allowed: UserRole[]): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!allowed.includes(user.role)) redirect(homePathForRole(user.role));
  return user;
}
