import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/types/supabase";

import { getSupabasePublicEnv } from "./env";

/**
 * Client quyền service-role – BỎ QUA RLS.
 * Chỉ dùng trong mã phía máy chủ, sau khi đã kiểm tra quyền ADMIN ở tầng ứng dụng
 * (ví dụ: tạo tài khoản học sinh). Không bao giờ import vào Client Component.
 */
export function createSupabaseAdminClient() {
  const env = getSupabasePublicEnv();
  const secret = (process.env.SUPABASE_SECRET_KEY?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
  if (!env || !secret) return null;
  return createClient<Database>(env.url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isServiceRoleConfigured(): boolean {
  return Boolean((process.env.SUPABASE_SECRET_KEY?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()));
}
