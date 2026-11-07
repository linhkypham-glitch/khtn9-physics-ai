import { describe, expect, it } from "vitest";

import { EXPERIMENTS } from "@/modules/virtual-lab/catalog";
import { SGK_PRESETS } from "@/modules/virtual-lab/experiments/sgk-presets";
import { BOOK_EXPERIMENTS } from "@/modules/curriculum/content/book-experiments";

const round2 = (x: number) => Math.round(x * 100) / 100;

describe("Bài 12 – số liệu thí nghiệm trong SGK", () => {
  it("nối tiếp, nguồn 12 V (Bảng 12.1)", () => {
    // Số đo trong SGK là số đo thực tế (làm tròn xuống ở 0,54 so với lí thuyết 0,545) → sai lệch ≤ 0,01 A
    const I = (r1: number, r2: number) => 12 / (r1 + r2);
    expect(Math.abs(I(SGK_PRESETS.s12.R1, SGK_PRESETS.s12.R2) - 0.75)).toBeLessThanOrEqual(0.01);
    expect(Math.abs(I(SGK_PRESETS.s13.R1, SGK_PRESETS.s13.R2) - 0.54)).toBeLessThanOrEqual(0.01);
    expect(Math.abs(I(SGK_PRESETS.s23.R1, SGK_PRESETS.s23.R2) - 0.46)).toBeLessThanOrEqual(0.01);
  });
  it("song song, nguồn 6 V (Bảng 12.2)", () => {
    const { R1, R2, U } = SGK_PRESETS.par;
    expect(round2(U / R1)).toBe(0.6);
    expect(round2(U / R2)).toBe(1.0);
    expect(round2(U / R1 + U / R2)).toBe(1.6);
    expect(round2(U / ((R1 * R2) / (R1 + R2)))).toBe(1.6);
  });
});

describe("Danh mục thí nghiệm và mô tả theo SGK", () => {
  it("mỗi bài 2 – 17 có đúng một thí nghiệm ảo", () => {
    expect(EXPERIMENTS.map((e) => e.lessonNumber)).toEqual(Array.from({ length: 16 }, (_, i) => i + 2));
  });
  it("Bài 2, 4, 13, 16, 17 (SGK không có thí nghiệm) gắn nhãn bổ trợ; các bài có thí nghiệm bám SGK", () => {
    const basis = (n: number) => EXPERIMENTS.find((e) => e.lessonNumber === n)?.basis;
    for (const n of [2, 4, 13, 16, 17]) expect(basis(n)).toBe("support");
    for (const n of [3, 5, 6, 7, 8, 9, 11, 12, 14, 15]) expect(basis(n)).toBe("book");
    expect(basis(10)).toBeUndefined();
  });
  it("mô tả Bài 12, 14 theo đúng số lượng thí nghiệm trong SGK", () => {
    expect(BOOK_EXPERIMENTS[12]).toHaveLength(2);
    expect(BOOK_EXPERIMENTS[14].filter((b) => b.title.startsWith("Thí nghiệm SGK")).length).toBe(5);
    for (const n of [2, 4, 13, 16, 17]) expect(BOOK_EXPERIMENTS[n][0].title).toContain("không có thí nghiệm thực hành");
    expect(BOOK_EXPERIMENTS[5]).toHaveLength(4);
    expect(BOOK_EXPERIMENTS[11]).toHaveLength(2);
  });
});

describe("Số liệu SGK khác", () => {
  it("Bài 5, Bảng 5.1: không khí → thuỷ tinh (n = 1,5) cho r gần số đo trong SGK", () => {
    const book: [number, number][] = [[0, 0], [20, 13], [40, 25], [60, 35], [80, 41]];
    for (const [i, r] of book) {
      const calc = (Math.asin(Math.sin((i * Math.PI) / 180) / 1.5) * 180) / Math.PI;
      expect(Math.abs(calc - r)).toBeLessThan(0.6);
    }
  });
  it("Bài 6: góc tới hạn thuỷ tinh – không khí ≈ 41,8°; nước – không khí với i = 60° không có tia khúc xạ", () => {
    expect(((Math.asin(1 / 1.5) * 180) / Math.PI).toFixed(1)).toBe("41.8");
    expect((4 / 3) * Math.sin((60 * Math.PI) / 180)).toBeGreaterThan(1);
  });
  it("Bài 11, Bảng 11.2: R = 6 Ω cho I = 0,5 A khi U = 3 V và 1,5 A khi U = 9 V", () => {
    expect(3 / 6).toBe(0.5);
    expect(9 / 6).toBe(1.5);
  });
  it("Bài 4, Hình 4.4: xe nâng 500 N / 10 s và 700 N / 15 s", () => {
    expect(500 / 10).toBe(50);
    expect(Math.round((700 / 15) * 10) / 10).toBe(46.7);
  });
  it("Bài 10, Hình 10.6: f = 5 cm, d = 7,5 cm, h = 2 cm → d' = 15 cm, h' = 4 cm", () => {
    const d2 = 1 / (1 / 5 - 1 / 7.5);
    expect(Math.round(d2)).toBe(15);
    expect(Math.round((2 * d2) / 7.5)).toBe(4);
  });
});
