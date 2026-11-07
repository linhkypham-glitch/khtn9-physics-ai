// Sinh các file seed từ dữ liệu chuẩn trong mã nguồn.
// Chạy: npm run seed:generate
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { buildAllCurriculumSeedSql } from "../src/modules/curriculum/seed-sql.ts";
import {
  buildExperimentsSql,
  buildLessonContentSql,
  buildQuestionBankSql,
} from "../src/modules/curriculum/content-seed-sql.ts";

const dir = resolve(import.meta.dirname, "../supabase/seed");
const files: Record<string, string> = {
  "01_curriculum.sql": buildAllCurriculumSeedSql(),
  "03_lesson_content.sql": buildLessonContentSql(),
  "04_question_bank.sql": buildQuestionBankSql(),
  "05_experiments.sql": buildExperimentsSql(),
};
for (const [name, sql] of Object.entries(files)) {
  writeFileSync(resolve(dir, name), sql, "utf8");
  console.log(`Đã ghi supabase/seed/${name}`);
}
