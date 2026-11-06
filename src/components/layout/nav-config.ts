import {
  BookOpen,
  LayoutDashboard,
  School,
  Settings,
  type LucideIcon,
} from "lucide-react";

import type { UserRole } from "@/types/database";

export type NavItem = { href: string; label: string; icon: LucideIcon; exact?: boolean };
export type NavGroup = { label: string; items: NavItem[] };

/**
 * Điều hướng theo vai trò. Chỉ liệt kê các trang ĐÃ hoạt động –
 * mục mới được bổ sung khi module tương ứng hoàn thành.
 */
export const NAV_BY_ROLE: Record<UserRole, NavGroup[]> = {
  student: [
    {
      label: "Học tập",
      items: [
        { href: "/student", label: "Tổng quan", icon: LayoutDashboard, exact: true },
        { href: "/student/lessons", label: "Bài học", icon: BookOpen },
      ],
    },
  ],
  teacher: [
    {
      label: "Giảng dạy",
      items: [
        { href: "/teacher", label: "Tổng quan", icon: LayoutDashboard, exact: true },
        { href: "/teacher/classes", label: "Lớp học", icon: School },
        { href: "/teacher/curriculum", label: "Chương trình học", icon: BookOpen },
      ],
    },
  ],
  admin: [
    {
      label: "Quản trị",
      items: [
        { href: "/admin", label: "Tổng quan", icon: LayoutDashboard, exact: true },
        { href: "/admin/classes", label: "Lớp học", icon: School },
        { href: "/admin/curriculum", label: "Chương trình học", icon: BookOpen },
        { href: "/admin/settings", label: "Cấu hình hệ thống", icon: Settings },
      ],
    },
  ],
};

export function isNavItemActive(item: NavItem, pathname: string) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
}
