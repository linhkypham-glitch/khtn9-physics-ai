import ExcelJS from "exceljs";

/**
 * Đọc / ghi file Excel danh sách lớp.
 * File nhập gồm các cột (dòng tiêu đề bất kì trong 10 dòng đầu):
 *   "Họ và tên" (bắt buộc) · "Lớp" (tuỳ chọn) · "Mã học sinh" (tuỳ chọn)
 */
export type RosterRow = { row: number; fullName: string; className: string | null; studentCode: string | null };
export type RosterParseResult = { rows: RosterRow[]; errors: string[] };

export const MAX_ROSTER_ROWS = 300;

function normalizeHeader(v: string) {
  return v
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function cellText(value: ExcelJS.CellValue): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    if ("richText" in value) return value.richText.map((r) => r.text).join("");
    if ("text" in value) return String(value.text);
    if ("result" in value) return String(value.result ?? "");
    return "";
  }
  return String(value);
}

const NAME_HEADERS = ["hovaten", "hoten", "hotenhocsinh", "ten", "fullname", "name"];
const CLASS_HEADERS = ["lop", "tenlop", "class"];
const CODE_HEADERS = ["mahocsinh", "mahs", "ma", "studentcode", "code", "madinhdanh"];

export async function parseRosterWorkbook(data: ArrayBuffer): Promise<RosterParseResult> {
  const wb = new ExcelJS.Workbook();
  try {
    await wb.xlsx.load(data);
  } catch {
    return { rows: [], errors: ["Không đọc được file. Vui lòng dùng file Excel .xlsx (có thể tải file mẫu)."] };
  }
  const ws = wb.worksheets[0];
  if (!ws) return { rows: [], errors: ["File không có trang tính nào."] };

  let headerRow = -1;
  let nameCol = -1;
  let classCol = -1;
  let codeCol = -1;
  for (let r = 1; r <= Math.min(10, ws.rowCount); r++) {
    const row = ws.getRow(r);
    row.eachCell((cell, col) => {
      const h = normalizeHeader(cellText(cell.value));
      if (NAME_HEADERS.includes(h) && nameCol < 0) nameCol = col;
      else if (CLASS_HEADERS.includes(h) && classCol < 0) classCol = col;
      else if (CODE_HEADERS.includes(h) && codeCol < 0) codeCol = col;
    });
    if (nameCol > 0) {
      headerRow = r;
      break;
    }
    classCol = codeCol = -1;
  }
  if (headerRow < 0) return { rows: [], errors: ['Không tìm thấy cột "Họ và tên" trong 10 dòng đầu.'] };

  const rows: RosterRow[] = [];
  const errors: string[] = [];
  for (let r = headerRow + 1; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const fullName = cellText(row.getCell(nameCol).value).replace(/\s+/g, " ").trim();
    if (!fullName) continue;
    if (fullName.length > 80 || !/^[\p{L}\s.'-]+$/u.test(fullName)) {
      errors.push(`Dòng ${r}: họ tên "${fullName.slice(0, 40)}" không hợp lệ.`);
      continue;
    }
    const className = classCol > 0 ? cellText(row.getCell(classCol).value).trim().toUpperCase() || null : null;
    if (className && !/^[\p{L}0-9 ._-]{1,20}$/u.test(className)) {
      errors.push(`Dòng ${r}: tên lớp "${className}" không hợp lệ.`);
      continue;
    }
    const studentCode = codeCol > 0 ? cellText(row.getCell(codeCol).value).trim().slice(0, 30) || null : null;
    rows.push({ row: r, fullName, className, studentCode });
  }
  if (rows.length > MAX_ROSTER_ROWS) {
    return { rows: [], errors: [`File có ${rows.length} học sinh, vượt quá giới hạn ${MAX_ROSTER_ROWS} học sinh mỗi lần tải lên.`] };
  }
  return { rows, errors };
}

function styleHeader(ws: ExcelJS.Worksheet) {
  const header = ws.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2563EB" } };
  header.alignment = { vertical: "middle", horizontal: "center" };
  header.height = 22;
  ws.views = [{ state: "frozen", ySplit: 1 }];
}

/** File mẫu để giáo viên điền danh sách lớp. */
export async function buildRosterTemplate(): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "KHTN 9 – PHYSICS AI";
  const ws = wb.addWorksheet("DANH_SACH_LOP");
  ws.columns = [
    { header: "STT", key: "stt", width: 6 },
    { header: "Họ và tên", key: "name", width: 32 },
    { header: "Lớp", key: "cls", width: 10 },
    { header: "Mã học sinh", key: "code", width: 16 },
  ];
  styleHeader(ws);
  [
    ["Nguyễn Văn An", "9A", ""],
    ["Trần Thị Bình", "9A", ""],
    ["Lê Minh Châu", "9B", ""],
  ].forEach(([name, cls, code], i) => ws.addRow({ stt: i + 1, name, cls, code }));
  const note = wb.addWorksheet("HUONG_DAN");
  note.getColumn(1).width = 100;
  [
    "HƯỚNG DẪN",
    "• Cột \"Họ và tên\" là bắt buộc. Xoá các dòng ví dụ trước khi nhập danh sách thật.",
    "• Cột \"Lớp\" (tuỳ chọn): nếu để trống, học sinh được xếp vào lớp bạn nhập trên trang tải lên.",
    "• Có thể nhập nhiều lớp trong một file – hệ thống tự tạo lớp chưa có.",
    "• Cột \"Mã học sinh\" (tuỳ chọn) – không bắt buộc. Không nhập thông tin cá nhân không cần thiết (ngày sinh, địa chỉ, số điện thoại…).",
    "• Sau khi tải lên, hệ thống tạo tên đăng nhập và mật khẩu cho từng học sinh – hãy tải file tài khoản về để phát cho học sinh.",
  ].forEach((t, i) => {
    const c = note.getCell(i + 1, 1);
    c.value = t;
    if (i === 0) c.font = { bold: true, size: 14 };
  });
  return Buffer.from(await wb.xlsx.writeBuffer());
}

/** File tài khoản đăng nhập vừa tạo (phát cho học sinh). */
