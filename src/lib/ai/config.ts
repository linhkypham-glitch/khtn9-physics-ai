import "server-only";

/**
 * Cấu hình nhà cung cấp AI – chỉ đọc ở phía máy chủ.
 * API key KHÔNG bao giờ được gửi xuống trình duyệt.
 * Đổi nhà cung cấp/model bằng biến môi trường AI_PROVIDER, AI_MODEL.
 * Hiện đã tích hợp: Anthropic (Claude).
 */
export const SUPPORTED_AI_PROVIDERS = ["anthropic"] as const;
export type AiProvider = (typeof SUPPORTED_AI_PROVIDERS)[number];

export const DEFAULT_MODELS: Record<AiProvider, string> = { anthropic: "claude-opus-5-5" };

const KEY_ENV: Record<AiProvider, string> = { anthropic: "ANTHROPIC_API_KEY" };

export type AiConfigStatus =
  | { configured: true; provider: AiProvider; model: string; apiKey: string }
  | { configured: false; provider: AiProvider | null; reason: string };

export function getAiConfigStatus(): AiConfigStatus {
  const raw = (process.env.AI_PROVIDER?.trim().toLowerCase() || (process.env.ANTHROPIC_API_KEY?.trim() ? "anthropic" : "")) as string;
  if (!raw) return { configured: false, provider: null, reason: "Chưa đặt biến AI_PROVIDER và ANTHROPIC_API_KEY." };
  if (!SUPPORTED_AI_PROVIDERS.includes(raw as AiProvider)) {
    return { configured: false, provider: null, reason: `AI_PROVIDER "${raw}" chưa được hỗ trợ (hỗ trợ: anthropic).` };
  }
  const provider = raw as AiProvider;
  const apiKey = process.env[KEY_ENV[provider]]?.trim();
  if (!apiKey) return { configured: false, provider, reason: `Thiếu biến ${KEY_ENV[provider]}.` };
  return { configured: true, provider, model: process.env.AI_MODEL?.trim() || DEFAULT_MODELS[provider], apiKey };
}

export function aiKeyEnvName(provider: AiProvider) {
  return KEY_ENV[provider];
}
