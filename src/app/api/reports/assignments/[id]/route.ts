import { getCurrentUser } from "@/lib/auth/session";
import { buildAssignmentCsv, buildAssignmentWorkbook } from "@/lib/excel/reports";
import { asciiFileName } from "@/lib/excel/file-name";
import { getAssignmentReport, ReportError } from "@/modules/assessments/reports";

/** Xuất kết quả một bài giao: ?format=xlsx (mặc định) | csv. Chỉ giáo viên của lớp / admin. */
export async function GET(request: Request, ctx: RouteContext<"/api/reports/assignments/[id]">) {
  const user = await getCurrentUser();
  if (!user || user.authMode !== "account" || (user.role !== "teacher" && user.role !== "admin")) return new Response("Không có quyền", { status: 403 });
  const { id } = await ctx.params;
  try {
    const report = await getAssignmentReport(id);
    const base = `ket-qua-${asciiFileName(report.assignment.className)}-${report.assignment.code}`;
    if (new URL(request.url).searchParams.get("format") === "csv") {
      return new Response(buildAssignmentCsv(report), {
        headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${base}.csv"`, "Cache-Control": "no-store" },
      });
    }
    const buf = await buildAssignmentWorkbook(report);
    return new Response(new Uint8Array(buf), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${base}.xlsx"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    if (e instanceof ReportError) return new Response(e.message, { status: 404 });
    throw e;
  }
}
