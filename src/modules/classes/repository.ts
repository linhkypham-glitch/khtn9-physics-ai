import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ClassSummary = {
  id: string;
  name: string;
  grade: number;
  academicYear: string | null;
  schoolName: string | null;
  studentCount: number;
  teacherNames: string[];
};

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

type ClassWithMembers = {
  id: string;
  name: string;
  grade: number;
  academic_years: { name: string } | null;
  schools: { name: string } | null;
  class_members: { member_role: "teacher" | "student"; profiles: { full_name: string } | null }[];
};

function toSummary(c: ClassWithMembers): ClassSummary {
  return {
    id: c.id,
    name: c.name,
    grade: c.grade,
    academicYear: c.academic_years?.name ?? null,
    schoolName: c.schools?.name ?? null,
    studentCount: c.class_members.filter((m) => m.member_role === "student").length,
    teacherNames: c.class_members
      .filter((m) => m.member_role === "teacher")
      .map((m) => m.profiles?.full_name ?? "")
      .filter(Boolean),
  };
}

const CLASS_SELECT =
  "id, name, grade, academic_years(name), schools(name), class_members(member_role, profiles(full_name))";

/**
 * Danh sách lớp mà người dùng hiện tại được phép xem.
 * RLS quyết định phạm vi: admin → mọi lớp; giáo viên → lớp được phân công.
 */
export async function listVisibleClasses(): Promise<Result<ClassSummary[]>> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Supabase chưa được cấu hình." };

  const { data, error } = await supabase.from("classes").select(CLASS_SELECT).eq("is_active", true).order("name");
  if (error) {
    console.error("[classes] listVisibleClasses", error);
    return { ok: false, error: "Không tải được danh sách lớp." };
  }
  return { ok: true, data: (data as unknown as ClassWithMembers[]).map(toSummary) };
}

/** Lớp của học sinh hiện tại (học sinh chỉ thấy dòng thành viên của chính mình + GV lớp). */
export async function getStudentClasses(userId: string): Promise<Result<{ id: string; name: string; academicYear: string | null; teacherNames: string[] }[]>> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Supabase chưa được cấu hình." };

  const { data: memberships, error } = await supabase
    .from("class_members")
    .select("class_id, classes(id, name, academic_years(name))")
    .eq("user_id", userId)
    .eq("member_role", "student");
  if (error) {
    console.error("[classes] getStudentClasses", error);
    return { ok: false, error: "Không tải được thông tin lớp." };
  }

  const classIds = (memberships ?? []).map((m) => m.class_id);
  // Tên giáo viên: hàm RLS is_my_teacher cho phép học sinh đọc hồ sơ GV của lớp mình.
  const { data: teachers, error: tErr } = classIds.length
    ? await supabase.rpc("get_class_teachers", { p_class_ids: classIds })
    : { data: [], error: null };
  if (tErr) {
    console.error("[classes] get_class_teachers", tErr);
    return { ok: false, error: "Không tải được thông tin giáo viên." };
  }

  return {
    ok: true,
    data: (memberships ?? [])
      .filter((m) => m.classes)
      .map((m) => ({
        id: m.classes!.id,
        name: m.classes!.name,
        academicYear: m.classes!.academic_years?.name ?? null,
        teacherNames: (teachers ?? []).filter((t) => t.class_id === m.class_id).map((t) => t.full_name),
      })),
  };
}
