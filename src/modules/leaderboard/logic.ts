/** Logic thuần cho bảng xếp hạng (có kiểm thử). */

export type RankInput = { id: string; name: string; className: string; score: number; durationSeconds: number | null; correctUnits: number | null; totalUnits: number | null; count?: number };
export type Ranked = RankInput & { rank: number };

/**
 * Xếp hạng: điểm cao hơn đứng trước; bằng điểm thì thời gian làm bài ngắn hơn đứng trước;
 * bằng cả hai thì cùng hạng (kiểu 1, 1, 3).
 */
export function rankEntries(entries: RankInput[]): Ranked[] {
  const key = (e: RankInput) => [-e.score, e.durationSeconds ?? Number.MAX_SAFE_INTEGER] as const;
  const sorted = [...entries].sort((a, b) => {
    const [a1, a2] = key(a);
    const [b1, b2] = key(b);
    return a1 - b1 || a2 - b2 || a.name.localeCompare(b.name, "vi");
  });
  const out: Ranked[] = [];
  sorted.forEach((e, i) => {
    const prev = out[i - 1];
    const same = prev && prev.score === e.score && (prev.durationSeconds ?? -1) === (e.durationSeconds ?? -1);
    out.push({ ...e, rank: same ? prev.rank : i + 1 });
  });
  return out;
}

export type Period = { key: string; label: string; from: Date; to: Date };

/** Học kỳ theo năm học: HK I từ đầu năm học đến 15/01, HK II từ 16/01 đến cuối năm học. */
export function semesterPeriods(yearStart: string, yearEnd: string): Period[] {
  const start = new Date(`${yearStart}T00:00:00+07:00`);
  const end = new Date(`${yearEnd}T23:59:59+07:00`);
  const split = new Date(`${start.getFullYear() + 1}-01-16T00:00:00+07:00`);
  return [
    { key: "hk1", label: "Học kỳ I", from: start, to: new Date(split.getTime() - 1000) },
    { key: "hk2", label: "Học kỳ II", from: split, to: end },
  ];
}

/** Tháng (múi giờ Việt Nam) chứa thời điểm `now`, hoặc tháng chỉ định dạng YYYY-MM. */
export function monthPeriod(now: Date, ym?: string): Period {
  const [y, m] = ym && /^\d{4}-\d{2}$/.test(ym) ? ym.split("-").map(Number) : [Number(now.toLocaleString("en-CA", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric" })), Number(now.toLocaleString("en-CA", { timeZone: "Asia/Ho_Chi_Minh", month: "2-digit" }))];
  const from = new Date(`${y}-${String(m).padStart(2, "0")}-01T00:00:00+07:00`);
  const next = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
  const to = new Date(new Date(`${next}-01T00:00:00+07:00`).getTime() - 1000);
  return { key: `${y}-${String(m).padStart(2, "0")}`, label: `Tháng ${m}/${y}`, from, to };
}
