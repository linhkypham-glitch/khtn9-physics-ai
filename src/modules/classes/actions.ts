"use server";

import { revalidatePath } from "next/cache";

import { normalizeClassName } from "@/lib/auth/student-session";
import { parseRosterWorkbook } from "@/lib/excel/class-roster";
import { classNameSchema, fullNameSchema } from "@/lib/validation/auth";
import {
  authorizeClassManager,
  createOrGetClass,
  createStudentInClass,
  listClassStudents,
  requireAdminClient,
  requireStaffAccount,
  ServiceError,
} from "./service";
import { normalizePersonName } from "@/lib/auth/student-session";

export type ActionState = { ok: boolean; message: string | null };

function fail(e: unknown): ActionState {
  if (e instanceof ServiceError) return { ok: false, message: e.message };
  console.error("[classes/actions]", e);
  return { ok: false, message: "Đã xảy ra lỗi, vui lòng thử lại." };
}

export async function createClassAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = classNameSchema.safeParse(formData.get("name"));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  try {
    const user = await requireStaffAccount();
    const cls = await createOrGetClass(requireAdminClient(), parsed.data, user);
    revalidatePath("/teacher", "layout");
    return { ok: true, message: cls.created ? `Đã tạo lớp ${cls.name}.` : `Lớp ${cls.name} đã có – bạn đã được thêm làm giáo viên của lớp.` };
  } catch (e) {
    return fail(e);
  }
}

export async function claimClassAction(classId: string): Promise<ActionState> {
  try {
    const user = await requireStaffAccount();
    const admin = requireAdminClient();
    const { data: teachers } = await admin.from("class_members").select("user_id").eq("class_id", classId).eq("member_role", "teacher");
    if ((teachers ?? []).length > 0 && user.role !== "admin") throw new ServiceError("Lớp này đã có giáo viên phụ trách.");
    const res = await admin.from("class_members").upsert({ class_id: classId, user_id: user.id, member_role: "teacher" });
    if (res.error) throw new ServiceError("Không nhận được lớp.");
    revalidatePath("/teacher", "layout");
    return { ok: true, message: "Đã nhận lớp." };
  } catch (e) {
    return fail(e);
  }
}

export async function setSelfJoinAction(classId: string, allow: boolean): Promise<ActionState> {
  try {
    await authorizeClassManager(classId);
    const res = await requireAdminClient().from("classes").update({ allow_self_join: allow }).eq("id", classId);
    if (res.error) throw new ServiceError("Không cập nhật được cài đặt lớp.");
    revalidatePath(`/teacher/classes/${classId}`);
    return { ok: true, message: allow ? "Học sinh mới có thể tự vào lớp." : "Đã khoá: chỉ học sinh có trong danh sách mới vào được." };
  } catch (e) {
    return fail(e);
  }
}

export async function addStudentAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const classId = String(formData.get("classId") ?? "");
  const parsed = fullNameSchema.safeParse(formData.get("fullName"));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  try {
    const { cls } = await authorizeClassManager(classId);
    const admin = requireAdminClient();
    const existing = await listClassStudents(admin, classId);
    if (existing.some((s) => normalizePersonName(s.fullName) === normalizePersonName(parsed.data))) {
      return { ok: false, message: `Lớp ${cls.name} đã có học sinh tên "${parsed.data}".` };
    }
    const s = await createStudentInClass(admin, {
      classId,
      fullName: parsed.data,
      studentCode: String(formData.get("studentCode") ?? "").slice(0, 30),
      schoolId: cls.school_id,
    });
    revalidatePath(`/teacher/classes/${classId}`);
    return { ok: true, message: `Đã thêm ${s.fullName} vào lớp ${cls.name}.` };
  } catch (e) {
    return fail(e);
  }
}

export async function removeStudentAction(classId: string, studentId: string): Promise<ActionState> {
  try {
    await authorizeClassManager(classId);
    const res = await requireAdminClient()
      .from("class_members")
      .delete()
      .eq("class_id", classId)
      .eq("user_id", studentId)
      .eq("member_role", "student");
    if (res.error) throw new ServiceError("Không xoá được học sinh khỏi lớp.");
    revalidatePath(`/teacher/classes/${classId}`);
    return { ok: true, message: "Đã xoá học sinh khỏi lớp (kết quả học tập vẫn được lưu)." };
  } catch (e) {
    return fail(e);
  }
}

export type ImportResult = ActionState & {
  summary?: { className: string; added: number; skipped: number; createdClass: boolean }[];
  errors?: string[];
};

/** Tải lên Excel: tạo lớp (nếu chưa có) và danh sách học sinh. */
export async function importRosterAction(_prev: ImportResult, formData: FormData): Promise<ImportResult> {
  const file = formData.get("file");
  const defaultClass = String(formData.get("className") ?? "").trim();
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "Vui lòng chọn file Excel (.xlsx)." };
  if (file.size > 2 * 1024 * 1024) return { ok: false, message: "File quá lớn (tối đa 2 MB)." };
  if (!/\.xlsx$/i.test(file.name)) return { ok: false, message: "Chỉ hỗ trợ file Excel .xlsx." };

  try {
    const user = await requireStaffAccount();
    const admin = requireAdminClient();
    const parsed = await parseRosterWorkbook(await file.arrayBuffer());
    if (parsed.rows.length === 0) {
      return { ok: false, message: parsed.errors[0] ?? "File không có học sinh nào.", errors: parsed.errors };
    }

    const errors = [...parsed.errors];
    const groups = new Map<string, typeof parsed.rows>();
    for (const r of parsed.rows) {
      const cls = r.className ?? (defaultClass ? normalizeClassName(defaultClass) : null);
      if (!cls) {
        errors.push(`Dòng ${r.row}: thiếu tên lớp (điền cột "Lớp" hoặc nhập lớp mặc định).`);
        continue;
      }
      if (!classNameSchema.safeParse(cls).success) {
        errors.push(`Dòng ${r.row}: tên lớp "${cls}" không hợp lệ.`);
        continue;
      }
      const key = normalizeClassName(cls);
      groups.set(key, [...(groups.get(key) ?? []), r]);
    }

    const summary: NonNullable<ImportResult["summary"]> = [];
    for (const [className, rows] of groups) {
      const cls = await createOrGetClass(admin, className, user);
      const known = new Set((await listClassStudents(admin, cls.id)).map((s) => normalizePersonName(s.fullName)));
      let added = 0;
      let skipped = 0;
      for (const r of rows) {
        const key = normalizePersonName(r.fullName);
        if (known.has(key)) {
          skipped++;
          continue;
        }
        try {
          await createStudentInClass(admin, { classId: cls.id, fullName: r.fullName, studentCode: r.studentCode, schoolId: cls.schoolId });
          known.add(key);
          added++;
        } catch (e) {
          errors.push(`Dòng ${r.row}: ${e instanceof ServiceError ? e.message : "lỗi không xác định"}`);
        }
      }
      summary.push({ className: cls.name, added, skipped, createdClass: cls.created });
    }

    revalidatePath("/teacher", "layout");
    const total = summary.reduce((s, x) => s + x.added, 0);
    return { ok: true, message: `Đã thêm ${total} học sinh vào ${summary.length} lớp.`, summary, errors };
  } catch (e) {
    return fail(e);
  }
}
