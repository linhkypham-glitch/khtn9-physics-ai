// Sinh file SQL để dán vào Supabase Cloud (SQL Editor). KHÔNG chứa dữ liệu demo.
//   supabase/cloud-setup.sql      – cài mới toàn bộ (dự án Supabase trống)
//   supabase/cloud-update-m2.sql  – cập nhật dự án đã cài Milestone 1 lên Milestone 2
//   supabase/cloud-update-m3.sql, cloud-update-m4.sql – các bản cập nhật tiếp theo
// Chạy: npm run db:cloud-sql
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "../supabase");
const migrations = readdirSync(join(root, "migrations")).sort().map((f) => join("migrations", f));
const read = (p) => `-- >>>>> ${p}\n${readFileSync(join(root, p), "utf8")}`;

const SEEDS_ALL = ["seed/01_curriculum.sql", "seed/02_system_settings.sql", "seed/03_lesson_content.sql", "seed/04_question_bank.sql", "seed/05_experiments.sql"];

writeFileSync(
  join(root, "cloud-setup.sql"),
  `-- FILE SINH TỰ ĐỘNG – cài đặt MỚI trên dự án Supabase Cloud TRỐNG (SQL Editor → New query → Run).\n-- Không chứa dữ liệu demo.\n\n${[...migrations, ...SEEDS_ALL].map(read).join("\n\n")}`,
);

const m2 = migrations.filter((m) => m.split("/").pop() >= "20261107" && m.split("/").pop() < "20261108");
writeFileSync(
  join(root, "cloud-update-m2.sql"),
  `-- FILE SINH TỰ ĐỘNG – CẬP NHẬT lên Milestone 2 cho dự án đã chạy cloud-setup.sql của Milestone 1.\n-- Chạy MỘT lần trong SQL Editor. Không chứa dữ liệu demo.\n\n${[...m2, "seed/03_lesson_content.sql", "seed/04_question_bank.sql", "seed/05_experiments.sql"].map(read).join("\n\n")}`,
);
const m3 = migrations.filter((m) => m.split("/").pop() >= "20261108" && m.split("/").pop() < "20261109");
writeFileSync(
  join(root, "cloud-update-m3.sql"),
  `-- FILE SINH TỰ ĐỘNG – CẬP NHẬT lên Milestone 3 (đề kiểm tra, giao bài, nhận xét, AI) cho dự án đã chạy cloud-update-m2.sql.\n-- Chạy MỘT lần trong SQL Editor.\n\n${m3.map(read).join("\n\n")}`,
);
const m4 = migrations.filter((m) => m.split("/").pop() >= "20261109");
writeFileSync(
  join(root, "cloud-update-m4.sql"),
  `-- FILE SINH TỰ ĐỘNG – CẬP NHẬT lên Milestone 4 (câu tự luận do giáo viên chấm, bảng xếp hạng) cho dự án đã chạy cloud-update-m3.sql.\n-- Chạy MỘT lần trong SQL Editor.\n\n${m4.map(read).join("\n\n")}`,
);

/**
 * Bản "chạy lại an toàn" cho m3 + m4: dùng khi dự án đã chạy dở một phần (báo "already exists").
 * Bỏ qua đối tượng đã có, tạo phần còn thiếu.
 */
function idempotent(sql) {
  return sql
    .replace(/^create type (public\.\w+) as enum \(([^;]*)\);/gm, (_m, name, vals) =>
      `do $$ begin create type ${name} as enum (${vals}); exception when duplicate_object then null; end $$;`)
    .replace(/^create table (public\.)/gm, "create table if not exists $1")
    .replace(/^create index (\w+)/gm, "create index if not exists $1")
    .replace(/^create trigger (\w+) (before|after) (\w+) on (public\.\w+)/gm, (m, name, _w, _e, table) => `drop trigger if exists ${name} on ${table};\n${m}`)
    .replace(/^create policy (\w+) on (public\.\w+)/gm, (m, name, table) => `drop policy if exists ${name} on ${table};\n${m}`)
    .replace(/add column (?!if not exists)/g, "add column if not exists ");
}
writeFileSync(
  join(root, "cloud-repair-m3-m4.sql"),
  `-- FILE SINH TỰ ĐỘNG – CHẠY LẠI AN TOÀN bản cập nhật Milestone 3 + 4.\n-- Dùng khi cloud-update-m3.sql / m4.sql báo lỗi "already exists" hoặc "does not exist" (đã chạy dở).\n-- Chạy được nhiều lần: bỏ qua phần đã có, tạo phần còn thiếu. Không xoá dữ liệu.\n\n${[...m3, ...m4].map((p) => idempotent(read(p))).join("\n\n")}`,
);
console.log("Đã ghi cloud-setup.sql, cloud-update-m2.sql, cloud-update-m3.sql, cloud-update-m4.sql, cloud-repair-m3-m4.sql");
