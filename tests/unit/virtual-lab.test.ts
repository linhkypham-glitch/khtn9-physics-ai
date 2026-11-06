import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { CURRICULUM } from "@/modules/curriculum/catalog";
import { EXPERIMENTS } from "@/modules/virtual-lab/catalog";

describe("Phòng thí nghiệm ảo", () => {
  it("mỗi bài học (Bài 2 → 17) có đúng một thí nghiệm", () => {
    const lessonNumbers = CURRICULUM.flatMap((c) => c.lessons.map((l) => l.number));
    expect(EXPERIMENTS.map((e) => e.lessonNumber).sort((a, b) => a - b)).toEqual(lessonNumbers);
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
