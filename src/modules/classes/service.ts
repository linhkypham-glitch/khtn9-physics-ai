import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { internalStudentEmail, unusablePassword } from "@/lib/auth/student-account";
import { getCurrentUser, type CurrentUser } from "@/lib/auth/session";
import { normalizeClassName, normalizePersonName, titleCaseName } from "@/lib/auth/student-session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type Admin = SupabaseClient<Database>;

export class ServiceError extends Error {}

/** Client service-role; báo lỗi rõ ràng nếu chưa cấu hình SUPABASE_SECRET_KEY. */
export function requireAdminClient(): Admin {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    throw new ServiceError("Máy chủ chưa cấu hình SUPABASE_SECRET_KEY. Vui lòng liên hệ quản trị viên.");
  }
  return admin;
}

/** Bảo đảm có trường và năm học hiện hành (tự tạo nếu hệ thống mới cài đặt). */
export async function ensureSchoolContext(admin: Admin, now = new Date()) {
  let { data: school } = await admin.from("schools").select("id").order("created_at").limit(1).maybeSingle();
  if (!school) {
    const res = await admin.from("schools").insert({ code: "TRUONG", name: "Trường của tôi" }).select("id").single();
    if (res.error) throw new ServiceError("Không tạo được thông tin trường.");
    school = res.data;
  }

  const { data: year } = await admin
    .from("academic_years")
    .select("id")
    .eq("school_id", school.id)
    .eq("is_current", true)
    .maybeSingle();
  if (year) return { schoolId: school.id, academicYearId: year.id };

  // Năm học bắt đầu tháng 9: từ tháng 8 trở đi tính là năm học mới
  const startYear = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  const created = await admin
    .from("academic_years")
    .upsert(
      {
        school_id: school.id,
        name: `${startYear}-${startYear + 1}`,
        start_date: `${startYear}-09-05`,
        end_date: `${startYear + 1}-05-31`,
        is_current: true,
      },
      { onConflict: "school_id,name" },
    )
    .select("id")
    .single();
  if (created.error) throw new ServiceError("Không tạo được năm học.");
  return { schoolId: school.id, academicYearId: created.data.id };
}

/** Tìm lớp theo tên trong năm học hiện tại (không phân biệt hoa thường, bỏ khoảng trắng). */
export async function findClassByName(admin: Admin, academicYearId: string, rawName: string) {
  const name = normalizeClassName(rawName);
  const { data } = await admin
    .from("classes")
    .select("id, name, allow_self_join, is_active")
    .eq("academic_year_id", academicYearId)
    .ilike("name", name.replace(/[%_]/g, "\\$&"))
    .maybeSingle();
  return data;
}

/**
 * Tạo lớp mới (hoặc lấy lớp đã có cùng tên trong năm học hiện tại).
 * `teacher` = người tạo (GV/admin) → tự động là giáo viên của lớp; null khi học sinh tạo lớp mới.
 */
export async function createOrGetClass(admin: Admin, rawName: string, teacher: CurrentUser | null) {
  const ctx = await ensureSchoolContext(admin);
  const name = normalizeClassName(rawName);
  const existing = await findClassByName(admin, ctx.academicYearId, name);

  if (existing) {
    if (teacher) {
      const { data: teachers } = await admin
        .from("class_members")
        .select("user_id")
        .eq("class_id", existing.id)
        .eq("member_role", "teacher");
      const list = teachers ?? [];
      const isMine = list.some((t) => t.user_id === teacher.id);
      if (!isMine && list.length > 0 && teacher.role !== "admin") {
        throw new ServiceError(`Lớp ${existing.name} đã có giáo viên khác phụ trách. Vui lòng liên hệ quản trị viên.`);
      }
      if (!isMine) await admin.from("class_members").insert({ class_id: existing.id, user_id: teacher.id, member_role: "teacher" });
    }
    return { id: existing.id, name: existing.name, allowSelfJoin: existing.allow_self_join, created: false, schoolId: ctx.schoolId };
  }

  const res = await admin
    .from("classes")
    .insert({ name, school_id: ctx.schoolId, academic_year_id: ctx.academicYearId, created_by: teacher?.id ?? null })
    .select("id, name, allow_self_join")
    .single();
  if (res.error) {
    console.error("[classes] create", res.error);
    throw new ServiceError("Không tạo được lớp.");
  }
  if (teacher) await admin.from("profiles").update({ school_id: ctx.schoolId }).eq("id", teacher.id).is("school_id", null);
  return { id: res.data.id, name: res.data.name, allowSelfJoin: res.data.allow_self_join, created: true, schoolId: ctx.schoolId };
}

/** Danh sách học sinh của lớp (id, họ tên). */
export async function listClassStudents(admin: Admin, classId: string) {
  const { data, error } = await admin
    .from("class_members")
    .select("user_id, joined_at, profiles!inner(id, full_name, student_code, is_active, role)")
    .eq("class_id", classId)
    .eq("member_role", "student");
  if (error) throw new ServiceError("Không tải được danh sách học sinh.");
  return (data ?? []).map((m) => ({
    id: m.user_id,
    fullName: m.profiles.full_name,
    studentCode: m.profiles.student_code,
    isActive: m.profiles.is_active,
    joinedAt: m.joined_at,
  }));
}

/** Tạo hồ sơ học sinh (tài khoản nội bộ, không mật khẩu) và xếp vào lớp. */
export async function createStudentInClass(
  admin: Admin,
  input: { classId: string; fullName: string; studentCode?: string | null; schoolId?: string | null },
) {
  const fullName = titleCaseName(input.fullName);
  const studentCode = input.studentCode?.trim() || null;
  const { data, error } = await admin.auth.admin.createUser({
    email: internalStudentEmail(),
    password: unusablePassword(),
    email_confirm: true,
    app_metadata: { role: "student", ...(studentCode ? { student_code: studentCode } : {}) },
    user_metadata: { full_name: fullName },
  });
  if (error || !data.user) {
    console.error("[classes] createUser", error);
    throw new ServiceError(
      studentCode
        ? `Không tạo được hồ sơ cho ${fullName} (mã học sinh "${studentCode}" có thể đã tồn tại).`
        : `Không tạo được hồ sơ cho ${fullName}.`,
    );
  }
  const userId = data.user.id;
  const member = await admin.from("class_members").insert({ class_id: input.classId, user_id: userId, member_role: "student" });
  if (member.error) {
    await admin.auth.admin.deleteUser(userId);
    throw new ServiceError("Không xếp được học sinh vào lớp.");
  }
  if (input.schoolId) await admin.from("profiles").update({ school_id: input.schoolId }).eq("id", userId);
  return { id: userId, fullName, studentCode };
}

/**
 * HỌC SINH VÀO HỌC: họ tên + lớp.
 * - Lớp chưa có → tạo lớp mới (mọi học sinh nhập cùng tên lớp được xếp chung).
 * - Học sinh cùng họ tên đã có trong lớp → dùng lại hồ sơ cũ (giữ kết quả học tập).
 * - Lớp đã khoá tự đăng ký → chỉ học sinh có sẵn trong danh sách mới vào được.
 */
export async function enterClassAsStudent(rawFullName: string, rawClassName: string) {
  const admin = requireAdminClient();
  const cls = await createOrGetClass(admin, rawClassName, null);
  const wanted = normalizePersonName(rawFullName);

  const students = await listClassStudents(admin, cls.id);
  const matches = students.filter((s) => normalizePersonName(s.fullName) === wanted);
  if (matches.length > 0) {
    const active = matches.find((m) => m.isActive);
    if (!active) throw new ServiceError("Hồ sơ của bạn đã bị khoá. Vui lòng liên hệ giáo viên.");
    return { studentId: active.id, className: cls.name, isNew: false };
  }
  if (!cls.allowSelfJoin) {
    throw new ServiceError(
      `Lớp ${cls.name} chỉ cho phép học sinh có tên trong danh sách. Hãy kiểm tra lại họ tên hoặc liên hệ giáo viên.`,
    );
  }
  const created = await createStudentInClass(admin, { classId: cls.id, fullName: rawFullName, schoolId: cls.schoolId });
  return { studentId: created.id, className: cls.name, isNew: true };
}

/**
 * Kiểm tra người dùng hiện tại được quản lý lớp (admin, hoặc giáo viên của lớp).
 * Truy vấn qua client của người dùng → RLS cũng được áp dụng.
 */
export async function authorizeClassManager(classId: string) {
  const user = await getCurrentUser();
  if (!user || user.authMode !== "account" || (user.role !== "teacher" && user.role !== "admin")) {
    throw new ServiceError("Bạn không có quyền thực hiện thao tác này.");
  }
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new ServiceError("Supabase chưa được cấu hình.");
  const { data: cls } = await supabase.from("classes").select("id, name, school_id").eq("id", classId).maybeSingle();
  if (!cls) throw new ServiceError("Không tìm thấy lớp hoặc bạn không phụ trách lớp này.");
  if (user.role !== "admin") {
    const { data: membership } = await supabase
      .from("class_members")
      .select("user_id")
      .eq("class_id", classId)
      .eq("user_id", user.id)
      .eq("member_role", "teacher")
      .maybeSingle();
    if (!membership) throw new ServiceError("Bạn không phụ trách lớp này.");
  }
  return { user, cls };
}

/** Giáo viên / admin đã đăng nhập bằng tài khoản. */
export async function requireStaffAccount() {
  const user = await getCurrentUser();
  if (!user || user.authMode !== "account" || (user.role !== "teacher" && user.role !== "admin")) {
    throw new ServiceError("Bạn không có quyền thực hiện thao tác này.");
  }
  return user;
}
