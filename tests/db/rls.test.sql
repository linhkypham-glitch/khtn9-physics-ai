-- =====================================================================
-- Kiểm thử RLS & dữ liệu seed trên database Supabase cục bộ.
-- Chạy: npm run test:db   (yêu cầu `npx supabase start` + `npx supabase db reset`)
-- Mỗi khối DO raise exception khi kiểm thử thất bại → psql dừng với mã lỗi ≠ 0.
-- Toàn bộ chạy trong transaction và ROLLBACK ở cuối, không làm bẩn dữ liệu.
-- =====================================================================
\set ON_ERROR_STOP on
begin;

-- Giả lập người dùng đăng nhập
create or replace function pg_temp.login_as(p_uid uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims',
    json_build_object('sub', p_uid::text, 'role', 'authenticated')::text, true);
  execute 'set local role authenticated';
end $$;

create or replace function pg_temp.logout() returns void language plpgsql as $$
begin
  execute 'reset role';
  perform set_config('request.jwt.claims', '', true);
end $$;

-- 1. Seed chương trình học
do $$
declare n_ch int; n_ls int; min_no int; max_no int;
begin
  select count(*) into n_ch from public.chapters;
  select count(*), min(number), max(number) into n_ls, min_no, max_no from public.lessons;
  if n_ch <> 5 then raise exception 'FAIL: cần 5 chương, có %', n_ch; end if;
  if n_ls <> 16 or min_no <> 2 or max_no <> 17 then
    raise exception 'FAIL: cần Bài 2 → Bài 17 (16 bài), có % bài (% → %)', n_ls, min_no, max_no;
  end if;
  if exists (select 1 from public.lessons where number = 1) then
    raise exception 'FAIL: không được có Bài 1';
  end if;
  raise notice 'PASS 1: seed 5 chương, Bài 2 → Bài 17';
end $$;

-- 2. Khách (anon) đọc được chương trình nhưng không đọc được hồ sơ / lớp
set local role anon;
do $$
begin
  if (select count(*) from public.lessons) <> 16 then raise exception 'FAIL: anon không đọc được bài học'; end if;
  if (select count(*) from public.profiles) <> 0 then raise exception 'FAIL: anon đọc được profiles'; end if;
  if (select count(*) from public.classes) <> 0 then raise exception 'FAIL: anon đọc được classes'; end if;
  raise notice 'PASS 2: anon chỉ đọc được chương trình học';
end $$;
reset role;

-- 3. Học sinh 9A-01: chỉ thấy hồ sơ của mình + giáo viên lớp mình; không thấy bạn khác
select pg_temp.login_as('c0000000-0000-0000-0000-0000000009a1');
do $$
declare n int;
begin
  select count(*) into n from public.profiles;
  -- chính mình + Giáo viên Demo
  if n <> 2 then raise exception 'FAIL: học sinh thấy % hồ sơ (mong đợi 2)', n; end if;
  if exists (select 1 from public.profiles where id = 'c0000000-0000-0000-0000-0000000009a2') then
    raise exception 'FAIL: học sinh thấy hồ sơ bạn cùng lớp';
  end if;
  select count(*) into n from public.classes;
  if n <> 1 then raise exception 'FAIL: học sinh thấy % lớp (mong đợi 1)', n; end if;
  select count(*) into n from public.class_members;
  if n <> 1 then raise exception 'FAIL: học sinh thấy % dòng class_members (mong đợi 1)', n; end if;
  raise notice 'PASS 3: học sinh bị giới hạn dữ liệu đúng';
end $$;

-- 4. Học sinh không thể tự nâng quyền hoặc sửa mã học sinh
do $$
begin
  begin
    update public.profiles set role = 'admin' where id = 'c0000000-0000-0000-0000-0000000009a1';
    raise exception 'FAIL: học sinh tự nâng quyền thành công';
  exception when insufficient_privilege then null;
  end;
  begin
    update public.profiles set student_code = 'HACK' where id = 'c0000000-0000-0000-0000-0000000009a1';
    raise exception 'FAIL: học sinh tự sửa mã học sinh';
  exception when insufficient_privilege then null;
  end;
  -- Được phép sửa họ tên của chính mình
  update public.profiles set full_name = 'Học sinh Demo 9A-01 (đổi tên)' where id = 'c0000000-0000-0000-0000-0000000009a1';
  if not found then raise exception 'FAIL: học sinh không sửa được họ tên của mình'; end if;
  -- Không sửa được hồ sơ người khác (RLS lọc → 0 dòng)
  update public.profiles set full_name = 'x' where id = 'b0000000-0000-0000-0000-000000000001';
  if found then raise exception 'FAIL: học sinh sửa được hồ sơ giáo viên'; end if;
  raise notice 'PASS 4: chống leo thang đặc quyền';
end $$;

-- 5. Học sinh không thể ghi vào chương trình học / lớp học
do $$
begin
  begin
    insert into public.chapters (textbook_id, number, roman, title, sort_order)
    select id, 99, 'X', 'Chương giả', 99 from public.textbooks limit 1;
    raise exception 'FAIL: học sinh thêm được chương';
  exception when insufficient_privilege then null;
  end;
  update public.lessons set title = 'Sửa trái phép' where number = 2;
  if found then raise exception 'FAIL: học sinh sửa được tên bài'; end if;
  begin
    insert into public.class_members (class_id, user_id, member_role)
    values ('30000000-0000-0000-0000-00000000009b', 'c0000000-0000-0000-0000-0000000009a1', 'student');
    raise exception 'FAIL: học sinh tự thêm mình vào lớp khác';
  exception when insufficient_privilege then null;
  end;
  raise notice 'PASS 5: học sinh không ghi được dữ liệu cấu trúc';
end $$;
select pg_temp.logout();

-- 6. Giáo viên Demo (9A, 9B): thấy học sinh lớp mình, không thấy lớp 9C
select pg_temp.login_as('b0000000-0000-0000-0000-000000000001');
do $$
declare n int;
begin
  select count(*) into n from public.classes;
  if n <> 2 then raise exception 'FAIL: giáo viên thấy % lớp (mong đợi 2)', n; end if;
  select count(*) into n from public.profiles where role = 'student';
  if n <> 6 then raise exception 'FAIL: giáo viên thấy % học sinh (mong đợi 6)', n; end if;
  if exists (select 1 from public.profiles where id = 'c0000000-0000-0000-0000-0000000009c1') then
    raise exception 'FAIL: giáo viên thấy học sinh lớp không phụ trách';
  end if;
  -- Giáo viên được thêm học liệu
  insert into public.lesson_materials (lesson_id, section, kind, title, body, is_published)
  select id, 'knowledge', 'text', 'Kiểm thử', 'Nội dung', false from public.lessons where number = 11;
  -- Giáo viên không được đổi tên bài trong mục lục chính thức
  update public.lessons set title = 'Đổi tên' where number = 11;
  if found then raise exception 'FAIL: giáo viên đổi được tên bài'; end if;
  begin
    update public.profiles set role = 'admin' where id = 'b0000000-0000-0000-0000-000000000001';
    raise exception 'FAIL: giáo viên tự nâng quyền';
  exception when insufficient_privilege then null;
  end;
  raise notice 'PASS 6: phạm vi quyền của giáo viên đúng';
end $$;
select pg_temp.logout();

-- 7. Học sinh không thấy học liệu chưa xuất bản
select pg_temp.login_as('c0000000-0000-0000-0000-0000000009a1');
do $$
begin
  if exists (select 1 from public.lesson_materials where title = 'Kiểm thử') then
    raise exception 'FAIL: học sinh thấy học liệu chưa xuất bản';
  end if;
  raise notice 'PASS 7: học liệu nháp bị ẩn với học sinh';
end $$;
select pg_temp.logout();

-- 8. Admin thấy toàn bộ và đổi được vai trò
select pg_temp.login_as('a0000000-0000-0000-0000-000000000001');
do $$
declare n int;
begin
  select count(*) into n from public.profiles;
  if n <> 12 then raise exception 'FAIL: admin thấy % hồ sơ (mong đợi 12)', n; end if;
  update public.profiles set role = 'teacher' where id = 'c0000000-0000-0000-0000-0000000009c3';
  if not found then raise exception 'FAIL: admin không đổi được vai trò'; end if;
  raise notice 'PASS 8: quyền quản trị viên đúng';
end $$;
select pg_temp.logout();

-- 9. Tài khoản tự đăng ký luôn là học sinh, kể cả khi gửi role trong user_metadata
do $$
declare v_role public.user_role;
begin
  insert into auth.users (instance_id, id, aud, role, email, raw_app_meta_data, raw_user_meta_data)
  values ('00000000-0000-0000-0000-000000000000', 'd0000000-0000-0000-0000-000000000001',
          'authenticated', 'authenticated', 'tu-dang-ky@example.com',
          '{"provider":"email"}', '{"full_name":"Tự đăng ký","role":"admin"}');
  select role into v_role from public.profiles where id = 'd0000000-0000-0000-0000-000000000001';
  if v_role <> 'student' then raise exception 'FAIL: user_metadata.role được tin cậy (%)', v_role; end if;
  raise notice 'PASS 9: vai trò mặc định an toàn khi tạo tài khoản';
end $$;

-- 10. get_class_teachers: học sinh chỉ lấy được GV lớp mình
select pg_temp.login_as('c0000000-0000-0000-0000-0000000009a1');
do $$
declare n int;
begin
  select count(*) into n from public.get_class_teachers(array[
    '30000000-0000-0000-0000-00000000009a'::uuid, '30000000-0000-0000-0000-00000000009c'::uuid]);
  if n <> 1 then raise exception 'FAIL: get_class_teachers trả % dòng (mong đợi 1)', n; end if;
  raise notice 'PASS 10: get_class_teachers giới hạn theo lớp của người gọi';
end $$;
select pg_temp.logout();

-- 11. Ngân hàng câu hỏi (có đáp án) – học sinh và khách KHÔNG đọc được; giáo viên đọc được
select pg_temp.login_as('c0000000-0000-0000-0000-0000000009a1');
do $$
begin
  if (select count(*) from public.question_bank) <> 0 then raise exception 'FAIL: học sinh đọc được question_bank'; end if;
  if (select count(*) from public.question_options) <> 0 then raise exception 'FAIL: học sinh đọc được đáp án trắc nghiệm'; end if;
  if (select count(*) from public.question_subitems) <> 0 then raise exception 'FAIL: học sinh đọc được đáp án đúng – sai'; end if;
  raise notice 'PASS 11: học sinh không đọc được đáp án';
end $$;

-- 12. Học sinh KHÔNG tự ghi điểm vào practice_attempts
do $$
begin
  begin
    insert into public.practice_attempts (user_id, lesson_id, mode, score, correct_units, total_units)
    select 'c0000000-0000-0000-0000-0000000009a1', id, 'self_assessment', 10, 7, 7 from public.lessons where number = 2;
    raise exception 'FAIL: học sinh tự ghi điểm được';
  exception when insufficient_privilege then null;
  end;
  raise notice 'PASS 12: học sinh không tự ghi điểm';
end $$;

-- 13. Kết quả thí nghiệm: chỉ ghi cho chính mình
do $$
begin
  insert into public.experiment_attempts (experiment_id, user_id, data)
  select id, 'c0000000-0000-0000-0000-0000000009a1', '{"ok":1}' from public.experiments where key = 'ohm-law';
  begin
    insert into public.experiment_attempts (experiment_id, user_id, data)
    select id, 'c0000000-0000-0000-0000-0000000009a2', '{}' from public.experiments where key = 'ohm-law';
    raise exception 'FAIL: học sinh ghi kết quả thí nghiệm cho người khác';
  exception when insufficient_privilege then null;
  end;
  raise notice 'PASS 13: kết quả thí nghiệm chỉ ghi cho chính mình';
end $$;
select pg_temp.logout();

-- 14. Giáo viên xem được ngân hàng câu hỏi và kết quả thí nghiệm của HS lớp mình, không thấy lớp khác
select pg_temp.login_as('b0000000-0000-0000-0000-000000000001');
do $$
begin
  if (select count(*) from public.question_bank) <> 112 then raise exception 'FAIL: giáo viên không thấy đủ 112 câu hỏi'; end if;
  if (select count(*) from public.experiment_attempts) <> 1 then raise exception 'FAIL: giáo viên không thấy kết quả thí nghiệm của HS lớp mình'; end if;
  raise notice 'PASS 14: quyền giáo viên với câu hỏi và kết quả';
end $$;
select pg_temp.logout();
select pg_temp.login_as('b0000000-0000-0000-0000-000000000002');
do $$
begin
  if (select count(*) from public.experiment_attempts) <> 0 then raise exception 'FAIL: GV lớp 9C thấy kết quả HS lớp 9A'; end if;
  raise notice 'PASS 15: giáo viên không thấy kết quả của lớp khác';
end $$;
select pg_temp.logout();

-- 16. Khách (không đăng nhập) đọc được nội dung bài học đã xuất bản, không đọc được đáp án
set local role anon;
do $$
begin
  if (select count(*) from public.lesson_materials) < 60 then raise exception 'FAIL: khách không đọc được học liệu'; end if;
  if (select count(*) from public.learning_objectives) < 60 then raise exception 'FAIL: khách không đọc được mục tiêu'; end if;
  if (select count(*) from public.question_bank) <> 0 then raise exception 'FAIL: khách đọc được câu hỏi'; end if;
  if (select count(*) from public.experiments) <> 16 then raise exception 'FAIL: khách không thấy danh mục thí nghiệm'; end if;
  raise notice 'PASS 16: truy cập mở cho nội dung bài học';
end $$;
reset role;

-- 17. Đề kiểm tra, giao bài, bài làm, nhận xét
-- Giáo viên Demo tạo đề, thêm câu hỏi, giao cho 9A (lớp mình) – không giao được cho 9C
select pg_temp.login_as('b0000000-0000-0000-0000-000000000001');
do $$
declare v_a uuid; v_g uuid;
begin
  insert into public.assessments (title, created_by, lesson_ids, status)
  values ('Kiểm thử RLS', 'b0000000-0000-0000-0000-000000000001', array(select id from public.lessons where number = 11), 'published')
  returning id into v_a;
  insert into public.assessment_questions (assessment_id, question_id, points)
  select v_a, id, 1 from public.question_bank where code in ('B11-01', 'B11-02');
  insert into public.assessment_assignments (assessment_id, class_id, assigned_by, due_at)
  values (v_a, '30000000-0000-0000-0000-00000000009a', 'b0000000-0000-0000-0000-000000000001', now() + interval '1 day')
  returning id into v_g;
  begin
    insert into public.assessment_assignments (assessment_id, class_id, assigned_by, due_at)
    values (v_a, '30000000-0000-0000-0000-00000000009c', 'b0000000-0000-0000-0000-000000000001', now() + interval '1 day');
    raise exception 'FAIL: giáo viên giao bài cho lớp không phụ trách';
  exception when insufficient_privilege then null;
  end;
  insert into public.student_comments (student_id, teacher_id, content)
  values ('c0000000-0000-0000-0000-0000000009a1', 'b0000000-0000-0000-0000-000000000001', 'Em học tốt.');
  begin
    insert into public.student_comments (student_id, teacher_id, content)
    values ('c0000000-0000-0000-0000-0000000009c1', 'b0000000-0000-0000-0000-000000000001', 'x');
    raise exception 'FAIL: giáo viên nhận xét học sinh lớp khác';
  exception when insufficient_privilege then null;
  end;
  perform set_config('test.assignment', v_g::text, true);
  raise notice 'PASS 17: giáo viên tạo đề, giao bài, nhận xét đúng phạm vi';
end $$;
select pg_temp.logout();

-- 18. Học sinh: không đọc được đề/câu hỏi của đề, không tự tạo/sửa bài làm; đọc được nhận xét về mình
select pg_temp.login_as('c0000000-0000-0000-0000-0000000009a1');
do $$
begin
  if (select count(*) from public.assessments) <> 0 then raise exception 'FAIL: học sinh đọc được bảng đề'; end if;
  if (select count(*) from public.assessment_questions) <> 0 then raise exception 'FAIL: học sinh đọc được câu hỏi của đề'; end if;
  begin
    insert into public.assessment_attempts (assignment_id, user_id, deadline_at, score)
    values (current_setting('test.assignment')::uuid, 'c0000000-0000-0000-0000-0000000009a1', now() + interval '1 hour', 10);
    raise exception 'FAIL: học sinh tự tạo bài làm có điểm';
  exception when insufficient_privilege then null;
  end;
  if (select count(*) from public.student_comments) <> 1 then raise exception 'FAIL: học sinh không đọc được nhận xét về mình'; end if;
  raise notice 'PASS 18: học sinh không xem đáp án, không tự ghi điểm';
end $$;
select pg_temp.logout();

-- 19. Học sinh khác không đọc được nhận xét của bạn; GV lớp khác không thấy đề nháp/bài giao lớp khác
select pg_temp.login_as('c0000000-0000-0000-0000-0000000009a2');
do $$
begin
  if (select count(*) from public.student_comments) <> 0 then raise exception 'FAIL: học sinh đọc nhận xét của bạn khác'; end if;
  raise notice 'PASS 19: nhận xét riêng tư';
end $$;
select pg_temp.logout();
select pg_temp.login_as('b0000000-0000-0000-0000-000000000002');
do $$
begin
  if (select count(*) from public.assessment_assignments) <> 0 then raise exception 'FAIL: GV 9C thấy bài giao lớp 9A'; end if;
  update public.assessments set title = 'Sửa trộm' where title = 'Kiểm thử RLS';
  if found then raise exception 'FAIL: GV khác sửa được đề'; end if;
  raise notice 'PASS 20: giáo viên không sửa đề, không xem bài giao của người khác';
end $$;
select pg_temp.logout();

rollback;
\echo 'TẤT CẢ KIỂM THỬ RLS ĐÃ QUA'
