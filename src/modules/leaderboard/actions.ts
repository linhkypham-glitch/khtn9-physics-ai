"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Quản trị viên bật/tắt bảng xếp hạng cho học sinh trên toàn hệ thống (RLS: chỉ admin được ghi). */
export async function setGlobalLeaderboardAction(enabled: boolean): Promise<{ ok: boolean; message: string }> {
  const user = await getCurrentUser();
  if (!user || user.authMode !== "account" || user.role !== "admin") return { ok: false, message: "Chỉ quản trị viên được thay đổi cài đặt này." };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, message: "Hệ thống chưa cấu hình đầy đủ." };
  const { error } = await supabase.from("system_settings").upsert({
    key: "leaderboard.enabled",
    value: enabled,
    description: "Cho phép học sinh xem bảng xếp hạng (giáo viên vẫn phải bật cho từng lớp/bài).",
    updated_by: user.id,
    updated_at: new Date().toISOString(),
  });
  if (error) {
    console.error("[leaderboard/actions]", error);
    return { ok: false, message: "Không lưu được cài đặt." };
  }
  revalidatePath("/admin/settings");
  return { ok: true, message: enabled ? "Đã bật bảng xếp hạng toàn hệ thống." : "Đã tắt bảng xếp hạng toàn hệ thống." };
}
