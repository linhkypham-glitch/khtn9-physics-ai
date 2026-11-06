-- =====================================================================
-- DỮ LIỆU DEMO – CHỈ DÙNG CHO MÔI TRƯỜNG PHÁT TRIỂN CỤC BỘ
-- (npx supabase db reset). KHÔNG chạy file này trên Supabase Cloud thật.
--
-- * Toàn bộ tên, email là dữ liệu giả lập, KHÔNG phải học sinh thật.
-- * Email dùng tên miền dành riêng example.com.
-- * Mật khẩu chung cho mọi tài khoản demo: Demo@12345
-- * Không tạo bất kỳ điểm số / kết quả học tập giả nào.
-- =====================================================================

-- Trường, năm học, lớp
insert into public.schools (id, code, name, address)
values ('10000000-0000-0000-0000-000000000001', 'THCS-DEMO', 'Trường THCS Demo (dữ liệu mẫu)', null)
on conflict (code) do nothing;

insert into public.academic_years (id, school_id, name, start_date, end_date, is_current)
values ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
        '2026-2027', '2026-09-05', '2027-05-31', true)
on conflict (school_id, name) do nothing;

insert into public.classes (id, school_id, academic_year_id, name, grade) values
  ('30000000-0000-0000-0000-00000000009a', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '9A', 9),
  ('30000000-0000-0000-0000-00000000009b', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '9B', 9),
  ('30000000-0000-0000-0000-00000000009c', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '9C', 9)
on conflict (academic_year_id, name) do nothing;

-- Tài khoản demo (Supabase Auth). Vai trò đặt qua raw_app_meta_data → trigger handle_new_user.
create or replace function pg_temp.create_demo_user(
  p_id uuid, p_email text, p_full_name text, p_role text, p_student_code text default null
) returns void language plpgsql as $$
begin
  if exists (select 1 from auth.users where id = p_id) then
    return;
  end if;

  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) values (
    '00000000-0000-0000-0000-000000000000', p_id, 'authenticated', 'authenticated', p_email,
    extensions.crypt('Demo@12345', extensions.gen_salt('bf')), now(),
    jsonb_strip_nulls(jsonb_build_object(
      'provider', 'email', 'providers', jsonb_build_array('email'),
      'role', p_role, 'student_code', p_student_code,
      'username', case when p_role = 'student' then split_part(p_email, '@', 1) end)),
    jsonb_build_object('full_name', p_full_name), now(), now(),
    '', '', '', ''
  );

  insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values (
    gen_random_uuid(), p_id, p_id::text,
    jsonb_build_object('sub', p_id::text, 'email', p_email, 'email_verified', true),
    'email', now(), now(), now()
  );
end;
$$;

select pg_temp.create_demo_user('a0000000-0000-0000-0000-000000000001', 'admin@example.com', 'Quản trị viên Demo', 'admin');
select pg_temp.create_demo_user('b0000000-0000-0000-0000-000000000001', 'giaovien@example.com', 'Giáo viên Demo', 'teacher');
select pg_temp.create_demo_user('b0000000-0000-0000-0000-000000000002', 'giaovien2@example.com', 'Giáo viên Demo 2', 'teacher');

select pg_temp.create_demo_user(('c0000000-0000-0000-0000-0000000009a' || n)::uuid,
  format('hs9a.%s@example.com', lpad(n::text, 2, '0')),
  format('Học sinh Demo 9A-%s', lpad(n::text, 2, '0')), 'student', format('DEMO-9A-%s', lpad(n::text, 2, '0')))
from generate_series(1, 3) as n;

select pg_temp.create_demo_user(('c0000000-0000-0000-0000-0000000009b' || n)::uuid,
  format('hs9b.%s@example.com', lpad(n::text, 2, '0')),
  format('Học sinh Demo 9B-%s', lpad(n::text, 2, '0')), 'student', format('DEMO-9B-%s', lpad(n::text, 2, '0')))
from generate_series(1, 3) as n;

select pg_temp.create_demo_user(('c0000000-0000-0000-0000-0000000009c' || n)::uuid,
  format('hs9c.%s@example.com', lpad(n::text, 2, '0')),
  format('Học sinh Demo 9C-%s', lpad(n::text, 2, '0')), 'student', format('DEMO-9C-%s', lpad(n::text, 2, '0')))
from generate_series(1, 3) as n;

update public.profiles set school_id = '10000000-0000-0000-0000-000000000001'
where email like '%@example.com' and school_id is null;

-- Phân công: Giáo viên Demo dạy 9A, 9B; Giáo viên Demo 2 dạy 9C
insert into public.class_members (class_id, user_id, member_role) values
  ('30000000-0000-0000-0000-00000000009a', 'b0000000-0000-0000-0000-000000000001', 'teacher'),
  ('30000000-0000-0000-0000-00000000009b', 'b0000000-0000-0000-0000-000000000001', 'teacher'),
  ('30000000-0000-0000-0000-00000000009c', 'b0000000-0000-0000-0000-000000000002', 'teacher')
on conflict do nothing;

insert into public.class_members (class_id, user_id, member_role)
select ('30000000-0000-0000-0000-00000000009' || cls)::uuid,
       ('c0000000-0000-0000-0000-0000000009' || cls || n)::uuid,
       'student'
from unnest(array['a', 'b', 'c']) as cls, generate_series(1, 3) as n
on conflict do nothing;
