import { AppShell } from "@/components/layout/app-shell";
import { requireRole } from "@/lib/auth/session";

/** Khu vực admin: kiểm tra vai trò phía máy chủ trước khi render. */
export default async function Layout({ children }: LayoutProps<"/admin">) {
  const user = await requireRole(["admin"]);
  return <AppShell user={user}>{children}</AppShell>;
}
