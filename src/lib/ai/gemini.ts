import { z } from "zod";

/**
 * Google Gemini qua REST API (generateContent) với đầu ra JSON theo lược đồ.
 * Không phụ thuộc "server-only" để kiểm thử được; chỉ được gọi từ structured.ts (máy chủ).
 */
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

type GeminiResult<T> = { ok: true; data: T; model: string } | { ok: false; error: string };

/** Lược đồ JSON cho responseJsonSchema (bỏ các khoá meta Gemini không cần). */
export function toGeminiSchema(schema: z.ZodType): Record<string, unknown> {
  const { $schema: _ignored, ...rest } = z.toJSONSchema(schema, { target: "draft-2020-12" }) as Record<string, unknown>;
  void _ignored;
  return rest;
}

export function buildGeminiBody(input: { schema: z.ZodType; system: string; user: string; maxTokens: number }) {
  return {
    systemInstruction: { parts: [{ text: input.system }] },
    contents: [{ role: "user", parts: [{ text: input.user }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseJsonSchema: toGeminiSchema(input.schema),
      // Gemini 2.5 tính cả token "suy nghĩ" vào giới hạn đầu ra → nới rộng.
      maxOutputTokens: Math.min(65_536, input.maxTokens * 2),
      temperature: 0.4,
    },
  };
}

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
  modelVersion?: string;
  error?: { message?: string; status?: string };
};

/** Phân tích phản hồi Gemini → dữ liệu đã kiểm tra bằng Zod hoặc thông báo lỗi tiếng Việt. */
export function parseGeminiResponse<T extends z.ZodType>(schema: T, status: number, json: GeminiResponse, model: string): GeminiResult<z.infer<T>> {
  if (status === 400 && /API key/i.test(json.error?.message ?? "")) return { ok: false, error: "API key Gemini không hợp lệ." };
  if (status === 401 || status === 403) return { ok: false, error: "API key Gemini không hợp lệ hoặc chưa được cấp quyền." };
  if (status === 429) return { ok: false, error: "Đã hết hạn mức miễn phí của Gemini trong phút/ngày này – thử lại sau ít phút." };
  if (status === 404) return { ok: false, error: `Không tìm thấy model "${model}" – kiểm tra biến AI_MODEL.` };
  if (status >= 400) return { ok: false, error: `Lỗi dịch vụ AI (${status}).` };
  if (json.promptFeedback?.blockReason) return { ok: false, error: "AI từ chối yêu cầu này. Hãy điều chỉnh yêu cầu và thử lại." };
  const cand = json.candidates?.[0];
  if (!cand) return { ok: false, error: "AI không trả về kết quả. Vui lòng thử lại." };
  if (cand.finishReason === "MAX_TOKENS") return { ok: false, error: "Yêu cầu quá dài – hãy giảm số câu hỏi mỗi lần tạo." };
  if (cand.finishReason && !["STOP", "FINISH_REASON_UNSPECIFIED"].includes(cand.finishReason)) {
    return { ok: false, error: "AI từ chối yêu cầu này. Hãy điều chỉnh yêu cầu và thử lại." };
  }
  const text = (cand.content?.parts ?? []).filter((p) => !p.thought && p.text).map((p) => p.text).join("");
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: "AI trả về dữ liệu không đúng định dạng. Vui lòng thử lại." };
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "AI trả về dữ liệu không đúng định dạng. Vui lòng thử lại." };
  return { ok: true, data: parsed.data, model: json.modelVersion ?? model };
}

export async function callGemini<T extends z.ZodType>(input: {
  apiKey: string;
  model: string;
  schema: T;
  system: string;
  user: string;
  maxTokens: number;
  timeoutMs: number;
  tag: string;
}): Promise<GeminiResult<z.infer<T>>> {
  const url = `${ENDPOINT}/${encodeURIComponent(input.model)}:generateContent`;
  const body = JSON.stringify(buildGeminiBody(input));
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": input.apiKey },
        body,
        signal: AbortSignal.timeout(input.timeoutMs),
      });
      const json = (await res.json().catch(() => ({}))) as GeminiResponse;
      // Lỗi tạm thời của máy chủ Google → thử lại (không thử lại 429 để không đốt hạn mức miễn phí).
      if ((res.status === 500 || res.status === 503) && attempt < 2) {
        await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
        continue;
      }
      if (!res.ok) console.error(`[${input.tag}] gemini ${res.status}`, json.error?.status, json.error?.message);
      return parseGeminiResponse(input.schema, res.status, json, input.model);
    } catch (error) {
      console.error(`[${input.tag}] gemini`, error);
      if (error instanceof Error && error.name === "TimeoutError") return { ok: false, error: "AI phản hồi quá lâu – hãy giảm số câu hỏi và thử lại." };
      return { ok: false, error: "Không kết nối được dịch vụ AI." };
    }
  }
  return { ok: false, error: "Dịch vụ AI đang bận – thử lại sau." };
}
