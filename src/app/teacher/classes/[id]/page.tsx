import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Users } from "lucide-react";

import { EmptyState } from "@/components/dashboard/states";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireRole } from "@/lib/auth/session";
import { AddStudentForm, RemoveStudentButton, SelfJoinToggle } from "@/modules/classes/components/class-forms";
import { authorizeClassManager, listClassStudents, requireAdminClient, ServiceError } from "@/modules/classes/service";

export const metadata: Metadata = { title: "Chi tiết lớp" };

const dateFmt = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

export default async function Page({ params }: PageProps<"/teacher/classes/[id]">) {
  await requireRole(["teacher", "admin"]);
  const { id } = await params;

  let cls;
  try {
    cls = (await authorizeClassManager(id)).cls;
  } catch (e) {
    if (e instanceof ServiceError) notFound();
    throw e;
  }

  const admin = requireAdminClient();
  const students = await listClassStudents(admin, id);
  const [{ data: info }, { data: attempts }, { data: assignments }] = await Promise.all([
    admin.from("classes").select("name, allow_self_join, academic_years(name)").eq("id", id).single(),
    admin.from("practice_attempts").select("user_id, score").eq("mode", "self_assessment").in("user_id", students.map((s) => s.id)),
    admin.from("assessment_assignments").select("id, code, due_at, is_closed, assessments(title)").eq("class_id", id).order("due_at", { ascending: false }),
  ]);

  const stats = new Map<string, { count: number; sum: number }>();
  for (const a of attempts ?? []) {
    const s = stats.get(a.user_id) ?? { count: 0, sum: 0 };
    s.count++;
    s.sum += Number(a.score);
    stats.set(a.user_id, s);
  }
  const sorted = [...students].sort((a, b) => a.fullName.split(" ").at(-1)!.localeCompare(b.fullName.split(" ").at(-1)!, "vi"));

  return (
    <>
      <PageHeader
        title={`Lớp ${cls.name}`}
        description={`Năm học ${info?.academic_years?.name ?? "—"} · ${students.length} học sinh`}
        actions={<Button asChild variant="outline"><Link href="/teacher/classes"><ChevronLeft /> Lớp học</Link></Button>}
      />

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card className="gap-3">
          <CardHeader>
            <CardTitle className="text-base">Thêm học sinh</CardTitle>
            <CardDescription>Học sinh sẽ vào học bằng đúng họ tên này và lớp {cls.name}.</CardDescription>
          </CardHeader>
          <CardContent>
            <AddStudentForm classId={id} />
          </CardContent>
        </Card>
        <Card className="gap-3">
          <CardHeader>
            <CardTitle className="text-base">Cài đặt lớp</CardTitle>
          </CardHeader>
          <CardContent>
            <SelfJoinToggle classId={id} allow={info?.allow_self_join ?? true} />
          </CardContent>
        </Card>
      </div>

      {(assignments?.length ?? 0) > 0 && (
        <Card className="mb-6 gap-3">
          <CardHeader><CardTitle className="text-base">Bài kiểm tra đã giao cho lớp</CardTitle></CardHeader>
          <CardContent>
            <ul className="divide-y">
              {assignments!.map((g) => (
                <li key={g.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <span><b>{g.assessments?.title}</b> <span className="text-muted-foreground">· mã {g.code} · hạn {dateFmt.format(new Date(g.due_at))}{g.is_closed ? " · đã đóng" : ""}</span></span>
                  <Button asChild size="sm" variant="outline"><Link href={`/teacher/assignments/${g.id}`}>Xem kết quả</Link></Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {sorted.length === 0 ? (
        <EmptyState icon={Users} title="Lớp chưa có học sinh" description="Thêm học sinh ở trên, tải lên Excel, hoặc để học sinh tự vào lớp." />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">STT</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Mã HS</TableHead>
                <TableHead>Ngày vào lớp</TableHead>
                <TableHead className="text-right">Bài tự đánh giá</TableHead>
                <TableHead className="text-right">Điểm TB tự đánh giá</TableHead>
                <TableHead className="w-12"><span className="sr-only">Thao tác</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((s, i) => {
                const st = stats.get(s.id);
                return (
                  <TableRow key={s.id}>
                    <TableCell className="tabular-nums text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium">
                      <Link href={`/teacher/students/${s.id}`} className="text-primary hover:underline">{s.fullName}</Link> {!s.isActive && <Badge variant="destructive">Đã khoá</Badge>}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{s.studentCode ?? "—"}</TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">{dateFmt.format(new Date(s.joinedAt))}</TableCell>
                    <TableCell className="text-right tabular-nums">{st?.count ?? 0}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">{st ? (st.sum / st.count).toFixed(1) : "—"}</TableCell>
                    <TableCell>
                      <RemoveStudentButton classId={id} studentId={s.id} name={s.fullName} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
