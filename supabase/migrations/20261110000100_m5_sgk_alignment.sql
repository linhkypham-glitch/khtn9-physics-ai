-- =====================================================================
-- KHTN 9 – PHYSICS AI
-- Migration 0007 (Milestone 5): đối chiếu thí nghiệm Bài 12 – 17 với SGK.
-- Xoá các học liệu thí nghiệm mẫu cũ (do seed tạo, created_by null) để seed 03 nạp bản đúng SGK.
-- Không đụng tới học liệu do giáo viên tự thêm hoặc sửa (created_by khác null).
-- =====================================================================
delete from public.lesson_materials m
using public.lessons l
where m.lesson_id = l.id
  and m.section = 'experiment'
  and m.created_by is null
  and (
    (l.number = 12 and m.title = 'Thí nghiệm SGK: Đoạn mạch nối tiếp và song song')
    or (l.number = 13 and m.title = 'Hoạt động SGK: Năng lượng điện và công suất điện')
    or (l.number = 14 and m.title = 'Thí nghiệm SGK: Cảm ứng điện từ')
    or (l.number = 15 and m.title = 'Thí nghiệm SGK: Tác dụng của dòng điện xoay chiều')
    or (l.number = 16 and m.title = 'Hoạt động SGK: Sơ đồ vòng năng lượng')
    or (l.number = 17 and m.title = 'Hoạt động SGK: Tìm hiểu năng lượng tái tạo')
  );
