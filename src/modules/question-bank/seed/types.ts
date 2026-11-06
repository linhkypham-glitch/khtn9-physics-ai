/** Kiểu dữ liệu câu hỏi mẫu – được sinh thành SQL seed (supabase/seed/04_question_bank.sql). */
export type Level = "biet" | "hieu" | "van_dung";

type Base = {
  /** Mã ổn định, ví dụ "B11-01" */
  code: string;
  level: Level;
  content: string;
  explanation: string;
  formula?: string;
  remember?: string;
};

export type SeedMultipleChoice = Base & {
  type: "multiple_choice";
  options: [string, string, string, string];
  correct: "A" | "B" | "C" | "D";
};

export type SeedTrueFalse = Base & {
  type: "true_false";
  items: [TFItem, TFItem, TFItem, TFItem];
};
export type TFItem = { content: string; isTrue: boolean; explanation: string };

export type SeedShortAnswer = Base & {
  type: "short_answer";
  answerNumber: number;
  /** Sai số tuyệt đối chấp nhận */
  tolerance: number;
  unit?: string;
};

export type SeedQuestion = SeedMultipleChoice | SeedTrueFalse | SeedShortAnswer;

export type LessonQuestions = { lessonNumber: number; questions: SeedQuestion[] };
