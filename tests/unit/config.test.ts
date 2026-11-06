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
  it("báo chưa cấu hình khi thiếu cả AI_PROVIDER và key", () => {
    vi.stubEnv("AI_PROVIDER", "");
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    vi.stubEnv("GEMINI_API_KEY", "");
    expect(getAiConfigStatus().configured).toBe(false);
  });

  it("tự nhận Gemini khi chỉ có GEMINI_API_KEY; bỏ qua AI_MODEL của nhà cung cấp khác", () => {
    vi.stubEnv("AI_PROVIDER", "");
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    vi.stubEnv("GEMINI_API_KEY", "g-test");
    vi.stubEnv("AI_MODEL", "claude-haiku-5-5");
    expect(getAiConfigStatus()).toMatchObject({ configured: true, provider: "gemini", model: "gemini-2.5-flash", apiKey: "g-test" });
    vi.stubEnv("AI_MODEL", "gemini-2.5-pro");
    expect(getAiConfigStatus()).toMatchObject({ provider: "gemini", model: "gemini-2.5-pro" });
  });

  it("AI_PROVIDER=gemini nhưng thiếu key thì báo đúng biến", () => {
    vi.stubEnv("AI_PROVIDER", "gemini");
    vi.stubEnv("GEMINI_API_KEY", "");
    const s = getAiConfigStatus();
    expect(s.configured).toBe(false);
    if (!s.configured) expect(s.reason).toContain("GEMINI_API_KEY");
  });

  it("tự nhận Anthropic khi chỉ có ANTHROPIC_API_KEY, model mặc định claude-opus-5-5", () => {
    vi.stubEnv("AI_PROVIDER", "");
    vi.stubEnv("AI_MODEL", "");
    vi.stubEnv("ANTHROPIC_API_KEY", "sk-test");
    expect(getAiConfigStatus()).toMatchObject({ configured: true, provider: "anthropic", model: "claude-opus-5-5" });
  });

  it("báo thiếu API key của nhà cung cấp đã chọn", () => {
    vi.stubEnv("AI_PROVIDER", "anthropic");
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    const s = getAiConfigStatus();
    expect(s.configured).toBe(false);
    if (!s.configured) expect(s.reason).toContain("ANTHROPIC_API_KEY");
  });

  it("từ chối nhà cung cấp chưa hỗ trợ", () => {
    vi.stubEnv("AI_PROVIDER", "unknown");
    expect(getAiConfigStatus().configured).toBe(false);
  });

  it("cho phép đổi model bằng AI_MODEL", () => {
    vi.stubEnv("AI_PROVIDER", "Anthropic");
    vi.stubEnv("ANTHROPIC_API_KEY", "sk-test");
    vi.stubEnv("AI_MODEL", "claude-sonnet-5-5");
    expect(getAiConfigStatus()).toMatchObject({ configured: true, model: "claude-sonnet-5-5" });
  });
});
