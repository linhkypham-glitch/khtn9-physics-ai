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
