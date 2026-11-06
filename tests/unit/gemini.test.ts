import { describe, expect, it } from "vitest";
import { z } from "zod";

import { buildGeminiBody, parseGeminiResponse, toGeminiSchema } from "@/lib/ai/gemini";
import { AiResponseSchema } from "@/modules/ai-generator/schema";

const S = z.object({ score: z.number(), note: z.string().nullable() });
const ok = (text: string, finishReason = "STOP") => ({ candidates: [{ content: { parts: [{ text }] }, finishReason }], modelVersion: "gemini-2.5-flash" });

describe("Gemini", () => {
  it("tạo body với lược đồ JSON, không có $schema", () => {
    const b = buildGeminiBody({ schema: AiResponseSchema, system: "sys", user: "u", maxTokens: 16000 });
    expect(b.generationConfig.responseMimeType).toBe("application/json");
    expect(b.generationConfig.responseJsonSchema).not.toHaveProperty("$schema");
    expect(b.generationConfig.maxOutputTokens).toBe(32000);
    expect(JSON.stringify(toGeminiSchema(AiResponseSchema))).toContain("multiple_choice");
    expect(b.systemInstruction.parts[0].text).toBe("sys");
  });
  it("phân tích phản hồi hợp lệ, bỏ phần suy nghĩ", () => {
    const r = parseGeminiResponse(S, 200, { candidates: [{ content: { parts: [{ text: "nghĩ…", thought: true }, { text: '{"score":1.5,"note":null}' }] }, finishReason: "STOP" }] }, "m");
    expect(r).toEqual({ ok: true, data: { score: 1.5, note: null }, model: "m" });
  });
  it("báo lỗi rõ ràng", () => {
    expect(parseGeminiResponse(S, 429, {}, "m")).toMatchObject({ ok: false, error: expect.stringContaining("hạn mức") });
    expect(parseGeminiResponse(S, 400, { error: { message: "API key not valid." } }, "m")).toMatchObject({ ok: false, error: expect.stringContaining("không hợp lệ") });
    expect(parseGeminiResponse(S, 200, ok("{}", "MAX_TOKENS"), "m")).toMatchObject({ ok: false, error: expect.stringContaining("quá dài") });
    expect(parseGeminiResponse(S, 200, ok("", "SAFETY"), "m")).toMatchObject({ ok: false, error: expect.stringContaining("từ chối") });
    expect(parseGeminiResponse(S, 200, ok("không phải json"), "m")).toMatchObject({ ok: false });
    expect(parseGeminiResponse(S, 200, ok('{"score":"x"}'), "m")).toMatchObject({ ok: false });
  });
});
