import "server-only";

/**
 * Cấu hình nhà cung cấp AI – chỉ đọc ở phía máy chủ.
 * API key KHÔNG bao giờ được gửi xuống trình duyệt.
 * Đổi nhà cung cấp bằng biến môi trường AI_PROVIDER.
 */
export const SUPPORTED_AI_PROVIDERS = ["anthropic", "openai", "gemini"] as const;
export type AiProvider = (typeof SUPPORTED_AI_PROVIDERS)[number];

const KEY_ENV: Record<AiProvider, string> = {
  anthropic: "ANTHROPIC_API_KEY",
  openai: "OPENAI_API_KEY",
  gemini: "GEMINI_API_KEY",
};

export type AiConfigStatus =
  | { configured: true; provider: AiProvider; model: string | null }
  | { configured: false; provider: AiProvider | null; reason: string };

export function getAiConfigStatus(): AiConfigStatus {
  const raw = process.env.AI_PROVIDER?.trim().toLowerCase();
  if (!raw) return { configured: false, provider: null, reason: "Chưa đặt biến AI_PROVIDER." };
  if (!SUPPORTED_AI_PROVIDERS.includes(raw as AiProvider)) {
    return { configured: false, provider: null, reason: `AI_PROVIDER "${raw}" không được hỗ trợ.` };
  }
  const provider = raw as AiProvider;
  const key = process.env[KEY_ENV[provider]]?.trim();
  if (!key) {
    return { configured: false, provider, reason: `Thiếu biến ${KEY_ENV[provider]}.` };
  }
  return { configured: true, provider, model: process.env.AI_MODEL?.trim() || null };
}

export function aiKeyEnvName(provider: AiProvider) {
  return KEY_ENV[provider];
}
