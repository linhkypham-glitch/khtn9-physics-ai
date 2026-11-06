# RLS policies

Các policy được định nghĩa trong migration để luôn được áp dụng cùng schema:

- `supabase/migrations/20261106000200_auth_and_rls.sql` – hàm phân quyền, trigger tạo hồ sơ, chống leo thang đặc quyền, policy cho toàn bộ bảng.
- `supabase/migrations/20261106000300_class_teachers_fn.sql` – hàm `get_class_teachers`.

Kiểm thử: `npm run test:db` (`tests/db/rls.test.sql`).

## Ma trận quyền (Milestone 1)

| Bảng | Khách | Học sinh | Giáo viên | Admin |
|---|---|---|---|---|
| textbooks / chapters / lessons | đọc | đọc | đọc | đọc + ghi |
| learning_objectives | – | đọc | đọc + ghi | đọc + ghi |
| lesson_materials | – | đọc (đã xuất bản) | đọc + ghi | đọc + ghi |
| profiles | – | chính mình + GV lớp mình (sửa họ tên) | mình + HS lớp phụ trách | tất cả |
| classes | – | lớp mình | lớp phụ trách | tất cả |
| class_members | – | dòng của mình | lớp phụ trách | tất cả |
| notifications | – | của mình | của mình + gửi | tất cả |
| audit_logs | – | – | – | đọc |
| system_settings | – | – | đọc | đọc + ghi |
