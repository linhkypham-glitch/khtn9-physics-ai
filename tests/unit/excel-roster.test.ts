import ExcelJS from "exceljs";
import { describe, expect, it } from "vitest";

import { buildRosterTemplate, parseRosterWorkbook } from "@/lib/excel/class-roster";

async function toArrayBuffer(buf: Buffer) {
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

describe("Excel danh sách lớp", () => {
  it("đọc được file mẫu do hệ thống tạo", async () => {
    const res = await parseRosterWorkbook(await toArrayBuffer(await buildRosterTemplate()));
    expect(res.errors).toEqual([]);
    expect(res.rows.map((r) => [r.fullName, r.className])).toEqual([
      ["Nguyễn Văn An", "9A"],
      ["Trần Thị Bình", "9A"],
      ["Lê Minh Châu", "9B"],
    ]);
  });

  it("nhận tiêu đề đặt ở dòng khác, không có cột lớp, bỏ dòng trống, báo lỗi tên sai", async () => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("x");
    ws.addRow(["DANH SÁCH LỚP 9D"]);
    ws.addRow(["STT", "Họ tên", "Mã HS"]);
    ws.addRow([1, "  Phạm   Thu Hà ", "HS001"]);
    ws.addRow([2, "", ""]);
    ws.addRow([3, "=HACK()<b>", ""]);
    const res = await parseRosterWorkbook(await toArrayBuffer(Buffer.from(await wb.xlsx.writeBuffer())));
    expect(res.rows).toEqual([{ row: 3, fullName: "Phạm Thu Hà", className: null, studentCode: "HS001" }]);
    expect(res.errors).toHaveLength(1);
  });

  it("báo lỗi khi không phải file Excel", async () => {
    const res = await parseRosterWorkbook(new TextEncoder().encode("hello").buffer as ArrayBuffer);
    expect(res.rows).toEqual([]);
    expect(res.errors[0]).toContain("Không đọc được file");
  });

});
