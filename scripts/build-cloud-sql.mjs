// Gộp migration + seed (KHÔNG gồm dữ liệu demo) thành 1 file để dán vào Supabase SQL Editor.
// Chạy: npm run db:cloud-sql  → supabase/cloud-setup.sql
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "../supabase");
const parts = [
  ...readdirSync(join(root, "migrations")).sort().map((f) => join("migrations", f)),
  "seed/01_curriculum.sql",
  "seed/02_system_settings.sql",
];
const out = parts
  .map((p) => `-- >>>>> ${p}\n${readFileSync(join(root, p), "utf8")}`)
  .join("\n\n");
writeFileSync(
  join(root, "cloud-setup.sql"),
  `-- FILE SINH TỰ ĐỘNG – chạy 1 lần trên dự án Supabase Cloud MỚI (SQL Editor → New query → Run).\n-- Không chứa dữ liệu demo.\n\n${out}`,
);
console.log("Đã ghi supabase/cloud-setup.sql");
