import "server-only";

/**
 * Cấu hình nhà cung cấp AI – chỉ đọc ở phía máy chủ.
 * API key KHÔNG bao giờ được gửi xuống trình duyệt.
 * Đổi nhà cung cấp/model bằng biến môi trường AI_PROVIDER, AI_MODEL.
 * Đã tích hợp: Anthropic (Claude) và Google Gemini (có gói miễn phí).
 */
export const SUPPORTED_AI_PROVIDERS = ["anthropic", "gemini"] as const;
export type AiProvider = (typeof SUPPORTED_AI_PROVIDERS)[number];

export const DEFAULT_MODELS: Record<AiProvider, string> = { anthropic: "claude-opus-5-5", gemini: "gemini-2.5-flash" };

const KEY_ENV: Record<AiProvider, string> = { anthropic: "ANTHROPIC_API_KEY", gemini: "GEMINI_API_KEY" };

export const PROVIDER_LABELS: Record<AiProvider, string> = { anthropic: "Anthropic Claude", gemini: "Google Gemini" };

export type AiConfigStatus =
  | { configured: true; provider: AiProvider; model: string; apiKey: string }
  | { configured: false; provider: AiProvider | null; reason: string };

/** Model trong AI_MODEL chỉ dùng khi khớp nhà cung cấp (tránh gửi "claude-…" sang Gemini và ngược lại). */
function pickModel(provider: AiProvider, raw: string | undefined) {
  const m = raw?.trim();
  if (!m) return DEFAULT_MODELS[provider];
  const looksGemini = m.startsWith("gemini") || m.startsWith("gemma");
  return (provider === "gemini") === looksGemini ? m : DEFAULT_MODELS[provider];
}

export function getAiConfigStatus(): AiConfigStatus {
  const env = process.env;
  const raw = (env.AI_PROVIDER?.trim().toLowerCase() ||
    (env.ANTHROPIC_API_KEY?.trim() ? "anthropic" : env.GEMINI_API_KEY?.trim() ? "gemini" : "")) as string;
  if (!raw) return { configured: false, provider: null, reason: "Chưa đặt khoá AI (GEMINI_API_KEY hoặc ANTHROPIC_API_KEY)." };
  if (!SUPPORTED_AI_PROVIDERS.includes(raw as AiProvider)) {
    return { configured: false, provider: null, reason: `AI_PROVIDER "${raw}" chưa được hỗ trợ (hỗ trợ: anthropic, gemini).` };
  }
  const provider = raw as AiProvider;
  const apiKey = env[KEY_ENV[provider]]?.trim();
  if (!apiKey) return { configured: false, provider, reason: `Thiếu biến ${KEY_ENV[provider]}.` };
  return { configured: true, provider, model: pickModel(provider, env.AI_MODEL), apiKey };
}

export function aiKeyEnvName(provider: AiProvider) {
  return KEY_ENV[provider];
}
