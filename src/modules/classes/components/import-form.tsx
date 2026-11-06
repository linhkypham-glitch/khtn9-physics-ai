"use client";

import { useActionState } from "react";
import { CheckCircle2, Download, FileSpreadsheet, Loader2, Upload } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { importRosterAction, type ImportResult } from "../actions";

const initial: ImportResult = { ok: false, message: null };

export function ImportRosterForm() {
  const [state, action, pending] = useActionState(importRosterAction, initial);
  return (
    <div className="flex flex-col gap-5">
      <form action={action} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="file">File Excel danh sách học sinh (.xlsx)</Label>
          <label
            htmlFor="file"
            className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/60 px-4 py-8 text-center transition-colors hover:bg-orange-50"
          >
            <FileSpreadsheet className="size-10 text-orange-500" />
            <span className="text-sm font-medium">Bấm để chọn file</span>
            <span className="text-xs text-muted-foreground">Cột bắt buộc: Họ và tên · tuỳ chọn: Lớp, Mã học sinh · tối đa 300 học sinh</span>
            <Input id="file" name="file" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" required className="mt-2 max-w-xs bg-white" />
          </label>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="className">Lớp mặc định (dùng khi file không có cột “Lớp”)</Label>
          <Input id="className" name="className" placeholder="Ví dụ: 9A" maxLength={20} className="uppercase sm:max-w-48" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : <Upload />} {pending ? "Đang xử lí..." : "Tải lên và tạo lớp"}
          </Button>
          <Button asChild variant="outline">
            <a href="/api/templates/class-roster" download>
              <Download /> Tải file mẫu
            </a>
          </Button>
        </div>
      </form>

      {state.message && (
        <Alert variant={state.ok ? "success" : "destructive"}>
          {state.ok && <CheckCircle2 />}
          <AlertTitle>{state.message}</AlertTitle>
          {(state.summary?.length || state.errors?.length) && (
            <AlertDescription>
              {state.summary?.map((s) => (
                <p key={s.className}>
                  Lớp <b>{s.className}</b>{s.createdClass ? " (lớp mới)" : ""}: thêm {s.added} học sinh
                  {s.skipped ? `, bỏ qua ${s.skipped} học sinh đã có` : ""}.
                </p>
              ))}
              {state.errors?.slice(0, 10).map((e) => <p key={e} className="text-destructive">• {e}</p>)}
              {(state.errors?.length ?? 0) > 10 && <p>… và {state.errors!.length - 10} lỗi khác.</p>}
            </AlertDescription>
          )}
        </Alert>
      )}
    </div>
  );
}
