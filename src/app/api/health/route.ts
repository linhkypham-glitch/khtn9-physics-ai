import { NextResponse } from "next/server";

import { getSetupStatus } from "@/lib/setup-status";

/** Kiểm tra sức khỏe hệ thống (dùng cho giám sát triển khai). Không trả về bí mật. */
export async function GET() {
  const status = await getSetupStatus();
  const healthy = status.supabaseEnv && status.database.reachable && status.m2.ready;
  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      supabase: { configured: status.supabaseEnv, reachable: status.database.reachable },
      curriculum: { chapters: status.database.chapters, lessons: status.database.lessons },
      content: { questions: status.m2.questions, experiments: status.m2.experiments },
      ai: { configured: status.ai.configured },
    },
    { status: healthy ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
