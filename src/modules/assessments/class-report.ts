import "server-only";

import { monthPeriod, semesterPeriods, weekPeriod, type Period } from "@/modules/leaderboard/logic";
import { aggregateDetails, loadQuestionMeta, ReportError, staffClient } from "./reports";
import { round2, scoreDistribution, supportFlag, type SupportFlag } from "./class-report-logic";

export type ReportPeriodKey = "week" | "month" | "hk1" | "hk2" | "all";
export const REPORT_PERIOD_KEYS: ReportPeriodKey[] = ["week", "month", "hk1", "hk2", "all"];

type RawDetail = { q: string; s: "correct" | "partial" | "wrong" | "blank"; e: number; m: number; cu?: number; tu?: number };
export type ClassPeriodReport = Awaited<ReturnType<typeof getClassPeriodReport>>;

/** Báo cáo tổng hợp một lớp theo tuần / tháng / học kì / cả năm (giáo viên phụ trách / admin). */
export async function getClassPeriodReport(classId: string, key: ReportPeriodKey, offset = 0) {
  const { supabase, admin } = await staffClient();
  const { data: cls } = await supabase.from("classes").select("id, name, academic_years(name, start_date, end_date)").eq("id", classId).maybeSingle();
  if (!cls) throw new ReportError("Không tìm thấy lớp hoặc bạn không phụ trách lớp này.");

  const semesters = cls.academic_years ? semesterPeriods(cls.academic_years.start_date, cls.academic_years.end_date) : [];
  const now = new Date();
  let period: Period | null = null;
  if (key === "week") period = weekPeriod(now, offset);
  else if (key === "month") {
    const base = monthPeriod(now);
    const [y, m] = base.key.split("-").map(Number);
    const d = new Date(Date.UTC(y, m - 1 - offset, 1));
    period = monthPeriod(now, `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`);
  } else if (key === "hk1" || key === "hk2") period = semesters.find((p) => p.key === key) ?? null;

  const [{ data: members }, { data: assignments }] = await Promise.all([
    admin.from("class_members").select("user_id, profiles!inner(full_name, student_code)").eq("class_id", classId).eq("member_role", "student"),
    admin.from("assessment_assignments").select("id, code, assessments(title)").eq("class_id", classId),
  ]);
  const studentIds = (members ?? []).map((m) => m.user_id);
  const asgIds = (assignments ?? []).map((a) => a.id);
  const none = ["00000000-0000-0000-0000-000000000000"];

  let aq = admin.from("assessment_attempts").select("user_id, assignment_id, score, submitted_at, correct_units, total_units, details").eq("status", "submitted").in("assignment_id", asgIds.length ? asgIds : none);
  let pq = admin.from("practice_attempts").select("user_id, score, submitted_at, details").eq("mode", "self_assessment").in("user_id", studentIds.length ? studentIds : none);
  let eq = admin.from("experiment_attempts").select("user_id, created_at").in("user_id", studentIds.length ? studentIds : none);
  if (period) {
    aq = aq.gte("submitted_at", period.from.toISOString()).lte("submitted_at", period.to.toISOString());
    pq = pq.gte("submitted_at", period.from.toISOString()).lte("submitted_at", period.to.toISOString());
    eq = eq.gte("created_at", period.from.toISOString()).lte("created_at", period.to.toISOString());
  }
  const [{ data: attempts }, { data: practice }, { data: labs }] = await Promise.all([aq.order("submitted_at"), pq, eq]);

  // điểm cao nhất của mỗi học sinh ở mỗi bài giao (trong kỳ)
  const best = new Map<string, Map<string, { score: number; at: string }>>();
  for (const a of attempts ?? []) {
    const m = best.get(a.user_id) ?? new Map();
    const prev = m.get(a.assignment_id);
    if (!prev || Number(a.score) > prev.score) m.set(a.assignment_id, { score: Number(a.score), at: a.submitted_at! });
    best.set(a.user_id, m);
  }

  const students = (members ?? [])
    .map((m) => {
      const tests = [...(best.get(m.user_id)?.values() ?? [])].sort((a, b) => a.at.localeCompare(b.at));
      const scores = tests.map((t) => t.score);
      const mine = (practice ?? []).filter((p) => p.user_id === m.user_id);
      const labRuns = (labs ?? []).filter((l) => l.user_id === m.user_id).length;
      const avg = scores.length ? round2(scores.reduce((s, x) => s + x, 0) / scores.length) : null;
      const first = scores[0] ?? null;
      const last = scores.at(-1) ?? null;
      const flag: SupportFlag = supportFlag({ tests: scores.length, practice: mine.length, labRuns, avg, first, last });
      return {
        id: m.user_id,
        fullName: m.profiles.full_name,
        studentCode: m.profiles.student_code,
        tests: scores.length,
        avg,
        first,
        last,
        practice: mine.length,
        practiceAvg: mine.length ? round2(mine.reduce((s, p) => s + Number(p.score), 0) / mine.length) : null,
        labRuns,
        flag,
      };
    })
    .sort((a, b) => a.fullName.split(" ").at(-1)!.localeCompare(b.fullName.split(" ").at(-1)!, "vi"));

  const avgs = students.flatMap((s) => (s.avg === null ? [] : [s.avg]));
  const active = students.filter((s) => s.tests + s.practice + s.labRuns > 0).length;

  // thống kê từng bài giao có bài nộp trong kỳ
  const perAssignment = (assignments ?? [])
    .map((a) => {
      const sc = [...best.values()].flatMap((m) => (m.has(a.id) ? [m.get(a.id)!.score] : []));
      return { id: a.id, title: a.assessments?.title ?? "", code: a.code, submitted: sc.length, total: students.length, avg: sc.length ? round2(sc.reduce((s, x) => s + x, 0) / sc.length) : null };
    })
    .filter((a) => a.submitted > 0);

  // tỉ lệ đúng theo chương/mức độ/dạng câu (bài kiểm tra + tự đánh giá trong kỳ)
  const details: RawDetail[] = [
    ...(attempts ?? []).flatMap((a) => (a.details as RawDetail[]) ?? []),
    ...(practice ?? []).flatMap((p) => (p.details as RawDetail[]) ?? []),
  ];
  const meta = await loadQuestionMeta(details.map((d) => d.q));
  const groups = aggregateDetails(details, meta);

  return {
    classId,
    className: cls.name,
    periodLabel: period?.label ?? "Cả năm học",
    academicYear: cls.academic_years?.name ?? "",
    semesters: semesters.map((p) => ({ key: p.key, label: p.label })),
    summary: {
      students: students.length,
      active,
      testTakers: students.filter((s) => s.tests > 0).length,
      classAvg: avgs.length ? round2(avgs.reduce((s, x) => s + x, 0) / avgs.length) : null,
      practiceCount: students.reduce((s, x) => s + x.practice, 0),
      labRuns: students.reduce((s, x) => s + x.labRuns, 0),
    },
    distribution: scoreDistribution(avgs),
    students,
    perAssignment,
    groups,
  };
}
