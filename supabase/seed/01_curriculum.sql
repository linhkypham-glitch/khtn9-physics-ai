-- =====================================================================
-- SEED CHƯƠNG TRÌNH HỌC KHTN 9 – VẬT LÝ (5 chương, 17 bài)
-- File được sinh tự động từ src/modules/curriculum/catalog.ts
--   npm run seed:generate
-- KHÔNG sửa tay. Có thể chạy trên Supabase Cloud (SQL Editor) – idempotent.
-- =====================================================================

insert into public.textbooks (code, name, series, subject, grade)
values ('KHTN9-KNTT-VL', 'Khoa học tự nhiên 9', 'Kết nối tri thức với cuộc sống', 'Vật lý', 9)
on conflict (code) do update set
  name = excluded.name, series = excluded.series, subject = excluded.subject, grade = excluded.grade;

insert into public.chapters (textbook_id, number, roman, title, sort_order)
select t.id, v.number, v.roman, v.title, v.number
from public.textbooks t
cross join (values
  (1, 'I', 'Năng lượng cơ học'),
  (2, 'II', 'Ánh sáng'),
  (3, 'III', 'Điện'),
  (4, 'IV', 'Điện từ'),
  (5, 'V', 'Năng lượng với cuộc sống')
) as v(number, roman, title)
where t.code = 'KHTN9-KNTT-VL'
on conflict (textbook_id, number) do update set
  roman = excluded.roman, title = excluded.title, sort_order = excluded.sort_order;

insert into public.lessons (chapter_id, number, title, slug, lesson_type, sort_order)
select c.id, v.number, v.title, v.slug, v.lesson_type::public.lesson_type, v.number
from (values
  (1, 2, 'Động năng. Thế năng', 'bai-2-dong-nang-the-nang', 'theory'),
  (1, 3, 'Cơ năng', 'bai-3-co-nang', 'theory'),
  (1, 4, 'Công và công suất', 'bai-4-cong-va-cong-suat', 'theory'),
  (2, 5, 'Khúc xạ ánh sáng', 'bai-5-khuc-xa-anh-sang', 'theory'),
  (2, 6, 'Phản xạ toàn phần', 'bai-6-phan-xa-toan-phan', 'theory'),
  (2, 7, 'Lăng kính', 'bai-7-lang-kinh', 'theory'),
  (2, 8, 'Thấu kính', 'bai-8-thau-kinh', 'theory'),
  (2, 9, 'Thực hành đo tiêu cự của thấu kính hội tụ', 'bai-9-thuc-hanh-do-tieu-cu-thau-kinh-hoi-tu', 'practice'),
  (2, 10, 'Kính lúp. Bài tập thấu kính', 'bai-10-kinh-lup-bai-tap-thau-kinh', 'theory'),
  (3, 11, 'Điện trở. Định luật Ohm', 'bai-11-dien-tro-dinh-luat-ohm', 'theory'),
  (3, 12, 'Đoạn mạch nối tiếp, song song', 'bai-12-doan-mach-noi-tiep-song-song', 'theory'),
  (3, 13, 'Năng lượng của dòng điện và công suất điện', 'bai-13-nang-luong-dong-dien-cong-suat-dien', 'theory'),
  (4, 14, 'Cảm ứng điện từ. Nguyên tắc tạo ra dòng điện xoay chiều', 'bai-14-cam-ung-dien-tu-dong-dien-xoay-chieu', 'theory'),
  (4, 15, 'Tác dụng của dòng điện xoay chiều', 'bai-15-tac-dung-dong-dien-xoay-chieu', 'theory'),
  (5, 16, 'Vòng năng lượng trên Trái Đất. Năng lượng hóa thạch', 'bai-16-vong-nang-luong-nang-luong-hoa-thach', 'theory'),
  (5, 17, 'Một số dạng năng lượng tái tạo', 'bai-17-nang-luong-tai-tao', 'theory')
) as v(chapter_number, number, title, slug, lesson_type)
join public.chapters c on c.number = v.chapter_number
join public.textbooks t on t.id = c.textbook_id and t.code = 'KHTN9-KNTT-VL'
on conflict (slug) do update set
  chapter_id = excluded.chapter_id, number = excluded.number, title = excluded.title,
  lesson_type = excluded.lesson_type, sort_order = excluded.sort_order;
