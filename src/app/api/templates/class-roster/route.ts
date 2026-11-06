import { buildRosterTemplate } from "@/lib/excel/class-roster";

/** Tải file Excel mẫu danh sách lớp. */
export async function GET() {
  const buf = await buildRosterTemplate();
  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="mau-danh-sach-lop.xlsx"; filename*=UTF-8''${encodeURIComponent("Mẫu danh sách lớp.xlsx")}`,
      "Cache-Control": "no-store",
    },
  });
}
