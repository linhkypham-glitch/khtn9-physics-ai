/**
 * Logic thuần (không truy cập database) cho đề kiểm tra: chọn câu tự động,
 * ma trận đề, thống kê kết quả, gợi ý nhận xét. Có kiểm thử đơn vị.
 */
import type { CognitiveLevel, QuestionType } from "@/modules/question-bank/types";

export type StructurePart = { count: number; points: number };
export type AssessmentStructure = {
  multiple_choice: StructurePart;
  true_false: StructurePart;
  short_answer: StructurePart;
  essay?: StructurePart;
  levels: Record<CognitiveLevel, number>; // tỉ lệ %
};

/**
 * Cấu trúc mặc định CỦA ỨNG DỤNG: 18 trắc nghiệm + 2 đúng – sai (4 ý) + 6 trả lời ngắn
 * = 26 câu, 32 đơn vị trả lời. Đây KHÔNG phải cấu trúc bắt buộc của Công văn 7991 –
 * giáo viên được thay đổi tuỳ ý.
 */
export const DEFAULT_STRUCTURE: AssessmentStructure = {
  multiple_choice: { count: 18, points: 0.25 },
  true_false: { count: 2, points: 1 },
  short_answer: { count: 6, points: 0.5 },
  essay: { count: 0, points: 1 },
  levels: { biet: 40, hieu: 30, van_dung: 30 },
};

export type BankItem = { id: string; type: QuestionType; level: CognitiveLevel; lessonNumber: number };

/** Chia n theo tỉ lệ %, tổng đúng bằng n (phương pháp phần dư lớn nhất). */
export function splitByPercent(n: number, levels: Record<CognitiveLevel, number>): Record<CognitiveLevel, number> {
  const keys: CognitiveLevel[] = ["biet", "hieu", "van_dung"];
  const total = keys.reduce((s, k) => s + Math.max(0, levels[k]), 0) || 1;
  const raw = keys.map((k) => (n * Math.max(0, levels[k])) / total);
  const base = raw.map(Math.floor);
  let rest = n - base.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => ({ i, frac: r - Math.floor(r) })).sort((a, b) => b.frac - a.frac);
  for (const o of order) {
    if (rest <= 0) break;
    base[o.i]++;
    rest--;
  }
  return { biet: base[0], hieu: base[1], van_dung: base[2] };
}

/** Xáo trộn có hạt giống (để kiểm thử được). */
export function shuffle<T>(arr: T[], random: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Chọn câu hỏi từ ngân hàng theo cấu trúc đề và tỉ lệ mức độ, ưu tiên rải đều các bài.
 * Thiếu câu ở một mức độ thì lấy bù từ mức độ khác cùng dạng; trả về cảnh báo nếu vẫn thiếu.
 */
export function pickQuestions(bank: BankItem[], structure: AssessmentStructure, exclude: Set<string> = new Set(), random: () => number = Math.random) {
  const picked: { id: string; type: QuestionType; points: number }[] = [];
  const warnings: string[] = [];
  const types: ("multiple_choice" | "true_false" | "short_answer" | "essay")[] = ["multiple_choice", "true_false", "short_answer", "essay"];
  const labels = { multiple_choice: "trắc nghiệm", true_false: "đúng – sai", short_answer: "trả lời ngắn", essay: "tự luận" };

  for (const type of types) {
    const part = structure[type] ?? { count: 0, points: 1 };
    const need = part.count;
    if (need <= 0) continue;
    const pool = shuffle(bank.filter((b) => b.type === type && !exclude.has(b.id)), random);
    const perLevel = splitByPercent(need, structure.levels);
    const chosen: BankItem[] = [];
    const take = (cands: BankItem[], k: number) => {
      // rải đều giữa các bài: lấy luân phiên theo bài
      const byLesson = new Map<number, BankItem[]>();
      cands.filter((c) => !chosen.includes(c)).forEach((c) => byLesson.set(c.lessonNumber, [...(byLesson.get(c.lessonNumber) ?? []), c]));
      const queues = [...byLesson.values()];
      let added = 0;
      while (added < k && queues.some((q) => q.length)) {
        for (const q of queues) {
          if (added >= k) break;
          const item = q.shift();
          if (item) {
            chosen.push(item);
            added++;
          }
        }
      }
      return added;
    };
    let shortage = 0;
    for (const level of ["biet", "hieu", "van_dung"] as CognitiveLevel[]) {
      const got = take(pool.filter((p) => p.level === level), perLevel[level]);
      shortage += perLevel[level] - got;
    }
    if (shortage > 0) {
      const got = take(pool, shortage);
      if (got < shortage) warnings.push(`Ngân hàng chỉ có ${chosen.length}/${need} câu ${labels[type]} phù hợp – hãy thêm câu hỏi hoặc dùng AI tạo thêm.`);
      else warnings.push(`Không đủ câu ${labels[type]} đúng tỉ lệ mức độ – đã lấy bù từ mức độ khác.`);
    }
    chosen.forEach((c) => picked.push({ id: c.id, type, points: part.points }));
  }
  return { picked, warnings };
}

/* --------------------------- Ma trận đề ----------------------------------- */

export type MatrixQuestion = { type: QuestionType; level: CognitiveLevel; points: number; lessonNumber: number; lessonTitle: string; chapterRoman: string };

export function buildMatrix(questions: MatrixQuestion[]) {
  const rows = new Map<string, { chapter: string; lesson: number; title: string; cells: Record<string, number>; points: number; units: number }>();
  for (const q of questions) {
    const key = `${q.lessonNumber}`;
    const row = rows.get(key) ?? { chapter: q.chapterRoman, lesson: q.lessonNumber, title: q.lessonTitle, cells: {}, points: 0, units: 0 };
    const cell = `${q.type}:${q.level}`;
    row.cells[cell] = (row.cells[cell] ?? 0) + 1;
    row.points += q.points;
    row.units += q.type === "true_false" ? 4 : 1;
    rows.set(key, row);
  }
  const sorted = [...rows.values()].sort((a, b) => a.lesson - b.lesson);
  const totalPoints = questions.reduce((s, q) => s + q.points, 0);
  const byLevel = (["biet", "hieu", "van_dung"] as CognitiveLevel[]).map((l) => {
    const pts = questions.filter((q) => q.level === l).reduce((s, q) => s + q.points, 0);
    return { level: l, count: questions.filter((q) => q.level === l).length, points: pts, percent: totalPoints ? (pts / totalPoints) * 100 : 0 };
  });
  return { rows: sorted, totalPoints, totalQuestions: questions.length, totalUnits: sorted.reduce((s, r) => s + r.units, 0), byLevel };
}

/* --------------------------- Thống kê kết quả ------------------------------ */

export function describeScores(scores: number[]) {
  if (!scores.length) return { count: 0, avg: null, max: null, min: null, passRate: null, distribution: [0, 0, 0, 0] };
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return {
    count: scores.length,
    avg,
    max: Math.max(...scores),
    min: Math.min(...scores),
    passRate: (scores.filter((s) => s >= 5).length / scores.length) * 100,
    // dưới 5 · 5–6,4 · 6,5–7,9 · từ 8
    distribution: [scores.filter((s) => s < 5).length, scores.filter((s) => s >= 5 && s < 6.5).length, scores.filter((s) => s >= 6.5 && s < 8).length, scores.filter((s) => s >= 8).length],
  };
}

export type TopicStat = { label: string; correct: number; total: number };

/**
 * Gợi ý nhận xét dựa HOÀN TOÀN trên dữ liệu kết quả (không suy đoán phẩm chất, hoàn cảnh).
 * Giáo viên đọc, chỉnh sửa rồi mới lưu.
 */
export function suggestComment(name: string, data: { scores: number[]; byChapter: TopicStat[]; byLevel: TopicStat[]; byType: TopicStat[] }) {
  if (!data.scores.length) return `${name} chưa có bài kiểm tra nào được chấm.`;
  const pct = (t: TopicStat) => (t.total ? t.correct / t.total : 0);
  const fmt = (n: number) => n.toLocaleString("vi-VN", { maximumFractionDigits: 1 });
  const avg = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
  const parts: string[] = [];
  parts.push(`${name} đã hoàn thành ${data.scores.length} bài kiểm tra, điểm trung bình ${fmt(avg)}/10.`);
  if (data.scores.length >= 2) {
    const diff = data.scores[data.scores.length - 1] - data.scores[0];
    if (diff >= 0.5) parts.push(`Kết quả tiến bộ rõ (tăng ${fmt(diff)} điểm so với bài đầu).`);
    else if (diff <= -0.5) parts.push(`Kết quả bài gần nhất giảm ${fmt(-diff)} điểm so với bài đầu, cần chú ý ôn tập.`);
    else parts.push("Kết quả ổn định qua các bài.");
  }
  const chapters = data.byChapter.filter((c) => c.total >= 2);
  const strong = chapters.filter((c) => pct(c) >= 0.8).map((c) => c.label);
  const weak = chapters.filter((c) => pct(c) < 0.5).map((c) => c.label);
  if (strong.length) parts.push(`Nắm vững: ${strong.join(", ")}.`);
  if (weak.length) parts.push(`Cần ôn tập thêm: ${weak.join(", ")}.`);
  const vd = data.byLevel.find((l) => l.label === "Vận dụng");
  if (vd && vd.total >= 2 && pct(vd) < 0.5) parts.push("Cần luyện thêm các câu vận dụng (bài tập tính toán).");
  const weakType = data.byType.filter((t) => t.total >= 2 && pct(t) < 0.5).map((t) => t.label.toLowerCase());
  if (weakType.length) parts.push(`Hay mắc lỗi ở dạng ${weakType.join(", ")}.`);
  if (avg >= 8) parts.push("Tiếp tục phát huy!");
  else if (avg < 5) parts.push("Nên xem lại phần Kiến thức, làm thí nghiệm ảo và Luyện tập ở các bài trên.");
  return parts.join(" ");
}
