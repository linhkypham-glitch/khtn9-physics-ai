import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/session";
import { ImportRosterForm } from "@/modules/classes/components/import-form";

export const metadata: Metadata = { title: "Tải lên danh sách lớp" };

export default async function Page() {
  await requireRole(["teacher", "admin"]);
  return (
    <>
      <PageHeader
        title="Tải lên danh sách lớp từ Excel"
        description="Hệ thống tự tạo lớp (nếu chưa có) và thêm học sinh. Học sinh vào học bằng đúng họ tên và lớp trong danh sách."
        actions={<Button asChild variant="outline"><Link href="/teacher/classes"><ChevronLeft /> Lớp học</Link></Button>}
      />
      <Card>
        <CardContent>
          <ImportRosterForm />
        </CardContent>
      </Card>
    </>
  );
}
