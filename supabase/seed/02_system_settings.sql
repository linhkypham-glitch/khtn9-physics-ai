-- =====================================================================
-- Cấu hình hệ thống mặc định (idempotent, dùng được cho Supabase Cloud)
-- Không lưu API key hay bí mật trong bảng này.
-- =====================================================================

insert into public.system_settings (key, value, description) values
  ('app.name', '"KHTN 9 – PHYSICS AI"', 'Tên ứng dụng'),
  ('grading.scale', '10', 'Thang điểm mặc định'),
  ('leaderboard.enabled', 'true', 'Cho phép hiển thị bảng xếp hạng (giáo viên có thể tắt theo bài giao)'),
  ('assessment.default_structure',
   '{"multiple_choice": 18, "true_false": 2, "short_answer": 6, "note": "Cấu hình riêng của ứng dụng, không phải cấu trúc bắt buộc của Công văn 7991. Giáo viên có thể thay đổi."}',
   'Cấu trúc đề mặc định: 18 trắc nghiệm + 2 đúng-sai (4 ý) + 6 trả lời ngắn = 26 câu, 32 đơn vị trả lời')
on conflict (key) do nothing;
