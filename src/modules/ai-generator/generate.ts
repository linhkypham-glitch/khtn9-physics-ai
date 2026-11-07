import "server-only";

import { generateStructured } from "@/lib/ai/structured";
import { AiResponseSchema, type AiQuestion } from "./schema";

export type LessonContext = {
  number: number;
  title: string;
  objectives: string[];
  knowledge: string; // lý thuyết, công thức đã duyệt trong hệ thống
};

export type GenerateRequest = {
  lessons: LessonContext[];
  counts: { multiple_choice: number; true_false: number; short_answer: number };
  levels: { biet: number; hieu: number; van_dung: number }; // tỉ lệ %
  existingQuestions: string[];
  note?: string;
  /** Môn học của các bài đã chọn, ví dụ "Vật lý", "Hoá học" hoặc "Vật lý và Hoá học". */
  subject?: string;
};

export type GenerateResult =
  | { ok: true; questions: AiQuestion[]; model: string }
  | { ok: false; error: string };

const COMMON_RULES = `- Chỉ dùng kiến thức trong nội dung bài học được cung cấp; không ra ngoài phạm vi các bài đã chọn; không dùng kiến thức lớp trên.
- Không bịa số liệu, hằng số, công thức hay phương trình. Chỉ dùng những gì có trong nội dung bài.
- Tự giải lại từng câu để chắc chắn đáp án, lời giải và đề bài nhất quán; số liệu cho ra đáp số gọn.
- Trắc nghiệm: đúng 4 phương án, chỉ 1 phương án đúng, các phương án nhiễu hợp lí, không dùng "Tất cả đều đúng".
- Đúng – sai: đúng 4 ý a, b, c, d về cùng một tình huống; mỗi ý có giải thích riêng; có cả ý đúng và ý sai.
- Trả lời ngắn: đáp án là MỘT số (answer_number), ghi đơn vị trong "unit", sai số cho phép "tolerance" hợp lí với cách làm tròn yêu cầu trong đề.
- Lời giải ngắn gọn, rõ ràng, có công thức áp dụng; "remember" là kiến thức cần ghi nhớ (nếu có).
- Không lặp lại câu hỏi đã có trong danh sách được cung cấp, không tạo hai câu giống nhau.
- Phân bố mức độ nhận thức: Biết (biet), Hiểu (hieu), Vận dụng (van_dung) theo tỉ lệ được yêu cầu.
- Trường không dùng cho dạng câu hỏi thì để null.`;

const PHYSICS_RULES = `- Quy ước như SGK: trọng lượng P = 10·m (g ≈ 10 m/s²); dùng đơn vị SI và kí hiệu như SGK; dấu phẩy thập phân kiểu Việt Nam trong nội dung câu hỏi.`;
const CHEMISTRY_RULES = `- Dùng tên chất và kí hiệu như SGK (ví dụ ethylic alcohol, acetic acid, hydrochloric acid, iron(III) oxide); viết công thức hoá học đúng; phương trình hoá học phải cân bằng và đúng điều kiện phản ứng.
- Khối lượng nguyên tử làm tròn như SGK (H = 1; C = 12; O = 16; Na = 23; Ca = 40; Fe = 56; Zn = 65; Ag = 108); thể tích mol khí ở điều kiện chuẩn là 24,79 L/mol; dấu phẩy thập phân kiểu Việt Nam trong nội dung câu hỏi.
- Hiện tượng thí nghiệm nêu trong câu hỏi phải đúng với mô tả trong nội dung bài.`;

export function buildSystemPrompt(subject = "Vật lý"): string {
  const hasPhysics = /vật/i.test(subject);
  const hasChem = /hoá|hóa/i.test(subject);
  const teacher = hasPhysics && hasChem ? "Vật lý và Hoá học" : hasChem ? "Hoá học" : "Vật lý";
  return `Bạn là giáo viên ${teacher} giàu kinh nghiệm, soạn câu hỏi kiểm tra môn Khoa học tự nhiên 9 – phân môn ${teacher}, bộ sách "Kết nối tri thức với cuộc sống" (Việt Nam).

Yêu cầu bắt buộc:
${COMMON_RULES}
${hasPhysics ? PHYSICS_RULES + "\n" : ""}${hasChem ? CHEMISTRY_RULES + "\n" : ""}`.trimEnd();
}

function buildUserPrompt(req: GenerateRequest) {
  const lessons = req.lessons
    .map((l) => `### Bài ${l.number}. ${l.title}\nMục tiêu, yêu cầu cần đạt:\n- ${l.objectives.join("\n- ")}\nNội dung kiến thức:\n${l.knowledge}`)
    .join("\n\n");
  const existing = req.existingQuestions.slice(0, 120).map((q, i) => `${i + 1}. ${q}`).join("\n");
  return `Hãy soạn câu hỏi mới cho các bài sau.

${lessons}

Số lượng cần tạo:
- Trắc nghiệm 4 lựa chọn (multiple_choice): ${req.counts.multiple_choice} câu
- Đúng – sai 4 ý (true_false): ${req.counts.true_false} câu
- Trả lời ngắn dạng số (short_answer): ${req.counts.short_answer} câu

Tỉ lệ mức độ: Biết ${req.levels.biet}% · Hiểu ${req.levels.hieu}% · Vận dụng ${req.levels.van_dung}%.
Phân bố câu hỏi đều giữa các bài đã chọn; "lesson_number" là số bài tương ứng.
${req.note ? `Yêu cầu thêm của giáo viên: ${req.note}\n` : ""}
Các câu hỏi ĐÃ CÓ trong ngân hàng (không được lặp lại):
${existing || "(chưa có)"}`;
}

/** Gọi AI tạo câu hỏi (đầu ra theo lược đồ). Kết quả còn phải qua validateAiQuestions và giáo viên duyệt. */
export async function generateQuestionsWithAi(req: GenerateRequest): Promise<GenerateResult> {
  const res = await generateStructured({
    schema: AiResponseSchema,
    system: buildSystemPrompt(req.subject),
    user: buildUserPrompt(req),
    maxTokens: 16000,
    effort: "high",
    timeoutMs: 5 * 60 * 1000,
    tag: "ai-generator",
  });
  return res.ok ? { ok: true, questions: res.data.questions, model: res.model } : res;
}
