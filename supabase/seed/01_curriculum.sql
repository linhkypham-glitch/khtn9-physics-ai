-- =====================================================================
-- SEED CHƯƠNG TRÌNH HỌC KHTN 9 – VẬT LÝ
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

-- =====================================================================
-- SEED CHƯƠNG TRÌNH HỌC KHTN 9 – HOÁ HỌC
-- File được sinh tự động từ src/modules/curriculum/catalog.ts
--   npm run seed:generate
-- KHÔNG sửa tay. Có thể chạy trên Supabase Cloud (SQL Editor) – idempotent.
-- =====================================================================

insert into public.textbooks (code, name, series, subject, grade)
values ('KHTN9-KNTT-HH', 'Khoa học tự nhiên 9', 'Kết nối tri thức với cuộc sống', 'Hoá học', 9)
on conflict (code) do update set
  name = excluded.name, series = excluded.series, subject = excluded.subject, grade = excluded.grade;

insert into public.chapters (textbook_id, number, roman, title, sort_order)
select t.id, v.number, v.roman, v.title, v.number
from public.textbooks t
cross join (values
  (6, 'VI', 'Kim loại. Sự khác nhau cơ bản giữa phi kim và kim loại'),
  (7, 'VII', 'Giới thiệu về chất hữu cơ. Hydrocarbon và nguồn nhiên liệu'),
  (8, 'VIII', 'Ethylic alcohol và acetic acid'),
  (9, 'IX', 'Lipid. Carbohydrate. Protein. Polymer'),
  (10, 'X', 'Khai thác tài nguyên từ vỏ Trái Đất')
) as v(number, roman, title)
where t.code = 'KHTN9-KNTT-HH'
on conflict (textbook_id, number) do update set
  roman = excluded.roman, title = excluded.title, sort_order = excluded.sort_order;

insert into public.lessons (chapter_id, number, title, slug, lesson_type, sort_order)
select c.id, v.number, v.title, v.slug, v.lesson_type::public.lesson_type, v.number
from (values
  (6, 18, 'Tính chất chung của kim loại', 'bai-18-tinh-chat-chung-cua-kim-loai', 'theory'),
  (6, 19, 'Dãy hoạt động hoá học', 'bai-19-day-hoat-dong-hoa-hoc', 'theory'),
  (6, 20, 'Tách kim loại và việc sử dụng hợp kim', 'bai-20-tach-kim-loai-va-su-dung-hop-kim', 'theory'),
  (6, 21, 'Sự khác nhau cơ bản giữa phi kim và kim loại', 'bai-21-su-khac-nhau-co-ban-giua-phi-kim-va-kim-loai', 'theory'),
  (7, 22, 'Giới thiệu về hợp chất hữu cơ', 'bai-22-gioi-thieu-ve-hop-chat-huu-co', 'theory'),
  (7, 23, 'Alkane', 'bai-23-alkane', 'theory'),
  (7, 24, 'Alkene', 'bai-24-alkene', 'theory'),
  (7, 25, 'Nguồn nhiên liệu', 'bai-25-nguon-nhien-lieu', 'theory'),
  (8, 26, 'Ethylic alcohol', 'bai-26-ethylic-alcohol', 'theory'),
  (8, 27, 'Acetic acid', 'bai-27-acetic-acid', 'theory'),
  (9, 28, 'Lipid', 'bai-28-lipid', 'theory'),
  (9, 29, 'Carbohydrate. Glucose và saccharose', 'bai-29-carbohydrate-glucose-va-saccharose', 'theory'),
  (9, 30, 'Tinh bột và cellulose', 'bai-30-tinh-bot-va-cellulose', 'theory'),
  (9, 31, 'Protein', 'bai-31-protein', 'theory'),
  (9, 32, 'Polymer', 'bai-32-polymer', 'theory'),
  (10, 33, 'Sơ lược về hoá học vỏ Trái Đất và khai thác tài nguyên từ vỏ Trái Đất', 'bai-33-so-luoc-ve-hoa-hoc-vo-trai-dat-va-khai-thac-tai-nguyen', 'theory'),
  (10, 34, 'Khai thác đá vôi. Công nghiệp silicate', 'bai-34-khai-thac-da-voi-cong-nghiep-silicate', 'theory'),
  (10, 35, 'Khai thác nhiên liệu hoá thạch. Nguồn carbon. Chu trình carbon và sự ấm lên toàn cầu', 'bai-35-khai-thac-nhien-lieu-hoa-thach-nguon-carbon', 'theory')
) as v(chapter_number, number, title, slug, lesson_type)
join public.chapters c on c.number = v.chapter_number
join public.textbooks t on t.id = c.textbook_id and t.code = 'KHTN9-KNTT-HH'
on conflict (slug) do update set
  chapter_id = excluded.chapter_id, number = excluded.number, title = excluded.title,
  lesson_type = excluded.lesson_type, sort_order = excluded.sort_order;
