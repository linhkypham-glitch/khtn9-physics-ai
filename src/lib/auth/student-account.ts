/**
 * Supabase Auth bắt buộc có email cho mỗi tài khoản. Học sinh vào học bằng họ tên + lớp
 * (không mật khẩu) nên mỗi hồ sơ học sinh được gắn một địa chỉ nội bộ không nhận thư.
 */
export const STUDENT_LOGIN_DOMAIN = "hocsinh.khtn9.local";

export const USERNAME_PATTERN = /^[a-z0-9][a-z0-9._-]{2,39}$/;

/** Chuyển "email hoặc tên đăng nhập" thành email đăng nhập Supabase. */
export function toLoginEmail(identifier: string): string {
  const v = identifier.trim().toLowerCase();
  return v.includes("@") ? v : `${v}@${STUDENT_LOGIN_DOMAIN}`;
}

/** Địa chỉ nội bộ ngẫu nhiên cho hồ sơ học sinh mới. */
export function internalStudentEmail(): string {
  return `hs-${globalThis.crypto.randomUUID()}@${STUDENT_LOGIN_DOMAIN}`;
}

/** Mật khẩu ngẫu nhiên dài – không ai biết, chỉ để thỏa yêu cầu của Supabase Auth. */
export function unusablePassword(): string {
  const buf = new Uint8Array(24);
  globalThis.crypto.getRandomValues(buf);
  return Buffer.from(buf).toString("base64url");
}
