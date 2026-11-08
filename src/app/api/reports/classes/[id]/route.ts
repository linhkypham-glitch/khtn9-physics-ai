import { getCurrentUser } from "@/lib/auth/session";
import { buildClassPeriodWorkbook } from "@/lib/excel/reports";
import { asciiFileName } from "@/lib/excel/file-name";
import { getClassPeriodReport, REPORT_PERIOD_KEYS, type ReportPeriodKey } from "@/modules/assessments/class-report";
import { ReportError } from "@/modules/assessments/reports";

/** Xuất báo cáo lớp theo kỳ: ?ky=week|month|hk1|hk2|all&lui=0 (số kỳ lùi lại, với tuần/tháng). Chỉ giáo viên của lớp / admin. */
export async function GET(request: Request, ctx: RouteContext<"/api/reports/classes/[id]">) {
  const user = await getCurrentUser();
  if (!user || user.authMode !== "account" || (user.role !== "teacher" && user.role !== "admin")) return new Response("Không có quyền", { status: 403 });
  const { id } = await ctx.params;
  const sp = new URL(request.url).searchParams;
  const ky = (REPORT_PERIOD_KEYS as string[]).includes(sp.get("ky") ?? "") ? (sp.get("ky") as ReportPeriodKey) : "all";
  const lui = Math.min(60, Math.max(0, Number(sp.get("lui")) || 0));
  try {
    const report = await getClassPeriodReport(id, ky, lui);
    const buf = await buildClassPeriodWorkbook(report);
    return new Response(new Uint8Array(buf), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="bao-cao-${asciiFileName(report.className)}-${ky}.xlsx"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    if (e instanceof ReportError) return new Response(e.message, { status: 404 });
    throw e;
  }
}
