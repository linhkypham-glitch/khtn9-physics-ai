import type { Metadata } from "next";
import Link from "next/link";
import { FileQuestion, Plus } from "lucide-react";

import { EmptyState } from "@/components/dashboard/states";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Đề kiểm tra" };

const SOURCE = { manual: "Tự soạn", auto: "Từ ngân hàng", ai: "AI hỗ trợ" } as const;
const STATUS = { draft: "Nháp", published: "Đã xuất bản", archived: "Lưu trữ" } as const;
const dateFmt = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

export default async function Page() {
  const user = await requireRole(["teacher", "admin"]);
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase!
    .from("assessments")
    .select("id, title, source, status, duration_minutes, created_at, created_by, assessment_questions(count), assessment_assignments(count)")
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader
        title="Đề kiểm tra"
        description="Soạn đề, nhờ AI hỗ trợ, xuất bản và giao cho lớp."
        actions={<Button asChild><Link href="/teacher/assessments/new"><Plus /> Tạo đề mới</Link></Button>}
      />
      {!data?.length ? (
        <EmptyState icon={FileQuestion} title="Chưa có đề kiểm tra" description="Bấm “Tạo đề mới” để soạn đề từ ngân hàng câu hỏi hoặc nhờ AI hỗ trợ." />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên đề</TableHead>
                <TableHead>Cách tạo</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Số câu</TableHead>
                <TableHead className="text-right">Thời gian</TableHead>
                <TableHead className="text-right">Đã giao</TableHead>
                <TableHead>Ngày tạo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <Link href={`/teacher/assessments/${a.id}`} className="font-semibold text-primary hover:underline">{a.title}</Link>
                    {a.created_by !== user.id && <p className="text-xs text-muted-foreground">Đề của giáo viên khác</p>}
                  </TableCell>
                  <TableCell><Badge variant={a.source === "ai" ? "violet" : "secondary"}>{SOURCE[a.source]}</Badge></TableCell>
                  <TableCell><Badge variant={a.status === "published" ? "teal" : "amber"}>{STATUS[a.status]}</Badge></TableCell>
                  <TableCell className="text-right tabular-nums">{(a.assessment_questions as unknown as { count: number }[])[0]?.count ?? 0}</TableCell>
                  <TableCell className="text-right tabular-nums">{a.duration_minutes} phút</TableCell>
                  <TableCell className="text-right tabular-nums">{(a.assessment_assignments as unknown as { count: number }[])[0]?.count ?? 0} lớp</TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">{dateFmt.format(new Date(a.created_at))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
