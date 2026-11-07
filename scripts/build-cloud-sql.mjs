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


/** Chỉ giữ phần Hoá học (Bài 18 – 35) của một file seed, để bản cập nhật M7 không động tới nội dung Vật lý đã có (có thể đã được giáo viên chỉnh sửa). */
function onlyChemistry(p) {
  const text = readFileSync(join(root, p), "utf8");
  const header = `-- >>>>> ${p} (chỉ phần Hoá học, Bài 18 – 35)\n`;
  if (p.includes("01_curriculum")) {
    const blocks = text.split(/^(?=-- =+\n-- SEED CHƯƠNG TRÌNH HỌC KHTN 9 – )/m);
    return header + blocks.filter((b) => b.includes("HOÁ HỌC")).join("");
  }
  if (p.includes("05_experiments")) {
    return header + text.split("\n").filter((l) => !l.startsWith("insert into") || /l\.number = (1[89]|2\d|3[0-5])\)/.test(l) || /where t\.code = 'KHTN9-KNTT-HH'/.test(l)).join("\n");
  }
  const parts = text.split(/^(?=-- Bài \d+$)/m);
  const keep = parts.filter((part) => {
    const m = part.match(/^-- Bài (\d+)$/m);
    return m && Number(m[1]) >= 18;
  });
  return header + keep.join("");
}

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
const m4 = migrations.filter((m) => m.split("/").pop() >= "20261109" && m.split("/").pop() < "20261110");
const m5 = migrations.filter((m) => m.split("/").pop() >= "20261110" && m.split("/").pop() < "20261111");
const m6 = migrations.filter((m) => m.split("/").pop() >= "20261111");
// Milestone 7 (Hoá học 9) chỉ thêm dữ liệu: không có migration mới.
writeFileSync(
  join(root, "cloud-update-m4.sql"),
  `-- FILE SINH TỰ ĐỘNG – CẬP NHẬT lên Milestone 4 (câu tự luận do giáo viên chấm, bảng xếp hạng) cho dự án đã chạy cloud-update-m3.sql.\n-- Chạy MỘT lần trong SQL Editor.\n\n${m4.map(read).join("\n\n")}`,
);

writeFileSync(
  join(root, "cloud-update-m5.sql"),
  `-- FILE SINH TỰ ĐỘNG – CẬP NHẬT lên Milestone 5 (đối chiếu thí nghiệm Bài 12 – 17 với SGK).\n-- Chạy MỘT lần trong SQL Editor, sau khi đã chạy cloud-update-m4.sql (hoặc cloud-repair-m3-m4.sql).\n-- Chạy lại nhiều lần vẫn an toàn.\n\n${[...m5, "seed/03_lesson_content.sql", "seed/05_experiments.sql"].map(read).join("\n\n")}`,
);

writeFileSync(
  join(root, "cloud-update-m6.sql"),
  `-- FILE SINH TỰ ĐỘNG – CẬP NHẬT lên Milestone 6 (đối chiếu kiến thức và thí nghiệm Bài 2 – 17 với SGK).\n-- Chạy MỘT lần trong SQL Editor, sau cloud-update-m5.sql. Chạy lại nhiều lần vẫn an toàn.\n-- Chỉ thay nội dung mẫu chưa bị giáo viên sửa; nội dung giáo viên tự thêm hoặc đã sửa được giữ nguyên.\n\n${[...m6, "seed/03_lesson_content.sql", "seed/05_experiments.sql"].map(read).join("\n\n")}`,
);

writeFileSync(
  join(root, "cloud-update-m7.sql"),
  `-- FILE SINH TỰ ĐỘNG – CẬP NHẬT lên Milestone 7: thêm môn Hoá học 9 (Bài 18 – 35: chương trình, kiến thức, thí nghiệm, câu hỏi).\n-- Chạy MỘT lần trong SQL Editor, sau cloud-update-m6.sql. Chạy lại nhiều lần vẫn an toàn. Không xoá dữ liệu.\n\n${[onlyChemistry("seed/01_curriculum.sql"), onlyChemistry("seed/03_lesson_content.sql"), onlyChemistry("seed/04_question_bank.sql"), onlyChemistry("seed/05_experiments.sql")].join("\n\n")}`,
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
console.log("Đã ghi cloud-setup.sql, cloud-update-m2.sql, cloud-update-m3.sql, cloud-update-m4.sql, cloud-update-m5.sql, cloud-update-m6.sql, cloud-update-m7.sql, cloud-repair-m3-m4.sql");
