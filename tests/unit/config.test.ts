import { afterEach, describe, expect, it, vi } from "vitest";

import { getAiConfigStatus } from "@/lib/ai/config";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

afterEach(() => vi.unstubAllEnvs());

describe("Cấu hình Supabase", () => {
  it("trả về null khi thiếu biến môi trường", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    expect(getSupabasePublicEnv()).toBeNull();
  });

  it("chấp nhận anon key cũ làm khóa dự phòng", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://x.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon");
    expect(getSupabasePublicEnv()).toEqual({ url: "https://x.supabase.co", publishableKey: "anon" });
  });

  it("từ chối URL không hợp lệ", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "x.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "key");
    expect(getSupabasePublicEnv()).toBeNull();
  });
});

describe("Cấu hình AI", () => {
  it("báo chưa cấu hình khi thiếu AI_PROVIDER", () => {
    vi.stubEnv("AI_PROVIDER", "");
    expect(getAiConfigStatus().configured).toBe(false);
  });

  it("báo thiếu API key của nhà cung cấp đã chọn", () => {
    vi.stubEnv("AI_PROVIDER", "openai");
    vi.stubEnv("OPENAI_API_KEY", "");
    const s = getAiConfigStatus();
    expect(s.configured).toBe(false);
    if (!s.configured) expect(s.reason).toContain("OPENAI_API_KEY");
  });

  it("từ chối nhà cung cấp không hỗ trợ", () => {
    vi.stubEnv("AI_PROVIDER", "unknown");
    expect(getAiConfigStatus().configured).toBe(false);
  });

  it("đã cấu hình khi có provider + key", () => {
    vi.stubEnv("AI_PROVIDER", "Anthropic");
    vi.stubEnv("ANTHROPIC_API_KEY", "test-key");
    vi.stubEnv("AI_MODEL", "");
    expect(getAiConfigStatus()).toEqual({ configured: true, provider: "anthropic", model: null });
  });
});
