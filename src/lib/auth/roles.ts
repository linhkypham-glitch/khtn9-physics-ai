import type { UserRole } from "@/types/database";

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Quản trị viên",
  teacher: "Giáo viên",
  student: "Học sinh",
};

/** Trang chủ (dashboard) mặc định theo vai trò. */
export function homePathForRole(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "teacher":
      return "/teacher";
    default:
      return "/student";
  }
}

/** Kiểm tra đường dẫn `next` sau đăng nhập: chỉ chấp nhận đường dẫn nội bộ phù hợp vai trò. */
export function safeRedirectPath(next: string | null | undefined, role: UserRole): string {
  const fallback = homePathForRole(role);
  if (!next || !next.startsWith("/") || next.startsWith("//")) return fallback;
  const allowed: Record<UserRole, string[]> = {
    admin: ["/admin", "/teacher"],
    teacher: ["/teacher"],
    student: ["/student"],
  };
  return allowed[role].some((p) => next === p || next.startsWith(`${p}/`)) ? next : fallback;
}
