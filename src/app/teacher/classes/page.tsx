import type { Metadata } from "next";
import Link from "next/link";
import { FileSpreadsheet, Link2 } from "lucide-react";

import { ErrorState } from "@/components/dashboard/states";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ClaimClassButton, CreateClassForm } from "@/modules/classes/components/class-forms";
import { ClassesTable } from "@/modules/classes/components/classes-table";
import { listVisibleClasses } from "@/modules/classes/repository";

export const metadata: Metadata = { title: "Lớp học" };

export default async function Page() {
  const user = await requireRole(["teacher", "admin"]);
  const supabase = await createSupabaseServerClient();
  const [result, unassigned] = await Promise.all([
    listVisibleClasses(),
    supabase ? supabase.rpc("list_unassigned_classes") : Promise.resolve({ data: [], error: null }),
  ]);

  return (
    <>
      <PageHeader
        title="Lớp học"
        description={user.role === "admin" ? "Toàn bộ lớp học đang hoạt động." : "Các lớp bạn phụ trách."}
        actions={
          <Button asChild>
            <Link href="/teacher/classes/import"><FileSpreadsheet /> Tải lên Excel</Link>
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card className="gap-3">
          <CardHeader>
            <CardTitle className="text-base">Tạo lớp mới</CardTitle>
            <CardDescription>Bạn sẽ là giáo viên phụ trách lớp.</CardDescription>
          </CardHeader>
          <CardContent>
            <CreateClassForm />
          </CardContent>
        </Card>
        <Card className="gap-3 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Link2 className="size-4 text-primary" /> Cách học sinh vào lớp</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Gửi cho học sinh đường link của ứng dụng. Học sinh bấm <b>Vào học</b>, nhập <b>họ tên</b> và <b>tên lớp</b> (ví dụ 9A) –
            không cần mật khẩu. Các em nhập cùng tên lớp sẽ tự vào chung lớp.
          </CardContent>
        </Card>
      </div>

      {result.ok ? (
        <ClassesTable classes={result.data} hrefBase="/teacher/classes" emptyDescription="Hãy tạo lớp mới, tải lên Excel hoặc nhận một lớp do học sinh tạo bên dưới." />
      ) : (
        <ErrorState title="Không tải được danh sách lớp" description={result.error} />
      )}

      {(unassigned.data?.length ?? 0) > 0 && (
        <Card className="mt-6 gap-3">
          <CardHeader>
            <CardTitle className="text-base">Lớp chưa có giáo viên phụ trách</CardTitle>
            <CardDescription>Do học sinh tự tạo khi nhập tên lớp mới. Bấm “Nhận lớp” để quản lý.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {unassigned.data!.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div>
                    <p className="font-medium">Lớp {c.name}</p>
                    <p className="text-xs text-muted-foreground">Năm học {c.academic_year} · {c.student_count} học sinh</p>
                  </div>
                  <ClaimClassButton classId={c.id} />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </>
  );
}
