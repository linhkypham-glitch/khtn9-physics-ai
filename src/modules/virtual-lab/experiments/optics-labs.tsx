"use client";

import { useMemo, useState } from "react";

import { Formula, fmt, LabLayout, Observation, Readout, RunControls, Segmented, Slider, Stage, useLab, useOnReset, useSnapshot } from "@/components/experiments/lab-kit";
import { Button } from "@/components/ui/button";
import {
  criticalAngle,
  describeImage,
  MEDIA,
  type MediumKey,
  prismDeviation,
  rad,
  raySegment,
  refractVec,
  snell,
  SPECTRUM,
  thinLens,
  type Vec,
} from "../optics";

const RAY = "#f97316";

/** Vòng tròn chia độ quanh tâm (cx, cy). */
function Protractor({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#a8a29e" />
      {Array.from({ length: 36 }).map((_, i) => {
        const a = rad(i * 10);
        const long = i % 3 === 0;
        return (
          <line key={i} x1={cx + Math.sin(a) * r} y1={cy - Math.cos(a) * r} x2={cx + Math.sin(a) * (r - (long ? 10 : 5))} y2={cy - Math.cos(a) * (r - (long ? 10 : 5))} stroke="#78716c" />
        );
      })}
      {[0, 30, 60, 90].map((a) => (
        <g key={a} fontSize={9} fill="#78716c">
          <text x={cx - Math.sin(rad(a)) * (r + 12) - 6} y={cy - Math.cos(rad(a)) * (r + 12) + 3}>{a}°</text>
          {a > 0 && <text x={cx + Math.sin(rad(a)) * (r + 12) - 6} y={cy + Math.cos(rad(a)) * (r + 12) + 3}>{a}°</text>}
        </g>
      ))}
      <line x1={cx} x2={cx} y1={cy - r - 4} y2={cy + r + 4} stroke="#78716c" strokeDasharray="5 4" />
      <text x={cx + 4} y={cy - r + 14} fontSize={10} fill="#78716c">N</text>
      <text x={cx + 4} y={cy + r - 6} fontSize={10} fill="#78716c">N&apos;</text>
    </g>
  );
}

function Ray({ from, to, opacity = 1, color = RAY, dashed = false, animate = false }: { from: Vec; to: Vec; opacity?: number; color?: string; dashed?: boolean; animate?: boolean }) {
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      opacity={opacity}
      strokeDasharray={dashed ? "6 5" : animate ? "14 6" : undefined}
      className={animate && !dashed ? "animate-[ray_0.8s_linear_infinite]" : undefined}
    />
  );
}

function Arc({ cx, cy, r, a1, a2, label, color = "#c2410c" }: { cx: number; cy: number; r: number; a1: number; a2: number; label: string; color?: string }) {
  // góc tính từ trục hướng lên (0°) theo chiều kim đồng hồ, đơn vị độ
  const p = (a: number) => ({ x: cx + Math.sin(rad(a)) * r, y: cy - Math.cos(rad(a)) * r });
  const s = p(a1);
  const e = p(a2);
  const large = Math.abs(a2 - a1) > 180 ? 1 : 0;
  const sweep = a2 > a1 ? 1 : 0;
  const m = p((a1 + a2) / 2);
  return (
    <g>
      <path d={`M${s.x},${s.y} A${r},${r} 0 ${large} ${sweep} ${e.x},${e.y}`} fill="none" stroke={color} strokeWidth={1.5} />
      <text x={m.x + (m.x > cx ? 4 : -14)} y={m.y + 4} fontSize={12} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

/* ======================================================================== */
/* Bài 5 – Khúc xạ ánh sáng                                                 */
/* ======================================================================== */

export function RefractionLab() {
  const { running, addRecord } = useLab();
  const [m1, setM1] = useState<MediumKey>("air");
  const [m2, setM2] = useState<MediumKey>("glass");
  const [i, setI] = useState(40);
  useSnapshot({ moi_truong_1: MEDIA[m1].label, moi_truong_2: MEDIA[m2].label, goc_toi: i });

  const n1 = MEDIA[m1].n;
  const n2 = MEDIA[m2].n;
  const r = snell(i, n1, n2);
  const C = { x: 300, y: 160 };
  const R = 130;
  const src = { x: C.x - Math.sin(rad(i)) * R, y: C.y - Math.cos(rad(i)) * R };
  const refl = { x: C.x + Math.sin(rad(i)) * R, y: C.y - Math.cos(rad(i)) * R };
  const refr = r === null ? null : { x: C.x + Math.sin(rad(r)) * R, y: C.y + Math.cos(rad(r)) * R };
  const ratio = r && r > 0 ? Math.sin(rad(i)) / Math.sin(rad(r)) : null;

  return (
    <LabLayout
      stage={
        <Stage>
          <svg viewBox="0 0 600 320" className="w-full" role="img" aria-label="Khúc xạ ánh sáng qua mặt phân cách">
            <rect x={0} y={0} width={600} height={C.y} fill={MEDIA[m1].fill} />
            <rect x={0} y={C.y} width={600} height={320 - C.y} fill={MEDIA[m2].fill} />
            <line x1={0} x2={600} y1={C.y} y2={C.y} stroke="#57534e" strokeWidth={2} />
            <text x={12} y={22} fontSize={13} fontWeight={600} fill="#44403c">{MEDIA[m1].label} (n₁ = {fmt(n1)})</text>
            <text x={12} y={C.y + 24} fontSize={13} fontWeight={600} fill="#44403c">{MEDIA[m2].label} (n₂ = {fmt(n2)})</text>
            <Protractor cx={C.x} cy={C.y} r={R} />
            {running && (
              <>
                <Ray from={src} to={C} animate />
                <Ray from={C} to={refl} opacity={r === null ? 1 : 0.25} />
                {refr && <Ray from={C} to={refr} animate />}
                <Arc cx={C.x} cy={C.y} r={42} a1={-i} a2={0} label="i" />
                {r !== null && <Arc cx={C.x} cy={C.y} r={48} a1={180} a2={180 - r} label="r" color="#0369a1" />}
                <circle cx={src.x} cy={src.y} r={7} fill="#fde047" stroke="#ca8a04" />
              </>
            )}
            <circle cx={C.x} cy={C.y} r={3} fill="#1c1917" />
            <text x={C.x - 14} y={C.y - 6} fontSize={11} fill="#1c1917">I</text>
          </svg>
        </Stage>
      }
      readouts={
        <>
          <Readout label="Góc tới i" value={fmt(i, 1)} unit="°" tone="orange" />
          <Readout label="Góc khúc xạ r" value={r === null ? "—" : fmt(r, 1)} unit="°" tone="blue" />
          <Readout label="sin i / sin r" value={ratio === null ? "—" : fmt(ratio, 3)} />
          <Readout label="n₂ / n₁" value={fmt(n2 / n1, 3)} tone="green" />
        </>
      }
      controls={
        <>
          <Segmented label="Môi trường 1 (chứa tia tới)" value={m1} options={Object.entries(MEDIA).map(([k, v]) => ({ value: k as MediumKey, label: v.label }))} onChange={setM1} />
          <Segmented label="Môi trường 2" value={m2} options={Object.entries(MEDIA).map(([k, v]) => ({ value: k as MediumKey, label: v.label }))} onChange={setM2} />
          <Slider label="Góc tới i" value={i} min={0} max={85} step={1} unit="°" digits={0} onChange={setI} />
          <RunControls
            startLabel="Bật nguồn sáng"
            onRecord={() =>
              running && addRecord({ "i (°)": i, "r (°)": r === null ? "PXTP" : Number(r.toFixed(1)), "sin i": Number(Math.sin(rad(i)).toFixed(3)), "sin r": r === null ? "—" : Number(Math.sin(rad(r)).toFixed(3)), "sin i/sin r": ratio === null ? "—" : Number(ratio.toFixed(3)) })
            }
          />
        </>
      }
      formula={<Formula>sin i / sin r = n₂ / n₁<br />n = c / v</Formula>}
      below={
        !running ? (
          <Observation>Bấm <b>Bật nguồn sáng</b> để chiếu tia sáng tới điểm I.</Observation>
        ) : r === null ? (
          <Observation tone="warning">Không có tia khúc xạ: ánh sáng bị phản xạ toàn phần (xem Bài 6).</Observation>
        ) : (
          <Observation tone="success">
            {n2 > n1 ? "Ánh sáng đi vào môi trường chiết quang hơn: r < i, tia khúc xạ lệch gần pháp tuyến." : n2 < n1 ? "Ánh sáng đi vào môi trường chiết quang kém: r > i, tia khúc xạ lệch xa pháp tuyến." : "Hai môi trường giống nhau: ánh sáng truyền thẳng."}
          </Observation>
        )
      }
    />
  );
}

/* ======================================================================== */
/* Bài 6 – Phản xạ toàn phần                                                */
/* ======================================================================== */

export function TotalReflectionLab() {
  const { running, addRecord } = useLab();
  const [m, setM] = useState<Exclude<MediumKey, "air">>("glass");
  const [i, setI] = useState(30);
  useSnapshot({ moi_truong: MEDIA[m].label, goc_toi: i });

  const n1 = MEDIA[m].n;
  const ith = criticalAngle(n1, 1)!;
  const r = snell(i, n1, 1);
  const C = { x: 300, y: 160 };
  const R = 130;
  const src = { x: C.x - Math.sin(rad(i)) * R, y: C.y + Math.cos(rad(i)) * R };
  const refl = { x: C.x + Math.sin(rad(i)) * R, y: C.y + Math.cos(rad(i)) * R };
  const refr = r === null ? null : { x: C.x + Math.sin(rad(r)) * R, y: C.y - Math.cos(rad(r)) * R };
  const ratio = Math.min(1, i / ith);
  const refrOpacity = r === null ? 0 : Math.max(0.12, 1 - ratio ** 6);
  const reflOpacity = r === null ? 1 : 0.2 + 0.8 * ratio ** 6;

  return (
    <LabLayout
      stage={
        <Stage>
          <svg viewBox="0 0 600 320" className="w-full" role="img" aria-label="Phản xạ toàn phần trong bản bán trụ">
            <rect x={0} y={0} width={600} height={320} fill="#ffffff" />
            <path d={`M${C.x - R},${C.y} A${R},${R} 0 0 0 ${C.x + R},${C.y} Z`} fill={MEDIA[m].fill} stroke="#0f766e" strokeWidth={2} />
            <text x={12} y={22} fontSize={13} fontWeight={600} fill="#44403c">Không khí (n = 1)</text>
            <text x={C.x - 50} y={C.y + R - 16} fontSize={12} fontWeight={600} fill="#134e4a">{MEDIA[m].label} n = {fmt(n1)}</text>
            <Protractor cx={C.x} cy={C.y} r={R + 16} />
            {running && (
              <>
                <Ray from={src} to={C} animate />
                <Ray from={C} to={refl} opacity={reflOpacity} animate={r === null} />
                {refr && <Ray from={C} to={refr} opacity={refrOpacity} />}
                <Arc cx={C.x} cy={C.y} r={42} a1={180 + i} a2={180} label="i" />
                <circle cx={src.x} cy={src.y} r={7} fill="#fde047" stroke="#ca8a04" />
              </>
            )}
          </svg>
        </Stage>
      }
      readouts={
        <>
          <Readout label="Góc tới i" value={fmt(i, 1)} unit="°" tone="orange" />
          <Readout label="Góc khúc xạ r" value={r === null ? "Không có" : fmt(r, 1)} unit={r === null ? "" : "°"} tone="blue" />
          <Readout label="Góc tới hạn i_th" value={fmt(ith, 1)} unit="°" tone="green" />
          <Readout label="Hiện tượng" value={r === null ? "PXTP" : "Khúc xạ + phản xạ"} tone={r === null ? "red" : "default"} />
        </>
      }
      controls={
        <>
          <Segmented label="Môi trường chứa tia tới" value={m} options={(["water", "glass", "diamond"] as const).map((k) => ({ value: k, label: MEDIA[k].label }))} onChange={setM} />
          <Slider label="Góc tới i" value={i} min={0} max={85} step={0.5} unit="°" digits={1} onChange={setI} />
          <RunControls
            startLabel="Bật nguồn sáng"
            onRecord={() => running && addRecord({ "Môi trường": MEDIA[m].label, "i (°)": i, "Tia khúc xạ": r === null ? "Không" : "Có", "r (°)": r === null ? "—" : Number(r.toFixed(1)) })}
          />
        </>
      }
      formula={<Formula>Điều kiện: n₁ &gt; n₂ và i ≥ i_th<br />sin i_th = n₂ / n₁</Formula>}
      below={
        running ? (
          <Observation tone={r === null ? "warning" : "info"}>
            {r === null
              ? `i = ${fmt(i, 1)}° ≥ i_th ≈ ${fmt(ith, 1)}°: không còn tia khúc xạ, toàn bộ ánh sáng bị phản xạ trở lại.`
              : `Tia khúc xạ lệch xa pháp tuyến (r > i). Tăng dần i, tia khúc xạ mờ dần và tia phản xạ sáng dần.`}
          </Observation>
        ) : (
          <Observation>Bấm <b>Bật nguồn sáng</b> để chiếu tia sáng qua mặt cong tới tâm bản bán trụ.</Observation>
        )
      }
    />
  );
}

/* ======================================================================== */
/* Bài 7 – Lăng kính                                                        */
/* ======================================================================== */

type LightMode = "white" | "red" | "green" | "violet";

export function PrismLab() {
  const { running, addRecord } = useLab();
  const [A, setA] = useState(60);
  const [i1, setI1] = useState(50);
  const [mode, setMode] = useState<LightMode>("white");
  useSnapshot({ A, i1, anh_sang: mode });

  const colors = mode === "white" ? SPECTRUM : SPECTRUM.filter((c) => (mode === "red" ? c.name === "Đỏ" : mode === "green" ? c.name === "Lục" : c.name === "Tím"));

  const geom = useMemo(() => {
    const a = rad(A / 2);
    const P0 = { x: 300, y: 50 };
    const b = 220 * Math.tan(a);
    const P1 = { x: 300 - b, y: 270 };
    const P2 = { x: 300 + b, y: 270 };
    const H = { x: P0.x + (P1.x - P0.x) * 0.55, y: P0.y + (P1.y - P0.y) * 0.55 };
    const outL = { x: -Math.cos(a), y: -Math.sin(a) };
    const inL = { x: Math.cos(a), y: Math.sin(a) };
    const ang = Math.atan2(inL.y, inL.x) - rad(i1);
    const d = { x: Math.cos(ang), y: Math.sin(ang) };
    const start = { x: H.x - d.x * 320, y: H.y - d.y * 320 };
    const rays = colors.map((c) => {
      const inside = refractVec(d, outL, 1, c.n);
      if (!inside) return { c, exit: null, out: null, tir: true };
      const hitR = raySegment(H, inside, P0, P2);
      const hitB = raySegment(H, inside, P1, P2);
      const hit = hitR && (!hitB || hitR.t < hitB.t) ? { ...hitR, face: "right" as const } : hitB ? { ...hitB, face: "base" as const } : null;
      if (!hit) return { c, exit: null, out: null, tir: false };
      if (hit.face === "base") return { c, exit: hit.point, out: null, tir: false };
      const nInR = { x: -Math.cos(a), y: Math.sin(a) };
      const out = refractVec(inside, nInR, c.n, 1);
      return { c, exit: hit.point, out, tir: out === null };
    });
    return { P0, P1, P2, H, start, rays };
  }, [A, i1, colors]);

  const devs = colors.map((c) => ({ c, ...prismDeviation(i1, A, c.n) }));
  const main = devs[0];
  const last = devs[devs.length - 1];

  return (
    <LabLayout
      stage={
        <Stage className="bg-gradient-to-b from-slate-900 to-slate-800">
          <svg viewBox="0 0 600 320" className="w-full" role="img" aria-label="Đường truyền ánh sáng qua lăng kính">
            <polygon points={`${geom.P0.x},${geom.P0.y} ${geom.P1.x},${geom.P1.y} ${geom.P2.x},${geom.P2.y}`} fill="rgba(186,230,253,0.25)" stroke="#bae6fd" strokeWidth={2} />
            <text x={geom.P0.x - 8} y={geom.P0.y - 8} fontSize={12} fill="#e0f2fe">A = {A}°</text>
            <rect x={585} y={10} width={8} height={300} fill="#f5f5f4" opacity={0.85} />
            {running && (
              <>
                <line x1={geom.start.x} y1={geom.start.y} x2={geom.H.x} y2={geom.H.y} stroke={mode === "white" ? "#fafaf9" : colors[0].color} strokeWidth={4} />
                {geom.rays.map(({ c, exit, out }) => (
                  <g key={c.name}>
                    {exit && <line x1={geom.H.x} y1={geom.H.y} x2={exit.x} y2={exit.y} stroke={c.color} strokeWidth={mode === "white" ? 1.5 : 3} opacity={0.9} />}
                    {exit && out && <line x1={exit.x} y1={exit.y} x2={exit.x + out.x * 400} y2={exit.y + out.y * 400} stroke={c.color} strokeWidth={mode === "white" ? 2.5 : 3.5} />}
                  </g>
                ))}
              </>
            )}
          </svg>
        </Stage>
      }
      readouts={
        <>
          <Readout label="Góc tới i₁" value={fmt(i1, 0)} unit="°" tone="orange" />
          <Readout label={`Góc lệch D (${main.c.name.toLowerCase()})`} value={main.D === null ? "Không ló" : fmt(main.D, 1)} unit={main.D === null ? "" : "°"} tone="blue" />
          {mode === "white" && <Readout label="Góc lệch D (tím)" value={last.D === null ? "Không ló" : fmt(last.D, 1)} unit={last.D === null ? "" : "°"} tone="red" />}
          <Readout label={`Chiết suất (${main.c.name.toLowerCase()})`} value={fmt(main.c.n, 3)} />
        </>
      }
      controls={
        <>
          <Segmented label="Ánh sáng chiếu tới" value={mode} options={[{ value: "white", label: "Trắng" }, { value: "red", label: "Lọc đỏ" }, { value: "green", label: "Lọc lục" }, { value: "violet", label: "Lọc tím" }]} onChange={setMode} />
          <Slider label="Góc chiết quang A" value={A} min={30} max={70} step={1} unit="°" digits={0} onChange={setA} />
          <Slider label="Góc tới i₁" value={i1} min={20} max={80} step={1} unit="°" digits={0} onChange={setI1} />
          <RunControls
            startLabel="Bật đèn chiếu"
            onRecord={() => running && devs.forEach((d) => addRecord({ "Màu": d.c.name, "A (°)": A, "i₁ (°)": i1, "n": d.c.n, "D (°)": d.D === null ? "Không ló" : Number(d.D.toFixed(2)) }))}
          />
        </>
      }
      formula={<Formula>Tia ló lệch về phía đáy lăng kính.<br />n_đỏ &lt; … &lt; n_tím → tia tím lệch nhiều nhất.</Formula>}
      below={
        running ? (
          <Observation tone="success">
            {mode === "white" ? "Ánh sáng trắng bị tách thành dải màu từ đỏ đến tím (tán sắc ánh sáng)." : "Ánh sáng đơn sắc qua lăng kính chỉ bị lệch về phía đáy, không bị tách thành nhiều màu."}
          </Observation>
        ) : (
          <Observation>Bấm <b>Bật đèn chiếu</b>. Dùng kính lọc sắc để so sánh góc lệch của tia đỏ và tia tím.</Observation>
        )
      }
    />
  );
}

/* ======================================================================== */
/* Bài 8 – Thấu kính                                                        */
/* ======================================================================== */

const AXIS = 160;
const LX = 320;
const S = 12; // px/cm

function Arrow({ x, h, color, dashed = false, label }: { x: number; h: number; color: string; dashed?: boolean; label: string }) {
  const tip = AXIS - h;
  const dir = h >= 0 ? 1 : -1;
  return (
    <g>
      <line x1={x} y1={AXIS} x2={x} y2={tip} stroke={color} strokeWidth={3} strokeDasharray={dashed ? "5 4" : undefined} />
      <polygon points={`${x},${tip} ${x - 6},${tip + 10 * dir} ${x + 6},${tip + 10 * dir}`} fill={color} />
      <text x={x + 6} y={tip + (dir > 0 ? -4 : 14)} fontSize={12} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

/** Kéo dài đoạn thẳng qua 2 điểm tới mép khung (x = xEnd). */
function extendTo(p: Vec, q: Vec, xEnd: number): Vec {
  const t = (xEnd - p.x) / (q.x - p.x || 1e-9);
  return { x: xEnd, y: p.y + t * (q.y - p.y) };
}

export function LensLab() {
  const { running, addRecord } = useLab();
  const [type, setType] = useState<"converging" | "diverging">("converging");
  const [mode, setMode] = useState<"image" | "beam">("image");
  const [fAbs, setFAbs] = useState(8);
  const [d, setD] = useState(20);
  const hCm = 3;
  useSnapshot({ loai: type, f_cm: fAbs, d_cm: d });

  const f = type === "converging" ? fAbs : -fAbs;
  const img = thinLens(d, f);
  const T = { x: LX - d * S, y: AXIS - hCm * S };
  const Fobj = { x: LX - fAbs * S, y: AXIS };
  const Fimg = { x: LX + fAbs * S, y: AXIS };
  const imgX = img ? LX + img.dPrime * S : null;
  const imgH = img ? img.k * hCm * S : 0;
  const I = imgX !== null ? { x: imgX, y: AXIS - imgH } : null;
  const W = 640;

  const rays: { a: Vec; b: Vec; dashed?: boolean; color: string }[] = [];
  if (running && mode === "image") {
    const L1 = { x: LX, y: T.y };
    rays.push({ a: T, b: L1, color: "#ea580c" });
    if (type === "converging") rays.push({ a: L1, b: extendTo(L1, Fimg, W), color: "#ea580c" });
    else {
      rays.push({ a: L1, b: extendTo(Fobj, L1, W), color: "#ea580c" });
      rays.push({ a: Fobj, b: L1, dashed: true, color: "#ea580c" });
    }
    rays.push({ a: T, b: extendTo(T, { x: LX, y: AXIS }, W), color: "#2563eb" });
    if (type === "converging" && Math.abs(d - fAbs) > 0.2) {
      const y3 = extendTo(T, Fobj, LX).y;
      if (Math.abs(y3 - AXIS) < 150) {
        rays.push({ a: T, b: { x: LX, y: y3 }, color: "#16a34a" });
        rays.push({ a: { x: LX, y: y3 }, b: { x: W, y: y3 }, color: "#16a34a" });
      }
    }
    if (I && img && img.dPrime < 0) {
      rays.push({ a: { x: LX, y: T.y }, b: I, dashed: true, color: "#ea580c" });
      rays.push({ a: { x: LX, y: AXIS }, b: I, dashed: true, color: "#2563eb" });
    }
  }
  if (running && mode === "beam") {
    [-40, 0, 40].forEach((dy) => {
      const P = { x: 20, y: AXIS + dy };
      const L = { x: LX, y: AXIS + dy };
      rays.push({ a: P, b: L, color: "#dc2626" });
      if (type === "converging") rays.push({ a: L, b: extendTo(L, Fimg, W), color: "#dc2626" });
      else {
        rays.push({ a: L, b: extendTo(Fobj, L, W), color: "#dc2626" });
        if (dy !== 0) rays.push({ a: Fobj, b: L, dashed: true, color: "#dc2626" });
      }
    });
  }

  return (
    <LabLayout
      stage={
        <Stage>
          <svg viewBox={`0 0 ${W} 320`} className="w-full" role="img" aria-label="Dựng ảnh qua thấu kính">
            <line x1={0} x2={W} y1={AXIS} y2={AXIS} stroke="#78716c" />
            {/* thấu kính */}
            {type === "converging" ? (
              <path d={`M${LX},30 Q${LX + 18},${AXIS} ${LX},290 Q${LX - 18},${AXIS} ${LX},30`} fill="rgba(125,211,252,0.35)" stroke="#0284c7" strokeWidth={2} />
            ) : (
              <path d={`M${LX - 14},30 L${LX + 14},30 Q${LX + 2},${AXIS} ${LX + 14},290 L${LX - 14},290 Q${LX - 2},${AXIS} ${LX - 14},30`} fill="rgba(125,211,252,0.35)" stroke="#0284c7" strokeWidth={2} />
            )}
            {[{ p: Fobj, t: "F" }, { p: Fimg, t: "F'" }, { p: { x: LX - 2 * fAbs * S, y: AXIS }, t: "2F" }, { p: { x: LX + 2 * fAbs * S, y: AXIS }, t: "2F'" }].map(({ p, t }) => (
              <g key={t}>
                <circle cx={p.x} cy={p.y} r={3.5} fill="#1c1917" />
                <text x={p.x - 6} y={p.y + 18} fontSize={11} fill="#44403c">{t}</text>
              </g>
            ))}
            <text x={LX + 4} y={AXIS + 16} fontSize={11} fill="#44403c">O</text>
            {rays.map((r, k) => (
              <line key={k} x1={r.a.x} y1={r.a.y} x2={r.b.x} y2={r.b.y} stroke={r.color} strokeWidth={r.dashed ? 1.5 : 2} strokeDasharray={r.dashed ? "6 5" : undefined} />
            ))}
            {mode === "image" && <Arrow x={T.x} h={hCm * S} color="#1c1917" label="B" />}
            {mode === "image" && running && I && Math.abs(imgH) < 200 && I.x > 0 && I.x < W && (
              <Arrow x={I.x} h={imgH} color={img!.dPrime > 0 ? "#be123c" : "#7c3aed"} dashed={img!.dPrime < 0} label="B'" />
            )}
          </svg>
        </Stage>
      }
      readouts={
        <>
          <Readout label="Khoảng cách vật d" value={fmt(d, 1)} unit="cm" />
          <Readout label="Tiêu cự f" value={fmt(fAbs, 1)} unit="cm" />
          <Readout label="Khoảng cách ảnh d'" value={img ? fmt(Math.abs(img.dPrime), 1) : "∞"} unit="cm" tone="blue" />
          <Readout label="Độ phóng đại |h'/h|" value={img ? fmt(Math.abs(img.k), 2) : "—"} tone="orange" />
        </>
      }
      controls={
        <>
          <Segmented label="Thấu kính" value={type} options={[{ value: "converging", label: "Hội tụ" }, { value: "diverging", label: "Phân kì" }]} onChange={setType} />
          <Segmented label="Chế độ" value={mode} options={[{ value: "image", label: "Dựng ảnh của vật" }, { value: "beam", label: "Chùm tia song song" }]} onChange={setMode} />
          <Slider label="Tiêu cự f" value={fAbs} min={4} max={12} step={0.5} unit="cm" digits={1} onChange={setFAbs} />
          <Slider label="Khoảng cách vật d" value={d} min={2} max={25} step={0.5} unit="cm" digits={1} onChange={setD} />
          <RunControls startLabel="Bật nguồn sáng" onRecord={() => running && mode === "image" && addRecord({ "Thấu kính": type === "converging" ? "Hội tụ" : "Phân kì", "f (cm)": fAbs, "d (cm)": d, "d' (cm)": img ? Number(Math.abs(img.dPrime).toFixed(1)) : "∞", "Đặc điểm ảnh": describeImage(img) })} />
        </>
      }
      formula={<Formula>Ba tia đặc biệt: qua O truyền thẳng; song song trục chính → qua F&apos;; qua F → song song trục chính.<br />1/f = 1/d + 1/d&apos; (ảnh thật)</Formula>}
      below={running && mode === "image" ? <Observation tone="success"><b>{describeImage(img)}</b>{img && Math.abs(img.k * hCm * S) >= 200 ? " (ảnh rất lớn, vượt khung hình)" : ""}.</Observation> : <Observation>Bấm <b>Bật nguồn sáng</b> để vẽ đường truyền các tia sáng.</Observation>}
    />
  );
}

/* ======================================================================== */
/* Bài 9 – Thực hành đo tiêu cự (phương pháp Silbermann)                    */
/* ======================================================================== */

const LENSES = [10, 12, 12.5, 15, 8, 9];

export function FocalLengthLab() {
  const { addRecord, records } = useLab();
  const [trueF, setTrueF] = useState(() => LENSES[Math.floor(Math.random() * LENSES.length)]);
  const [x, setX] = useState(12);
  const [reveal, setReveal] = useState(false);
  useOnReset(() => setX(12));
  useSnapshot({ khoang_cach_cm: x });

  const img = thinLens(x, trueF);
  const real = img && img.dPrime > 0;
  const blur = real ? Math.abs(img!.dPrime - x) : 99;
  const sharp = blur < 0.25;
  const k = real ? Math.abs(img!.k) : 0;
  const s = 7; // px/cm
  const fRecords = records.map((r) => Number(r["f (cm)"])).filter((v) => Number.isFinite(v));
  const avg = fRecords.length ? fRecords.reduce((a, b) => a + b, 0) / fRecords.length : null;

  return (
    <LabLayout
      stage={
        <Stage>
          <svg viewBox="0 0 640 260" className="w-full" role="img" aria-label="Giá quang học đo tiêu cự">
            <defs>
              <filter id="blurF"><feGaussianBlur stdDeviation={Math.min(9, blur * 1.4)} /></filter>
            </defs>
            <rect x={20} y={200} width={600} height={14} rx={3} fill="#a8a29e" />
            {Array.from({ length: 13 }).map((_, i) => (
              <g key={i}>
                <line x1={320 - (6 - i) * 7 * s} x2={320 - (6 - i) * 7 * s} y1={214} y2={222} stroke="#57534e" />
              </g>
            ))}
            {/* vật chữ F */}
            <g transform={`translate(${320 - x * s - 16} 110)`}>
              <rect width={32} height={60} fill="#fff7ed" stroke="#ea580c" />
              <text x={6} y={46} fontSize={40} fontWeight={800} fill="#c2410c">F</text>
              <rect x={14} y={60} width={4} height={30} fill="#57534e" />
            </g>
            {/* thấu kính */}
            <path d={`M320,70 Q338,140 320,200 Q302,140 320,70`} fill="rgba(125,211,252,0.4)" stroke="#0284c7" strokeWidth={2} />
            {/* màn */}
            <g transform={`translate(${320 + x * s - 4} 60)`}>
              <rect width={8} height={140} fill="#f5f5f4" stroke="#57534e" />
              <rect x={-30} y={10} width={68} height={120} fill="#fafaf9" stroke="#d6d3d1" opacity={0.9} />
              {real && k < 4 ? (
                <text x={4} y={70} fontSize={40 * k} fontWeight={800} fill="#c2410c" textAnchor="middle" dominantBaseline="middle" transform={`rotate(180 4 70)`} filter="url(#blurF)" opacity={Math.max(0.35, 1 - blur / 25)}>F</text>
              ) : (
                <circle cx={4} cy={70} r={26} fill="#fde68a" opacity={0.5} filter="url(#blurF)" />
              )}
            </g>
            <text x={320 - x * s - 40} y={250} fontSize={12} fill="#44403c">d = {fmt(x, 1)} cm</text>
            <text x={320 + x * s - 40} y={250} fontSize={12} fill="#44403c">d&apos; = {fmt(x, 1)} cm</text>
          </svg>
        </Stage>
      }
      readouts={
        <>
          <Readout label="d = d'" value={fmt(x, 1)} unit="cm" />
          <Readout label="L = d + d'" value={fmt(2 * x, 1)} unit="cm" />
          <Readout label="Ảnh trên màn" value={sharp ? "Rõ nét" : real ? "Mờ" : "Không có"} tone={sharp ? "green" : "default"} />
          <Readout label="h'/h" value={real ? fmt(k, 2) : "—"} />
          <Readout label="f trung bình" value={avg === null ? "—" : fmt(avg, 2)} unit="cm" tone="orange" />
        </>
      }
      controls={
        <>
          <Slider label="Dịch vật và màn (cách đều thấu kính)" value={x} min={4} max={40} step={0.1} unit="cm" digits={1} onChange={setX} />
          <RunControls
            hideRun
            recordLabel="Ghi lần đo"
            onRecord={() => addRecord({ "d (cm)": x, "d' (cm)": x, "h (mm)": 20, "h' (mm)": real ? Number((20 * k).toFixed(1)) : "—", "Ảnh": sharp ? "Rõ nét" : "Chưa rõ", "f (cm)": Number(((2 * x) / 4).toFixed(2)) })}
          />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" disabled={fRecords.length < 3} onClick={() => setReveal(true)}>So sánh với tiêu cự thật</Button>
            <Button variant="ghost" size="sm" onClick={() => { setTrueF(LENSES[Math.floor(Math.random() * LENSES.length)]); setReveal(false); }}>Đổi thấu kính khác</Button>
          </div>
          {reveal && avg !== null && (
            <Observation tone="success">Tiêu cự thật: <b>{trueF} cm</b>. Sai số kết quả đo: {fmt(Math.abs(avg - trueF), 2)} cm ({fmt((Math.abs(avg - trueF) / trueF) * 100, 1)}%).</Observation>
          )}
        </>
      }
      formula={<Formula>Ảnh rõ nét, cao bằng vật khi d = d&apos; = 2f<br />f = (d + d&apos;) / 4</Formula>}
      below={<Observation tone={sharp ? "success" : "info"}>{sharp ? "Ảnh rõ nét và cao bằng vật – bấm Ghi lần đo. Đo 3 lần rồi tính tiêu cự trung bình." : "Dịch từ từ vật và màn ra xa thấu kính cho tới khi ảnh chữ F trên màn rõ nét nhất."}</Observation>}
    />
  );
}

/* ======================================================================== */
/* Bài 10 – Kính lúp                                                        */
/* ======================================================================== */

export function MagnifierLab() {
  const { addRecord } = useLab();
  const [G, setG] = useState("5");
  const f = 25 / Number(G);
  const [d, setD] = useState(3);
  useSnapshot({ G, f_cm: f, d_cm: d });

  const dd = Math.min(d, 1.6 * f);
  const img = thinLens(dd, f);
  const inside = dd < f - 0.05;
  const k = img ? Math.abs(img.k) : Infinity;
  const scale = inside ? Math.min(k, 7) : 1;
  const blurPx = inside ? 0 : Math.abs(dd - f) < 0.3 ? 6 : 3;

  return (
    <LabLayout
      stage={
        <Stage>
          <div className="grid gap-3 p-3 sm:grid-cols-2">
            <svg viewBox="0 0 300 200" className="w-full rounded-xl bg-white" role="img" aria-label="Sơ đồ kính lúp">
              <line x1={0} x2={300} y1={100} y2={100} stroke="#a8a29e" />
              <path d="M200,20 Q214,100 200,180 Q186,100 200,20" fill="rgba(125,211,252,0.4)" stroke="#0284c7" strokeWidth={2} />
              <circle cx={200 - f * 8} cy={100} r={3} fill="#1c1917" />
              <text x={200 - f * 8 - 4} y={116} fontSize={10}>F</text>
              <line x1={200 - dd * 8} x2={200 - dd * 8} y1={100} y2={85} stroke="#1c1917" strokeWidth={3} />
              {inside && img && Math.abs(img.dPrime) * 8 < 200 && (
                <line x1={200 + img.dPrime * 8} x2={200 + img.dPrime * 8} y1={100} y2={100 - 15 * Math.min(k, 6)} stroke="#7c3aed" strokeWidth={3} strokeDasharray="5 3" />
              )}
              <ellipse cx={275} cy={100} rx={14} ry={9} fill="#fff" stroke="#44403c" />
              <circle cx={271} cy={100} r={4} fill="#1c1917" />
              <text x={8} y={18} fontSize={11} fill="#44403c">f = {fmt(f, 1)} cm · d = {fmt(dd, 1)} cm</text>
            </svg>
            <div className="flex items-center justify-center">
              <div className="relative flex size-44 items-center justify-center overflow-hidden rounded-full border-8 border-stone-700 bg-white shadow-inner">
                <span
                  className="font-bold whitespace-nowrap text-stone-800 transition-transform"
                  style={{ fontSize: 9, transform: `scale(${scale}) rotate(${inside ? 0 : 180}deg)`, filter: `blur(${blurPx}px)` }}
                >
                  THẤU KÍNH HỘI TỤ
                </span>
              </div>
            </div>
          </div>
        </Stage>
      }
      readouts={
        <>
          <Readout label="Số bội giác G" value={`${G}x`} tone="orange" />
          <Readout label="Tiêu cự f = 25/G" value={fmt(f, 1)} unit="cm" />
          <Readout label="Ảnh" value={inside ? "Ảo, cùng chiều" : "Không quan sát được"} tone={inside ? "green" : "red"} />
          <Readout label="Ảnh lớn gấp" value={inside ? fmt(k, 1) : "—"} unit="lần" tone="blue" />
        </>
      }
      controls={
        <>
          <Segmented label="Kính lúp" value={G} options={["2", "2.5", "5", "10"].map((g) => ({ value: g, label: `${g.replace(".", ",")}x` }))} onChange={(g) => { setG(g); setD(Math.min(d, (25 / Number(g)) * 1.5)); }} />
          <Slider label="Khoảng cách vật – kính d" value={dd} min={0.5} max={Number((1.6 * f).toFixed(1))} step={0.1} unit="cm" digits={1} onChange={setD} />
          <RunControls hideRun onRecord={() => addRecord({ "G": `${G}x`, "f (cm)": Number(f.toFixed(2)), "d (cm)": dd, "Ảnh": inside ? "Ảo, cùng chiều, lớn hơn vật" : "Không quan sát được ảnh phóng to", "Lớn gấp": inside ? Number(k.toFixed(2)) : "—" })} />
        </>
      }
      formula={<Formula>G = 25 / f (f tính bằng cm)<br />Vật đặt trong khoảng tiêu cự (d &lt; f)</Formula>}
      below={<Observation tone={inside ? "success" : "warning"}>{inside ? "Vật trong khoảng tiêu cự: nhìn qua kính thấy ảnh ảo, cùng chiều, lớn hơn vật." : "Vật ở ngoài khoảng tiêu cự: không quan sát được ảnh phóng to cùng chiều. Hãy đưa kính lại gần vật hơn."}</Observation>}
    />
  );
}
