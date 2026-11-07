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
  it("Bài 13, 16, 17 được gắn nhãn bổ trợ; Bài 12, 14, 15 bám SGK", () => {
    const basis = (n: number) => EXPERIMENTS.find((e) => e.lessonNumber === n)?.basis;
    for (const n of [13, 16, 17]) expect(basis(n)).toBe("support");
    for (const n of [12, 14, 15]) expect(basis(n)).toBe("book");
  });
  it("mô tả Bài 12, 14 theo đúng số lượng thí nghiệm trong SGK", () => {
    expect(BOOK_EXPERIMENTS[12]).toHaveLength(2);
    expect(BOOK_EXPERIMENTS[14].filter((b) => b.title.startsWith("Thí nghiệm SGK")).length).toBe(5);
    for (const n of [13, 16, 17]) expect(BOOK_EXPERIMENTS[n][0].title).toContain("không có thí nghiệm thực hành");
  });
});
