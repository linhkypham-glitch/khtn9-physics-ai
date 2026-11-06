import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * PHIÊN HỌC SINH KHÔNG MẬT KHẨU
 * Học sinh chỉ nhập họ tên + lớp. Máy chủ cấp một cookie httpOnly có chữ ký HMAC
 * chứa mã hồ sơ học sinh. Cookie không thể bị sửa (sửa là sai chữ ký) và không đọc được bằng JavaScript.
 * Mọi dữ liệu học sinh được đọc/ghi phía máy chủ sau khi xác minh cookie.
 */
export const STUDENT_COOKIE = "khtn9_hs";
export const STUDENT_SESSION_DAYS = 180;

function secret(): string | null {
  return (
    process.env.STUDENT_SESSION_SECRET?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    null
  );
}

export function isStudentSessionAvailable() {
  return secret() !== null;
}

function sign(payload: string, key: string) {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

export function createStudentToken(profileId: string, now = Date.now()): string {
  const key = secret();
  if (!key) throw new Error("Thiếu khoá ký phiên học sinh");
  const exp = Math.floor(now / 1000) + STUDENT_SESSION_DAYS * 24 * 3600;
  const payload = `${profileId}.${exp}`;
  return `${payload}.${sign(payload, key)}`;
}

/** Trả về mã hồ sơ nếu token hợp lệ và chưa hết hạn. */
export function verifyStudentToken(token: string | undefined | null, now = Date.now()): string | null {
  const key = secret();
  if (!key || !token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [id, expStr, sig] = parts;
  if (!/^[0-9a-f-]{36}$/i.test(id) || !/^\d+$/.test(expStr)) return null;
  const expected = Buffer.from(sign(`${id}.${expStr}`, key));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  if (Number(expStr) * 1000 < now) return null;
  return id;
}

export const studentCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: STUDENT_SESSION_DAYS * 24 * 3600,
};

/** Chuẩn hoá họ tên để so khớp: bỏ khoảng trắng thừa, không phân biệt hoa thường. */
export function normalizePersonName(name: string) {
  return name.normalize("NFC").replace(/\s+/g, " ").trim().toLocaleLowerCase("vi");
}

/** Viết hoa chữ cái đầu mỗi từ: "nguyễn văn an" → "Nguyễn Văn An". */
export function titleCaseName(name: string) {
  return name
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((w) => w.charAt(0).toLocaleUpperCase("vi") + w.slice(1).toLocaleLowerCase("vi"))
    .join(" ");
}

/** Chuẩn hoá tên lớp: "9 a" → "9A". */
export function normalizeClassName(name: string) {
  return name.normalize("NFC").replace(/\s+/g, "").trim().toLocaleUpperCase("vi");
}
