import { describe, expect, it } from "vitest";

import { BOOK_EXPERIMENTS_HOA, LESSON_CONTENT_HOA } from "@/modules/curriculum/content/lessons-hoa";
import { QUESTIONS_HOA } from "@/modules/question-bank/seed/chemistry";
import { checkEquation } from "@/modules/virtual-lab/chem-balance";
import { ACTIVITY_SERIES, ALKANE_COMBUSTION, CHEM_LABS, METAL_REACTIONS } from "@/modules/virtual-lab/chem-data";
import { EXPERIMENTS } from "@/modules/virtual-lab/catalog";

describe("Công cụ kiểm tra cân bằng phương trình", () => {
  it("nhận biết đúng phương trình cân bằng", () => {
    expect(checkEquation("2Na + 2H₂O → 2NaOH + H₂")?.balanced).toBe(true);
    expect(checkEquation("C₄H₁₀ + 13/2 O₂ →(t°) 4CO₂ + 5H₂O")?.balanced).toBe(true);
    expect(checkEquation("2CH₃COOH + CaCO₃ → (CH₃COO)₂Ca + CO₂ + H₂O")?.balanced).toBe(true);
    expect(checkEquation("CH₂=CH₂ + Br–Br → CH₂Br–CH₂Br")?.balanced).toBe(true);
  });
  it("phát hiện phương trình sai và bỏ qua polymer", () => {
    expect(checkEquation("Na + H₂O → NaOH + H₂")?.balanced).toBe(false);
    expect(checkEquation("2Fe + O₂ → Fe₂O₃")?.balanced).toBe(false);
    expect(checkEquation("nCH₂=CH₂ →(t°, p, xúc tác) (–CH₂–CH₂–)ₙ")).toBeNull();
  });
});

describe("Thí nghiệm ảo Hoá học", () => {
  const outcomes = Object.entries(CHEM_LABS).flatMap(([key, cfg]) => cfg.reagents.flatMap((r) => r.subjects.map((s) => ({ key, reagent: r.id, subject: s.id, o: s.outcome }))));

  it("mọi phương trình hoá học trong thí nghiệm đều cân bằng", () => {
    const unbalanced: string[] = [];
    let checked = 0;
    for (const { key, reagent, subject, o } of outcomes) {
      if (!o.equation) continue;
      const r = checkEquation(o.equation);
      if (r === null) continue;
      checked++;
      if (!r.balanced) unbalanced.push(`${key}/${reagent}/${subject}: ${o.equation}`);
    }
    expect(unbalanced).toEqual([]);
    expect(checked).toBeGreaterThan(50);
  });

  it("mỗi thí nghiệm trong catalog có cấu hình và ngược lại", () => {
    const chemKeys = EXPERIMENTS.filter((e) => e.lessonNumber >= 18).map((e) => e.key).sort();
    expect(Object.keys(CHEM_LABS).sort()).toEqual(chemKeys);
  });

  it("mỗi lựa chọn có hiện tượng; trường hợp có phản ứng và có kim loại có phương trình", () => {
    for (const { key, o } of outcomes) {
      expect(o.observation.length, key).toBeGreaterThan(15);
    }
    for (const r of METAL_REACTIONS.reagents) for (const s of r.subjects) if (s.outcome.reacts) expect(s.outcome.equation, `${r.id}/${s.id}`).toBeTruthy();
  });

  it("Bài 19: dãy hoạt động đúng như SGK và mọi kim loại đều có trong dãy", () => {
    expect(ACTIVITY_SERIES.join(", ")).toBe("K, Na, Ca, Mg, Al, Zn, Fe, Pb, H, Cu, Ag, Au");
    for (const r of CHEM_LABS["activity-series"].reagents) for (const s of r.subjects) expect(ACTIVITY_SERIES, s.id).toContain(s.id);
  });

  it("Bài 19: kết quả phản ứng khớp quy tắc của dãy hoạt động", () => {
    const idx = (m: string) => ACTIVITY_SERIES.indexOf(m as (typeof ACTIVITY_SERIES)[number]);
    const bySalt: Record<string, string> = { agno3: "Ag", cuso4: "Cu" };
    for (const r of CHEM_LABS["activity-series"].reagents) {
      for (const s of r.subjects) {
        const m = s.id;
        let expected: boolean;
        if (r.id === "water") expected = ["K", "Na", "Ca"].includes(m);
        else if (r.id === "hcl" || r.id === "h2so4") expected = idx(m) < idx("H");
        else expected = idx(m) < idx(bySalt[r.id]) && !["K", "Na", "Ca"].includes(m);
        expect(s.outcome.reacts, `${r.id}/${m}`).toBe(expected);
      }
    }
  });

  it("Bài 23: nhiệt lượng toả ra của alkane đúng theo bảng SGK", () => {
    const heat = Object.fromEntries(ALKANE_COMBUSTION.reagents.map((r) => [r.id, r.subjects[0].outcome.facts?.[0].value]));
    expect(heat).toEqual({ methane: "891 kJ", ethane: "1 561 kJ", propane: "2 220 kJ", butane: "2 878 kJ" });
  });
});

describe("Nội dung Hoá học Bài 18 – 35", () => {
  it("đủ 18 bài, mỗi bài có mục tiêu, yêu cầu cần đạt và kiến thức", () => {
    expect(LESSON_CONTENT_HOA.map((l) => l.lessonNumber)).toEqual(Array.from({ length: 18 }, (_, i) => i + 18));
    for (const l of LESSON_CONTENT_HOA) {
      expect(l.objectives.length, `Bài ${l.lessonNumber}`).toBeGreaterThan(0);
      expect(l.requirements.length, `Bài ${l.lessonNumber}`).toBeGreaterThan(0);
      expect(l.knowledge.length, `Bài ${l.lessonNumber}`).toBeGreaterThan(0);
      expect(l.knowledge.some((b) => /^(Thí nghiệm|Hoạt động tìm hiểu)/.test(b.title))).toBe(false);
    }
  });

  it("bài có thí nghiệm ảo thì có mô tả thí nghiệm trong sách; bài không có thì ghi rõ", () => {
    for (const e of EXPERIMENTS.filter((x) => x.lessonNumber >= 18)) expect(BOOK_EXPERIMENTS_HOA[e.lessonNumber]?.length, `Bài ${e.lessonNumber}`).toBeGreaterThan(0);
    for (const n of [20, 22, 25, 28, 32, 33, 34, 35]) expect(BOOK_EXPERIMENTS_HOA[n][0].title).toContain("không có thí nghiệm thực hành");
  });

  it("câu hỏi: mã không trùng, mỗi bài 4 – 5 câu, đáp án hợp lệ", () => {
    const codes = QUESTIONS_HOA.flatMap((l) => l.questions.map((q) => q.code));
    expect(new Set(codes).size).toBe(codes.length);
    expect(QUESTIONS_HOA.map((l) => l.lessonNumber)).toEqual(Array.from({ length: 18 }, (_, i) => i + 18));
    for (const l of QUESTIONS_HOA) {
      expect(l.questions.length).toBeGreaterThanOrEqual(4);
      expect(l.questions.length).toBeLessThanOrEqual(5);
      for (const q of l.questions) {
        expect(q.code.startsWith(`B${l.lessonNumber}-`)).toBe(true);
        expect(q.explanation.length).toBeGreaterThan(5);
        if (q.type === "multiple_choice") expect(new Set(q.options).size).toBe(4);
        if (q.type === "true_false") expect(q.items.some((i) => i.isTrue) && q.items.some((i) => !i.isTrue)).toBe(true);
      }
    }
  });

  it("đáp án các câu trắc nghiệm không dồn vào một phương án", () => {
    const letters = QUESTIONS_HOA.flatMap((l) => l.questions).flatMap((q) => (q.type === "multiple_choice" ? [q.correct] : []));
    const count = (c: string) => letters.filter((x) => x === c).length;
    for (const c of ["A", "B", "C", "D"]) expect(count(c)).toBeGreaterThan(5);
  });
});
