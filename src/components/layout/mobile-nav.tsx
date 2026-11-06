"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { UserRole } from "@/types/database";
import { Logo } from "./logo";
import { SidebarNav } from "./sidebar-nav";

export function MobileNav({ role, homeHref }: { role: UserRole; homeHref: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Mở menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-gradient-to-b from-orange-600 via-orange-500 to-amber-500 p-4 text-white [&>button]:text-white">
        <SheetTitle className="sr-only">Menu điều hướng</SheetTitle>
        <SheetDescription className="sr-only">Các mục chức năng theo vai trò</SheetDescription>
        <Logo href={homeHref} className="mb-6 px-2" inverted />
        <SidebarNav role={role} onNavigate={() => setOpen(false)} inverted />
      </SheetContent>
    </Sheet>
  );
}
