import { describe, expect, it } from "vitest";

import { homePathForRole, safeRedirectPath } from "@/lib/auth/roles";
import { loginSchema } from "@/lib/validation/auth";
import { NAV_BY_ROLE, isNavItemActive } from "@/components/layout/nav-config";

describe("Điều hướng theo vai trò", () => {
  it("trang mặc định đúng vai trò", () => {
    expect(homePathForRole("admin")).toBe("/admin");
    expect(homePathForRole("teacher")).toBe("/teacher");
    expect(homePathForRole("student")).toBe("/student");
  });

  it("chặn open-redirect và đường dẫn ngoài quyền", () => {
    expect(safeRedirectPath("https://evil.com", "student")).toBe("/student");
    expect(safeRedirectPath("//evil.com", "student")).toBe("/student");
    expect(safeRedirectPath("/admin", "student")).toBe("/student");
    expect(safeRedirectPath("/teacher/classes", "student")).toBe("/student");
    expect(safeRedirectPath("/student/lessons/bai-3-co-nang", "student")).toBe("/student/lessons/bai-3-co-nang");
    expect(safeRedirectPath("/teacher/classes", "admin")).toBe("/teacher/classes");
    expect(safeRedirectPath("/studentx", "student")).toBe("/student");
    expect(safeRedirectPath(null, "teacher")).toBe("/teacher");
  });

  it("menu của mỗi vai trò chỉ trỏ vào khu vực của vai trò đó", () => {
    for (const item of NAV_BY_ROLE.student.flatMap((g) => g.items)) expect(item.href.startsWith("/student")).toBe(true);
    for (const item of NAV_BY_ROLE.teacher.flatMap((g) => g.items)) expect(item.href.startsWith("/teacher")).toBe(true);
    for (const item of NAV_BY_ROLE.admin.flatMap((g) => g.items)) expect(item.href.startsWith("/admin")).toBe(true);
  });

  it("xác định mục menu đang hoạt động", () => {
    const overview = { href: "/student", label: "", icon: () => null, exact: true } as never;
    const lessons = { href: "/student/lessons", label: "", icon: () => null } as never;
    expect(isNavItemActive(overview, "/student")).toBe(true);
    expect(isNavItemActive(overview, "/student/lessons")).toBe(false);
    expect(isNavItemActive(lessons, "/student/lessons/bai-2-dong-nang-the-nang")).toBe(true);
  });
});

describe("Kiểm tra dữ liệu đăng nhập", () => {
  it("chấp nhận dữ liệu hợp lệ và chuẩn hoá email", () => {
    const r = loginSchema.safeParse({ email: "  gv@truong.edu.vn ", password: "matkhau123" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBe("gv@truong.edu.vn");
  });

  it("từ chối email sai định dạng và mật khẩu quá ngắn", () => {
    const r = loginSchema.safeParse({ email: "abc", password: "123" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const paths = r.error.issues.map((i) => i.path[0]);
      expect(paths).toContain("email");
      expect(paths).toContain("password");
    }
  });

  it("từ chối dữ liệu thiếu", () => {
    expect(loginSchema.safeParse({ email: null, password: null }).success).toBe(false);
  });
});
