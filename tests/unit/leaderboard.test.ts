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

import { weekPeriod } from "@/modules/leaderboard/logic";
import { scoreDistribution, supportFlag } from "@/modules/assessments/class-report-logic";

describe("báo cáo lớp theo kỳ", () => {
  it("tuần bắt đầu thứ Hai (giờ VN), kéo dài 7 ngày", () => {
    // Thứ Tư 2026-11-04 10:00 giờ VN
    const p = weekPeriod(new Date("2026-11-04T03:00:00Z"));
    expect(p.from.toISOString()).toBe("2026-11-01T17:00:00.000Z"); // thứ Hai 02/11 00:00 +07
    expect(p.to.toISOString()).toBe("2026-11-08T16:59:59.000Z"); // Chủ nhật 08/11 23:59:59 +07
    expect(p.label).toBe("Tuần 02/11 – 08/11");
    expect(weekPeriod(new Date("2026-11-04T03:00:00Z"), 1).label).toBe("Tuần 26/10 – 01/11");
  });
  it("Chủ nhật vẫn thuộc tuần trước", () => {
    expect(weekPeriod(new Date("2026-11-08T12:00:00Z")).label).toBe("Tuần 02/11 – 08/11");
    expect(weekPeriod(new Date("2026-11-08T18:00:00Z")).label).toBe("Tuần 09/11 – 15/11"); // 09/11 01:00 giờ VN
  });
  it("phân bố điểm", () => {
    expect(scoreDistribution([3, 5, 6.4, 6.5, 7.9, 8, 10]).map((b) => b.count)).toEqual([1, 2, 2, 2]);
  });
  it("cờ hỗ trợ", () => {
    expect(supportFlag({ tests: 0, practice: 0, labRuns: 0, avg: null, first: null, last: null })).toBe("no_activity");
    expect(supportFlag({ tests: 2, practice: 0, labRuns: 0, avg: 4.5, first: 5, last: 4 })).toBe("low_score");
    expect(supportFlag({ tests: 3, practice: 0, labRuns: 0, avg: 7, first: 9, last: 7 })).toBe("declining");
    expect(supportFlag({ tests: 2, practice: 1, labRuns: 0, avg: 8, first: 7, last: 9 })).toBe("none");
  });
});
