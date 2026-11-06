"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/database";
import { NAV_BY_ROLE, isNavItemActive } from "./nav-config";

export function SidebarNav({ role, onNavigate, inverted = false }: { role: UserRole; onNavigate?: () => void; inverted?: boolean }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Điều hướng chính" className="flex flex-col gap-6">
      {NAV_BY_ROLE[role].map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          <p className={cn("px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider", inverted ? "text-orange-100/90" : "text-muted-foreground")}>
            {group.label}
          </p>
          {group.items.map((item) => {
            const active = isNavItemActive(item, pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  inverted
                    ? "text-sidebar-foreground hover:bg-white/10 hover:text-white"
                    : "text-slate-600 hover:bg-muted",
                  active &&
                    (inverted
                      ? "bg-sidebar-active text-sidebar-active-foreground shadow-md shadow-orange-900/25 hover:bg-sidebar-active hover:text-sidebar-active-foreground"
                      : "bg-accent text-accent-foreground hover:bg-accent"),
                )}
              >
                <Icon className="size-[18px] shrink-0" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
