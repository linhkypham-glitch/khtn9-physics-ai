import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BarChart3, FileSpreadsheet, FlaskConical, GraduationCap, PencilLine } from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireRole } from "@/lib/auth/session";
import { AccuracyBars, CommentForm, DeleteCommentButton } from "@/modules/assessments/components/report-widgets";
import { getStudentReport, ReportError } from "@/modules/assessments/reports";

export const metadata: Metadata = { title: "Hồ sơ học tập" };

const dt = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
const fmt = (n: number | null) => (n === null ? "—" : n.toLocaleString("vi-VN", { maximumFractionDigits: 2 }));

export default async function Page({ params }: PageProps<"/teacher/students/[id]">) {
  const user = await requireRole(["teacher", "admin"]);
  const { id } = await params;
  let r;
  try {
    r = await getStudentReport(id);
  } catch (e) {
    if (e instanceof ReportError) notFound();
    throw e;
  }
  const scores = r.assessments.map((a) => a.score);
  const trend = scores.length >= 2 ? scores[scores.length - 1] - scores[0] : null;

  return (
    <>
      <PageHeader
        title={r.student.fullName}
        description={`Lớp ${r.student.classNames.join(", ") || "—"}${r.student.studentCode ? ` · Mã HS ${r.student.studentCode}` : ""}`}
        actions={<Button asChild><a href={`/api/reports/students/${r.student.id}`}><FileSpreadsheet /> Xuất hồ sơ Excel</a></Button>}
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Bài kiểm tra đã làm" value={r.assessments.length} icon={GraduationCap} tone="blue" />
        <StatCard label="Điểm TB bài kiểm tra" value={fmt(r.stats.avg)} hint={trend === null ? undefined : trend >= 0 ? `Tiến bộ +${fmt(trend)} điểm` : `Giảm ${fmt(-trend)} điểm`} icon={BarChart3} tone="amber" />
        <StatCard label="Lần tự đánh giá" value={r.practice.length} icon={PencilLine} tone="teal" />
        <StatCard label="Thí nghiệm đã lưu" value={r.labRuns} icon={FlaskConical} tone="violet" />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card className="gap-2"><CardHeader><CardTitle className="text-base">Tỉ lệ đúng theo chương</CardTitle><CardDescription>Tổng hợp từ bài kiểm tra và tự đánh giá</CardDescription></CardHeader><CardContent><AccuracyBars items={r.groups.byChapter} /></CardContent></Card>
        <Card className="gap-2"><CardHeader><CardTitle className="text-base">Theo mức độ và dạng câu hỏi</CardTitle></CardHeader><CardContent className="flex flex-col gap-4"><AccuracyBars items={r.groups.byLevel} /><AccuracyBars items={r.groups.byType} /></CardContent></Card>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-5">
        <Card className="gap-3 lg:col-span-3">
          <CardHeader><CardTitle className="text-base">Kết quả các bài</CardTitle></CardHeader>
          <CardContent>
            {r.assessments.length + r.practice.length === 0 ? (
              <p className="text-sm text-muted-foreground">Học sinh chưa làm bài nào.</p>
            ) : (
              <Table>
                <TableHeader><TableRow><TableHead>Bài</TableHead><TableHead className="text-right">Điểm</TableHead><TableHead>Ngày</TableHead></TableRow></TableHeader>
                <TableBody>
                  {r.assessments.map((a) => (
                    <TableRow key={a.id}><TableCell>{a.title} <span className="text-xs text-muted-foreground">(lần {a.attemptNo})</span></TableCell><TableCell className="text-right font-bold tabular-nums">{fmt(a.score)}</TableCell><TableCell className="tabular-nums text-muted-foreground">{dt.format(new Date(a.submittedAt))}</TableCell></TableRow>
                  ))}
                  {r.practice.map((p, i) => (
                    <TableRow key={i}><TableCell className="text-muted-foreground">Tự đánh giá – {p.lesson}</TableCell><TableCell className="text-right tabular-nums">{fmt(p.score)}</TableCell><TableCell className="tabular-nums text-muted-foreground">{dt.format(new Date(p.submittedAt))}</TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        <Card className="gap-3 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Nhận xét, đánh giá</CardTitle>
            <CardDescription>Gợi ý được tạo từ dữ liệu kết quả, không suy đoán về phẩm chất hay hoàn cảnh. Hãy đọc và chỉnh sửa trước khi lưu.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="rounded-lg bg-orange-50 px-3 py-2 text-sm text-orange-900"><b>Gợi ý:</b> {r.suggestion}</p>
            <CommentForm studentId={r.student.id} assignmentId={null} suggestion={r.suggestion} />
            <ul className="flex flex-col gap-2">
              {r.comments.map((c) => (
                <li key={c.id} className="rounded-lg border px-3 py-2 text-sm">
                  <div className="mb-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>{c.teacherName} · {dt.format(new Date(c.createdAt))}</span>
                    {c.teacherId === user.id && <DeleteCommentButton commentId={c.id} studentId={r.student.id} />}
                  </div>
                  <p className="whitespace-pre-line">{c.content}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <Button asChild variant="outline"><Link href="/teacher/classes">← Lớp học</Link></Button>
    </>
  );
}
