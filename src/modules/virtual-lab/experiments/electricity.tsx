"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Formula, fmt, LabLayout, Observation, Readout, RunControls, Segmented, Slider, Stage, useAnimationLoop, useLab, useOnReset, useSnapshot } from "@/components/experiments/lab-kit";
import { SGK_PRESETS, type PresetKey } from "./sgk-presets";
import { cn } from "@/lib/utils";

/** Đường dây dẫn có dòng điện chạy (hoạt ảnh nét đứt chạy theo chiều dòng điện). */
function Wire({ d, current, closed }: { d: string; current: number; closed: boolean }) {
  const speed = closed && current > 0 ? Math.max(0.25, 2.5 / (current * 3 + 0.2)) : 0;
  return (
    <g>
      <path d={d} fill="none" stroke="#57534e" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      {speed > 0 && (
        <path d={d} fill="none" stroke="#fbbf24" strokeWidth={2.5} strokeDasharray="4 8" strokeLinecap="round" style={{ animation: `flow ${speed}s linear infinite` }} />
      )}
    </g>
  );
}

function Meter({ x, y, label, value, unit, kind }: { x: number; y: number; label: string; value: string; unit: string; kind: "A" | "V" }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={24} fill="white" stroke={kind === "A" ? "#dc2626" : "#2563eb"} strokeWidth={3} />
      <text textAnchor="middle" y={-4} fontSize={14} fontWeight={800} fill={kind === "A" ? "#dc2626" : "#2563eb"}>{label}</text>
      <text textAnchor="middle" y={12} fontSize={10} fontFamily="monospace" fill="#1c1917">{value} {unit}</text>
    </g>
  );
}

function Resistor({ x, y, label, vertical = false }: { x: number; y: number; label: string; vertical?: boolean }) {
  return vertical ? (
    <g>
      <rect x={x - 10} y={y - 26} width={20} height={52} rx={3} fill="#fef3c7" stroke="#b45309" strokeWidth={2} />
      <text x={x + 16} y={y + 4} fontSize={12} fontWeight={700} fill="#92400e">{label}</text>
    </g>
  ) : (
    <g>
      <rect x={x - 28} y={y - 10} width={56} height={20} rx={3} fill="#fef3c7" stroke="#b45309" strokeWidth={2} />
      <text x={x - 14} y={y - 16} fontSize={12} fontWeight={700} fill="#92400e">{label}</text>
    </g>
  );
}

function Battery({ x, y, U }: { x: number; y: number; U: number }) {
  return (
    <g>
      <line x1={x - 6} x2={x - 6} y1={y - 18} y2={y + 18} stroke="#1c1917" strokeWidth={3} />
      <line x1={x + 6} x2={x + 6} y1={y - 10} y2={y + 10} stroke="#1c1917" strokeWidth={6} />
      <text x={x - 30} y={y - 24} fontSize={12} fontWeight={700} fill="#1c1917">Nguồn {fmt(U, 1)} V</text>
      <text x={x - 16} y={y + 4} fontSize={12} fill="#dc2626">+</text>
      <text x={x + 12} y={y + 4} fontSize={12} fill="#1c1917">−</text>
    </g>
  );
}

function Switch({ x, y, closed }: { x: number; y: number; closed: boolean }) {
  return (
    <g>
      <circle cx={x - 18} cy={y} r={4} fill="#1c1917" />
      <circle cx={x + 18} cy={y} r={4} fill="#1c1917" />
      <line x1={x - 18} y1={y} x2={closed ? x + 18 : x + 12} y2={closed ? y : y - 18} stroke="#1c1917" strokeWidth={4} strokeLinecap="round" />
      <text x={x - 4} y={y + 22} fontSize={12} fontWeight={700}>K</text>
    </g>
  );
}

/* ======================================================================== */
/* Bài 11 – Định luật Ohm                                                   */
/* ======================================================================== */

/** R₁ = 6 Ω khớp Bảng 11.2 của SGK (U = 3 V → I = 0,5 A; U = 9 V → I = 1,5 A). */
const RESISTORS = { R1: 6, R2: 12, R3: 24 } as const;
type RKey = keyof typeof RESISTORS;
const SERIES_COLORS: Record<RKey, string> = { R1: "#ea580c", R2: "#2563eb", R3: "#16a34a" };

export function OhmLawLab() {
  const { running: closed, addRecord, records } = useLab();
  const [rk, setRk] = useState<RKey>("R1");
  const [U, setU] = useState(6);
  useSnapshot({ dien_tro: rk, R_ohm: RESISTORS[rk], U_V: U });
  const R = RESISTORS[rk];
  const I = closed ? U / R : 0;

  // dữ liệu đồ thị từ bảng số liệu
  const chartData = [0, 3, 6, 9, 12].map((u) => {
    const row: Record<string, number | null> = { U: u };
    (Object.keys(RESISTORS) as RKey[]).forEach((k) => {
      const rec = records.find((r) => r["Điện trở"] === k && Number(r["U (V)"]) === u);
      row[k] = rec ? Number(rec["I (A)"]) : null;
    });
    return row;
  });

  return (
    <LabLayout
      stage={
        <Stage>
          <svg viewBox="0 0 600 260" className="w-full" role="img" aria-label="Mạch điện khảo sát định luật Ohm">
            <Wire d="M110,60 L250,60" current={I} closed={closed} />
            <Wire d="M350,60 L500,60 L500,200 L360,200" current={I} closed={closed} />
            <Wire d="M240,200 L110,200 L110,60" current={I} closed={closed} />
            <Battery x={110} y={130} U={U} />
            <Meter x={300} y={60} label="A" value={fmt(I, 2)} unit="A" kind="A" />
            <Resistor x={300} y={200} label={`${rk} = ${R} Ω`} />
            <Switch x={500} y={130} closed={closed} />
            {/* vôn kế mắc song song với điện trở */}
            <path d="M250,200 L250,245 L280,245" fill="none" stroke="#57534e" strokeWidth={2} />
            <path d="M350,200 L350,245 L320,245" fill="none" stroke="#57534e" strokeWidth={2} />
            <Meter x={300} y={240} label="V" value={fmt(closed ? U : 0, 1)} unit="V" kind="V" />
            {!closed && <text x={380} y={30} fontSize={13} fill="#9a3412" fontWeight={600}>Khoá K đang mở</text>}
          </svg>
        </Stage>
      }
      readouts={
        <>
          <Readout label="Hiệu điện thế U" value={fmt(closed ? U : 0, 1)} unit="V" tone="blue" />
          <Readout label="Cường độ I" value={fmt(I, 3)} unit="A" tone="red" />
          <Readout label="Tỉ số U/I" value={closed && I > 0 ? fmt(U / I, 1) : "—"} unit="Ω" tone="green" />
          <Readout label="Độ sáng bóng đèn (TN 1 SGK)" value={!closed || I === 0 ? "Không sáng" : I > 1.2 ? "Sáng mạnh" : I > 0.6 ? "Sáng vừa" : "Sáng yếu"} tone="orange" />
        </>
      }
      controls={
        <>
          <Segmented label="Vật dẫn (R₁ < R₂ < R₃)" value={rk} options={(Object.keys(RESISTORS) as RKey[]).map((k) => ({ value: k, label: `${k} = ${RESISTORS[k]} Ω` }))} onChange={setRk} />
          <Segmented label="Hiệu điện thế nguồn U" value={String(U)} options={[0, 3, 6, 9, 12].map((u) => ({ value: String(u), label: `${u} V` }))} onChange={(v) => setU(Number(v))} />
          <RunControls startLabel="Đóng khoá K" onRecord={() => closed && addRecord({ "Điện trở": rk, "R (Ω)": R, "U (V)": U, "I (A)": Number(I.toFixed(3)), "U/I (Ω)": I > 0 ? Number((U / I).toFixed(1)) : "—" })} />
          {!closed && <p className="text-xs text-muted-foreground">Đóng khoá K để dòng điện chạy, sau đó mới ghi số liệu.</p>}
        </>
      }
      formula={<Formula>I = U / R<br />R = U / I (không đổi với một vật dẫn)</Formula>}
      below={
        <div className="rounded-2xl border bg-card p-3">
          <p className="mb-1 text-sm font-semibold">Đồ thị I – U (từ bảng số liệu)</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 12, bottom: 16, left: -10 }}>
                <CartesianGrid stroke="#f0e4d8" />
                <XAxis dataKey="U" type="number" domain={[0, 12]} ticks={[0, 3, 6, 9, 12]} tick={{ fontSize: 11 }} label={{ value: "U (V)", position: "insideBottomRight", offset: -8, fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} label={{ value: "I (A)", angle: -90, position: "insideLeft", offset: 20, fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${v} A`]} labelFormatter={(u) => `U = ${u} V`} />
                {(Object.keys(RESISTORS) as RKey[]).map((k) => (
                  <Line key={k} type="linear" dataKey={k} name={`${k} = ${RESISTORS[k]} Ω`} stroke={SERIES_COLORS[k]} strokeWidth={2} dot={{ r: 4 }} connectNulls />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 text-xs">
            {(Object.keys(RESISTORS) as RKey[]).map((k) => (
              <span key={k} className="flex items-center gap-1"><i className="h-0.5 w-4" style={{ background: SERIES_COLORS[k] }} /> {k} = {RESISTORS[k]} Ω</span>
            ))}
          </div>
        </div>
      }
    />
  );
}

/* ======================================================================== */
/* Bài 12 – Đoạn mạch nối tiếp, song song                                   */
/* ======================================================================== */

export function SeriesParallelLab() {
  const { running: closed, addRecord } = useLab();
  const [mode, setModeRaw] = useState<"series" | "parallel">("series");
  const [R1, setR1Raw] = useState(6);
  const [R2, setR2Raw] = useState(10);
  const [U, setURaw] = useState(12);
  const [preset, setPreset] = useState<PresetKey>("s12");
  const free = <T,>(set: (v: T) => void) => (v: T) => { set(v); setPreset("free"); };
  const setMode = free(setModeRaw), setR1 = free(setR1Raw), setR2 = free(setR2Raw), setU = free(setURaw);
  const pickPreset = (k: PresetKey) => {
    setPreset(k);
    const p = SGK_PRESETS[k];
    if ("mode" in p) { setModeRaw(p.mode); setR1Raw(p.R1); setR2Raw(p.R2); setURaw(p.U); }
  };
  useSnapshot({ cach_mac: mode, R1, R2, U, phep_do_sgk: preset });

  const Rtd = mode === "series" ? R1 + R2 : (R1 * R2) / (R1 + R2);
  const I = closed ? U / Rtd : 0;
  const I1 = closed ? (mode === "series" ? I : U / R1) : 0;
  const I2 = closed ? (mode === "series" ? I : U / R2) : 0;
  const U1 = closed ? I1 * R1 : 0;
  const U2 = closed ? I2 * R2 : 0;

  return (
    <LabLayout
      stage={
        <Stage>
          <svg viewBox="0 0 600 280" className="w-full" role="img" aria-label={mode === "series" ? "Đoạn mạch nối tiếp" : "Đoạn mạch song song"}>
            <Battery x={80} y={140} U={U} />
            <Wire d="M80,122 L80,40 L170,40" current={I} closed={closed} />
            <Meter x={195} y={40} label="A" value={fmt(I, 2)} unit="A" kind="A" />
            {mode === "series" ? (
              <>
                <Wire d="M220,40 L520,40 L520,240 L80,240 L80,158" current={I} closed={closed} />
                <Resistor x={310} y={40} label={`R₁ = ${R1} Ω`} />
                <Resistor x={450} y={40} label={`R₂ = ${R2} Ω`} />
                <Meter x={310} y={110} label="V₁" value={fmt(U1, 2)} unit="V" kind="V" />
                <Meter x={450} y={110} label="V₂" value={fmt(U2, 2)} unit="V" kind="V" />
                <path d="M282,40 L282,110 L286,110 M338,40 L338,110 L334,110" fill="none" stroke="#a8a29e" strokeWidth={1.5} />
                <path d="M422,40 L422,110 L426,110 M478,40 L478,110 L474,110" fill="none" stroke="#a8a29e" strokeWidth={1.5} />
                <Switch x={300} y={240} closed={closed} />
              </>
            ) : (
              <>
                <Wire d="M220,40 L280,40 L280,90 M280,40 L280,190" current={I} closed={closed} />
                <Wire d="M280,90 L340,90" current={I1} closed={closed} />
                <Wire d="M400,90 L440,90 L440,90" current={I1} closed={closed} />
                <Wire d="M280,190 L340,190" current={I2} closed={closed} />
                <Wire d="M400,190 L440,190" current={I2} closed={closed} />
                <Meter x={470} y={90} label="A₁" value={fmt(I1, 2)} unit="A" kind="A" />
                <Meter x={470} y={190} label="A₂" value={fmt(I2, 2)} unit="A" kind="A" />
                <Wire d="M494,90 L540,90 L540,190 M494,190 L540,190 L540,250 L80,250 L80,158" current={I} closed={closed} />
                <Resistor x={370} y={90} label={`R₁ = ${R1} Ω`} />
                <Resistor x={370} y={190} label={`R₂ = ${R2} Ω`} />
                <Meter x={370} y={140} label="V" value={fmt(closed ? U : 0, 1)} unit="V" kind="V" />
                <Switch x={300} y={250} closed={closed} />
              </>
            )}
          </svg>
        </Stage>
      }
      readouts={
        <>
          <Readout label="R tương đương" value={fmt(Rtd, 2)} unit="Ω" tone="green" />
          <Readout label="I mạch chính" value={fmt(I, 3)} unit="A" tone="red" />
          <Readout label="I₁ / I₂" value={`${fmt(I1, 2)} / ${fmt(I2, 2)}`} unit="A" />
          <Readout label="U₁ / U₂" value={`${fmt(U1, 2)} / ${fmt(U2, 2)}`} unit="V" tone="blue" />
        </>
      }
      controls={
        <>
          <Segmented label="Phép đo trong SGK (Hình 12.2 – 12.4)" value={preset} options={(Object.keys(SGK_PRESETS) as PresetKey[]).map((k) => ({ value: k, label: SGK_PRESETS[k].label }))} onChange={(v) => pickPreset(v as PresetKey)} />
          <Segmented label="Cách mắc" value={mode} options={[{ value: "series", label: "Nối tiếp" }, { value: "parallel", label: "Song song" }]} onChange={setMode} />
          <Slider label="Điện trở R₁" value={R1} min={1} max={60} step={1} unit="Ω" digits={0} onChange={setR1} />
          <Slider label="Điện trở R₂" value={R2} min={1} max={60} step={1} unit="Ω" digits={0} onChange={setR2} />
          <Slider label="Hiệu điện thế U" value={U} min={0} max={12} step={0.5} unit="V" digits={1} onChange={setU} />
          <RunControls
            startLabel="Đóng khoá K"
            onRecord={() => closed && addRecord({ "Phép đo": SGK_PRESETS[preset].label, "Cách mắc": mode === "series" ? "Nối tiếp" : "Song song", "R₁ (Ω)": R1, "R₂ (Ω)": R2, "R_tđ (Ω)": Number(Rtd.toFixed(2)), "U (V)": U, "I (A)": Number(I.toFixed(3)), "I₁ (A)": Number(I1.toFixed(3)), "I₂ (A)": Number(I2.toFixed(3)), "U₁ (V)": Number(U1.toFixed(2)), "U₂ (V)": Number(U2.toFixed(2)) })}
          />
        </>
      }
      formula={
        mode === "series" ? (
          <Formula>I = I₁ = I₂<br />U = U₁ + U₂<br />R_tđ = R₁ + R₂</Formula>
        ) : (
          <Formula>U = U₁ = U₂<br />I = I₁ + I₂<br />1/R_tđ = 1/R₁ + 1/R₂</Formula>
        )
      }
      below={
        closed ? (
          <Observation tone="success">
            {mode === "series"
              ? `Số chỉ ampe kế như nhau ở mọi điểm. U₁ + U₂ = ${fmt(U1 + U2, 2)} V = U.`
              : `I₁ + I₂ = ${fmt(I1 + I2, 3)} A = I mạch chính. R_tđ = ${fmt(Rtd, 2)} Ω nhỏ hơn mỗi điện trở thành phần.`}
            {"book" in SGK_PRESETS[preset] && ` Số liệu đo trong SGK: ${SGK_PRESETS[preset].book} (có thể lệch rất nhỏ do sai số dụng cụ).`}
          </Observation>
        ) : (
          <Observation>Bấm <b>Đóng khoá K</b> để đo.</Observation>
        )
      }
    />
  );
}

/* ======================================================================== */
/* Bài 13 – Năng lượng điện, công suất điện                                 */
/* ======================================================================== */

const DEVICES = [
  { id: "led", name: "Đèn LED", P: 9, icon: "💡", hours: 6 },
  { id: "fan", name: "Quạt điện", P: 50, icon: "🌀", hours: 8 },
  { id: "tv", name: "Ti vi", P: 100, icon: "📺", hours: 4 },
  { id: "fridge", name: "Tủ lạnh", P: 120, icon: "🧊", hours: 24 },
  { id: "rice", name: "Nồi cơm điện", P: 600, icon: "🍚", hours: 1 },
  { id: "iron", name: "Bàn là", P: 1000, icon: "👕", hours: 0.5 },
  { id: "ac", name: "Điều hoà", P: 1000, icon: "❄️", hours: 6 },
  { id: "kettle", name: "Ấm siêu tốc", P: 1500, icon: "☕", hours: 0.5 },
] as const;

export function ElectricPowerLab() {
  const { running, addRecord } = useLab();
  const [on, setOn] = useState<Record<string, boolean>>({ led: true, fan: true, tv: true, fridge: true });
  const [hours, setHours] = useState<Record<string, number>>(Object.fromEntries(DEVICES.map((d) => [d.id, d.hours])));
  const [price, setPrice] = useState(2500);
  const [meter, setMeter] = useState({ kwh: 0, hours: 0 }); // công tơ & giờ mô phỏng

  const active = DEVICES.filter((d) => on[d.id]);
  const P = active.reduce((s, d) => s + d.P, 0); // W
  const I = P / 220;
  const perDay = active.reduce((s, d) => s + (d.P * hours[d.id]) / 1000, 0);
  const perMonth = perDay * 30;
  useSnapshot({ thiet_bi: active.map((d) => d.name), cong_suat_W: P, kWh_ngay: perDay });

  // 1 giây thực = 1 giờ mô phỏng, công tơ đếm theo công suất tức thời
  useAnimationLoop(running, (dt) => setMeter({ kwh: meter.kwh + (P / 1000) * dt, hours: meter.hours + dt }));
  useOnReset(() => setMeter({ kwh: 0, hours: 0 }));

  const chart = DEVICES.filter((d) => on[d.id]).map((d) => ({ name: d.name, kWh: Number(((d.P * hours[d.id] * 30) / 1000).toFixed(1)) }));

  return (
    <LabLayout
      stage={
        <Stage>
          <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-4">
            {DEVICES.map((d) => (
              <button
                key={d.id}
                type="button"
                aria-pressed={!!on[d.id]}
                onClick={() => setOn({ ...on, [d.id]: !on[d.id] })}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border-2 px-2 py-3 text-center text-sm transition-all",
                  on[d.id] ? "border-orange-400 bg-orange-50 shadow-sm" : "border-stone-200 bg-white opacity-70",
                )}
              >
                <span className={cn("text-3xl", on[d.id] && running && "animate-pulse")}>{d.icon}</span>
                <span className="font-medium">{d.name}</span>
                <span className="font-mono text-xs text-muted-foreground">{d.P} W</span>
              </button>
            ))}
          </div>
          <div className="mx-3 mb-3 flex items-center justify-between rounded-xl bg-stone-900 px-4 py-3 font-mono text-green-400">
            <span className="text-xs text-stone-400">CÔNG TƠ ĐIỆN</span>
            <span className="text-2xl tabular-nums">{meter.kwh.toFixed(3).padStart(8, "0")} kWh</span>
            <span className="text-xs text-stone-400">{fmt(meter.hours, 1)} giờ</span>
          </div>
        </Stage>
      }
      readouts={
        <>
          <Readout label="Tổng công suất" value={fmt(P, 0)} unit="W" tone="orange" />
          <Readout label="Cường độ (220 V)" value={fmt(I, 2)} unit="A" />
          <Readout label="Điện năng / ngày" value={fmt(perDay, 2)} unit="kWh" tone="blue" />
          <Readout label="Điện năng / tháng" value={fmt(perMonth, 1)} unit="kWh" tone="green" />
          <Readout label="Tiền điện ước tính" value={fmt(perMonth * price, 0)} unit="đ/tháng" tone="red" />
        </>
      }
      controls={
        <>
          <p className="text-sm font-medium">Số giờ dùng mỗi ngày</p>
          {active.length === 0 && <p className="text-sm text-muted-foreground">Bấm vào thiết bị để bật.</p>}
          {active.map((d) => (
            <Slider key={d.id} label={`${d.icon} ${d.name}`} value={hours[d.id]} min={0} max={24} step={0.5} unit="h" digits={1} onChange={(v) => setHours({ ...hours, [d.id]: v })} />
          ))}
          <Slider label="Đơn giá điện (tham khảo)" value={price} min={1500} max={4000} step={50} unit="đ/kWh" digits={0} onChange={setPrice} />
          <RunControls startLabel="Chạy công tơ" onRecord={() => addRecord({ "Thiết bị bật": active.length, "P (W)": P, "I (A)": Number(I.toFixed(2)), "kWh/ngày": Number(perDay.toFixed(2)), "kWh/tháng": Number(perMonth.toFixed(1)), "Tiền (đ)": Math.round(perMonth * price) })} />
        </>
      }
      formula={<Formula>P = U·I<br />W = P·t (kWh)<br />1 kWh = 3,6·10⁶ J</Formula>}
      below={
        chart.length > 0 ? (
          <div className="rounded-2xl border bg-card p-3">
            <p className="mb-1 text-sm font-semibold">Điện năng tiêu thụ mỗi tháng theo thiết bị (kWh)</p>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                  <CartesianGrid vertical={false} stroke="#f0e4d8" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`${v} kWh`, "Điện năng"]} />
                  <Bar dataKey="kWh" fill="#ea580c" radius={[4, 4, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : null
      }
    />
  );
}
