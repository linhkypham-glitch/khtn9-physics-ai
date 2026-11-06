-- =====================================================================
-- Migration 0003: Hàm lấy tên giáo viên của lớp
-- Học sinh không được đọc danh sách thành viên lớp (bảo vệ thông tin bạn học),
-- nhưng cần biết giáo viên phụ trách. Hàm chỉ trả về họ tên giáo viên của
-- những lớp mà người gọi là thành viên (hoặc người gọi là admin).
-- =====================================================================
create or replace function public.get_class_teachers(p_class_ids uuid[])
returns table (class_id uuid, teacher_id uuid, full_name text)
language sql
stable
security definer
set search_path = ''
as $$
  select cm.class_id, p.id, p.full_name
  from public.class_members cm
  join public.profiles p on p.id = cm.user_id
  where cm.class_id = any (p_class_ids)
    and cm.member_role = 'teacher'
    and (public.is_admin() or public.is_class_member(cm.class_id))
  order by p.full_name
$$;

revoke execute on function public.get_class_teachers(uuid[]) from public, anon;
grant execute on function public.get_class_teachers(uuid[]) to authenticated;
