"use client";

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/supabase";

import { getSupabasePublicEnv } from "./env";

/** Supabase client phía trình duyệt (chỉ dùng khóa publishable, RLS bảo vệ dữ liệu). */
export function createSupabaseBrowserClient() {
  const env = getSupabasePublicEnv();
  if (!env) return null;
  return createBrowserClient<Database>(env.url, env.publishableKey);
}
