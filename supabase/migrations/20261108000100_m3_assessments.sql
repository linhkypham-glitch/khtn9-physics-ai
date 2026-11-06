-- =====================================================================
-- KHTN 9 – PHYSICS AI
-- Migration 0005 (Milestone 3): Đề kiểm tra, giao bài theo lớp, bài làm,
-- nhận xét của giáo viên, nhật ký tạo câu hỏi bằng AI.
-- Nguyên tắc: điểm chỉ được ghi ở máy chủ (service-role); đáp án không gửi
-- xuống trình duyệt trước khi nộp bài.
-- =====================================================================

create type public.assessment_source as enum ('manual', 'auto', 'ai');
create type public.assessment_status as enum ('draft', 'published', 'archived');
create type public.answer_visibility as enum ('immediately', 'after_due', 'never');
create type public.attempt_status as enum ('in_progress', 'submitted');

-- ---------------------------------------------------------------------
-- Đề kiểm tra
-- ---------------------------------------------------------------------
create table public.assessments (
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
create index assessments_owner_idx on public.assessments (created_by, created_at desc);
create trigger assessments_set_updated_at before update on public.assessments
  for each row execute function public.set_updated_at();

create table public.assessment_questions (
  assessment_id  uuid not null references public.assessments(id) on delete cascade,
  question_id    uuid not null references public.question_bank(id) on delete restrict,
  sort_order     smallint not null default 0,
  points         numeric not null default 1 check (points > 0 and points <= 10),
  primary key (assessment_id, question_id)
);
create index assessment_questions_order_idx on public.assessment_questions (assessment_id, sort_order);

-- ---------------------------------------------------------------------
-- Giao bài cho lớp
-- ---------------------------------------------------------------------
create table public.assessment_assignments (
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
create index assignments_class_idx on public.assessment_assignments (class_id, due_at desc);
create index assignments_assessment_idx on public.assessment_assignments (assessment_id);

-- ---------------------------------------------------------------------
-- Bài làm của học sinh (lưu lịch sử mọi lần làm)
-- ---------------------------------------------------------------------
create table public.assessment_attempts (
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
create index attempts_user_idx on public.assessment_attempts (user_id, started_at desc);
create index attempts_assignment_idx on public.assessment_attempts (assignment_id, status);
create trigger assessment_attempts_set_updated_at before update on public.assessment_attempts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Nhận xét, đánh giá của giáo viên
-- ---------------------------------------------------------------------
create table public.student_comments (
  id             uuid primary key default gen_random_uuid(),
  student_id     uuid not null references public.profiles(id) on delete cascade,
  teacher_id     uuid not null references public.profiles(id) on delete cascade,
  assignment_id  uuid references public.assessment_assignments(id) on delete set null,
  content        text not null check (char_length(content) between 1 and 3000),
  created_at     timestamptz not null default now()
);
create index student_comments_student_idx on public.student_comments (student_id, created_at desc);

-- ---------------------------------------------------------------------
-- Nhật ký tạo câu hỏi bằng AI (kiểm soát, truy vết)
-- ---------------------------------------------------------------------
create table public.ai_generation_jobs (
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
create index ai_jobs_owner_idx on public.ai_generation_jobs (created_by, created_at desc);

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
create policy assessments_select on public.assessments
  for select to authenticated
  using (created_by = (select auth.uid()) or public.is_admin() or (public.is_staff() and status = 'published'));
create policy assessments_insert on public.assessments
  for insert to authenticated with check (public.is_staff() and created_by = (select auth.uid()));
create policy assessments_update on public.assessments
  for update to authenticated
  using (created_by = (select auth.uid()) or public.is_admin())
  with check (created_by = (select auth.uid()) or public.is_admin());
create policy assessments_delete on public.assessments
  for delete to authenticated using (created_by = (select auth.uid()) or public.is_admin());

create policy assessment_questions_select on public.assessment_questions
  for select to authenticated
  using (public.is_staff() and exists (select 1 from public.assessments a where a.id = assessment_id));
create policy assessment_questions_write on public.assessment_questions
  for all to authenticated
  using (public.owns_assessment(assessment_id) or public.is_admin())
  with check (public.owns_assessment(assessment_id) or public.is_admin());

-- Giao bài: giáo viên của lớp + admin (học sinh nhận danh sách qua máy chủ)
create policy assignments_select on public.assessment_assignments
  for select to authenticated using (public.is_admin() or public.is_class_teacher(class_id));
create policy assignments_insert on public.assessment_assignments
  for insert to authenticated
  with check ((public.is_admin() or public.is_class_teacher(class_id)) and assigned_by = (select auth.uid()));
create policy assignments_update on public.assessment_assignments
  for update to authenticated
  using (public.is_admin() or public.is_class_teacher(class_id))
  with check (public.is_admin() or public.is_class_teacher(class_id));
create policy assignments_delete on public.assessment_assignments
  for delete to authenticated using (public.is_admin() or public.is_class_teacher(class_id));

-- Bài làm: học sinh xem bài của mình; GV lớp + admin xem. Không có policy ghi.
create policy attempts_select on public.assessment_attempts
  for select to authenticated
  using (user_id = (select auth.uid()) or public.is_admin() or public.teaches_user(user_id));

-- Nhận xét: GV dạy học sinh đó + admin; học sinh đọc nhận xét về mình
create policy comments_select on public.student_comments
  for select to authenticated
  using (student_id = (select auth.uid()) or public.is_admin() or public.teaches_user(student_id));
create policy comments_insert on public.student_comments
  for insert to authenticated
  with check (teacher_id = (select auth.uid()) and (public.is_admin() or public.teaches_user(student_id)));
create policy comments_delete on public.student_comments
  for delete to authenticated using (teacher_id = (select auth.uid()) or public.is_admin());

create policy ai_jobs_select on public.ai_generation_jobs
  for select to authenticated using (created_by = (select auth.uid()) or public.is_admin());

revoke execute on function public.owns_assessment(uuid) from public, anon;
grant execute on function public.owns_assessment(uuid) to authenticated;
