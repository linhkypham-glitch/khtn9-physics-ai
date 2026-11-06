import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TONES = {
  blue: "bg-blue-soft text-primary",
  teal: "bg-teal-soft text-teal",
  amber: "bg-amber-soft text-amber",
  violet: "bg-violet-soft text-violet",
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
    <Card className="flex-row items-center gap-4 px-5 py-4">
      <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", TONES[tone])}>
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
