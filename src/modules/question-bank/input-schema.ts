import { z } from "zod";

const text = (min: number, max: number, msg: string) => z.string().trim().min(min, msg).max(max, "Nội dung quá dài.");

/** Dữ liệu giáo viên nhập khi thêm / sửa câu hỏi. */
export const QuestionInputSchema = z
  .object({
    id: z.guid().nullable(),
    lessonId: z.guid("Vui lòng chọn bài học."),
    type: z.enum(["multiple_choice", "true_false", "short_answer", "essay"]),
    level: z.enum(["biet", "hieu", "van_dung"]),
    content: text(10, 2000, "Nội dung câu hỏi tối thiểu 10 ký tự."),
    options: z.array(z.string().trim().max(500)).length(4),
    correct: z.enum(["A", "B", "C", "D"]).nullable(),
    items: z.array(z.object({ content: z.string().trim().max(500), isTrue: z.boolean(), explanation: z.string().trim().max(1000) })).length(4),
    answerNumber: z.number().nullable(),
    tolerance: z.number().min(0, "Sai số không được âm.").max(1e9),
    unit: z.string().trim().max(30).nullable(),
    explanation: text(5, 3000, "Vui lòng nhập lời giải (tối thiểu 5 ký tự)."),
    formula: z.string().trim().max(500).nullable(),
    remember: z.string().trim().max(1000).nullable(),
    rubric: z.string().trim().max(3000).nullable(),
    publish: z.boolean(),
  })
  .superRefine((q, ctx) => {
    if (q.type === "multiple_choice") {
      if (q.options.some((o) => !o)) ctx.addIssue({ code: "custom", path: ["options"], message: "Nhập đủ 4 phương án A, B, C, D." });
      if (new Set(q.options.map((o) => o.toLowerCase())).size < 4) ctx.addIssue({ code: "custom", path: ["options"], message: "Các phương án không được trùng nhau." });
      if (!q.correct) ctx.addIssue({ code: "custom", path: ["correct"], message: "Chọn đáp án đúng." });
    }
    if (q.type === "true_false" && q.items.some((i) => i.content.length < 3)) {
      ctx.addIssue({ code: "custom", path: ["items"], message: "Nhập đủ nội dung 4 ý a, b, c, d." });
    }
    if (q.type === "essay" && (!q.rubric || q.rubric.length < 10)) {
      ctx.addIssue({ code: "custom", path: ["rubric"], message: "Nhập hướng dẫn chấm / tiêu chí cho câu tự luận (tối thiểu 10 ký tự)." });
    }
    if (q.type === "short_answer" && (q.answerNumber === null || !Number.isFinite(q.answerNumber))) {
      ctx.addIssue({ code: "custom", path: ["answerNumber"], message: "Nhập đáp số dạng số." });
    }
  });

export type QuestionInput = z.infer<typeof QuestionInputSchema>;

/** Câu hỏi trống cho biểu mẫu thêm mới (dùng được cả ở máy chủ). */
export function emptyQuestionInput(lessonId: string): QuestionInput {
  return {
    id: null,
    lessonId,
    type: "multiple_choice",
    level: "biet",
    content: "",
    options: ["", "", "", ""],
    correct: null,
    items: [0, 1, 2, 3].map(() => ({ content: "", isTrue: true, explanation: "" })),
    answerNumber: null,
    tolerance: 0,
    unit: null,
    explanation: "",
    formula: null,
    remember: null,
    rubric: null,
    publish: true,
  };
}
