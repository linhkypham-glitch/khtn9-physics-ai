import { School } from "lucide-react";

import { EmptyState } from "@/components/dashboard/states";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ClassSummary } from "../repository";

export function ClassesTable({ classes, emptyDescription }: { classes: ClassSummary[]; emptyDescription: string }) {
  if (classes.length === 0) {
    return <EmptyState icon={School} title="Chưa có lớp học" description={emptyDescription} />;
  }
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lớp</TableHead>
            <TableHead>Năm học</TableHead>
            <TableHead>Giáo viên phụ trách</TableHead>
            <TableHead className="text-right">Sĩ số</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <span className="font-semibold">{c.name}</span>
                {c.schoolName && <p className="text-xs text-muted-foreground">{c.schoolName}</p>}
              </TableCell>
              <TableCell>{c.academicYear ?? "—"}</TableCell>
              <TableCell>
                {c.teacherNames.length ? (
                  <div className="flex flex-wrap gap-1">
                    {c.teacherNames.map((n) => <Badge key={n} variant="secondary">{n}</Badge>)}
                  </div>
                ) : (
                  <Badge variant="amber">Chưa phân công</Badge>
                )}
              </TableCell>
              <TableCell className="text-right tabular-nums">{c.studentCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
