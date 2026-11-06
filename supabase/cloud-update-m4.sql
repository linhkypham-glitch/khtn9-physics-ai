-- FILE SINH TỰ ĐỘNG – CẬP NHẬT lên Milestone 4 (câu tự luận do giáo viên chấm, bảng xếp hạng) cho dự án đã chạy cloud-update-m3.sql.
-- Chạy MỘT lần trong SQL Editor.

-- >>>>> migrations/20261109000100_m4_essay_leaderboard.sql
-- =====================================================================
-- KHTN 9 – PHYSICS AI
-- Migration 0006 (Milestone 4): câu hỏi tự luận do giáo viên chấm,
-- bảng xếp hạng (bật/tắt theo bài giao và theo lớp).
-- =====================================================================

-- Tự luận: tiêu chí / hướng dẫn chấm
alter table public.question_bank add column rubric text;

-- Bảng xếp hạng: giáo viên bật/tắt cho từng bài giao và từng lớp (mặc định tắt)
alter table public.assessment_assignments add column show_leaderboard boolean not null default false;
alter table public.classes add column show_leaderboard boolean not null default false;

-- Bài làm có câu tự luận chờ chấm
alter table public.assessment_attempts add column needs_grading boolean not null default false;
create index attempts_needs_grading_idx on public.assessment_attempts (assignment_id) where needs_grading;

-- Điểm tự luận do giáo viên chấm (AI chỉ gợi ý – điểm chính thức do giáo viên quyết định)
create table public.essay_grades (
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
create policy essay_grades_select on public.essay_grades
  for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.assessment_attempts a
      where a.id = attempt_id and (a.user_id = (select auth.uid()) or public.teaches_user(a.user_id))
    )
  );
