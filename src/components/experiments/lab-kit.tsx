"use client";

import { createContext, use, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { BookOpenCheck, ClipboardPlus, HelpCircle, Loader2, Pause, Play, RotateCcw, Save, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ExperimentDef } from "@/modules/virtual-lab/catalog";
import { saveExperimentAttempt } from "@/modules/virtual-lab/actions";

/* -------------------------------------------------------------------------- */
/*  Ngữ cảnh thí nghiệm: trạng thái chạy, bảng số liệu, ảnh chụp thông số       */
/* -------------------------------------------------------------------------- */

export type RecordRow = Record<string, string | number>;

type LabState = {
  running: boolean;
  setRunning: (v: boolean) => void;
  resetToken: number;
  records: RecordRow[];
  addRecord: (row: RecordRow) => void;
  clearRecords: () => void;
  setSnapshot: (values: Record<string, unknown>) => void;
};

const LabContext = createContext<LabState | null>(null);

export function useLab() {
  const ctx = use(LabContext);
  if (!ctx) throw new Error("useLab phải dùng bên trong <ExperimentShell>");
  return ctx;
}

/** Ghi lại thông số hiện tại để lưu kèm kết quả thực hành. */
export function useSnapshot(values: Record<string, unknown>) {
  const { setSnapshot } = useLab();
  useEffect(() => {
    setSnapshot(values);
  });
}

/** Vòng lặp hoạt ảnh (requestAnimationFrame) khi đang chạy; dt tính bằng giây. */
export function useAnimationLoop(running: boolean, step: (dt: number) => void) {
  const stepRef = useRef(step);
  useLayoutEffect(() => {
    stepRef.current = step;
  });
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      stepRef.current(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running]);
}

/* -------------------------------------------------------------------------- */
/*  Thành phần giao diện                                                        */
/* -------------------------------------------------------------------------- */

export function fmt(n: number, digits = 2) {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("vi-VN", { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  digits = 2,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
  digits?: number;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium">{label}</label>
        <span className="rounded-md bg-orange-50 px-2 py-0.5 font-mono text-sm font-semibold text-orange-800 tabular-nums">
          {fmt(value, digits)} {unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        className="lab-range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="flex justify-between text-[11px] text-muted-foreground tabular-nums">
        <span>{fmt(min, digits)}</span>
        <span>{fmt(max, digits)}</span>
      </div>
    </div>
  );
}

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label?: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-sm font-medium">{label}</span>}
      <div className="flex flex-wrap gap-1 rounded-xl bg-muted p-1" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "flex-1 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
              value === o.value ? "bg-white text-orange-700 shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Readout({ label, value, unit, tone = "default" }: { label: string; value: string; unit?: string; tone?: "default" | "orange" | "green" | "blue" | "red" }) {
  const tones = {
    default: "bg-white",
    orange: "bg-orange-50 ring-orange-200",
    green: "bg-green-50 ring-green-200",
    blue: "bg-sky-50 ring-sky-200",
    red: "bg-red-50 ring-red-200",
  };
  return (
    <div className={cn("rounded-xl px-3 py-2 ring-1 ring-border", tones[tone])}>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="font-mono text-lg font-bold tabular-nums">
        {value} <span className="text-sm font-medium text-muted-foreground">{unit}</span>
      </p>
    </div>
  );
}

export function Formula({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 px-4 py-3 font-mono text-sm leading-relaxed text-orange-950">
      {children}
    </div>
  );
}

export function Observation({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "success" | "warning" }) {
  const cls = {
    info: "border-sky-200 bg-sky-50 text-sky-900",
    success: "border-green-200 bg-green-50 text-green-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
  }[tone];
  return <div className={cn("rounded-xl border px-4 py-2.5 text-sm", cls)}>{children}</div>;
}

/** Khung chứa hình mô phỏng (SVG/canvas), co giãn theo màn hình. */
export function Stage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl border bg-gradient-to-b from-white to-orange-50/40", className)}>
      {children}
    </div>
  );
}

/** Nút Bắt đầu / Tạm dừng / Đặt lại + Ghi số liệu. */
export function RunControls({ onRecord, recordLabel = "Ghi số liệu", startLabel = "Bắt đầu", hideRun = false }: { onRecord?: () => void; recordLabel?: string; startLabel?: string; hideRun?: boolean }) {
  const { running, setRunning } = useLab();
  const { reset } = useResetter();
  return (
    <div className="flex flex-wrap gap-2">
      {!hideRun &&
        (running ? (
          <Button variant="secondary" onClick={() => setRunning(false)}><Pause /> Tạm dừng</Button>
        ) : (
          <Button onClick={() => setRunning(true)}><Play /> {startLabel}</Button>
        ))}
      <Button variant="outline" onClick={reset}><RotateCcw /> Đặt lại</Button>
      {onRecord && (
        <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50" onClick={onRecord}>
          <ClipboardPlus /> {recordLabel}
        </Button>
      )}
    </div>
  );
}

const ResetContext = createContext<{ reset: () => void } | null>(null);
function useResetter() {
  const ctx = use(ResetContext);
  if (!ctx) throw new Error("ResetContext");
  return ctx;
}

/** Đăng ký hàm đặt lại trạng thái riêng của thí nghiệm. */
export function useOnReset(fn: () => void) {
  const { resetToken } = useLab();
  const fnRef = useRef(fn);
  useLayoutEffect(() => {
    fnRef.current = fn;
  });
  const last = useRef(resetToken);
  useEffect(() => {
    if (last.current === resetToken) return;
    last.current = resetToken;
    fnRef.current();
  }, [resetToken]);
}

function RecordTable() {
  const { records, clearRecords } = useLab();
  if (records.length === 0) {
    return <p className="text-sm text-muted-foreground">Chưa có số liệu. Bấm <b>Ghi số liệu</b> để thêm một dòng vào bảng.</p>;
  }
  const cols = Object.keys(records[0]);
  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-orange-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Lần</th>
              {cols.map((c) => (
                <th key={c} className="px-3 py-2 text-left text-xs font-semibold whitespace-nowrap text-muted-foreground">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="px-3 py-1.5 tabular-nums">{i + 1}</td>
                {cols.map((c) => (
                  <td key={c} className="px-3 py-1.5 font-mono tabular-nums whitespace-nowrap">{typeof r[c] === "number" ? fmt(r[c] as number, 3) : r[c]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button variant="ghost" size="sm" className="self-start text-muted-foreground" onClick={clearRecords}><Trash2 /> Xoá bảng</Button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Khung thí nghiệm                                                            */
/* -------------------------------------------------------------------------- */

export function ExperimentShell({ def, canSave, children }: { def: ExperimentDef; canSave: boolean; children: ReactNode }) {
  const [running, setRunning] = useState(false);
  const [resetToken, setResetToken] = useState(0);
  const [records, setRecords] = useState<RecordRow[]>([]);
  const snapshot = useRef<Record<string, unknown>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; message: string } | null>(null);

  const addRecord = useCallback((row: RecordRow) => setRecords((r) => (r.length >= 50 ? r : [...r, row])), []);
  const clearRecords = useCallback(() => setRecords([]), []);
  const setSnapshot = useCallback((values: Record<string, unknown>) => {
    snapshot.current = values;
  }, []);
  const reset = useCallback(() => {
    setRunning(false);
    setResetToken((t) => t + 1);
  }, []);

  const ctx = useMemo<LabState>(
    () => ({ running, setRunning, resetToken, records, addRecord, clearRecords, setSnapshot }),
    [running, resetToken, records, addRecord, clearRecords, setSnapshot],
  );

  async function save() {
    setSaving(true);
    setSaveMsg(null);
    const res = await saveExperimentAttempt(def.key, { params: snapshot.current as never, records: records as never }, answers);
    setSaveMsg(res);
    setSaving(false);
  }

  return (
    <LabContext value={ctx}>
      <ResetContext value={{ reset }}>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-gradient-to-r from-orange-500 to-amber-500">Thí nghiệm ảo</Badge>
              {def.basis === "book" && <Badge variant="teal">Theo thí nghiệm trong SGK</Badge>}
              {def.basis === "support" && <Badge variant="secondary">Mô phỏng minh hoạ bổ trợ (SGK bài này không có thí nghiệm thực hành)</Badge>}
              {running && <Badge variant="teal" className="animate-pulse">● Đang chạy</Badge>}
            </div>
            <h2 className="text-xl font-bold">{def.title}</h2>
            <p className="text-sm text-muted-foreground">{def.summary}</p>
          </div>

          {children}

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="gap-3">
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><BookOpenCheck className="size-4 text-primary" /> Hướng dẫn thực hành</CardTitle></CardHeader>
              <CardContent>
                <ol className="list-decimal space-y-1.5 pl-5 text-sm">{def.guide.map((g) => <li key={g}>{g}</li>)}</ol>
              </CardContent>
            </Card>
            <Card className="gap-3">
              <CardHeader><CardTitle className="text-base">Bảng số liệu</CardTitle></CardHeader>
              <CardContent><RecordTable /></CardContent>
            </Card>
          </div>

          <Card className="gap-3">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><HelpCircle className="size-4 text-primary" /> Câu hỏi khám phá</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">
              {def.questions.map((q, i) => (
                <label key={q} className="flex flex-col gap-1.5 text-sm">
                  <span className="font-medium">{i + 1}. {q}</span>
                  <textarea
                    className="min-h-20 rounded-xl border border-input bg-card px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30"
                    maxLength={2000}
                    placeholder="Em hãy ghi câu trả lời dựa trên kết quả quan sát…"
                    value={answers[String(i + 1)] ?? ""}
                    onChange={(e) => setAnswers({ ...answers, [String(i + 1)]: e.target.value })}
                  />
                </label>
              ))}
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={save} disabled={saving || !canSave}>
                  {saving ? <Loader2 className="animate-spin" /> : <Save />} Lưu kết quả thực hành
                </Button>
                {!canSave && <span className="text-sm text-muted-foreground">Vào học (nhập họ tên, lớp) để lưu kết quả.</span>}
                {saveMsg && <span className={cn("text-sm", saveMsg.ok ? "text-success" : "text-destructive")}>{saveMsg.message}</span>}
              </div>
            </CardContent>
          </Card>
        </div>
      </ResetContext>
    </LabContext>
  );
}

/** Bố cục 2 cột: mô phỏng bên trái, điều khiển + kết quả bên phải. */
export function LabLayout({ stage, controls, readouts, formula, below }: { stage: ReactNode; controls: ReactNode; readouts?: ReactNode; formula?: ReactNode; below?: ReactNode }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div className="flex min-w-0 flex-col gap-3">
        {stage}
        {readouts && <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{readouts}</div>}
        {below}
      </div>
      <Card className="gap-4">
        <CardContent className="flex flex-col gap-5">
          {controls}
          {formula}
        </CardContent>
      </Card>
    </div>
  );
}
