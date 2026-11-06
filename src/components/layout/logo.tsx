import Link from "next/link";
import { Atom } from "lucide-react";

import { cn } from "@/lib/utils";

export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5 font-semibold", className)}>
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <Atom className="size-5" aria-hidden />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-[15px] tracking-tight">PHYSICS AI</span>
        <span className="text-[11px] font-medium text-muted-foreground">KHTN 9 – Vật lý</span>
      </span>
    </Link>
  );
}
