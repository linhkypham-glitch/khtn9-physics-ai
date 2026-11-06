import { describe, expect, it } from "vitest";

import { internalStudentEmail, toLoginEmail, unusablePassword } from "@/lib/auth/student-account";
import { loginSchema } from "@/lib/validation/auth";

describe("Tài khoản nội bộ của học sinh", () => {
  it("chuyển tên đăng nhập sang email nội bộ, giữ nguyên email thật", () => {
    expect(toLoginEmail(" ABC.def ")).toBe("abc.def@hocsinh.khtn9.local");
    expect(toLoginEmail("GV@Truong.edu.vn")).toBe("gv@truong.edu.vn");
  });

  it("sinh email nội bộ duy nhất và mật khẩu dài", () => {
    expect(internalStudentEmail()).not.toBe(internalStudentEmail());
    expect(internalStudentEmail()).toMatch(/^hs-[0-9a-f-]{36}@hocsinh\.khtn9\.local$/);
    expect(unusablePassword().length).toBeGreaterThanOrEqual(30);
  });

  it("đăng nhập giáo viên chấp nhận email", () => {
    expect(loginSchema.safeParse({ identifier: "gv@truong.edu.vn", password: "abcdef" }).success).toBe(true);
    expect(loginSchema.safeParse({ identifier: "a b", password: "abcdef" }).success).toBe(false);
  });
});
