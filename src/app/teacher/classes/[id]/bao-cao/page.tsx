import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Activity, AlertTriangle, BarChart3, ChevronLeft, FileSpreadsheet, FlaskConical, PencilLine } from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireRole } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import { getClassPeriodReport, REPORT_PERIOD_KEYS, type ReportPeriodKey } from "@/modules/assessments/class-report";
import { SUPPORT_LABEL } from "@/modules/assessments/class-report-logic";
import { ReportError } from "@/modules/assessments/reports";
import { AccuracyBars } from "@/modules/assessments/components/report-widgets";

export const metadata: Metadata = { title: "Báo cáo lớp" };

const fmt = (n: number | null) => (n === null ? "—" : n.toLocaleString("vi-VN", { maximumFractionDigits: 2 }));
const TABS: { key: ReportPeriodKey; label: string }[] = [
  { key: "week", label: "Tuần" },
  { key: "month", label: "Tháng" },
  { key: "hk1", label: "Học kì I" },
  { key: "hk2", label: "Học kì II" },
  { key: "all", label: "Cả năm" },
];

export default async function Page({ params, searchParams }: PageProps<"/teacher/classes/[id]/bao-cao">) {
  await requireRole(["teacher", "admin"]);
  const { id } = await params;
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const ky = (REPORT_PERIOD_KEYS as string[]).includes(one(sp.ky) ?? "") ? (one(sp.ky) as ReportPeriodKey) : "month";
  const lui = ky === "week" || ky === "month" ? Math.min(60, Math.max(0, Number(one(sp.lui)) || 0)) : 0;

  let r;
  try {
    r = await getClassPeriodReport(id, ky, lui);
  } catch (e) {
    if (e instanceof ReportError) notFound();
    throw e;
  }
  const href = (k: string, l = 0) => `/teacher/classes/${id}/bao-cao?ky=${k}${l ? `&lui=${l}` : ""}`;
  const flagged = r.students.filter((s) => s.flag !== "none");
  const maxBucket = Math.max(1, ...r.distribution.map((b) => b.count));

  return (
    <>
      <PageHeader
        title={`Báo cáo lớp ${r.className}`}
        description={`${r.periodLabel}${r.academicYear ? ` · Năm học ${r.academicYear}` : ""}`}
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline"><Link href={`/teacher/classes/${id}`}><ChevronLeft /> Lớp học</Link></Button>
            <Button asChild><a href={`/api/reports/classes/${id}?ky=${ky}${lui ? `&lui=${lui}` : ""}`}><FileSpreadsheet /> Xuất Excel</a></Button>
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {TABS.map((t) => (
          <Link key={t.key} href={href(t.key)} className={cn("rounded-full border px-3 py-1 text-sm font-medium", t.key === ky ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted")}>
            {t.label}
          </Link>
        ))}
        {(ky === "week" || ky === "month") && (
          <span className="ml-auto flex items-center gap-2 text-sm">
            <Link href={href(ky, lui + 1)} className="rounded-md border px-2 py-1 hover:bg-muted">← {ky === "week" ? "Tuần" : "Tháng"} trước</Link>
            {lui > 0 && <Link href={href(ky, Math.max(0, lui - 1))} className="rounded-md border px-2 py-1 hover:bg-muted">{ky === "week" ? "Tuần" : "Tháng"} sau →</Link>}
          </span>
        )}
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Điểm TB lớp (bài kiểm tra)" value={fmt(r.summary.classAvg)} hint={`${r.summary.testTakers}/${r.summary.students} học sinh đã làm bài`} icon={BarChart3} tone="amber" />
        <StatCard label="Học sinh có hoạt động" value={`${r.summary.active}/${r.summary.students}`} icon={Activity} tone="blue" />
        <StatCard label="Lần tự đánh giá" value={r.summary.practiceCount} icon={PencilLine} tone="teal" />
        <StatCard label="Thí nghiệm đã lưu" value={r.summary.labRuns} icon={FlaskConical} tone="violet" />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card className="gap-3">
          <CardHeader><CardTitle className="text-base">Phân bố điểm trung bình</CardTitle><CardDescription>Số học sinh theo mức điểm trong kỳ</CardDescription></CardHeader>
          <CardContent className="flex flex-col gap-2">
            {r.distribution.map((b, i) => (
              <div key={b.label} className="flex items-center gap-3 text-sm">
                <span className="w-28 shrink-0">{b.label}</span>
                <div className="h-5 flex-1 rounded bg-muted"><div className={cn("h-5 rounded", ["bg-red-500", "bg-amber-500", "bg-sky-500", "bg-green-600"][i])} style={{ width: `${(b.count / maxBucket) * 100}%` }} /></div>
                <span className="w-8 text-right font-bold tabular-nums">{b.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="gap-3">
          <CardHeader><CardTitle className="text-base">Tỉ lệ đúng theo chương</CardTitle><CardDescription>Từ bài kiểm tra và tự đánh giá trong kỳ – chương nào thấp cần dạy lại</CardDescription></CardHeader>
          <CardContent><AccuracyBars items={r.groups.byChapter} /></CardContent>
        </Card>
      </div>

      {flagged.length > 0 && (
        <Card className="mb-6 gap-3 border-amber-300 bg-amber-50/50">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="size-4 text-amber-600" /> Học sinh cần chú ý ({flagged.length})</CardTitle><CardDescription>Gợi ý từ số liệu trong kỳ để giáo viên cân nhắc – không phải đánh giá về học sinh.</CardDescription></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {flagged.map((s) => (
              <Link key={s.id} href={`/teacher/students/${s.id}`} className="rounded-lg border bg-card px-3 py-1.5 text-sm hover:bg-muted">
                <b>{s.fullName}</b> <Badge variant="secondary">{SUPPORT_LABEL[s.flag]}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="mb-6 gap-3">
        <CardHeader><CardTitle className="text-base">Từng học sinh</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Học sinh</TableHead><TableHead className="text-right">Bài KT</TableHead><TableHead className="text-right">Điểm TB</TableHead><TableHead className="text-right">Đầu → cuối kỳ</TableHead><TableHead className="text-right">Tự đánh giá</TableHead><TableHead className="text-right">Thí nghiệm</TableHead><TableHead>Chú ý</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {r.students.map((s) => (
                <TableRow key={s.id}>
                  <TableCell><Link href={`/teacher/students/${s.id}`} className="text-primary hover:underline">{s.fullName}</Link></TableCell>
                  <TableCell className="text-right tabular-nums">{s.tests}</TableCell>
                  <TableCell className="text-right font-bold tabular-nums">{fmt(s.avg)}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">{s.tests >= 2 ? `${fmt(s.first)} → ${fmt(s.last)}` : "—"}</TableCell>
                  <TableCell className="text-right tabular-nums">{s.practice}{s.practiceAvg !== null && <span className="text-xs text-muted-foreground"> (TB {fmt(s.practiceAvg)})</span>}</TableCell>
                  <TableCell className="text-right tabular-nums">{s.labRuns}</TableCell>
                  <TableCell>{s.flag !== "none" && <Badge variant="secondary">{SUPPORT_LABEL[s.flag]}</Badge>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {r.perAssignment.length > 0 && (
        <Card className="gap-3">
          <CardHeader><CardTitle className="text-base">Các bài kiểm tra trong kỳ</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-2">
            {r.perAssignment.map((a) => (
              <Link key={a.id} href={`/teacher/assignments/${a.id}`} className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-muted">
                <span>{a.title}</span>
                <span className="text-muted-foreground">Nộp {a.submitted}/{a.total} · TB <b className="text-foreground">{fmt(a.avg)}</b></span>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
}
