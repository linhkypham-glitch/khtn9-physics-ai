import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { CURRICULUM, CURRICULUM_HOA } from "@/modules/curriculum/catalog";
import { EXPERIMENTS } from "@/modules/virtual-lab/catalog";

describe("Phòng thí nghiệm ảo", () => {
  it("mỗi bài Vật lý (Bài 2 → 17) có đúng một thí nghiệm", () => {
    const lessonNumbers = CURRICULUM.flatMap((c) => c.lessons.map((l) => l.number));
    expect(EXPERIMENTS.filter((e) => e.lessonNumber <= 17).map((e) => e.lessonNumber).sort((a, b) => a - b)).toEqual(lessonNumbers);
  });

  it("thí nghiệm Hoá học chỉ ở các bài Hoá học, mỗi bài tối đa một thí nghiệm", () => {
    const chem = new Set(CURRICULUM_HOA.flatMap((c) => c.lessons.map((l) => l.number)));
    const nums = EXPERIMENTS.filter((e) => e.lessonNumber >= 18).map((e) => e.lessonNumber);
    for (const n of nums) expect(chem.has(n)).toBe(true);
    expect(new Set(nums).size).toBe(nums.length);
  });

  it("khoá thí nghiệm không trùng và hợp lệ (chỉ chữ thường và dấu gạch ngang)", () => {
    const keys = EXPERIMENTS.map((e) => e.key);
    expect(new Set(keys).size).toBe(keys.length);
    for (const k of keys) expect(k).toMatch(/^[a-z-]{2,40}$/);
  });

  it("mỗi thí nghiệm có component mô phỏng, hướng dẫn và câu hỏi khám phá", () => {
    const panel = readFileSync(resolve(__dirname, "../../src/modules/virtual-lab/experiment-panel.tsx"), "utf8");
    for (const e of EXPERIMENTS) {
      expect(panel).toContain(`${/^[a-z]+$/.test(e.key) ? e.key : `"${e.key}"`}:`);
      expect(e.guide.length).toBeGreaterThan(1);
      expect(e.questions.length).toBeGreaterThan(0);
    }
  });
});
