import Link from "next/link";
import { Medal, Trophy } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Ranked } from "../logic";

function fmtDuration(s: number | null) {
  if (s === null) return "—";
  const m = Math.floor(s / 60);
  return m >= 60 ? `${Math.floor(m / 60)} giờ ${m % 60} phút` : `${m} phút ${s % 60} giây`;
}

const MEDAL = ["text-amber-500", "text-slate-400", "text-orange-700"];

/** Bảng xếp hạng: chỉ hiển thị họ tên, lớp, điểm, thời gian, số ý đúng (không lộ dữ liệu khác). */
export function LeaderboardTable({ rows, highlightId, showCount = false, durationLabel = "Thời gian" }: { rows: Ranked[]; highlightId?: string; showCount?: boolean; durationLabel?: string }) {
  if (!rows.length) return <p className="py-6 text-center text-sm text-muted-foreground">Chưa có học sinh nào nộp bài trong khoảng thời gian này.</p>;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Hạng</TableHead>
          <TableHead>Họ và tên</TableHead>
          <TableHead>Lớp</TableHead>
          <TableHead className="text-right">{showCount ? "Điểm TB" : "Điểm"}</TableHead>
          {showCount && <TableHead className="text-right">Số bài</TableHead>}
          <TableHead className="text-right">Số ý đúng</TableHead>
          <TableHead className="text-right">{durationLabel}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.id} className={cn(r.id === highlightId && "bg-primary/10 font-semibold")}>
            <TableCell>
              <span className="flex items-center gap-1 tabular-nums">
                {r.rank <= 3 ? (r.rank === 1 ? <Trophy className={cn("size-4", MEDAL[0])} /> : <Medal className={cn("size-4", MEDAL[r.rank - 1])} />) : null}
                {r.rank}
              </span>
            </TableCell>
            <TableCell>{r.name}{r.id === highlightId && <span className="ml-1 text-xs text-primary">(em)</span>}</TableCell>
            <TableCell>{r.className}</TableCell>
            <TableCell className="text-right tabular-nums">{r.score.toLocaleString("vi-VN")}</TableCell>
            {showCount && <TableCell className="text-right tabular-nums">{r.count ?? 0}</TableCell>}
            <TableCell className="text-right tabular-nums">{r.totalUnits ? `${r.correctUnits ?? 0}/${r.totalUnits}` : "—"}</TableCell>
            <TableCell className="text-right tabular-nums">{fmtDuration(r.durationSeconds)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/** Thanh chọn kỳ xếp hạng (liên kết GET, không cần JavaScript). */
export function PeriodTabs({ base, current, semesters, extra }: { base: string; current: string; semesters: { key: string; label: string }[]; extra?: Record<string, string> }) {
  const opts = [{ key: "all", label: "Cả năm học" }, { key: "month", label: "Tháng này" }, ...semesters];
  return (
    <div className="flex flex-wrap gap-1.5">
      {opts.map((o) => {
        const qs = new URLSearchParams({ ...extra, ky: o.key });
        return (
          <Link key={o.key} href={`${base}?${qs}`} className={cn("rounded-full border px-3 py-1 text-sm", current === o.key ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted")}>
            {o.label}
          </Link>
        );
      })}
    </div>
  );
}
