# reports – Xuất báo cáo

Excel (ExcelJS) và CSV UTF-8 (có BOM) – xem `src/lib/excel/reports.ts`:
- Bài giao: BANG_DIEM, CHI_TIET_BAI_LAM, THONG_KE_LOP, PHAN_TICH_HOC_TAP (`/api/reports/assignments/[id]`).
- Học sinh: hồ sơ học tập (`/api/reports/students/[id]`).
- Lớp theo kỳ (tuần / tháng / học kì / cả năm): TONG_QUAN, HOC_SINH, BAI_KIEM_TRA, THEO_CHUONG (`/api/reports/classes/[id]?ky=week|month|hk1|hk2|all&lui=0`).

Trang xem trên giao diện: `/teacher/classes/[id]/bao-cao`. Logic: `src/modules/assessments/class-report*.ts`.
