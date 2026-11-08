import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Thành phần dựng hình minh hoạ cho bài học (hình vẽ gốc của ứng dụng, không dùng ảnh trong SGK).
 * Dùng HTML/Tailwind cho sơ đồ quy trình (tự co giãn trên điện thoại) và SVG cho hình vẽ vật lí, phân tử, biểu đồ.
 */

export type FigureDef = { id: string; title: string; caption: string; render: () => ReactNode };

export function FigureCard({ title, caption, children }: { title: string; caption: string; children: ReactNode }) {
  return (
    <figure className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm">
      <figcaption className="text-sm font-semibold">{title}</figcaption>
      <div className="overflow-x-auto">{children}</div>
      <p className="text-xs text-muted-foreground">{caption}</p>
    </figure>
  );
}

const TONES = {
  orange: "border-orange-200 bg-orange-50 text-orange-900",
  blue: "border-sky-200 bg-sky-50 text-sky-900",
  green: "border-green-200 bg-green-50 text-green-900",
  violet: "border-violet-200 bg-violet-50 text-violet-900",
  rose: "border-rose-200 bg-rose-50 text-rose-900",
  amber: "border-amber-200 bg-amber-50 text-amber-900",
  slate: "border-slate-200 bg-slate-50 text-slate-900",
} as const;
export type Tone = keyof typeof TONES;

export type Step = { emoji?: string; title: string; text?: string; tone?: Tone; /** nhãn trên mũi tên dẫn tới bước này */ via?: string };

/** Sơ đồ quy trình: các bước nối bằng mũi tên (xuống dòng khi màn hình hẹp). */
export function Steps({ items, vertical = false }: { items: Step[]; vertical?: boolean }) {
  return (
    <div className={cn("flex flex-wrap items-stretch gap-y-2", vertical ? "flex-col" : "flex-row")}>
      {items.map((s, i) => (
        <div key={i} className={cn("flex items-center gap-1.5", vertical ? "flex-col" : "flex-row")}>
          {i > 0 && (
            <div className={cn("flex shrink-0 flex-col items-center px-1 text-muted-foreground", vertical && "py-1")}>
              {s.via && <span className="max-w-24 text-center text-[10px] leading-tight font-medium">{s.via}</span>}
              <span aria-hidden className="text-lg leading-none">{vertical ? "↓" : "→"}</span>
            </div>
          )}
          <div className={cn("flex h-full min-w-28 flex-col items-center justify-center rounded-xl border px-3 py-2 text-center", TONES[s.tone ?? "slate"])}>
            {s.emoji && <span aria-hidden className="text-2xl">{s.emoji}</span>}
            <span className="text-sm font-semibold leading-snug">{s.title}</span>
            {s.text && <span className="mt-0.5 text-xs leading-snug opacity-90">{s.text}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

export type HubItem = { emoji?: string; title: string; text?: string; tone?: Tone };

/** Sơ đồ tỏa: một khái niệm trung tâm và các nhánh liên quan. */
export function Hub({ center, items }: { center: { emoji?: string; title: string; text?: string }; items: HubItem[] }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-primary-foreground shadow">
        {center.emoji && <span aria-hidden className="text-2xl">{center.emoji}</span>}
        <div className="text-center">
          <p className="font-bold leading-tight">{center.title}</p>
          {center.text && <p className="text-xs opacity-90">{center.text}</p>}
        </div>
      </div>
      <div aria-hidden className="h-4 w-px bg-border" />
      <div className="grid w-full gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <div key={i} className={cn("flex items-start gap-2 rounded-xl border px-3 py-2", TONES[it.tone ?? "slate"])}>
            {it.emoji && <span aria-hidden className="text-2xl leading-none">{it.emoji}</span>}
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-snug">{it.title}</p>
              {it.text && <p className="text-xs leading-snug opacity-90">{it.text}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Bảng so sánh hai (hoặc nhiều) đối tượng. */
export function CompareTable({ cols, rows }: { cols: { title: string; tone: Tone }[]; rows: { label: string; cells: string[] }[] }) {
  return (
    <table className="w-full border-separate border-spacing-1 text-sm">
      <thead>
        <tr>
          <th />
          {cols.map((c) => <th key={c.title} className={cn("rounded-lg border px-3 py-2 text-center font-bold", TONES[c.tone])}>{c.title}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label}>
            <th className="px-2 py-1.5 text-left text-xs font-semibold text-muted-foreground">{r.label}</th>
            {r.cells.map((cell, i) => <td key={i} className={cn("rounded-lg border px-3 py-1.5 text-center", TONES[cols[i].tone])}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Danh sách phương trình hoá học (kiểu chữ đơn cách). */
export function Equations({ items }: { items: { label?: string; eq: string }[] }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((e, i) => (
        <li key={i} className="rounded-lg border border-orange-200 bg-orange-50/60 px-3 py-1.5 font-mono text-sm text-orange-950">
          {e.label && <span className="mr-2 font-sans text-xs font-semibold text-orange-700">{e.label}</span>}
          {e.eq}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ SVG ------------------------------------------------------------------ */

export const COLORS = { C: "#475569", H: "#f1f5f9", O: "#ef4444", N: "#3b82f6", Cl: "#22c55e", Br: "#a16207", S: "#eab308", Na: "#a78bfa" } as const;
type El = keyof typeof COLORS;

export type Atom = [El, number, number];
export type Bond = [number, number] | [number, number, 2];
export type MoleculeDef = { atoms: Atom[]; bonds: Bond[]; highlight?: number[]; label?: string };

/** Mô hình phân tử dạng quả cầu – que nối trên lưới (đơn vị lưới = 46 px). */
export function Molecule({ m, unit = 46, pad = 28 }: { m: MoleculeDef; unit?: number; pad?: number }) {
  const maxX = Math.max(...m.atoms.map((a) => a[1]));
  const maxY = Math.max(...m.atoms.map((a) => a[2]));
  const W = maxX * unit + pad * 2;
  const H = maxY * unit + pad * 2;
  const pos = (i: number) => ({ x: pad + m.atoms[i][1] * unit, y: pad + m.atoms[i][2] * unit });
  return (
    <svg viewBox={`0 0 ${W} ${H + (m.label ? 20 : 0)}`} className="mx-auto h-auto max-w-full" style={{ width: W }} role="img" aria-label={m.label ?? "Mô hình phân tử"}>
      {m.bonds.map((b, i) => {
        const p = pos(b[0]);
        const q = pos(b[1]);
        const dx = q.x - p.x, dy = q.y - p.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = (-dy / len) * 3, ny = (dx / len) * 3;
        return b[2] === 2 ? (
          <g key={i} stroke="#334155" strokeWidth={3}>
            <line x1={p.x + nx} y1={p.y + ny} x2={q.x + nx} y2={q.y + ny} /><line x1={p.x - nx} y1={p.y - ny} x2={q.x - nx} y2={q.y - ny} />
          </g>
        ) : (
          <line key={i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#334155" strokeWidth={3.5} />
        );
      })}
      {m.atoms.map(([el], i) => {
        const { x, y } = pos(i);
        const hl = m.highlight?.includes(i);
        return (
          <g key={i}>
            {hl && <circle cx={x} cy={y} r={(el === "H" ? 13 : 19) + 6} fill="#fde68a" opacity={0.8} />}
            <circle cx={x} cy={y} r={el === "H" ? 13 : 19} fill={COLORS[el]} stroke="#1e293b" strokeWidth={1.5} />
            <text x={x} y={y + 5} textAnchor="middle" fontSize={el === "H" ? 12 : 15} fontWeight={700} fill={el === "H" ? "#0f172a" : "#ffffff"}>{el}</text>
          </g>
        );
      })}
      {m.label && <text x={W / 2} y={H + 14} textAnchor="middle" fontSize={13} fill="#475569" fontWeight={600}>{m.label}</text>}
    </svg>
  );
}

/** Alkane mạch thẳng CₙH₂ₙ₊₂ trên lưới. */
export function alkane(n: number, label?: string): MoleculeDef {
  const atoms: Atom[] = [];
  const bonds: Bond[] = [];
  for (let i = 0; i < n; i++) atoms.push(["C", i + 1, 1]);
  for (let i = 0; i < n; i++) {
    atoms.push(["H", i + 1, 0]); bonds.push([i, atoms.length - 1]);
    atoms.push(["H", i + 1, 2]); bonds.push([i, atoms.length - 1]);
  }
  atoms.push(["H", 0, 1]); bonds.push([0, atoms.length - 1]);
  atoms.push(["H", n + 1, 1]); bonds.push([n - 1, atoms.length - 1]);
  for (let i = 0; i + 1 < n; i++) bonds.push([i, i + 1]);
  return { atoms, bonds, label };
}

export function BarChart({ data, unit, max, height = 170, valueDigits = 1 }: { data: { label: string; value: number; color?: string; note?: string }[]; unit: string; max?: number; height?: number; valueDigits?: number }) {
  const M = max ?? Math.max(...data.map((d) => d.value)) * 1.15;
  const bw = 54, gap = 22, left = 38, W = left + data.length * (bw + gap) + 10;
  const H = height + 54;
  const fmtv = (v: number) => v.toLocaleString("vi-VN", { maximumFractionDigits: valueDigits });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto max-w-full" style={{ width: Math.max(W, 280) }} role="img" aria-label={`Biểu đồ cột (${unit})`}>
      <line x1={left - 4} y1={14} x2={left - 4} y2={14 + height} stroke="#94a3b8" />
      <line x1={left - 4} y1={14 + height} x2={W - 6} y2={14 + height} stroke="#94a3b8" />
      <text x={4} y={12} fontSize={11} fill="#64748b">{unit}</text>
      {data.map((d, i) => {
        const h = (d.value / M) * height;
        const x = left + i * (bw + gap) + gap / 2;
        return (
          <g key={d.label}>
            <rect x={x} y={14 + height - h} width={bw} height={h} rx={5} fill={d.color ?? "#f97316"} />
            <text x={x + bw / 2} y={14 + height - h - 5} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0f172a">{fmtv(d.value)}</text>
            <text x={x + bw / 2} y={14 + height + 16} textAnchor="middle" fontSize={11} fill="#334155" fontWeight={600}>{d.label}</text>
            {d.note && <text x={x + bw / 2} y={14 + height + 30} textAnchor="middle" fontSize={10} fill="#64748b">{d.note}</text>}
          </g>
        );
      })}
    </svg>
  );
}

export function PieChart({ data, size = 190 }: { data: { label: string; value: number; color: string }[]; size?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = size / 2 - 6, c = size / 2;
  const starts = data.reduce<number[]>((acc, d, i) => [...acc, i === 0 ? -Math.PI / 2 : acc[i - 1] + (data[i - 1].value / total) * Math.PI * 2], []);
  return (
    <div className="flex flex-wrap items-center justify-center gap-5">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="Biểu đồ tròn">
        {data.map((d, i) => {
          const a0 = starts[i];
          const a1 = a0 + (d.value / total) * Math.PI * 2;
          const large = a1 - a0 > Math.PI ? 1 : 0;
          const path = `M${c},${c} L${c + r * Math.cos(a0)},${c + r * Math.sin(a0)} A${r},${r} 0 ${large} 1 ${c + r * Math.cos(a1)},${c + r * Math.sin(a1)} Z`;
          return <path key={d.label} d={path} fill={d.color} stroke="#fff" strokeWidth={1.5} />;
        })}
      </svg>
      <ul className="grid gap-1 text-sm">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2">
            <i className="size-3 rounded-sm" style={{ background: d.color }} />
            <span className="w-24 font-medium">{d.label}</span>
            <span className="tabular-nums text-muted-foreground">{d.value.toLocaleString("vi-VN")}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LineChart({ points, xLabel, yLabel, yMax, xTicks }: { points: [number, number][]; xLabel: string; yLabel: string; yMax: number; xTicks: number[] }) {
  const W = 420, H = 230, L = 46, B = 36, T = 14, R = 14;
  const xs = points.map((p) => p[0]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const sx = (x: number) => L + ((x - x0) / (x1 - x0)) * (W - L - R);
  const sy = (y: number) => H - B - (y / yMax) * (H - B - T);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto max-w-full" style={{ width: W }} role="img" aria-label={`${yLabel} theo ${xLabel}`}>
      {[0.25, 0.5, 0.75, 1].map((f) => <line key={f} x1={L} x2={W - R} y1={sy(yMax * f)} y2={sy(yMax * f)} stroke="#e2e8f0" />)}
      <line x1={L} y1={T} x2={L} y2={H - B} stroke="#64748b" /><line x1={L} y1={H - B} x2={W - R} y2={H - B} stroke="#64748b" />
      <polyline fill="none" stroke="#ea580c" strokeWidth={3} points={points.map(([x, y]) => `${sx(x)},${sy(y)}`).join(" ")} />
      {points.map(([x, y]) => <circle key={x} cx={sx(x)} cy={sy(y)} r={4} fill="#ea580c" />)}
      {xTicks.map((x) => <text key={x} x={sx(x)} y={H - B + 16} textAnchor="middle" fontSize={11} fill="#475569">{x}</text>)}
      {[0, yMax / 2, yMax].map((y) => <text key={y} x={L - 6} y={sy(y) + 4} textAnchor="end" fontSize={11} fill="#475569">{y.toLocaleString("vi-VN")}</text>)}
      <text x={W / 2} y={H - 4} textAnchor="middle" fontSize={11} fill="#64748b">{xLabel}</text>
      <text x={10} y={T + 4} fontSize={11} fill="#64748b">{yLabel}</text>
    </svg>
  );
}
