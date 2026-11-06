import { z } from "zod";

/**
 * Lược đồ JSON mà AI phải trả về (structured outputs).
 * Dạng phẳng – trường không dùng cho dạng câu hỏi thì để null – để mọi dạng câu
 * dùng chung một schema; việc kiểm tra theo từng dạng làm ở validate.ts.
 */
export const AiQuestionSchema = z.object({
  type: z.enum(["multiple_choice", "true_false", "short_answer"]),
  lesson_number: z.number().int(),
  level: z.enum(["biet", "hieu", "van_dung"]),
  content: z.string(),
  options: z.array(z.string()).nullable(),
  correct: z.enum(["A", "B", "C", "D"]).nullable(),
  items: z.array(z.object({ content: z.string(), is_true: z.boolean(), explanation: z.string() })).nullable(),
  answer_number: z.number().nullable(),
  tolerance: z.number().nullable(),
  unit: z.string().nullable(),
  explanation: z.string(),
  formula: z.string().nullable(),
  remember: z.string().nullable(),
});
export type AiQuestion = z.infer<typeof AiQuestionSchema>;

export const AiResponseSchema = z.object({ questions: z.array(AiQuestionSchema) });
export type AiResponse = z.infer<typeof AiResponseSchema>;
