import type { Metadata } from "next";

import { SetupStatusPanel } from "@/components/dashboard/setup-status-panel";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/session";
import { getSetupStatus } from "@/lib/setup-status";
import { GlobalLeaderboardToggle } from "@/modules/leaderboard/components/global-toggle";
import { isLeaderboardEnabledGlobally } from "@/modules/leaderboard/service";

export const metadata: Metadata = { title: "Cấu hình hệ thống" };

export default async function Page() {
  await requireRole(["admin"]);
  const [status, lbEnabled] = await Promise.all([getSetupStatus(), isLeaderboardEnabledGlobally().catch(() => true)]);
  return (
    <>
      <PageHeader title="Cấu hình hệ thống" description="Trạng thái kết nối Supabase, dữ liệu chương trình học và dịch vụ AI." />
      <Card className="mb-6">
        <CardHeader><CardTitle>Bảng xếp hạng</CardTitle></CardHeader>
        <CardContent><GlobalLeaderboardToggle enabled={lbEnabled} /></CardContent>
      </Card>
      <SetupStatusPanel status={status} />
    </>
  );
}
