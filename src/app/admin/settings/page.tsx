import type { Metadata } from "next";

import { SetupStatusPanel } from "@/components/dashboard/setup-status-panel";
import { PageHeader } from "@/components/layout/page-header";
import { requireRole } from "@/lib/auth/session";
import { getSetupStatus } from "@/lib/setup-status";

export const metadata: Metadata = { title: "Cấu hình hệ thống" };

export default async function Page() {
  await requireRole(["admin"]);
  const status = await getSetupStatus();
  return (
    <>
      <PageHeader title="Cấu hình hệ thống" description="Trạng thái kết nối Supabase, dữ liệu chương trình học và dịch vụ AI." />
      <SetupStatusPanel status={status} />
    </>
  );
}
