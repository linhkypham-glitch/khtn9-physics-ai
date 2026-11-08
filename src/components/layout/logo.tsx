import Link from "next/link";
import { Atom } from "lucide-react";

import { cn } from "@/lib/utils";

export function Logo({ href = "/", className, inverted = false }: { href?: string; className?: string; inverted?: boolean }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5 font-semibold", className)}>
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-xl shadow-sm",
          inverted ? "bg-white/15 text-white ring-1 ring-white/25" : "bg-gradient-to-br from-orange-500 to-amber-500 text-white",
        )}
      >
        <Atom className="size-5" aria-hidden />
      </span>
      <span className="flex flex-col leading-tight">
        <span className={cn("text-[15px] tracking-tight", inverted && "text-white")}>KHTN 9</span>
        <span className={cn("text-[11px] font-medium", inverted ? "text-orange-100" : "text-muted-foreground")}>Kết nối tri thức</span>
      </span>
    </Link>
  );
}
