import type { Metadata } from "next";

import { ErrorState } from "@/components/dashboard/states";
import { PageHeader } from "@/components/layout/page-header";
import { requireRole } from "@/lib/auth/session";
import { ClassesTable } from "@/modules/classes/components/classes-table";
import { listVisibleClasses } from "@/modules/classes/repository";

export const metadata: Metadata = { title: "Lớp học" };

export default async function Page() {
  await requireRole(["teacher", "admin"]);
  const result = await listVisibleClasses();
  return (
    <>
      <PageHeader title="Lớp học" description="Các lớp bạn được phân công giảng dạy." />
      {result.ok ? (
        <ClassesTable classes={result.data} emptyDescription="Bạn chưa được phân công lớp nào. Vui lòng liên hệ quản trị viên." />
      ) : (
        <ErrorState title="Không tải được danh sách lớp" description={result.error} />
      )}
    </>
  );
}
