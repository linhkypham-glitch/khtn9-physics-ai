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
