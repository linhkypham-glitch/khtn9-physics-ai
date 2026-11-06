import { AppShell } from "@/components/layout/app-shell";
import { requireRole } from "@/lib/auth/session";

/** Khu vực student: kiểm tra vai trò phía máy chủ trước khi render. */
export default async function Layout({ children }: LayoutProps<"/student">) {
  const user = await requireRole(["student"]);
  return <AppShell user={user}>{children}</AppShell>;
}
