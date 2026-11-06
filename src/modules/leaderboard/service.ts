import "server-only";

import type { CurrentUser } from "@/lib/auth/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { monthPeriod, rankEntries, semesterPeriods, type Period, type Ranked } from "./logic";

export class LeaderboardError extends Error {}

function admin() {
  const a = createSupabaseAdminClient();
  if (!a) throw new LeaderboardError("Hệ thống chưa cấu hình đầy đủ.");
  return a;
}

/** Cài đặt toàn hệ thống (quản trị viên): cho phép học sinh xem bảng xếp hạng. */
export async function isLeaderboardEnabledGlobally() {
  const { data } = await admin().from("system_settings").select("value").eq("key", "leaderboard.enabled").maybeSingle();
  return data ? data.value === true : true;
}

async function canStaffSeeClass(user: CurrentUser, classId: string) {
  if (user.authMode !== "account" || (user.role !== "teacher" && user.role !== "admin")) return false;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase!.from("classes").select("id").eq("id", classId).maybeSingle();
  return Boolean(data);
}

async function isStudentOf(userId: string, classId: string) {
  const { data } = await admin().from("class_members").select("user_id").eq("class_id", classId).eq("user_id", userId).eq("member_role", "student").maybeSingle();
  return Boolean(data);
}

/** Bảng xếp hạng một bài giao: điểm cao nhất của mỗi học sinh. */
export async function assignmentLeaderboard(user: CurrentUser, assignmentId: string): Promise<{ title: string; className: string; rows: Ranked[] }> {
  const db = admin();
  const { data: asg } = await db.from("assessment_assignments").select("id, class_id, show_leaderboard, classes(name), assessments(title)").eq("id", assignmentId).maybeSingle();
  if (!asg) throw new LeaderboardError("Không tìm thấy bài giao.");
  const staff = await canStaffSeeClass(user, asg.class_id);
  if (!staff) {
    if (user.role !== "student" || !(await isStudentOf(user.id, asg.class_id))) throw new LeaderboardError("Bạn không xem được bảng xếp hạng này.");
    if (!asg.show_leaderboard || !(await isLeaderboardEnabledGlobally())) throw new LeaderboardError("Giáo viên chưa công bố bảng xếp hạng của bài này.");
  }
  const { data: attempts } = await db
    .from("assessment_attempts")
    .select("user_id, score, started_at, submitted_at, correct_units, total_units, profiles(full_name)")
    .eq("assignment_id", assignmentId)
    .eq("status", "submitted");
  const best = new Map<string, Ranked | (Omit<Ranked, "rank"> & { rank?: number })>();
  for (const a of attempts ?? []) {
    const score = Number(a.score);
    const dur = a.submitted_at ? Math.round((new Date(a.submitted_at).getTime() - new Date(a.started_at).getTime()) / 1000) : null;
    const prev = best.get(a.user_id);
    if (!prev || score > prev.score || (score === prev.score && (dur ?? 1e12) < (prev.durationSeconds ?? 1e12))) {
      best.set(a.user_id, { id: a.user_id, name: a.profiles?.full_name ?? "", className: asg.classes?.name ?? "", score, durationSeconds: dur, correctUnits: a.correct_units, totalUnits: a.total_units });
    }
  }
  return { title: asg.assessments?.title ?? "", className: asg.classes?.name ?? "", rows: rankEntries([...best.values()]) };
}

export type ClassPeriodKey = "all" | "month" | "hk1" | "hk2";

/** Bảng xếp hạng lớp: điểm trung bình các bài kiểm tra (điểm cao nhất mỗi bài) trong khoảng thời gian. */
export async function classLeaderboard(user: CurrentUser, classId: string, periodKey: ClassPeriodKey, ym?: string) {
  const db = admin();
  const { data: cls } = await db.from("classes").select("id, name, show_leaderboard, academic_years(start_date, end_date)").eq("id", classId).maybeSingle();
  if (!cls) throw new LeaderboardError("Không tìm thấy lớp.");
  const staff = await canStaffSeeClass(user, classId);
  if (!staff) {
    if (user.role !== "student" || !(await isStudentOf(user.id, classId))) throw new LeaderboardError("Bạn không xem được bảng xếp hạng này.");
    if (!cls.show_leaderboard || !(await isLeaderboardEnabledGlobally())) throw new LeaderboardError("Giáo viên chưa công bố bảng xếp hạng của lớp.");
  }
  const periods: Period[] = cls.academic_years ? semesterPeriods(cls.academic_years.start_date, cls.academic_years.end_date) : [];
  const period: Period | null =
    periodKey === "month" ? monthPeriod(new Date(), ym) : periodKey === "hk1" || periodKey === "hk2" ? (periods.find((p) => p.key === periodKey) ?? null) : null;

  const [{ data: members }, { data: assignments }] = await Promise.all([
    db.from("class_members").select("user_id, profiles(full_name)").eq("class_id", classId).eq("member_role", "student"),
    db.from("assessment_assignments").select("id").eq("class_id", classId),
  ]);
  const ids = (assignments ?? []).map((a) => a.id);
  let q = db.from("assessment_attempts").select("user_id, assignment_id, score, started_at, submitted_at, correct_units, total_units").eq("status", "submitted");
  q = ids.length ? q.in("assignment_id", ids) : q.eq("assignment_id", "00000000-0000-0000-0000-000000000000");
  if (period) q = q.gte("submitted_at", period.from.toISOString()).lte("submitted_at", period.to.toISOString());
  const { data: attempts } = await q;

  // điểm cao nhất của mỗi học sinh ở mỗi bài giao
  const perStudent = new Map<string, Map<string, { score: number; dur: number; cu: number; tu: number }>>();
  for (const a of attempts ?? []) {
    const m = perStudent.get(a.user_id) ?? new Map();
    const dur = a.submitted_at ? Math.round((new Date(a.submitted_at).getTime() - new Date(a.started_at).getTime()) / 1000) : 0;
    const prev = m.get(a.assignment_id);
    if (!prev || Number(a.score) > prev.score) m.set(a.assignment_id, { score: Number(a.score), dur, cu: a.correct_units ?? 0, tu: a.total_units ?? 0 });
    perStudent.set(a.user_id, m);
  }
  const rows = (members ?? [])
    .filter((m) => perStudent.has(m.user_id))
    .map((m) => {
      const tests = [...perStudent.get(m.user_id)!.values()];
      const avg = tests.reduce((s, t) => s + t.score, 0) / tests.length;
      return {
        id: m.user_id,
        name: m.profiles?.full_name ?? "",
        className: cls.name,
        score: Math.round(avg * 100) / 100,
        durationSeconds: tests.reduce((s, t) => s + t.dur, 0),
        correctUnits: tests.reduce((s, t) => s + t.cu, 0),
        totalUnits: tests.reduce((s, t) => s + t.tu, 0),
        count: tests.length,
      };
    });
  return {
    className: cls.name,
    periodLabel: period?.label ?? "Cả năm học",
    semesters: periods.map((p) => ({ key: p.key, label: p.label })),
    rows: rankEntries(rows),
  };
}

/** Danh sách bài giao học sinh xem được bảng xếp hạng + lớp của học sinh (đã bật công khai). */
export async function studentLeaderboardOptions(userId: string) {
  const db = admin();
  const enabled = await isLeaderboardEnabledGlobally();
  const { data: memberships } = await db.from("class_members").select("class_id, classes(id, name, show_leaderboard)").eq("user_id", userId).eq("member_role", "student");
  const classIds = (memberships ?? []).map((m) => m.class_id);
  const { data: asg } = classIds.length
    ? await db.from("assessment_assignments").select("id, code, classes(name), assessments(title)").in("class_id", classIds).eq("show_leaderboard", true).order("created_at", { ascending: false })
    : { data: [] };
  return {
    enabled,
    classes: enabled ? (memberships ?? []).filter((m) => m.classes?.show_leaderboard).map((m) => ({ id: m.class_id, name: m.classes!.name })) : [],
    assignments: enabled ? (asg ?? []).map((a) => ({ id: a.id, title: a.assessments?.title ?? "", className: a.classes?.name ?? "" })) : [],
  };
}
