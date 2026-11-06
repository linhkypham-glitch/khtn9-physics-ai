import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { CURRICULUM, TEXTBOOK } from "@/modules/curriculum/catalog";
import { buildCurriculumSeedSql } from "@/modules/curriculum/seed-sql";
import { formatChapterLabel, formatLessonLabel } from "@/modules/curriculum/types";

/** Mục lục chính thức (nguyên văn yêu cầu) – dùng để đối chiếu. */
const OFFICIAL = [
  "CHƯƠNG I. NĂNG LƯỢNG CƠ HỌC",
  "Bài 2. Động năng. Thế năng.",
  "Bài 3. Cơ năng.",
  "Bài 4. Công và công suất.",
  "CHƯƠNG II. ÁNH SÁNG",
  "Bài 5. Khúc xạ ánh sáng.",
  "Bài 6. Phản xạ toàn phần.",
  "Bài 7. Lăng kính.",
  "Bài 8. Thấu kính.",
  "Bài 9. Thực hành đo tiêu cự của thấu kính hội tụ.",
  "Bài 10. Kính lúp. Bài tập thấu kính.",
  "CHƯƠNG III. ĐIỆN",
  "Bài 11. Điện trở. Định luật Ohm.",
  "Bài 12. Đoạn mạch nối tiếp, song song.",
  "Bài 13. Năng lượng của dòng điện và công suất điện.",
  "CHƯƠNG IV. ĐIỆN TỪ",
  "Bài 14. Cảm ứng điện từ. Nguyên tắc tạo ra dòng điện xoay chiều.",
  "Bài 15. Tác dụng của dòng điện xoay chiều.",
  "CHƯƠNG V. NĂNG LƯỢNG VỚI CUỘC SỐNG",
  "Bài 16. Vòng năng lượng trên Trái Đất. Năng lượng hóa thạch.",
  "Bài 17. Một số dạng năng lượng tái tạo.",
];

describe("Danh mục chương trình KHTN 9 – Vật lý", () => {
  it("khớp nguyên văn mục lục chính thức", () => {
    const rendered = CURRICULUM.flatMap((c) => [
      formatChapterLabel(c).toLocaleUpperCase("vi"),
      ...c.lessons.map((l) => formatLessonLabel(l)),
    ]);
    expect(rendered).toEqual(OFFICIAL);
  });

  it("có 5 chương, bài bắt đầu từ Bài 2 và liên tục đến Bài 17, không có Bài 1", () => {
    expect(CURRICULUM).toHaveLength(5);
    const numbers = CURRICULUM.flatMap((c) => c.lessons.map((l) => l.number));
    expect(numbers).toEqual(Array.from({ length: 16 }, (_, i) => i + 2));
    expect(numbers).not.toContain(1);
  });

  it("slug là duy nhất và hợp lệ", () => {
    const slugs = CURRICULUM.flatMap((c) => c.lessons.map((l) => l.slug));
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("chỉ Bài 9 là bài thực hành", () => {
    const practice = CURRICULUM.flatMap((c) => c.lessons).filter((l) => l.lessonType === "practice");
    expect(practice.map((l) => l.number)).toEqual([9]);
  });
});

describe("Seed SQL chương trình học", () => {
  it("file supabase/seed/01_curriculum.sql được sinh từ danh mục chuẩn (không sửa tay)", () => {
    const file = readFileSync(resolve(__dirname, "../../supabase/seed/01_curriculum.sql"), "utf8");
    expect(file).toBe(buildCurriculumSeedSql());
  });

  it("escape dấu nháy đơn an toàn", () => {
    const sql = buildCurriculumSeedSql([
      { number: 1, roman: "I", title: "O'Neil", lessons: [{ number: 2, title: "a'b", slug: "x", lessonType: "theory" }] },
    ]);
    expect(sql).toContain("'O''Neil'");
    expect(sql).toContain("'a''b'");
  });

  it("chứa mã sách giáo khoa", () => {
    expect(buildCurriculumSeedSql()).toContain(TEXTBOOK.code);
  });
});
