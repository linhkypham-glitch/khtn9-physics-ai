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
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col overflow-hidden bg-gradient-to-b from-orange-600 via-orange-500 to-amber-500 px-4 py-5 lg:flex">
        <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-yellow-300/30 blur-2xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-10 -left-10 size-40 rounded-full bg-rose-400/25 blur-2xl" />
        <Logo href={home} className="relative mb-8 px-2" inverted />
        <div className="relative">
          <SidebarNav role={user.role} inverted />
        </div>
        <div className="relative mt-auto rounded-xl bg-white/10 px-3 py-3 text-xs text-orange-50 ring-1 ring-white/10">
          <p className="font-semibold text-white">KHTN 9 · Vật lý · Hoá học</p>
          <p className="mt-0.5">Kết nối tri thức với cuộc sống</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/60 bg-white/75 px-4 backdrop-blur-md sm:px-6">
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
