import { describe, expect, it } from "vitest";

import { monthPeriod, rankEntries, semesterPeriods } from "@/modules/leaderboard/logic";

const e = (id: string, score: number, d: number | null) => ({ id, name: id, className: "9A", score, durationSeconds: d, correctUnits: null, totalUnits: null });

describe("Bảng xếp hạng", () => {
  it("điểm cao trước; bằng điểm thì làm nhanh hơn trước; bằng cả hai thì cùng hạng", () => {
    const r = rankEntries([e("An", 8, 600), e("Bình", 9, 900), e("Chi", 8, 500), e("Dũng", 8, 500), e("Em", 5, 100)]);
    expect(r.map((x) => [x.id, x.rank])).toEqual([["Bình", 1], ["Chi", 2], ["Dũng", 2], ["An", 4], ["Em", 5]]);
  });

  it("học kỳ I/II theo năm học", () => {
    const [hk1, hk2] = semesterPeriods("2026-09-05", "2027-05-31");
    expect(hk1.from.toISOString()).toBe("2026-09-04T17:00:00.000Z");
    expect(hk2.from.toISOString()).toBe("2027-01-15T17:00:00.000Z");
    expect(hk1.to.getTime()).toBeLessThan(hk2.from.getTime());
  });

  it("tháng theo giờ Việt Nam", () => {
    const p = monthPeriod(new Date("2026-11-30T20:00:00Z")); // 01/12 03:00 giờ VN
    expect(p.key).toBe("2026-12");
    expect(monthPeriod(new Date(), "2027-02").label).toBe("Tháng 2/2027");
  });
});
