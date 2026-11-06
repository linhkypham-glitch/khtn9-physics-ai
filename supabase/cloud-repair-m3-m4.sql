-- FILE SINH TỰ ĐỘNG – CHẠY LẠI AN TOÀN bản cập nhật Milestone 3 + 4.
-- Dùng khi cloud-update-m3.sql / m4.sql báo lỗi "already exists" hoặc "does not exist" (đã chạy dở).
-- Chạy được nhiều lần: bỏ qua phần đã có, tạo phần còn thiếu. Không xoá dữ liệu.

-- >>>>> migrations/20261108000100_m3_assessments.sql
-- =====================================================================
-- KHTN 9 – PHYSICS AI
-- Migration 0005 (Milestone 3): Đề kiểm tra, giao bài theo lớp, bài làm,
-- nhận xét của giáo viên, nhật ký tạo câu hỏi bằng AI.
-- Nguyên tắc: điểm chỉ được ghi ở máy chủ (service-role); đáp án không gửi
-- xuống trình duyệt trước khi nộp bài.
-- =====================================================================

do $$ begin create type public.assessment_source as enum ('manual', 'auto', 'ai'); exception when duplicate_object then null; end $$;
do $$ begin create type public.assessment_status as enum ('draft', 'published', 'archived'); exception when duplicate_object then null; end $$;
do $$ begin create type public.answer_visibility as enum ('immediately', 'after_due', 'never'); exception when duplicate_object then null; end $$;
do $$ begin create type public.attempt_status as enum ('in_progress', 'submitted'); exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- Đề kiểm tra
-- ---------------------------------------------------------------------
create table if not exists public.assessments (
  id                uuid primary key default gen_random_uuid(),
  title             text not null check (char_length(title) between 3 and 200),
  description       text,
  duration_minutes  smallint not null default 45 check (duration_minutes between 5 and 180),
  source            public.assessment_source not null default 'manual',
  status            public.assessment_status not null default 'draft',
  lesson_ids        uuid[] not null default '{}',     -- phạm vi kiến thức
  structure         jsonb not null default '{}'::jsonb, -- cấu trúc đề đã chọn (số câu, điểm, mức độ)
  created_by        uuid not null references public.profiles(id) on delete cascade,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists assessments_owner_idx on public.assessments (created_by, created_at desc);
drop trigger if exists assessments_set_updated_at on public.assessments;
create trigger assessments_set_updated_at before update on public.assessments
  for each row execute function public.set_updated_at();

create table if not exists public.assessment_questions (
  assessment_id  uuid not null references public.assessments(id) on delete cascade,
  question_id    uuid not null references public.question_bank(id) on delete restrict,
  sort_order     smallint not null default 0,
  points         numeric not null default 1 check (points > 0 and points <= 10),
  primary key (assessment_id, question_id)
);
create index if not exists assessment_questions_order_idx on public.assessment_questions (assessment_id, sort_order);

-- ---------------------------------------------------------------------
-- Giao bài cho lớp
-- ---------------------------------------------------------------------
create table if not exists public.assessment_assignments (
  id              uuid primary key default gen_random_uuid(),
  code            text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  assessment_id   uuid not null references public.assessments(id) on delete cascade,
  class_id        uuid not null references public.classes(id) on delete cascade,
  assigned_by     uuid not null references public.profiles(id) on delete cascade,
  start_at        timestamptz not null default now(),
  due_at          timestamptz not null,
  max_attempts    smallint not null default 1 check (max_attempts between 1 and 10),
  show_answers    public.answer_visibility not null default 'immediately',
  is_closed       boolean not null default false,
  created_at      timestamptz not null default now(),
  constraint assignments_dates_chk check (due_at > start_at)
);
create index if not exists assignments_class_idx on public.assessment_assignments (class_id, due_at desc);
create index if not exists assignments_assessment_idx on public.assessment_assignments (assessment_id);

-- ---------------------------------------------------------------------
-- Bài làm của học sinh (lưu lịch sử mọi lần làm)
-- ---------------------------------------------------------------------
create table if not exists public.assessment_attempts (
  id                uuid primary key default gen_random_uuid(),
  assignment_id     uuid not null references public.assessment_assignments(id) on delete cascade,
  user_id           uuid not null references public.profiles(id) on delete cascade,
  attempt_no        smallint not null default 1,
  status            public.attempt_status not null default 'in_progress',
  started_at        timestamptz not null default now(),
  deadline_at       timestamptz not null,                 -- hết giờ làm bài
  submitted_at      timestamptz,
  answers           jsonb not null default '{}'::jsonb,   -- nháp / bài nộp
  score             numeric,                              -- thang 10
  earned_points     numeric,
  max_points        numeric,
  correct_units     integer,
  total_units       integer,
  details           jsonb not null default '[]'::jsonb,   -- kết quả từng câu
  updated_at        timestamptz not null default now(),
  constraint attempts_unique_no unique (assignment_id, user_id, attempt_no)
);
create index if not exists attempts_user_idx on public.assessment_attempts (user_id, started_at desc);
create index if not exists attempts_assignment_idx on public.assessment_attempts (assignment_id, status);
drop trigger if exists assessment_attempts_set_updated_at on public.assessment_attempts;
create trigger assessment_attempts_set_updated_at before update on public.assessment_attempts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Nhận xét, đánh giá của giáo viên
-- ---------------------------------------------------------------------
create table if not exists public.student_comments (
  id             uuid primary key default gen_random_uuid(),
  student_id     uuid not null references public.profiles(id) on delete cascade,
  teacher_id     uuid not null references public.profiles(id) on delete cascade,
  assignment_id  uuid references public.assessment_assignments(id) on delete set null,
  content        text not null check (char_length(content) between 1 and 3000),
  created_at     timestamptz not null default now()
);
create index if not exists student_comments_student_idx on public.student_comments (student_id, created_at desc);

-- ---------------------------------------------------------------------
-- Nhật ký tạo câu hỏi bằng AI (kiểm soát, truy vết)
-- ---------------------------------------------------------------------
create table if not exists public.ai_generation_jobs (
  id            uuid primary key default gen_random_uuid(),
  created_by    uuid not null references public.profiles(id) on delete cascade,
  assessment_id uuid references public.assessments(id) on delete set null,
  provider      text not null,
  model         text,
  request       jsonb not null,
  status        text not null check (status in ('succeeded', 'failed')),
  question_ids  uuid[] not null default '{}',
  warnings      jsonb not null default '[]'::jsonb,
  error         text,
  created_at    timestamptz not null default now()
);
create index if not exists ai_jobs_owner_idx on public.ai_generation_jobs (created_by, created_at desc);

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------
alter table public.assessments            enable row level security;
alter table public.assessment_questions   enable row level security;
alter table public.assessment_assignments enable row level security;
alter table public.assessment_attempts    enable row level security;
alter table public.student_comments       enable row level security;
alter table public.ai_generation_jobs     enable row level security;

create or replace function public.owns_assessment(p_assessment_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.assessments a where a.id = p_assessment_id and a.created_by = auth.uid())
$$;

-- Đề: người tạo và admin; giáo viên khác xem được đề đã xuất bản (dùng chung)
drop policy if exists assessments_select on public.assessments;
create policy assessments_select on public.assessments
  for select to authenticated
  using (created_by = (select auth.uid()) or public.is_admin() or (public.is_staff() and status = 'published'));
drop policy if exists assessments_insert on public.assessments;
create policy assessments_insert on public.assessments
  for insert to authenticated with check (public.is_staff() and created_by = (select auth.uid()));
drop policy if exists assessments_update on public.assessments;
create policy assessments_update on public.assessments
  for update to authenticated
  using (created_by = (select auth.uid()) or public.is_admin())
  with check (created_by = (select auth.uid()) or public.is_admin());
drop policy if exists assessments_delete on public.assessments;
create policy assessments_delete on public.assessments
  for delete to authenticated using (created_by = (select auth.uid()) or public.is_admin());

drop policy if exists assessment_questions_select on public.assessment_questions;
create policy assessment_questions_select on public.assessment_questions
  for select to authenticated
  using (public.is_staff() and exists (select 1 from public.assessments a where a.id = assessment_id));
drop policy if exists assessment_questions_write on public.assessment_questions;
create policy assessment_questions_write on public.assessment_questions
  for all to authenticated
  using (public.owns_assessment(assessment_id) or public.is_admin())
  with check (public.owns_assessment(assessment_id) or public.is_admin());

-- Giao bài: giáo viên của lớp + admin (học sinh nhận danh sách qua máy chủ)
drop policy if exists assignments_select on public.assessment_assignments;
create policy assignments_select on public.assessment_assignments
  for select to authenticated using (public.is_admin() or public.is_class_teacher(class_id));
drop policy if exists assignments_insert on public.assessment_assignments;
create policy assignments_insert on public.assessment_assignments
  for insert to authenticated
  with check ((public.is_admin() or public.is_class_teacher(class_id)) and assigned_by = (select auth.uid()));
drop policy if exists assignments_update on public.assessment_assignments;
create policy assignments_update on public.assessment_assignments
  for update to authenticated
  using (public.is_admin() or public.is_class_teacher(class_id))
  with check (public.is_admin() or public.is_class_teacher(class_id));
drop policy if exists assignments_delete on public.assessment_assignments;
create policy assignments_delete on public.assessment_assignments
  for delete to authenticated using (public.is_admin() or public.is_class_teacher(class_id));

-- Bài làm: học sinh xem bài của mình; GV lớp + admin xem. Không có policy ghi.
drop policy if exists attempts_select on public.assessment_attempts;
create policy attempts_select on public.assessment_attempts
  for select to authenticated
  using (user_id = (select auth.uid()) or public.is_admin() or public.teaches_user(user_id));

-- Nhận xét: GV dạy học sinh đó + admin; học sinh đọc nhận xét về mình
drop policy if exists comments_select on public.student_comments;
create policy comments_select on public.student_comments
  for select to authenticated
  using (student_id = (select auth.uid()) or public.is_admin() or public.teaches_user(student_id));
drop policy if exists comments_insert on public.student_comments;
create policy comments_insert on public.student_comments
  for insert to authenticated
  with check (teacher_id = (select auth.uid()) and (public.is_admin() or public.teaches_user(student_id)));
drop policy if exists comments_delete on public.student_comments;
create policy comments_delete on public.student_comments
  for delete to authenticated using (teacher_id = (select auth.uid()) or public.is_admin());

drop policy if exists ai_jobs_select on public.ai_generation_jobs;
create policy ai_jobs_select on public.ai_generation_jobs
  for select to authenticated using (created_by = (select auth.uid()) or public.is_admin());

revoke execute on function public.owns_assessment(uuid) from public, anon;
grant execute on function public.owns_assessment(uuid) to authenticated;


-- >>>>> migrations/20261109000100_m4_essay_leaderboard.sql
-- =====================================================================
-- KHTN 9 – PHYSICS AI
-- Migration 0006 (Milestone 4): câu hỏi tự luận do giáo viên chấm,
-- bảng xếp hạng (bật/tắt theo bài giao và theo lớp).
-- =====================================================================

-- Tự luận: tiêu chí / hướng dẫn chấm
alter table public.question_bank add column if not exists rubric text;

-- Bảng xếp hạng: giáo viên bật/tắt cho từng bài giao và từng lớp (mặc định tắt)
alter table public.assessment_assignments add column if not exists show_leaderboard boolean not null default false;
alter table public.classes add column if not exists show_leaderboard boolean not null default false;

-- Bài làm có câu tự luận chờ chấm
alter table public.assessment_attempts add column if not exists needs_grading boolean not null default false;
create index if not exists attempts_needs_grading_idx on public.assessment_attempts (assignment_id) where needs_grading;

-- Điểm tự luận do giáo viên chấm (AI chỉ gợi ý – điểm chính thức do giáo viên quyết định)
create table if not exists public.essay_grades (
  attempt_id          uuid not null references public.assessment_attempts(id) on delete cascade,
  question_id         uuid not null references public.question_bank(id) on delete cascade,
  score               numeric not null check (score >= 0),
  feedback            text check (feedback is null or char_length(feedback) <= 3000),
  ai_suggested_score  numeric,
  graded_by           uuid not null references public.profiles(id) on delete cascade,
  graded_at           timestamptz not null default now(),
  primary key (attempt_id, question_id)
);

alter table public.essay_grades enable row level security;

-- Học sinh xem điểm tự luận của mình; giáo viên dạy học sinh đó + admin xem. Ghi qua máy chủ.
drop policy if exists essay_grades_select on public.essay_grades;
create policy essay_grades_select on public.essay_grades
  for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.assessment_attempts a
      where a.id = attempt_id and (a.user_id = (select auth.uid()) or public.teaches_user(a.user_id))
    )
  );
