-- =====================================================================
-- KHTN 9 – PHYSICS AI
-- Migration 0004 (Milestone 2):
--   * Lớp học: mã lớp, cho phép học sinh tự đăng ký; giáo viên tự tạo lớp
--   * Tài khoản: tên đăng nhập (username) cho học sinh không có email
--   * Ngân hàng câu hỏi: question_bank, question_options, question_subitems
--   * Luyện tập / tự đánh giá: practice_attempts (chấm điểm phía máy chủ)
--   * Thí nghiệm ảo: experiments, experiment_attempts
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Lớp học & tài khoản
-- ---------------------------------------------------------------------
create or replace function public.generate_join_code()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- bỏ ký tự dễ nhầm (0/O, 1/I)
  code text;
begin
  loop
    code := '';
    for i in 1..6 loop
      code := code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from public.classes c where c.join_code = code);
  end loop;
  return code;
end;
$$;

alter table public.classes
  add column join_code text,
  add column allow_self_join boolean not null default true;
update public.classes set join_code = public.generate_join_code() where join_code is null;
alter table public.classes
  alter column join_code set default public.generate_join_code(),
  alter column join_code set not null,
  add constraint classes_join_code_key unique (join_code);

alter table public.profiles
  add column username text,
  add constraint profiles_username_key unique (username),
  add constraint profiles_username_format_chk check (username is null or username ~ '^[a-z0-9][a-z0-9._-]{2,39}$');

-- Tên đăng nhập lấy từ app_metadata (chỉ máy chủ đặt được)
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

  insert into public.profiles (id, role, full_name, email, student_code, username)
  values (
    new.id,
    v_role,
    left(coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1), ''), 120),
    new.email,
    nullif(trim(new.raw_app_meta_data ->> 'student_code'), ''),
    nullif(lower(trim(new.raw_app_meta_data ->> 'username')), '')
  );
  return new;
end;
$$;

-- Chặn tự sửa username (cùng quy tắc với role, student_code)
create or replace function public.guard_profile_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if new.id is distinct from old.id
       or new.role is distinct from old.role
       or new.is_active is distinct from old.is_active
       or new.student_code is distinct from old.student_code
       or new.school_id is distinct from old.school_id
       or new.email is distinct from old.email
       or new.username is distinct from old.username then
      raise exception 'Không có quyền thay đổi thông tin này của tài khoản'
        using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

-- Giáo viên được tạo lớp (và tự trở thành giáo viên của lớp), sửa lớp mình phụ trách
create policy classes_teacher_insert on public.classes
  for insert to authenticated
  with check (public.current_user_role() = 'teacher' and created_by = (select auth.uid()));
create policy classes_teacher_update on public.classes
  for update to authenticated
  using (public.is_class_teacher(id)) with check (public.is_class_teacher(id));

-- Người tạo lớp tự động là giáo viên của lớp
create or replace function public.add_creator_as_class_teacher()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.created_by is not null
     and exists (select 1 from public.profiles p where p.id = new.created_by and p.role in ('teacher', 'admin')) then
    insert into public.class_members (class_id, user_id, member_role)
    values (new.id, new.created_by, 'teacher')
    on conflict do nothing;
  end if;
  return new;
end;
$$;
create trigger classes_add_creator
  after insert on public.classes
  for each row execute function public.add_creator_as_class_teacher();

-- Giáo viên quản lý học sinh trong lớp mình (thêm / xoá thành viên học sinh)
create policy class_members_teacher_write on public.class_members
  for insert to authenticated
  with check (public.is_class_teacher(class_id) and member_role = 'student');
create policy class_members_teacher_delete on public.class_members
  for delete to authenticated
  using (public.is_class_teacher(class_id) and member_role = 'student');

-- Danh sách lớp đang mở đăng ký – chỉ trả tên lớp & năm học (không lộ mã lớp)
create or replace function public.list_open_classes()
returns table (id uuid, name text, academic_year text, school_name text)
language sql
stable
security definer
set search_path = ''
as $$
  select c.id, c.name, y.name, s.name
  from public.classes c
  join public.academic_years y on y.id = c.academic_year_id
  join public.schools s on s.id = c.school_id
  where c.is_active and c.allow_self_join
  order by s.name, c.name
$$;
grant execute on function public.list_open_classes() to anon, authenticated;

revoke execute on function public.generate_join_code() from public, anon, authenticated;
revoke execute on function public.add_creator_as_class_teacher() from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- 2. Ngân hàng câu hỏi
-- ---------------------------------------------------------------------
create type public.question_type as enum ('multiple_choice', 'true_false', 'short_answer', 'essay');
create type public.cognitive_level as enum ('biet', 'hieu', 'van_dung');
create type public.review_status as enum ('draft', 'reviewed', 'approved', 'published');

create table public.question_bank (
  id             uuid primary key default gen_random_uuid(),
  code           text unique,                    -- mã ổn định cho dữ liệu seed, ví dụ B11-Q01
  lesson_id      uuid not null references public.lessons(id) on delete cascade,
  type           public.question_type not null,
  level          public.cognitive_level not null,
  content        text not null,
  requirement    text,                           -- yêu cầu cần đạt
  answer_text    text,                           -- trả lời ngắn dạng văn bản (có thể nhiều đáp án, ngăn cách |)
  answer_number  numeric,                        -- trả lời ngắn dạng số
  tolerance      numeric not null default 0,     -- sai số tuyệt đối chấp nhận
  unit           text,                           -- đơn vị gợi ý hiển thị
  explanation    text not null default '',
  formula        text,                           -- công thức Vật lý liên quan
  remember       text,                           -- kiến thức cần nhớ
  points         numeric not null default 1 check (points > 0),
  source         text not null default 'PHYSICS AI',
  status         public.review_status not null default 'draft',
  sort_order     smallint not null default 0,
  created_by     uuid references public.profiles(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint question_short_answer_chk check (
    type <> 'short_answer' or answer_text is not null or answer_number is not null)
);
create index question_bank_lesson_idx on public.question_bank (lesson_id, status, sort_order);
create index question_bank_filter_idx on public.question_bank (type, level);
create trigger question_bank_set_updated_at before update on public.question_bank
  for each row execute function public.set_updated_at();

create table public.question_options (
  id           uuid primary key default gen_random_uuid(),
  question_id  uuid not null references public.question_bank(id) on delete cascade,
  label        char(1) not null check (label in ('A', 'B', 'C', 'D')),
  content      text not null,
  is_correct   boolean not null default false,
  constraint question_options_label_key unique (question_id, label)
);

create table public.question_subitems (
  id           uuid primary key default gen_random_uuid(),
  question_id  uuid not null references public.question_bank(id) on delete cascade,
  label        char(1) not null check (label in ('a', 'b', 'c', 'd')),
  content      text not null,
  is_true      boolean not null,
  explanation  text not null default '',
  constraint question_subitems_label_key unique (question_id, label)
);

-- ---------------------------------------------------------------------
-- 3. Luyện tập & tự đánh giá theo bài học
--    Chỉ máy chủ (service-role) được ghi → học sinh không thể sửa điểm.
-- ---------------------------------------------------------------------
create table public.practice_attempts (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  lesson_id         uuid not null references public.lessons(id) on delete cascade,
  mode              text not null check (mode in ('practice', 'self_assessment')),
  score             numeric not null,           -- thang 10
  correct_units     integer not null,
  total_units       integer not null,
  duration_seconds  integer,
  details           jsonb not null default '[]'::jsonb,
  submitted_at      timestamptz not null default now()
);
create index practice_attempts_user_idx on public.practice_attempts (user_id, lesson_id, submitted_at desc);

-- ---------------------------------------------------------------------
-- 4. Thí nghiệm ảo
-- ---------------------------------------------------------------------
create table public.experiments (
  id          uuid primary key default gen_random_uuid(),
  key         text not null unique,               -- khoá component mô phỏng trong mã nguồn
  lesson_id   uuid not null references public.lessons(id) on delete cascade,
  title       text not null,
  summary     text,
  sort_order  smallint not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index experiments_lesson_idx on public.experiments (lesson_id);
create trigger experiments_set_updated_at before update on public.experiments
  for each row execute function public.set_updated_at();

create table public.experiment_attempts (
  id             uuid primary key default gen_random_uuid(),
  experiment_id  uuid not null references public.experiments(id) on delete cascade,
  user_id        uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  data           jsonb not null default '{}'::jsonb,   -- thông số, số đo, bảng kết quả
  answers        jsonb not null default '{}'::jsonb,   -- trả lời câu hỏi khám phá
  created_at     timestamptz not null default now(),
  constraint experiment_attempts_size_chk check (pg_column_size(data) + pg_column_size(answers) < 65536)
);
create index experiment_attempts_user_idx on public.experiment_attempts (user_id, created_at desc);

-- ---------------------------------------------------------------------
-- 5. RLS
-- ---------------------------------------------------------------------
alter table public.question_bank       enable row level security;
alter table public.question_options    enable row level security;
alter table public.question_subitems   enable row level security;
alter table public.practice_attempts   enable row level security;
alter table public.experiments         enable row level security;
alter table public.experiment_attempts enable row level security;

-- Ngân hàng câu hỏi (có đáp án): CHỈ giáo viên & admin. Học sinh nhận câu hỏi qua
-- máy chủ, đã lược bỏ đáp án.
create policy question_bank_staff on public.question_bank
  for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy question_options_staff on public.question_options
  for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy question_subitems_staff on public.question_subitems
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- Kết quả luyện tập: học sinh xem của mình; GV xem học sinh lớp mình; admin xem tất cả.
-- Không có policy INSERT/UPDATE → chỉ service-role ghi được.
create policy practice_attempts_select on public.practice_attempts
  for select to authenticated
  using (user_id = (select auth.uid()) or public.is_admin() or public.teaches_user(user_id));

create policy experiments_select on public.experiments
  for select to anon, authenticated using (true);
create policy experiments_admin_write on public.experiments
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy experiment_attempts_select on public.experiment_attempts
  for select to authenticated
  using (user_id = (select auth.uid()) or public.is_admin() or public.teaches_user(user_id));
create policy experiment_attempts_insert_own on public.experiment_attempts
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy experiment_attempts_delete_own on public.experiment_attempts
  for delete to authenticated using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------
-- 6. Truy cập mở: ai có link đều xem được nội dung bài học đã xuất bản
--    (học sinh vào học không cần mật khẩu).
-- ---------------------------------------------------------------------
drop policy learning_objectives_select on public.learning_objectives;
create policy learning_objectives_select on public.learning_objectives
  for select to anon, authenticated using (true);

drop policy lesson_materials_select on public.lesson_materials;
create policy lesson_materials_select on public.lesson_materials
  for select to anon, authenticated using (is_published or public.is_staff());

-- Lớp có thể được học sinh tạo khi nhập tên lớp mới (created_by null).
-- Hàm liệt kê lớp chưa có giáo viên phụ trách (để giáo viên "nhận lớp").
create or replace function public.list_unassigned_classes()
returns table (id uuid, name text, academic_year text, student_count bigint)
language sql
stable
security definer
set search_path = ''
as $$
  select c.id, c.name, y.name,
         (select count(*) from public.class_members s where s.class_id = c.id and s.member_role = 'student')
  from public.classes c
  join public.academic_years y on y.id = c.academic_year_id
  where c.is_active
    and public.is_staff()
    and not exists (select 1 from public.class_members t where t.class_id = c.id and t.member_role = 'teacher')
  order by c.name
$$;
revoke execute on function public.list_unassigned_classes() from public, anon;
grant execute on function public.list_unassigned_classes() to authenticated;
