import type { ReactNode } from "react";

import { ROLE_LABELS, homePathForRole } from "@/lib/auth/roles";
import type { CurrentUser } from "@/lib/auth/session";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { SidebarNav } from "./sidebar-nav";
import { UserMenu } from "./user-menu";

/** Khung giao diện chung cho khu vực đã đăng nhập: sidebar + thanh trên + nội dung. */
export function AppShell({ user, children }: { user: CurrentUser; children: ReactNode }) {
  const home = homePathForRole(user.role);
  return (
    <div className="flex min-h-dvh">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r bg-sidebar px-4 py-5 lg:flex">
        <Logo href={home} className="mb-8 px-2" />
        <SidebarNav role={user.role} />
        <div className="mt-auto rounded-lg bg-muted px-3 py-3 text-xs text-muted-foreground">
          Chương trình KHTN 9 – Kết nối tri thức với cuộc sống
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/90 px-4 backdrop-blur sm:px-6">
          <MobileNav role={user.role} homeHref={home} />
          <Logo href={home} className="lg:hidden" />
          <div className="ml-auto">
            <UserMenu fullName={user.fullName} email={user.email} roleLabel={ROLE_LABELS[user.role]} />
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
