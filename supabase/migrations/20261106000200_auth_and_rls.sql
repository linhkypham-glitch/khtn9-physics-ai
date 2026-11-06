-- =====================================================================
-- KHTN 9 – PHYSICS AI
-- Migration 0002: Hàm phân quyền, trigger tài khoản và Row Level Security
-- Nguyên tắc:
--   * Mọi bảng trong schema public đều BẬT RLS.
--   * Quyền được kiểm tra trong database, không chỉ ẩn trên giao diện.
--   * Hàm trợ giúp dùng SECURITY DEFINER + search_path rỗng để tránh đệ quy RLS
--     và tấn công search_path.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Hàm trợ giúp phân quyền
-- ---------------------------------------------------------------------
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select p.role
  from public.profiles p
  where p.id = auth.uid() and p.is_active
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.current_user_role() = 'admin', false)
$$;

-- Giáo viên hoặc quản trị viên
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.current_user_role() in ('admin', 'teacher'), false)
$$;

create or replace function public.is_class_member(p_class_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.class_members cm
    where cm.class_id = p_class_id and cm.user_id = auth.uid()
  )
$$;

create or replace function public.is_class_teacher(p_class_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.class_members cm
    where cm.class_id = p_class_id
      and cm.user_id = auth.uid()
      and cm.member_role = 'teacher'
  )
$$;

-- Người dùng hiện tại là giáo viên của một lớp có p_user_id là thành viên
create or replace function public.teaches_user(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.class_members t
    join public.class_members s on s.class_id = t.class_id
    where t.user_id = auth.uid()
      and t.member_role = 'teacher'
      and s.user_id = p_user_id
  )
$$;

-- p_user_id là giáo viên của một lớp mà người dùng hiện tại đang học
create or replace function public.is_my_teacher(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.class_members me
    join public.class_members t on t.class_id = me.class_id
    where me.user_id = auth.uid()
      and t.user_id = p_user_id
      and t.member_role = 'teacher'
  )
$$;

-- ---------------------------------------------------------------------
-- 2. Tự động tạo hồ sơ khi có tài khoản mới
--    Vai trò KHÔNG lấy từ user_metadata (người dùng tự sửa được),
--    chỉ lấy từ app_metadata (chỉ service-role/admin mới đặt được).
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_role public.user_role := 'student';
  v_role_text text := new.raw_app_meta_data ->> 'role';
begin
  if v_role_text in ('admin', 'teacher', 'student') then
    v_role := v_role_text::public.user_role;
  end if;

  insert into public.profiles (id, role, full_name, email, student_code)
  values (
    new.id,
    v_role,
    left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1), ''), 120),
    new.email,
    nullif(trim(new.raw_app_meta_data ->> 'student_code'), '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- 3. Chống leo thang đặc quyền trên profiles
--    Người dùng thường chỉ được sửa họ tên của chính mình.
--    Vai trò, trạng thái, mã học sinh, trường, email chỉ ADMIN (hoặc service-role) được sửa.
-- ---------------------------------------------------------------------
create or replace function public.guard_profile_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- auth.uid() null: service-role, migration hoặc SQL quản trị trực tiếp
  if auth.uid() is not null and not public.is_admin() then
    if new.id is distinct from old.id
       or new.role is distinct from old.role
       or new.is_active is distinct from old.is_active
       or new.student_code is distinct from old.student_code
       or new.school_id is distinct from old.school_id
       or new.email is distinct from old.email then
      raise exception 'Không có quyền thay đổi thông tin này của tài khoản'
        using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

create trigger profiles_guard_update
  before update on public.profiles
  for each row execute function public.guard_profile_update();

-- ---------------------------------------------------------------------
-- 4. Bật RLS cho toàn bộ bảng
-- ---------------------------------------------------------------------
alter table public.schools             enable row level security;
alter table public.academic_years      enable row level security;
alter table public.profiles            enable row level security;
alter table public.classes             enable row level security;
alter table public.class_members       enable row level security;
alter table public.textbooks           enable row level security;
alter table public.chapters            enable row level security;
alter table public.lessons             enable row level security;
alter table public.learning_objectives enable row level security;
alter table public.lesson_materials    enable row level security;
alter table public.notifications       enable row level security;
alter table public.audit_logs          enable row level security;
alter table public.system_settings     enable row level security;

-- ---------------------------------------------------------------------
-- 5. Policies
-- ---------------------------------------------------------------------

-- schools / academic_years: người đã đăng nhập được xem; chỉ admin ghi
create policy schools_select on public.schools
  for select to authenticated using (true);
create policy schools_admin_write on public.schools
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy academic_years_select on public.academic_years
  for select to authenticated using (true);
create policy academic_years_admin_write on public.academic_years
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- profiles
create policy profiles_select on public.profiles
  for select to authenticated
  using (
    id = (select auth.uid())
    or public.is_admin()
    or public.teaches_user(id)
    or public.is_my_teacher(id)
  );
create policy profiles_update_self on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));
create policy profiles_admin_update on public.profiles
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy profiles_admin_insert on public.profiles
  for insert to authenticated with check (public.is_admin());
create policy profiles_admin_delete on public.profiles
  for delete to authenticated using (public.is_admin());

-- classes: thành viên lớp (GV, HS) và admin được xem; admin quản lý
create policy classes_select on public.classes
  for select to authenticated
  using (public.is_admin() or public.is_class_member(id));
create policy classes_admin_write on public.classes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- class_members: học sinh chỉ thấy dòng của chính mình (không thấy danh sách bạn cùng lớp)
create policy class_members_select on public.class_members
  for select to authenticated
  using (
    user_id = (select auth.uid())
    or public.is_admin()
    or public.is_class_teacher(class_id)
  );
create policy class_members_admin_write on public.class_members
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Chương trình học: công khai để đọc (kể cả khách) – chỉ admin sửa cấu trúc
create policy textbooks_select on public.textbooks
  for select to anon, authenticated using (true);
create policy textbooks_admin_write on public.textbooks
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy chapters_select on public.chapters
  for select to anon, authenticated using (true);
create policy chapters_admin_write on public.chapters
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy lessons_select on public.lessons
  for select to anon, authenticated using (is_published or public.is_staff());
create policy lessons_admin_write on public.lessons
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Mục tiêu / yêu cầu cần đạt: người đăng nhập xem; giáo viên & admin cập nhật
create policy learning_objectives_select on public.learning_objectives
  for select to authenticated using (true);
create policy learning_objectives_staff_write on public.learning_objectives
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- Học liệu: học sinh chỉ thấy học liệu đã xuất bản; giáo viên & admin quản lý
create policy lesson_materials_select on public.lesson_materials
  for select to authenticated using (is_published or public.is_staff());
create policy lesson_materials_staff_write on public.lesson_materials
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- Thông báo: chỉ người nhận xem / đánh dấu đã đọc; GV & admin gửi
create policy notifications_select_own on public.notifications
  for select to authenticated using (user_id = (select auth.uid()) or public.is_admin());
create policy notifications_update_own on public.notifications
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy notifications_staff_insert on public.notifications
  for insert to authenticated with check (public.is_staff());
create policy notifications_delete on public.notifications
  for delete to authenticated using (user_id = (select auth.uid()) or public.is_admin());

-- Nhật ký hệ thống: chỉ admin đọc; ghi qua service-role/hàm máy chủ
create policy audit_logs_admin_select on public.audit_logs
  for select to authenticated using (public.is_admin());

-- Cấu hình hệ thống: GV & admin đọc; admin ghi
create policy system_settings_staff_select on public.system_settings
  for select to authenticated using (public.is_staff());
create policy system_settings_admin_write on public.system_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 6. Quyền thực thi hàm
-- ---------------------------------------------------------------------
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.guard_profile_update() from public, anon, authenticated;
