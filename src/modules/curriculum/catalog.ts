/**
 * DANH MỤC CHƯƠNG TRÌNH CHÍNH THỨC – KHTN 9 (phân môn Vật lý)
 *
 * Đây là nguồn chuẩn duy nhất trong mã nguồn cho mục lục 5 chương / 17 bài.
 * File seed `supabase/seed/01_curriculum.sql` phải khớp tuyệt đối với danh mục này
 * (được kiểm tra tự động bởi `tests/unit/curriculum-seed.test.ts`).
 *
 * KHÔNG thay đổi tên chương, tên bài, số thứ tự; KHÔNG thêm Bài 1.
 */

export type CatalogLesson = {
  number: number;
  title: string;
  slug: string;
  /** Bài thực hành (Bài 9) được đánh dấu riêng. */
  lessonType: "theory" | "practice";
};

export type CatalogChapter = {
  number: number;
  roman: string;
  title: string;
  lessons: CatalogLesson[];
};

export const TEXTBOOK = {
  code: "KHTN9-KNTT-VL",
  name: "Khoa học tự nhiên 9",
  series: "Kết nối tri thức với cuộc sống",
  subject: "Vật lý",
  grade: 9,
} as const;

export const CURRICULUM: CatalogChapter[] = [
  {
    number: 1,
    roman: "I",
    title: "Năng lượng cơ học",
    lessons: [
      { number: 2, title: "Động năng. Thế năng", slug: "bai-2-dong-nang-the-nang", lessonType: "theory" },
      { number: 3, title: "Cơ năng", slug: "bai-3-co-nang", lessonType: "theory" },
      { number: 4, title: "Công và công suất", slug: "bai-4-cong-va-cong-suat", lessonType: "theory" },
    ],
  },
  {
    number: 2,
    roman: "II",
    title: "Ánh sáng",
    lessons: [
      { number: 5, title: "Khúc xạ ánh sáng", slug: "bai-5-khuc-xa-anh-sang", lessonType: "theory" },
      { number: 6, title: "Phản xạ toàn phần", slug: "bai-6-phan-xa-toan-phan", lessonType: "theory" },
      { number: 7, title: "Lăng kính", slug: "bai-7-lang-kinh", lessonType: "theory" },
      { number: 8, title: "Thấu kính", slug: "bai-8-thau-kinh", lessonType: "theory" },
      {
        number: 9,
        title: "Thực hành đo tiêu cự của thấu kính hội tụ",
        slug: "bai-9-thuc-hanh-do-tieu-cu-thau-kinh-hoi-tu",
        lessonType: "practice",
      },
      { number: 10, title: "Kính lúp. Bài tập thấu kính", slug: "bai-10-kinh-lup-bai-tap-thau-kinh", lessonType: "theory" },
    ],
  },
  {
    number: 3,
    roman: "III",
    title: "Điện",
    lessons: [
      { number: 11, title: "Điện trở. Định luật Ohm", slug: "bai-11-dien-tro-dinh-luat-ohm", lessonType: "theory" },
      { number: 12, title: "Đoạn mạch nối tiếp, song song", slug: "bai-12-doan-mach-noi-tiep-song-song", lessonType: "theory" },
      {
        number: 13,
        title: "Năng lượng của dòng điện và công suất điện",
        slug: "bai-13-nang-luong-dong-dien-cong-suat-dien",
        lessonType: "theory",
      },
    ],
  },
  {
    number: 4,
    roman: "IV",
    title: "Điện từ",
    lessons: [
      {
        number: 14,
        title: "Cảm ứng điện từ. Nguyên tắc tạo ra dòng điện xoay chiều",
        slug: "bai-14-cam-ung-dien-tu-dong-dien-xoay-chieu",
        lessonType: "theory",
      },
      { number: 15, title: "Tác dụng của dòng điện xoay chiều", slug: "bai-15-tac-dung-dong-dien-xoay-chieu", lessonType: "theory" },
    ],
  },
  {
    number: 5,
    roman: "V",
    title: "Năng lượng với cuộc sống",
    lessons: [
      {
        number: 16,
        title: "Vòng năng lượng trên Trái Đất. Năng lượng hóa thạch",
        slug: "bai-16-vong-nang-luong-nang-luong-hoa-thach",
        lessonType: "theory",
      },
      { number: 17, title: "Một số dạng năng lượng tái tạo", slug: "bai-17-nang-luong-tai-tao", lessonType: "theory" },
    ],
  },
];

export const CHAPTER_COUNT = CURRICULUM.length;
export const LESSON_COUNT = CURRICULUM.reduce((sum, c) => sum + c.lessons.length, 0);

/* ===================================================================== */
/* HOÁ HỌC 9 – cùng bộ sách KHTN 9 Kết nối tri thức (Chương VI – X, Bài 18 – 35) */
/* Mục lục chép nguyên văn từ trang đầu mỗi chương và mỗi bài của SGK.     */
/* ===================================================================== */

export const TEXTBOOK_HOA = {
  code: "KHTN9-KNTT-HH",
  name: "Khoa học tự nhiên 9",
  series: "Kết nối tri thức với cuộc sống",
  subject: "Hoá học",
  grade: 9,
} as const;

export const CURRICULUM_HOA: CatalogChapter[] = [
  {
    number: 6,
    roman: "VI",
    title: "Kim loại. Sự khác nhau cơ bản giữa phi kim và kim loại",
    lessons: [
      { number: 18, title: "Tính chất chung của kim loại", slug: "bai-18-tinh-chat-chung-cua-kim-loai", lessonType: "theory" },
      { number: 19, title: "Dãy hoạt động hoá học", slug: "bai-19-day-hoat-dong-hoa-hoc", lessonType: "theory" },
      { number: 20, title: "Tách kim loại và việc sử dụng hợp kim", slug: "bai-20-tach-kim-loai-va-su-dung-hop-kim", lessonType: "theory" },
      { number: 21, title: "Sự khác nhau cơ bản giữa phi kim và kim loại", slug: "bai-21-su-khac-nhau-co-ban-giua-phi-kim-va-kim-loai", lessonType: "theory" },
    ],
  },
  {
    number: 7,
    roman: "VII",
    title: "Giới thiệu về chất hữu cơ. Hydrocarbon và nguồn nhiên liệu",
    lessons: [
      { number: 22, title: "Giới thiệu về hợp chất hữu cơ", slug: "bai-22-gioi-thieu-ve-hop-chat-huu-co", lessonType: "theory" },
      { number: 23, title: "Alkane", slug: "bai-23-alkane", lessonType: "theory" },
      { number: 24, title: "Alkene", slug: "bai-24-alkene", lessonType: "theory" },
      { number: 25, title: "Nguồn nhiên liệu", slug: "bai-25-nguon-nhien-lieu", lessonType: "theory" },
    ],
  },
  {
    number: 8,
    roman: "VIII",
    title: "Ethylic alcohol và acetic acid",
    lessons: [
      { number: 26, title: "Ethylic alcohol", slug: "bai-26-ethylic-alcohol", lessonType: "theory" },
      { number: 27, title: "Acetic acid", slug: "bai-27-acetic-acid", lessonType: "theory" },
    ],
  },
  {
    number: 9,
    roman: "IX",
    title: "Lipid. Carbohydrate. Protein. Polymer",
    lessons: [
      { number: 28, title: "Lipid", slug: "bai-28-lipid", lessonType: "theory" },
      { number: 29, title: "Carbohydrate. Glucose và saccharose", slug: "bai-29-carbohydrate-glucose-va-saccharose", lessonType: "theory" },
      { number: 30, title: "Tinh bột và cellulose", slug: "bai-30-tinh-bot-va-cellulose", lessonType: "theory" },
      { number: 31, title: "Protein", slug: "bai-31-protein", lessonType: "theory" },
      { number: 32, title: "Polymer", slug: "bai-32-polymer", lessonType: "theory" },
    ],
  },
  {
    number: 10,
    roman: "X",
    title: "Khai thác tài nguyên từ vỏ Trái Đất",
    lessons: [
      { number: 33, title: "Sơ lược về hoá học vỏ Trái Đất và khai thác tài nguyên từ vỏ Trái Đất", slug: "bai-33-so-luoc-ve-hoa-hoc-vo-trai-dat-va-khai-thac-tai-nguyen", lessonType: "theory" },
      { number: 34, title: "Khai thác đá vôi. Công nghiệp silicate", slug: "bai-34-khai-thac-da-voi-cong-nghiep-silicate", lessonType: "theory" },
      { number: 35, title: "Khai thác nhiên liệu hoá thạch. Nguồn carbon. Chu trình carbon và sự ấm lên toàn cầu", slug: "bai-35-khai-thac-nhien-lieu-hoa-thach-nguon-carbon", lessonType: "theory" },
    ],
  },
];

export type SubjectKey = "vat-ly" | "hoa-hoc";

export const SUBJECTS: Record<SubjectKey, { label: string; textbook: { code: string; subject: string }; curriculum: CatalogChapter[] }> = {
  "vat-ly": { label: "Vật lý", textbook: TEXTBOOK, curriculum: CURRICULUM },
  "hoa-hoc": { label: "Hoá học", textbook: TEXTBOOK_HOA, curriculum: CURRICULUM_HOA },
};

export function parseSubject(value: string | string[] | undefined): SubjectKey {
  const v = Array.isArray(value) ? value[0] : value;
  return v === "hoa-hoc" ? "hoa-hoc" : "vat-ly";
}

/** Mã sách của một bài học theo số bài (Bài 2 – 17: Vật lý; Bài 18 – 35: Hoá học). */
export function textbookCodeOfLesson(lessonNumber: number): string {
  return lessonNumber >= 18 ? TEXTBOOK_HOA.code : TEXTBOOK.code;
}
