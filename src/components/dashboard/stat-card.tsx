import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TONES = {
  blue: "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-orange-500/30",
  teal: "bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-teal-500/30",
  amber: "bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-amber-500/30",
  violet: "bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-rose-500/30",
} as const;

/** Thẻ số liệu – chỉ hiển thị giá trị lấy từ dữ liệu thật. */
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "blue",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: keyof typeof TONES;
}) {
  return (
    <Card className="flex-row items-center gap-4 border-white/70 px-5 py-4 transition-shadow hover:shadow-md">
      <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-lg", TONES[tone])}>
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold tabular-nums leading-tight">{value}</p>
        {hint && <p className="truncate text-xs text-muted-foreground">{hint}</p>}
      </div>
    </Card>
  );
}
