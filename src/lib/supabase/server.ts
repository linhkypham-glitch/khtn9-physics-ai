import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "@/types/supabase";

import { getSupabasePublicEnv } from "./env";

/**
 * Supabase client cho Server Components / Server Actions / Route Handlers.
 * Mọi truy vấn chạy dưới danh tính của người dùng đang đăng nhập → RLS được áp dụng.
 * Trả về null nếu chưa cấu hình Supabase.
 */
export async function createSupabaseServerClient() {
  const env = getSupabasePublicEnv();
  if (!env) return null;

  const cookieStore = await cookies();

  return createServerClient<Database>(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Gọi từ Server Component (không được ghi cookie) – proxy.ts đã làm mới phiên.
        }
      },
    },
  });
}
