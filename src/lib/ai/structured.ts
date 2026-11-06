import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";

import { getAiConfigStatus } from "./config";
import { callGemini } from "./gemini";

export type AiResult<T> = { ok: true; data: T; model: string } | { ok: false; error: string };

export type StructuredRequest<T extends z.ZodType> = {
  schema: T;
  system: string;
  user: string;
  maxTokens: number;
  effort?: "low" | "medium" | "high";
  timeoutMs?: number;
  tag: string; // nhãn ghi log
};

/** Gọi AI (Claude hoặc Gemini tuỳ cấu hình) và nhận về JSON đúng lược đồ Zod. */
export async function generateStructured<T extends z.ZodType>(req: StructuredRequest<T>): Promise<AiResult<z.infer<T>>> {
  const cfg = getAiConfigStatus();
  if (!cfg.configured) return { ok: false, error: `Chức năng AI chưa được cấu hình. ${cfg.reason}` };
  const timeout = req.timeoutMs ?? 120_000;

  if (cfg.provider === "gemini") {
    return callGemini({ apiKey: cfg.apiKey, model: cfg.model, schema: req.schema, system: req.system, user: req.user, maxTokens: req.maxTokens, timeoutMs: timeout, tag: req.tag });
  }

  const client = new Anthropic({ apiKey: cfg.apiKey, timeout, maxRetries: 2 });
  try {
    const response = await client.beta.messages.parse({
      model: cfg.model,
      max_tokens: req.maxTokens,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: req.effort ?? "medium", format: betaZodOutputFormat(req.schema) },
      system: req.system,
      messages: [{ role: "user", content: req.user }],
    });
    if (response.stop_reason === "refusal") return { ok: false, error: "AI từ chối yêu cầu này. Hãy điều chỉnh yêu cầu và thử lại." };
    if (response.stop_reason === "max_tokens") return { ok: false, error: "Yêu cầu quá dài – hãy giảm số câu hỏi mỗi lần tạo." };
    if (!response.parsed_output) return { ok: false, error: "AI trả về dữ liệu không đúng định dạng. Vui lòng thử lại." };
    return { ok: true, data: response.parsed_output as z.infer<T>, model: response.model };
  } catch (error) {
    console.error(`[${req.tag}]`, error);
    if (error instanceof Anthropic.AuthenticationError) return { ok: false, error: "API key của AI không hợp lệ." };
    if (error instanceof Anthropic.RateLimitError) return { ok: false, error: "AI đang quá tải hoặc hết hạn mức – thử lại sau ít phút." };
    if (error instanceof Anthropic.APIError) return { ok: false, error: `Lỗi dịch vụ AI (${error.status ?? "không rõ"}).` };
    return { ok: false, error: "Không kết nối được dịch vụ AI." };
  }
}
