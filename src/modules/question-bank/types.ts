export type QuestionType = "multiple_choice" | "true_false" | "short_answer" | "essay";
export type CognitiveLevel = "biet" | "hieu" | "van_dung";

export const LEVEL_LABELS: Record<CognitiveLevel, string> = { biet: "Biết", hieu: "Hiểu", van_dung: "Vận dụng" };
export const TYPE_LABELS: Record<QuestionType, string> = {
  multiple_choice: "Trắc nghiệm",
  true_false: "Đúng – Sai",
  short_answer: "Trả lời ngắn",
  essay: "Tự luận",
};

/** Câu hỏi gửi xuống trình duyệt – KHÔNG chứa đáp án. */
export type PublicQuestion = {
  id: string;
  type: QuestionType;
  level: CognitiveLevel;
  content: string;
  unit: string | null;
  points: number;
  options: { label: string; content: string }[];
  subitems: { label: string; content: string }[];
};

/** Câu hỏi đầy đủ (chỉ dùng ở máy chủ). */
export type FullQuestion = Omit<PublicQuestion, "options" | "subitems"> & {
  answerNumber: number | null;
  answerText: string | null;
  tolerance: number;
  explanation: string;
  formula: string | null;
  remember: string | null;
  options: { label: string; content: string; isCorrect: boolean }[];
  subitems: { label: string; content: string; isTrue: boolean; explanation: string }[];
};

/** Câu trả lời của học sinh. */
export type StudentAnswer =
  | { type: "multiple_choice"; choice: string | null }
  | { type: "true_false"; items: Record<string, boolean | null> }
  | { type: "short_answer"; text: string }
  | { type: "essay"; text: string };

export type QuestionResult = {
  questionId: string;
  /** pending: câu tự luận chờ giáo viên chấm */
  status: "correct" | "partial" | "wrong" | "blank" | "pending";
  earned: number;
  max: number;
  /** số đơn vị trả lời đúng / tổng (TN: 1, Đ-S: 4, TLN: 1) */
  correctUnits: number;
  totalUnits: number;
  correctAnswer: string;
  studentAnswer: string;
  explanation: string;
  formula: string | null;
  remember: string | null;
  items?: { label: string; content: string; correct: boolean; isTrue: boolean; given: boolean | null; explanation: string }[];
};
