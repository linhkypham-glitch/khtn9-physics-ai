// Sinh supabase/seed/01_curriculum.sql từ danh mục chuẩn.
// Chạy: npm run seed:generate
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { buildCurriculumSeedSql } from "../src/modules/curriculum/seed-sql.ts";

const out = resolve(import.meta.dirname, "../supabase/seed/01_curriculum.sql");
writeFileSync(out, buildCurriculumSeedSql(), "utf8");
console.log(`Đã ghi ${out}`);
