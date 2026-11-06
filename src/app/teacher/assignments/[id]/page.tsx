import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, FileDown, FileSpreadsheet } from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireRole } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import { CloseAssignmentButton } from "@/modules/assessments/components/builder-widgets";
import { AccuracyBars, DistributionChart } from "@/modules/assessments/components/report-widgets";
import { getAssignmentReport, ReportError } from "@/modules/assessments/reports";
import { LEVEL_LABELS, TYPE_LABELS } from "@/modules/question-bank/types";
import { BarChart3, CheckCircle2, Trophy, Users } from "lucide-react";

export const metadata: Metadata = { title: "Kết quả bài giao" };

const dt = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
const STATUS = { submitted: ["Đã nộp", "teal"], in_progress: ["Đang làm", "amber"], not_started: ["Chưa làm", "secondary"] } as const;
const SHOW = { immediately: "Ngay sau khi nộp", after_due: "Sau hạn nộp", never: "Không công bố" } as const;
const fmt = (n: number | null, d = 2) => (n === null ? "—" : n.toLocaleString("vi-VN", { maximumFractionDigits: d }));

export default async function Page({ params }: PageProps<"/teacher/assignments/[id]">) {
  await requireRole(["teacher", "admin"]);
  const { id } = await params;
  let r;
  try {
    r = await getAssignmentReport(id);
  } catch (e) {
    if (e instanceof ReportError) notFound();
    throw e;
  }
  const a = r.assignment;
  const hard = [...r.questionStats].filter((q) => q.correctRate !== null).sort((x, y) => x.correctRate! - y.correctRate!).slice(0, 5);

  return (
    <>
      <PageHeader
        title={`${a.title} – Lớp ${a.className}`}
        description={`Mã bài giao ${a.code} · hạn nộp ${dt.format(new Date(a.dueAt))} · ${a.maxAttempts} lần làm · đáp án: ${SHOW[a.showAnswers]}`}
        actions={
          <>
            <Button asChild variant="outline"><Link href={`/teacher/assessments/${a.assessmentId}`}><ChevronLeft /> Đề</Link></Button>
            <CloseAssignmentButton assignmentId={a.id} closed={a.isClosed} />
          </>
        }
      />
      <div className="mb-5 flex flex-wrap gap-2">
        <Button asChild><a href={`/api/reports/assignments/${a.id}`}><FileSpreadsheet /> Xuất Excel (4 sheet)</a></Button>
        <Button asChild variant="outline"><a href={`/api/reports/assignments/${a.id}?format=csv`}><FileDown /> Xuất CSV bảng điểm</a></Button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Đã nộp" value={`${r.stats.count}/${r.stats.total}`} hint={`Hoàn thành ${fmt(r.stats.completionRate, 0)}%`} icon={Users} tone="blue" />
        <StatCard label="Điểm trung bình" value={fmt(r.stats.avg)} icon={BarChart3} tone="amber" />
        <StatCard label="Cao nhất / thấp nhất" value={`${fmt(r.stats.max)} / ${fmt(r.stats.min)}`} icon={Trophy} tone="teal" />
        <StatCard label="Đạt từ 5 điểm" value={r.stats.passRate === null ? "—" : `${fmt(r.stats.passRate, 0)}%`} icon={CheckCircle2} tone="violet" />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card className="gap-2"><CardHeader><CardTitle className="text-base">Phổ điểm</CardTitle></CardHeader><CardContent><DistributionChart distribution={r.stats.distribution} /></CardContent></Card>
        <Card className="gap-2"><CardHeader><CardTitle className="text-base">Tỉ lệ đúng theo chương</CardTitle></CardHeader><CardContent><AccuracyBars items={r.groups.byChapter} /></CardContent></Card>
        <Card className="gap-2"><CardHeader><CardTitle className="text-base">Theo mức độ nhận thức</CardTitle></CardHeader><CardContent><AccuracyBars items={r.groups.byLevel} /></CardContent></Card>
        <Card className="gap-2"><CardHeader><CardTitle className="text-base">Theo dạng câu hỏi</CardTitle></CardHeader><CardContent><AccuracyBars items={r.groups.byType} /></CardContent></Card>
      </div>

      <h2 className="mb-3 text-lg font-semibold">Kết quả từng học sinh</h2>
      <div className="mb-6 overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">STT</TableHead>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Điểm</TableHead>
              <TableHead className="text-right">Ý đúng</TableHead>
              <TableHead className="text-right">Thời gian</TableHead>
              <TableHead>Nộp lúc</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {r.students.map((s, i) => (
              <TableRow key={s.id}>
                <TableCell className="tabular-nums text-muted-foreground">{i + 1}</TableCell>
                <TableCell className="font-medium">{s.fullName}</TableCell>
                <TableCell><Badge variant={STATUS[s.status][1]}>{STATUS[s.status][0]}</Badge></TableCell>
                <TableCell className={cn("text-right font-bold tabular-nums", s.score !== null && s.score < 5 && "text-red-600")}>{fmt(s.score)}</TableCell>
                <TableCell className="text-right tabular-nums">{s.correctUnits === null ? "—" : `${s.correctUnits}/${s.totalUnits}`}</TableCell>
                <TableCell className="text-right tabular-nums">{s.durationSeconds === null ? "—" : `${Math.floor(s.durationSeconds / 60)}′${String(s.durationSeconds % 60).padStart(2, "0")}″`}</TableCell>
                <TableCell className="tabular-nums text-muted-foreground">{s.submittedAt ? dt.format(new Date(s.submittedAt)) : "—"}</TableCell>
                <TableCell className="text-right"><Button asChild size="sm" variant="outline"><Link href={`/teacher/students/${s.id}`}>Hồ sơ & nhận xét</Link></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Card className="gap-3">
        <CardHeader>
          <CardTitle className="text-base">Tỉ lệ đúng từng câu</CardTitle>
          <CardDescription>Câu có tỉ lệ đúng thấp nên được giảng lại.{hard.length ? ` Thấp nhất: ${hard.map((h) => `câu ${h.index}`).join(", ")}.` : ""}</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>Câu</TableHead><TableHead>Bài</TableHead><TableHead>Dạng / mức độ</TableHead><TableHead>Nội dung</TableHead><TableHead className="text-right">Tỉ lệ đúng</TableHead></TableRow></TableHeader>
            <TableBody>
              {r.questionStats.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="tabular-nums">{q.index}</TableCell>
                  <TableCell>{q.lesson}</TableCell>
                  <TableCell className="text-xs">{TYPE_LABELS[q.type]} · {LEVEL_LABELS[q.level]}</TableCell>
                  <TableCell className="max-w-md truncate text-sm">{q.content}</TableCell>
                  <TableCell className={cn("text-right font-semibold tabular-nums", q.correctRate !== null && (q.correctRate < 50 ? "text-red-600" : q.correctRate >= 80 ? "text-green-700" : "text-amber-700"))}>
                    {q.correctRate === null ? "—" : `${Math.round(q.correctRate)}%`}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
