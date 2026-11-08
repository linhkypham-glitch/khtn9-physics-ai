import ExcelJS from "exceljs";

import type { ClassPeriodReport } from "@/modules/assessments/class-report";
import { SUPPORT_LABEL } from "@/modules/assessments/class-report-logic";
import type { AssignmentReport, StudentReport } from "@/modules/assessments/reports";

const STATUS: Record<string, string> = { submitted: "Đã nộp", in_progress: "Đang làm", not_started: "Chưa làm" };
const RESULT: Record<string, string> = { correct: "Đúng", partial: "Đúng một phần", wrong: "Sai", blank: "Bỏ trống", pending: "Chờ chấm" };
const dt = (s: string | null) => (s ? new Date(s).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) : "");
const dur = (s: number | null) => (s === null ? "" : `${Math.floor(s / 60)} phút ${s % 60} giây`);
const pct = (c: number, t: number) => (t ? Math.round((c / t) * 1000) / 10 : null);

function styleSheet(ws: ExcelJS.Worksheet, titleRows = 0) {
  const header = ws.getRow(titleRows + 1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEA580C" } };
  header.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  header.height = 24;
  ws.views = [{ state: "frozen", ySplit: titleRows + 1 }];
  ws.eachRow((row, n) => {
    if (n > titleRows + 1) row.alignment = { vertical: "top", wrapText: true };
  });
}

/** Báo cáo một bài giao: 4 sheet BANG_DIEM, CHI_TIET_BAI_LAM, THONG_KE_LOP, PHAN_TICH_HOC_TAP. */
export async function buildAssignmentWorkbook(r: AssignmentReport): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "KHTN 9";

  const s1 = wb.addWorksheet("BANG_DIEM");
  s1.columns = [
    { header: "STT", key: "stt", width: 6 },
    { header: "Mã học sinh", key: "code", width: 16 },
    { header: "Họ và tên", key: "name", width: 28 },
    { header: "Lớp", key: "cls", width: 8 },
    { header: "Trạng thái", key: "status", width: 12 },
    { header: "Điểm (thang 10)", key: "score", width: 14 },
    { header: "Số ý đúng", key: "units", width: 12 },
    { header: "Số lần làm", key: "attempts", width: 11 },
    { header: "Thời gian làm bài", key: "time", width: 18 },
    { header: "Ngày làm bài", key: "date", width: 22 },
  ];
  r.students.forEach((s, i) =>
    s1.addRow({
      stt: i + 1,
      code: s.studentCode ?? "",
      name: s.fullName,
      cls: r.assignment.className,
      status: STATUS[s.status],
      score: s.score,
      units: s.correctUnits === null ? "" : `${s.correctUnits}/${s.totalUnits}`,
      attempts: s.attempts,
      time: dur(s.durationSeconds),
      date: dt(s.submittedAt),
    }),
  );
  s1.getColumn("score").numFmt = "0.00";
  styleSheet(s1);

  const s2 = wb.addWorksheet("CHI_TIET_BAI_LAM");
  s2.columns = [
    { header: "Học sinh", key: "name", width: 26 },
    { header: "Câu", key: "idx", width: 6 },
    { header: "Câu hỏi", key: "q", width: 60 },
    { header: "Đáp án học sinh", key: "a", width: 26 },
    { header: "Đáp án đúng", key: "c", width: 26 },
    { header: "Kết quả", key: "res", width: 14 },
    { header: "Điểm câu hỏi", key: "pts", width: 14 },
  ];
  const qIndex = new Map(r.questionStats.map((q) => [q.id, q]));
  for (const s of r.students.filter((x) => x.status === "submitted")) {
    for (const d of s.details) {
      const q = qIndex.get(d.q);
      s2.addRow({ name: s.fullName, idx: q?.index ?? "", q: q?.content ?? "", a: d.a ?? "", c: d.c ?? "", res: RESULT[d.s], pts: `${d.e}/${d.m}` });
    }
  }
  styleSheet(s2);

  const s3 = wb.addWorksheet("THONG_KE_LOP");
  s3.columns = [
    { header: "Chỉ số", key: "k", width: 36 },
    { header: "Giá trị", key: "v", width: 40 },
  ];
  const st = r.stats;
  [
    ["Bài kiểm tra", r.assignment.title],
    ["Mã bài giao", r.assignment.code],
    ["Lớp", r.assignment.className],
    ["Hạn nộp", dt(r.assignment.dueAt)],
    ["Sĩ số", st.total],
    ["Đã nộp bài", st.count],
    ["Tỷ lệ hoàn thành (%)", Math.round(st.completionRate * 10) / 10],
    ["Điểm trung bình", st.avg === null ? "" : Math.round(st.avg * 100) / 100],
    ["Điểm cao nhất", st.max ?? ""],
    ["Điểm thấp nhất", st.min ?? ""],
    ["Tỷ lệ đạt từ 5 điểm (%)", st.passRate === null ? "" : Math.round(st.passRate * 10) / 10],
    ["Phổ điểm (<5 / 5–6,4 / 6,5–7,9 / ≥8)", st.distribution.join(" / ")],
    ...r.groups.byType.map((g) => [`Tỷ lệ đúng – ${g.label} (%)`, pct(g.correct, g.total) ?? ""]),
    ...r.groups.byLevel.map((g) => [`Tỷ lệ đúng – mức ${g.label} (%)`, pct(g.correct, g.total) ?? ""]),
    ...r.groups.byChapter.map((g) => [`Tỷ lệ đúng – ${g.label} (%)`, pct(g.correct, g.total) ?? ""]),
  ].forEach(([k, v]) => s3.addRow({ k, v }));
  s3.addRow({});
  s3.addRow({ k: "TỶ LỆ ĐÚNG TỪNG CÂU", v: "" }).font = { bold: true };
  r.questionStats.forEach((q) => s3.addRow({ k: `Câu ${q.index} (${q.lesson}) – ${q.content.slice(0, 60)}`, v: q.correctRate === null ? "" : `${Math.round(q.correctRate)}%` }));
  styleSheet(s3);

  const s4 = wb.addWorksheet("PHAN_TICH_HOC_TAP");
  s4.columns = [
    { header: "Học sinh", key: "name", width: 26 },
    { header: "Chương", key: "chapter", width: 34 },
    { header: "Bài học", key: "lesson", width: 40 },
    { header: "Tỷ lệ đúng (%)", key: "rate", width: 14 },
    { header: "Nội dung mạnh", key: "strong", width: 36 },
    { header: "Nội dung cần cải thiện", key: "weak", width: 36 },
  ];
  const meta = new Map(r.questionStats.map((q) => [q.id, q]));
  for (const s of r.students.filter((x) => x.status === "submitted")) {
    const byLesson = new Map<string, { c: number; t: number }>();
    for (const d of s.details) {
      const q = meta.get(d.q);
      if (!q) continue;
      const t = d.tu ?? (q.type === "true_false" ? 4 : 1);
      const g = byLesson.get(q.lesson) ?? { c: 0, t: 0 };
      g.c += d.cu ?? (d.s === "correct" ? t : 0);
      g.t += t;
      byLesson.set(q.lesson, g);
    }
    const entries = [...byLesson.entries()];
    const strong = entries.filter(([, g]) => g.t && g.c / g.t >= 0.8).map(([l]) => l);
    const weak = entries.filter(([, g]) => g.t && g.c / g.t < 0.5).map(([l]) => l);
    entries.forEach(([lesson, g], i) =>
      s4.addRow({ name: i === 0 ? s.fullName : "", chapter: "", lesson, rate: pct(g.c, g.t), strong: i === 0 ? strong.join(", ") : "", weak: i === 0 ? weak.join(", ") : "" }),
    );
  }
  styleSheet(s4);
  return Buffer.from(await wb.xlsx.writeBuffer());
}

/** CSV bảng điểm (UTF-8 có BOM để Excel đọc đúng tiếng Việt). */
export function buildAssignmentCsv(r: AssignmentReport): string {
  const esc = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = [["STT", "Mã học sinh", "Họ và tên", "Lớp", "Trạng thái", "Điểm", "Số ý đúng", "Thời gian làm bài", "Ngày làm bài"]];
  r.students.forEach((s, i) =>
    rows.push([String(i + 1), s.studentCode ?? "", s.fullName, r.assignment.className, STATUS[s.status], s.score === null ? "" : String(s.score), s.correctUnits === null ? "" : `${s.correctUnits}/${s.totalUnits}`, dur(s.durationSeconds), dt(s.submittedAt)]),
  );
  return "﻿" + rows.map((r) => r.map(esc).join(",")).join("\r\n");
}

/** Hồ sơ học tập của một học sinh. */
export async function buildStudentWorkbook(r: StudentReport): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "KHTN 9";
  const info = wb.addWorksheet("HOC_SINH");
  info.columns = [{ header: "Thông tin", key: "k", width: 30 }, { header: "Giá trị", key: "v", width: 70 }];
  [
    ["Họ và tên", r.student.fullName],
    ["Mã học sinh", r.student.studentCode ?? ""],
    ["Lớp", r.student.classNames.join(", ")],
    ["Số bài kiểm tra đã làm", r.assessments.length],
    ["Điểm trung bình bài kiểm tra", r.stats.avg === null ? "" : Math.round(r.stats.avg * 100) / 100],
    ["Số lần tự đánh giá", r.practice.length],
    ["Số lần lưu kết quả thí nghiệm", r.labRuns],
    ["Gợi ý nhận xét (từ dữ liệu)", r.suggestion],
  ].forEach(([k, v]) => info.addRow({ k, v }));
  styleSheet(info);

  const tests = wb.addWorksheet("KET_QUA_KIEM_TRA");
  tests.columns = [
    { header: "Bài kiểm tra", key: "t", width: 40 },
    { header: "Lần", key: "n", width: 6 },
    { header: "Điểm", key: "s", width: 10 },
    { header: "Số ý đúng", key: "u", width: 12 },
    { header: "Thời gian", key: "d", width: 18 },
    { header: "Ngày nộp", key: "at", width: 22 },
  ];
  r.assessments.forEach((a) => tests.addRow({ t: a.title, n: a.attemptNo, s: a.score, u: `${a.correctUnits}/${a.totalUnits}`, d: dur(a.durationSeconds), at: dt(a.submittedAt) }));
  r.practice.forEach((p) => tests.addRow({ t: `Tự đánh giá – ${p.lesson}`, n: "", s: p.score, u: "", d: "", at: dt(p.submittedAt) }));
  styleSheet(tests);

  const an = wb.addWorksheet("PHAN_TICH_HOC_TAP");
  an.columns = [{ header: "Nhóm", key: "g", width: 18 }, { header: "Nội dung", key: "l", width: 46 }, { header: "Đúng / Tổng", key: "c", width: 14 }, { header: "Tỷ lệ đúng (%)", key: "p", width: 14 }];
  (
    [
      ["Chương", r.groups.byChapter],
      ["Bài học", r.groups.byLesson],
      ["Mức độ", r.groups.byLevel],
      ["Dạng câu hỏi", r.groups.byType],
    ] as const
  ).forEach(([g, list]) => list.forEach((x) => an.addRow({ g, l: x.label, c: `${x.correct}/${x.total}`, p: pct(x.correct, x.total) })));
  styleSheet(an);

  const cm = wb.addWorksheet("NHAN_XET");
  cm.columns = [{ header: "Ngày", key: "d", width: 22 }, { header: "Giáo viên", key: "t", width: 24 }, { header: "Nhận xét", key: "c", width: 90 }];
  r.comments.forEach((c) => cm.addRow({ d: dt(c.createdAt), t: c.teacherName, c: c.content }));
  styleSheet(cm);
  return Buffer.from(await wb.xlsx.writeBuffer());
}

/** Báo cáo lớp theo kỳ: TONG_QUAN, HOC_SINH, BAI_KIEM_TRA, THEO_CHUONG. */
export async function buildClassPeriodWorkbook(r: ClassPeriodReport): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "KHTN 9";

  const s0 = wb.addWorksheet("TONG_QUAN");
  s0.columns = [{ header: "Chỉ số", key: "k", width: 36 }, { header: "Giá trị", key: "v", width: 30 }];
  [
    ["Lớp", r.className],
    ["Năm học", r.academicYear],
    ["Kỳ báo cáo", r.periodLabel],
    ["Sĩ số", r.summary.students],
    ["Số học sinh có hoạt động", r.summary.active],
    ["Số học sinh đã làm bài kiểm tra", r.summary.testTakers],
    ["Điểm trung bình lớp (bài kiểm tra)", r.summary.classAvg ?? ""],
    ["Số lần tự đánh giá", r.summary.practiceCount],
    ["Số lần lưu kết quả thí nghiệm", r.summary.labRuns],
    ...r.distribution.map((b) => [`Số học sinh: ${b.label}`, b.count]),
  ].forEach(([k, v]) => s0.addRow({ k, v }));
  styleSheet(s0);

  const s1 = wb.addWorksheet("HOC_SINH");
  s1.columns = [
    { header: "STT", key: "stt", width: 6 },
    { header: "Mã học sinh", key: "code", width: 16 },
    { header: "Họ và tên", key: "name", width: 28 },
    { header: "Số bài kiểm tra", key: "tests", width: 14 },
    { header: "Điểm TB", key: "avg", width: 10 },
    { header: "Điểm bài đầu kỳ", key: "first", width: 14 },
    { header: "Điểm bài cuối kỳ", key: "last", width: 14 },
    { header: "Lần tự đánh giá", key: "practice", width: 14 },
    { header: "Điểm TB tự đánh giá", key: "pavg", width: 16 },
    { header: "Thí nghiệm đã lưu", key: "labs", width: 14 },
    { header: "Cần chú ý", key: "flag", width: 22 },
  ];
  r.students.forEach((s, i) =>
    s1.addRow({ stt: i + 1, code: s.studentCode ?? "", name: s.fullName, tests: s.tests, avg: s.avg, first: s.first, last: s.last, practice: s.practice, pavg: s.practiceAvg, labs: s.labRuns, flag: SUPPORT_LABEL[s.flag] }),
  );
  ["avg", "first", "last", "pavg"].forEach((k) => (s1.getColumn(k).numFmt = "0.00"));
  styleSheet(s1);

  const s2 = wb.addWorksheet("BAI_KIEM_TRA");
  s2.columns = [
    { header: "Bài kiểm tra", key: "t", width: 40 },
    { header: "Mã bài giao", key: "c", width: 14 },
    { header: "Số HS đã nộp", key: "n", width: 14 },
    { header: "Sĩ số", key: "total", width: 8 },
    { header: "Điểm TB", key: "avg", width: 10 },
  ];
  r.perAssignment.forEach((a) => s2.addRow({ t: a.title, c: a.code, n: a.submitted, total: a.total, avg: a.avg }));
  s2.getColumn("avg").numFmt = "0.00";
  styleSheet(s2);

  const s3 = wb.addWorksheet("THEO_CHUONG");
  s3.columns = [{ header: "Nhóm", key: "g", width: 22 }, { header: "Nội dung", key: "l", width: 50 }, { header: "Số ý đúng", key: "c", width: 12 }, { header: "Tổng số ý", key: "t", width: 12 }, { header: "Tỉ lệ đúng (%)", key: "p", width: 14 }];
  const add = (g: string, items: { label: string; correct: number; total: number }[]) => items.forEach((i) => s3.addRow({ g, l: i.label, c: i.correct, t: i.total, p: pct(i.correct, i.total) }));
  add("Chương", r.groups.byChapter);
  add("Mức độ", r.groups.byLevel);
  add("Dạng câu hỏi", r.groups.byType);
  add("Bài học", r.groups.byLesson);
  styleSheet(s3);

  return Buffer.from(await wb.xlsx.writeBuffer());
}
