/** Logic thuần cho báo cáo lớp theo kỳ (có kiểm thử). */

export type ScoreBucket = { label: string; count: number };

/** Phân bố điểm (thang 10): dưới 5 / 5–<6,5 / 6,5–<8 / từ 8. */
export function scoreDistribution(scores: number[]): ScoreBucket[] {
  const b = [
    { label: "Dưới 5", count: 0 },
    { label: "5 – dưới 6,5", count: 0 },
    { label: "6,5 – dưới 8", count: 0 },
    { label: "Từ 8 trở lên", count: 0 },
  ];
  for (const s of scores) b[s < 5 ? 0 : s < 6.5 ? 1 : s < 8 ? 2 : 3].count++;
  return b;
}

export type SupportFlag = "none" | "low_score" | "no_activity" | "declining";

/**
 * Gợi ý học sinh cần hỗ trợ (chỉ dựa trên số liệu, giáo viên quyết định):
 * không có hoạt động nào trong kỳ; điểm TB < 5; hoặc điểm giảm ≥ 1,5 so với bài đầu kỳ.
 */
export function supportFlag(s: { tests: number; practice: number; labRuns: number; avg: number | null; first: number | null; last: number | null }): SupportFlag {
  if (s.tests + s.practice + s.labRuns === 0) return "no_activity";
  if (s.avg !== null && s.avg < 5) return "low_score";
  if (s.tests >= 2 && s.first !== null && s.last !== null && s.first - s.last >= 1.5) return "declining";
  return "none";
}

export const SUPPORT_LABEL: Record<SupportFlag, string> = {
  none: "",
  low_score: "Điểm TB dưới 5",
  no_activity: "Chưa có hoạt động",
  declining: "Điểm đang giảm",
};

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}
