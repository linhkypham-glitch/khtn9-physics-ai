import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createStudentToken,
  normalizeClassName,
  normalizePersonName,
  titleCaseName,
  verifyStudentToken,
} from "@/lib/auth/student-session";

const ID = "c0000000-0000-0000-0000-0000000009a1";

beforeEach(() => vi.stubEnv("STUDENT_SESSION_SECRET", "test-secret-123"));
afterEach(() => vi.unstubAllEnvs());

describe("Phiên học sinh không mật khẩu", () => {
  it("token hợp lệ được xác minh", () => {
    expect(verifyStudentToken(createStudentToken(ID))).toBe(ID);
  });

  it("từ chối token bị sửa mã hồ sơ hoặc chữ ký", () => {
    const t = createStudentToken(ID);
    const [, exp, sig] = t.split(".");
    expect(verifyStudentToken(`c0000000-0000-0000-0000-0000000009a2.${exp}.${sig}`)).toBeNull();
    expect(verifyStudentToken(`${ID}.${exp}.${sig.slice(0, -2)}xx`)).toBeNull();
    expect(verifyStudentToken(`${ID}.${Number(exp) + 999}.${sig}`)).toBeNull();
    expect(verifyStudentToken("rac")).toBeNull();
    expect(verifyStudentToken(undefined)).toBeNull();
  });

  it("từ chối token hết hạn", () => {
    const t = createStudentToken(ID, Date.now() - 400 * 24 * 3600 * 1000);
    expect(verifyStudentToken(t)).toBeNull();
  });

  it("từ chối token ký bằng khoá khác", () => {
    const t = createStudentToken(ID);
    vi.stubEnv("STUDENT_SESSION_SECRET", "khoa-khac");
    expect(verifyStudentToken(t)).toBeNull();
  });

  it("chuẩn hoá họ tên và tên lớp", () => {
    expect(normalizePersonName("  Nguyễn   VĂN an ")).toBe("nguyễn văn an");
    expect(titleCaseName("nguyễn   văn AN")).toBe("Nguyễn Văn An");
    expect(normalizeClassName(" 9 a ")).toBe("9A");
  });
});
