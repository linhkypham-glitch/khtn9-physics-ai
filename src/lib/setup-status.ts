import "server-only";

import { getAiConfigStatus, type AiConfigStatus } from "@/lib/ai/config";
import { isServiceRoleConfigured } from "@/lib/supabase/admin";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SetupStatus = {
  supabaseEnv: boolean;
  serviceRole: boolean;
  database: { reachable: boolean; chapters: number; lessons: number; error: string | null };
  ai: AiConfigStatus;
};

/** Kiểm tra trạng thái cấu hình thực tế (chỉ trả về boolean/số đếm – không lộ bí mật). */
export async function getSetupStatus(): Promise<SetupStatus> {
  const supabaseEnv = getSupabasePublicEnv() !== null;
  const database: SetupStatus["database"] = { reachable: false, chapters: 0, lessons: 0, error: null };

  if (supabaseEnv) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const [ch, ls] = await Promise.all([
        supabase.from("chapters").select("id", { count: "exact", head: true }),
        supabase.from("lessons").select("id", { count: "exact", head: true }),
      ]);
      if (ch.error || ls.error) {
        // Không trả chi tiết lỗi ra ngoài (trang /setup là công khai) – chỉ ghi log máy chủ.
        console.error("[setup-status] database check failed", ch.error ?? ls.error);
        database.error = "truy vấn bảng chapters/lessons thất bại";
      } else {
        database.reachable = true;
        database.chapters = ch.count ?? 0;
        database.lessons = ls.count ?? 0;
      }
    }
  }

  return { supabaseEnv, serviceRole: isServiceRoleConfigured(), database, ai: getAiConfigStatus() };
}
