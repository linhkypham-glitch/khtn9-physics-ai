-- FILE SINH TỰ ĐỘNG – chạy 1 lần trên dự án Supabase Cloud MỚI (SQL Editor → New query → Run).
-- Không chứa dữ liệu demo.

-- >>>>> migrations/20261106000100_core_schema.sql
-- =====================================================================
-- KHTN 9 – PHYSICS AI
-- Migration 0001: Schema nền tảng (Milestone 1)
--   * Tài khoản và lớp học: profiles, schools, academic_years, classes, class_members
--   * Chương trình học: textbooks, chapters, lessons, learning_objectives, lesson_materials
--   * Hệ thống: notifications, audit_logs, system_settings
-- Các bảng thí nghiệm, ngân hàng câu hỏi, kiểm tra, AI, phân tích sẽ được
-- bổ sung bằng các migration ở những milestone tiếp theo.
-- =====================================================================

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------
-- Kiểu liệt kê
-- ---------------------------------------------------------------------
create type public.user_role as enum ('admin', 'teacher', 'student');
create type public.class_member_role as enum ('teacher', 'student');
create type public.lesson_type as enum ('theory', 'practice');
create type public.lesson_section as enum ('knowledge', 'experiment', 'practice', 'self_assessment');
create type public.material_kind as enum ('text', 'formula', 'example', 'image', 'video', 'link', 'file');
create type public.objective_kind as enum ('objective', 'requirement');

-- ---------------------------------------------------------------------
-- Hàm tiện ích: cập nhật updated_at
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- =====================================================================
-- TÀI KHOẢN VÀ LỚP HỌC
-- =====================================================================
create table public.schools (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  name        text not null,
  address     text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.academic_years (
  id          uuid primary key default gen_random_uuid(),
  school_id   uuid not null references public.schools(id) on delete cascade,
  name        text not null,                       -- ví dụ: 2026-2027
  start_date  date not null,
  end_date    date not null,
  is_current  boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint academic_years_dates_chk check (end_date > start_date),
  constraint academic_years_school_name_key unique (school_id, name)
);
-- Mỗi trường chỉ có tối đa 1 năm học hiện hành
create unique index academic_years_one_current_idx
  on public.academic_years (school_id) where is_current;

-- Hồ sơ người dùng – 1:1 với auth.users.
-- Hạn chế thu thập thông tin cá nhân: chỉ lưu họ tên, email đăng nhập, mã học sinh.
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  role          public.user_role not null default 'student',
  full_name     text not null default '',
  email         text,
  student_code  text unique,
  school_id     uuid references public.schools(id) on delete set null,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint profiles_full_name_len_chk check (char_length(full_name) <= 120)
);
create index profiles_role_idx on public.profiles (role);
create index profiles_school_idx on public.profiles (school_id);
create index profiles_full_name_idx on public.profiles (lower(full_name));

create table public.classes (
  id                uuid primary key default gen_random_uuid(),
  school_id         uuid not null references public.schools(id) on delete cascade,
  academic_year_id  uuid not null references public.academic_years(id) on delete restrict,
  name              text not null,                 -- 9A, 9B, 9C ...
  grade             smallint not null default 9,
  is_active         boolean not null default true,
  created_by        uuid references public.profiles(id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint classes_grade_chk check (grade between 6 and 12),
  constraint classes_year_name_key unique (academic_year_id, name)
);
create index classes_school_idx on public.classes (school_id);

-- Thành viên lớp: giáo viên được phân công và học sinh.
create table public.class_members (
  class_id     uuid not null references public.classes(id) on delete cascade,
  user_id      uuid not null references public.profiles(id) on delete cascade,
  member_role  public.class_member_role not null,
  joined_at    timestamptz not null default now(),
  primary key (class_id, user_id)
);
create index class_members_user_idx on public.class_members (user_id);
create index class_members_role_idx on public.class_members (class_id, member_role);

-- =====================================================================
-- CHƯƠNG TRÌNH HỌC
-- =====================================================================
create table public.textbooks (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  name        text not null,
  series      text not null,
  subject     text not null,
  grade       smallint not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.chapters (
  id           uuid primary key default gen_random_uuid(),
  textbook_id  uuid not null references public.textbooks(id) on delete cascade,
  number       smallint not null,
  roman        text not null,
  title        text not null,
  description  text,
  sort_order   smallint not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint chapters_textbook_number_key unique (textbook_id, number)
);
create index chapters_textbook_idx on public.chapters (textbook_id, sort_order);

create table public.lessons (
  id            uuid primary key default gen_random_uuid(),
  chapter_id    uuid not null references public.chapters(id) on delete cascade,
  number        smallint not null,             -- số bài theo SGK (bắt đầu từ Bài 2)
  title         text not null,
  slug          text not null unique,
  lesson_type   public.lesson_type not null default 'theory',
  summary       text,
  is_published  boolean not null default true,
  sort_order    smallint not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint lessons_chapter_number_key unique (chapter_id, number),
  constraint lessons_slug_format_chk check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);
create index lessons_chapter_idx on public.lessons (chapter_id, sort_order);

-- Mục tiêu bài học & Yêu cầu cần đạt
create table public.learning_objectives (
  id          uuid primary key default gen_random_uuid(),
  lesson_id   uuid not null references public.lessons(id) on delete cascade,
  kind        public.objective_kind not null,
  code        text,
  content     text not null,
  sort_order  smallint not null default 0,
  created_by  uuid references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index learning_objectives_lesson_idx on public.learning_objectives (lesson_id, kind, sort_order);

-- Học liệu của bài học theo từng khu vực (Kiến thức, Thí nghiệm, Luyện tập, Tự đánh giá)
create table public.lesson_materials (
  id            uuid primary key default gen_random_uuid(),
  lesson_id     uuid not null references public.lessons(id) on delete cascade,
  section       public.lesson_section not null,
  kind          public.material_kind not null,
  title         text not null,
  body          text,
  url           text,
  storage_path  text,
  sort_order    smallint not null default 0,
  is_published  boolean not null default false,
  created_by    uuid references public.profiles(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint lesson_materials_url_chk check (url is null or url ~* '^https?://')
);
create index lesson_materials_lesson_idx on public.lesson_materials (lesson_id, section, sort_order);

-- =====================================================================
-- HỆ THỐNG
-- =====================================================================
create table public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  body        text,
  link        text,
  read_at     timestamptz,
  created_by  uuid references public.profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);
create index notifications_user_idx on public.notifications (user_id, created_at desc);

create table public.audit_logs (
  id          bigint generated always as identity primary key,
  actor_id    uuid references public.profiles(id) on delete set null,
  action      text not null,
  entity      text not null,
  entity_id   text,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create index audit_logs_entity_idx on public.audit_logs (entity, entity_id);
create index audit_logs_created_idx on public.audit_logs (created_at desc);

-- Cấu hình hệ thống. KHÔNG lưu API key / bí mật ở đây (dùng biến môi trường).
create table public.system_settings (
  key          text primary key,
  value        jsonb not null,
  description  text,
  updated_by   uuid references public.profiles(id) on delete set null,
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Trigger updated_at
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'schools','academic_years','profiles','classes','textbooks','chapters',
    'lessons','learning_objectives','lesson_materials','system_settings'
  ] loop
    execute format(
      'create trigger %I_set_updated_at before update on public.%I
         for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;


-- >>>>> migrations/20261106000200_auth_and_rls.sql
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


-- >>>>> migrations/20261106000300_class_teachers_fn.sql
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


-- >>>>> seed/01_curriculum.sql
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


-- >>>>> seed/02_system_settings.sql
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
