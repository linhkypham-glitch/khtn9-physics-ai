"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Giáo viên / quản trị viên chỉnh sửa nội dung bài học (mục tiêu, yêu cầu cần đạt, học liệu).
 * Ghi bằng client của người dùng ⇒ RLS (is_staff) kiểm tra quyền lần nữa ở CSDL.
 */
export type ContentResult = { ok: boolean; message: string };

const id = z.guid();
const objectiveSchema = z.object({
  kind: z.enum(["objective", "requirement"]),
  content: z.string().trim().min(3, "Nội dung quá ngắn.").max(1000, "Nội dung tối đa 1000 ký tự."),
});
const materialSchema = z
  .object({
    section: z.enum(["knowledge", "experiment", "practice", "self_assessment"]),
    kind: z.enum(["text", "formula", "example", "image", "video", "link"]),
    title: z.string().trim().min(2, "Tiêu đề quá ngắn.").max(200, "Tiêu đề tối đa 200 ký tự."),
    body: z.string().trim().max(10000, "Nội dung tối đa 10 000 ký tự.").nullable(),
    url: z
      .string()
      .trim()
      .max(1000)
      .nullable()
      .refine((u) => !u || /^https?:\/\/\S+$/i.test(u), "Đường dẫn phải bắt đầu bằng http:// hoặc https://"),
    is_published: z.boolean(),
  })
  .refine((m) => (["image", "video", "link"].includes(m.kind) ? Boolean(m.url) : Boolean(m.body)), {
    message: "Loại hình ảnh / video / liên kết cần đường dẫn; các loại khác cần nội dung.",
  });
export type MaterialInput = z.input<typeof materialSchema>;

async function ctx(lessonId: string) {
  const user = await getCurrentUser();
  if (!user || user.authMode !== "account" || (user.role !== "teacher" && user.role !== "admin")) throw new Error("Bạn không có quyền chỉnh sửa nội dung bài học.");
  if (!id.safeParse(lessonId).success) throw new Error("Bài học không hợp lệ.");
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new Error("Hệ thống chưa cấu hình đầy đủ.");
  const { data: lesson } = await supabase.from("lessons").select("id, slug").eq("id", lessonId).maybeSingle();
  if (!lesson) throw new Error("Không tìm thấy bài học.");
  return { user, supabase, lesson };
}

function done(slug: string, message: string): ContentResult {
  for (const base of ["/teacher/curriculum", "/admin/curriculum", "/student/lessons"]) revalidatePath(`${base}/${slug}`);
  revalidatePath(`/teacher/curriculum/${slug}/edit`);
  return { ok: true, message };
}

async function run(fn: () => Promise<ContentResult>): Promise<ContentResult> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof Error && !("digest" in e)) return { ok: false, message: e.message };
    throw e;
  }
}

export async function saveObjectiveAction(lessonId: string, objectiveId: string | null, input: z.input<typeof objectiveSchema>) {
  return run(async () => {
    const { user, supabase, lesson } = await ctx(lessonId);
    const parsed = objectiveSchema.safeParse(input);
    if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
    if (objectiveId) {
      if (!id.safeParse(objectiveId).success) return { ok: false, message: "Dữ liệu không hợp lệ." };
      const { error } = await supabase.from("learning_objectives").update(parsed.data).eq("id", objectiveId).eq("lesson_id", lessonId);
      if (error) throw new Error("Không lưu được.");
    } else {
      const { data: last } = await supabase.from("learning_objectives").select("sort_order").eq("lesson_id", lessonId).order("sort_order", { ascending: false }).limit(1).maybeSingle();
      const { error } = await supabase.from("learning_objectives").insert({ ...parsed.data, lesson_id: lessonId, sort_order: (last?.sort_order ?? 0) + 1, created_by: user.id });
      if (error) throw new Error("Không thêm được.");
    }
    return done(lesson.slug, "Đã lưu.");
  });
}

export async function deleteObjectiveAction(lessonId: string, objectiveId: string) {
  return run(async () => {
    const { supabase, lesson } = await ctx(lessonId);
    if (!id.safeParse(objectiveId).success) return { ok: false, message: "Dữ liệu không hợp lệ." };
    const { error } = await supabase.from("learning_objectives").delete().eq("id", objectiveId).eq("lesson_id", lessonId);
    if (error) throw new Error("Không xoá được.");
    return done(lesson.slug, "Đã xoá.");
  });
}

export async function saveMaterialAction(lessonId: string, materialId: string | null, input: MaterialInput) {
  return run(async () => {
    const { user, supabase, lesson } = await ctx(lessonId);
    const parsed = materialSchema.safeParse({ ...input, body: input.body?.trim() || null, url: input.url?.trim() || null });
    if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
    if (materialId) {
      if (!id.safeParse(materialId).success) return { ok: false, message: "Dữ liệu không hợp lệ." };
      const { error } = await supabase.from("lesson_materials").update(parsed.data).eq("id", materialId).eq("lesson_id", lessonId);
      if (error) throw new Error("Không lưu được học liệu.");
    } else {
      const { data: last } = await supabase.from("lesson_materials").select("sort_order").eq("lesson_id", lessonId).order("sort_order", { ascending: false }).limit(1).maybeSingle();
      const { error } = await supabase.from("lesson_materials").insert({ ...parsed.data, lesson_id: lessonId, sort_order: (last?.sort_order ?? 0) + 1, created_by: user.id });
      if (error) throw new Error("Không thêm được học liệu.");
    }
    return done(lesson.slug, materialId ? "Đã lưu học liệu." : "Đã thêm học liệu.");
  });
}

export async function deleteMaterialAction(lessonId: string, materialId: string) {
  return run(async () => {
    const { supabase, lesson } = await ctx(lessonId);
    if (!id.safeParse(materialId).success) return { ok: false, message: "Dữ liệu không hợp lệ." };
    const { error } = await supabase.from("lesson_materials").delete().eq("id", materialId).eq("lesson_id", lessonId);
    if (error) throw new Error("Không xoá được học liệu.");
    return done(lesson.slug, "Đã xoá học liệu.");
  });
}

/** Đổi chỗ một học liệu với học liệu liền trước/sau trong cùng khu vực. */
export async function moveMaterialAction(lessonId: string, materialId: string, dir: -1 | 1) {
  return run(async () => {
    const { supabase, lesson } = await ctx(lessonId);
    const { data: cur } = await supabase.from("lesson_materials").select("id, section").eq("id", materialId).eq("lesson_id", lessonId).maybeSingle();
    if (!cur) return { ok: false, message: "Không tìm thấy học liệu." };
    const { data: list } = await supabase.from("lesson_materials").select("id").eq("lesson_id", lessonId).eq("section", cur.section).order("sort_order").order("created_at");
    const ids = (list ?? []).map((m) => m.id);
    const i = ids.indexOf(materialId);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= ids.length) return { ok: true, message: "" };
    [ids[i], ids[j]] = [ids[j], ids[i]];
    const results = await Promise.all(ids.map((mid, k) => supabase.from("lesson_materials").update({ sort_order: k + 1 }).eq("id", mid)));
    if (results.some((r) => r.error)) throw new Error("Không sắp xếp được.");
    return done(lesson.slug, "Đã sắp xếp.");
  });
}
