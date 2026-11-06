# KHTN 9 – PHYSICS AI

Nền tảng học tập, thí nghiệm mô phỏng, luyện tập, kiểm tra đánh giá và phân tích quá trình học tập cho
**KHTN 9 – phân môn Vật lý** (bộ sách *Kết nối tri thức với cuộc sống*). Phục vụ 3 vai trò: Quản trị viên, Giáo viên, Học sinh.

## Công nghệ

| Lớp | Công nghệ |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui (Radix), Lucide, Recharts |
| Backend | Supabase: PostgreSQL, Auth, Storage, Row Level Security |
| Kiểm thử | Vitest (đơn vị), SQL test RLS trên Postgres thật, Playwright (end-to-end, thủ công) |
| Triển khai | Vercel + Supabase Cloud |

## Trạng thái phát triển

| Milestone | Nội dung | Trạng thái |
|---|---|---|
| 1 | Nền tảng: dự án, giao diện, đăng nhập, phân quyền, schema + RLS, seed chương trình học, dashboard | ✅ Hoàn thành |
| 2 | Học liệu, ngân hàng câu hỏi, thí nghiệm ảo, luyện tập – tự đánh giá, quản lý lớp, học sinh vào học không mật khẩu | ✅ Hoàn thành |
| 3 | Soạn/sửa câu hỏi, soạn đề (tự soạn, tự động, AI), giao bài theo lớp, làm bài, chấm điểm, báo cáo, nhận xét, xuất Excel/CSV | ✅ Hoàn thành |
| 4 | AI tạo câu hỏi / đề / ma trận / bản đặc tả, AI phân tích | ⏳ |
| 5 | Bảng xếp hạng, phân tích học tập, xuất Excel/CSV | ⏳ |
| 6 | Kiểm thử tổng thể, bảo mật, tối ưu, triển khai | ⏳ |

### Đã hoạt động (Milestone 1)

- Đăng nhập / đăng xuất bằng Supabase Auth (email + mật khẩu), làm mới phiên qua `src/proxy.ts`.
- Phân quyền 3 lớp: proxy chặn khu vực cần đăng nhập → layout kiểm tra vai trò ở máy chủ → RLS trong database.
- Dashboard **học sinh** (lớp, giáo viên, lộ trình bài học), **giáo viên** (lớp phụ trách, sĩ số, biểu đồ chương trình), **quản trị** (thống kê tài khoản, lớp, cấu hình) – toàn bộ số liệu đọc từ database.
- Danh sách 5 chương / 16 bài; trang bài học với 5 khu vực (Kiến thức, Thí nghiệm, Luyện tập, Tự đánh giá, Kết quả học tập) đọc mục tiêu, yêu cầu cần đạt, học liệu từ database (hiển thị trạng thái trống khi chưa có nội dung).
- Trang `/setup` và `/admin/settings` kiểm tra cấu hình thực tế (Supabase, dữ liệu, service-role, AI) – không lộ bí mật.
- `GET /api/health` cho giám sát.
- Ứng dụng vẫn chạy khi chưa cấu hình Supabase hoặc AI, kèm thông báo rõ ràng.

### Đã hoạt động (Milestone 2)

- **Học sinh vào học không cần mật khẩu**: mở link → *Vào học* → nhập họ tên + lớp. Nhập cùng tên lớp được xếp chung lớp;
  nhập lại đúng họ tên + lớp thì vào lại đúng hồ sơ (giữ kết quả). Phiên học sinh là cookie httpOnly ký HMAC, 180 ngày.
- **Giáo viên**: tạo lớp, nhận lớp do học sinh tạo, thêm/xoá học sinh, khoá tự đăng ký, **tải lên Excel** (cột Họ và tên,
  Lớp, Mã HS – có file mẫu), xem điểm trung bình từng học sinh.
- **Nội dung 16 bài**: mục tiêu, yêu cầu cần đạt, lý thuyết, công thức, ví dụ, mô tả thí nghiệm SGK (đối chiếu kế hoạch bài dạy KHTN 9 KNTT).
- **16 thí nghiệm ảo tương tác** (mỗi bài một mô phỏng, bám thí nghiệm SGK): thanh trượt, số đo, công thức, đồ thị,
  Bắt đầu/Tạm dừng/Đặt lại, bảng số liệu, câu hỏi khám phá, lưu kết quả.
- **Ngân hàng 112 câu hỏi** (7 câu/bài: trắc nghiệm, đúng – sai 4 ý, trả lời ngắn) có lời giải, công thức, ghi nhớ.
  *Luyện tập* (kiểm tra từng câu) và *Tự đánh giá* (đồng hồ, đánh dấu xem lại, tự lưu nháp, chấm thang 10 ở máy chủ,
  đúng – sai chấm 0,1/0,25/0,5/1). Đáp án không bao giờ gửi xuống trình duyệt trước khi nộp.
- **Kết quả học tập** theo bài và tiến độ trên dashboard (dữ liệu thật).
- Giao diện **tone cam**, mỗi chương một màu nhận diện.

### Đã hoạt động (Milestone 3)

- **Ngân hàng câu hỏi**: giáo viên thêm, sửa, xoá, duyệt câu hỏi (trắc nghiệm, đúng – sai 4 ý, trả lời ngắn) cho từng bài; lọc câu chờ duyệt.
- **Đề kiểm tra** với 3 cách tạo: *tự động từ ngân hàng* (theo cấu trúc + tỉ lệ Biết/Hiểu/Vận dụng, rải đều các bài),
  *giáo viên tự soạn*, *AI soạn câu hỏi mới* (Claude, structured outputs, chỉ dùng nội dung bài học trong hệ thống).
  Câu AI tạo qua kiểm tra chất lượng tự động và ở trạng thái **nháp** – đề chỉ xuất bản được khi mọi câu đã được giáo viên duyệt.
  Cấu trúc mặc định 18 + 2 + 6 (26 câu, 32 đơn vị) là cấu hình của ứng dụng, **không phải** quy định bắt buộc của Công văn 7991.
  Ma trận đề (bài × dạng × mức độ, tỉ lệ điểm) tính tự động.
- **Giao bài theo lớp**: mã bài giao, thời gian bắt đầu, hạn nộp, số lần làm, thời điểm công bố đáp án; đóng/mở bài giao.
- **Học sinh làm bài**: đồng hồ đếm ngược, đánh dấu xem lại, tự lưu lên máy chủ mỗi 15 giây + lưu tạm trên máy khi mất mạng,
  tải lại trang không mất bài, hết giờ tự nộp; chấm điểm ở máy chủ; giải thích từng câu theo cài đặt của giáo viên.
- **Kết quả học tập**: thống kê lớp (TB, cao/thấp nhất, tỉ lệ hoàn thành, phổ điểm, tỉ lệ đúng theo chương/mức độ/dạng/từng câu),
  hồ sơ từng học sinh (tiến bộ, điểm mạnh – cần cải thiện), **nhận xét của giáo viên** (có gợi ý từ dữ liệu, học sinh xem được).
- **Xuất Excel** (BANG_DIEM, CHI_TIET_BAI_LAM, THONG_KE_LOP, PHAN_TICH_HOC_TAP), **CSV** UTF-8, hồ sơ học sinh (Excel).

### Đã hoạt động (Milestone 4)

- **Giáo viên soạn nội dung bài học** trên giao diện (`/teacher/curriculum/<bài>/edit`): mục tiêu, yêu cầu cần đạt,
  học liệu theo khu vực Kiến thức / Thí nghiệm / Luyện tập / Tự đánh giá (văn bản, công thức, ví dụ, hình ảnh, video, liên kết),
  sắp xếp, xuất bản hoặc để nháp. Video YouTube được nhúng trực tiếp (youtube-nocookie).
- **Câu tự luận**: giáo viên soạn kèm hướng dẫn chấm; học sinh làm bài, điểm ở trạng thái *chờ chấm*;
  giáo viên chấm trong trang kết quả bài giao. AI (nếu đã cấu hình) **chỉ gợi ý** điểm và nhận xét – điểm chính thức do giáo viên lưu.
- **Bảng xếp hạng**: theo từng bài giao và theo lớp (cả năm, tháng, học kỳ I, học kỳ II). Mặc định ẩn; giáo viên bật cho từng lớp/bài,
  quản trị viên có công tắc tắt toàn hệ thống. Chỉ hiển thị họ tên, lớp, điểm, thời gian, số ý đúng.
- **AI viết bản nháp nhận xét** quá trình học tập từ số liệu thật (không suy đoán phẩm chất, hoàn cảnh); giáo viên đọc, sửa rồi mới lưu.

### Bật AI (tạo đề, gợi ý chấm tự luận, nháp nhận xét)

Chọn **một** trong hai nhà cung cấp, thêm biến môi trường trên Vercel (Settings → Environment Variables) rồi Redeploy:

| Nhà cung cấp | Biến cần đặt | Chi phí | Ghi chú |
|---|---|---|---|
| **Google Gemini** | `GEMINI_API_KEY` (lấy tại aistudio.google.com → Get API key) | Có gói miễn phí, giới hạn số lượt/phút và /ngày | Gói miễn phí: Google có thể dùng dữ liệu gửi lên để cải thiện sản phẩm. Model mặc định `gemini-2.5-flash`. |
| **Anthropic Claude** | `ANTHROPIC_API_KEY` (console.anthropic.com) | Trả phí theo lượt dùng | Model mặc định `claude-opus-5-5`; rẻ hơn: `AI_MODEL=claude-haiku-5-5`. Bật `fallbacks: "default"`. |

Nếu đặt cả hai khoá, dùng `AI_PROVIDER=gemini` hoặc `AI_PROVIDER=anthropic` để chọn. `AI_MODEL` (tuỳ chọn) chỉ áp dụng khi khớp nhà cung cấp.
Ứng dụng **không gửi họ tên học sinh** cho AI (nhận xét dùng nhãn thay thế rồi điền tên ở máy chủ); bài tự luận chỉ gửi nội dung bài làm.

### Chưa có

Tải tệp (ảnh, PDF) lên kho lưu trữ cho học liệu – hiện dùng đường dẫn URL; thông báo đẩy cho học sinh.

> **Lưu ý về mục lục:** danh mục chính thức gồm Bài 2 → Bài 17, tức **16 bài** (không phải 17). Ứng dụng giữ nguyên văn danh mục, không tự thêm bài.

## Cài đặt & chạy

Yêu cầu: Node.js ≥ 20.9, npm. Chạy Supabase cục bộ cần Docker.

```bash
npm install
cp .env.example .env.local
```

### Cách A – Supabase cục bộ (khuyến nghị khi phát triển)

```bash
npx supabase start
```

Lấy `API_URL`, `PUBLISHABLE_KEY`, `SECRET_KEY` từ kết quả (hoặc `npx supabase status`) điền vào `.env.local`, rồi:

```bash
npx supabase db reset
```

```bash
npm run dev
```

`db reset` chạy migration + seed (chương trình học, cấu hình, **dữ liệu demo**). Tài khoản demo (mật khẩu `Demo@12345`, toàn bộ là dữ liệu giả lập):

| Vai trò | Email |
|---|---|
| Quản trị viên | `admin@example.com` |
| Giáo viên (9A, 9B) | `giaovien@example.com` |
| Giáo viên (9C) | `giaovien2@example.com` |
| Học sinh | `hs9a.01@example.com` … `hs9c.03@example.com` |

### Cách B – Supabase Cloud

1. Tạo dự án tại supabase.com; lấy Project URL, khóa Publishable và Secret (Project Settings → API Keys) điền vào `.env.local`.
2. Đẩy migration:
   ```bash
   npx supabase link --project-ref <project-ref>
   ```
   ```bash
   npx supabase db push
   ```
3. Trong SQL Editor, chạy `supabase/seed/01_curriculum.sql` → `05_experiments.sql` (hoặc dán một lần file `supabase/cloud-setup.sql`).
   **Không** chạy `90_demo_data.sql` trên môi trường thật.
   - Đã cài Milestone 1? Chạy **một lần** lần lượt `cloud-update-m2.sql` → `cloud-update-m3.sql` → `cloud-update-m4.sql`.
   - Đã cài Milestone 2? Chạy **một lần** `cloud-update-m3.sql` rồi `cloud-update-m4.sql`.
   - Đã cài Milestone 3? Chỉ chạy **một lần** `supabase/cloud-update-m4.sql`.
   - Bị lỗi *already exists* / *does not exist* do chạy dở? Chạy `supabase/cloud-repair-m3-m4.sql` (chạy lại nhiều lần vẫn an toàn).
4. Tạo người dùng đầu tiên ở Authentication → Users, rồi cấp quyền quản trị:
   ```sql
   update public.profiles set role = 'admin' where email = 'email-cua-ban@truong.edu.vn';
   ```
5. Mở `/setup` để kiểm tra kết nối.

### Triển khai Vercel

Import repository vào Vercel, khai báo các biến trong `.env.example` (Production/Preview). Trong Supabase → Authentication → URL Configuration, đặt Site URL là tên miền Vercel.

## Biến môi trường

| Biến | Phạm vi | Bắt buộc | Ghi chú |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | trình duyệt + máy chủ | ✔ | |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | trình duyệt + máy chủ | ✔ | hoặc `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `SUPABASE_SECRET_KEY` | **chỉ máy chủ** | các chức năng quản trị sau này | bỏ qua RLS – không bao giờ thêm `NEXT_PUBLIC_` |
| `AI_PROVIDER` | chỉ máy chủ | không | `anthropic` \| `openai` \| `gemini` |
| `AI_MODEL`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY` | chỉ máy chủ | không | |

## Lệnh

| Lệnh | Mô tả |
|---|---|
| `npm run dev` / `build` / `start` | Phát triển / build / chạy production |
| `npm run lint` · `npm run typecheck` | ESLint · TypeScript |
| `npm test` | Kiểm thử đơn vị (Vitest) |
| `npm run test:db` | Kiểm thử RLS trên Supabase cục bộ |
| `npm run db:reset` | Chạy lại migration + seed cục bộ |
| `npm run db:types` | Sinh lại kiểu TypeScript từ database |
| `npm run seed:generate` | Sinh lại `01_curriculum.sql` từ `src/modules/curriculum/catalog.ts` |

## Cấu trúc thư mục

```
src/
  app/                  # Routes (App Router)
    login/ setup/ student/ teacher/ admin/ api/health/
  components/
    ui/                 # shadcn/ui
    layout/             # AppShell, sidebar, menu
    dashboard/ charts/ questions/ experiments/ forms/
  modules/              # Nghiệp vụ theo module
    curriculum/         # catalog chuẩn, repository, trang chương/bài
    classes/            # lớp học
    virtual-lab/ question-bank/ assessments/ ai-generator/ grading/ analytics/ reports/
  lib/
    supabase/           # client trình duyệt / máy chủ / service-role / proxy
    auth/               # phiên đăng nhập, vai trò
    ai/                 # cấu hình nhà cung cấp AI (server-only)
    validation/ excel/
  types/                # supabase.ts (sinh tự động), database.ts
  styles/globals.css
  proxy.ts              # (thay cho middleware trong Next.js 16)
supabase/
  migrations/           # schema, hàm, RLS
  seed/                 # 01 chương trình · 02 cấu hình · 90 demo (chỉ cục bộ)
  policies/README.md    # ma trận quyền
tests/
  unit/                 # Vitest
  db/                   # kiểm thử RLS (SQL)
```

## Cơ sở dữ liệu (Milestone 1)

- **Tài khoản & lớp:** `profiles`, `schools`, `academic_years`, `classes`, `class_members`
- **Chương trình học:** `textbooks`, `chapters`, `lessons`, `learning_objectives`, `lesson_materials`
- **Hệ thống:** `notifications`, `audit_logs`, `system_settings`

Các nhóm bảng thí nghiệm, ngân hàng câu hỏi, kiểm tra, AI, phân tích sẽ được thêm bằng migration ở milestone tương ứng.

Nguyên tắc bảo mật chính:
- RLS bật cho mọi bảng; hàm phân quyền `SECURITY DEFINER` với `search_path` rỗng.
- Vai trò chỉ lấy từ `app_metadata` (do quản trị đặt), không bao giờ từ `user_metadata`; tài khoản tự đăng ký luôn là học sinh.
- Trigger chặn người dùng thường tự đổi vai trò, mã học sinh, trạng thái.
- Học sinh không xem được danh sách/hồ sơ bạn cùng lớp.

## Quyết định kỹ thuật

- **Next.js 16 – Cache Components tắt**: gần như mọi trang phụ thuộc phiên đăng nhập + RLS, nên dùng render động truyền thống.
- **shadcn/ui** được viết trực tiếp vào `src/components/ui` (theo đúng mẫu shadcn, có `components.json` để thêm component bằng CLI sau này).
- **Danh mục chương trình** có một nguồn chuẩn (`catalog.ts`); file seed SQL được sinh tự động và kiểm thử đối chiếu với mục lục chính thức.
