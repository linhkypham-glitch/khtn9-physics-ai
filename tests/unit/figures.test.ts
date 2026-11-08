import { describe, expect, it } from "vitest";

import { figuresForLesson } from "@/modules/curriculum/figures";

describe("hình ảnh trực quan", () => {
  it("mỗi bài 2–35 có ít nhất 1 hình, id không trùng", () => {
    const ids = new Set<string>();
    for (let n = 2; n <= 35; n++) {
      const figs = figuresForLesson(n);
      expect(figs.length, `Bài ${n}`).toBeGreaterThan(0);
      for (const f of figs) {
        expect(ids.has(f.id), f.id).toBe(false);
        ids.add(f.id);
        expect(f.title && f.caption).toBeTruthy();
      }
    }
  });
});
