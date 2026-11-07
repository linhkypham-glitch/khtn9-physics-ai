import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { CURRICULUM, CURRICULUM_HOA, TEXTBOOK, TEXTBOOK_HOA, textbookCodeOfLesson } from "@/modules/curriculum/catalog";
import { buildAllCurriculumSeedSql, buildCurriculumSeedSql } from "@/modules/curriculum/seed-sql";
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
    expect(file).toBe(buildAllCurriculumSeedSql());
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

/** Mục lục Hoá học 9 chép từ các trang đầu chương và đầu bài của SGK. */
const OFFICIAL_HOA = [
  "CHƯƠNG VI. KIM LOẠI. SỰ KHÁC NHAU CƠ BẢN GIỮA PHI KIM VÀ KIM LOẠI",
  "Bài 18. Tính chất chung của kim loại.",
  "Bài 19. Dãy hoạt động hoá học.",
  "Bài 20. Tách kim loại và việc sử dụng hợp kim.",
  "Bài 21. Sự khác nhau cơ bản giữa phi kim và kim loại.",
  "CHƯƠNG VII. GIỚI THIỆU VỀ CHẤT HỮU CƠ. HYDROCARBON VÀ NGUỒN NHIÊN LIỆU",
  "Bài 22. Giới thiệu về hợp chất hữu cơ.",
  "Bài 23. Alkane.",
  "Bài 24. Alkene.",
  "Bài 25. Nguồn nhiên liệu.",
  "CHƯƠNG VIII. ETHYLIC ALCOHOL VÀ ACETIC ACID",
  "Bài 26. Ethylic alcohol.",
  "Bài 27. Acetic acid.",
  "CHƯƠNG IX. LIPID. CARBOHYDRATE. PROTEIN. POLYMER",
  "Bài 28. Lipid.",
  "Bài 29. Carbohydrate. Glucose và saccharose.",
  "Bài 30. Tinh bột và cellulose.",
  "Bài 31. Protein.",
  "Bài 32. Polymer.",
  "CHƯƠNG X. KHAI THÁC TÀI NGUYÊN TỪ VỎ TRÁI ĐẤT",
  "Bài 33. Sơ lược về hoá học vỏ Trái Đất và khai thác tài nguyên từ vỏ Trái Đất.",
  "Bài 34. Khai thác đá vôi. Công nghiệp silicate.",
  "Bài 35. Khai thác nhiên liệu hoá thạch. Nguồn carbon. Chu trình carbon và sự ấm lên toàn cầu.",
];

describe("Danh mục chương trình KHTN 9 – Hoá học", () => {
  it("khớp mục lục SGK: 5 chương, Bài 18 → Bài 35", () => {
    const rendered = CURRICULUM_HOA.flatMap((c) => [formatChapterLabel(c).toLocaleUpperCase("vi"), ...c.lessons.map((l) => formatLessonLabel(l))]);
    expect(rendered).toEqual(OFFICIAL_HOA);
    expect(CURRICULUM_HOA.flatMap((c) => c.lessons.map((l) => l.number))).toEqual(Array.from({ length: 18 }, (_, i) => i + 18));
  });

  it("slug không trùng với Vật lý và hợp lệ", () => {
    const all = [...CURRICULUM, ...CURRICULUM_HOA].flatMap((c) => c.lessons.map((l) => l.slug));
    expect(new Set(all).size).toBe(all.length);
    for (const s of all) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("số chương không trùng giữa hai sách, mã sách đúng theo số bài", () => {
    expect(new Set([...CURRICULUM, ...CURRICULUM_HOA].map((c) => c.number)).size).toBe(10);
    expect(TEXTBOOK_HOA.code).not.toBe(TEXTBOOK.code);
    expect(textbookCodeOfLesson(17)).toBe(TEXTBOOK.code);
    expect(textbookCodeOfLesson(18)).toBe(TEXTBOOK_HOA.code);
  });

  it("seed sinh cho Hoá học chứa mã sách Hoá học", () => {
    const sql = buildCurriculumSeedSql(CURRICULUM_HOA, TEXTBOOK_HOA);
    expect(sql).toContain("KHTN9-KNTT-HH");
    expect(sql).toContain("Hoá học");
    expect(sql).not.toContain("KHTN9-KNTT-VL");
  });
});
