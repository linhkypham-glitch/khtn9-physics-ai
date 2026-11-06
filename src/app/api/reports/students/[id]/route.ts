import { getCurrentUser } from "@/lib/auth/session";
import { buildStudentWorkbook } from "@/lib/excel/reports";
import { asciiFileName } from "@/lib/excel/file-name";
import { getStudentReport, ReportError } from "@/modules/assessments/reports";

/** Xuất hồ sơ học tập + nhận xét của một học sinh (Excel). */
export async function GET(_request: Request, ctx: RouteContext<"/api/reports/students/[id]">) {
  const user = await getCurrentUser();
  if (!user || user.authMode !== "account" || (user.role !== "teacher" && user.role !== "admin")) return new Response("Không có quyền", { status: 403 });
  const { id } = await ctx.params;
  try {
    const report = await getStudentReport(id);
    const buf = await buildStudentWorkbook(report);
    const name = `ho-so-${asciiFileName(report.student.fullName)}.xlsx`;
    return new Response(new Uint8Array(buf), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${name}"; filename*=UTF-8''${encodeURIComponent(`Hồ sơ ${report.student.fullName}.xlsx`)}`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    if (e instanceof ReportError) return new Response(e.message, { status: 404 });
    throw e;
  }
}
