-- =====================================================================
-- KHTN 9 – PHYSICS AI
-- Migration 0008 (Milestone 6): đối chiếu kiến thức và thí nghiệm Bài 2 – 17 với SGK.
-- Xoá các mục tiêu, kiến thức, thí nghiệm mẫu CŨ do seed tạo (created_by null) và CHƯA bị giáo viên sửa
-- (updated_at = created_at) để seed 03 nạp lại bản đúng SGK.
-- Không đụng tới học liệu do giáo viên tự thêm (created_by khác null) hoặc đã chỉnh sửa.
-- =====================================================================
delete from public.lesson_materials m
using public.lessons l
where m.lesson_id = l.id
  and l.number between 2 and 17
  and m.section in ('knowledge', 'experiment')
  and m.created_by is null
  and m.updated_at = m.created_at;

delete from public.learning_objectives o
using public.lessons l
where o.lesson_id = l.id
  and l.number between 2 and 17
  and o.created_by is null
  and o.updated_at = o.created_at;
