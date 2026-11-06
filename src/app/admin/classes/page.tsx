import type { Metadata } from "next";

import { ErrorState } from "@/components/dashboard/states";
import { PageHeader } from "@/components/layout/page-header";
import { requireRole } from "@/lib/auth/session";
import { ClassesTable } from "@/modules/classes/components/classes-table";
import { listVisibleClasses } from "@/modules/classes/repository";

export const metadata: Metadata = { title: "Lớp học" };

export default async function Page() {
  await requireRole(["admin"]);
  const result = await listVisibleClasses();
  return (
    <>
      <PageHeader title="Lớp học" description="Toàn bộ lớp học đang hoạt động trong hệ thống." />
      {result.ok ? (
        <ClassesTable classes={result.data} emptyDescription="Chưa có lớp học nào trong hệ thống." />
      ) : (
        <ErrorState title="Không tải được danh sách lớp" description={result.error} />
      )}
    </>
  );
}
