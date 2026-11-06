"use server";

import { z } from "zod";

import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const jsonValue: z.ZodType<unknown> = z.lazy(() =>
  z.union([z.string().max(500), z.number(), z.boolean(), z.null(), z.array(jsonValue).max(200), z.record(z.string().max(60), jsonValue)]),
);

/** Lưu kết quả thực hành thí nghiệm (thông số, bảng số liệu, trả lời câu hỏi khám phá). */
export async function saveExperimentAttempt(
  experimentKey: string,
  data: Record<string, unknown>,
  answers: Record<string, string>,
): Promise<{ ok: boolean; message: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, message: "Hãy vào học (nhập họ tên và lớp) để lưu kết quả." };
  const parsedData = z.record(z.string().max(60), jsonValue).safeParse(data);
  const parsedAnswers = z.record(z.string().max(10), z.string().max(2000)).safeParse(answers);
  if (!/^[a-z-]{2,40}$/.test(experimentKey) || !parsedData.success || !parsedAnswers.success) {
    return { ok: false, message: "Dữ liệu không hợp lệ." };
  }
  const admin = createSupabaseAdminClient();
  if (!admin) return { ok: false, message: "Máy chủ chưa cấu hình lưu trữ." };
  const { data: exp } = await admin.from("experiments").select("id").eq("key", experimentKey).maybeSingle();
  if (!exp) return { ok: false, message: "Không tìm thấy thí nghiệm." };
  const res = await admin.from("experiment_attempts").insert({
    experiment_id: exp.id,
    user_id: user.id,
    data: parsedData.data as never,
    answers: parsedAnswers.data,
  });
  if (res.error) {
    console.error("[virtual-lab] save", res.error);
    return { ok: false, message: "Không lưu được kết quả, vui lòng thử lại." };
  }
  return { ok: true, message: "Đã lưu kết quả thực hành." };
}
