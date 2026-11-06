import { describe, expect, it } from "vitest";

import { buildMatrix, DEFAULT_STRUCTURE, describeScores, pickQuestions, splitByPercent, suggestComment, type BankItem } from "@/modules/assessments/logic";

function seeded(seed = 42) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function bank(): BankItem[] {
  const items: BankItem[] = [];
  let n = 0;
  for (let lesson = 5; lesson <= 10; lesson++) {
    for (const level of ["biet", "biet", "hieu", "van_dung"] as const) items.push({ id: `mc${n++}`, type: "multiple_choice", level, lessonNumber: lesson });
    items.push({ id: `tf${n++}`, type: "true_false", level: "hieu", lessonNumber: lesson });
    items.push({ id: `sa${n++}`, type: "short_answer", level: "van_dung", lessonNumber: lesson });
    items.push({ id: `sa${n++}`, type: "short_answer", level: "van_dung", lessonNumber: lesson });
  }
  return items;
}

describe("Cấu trúc đề mặc định của ứng dụng", () => {
  it("18 + 2 + 6 = 26 câu, 32 đơn vị trả lời", () => {
    const s = DEFAULT_STRUCTURE;
    expect(s.multiple_choice.count + s.true_false.count + s.short_answer.count).toBe(26);
    expect(s.multiple_choice.count + s.true_false.count * 4 + s.short_answer.count).toBe(32);
  });
});

describe("Chia theo tỉ lệ mức độ", () => {
  it("tổng luôn bằng n", () => {
    expect(splitByPercent(18, { biet: 40, hieu: 30, van_dung: 30 })).toEqual({ biet: 7, hieu: 6, van_dung: 5 });
    for (const n of [1, 2, 5, 7, 26]) {
      const r = splitByPercent(n, { biet: 33, hieu: 33, van_dung: 34 });
      expect(r.biet + r.hieu + r.van_dung).toBe(n);
    }
  });
});

describe("Chọn câu tự động từ ngân hàng", () => {
  it("đủ số câu theo dạng, không trùng, không lấy câu bị loại trừ", () => {
    const b = bank();
    const { picked, warnings } = pickQuestions(b, DEFAULT_STRUCTURE, new Set(["mc0"]), seeded());
    expect(picked.filter((p) => p.type === "multiple_choice")).toHaveLength(18);
    expect(picked.filter((p) => p.type === "true_false")).toHaveLength(2);
    expect(picked.filter((p) => p.type === "short_answer")).toHaveLength(6);
    expect(new Set(picked.map((p) => p.id)).size).toBe(26);
    expect(picked.some((p) => p.id === "mc0")).toBe(false);
    expect(picked.find((p) => p.type === "true_false")!.points).toBe(1);
    // ngân hàng không có câu trắc nghiệm "vận dụng" đủ tỉ lệ → có cảnh báo lấy bù
    expect(warnings.length).toBeGreaterThan(0);
  });

  it("rải đều câu hỏi giữa các bài", () => {
    const { picked } = pickQuestions(bank(), { ...DEFAULT_STRUCTURE, multiple_choice: { count: 6, points: 1 }, true_false: { count: 0, points: 1 }, short_answer: { count: 0, points: 1 }, levels: { biet: 100, hieu: 0, van_dung: 0 } }, new Set(), seeded(7));
    const lessons = picked.map((p) => bank().find((b) => b.id === p.id)!.lessonNumber);
    expect(new Set(lessons).size).toBe(6);
  });

  it("cảnh báo khi ngân hàng không đủ câu", () => {
    const { picked, warnings } = pickQuestions(bank().slice(0, 7), DEFAULT_STRUCTURE, new Set(), seeded());
    expect(picked.length).toBeLessThan(26);
    expect(warnings.join(" ")).toContain("Ngân hàng chỉ có");
  });
});

describe("Ma trận đề và thống kê", () => {
  it("ma trận đếm theo bài, mức độ; tính tổng điểm, đơn vị trả lời", () => {
    const m = buildMatrix([
      { type: "multiple_choice", level: "biet", points: 0.25, lessonNumber: 11, lessonTitle: "Điện trở", chapterRoman: "III" },
      { type: "true_false", level: "hieu", points: 1, lessonNumber: 11, lessonTitle: "Điện trở", chapterRoman: "III" },
      { type: "short_answer", level: "van_dung", points: 0.5, lessonNumber: 12, lessonTitle: "Đoạn mạch", chapterRoman: "III" },
    ]);
    expect(m.totalPoints).toBe(1.75);
    expect(m.totalUnits).toBe(6);
    expect(m.rows[0].cells["true_false:hieu"]).toBe(1);
    expect(m.byLevel.find((l) => l.level === "hieu")!.points).toBe(1);
  });

  it("thống kê điểm lớp", () => {
    const d = describeScores([4, 6, 7, 9]);
    expect(d.avg).toBe(6.5);
    expect(d.max).toBe(9);
    expect(d.passRate).toBe(75);
    expect(d.distribution).toEqual([1, 1, 1, 1]);
    expect(describeScores([]).avg).toBeNull();
  });

  it("gợi ý nhận xét chỉ dựa trên dữ liệu kết quả", () => {
    const text = suggestComment("Nguyễn Văn An", {
      scores: [5, 7.5],
      byChapter: [{ label: "Chương III. Điện", correct: 9, total: 10 }, { label: "Chương II. Ánh sáng", correct: 1, total: 6 }],
      byLevel: [{ label: "Vận dụng", correct: 1, total: 5 }],
      byType: [{ label: "Trả lời ngắn", correct: 1, total: 4 }],
    });
    expect(text).toContain("điểm trung bình 6,3/10");
    expect(text).toContain("tiến bộ");
    expect(text).toContain("Nắm vững: Chương III. Điện");
    expect(text).toContain("Cần ôn tập thêm: Chương II. Ánh sáng");
    expect(text).toContain("vận dụng");
    expect(suggestComment("A", { scores: [], byChapter: [], byLevel: [], byType: [] })).toContain("chưa có");
  });
});
