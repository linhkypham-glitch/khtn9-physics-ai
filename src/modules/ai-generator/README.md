# ai-generator – AI tạo câu hỏi / đề

Gọi AI qua backend (`src/lib/ai`), không lộ API key. Câu hỏi AI tạo đi qua quy trình DRAFT → REVIEWED → APPROVED → PUBLISHED; chỉ câu đã duyệt mới vào đề chính thức.
Cấu trúc 18 + 2 + 6 là cấu hình mặc định của ứng dụng, **không** phải yêu cầu bắt buộc của Công văn 7991.

Trạng thái: **chưa triển khai** (Milestone 4). Cấu hình nhà cung cấp đã có tại `src/lib/ai/config.ts`.
