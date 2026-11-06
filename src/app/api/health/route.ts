import { NextResponse } from "next/server";

import { getSetupStatus } from "@/lib/setup-status";

/** Kiểm tra sức khỏe hệ thống (dùng cho giám sát triển khai). Không trả về bí mật. */
export async function GET() {
  const status = await getSetupStatus();
  const healthy = status.supabaseEnv && status.database.reachable;
  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      supabase: { configured: status.supabaseEnv, reachable: status.database.reachable },
      curriculum: { chapters: status.database.chapters, lessons: status.database.lessons },
      ai: { configured: status.ai.configured },
    },
    { status: healthy ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
