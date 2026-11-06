import { AppShell } from "@/components/layout/app-shell";
import { requireRole } from "@/lib/auth/session";

/** Khu vực teacher: kiểm tra vai trò phía máy chủ trước khi render. */
export default async function Layout({ children }: LayoutProps<"/teacher">) {
  const user = await requireRole(["teacher", "admin"]);
  return <AppShell user={user}>{children}</AppShell>;
}
