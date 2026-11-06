"use client";

import { useState } from "react";

import {
  Formula,
  fmt,
  LabLayout,
  Observation,
  Readout,
  RunControls,
  Segmented,
  Slider,
  Stage,
  useAnimationLoop,
  useLab,
  useOnReset,
  useSnapshot,
} from "@/components/experiments/lab-kit";

const G = 10; // m/s² – theo SGK: P = 10·m

/* ======================================================================== */
/* Bài 2 – Động năng, thế năng: bóng lăn trên máng trượt va vào miếng gỗ     */
/* ======================================================================== */

const BALLS = {
  bia: { label: "Bóng bi-a", m: 0.17, r: 13, color: "#dc2626" },
  golf: { label: "Bóng golf", m: 0.046, r: 9, color: "#f8fafc" },
} as const;
type BallKey = keyof typeof BALLS;

// Hình học máng (px): máng nghiêng từ (40,70) tới (300,250); máng ngang y = 250
const BOTTOM = { x: 300, y: 250 };
const PX_PER_CM_V = 6; // độ cao: 30 cm = 180 px
const SLOPE = 180 / 260; // tanθ
const SIN = 180 / Math.hypot(180, 260);
const BLOCK_X0 = 420;
const PX_PER_CM_H = 4;
const F_FRICTION_BLOCK = 0.5; // N – lực ma sát lên miếng gỗ (mô hình)
const TRANSFER = 0.3; // tỉ lệ động năng truyền cho miếng gỗ (mô hình)

export function KineticPotentialLab() {
  const { running, setRunning, addRecord } = useLab();
  const [ball, setBall] = useState<BallKey>("bia");
  const [h, setH] = useState(20); // cm
  type Phase = "ready" | "incline" | "flat" | "push" | "done";
  const INIT = { phase: "ready" as Phase, s: 0, x: BOTTOM.x, blockDx: 0, t: 0 };
  const [sim, setSim] = useState(INIT);

  const b = BALLS[ball];
  const hm = h / 100;
  const L = hm / SIN; // chiều dài quãng lăn trên máng nghiêng (m)
  const Wt0 = G * b.m * hm; // J
  const vBottom = Math.sqrt(2 * G * hm); // bỏ qua ma sát
  const WdBottom = 0.5 * b.m * vBottom ** 2;
  const blockDistanceCm = ((TRANSFER * WdBottom) / F_FRICTION_BLOCK) * 100;

  const SLOW = 3; // quay chậm 3 lần
  useAnimationLoop(running, (dt) => {
    const st = { ...sim };
    const d = dt / SLOW;
    if (st.phase === "ready" || st.phase === "done") {
      Object.assign(st, INIT, { phase: "incline" });
    } else if (st.phase === "incline") {
      st.t += d;
      st.s = Math.min(L, 0.5 * G * SIN * st.t ** 2);
      if (st.s >= L) st.phase = "flat";
    } else if (st.phase === "flat") {
      st.x += vBottom * 100 * PX_PER_CM_H * d;
      if (st.x >= BLOCK_X0 - b.r) {
        st.x = BLOCK_X0 - b.r;
        st.phase = "push";
        st.t = 0;
      }
    } else if (st.phase === "push") {
      st.t += dt;
      const k = Math.min(1, st.t / 0.9);
      st.blockDx = blockDistanceCm * PX_PER_CM_H * (1 - (1 - k) ** 2);
      if (k >= 1) {
        st.phase = "done";
        setRunning(false);
      }
    }
    setSim(st);
  });

  const resetAll = () => setSim(INIT);
  useOnReset(resetAll);
  useSnapshot({ bong: b.label, m_kg: b.m, h_cm: h });
  const { phase, s, x, blockDx } = sim;

  // Vị trí quả bóng
  const heightNow = phase === "ready" || phase === "incline" ? hm - s * SIN : 0;
  const vNow = phase === "incline" ? Math.sqrt(2 * G * (hm - heightNow)) : phase === "flat" ? vBottom : 0;
  const along = (hm - heightNow) / SIN; // m đã lăn
  const startPx = { x: BOTTOM.x - (h * PX_PER_CM_V) / SLOPE, y: BOTTOM.y - h * PX_PER_CM_V };
  const ballPos =
    phase === "ready" || phase === "incline"
      ? {
          x: startPx.x + (along / L || 0) * (BOTTOM.x - startPx.x),
          y: startPx.y + (along / L || 0) * (BOTTOM.y - startPx.y),
        }
      : { x, y: BOTTOM.y };
  const WtNow = G * b.m * heightNow;
  const WdNow = 0.5 * b.m * vNow ** 2;

  return (
    <LabLayout
      stage={
        <Stage>
          <svg viewBox="0 0 600 300" className="w-full" role="img" aria-label="Máng trượt, quả bóng và miếng gỗ">
            {/* thước đo độ cao */}
            {[0, 10, 20, 30].map((cm) => (
              <g key={cm}>
                <line x1={14} x2={24} y1={BOTTOM.y - cm * PX_PER_CM_V} y2={BOTTOM.y - cm * PX_PER_CM_V} stroke="#a8a29e" />
                <text x={2} y={BOTTOM.y - cm * PX_PER_CM_V + 4} fontSize={10} fill="#78716c">{cm}</text>
              </g>
            ))}
            <text x={2} y={40} fontSize={10} fill="#78716c">h (cm)</text>
            {/* máng */}
            <polygon points={`40,70 ${BOTTOM.x},${BOTTOM.y} 590,${BOTTOM.y} 590,${BOTTOM.y + 14} ${BOTTOM.x},${BOTTOM.y + 14} 40,84`} fill="#d6a76c" stroke="#92400e" />
            {/* vạch độ cao thả */}
            <line x1={24} x2={startPx.x} y1={startPx.y} y2={startPx.y} stroke="#ea580c" strokeDasharray="4 4" />
            <text x={startPx.x - 40} y={startPx.y - 18} fontSize={12} fill="#c2410c" fontWeight={600}>h = {h} cm</text>
            {/* thước ngang */}
            {Array.from({ length: 8 }).map((_, i) => (
              <g key={i}>
                <line x1={BLOCK_X0 + i * 5 * PX_PER_CM_H} x2={BLOCK_X0 + i * 5 * PX_PER_CM_H} y1={BOTTOM.y + 14} y2={BOTTOM.y + 22} stroke="#78716c" />
                <text x={BLOCK_X0 + i * 5 * PX_PER_CM_H - 4} y={BOTTOM.y + 34} fontSize={9} fill="#78716c">{i * 5}</text>
              </g>
            ))}
            <text x={540} y={BOTTOM.y + 34} fontSize={9} fill="#78716c">cm</text>
            {/* miếng gỗ */}
            <rect x={BLOCK_X0 + blockDx} y={BOTTOM.y - 22} width={30} height={22} rx={2} fill="#a16207" stroke="#713f12" />
            {/* quả bóng */}
            <circle cx={ballPos.x} cy={ballPos.y - b.r} r={b.r} fill={b.color} stroke="#1c1917" strokeWidth={1.5} />
            {ball === "bia" && <circle cx={ballPos.x} cy={ballPos.y - b.r} r={5} fill="white" />}
          </svg>
          {/* thanh năng lượng */}
          <div className="absolute top-3 right-3 flex w-40 flex-col gap-1.5 rounded-xl bg-white/90 p-2.5 text-xs shadow-sm">
            <EnergyBar label="Thế năng Wt" value={WtNow} max={Wt0 || 1} color="bg-sky-500" />
            <EnergyBar label="Động năng Wđ" value={WdNow} max={Wt0 || 1} color="bg-orange-500" />
          </div>
        </Stage>
      }
      readouts={
        <>
          <Readout label="Khối lượng m" value={fmt(b.m, 3)} unit="kg" />
          <Readout label="Thế năng ban đầu" value={fmt(Wt0, 3)} unit="J" tone="blue" />
          <Readout label="Tốc độ khi va chạm" value={fmt(vBottom, 2)} unit="m/s" />
          <Readout label="Động năng khi va chạm" value={fmt(WdBottom, 3)} unit="J" tone="orange" />
          <Readout label="Miếng gỗ dịch chuyển" value={phase === "done" ? fmt(blockDistanceCm, 1) : "…"} unit="cm" tone="green" />
        </>
      }
      controls={
        <>
          <Segmented label="Quả bóng" value={ball} options={Object.entries(BALLS).map(([k, v]) => ({ value: k as BallKey, label: `${v.label} (${v.m * 1000} g)` }))} onChange={(v) => { setBall(v); resetAll(); setRunning(false); }} />
          <Slider label="Độ cao thả h" value={h} min={5} max={30} step={1} unit="cm" digits={0} onChange={(v) => { setH(v); resetAll(); setRunning(false); }} />
          <RunControls
            startLabel="Thả bóng"
            onRecord={() =>
              phase === "done" &&
              addRecord({ "Quả bóng": b.label, "h (cm)": h, "v (m/s)": Number(vBottom.toFixed(2)), "Wđ (J)": Number(WdBottom.toFixed(3)), "Gỗ dịch chuyển (cm)": Number(blockDistanceCm.toFixed(1)) })
            }
          />
          {phase !== "done" && <p className="text-xs text-muted-foreground">Thả bóng và chờ miếng gỗ dừng lại rồi mới ghi số liệu.</p>}
        </>
      }
      formula={
        <Formula>
          Wt = P·h = 10·m·h<br />
          Wđ = ½·m·v²<br />
          <span className="text-xs text-orange-800/80">Bỏ qua ma sát trên máng: thế năng ban đầu chuyển hoá hết thành động năng ở chân máng.</span>
        </Formula>
      }
      below={
        phase === "done" ? (
          <Observation tone="success">
            {b.label} thả từ {h} cm có động năng {fmt(WdBottom, 3)} J, đẩy miếng gỗ đi {fmt(blockDistanceCm, 1)} cm. Thử tăng độ cao hoặc đổi quả bóng nặng hơn để so sánh.
          </Observation>
        ) : null
      }
    />
  );
}

function EnergyBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between"><span>{label}</span><span className="font-mono tabular-nums">{fmt(value, 3)} J</span></div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full ${color} transition-[width] duration-75`} style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
      </div>
    </div>
  );
}

/* ======================================================================== */
/* Bài 3 – Cơ năng: con lắc đơn                                              */
/* ======================================================================== */

type Sample = { t: number; wd: number; wt: number };

export function MechanicalEnergyLab() {
  const { running, addRecord } = useLab();
  const [m, setM] = useState(0.05);
  const [L, setL] = useState(0.4);
  const [theta0, setTheta0] = useState(50);
  const [friction, setFriction] = useState(false);
  const [state, setState] = useState({ th: (50 * Math.PI) / 180, om: 0, t: 0, samples: [] as Sample[] });

  const restart = (deg = theta0) => setState({ th: (deg * Math.PI) / 180, om: 0, t: 0, samples: [] });
  useOnReset(() => restart());
  useSnapshot({ m_kg: m, L_m: L, goc_tha_do: theta0, ma_sat: friction });

  useAnimationLoop(running, (dt) => {
    // Tích phân Euler bán ẩn nhiều bước nhỏ
    let { th, om } = state;
    const steps = 8;
    const h = dt / steps;
    for (let i = 0; i < steps; i++) {
      const alpha = -(G / L) * Math.sin(th) - (friction ? 0.6 * om : 0);
      om += alpha * h;
      th += om * h;
    }
    const t = state.t + dt;
    const vv = om * L;
    setState({
      th,
      om,
      t,
      samples: [...state.samples.filter((p) => p.t > t - 8), { t, wd: 0.5 * m * vv * vv, wt: G * m * L * (1 - Math.cos(th)) }],
    });
  });
  const samples = state.samples;

  const v = state.om * L;
  const wd = 0.5 * m * v * v;
  const hNow = L * (1 - Math.cos(state.th));
  const wt = G * m * hNow;
  const W0 = G * m * L * (1 - Math.cos((theta0 * Math.PI) / 180));
  const pivot = { x: 300, y: 30 };
  const scale = 220 / 1.0; // 1 m = 220 px
  const bob = { x: pivot.x + Math.sin(state.th) * L * scale, y: pivot.y + Math.cos(state.th) * L * scale };
  const lowest = pivot.y + L * scale;

  return (
    <LabLayout
      stage={
        <Stage>
          <svg viewBox="0 0 600 290" className="w-full" role="img" aria-label="Con lắc đơn">
            <rect x={200} y={20} width={200} height={10} rx={3} fill="#78716c" />
            <line x1={pivot.x} y1={pivot.y} x2={pivot.x} y2={lowest + 10} stroke="#d6d3d1" strokeDasharray="4 4" />
            <line x1={150} x2={450} y1={lowest} y2={lowest} stroke="#a8a29e" strokeDasharray="2 4" />
            <text x={455} y={lowest + 4} fontSize={10} fill="#78716c">mốc thế năng</text>
            <line x1={pivot.x} y1={pivot.y} x2={bob.x} y2={bob.y} stroke="#44403c" strokeWidth={2} />
            <circle cx={bob.x} cy={bob.y} r={10 + m * 20} fill="url(#bobGrad)" stroke="#7c2d12" />
            <defs>
              <radialGradient id="bobGrad"><stop offset="0%" stopColor="#fdba74" /><stop offset="100%" stopColor="#ea580c" /></radialGradient>
            </defs>
          </svg>
          <EnergyChart samples={samples} max={Math.max(W0, 1e-6)} />
        </Stage>
      }
      readouts={
        <>
          <Readout label="Độ cao h" value={fmt(hNow * 100, 1)} unit="cm" />
          <Readout label="Tốc độ v" value={fmt(Math.abs(v), 2)} unit="m/s" />
          <Readout label="Thế năng Wt" value={fmt(wt, 4)} unit="J" tone="blue" />
          <Readout label="Động năng Wđ" value={fmt(wd, 4)} unit="J" tone="orange" />
          <Readout label="Cơ năng W" value={fmt(wt + wd, 4)} unit="J" tone="green" />
        </>
      }
      controls={
        <>
          <Slider label="Khối lượng vật nặng m" value={m} min={0.02} max={0.5} step={0.01} unit="kg" onChange={(x) => { setM(x); restart(); }} />
          <Slider label="Chiều dài dây L" value={L} min={0.2} max={1} step={0.05} unit="m" onChange={(x) => { setL(x); restart(); }} />
          <Slider label="Góc thả ban đầu" value={theta0} min={10} max={60} step={1} unit="°" digits={0} onChange={(x) => { setTheta0(x); restart(x); }} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="size-4 accent-primary" checked={friction} onChange={(e) => setFriction(e.target.checked)} /> Có ma sát, lực cản không khí</label>
          <RunControls
            startLabel="Thả con lắc"
            onRecord={() => addRecord({ "Góc lệch (°)": Number(((state.th * 180) / Math.PI).toFixed(1)), "h (cm)": Number((hNow * 100).toFixed(1)), "v (m/s)": Number(Math.abs(v).toFixed(2)), "Wt (J)": Number(wt.toFixed(4)), "Wđ (J)": Number(wd.toFixed(4)), "W (J)": Number((wt + wd).toFixed(4)) })}
          />
        </>
      }
      formula={<Formula>W = Wđ + Wt = ½·m·v² + P·h<br />h = L·(1 − cos α)</Formula>}
      below={
        <Observation tone={friction ? "warning" : "info"}>
          {friction
            ? "Có ma sát: cơ năng giảm dần (chuyển hoá thành nhiệt năng), con lắc dao động yếu dần rồi dừng."
            : "Bỏ qua ma sát: động năng và thế năng chuyển hoá qua lại, cơ năng (đường xanh lá) không đổi."}
        </Observation>
      }
    />
  );
}

function EnergyChart({ samples, max }: { samples: Sample[]; max: number }) {
  const W = 600;
  const H = 90;
  if (samples.length < 2) return <div className="h-[90px] border-t bg-white/60 px-3 py-2 text-xs text-muted-foreground">Đồ thị năng lượng theo thời gian sẽ hiện khi con lắc dao động.</div>;
  const t0 = samples[0].t;
  const t1 = Math.max(t0 + 8, samples[samples.length - 1].t);
  const xs = (t: number) => ((t - (t1 - 8)) / 8) * W;
  const ys = (v: number) => H - 8 - (v / max) * (H - 18);
  const path = (f: (s: Sample) => number) => samples.map((s, i) => `${i ? "L" : "M"}${xs(s.t).toFixed(1)},${ys(f(s)).toFixed(1)}`).join(" ");
  return (
    <div className="border-t bg-white/70">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Đồ thị năng lượng theo thời gian">
        <line x1={0} x2={W} y1={H - 8} y2={H - 8} stroke="#e7e5e4" />
        <path d={path((s) => s.wt)} fill="none" stroke="#0ea5e9" strokeWidth={2} />
        <path d={path((s) => s.wd)} fill="none" stroke="#f97316" strokeWidth={2} />
        <path d={path((s) => s.wt + s.wd)} fill="none" stroke="#16a34a" strokeWidth={2} />
      </svg>
      <div className="flex gap-4 px-3 pb-2 text-xs">
        <span className="flex items-center gap-1"><i className="h-0.5 w-4 bg-sky-500" /> Thế năng</span>
        <span className="flex items-center gap-1"><i className="h-0.5 w-4 bg-orange-500" /> Động năng</span>
        <span className="flex items-center gap-1"><i className="h-0.5 w-4 bg-green-600" /> Cơ năng</span>
      </div>
    </div>
  );
}

/* ======================================================================== */
/* Bài 4 – Công và công suất: kéo gạch bằng ròng rọc                         */
/* ======================================================================== */

const BRICK_WEIGHT = 18; // N – như tình huống trong SGK

export function WorkPowerLab() {
  const { running, setRunning, addRecord } = useLab();
  const [n, setN] = useState(10);
  const [h, setH] = useState(3.5);
  const [t, setT] = useState(60);
  const [progress, setProgress] = useState(0);

  const F = n * BRICK_WEIGHT;
  const A = F * h;
  const P = A / t;
  const ANIM = Math.min(6, Math.max(2, t / 15)); // thời gian hoạt ảnh (s)

  useAnimationLoop(running, (dt) => {
    setProgress((p) => {
      const np = Math.min(1, p + dt / ANIM);
      if (np >= 1) setRunning(false);
      return np;
    });
  });
  useOnReset(() => setProgress(0));
  useSnapshot({ so_vien_gach: n, h_m: h, t_s: t });

  const groundY = 270;
  const topY = 50;
  const loadY = groundY - 30 - progress * (groundY - topY - 70);
  const elapsed = progress * t;

  return (
    <LabLayout
      stage={
        <Stage>
          <svg viewBox="0 0 600 290" className="w-full" role="img" aria-label="Kéo gạch lên cao bằng ròng rọc">
            <rect x={0} y={groundY} width={600} height={20} fill="#a8a29e" />
            {/* nhà */}
            <rect x={330} y={topY + 30} width={240} height={groundY - topY - 30} fill="#fed7aa" stroke="#c2410c" />
            <line x1={330} x2={570} y1={topY + 70} y2={topY + 70} stroke="#c2410c" strokeWidth={3} />
            <text x={470} y={topY + 64} fontSize={12} fill="#9a3412" fontWeight={600}>Tầng 2</text>
            {/* giá ròng rọc */}
            <line x1={330} y1={topY} x2={230} y2={topY} stroke="#57534e" strokeWidth={5} />
            <circle cx={230} cy={topY + 12} r={12} fill="#fafaf9" stroke="#44403c" strokeWidth={3} />
            <line x1={218} y1={topY + 12} x2={218} y2={loadY} stroke="#44403c" strokeWidth={1.5} />
            <line x1={242} y1={topY + 12} x2={242} y2={groundY - 70} stroke="#44403c" strokeWidth={1.5} />
            {/* người kéo */}
            <circle cx={250} cy={groundY - 80} r={10} fill="#fdba74" />
            <line x1={250} y1={groundY - 70} x2={250} y2={groundY - 30} stroke="#1c1917" strokeWidth={4} />
            <line x1={250} y1={groundY - 30} x2={240} y2={groundY} stroke="#1c1917" strokeWidth={4} />
            <line x1={250} y1={groundY - 30} x2={262} y2={groundY} stroke="#1c1917" strokeWidth={4} />
            <line x1={250} y1={groundY - 60} x2={242} y2={groundY - 72} stroke="#1c1917" strokeWidth={3} />
            {/* thùng gạch */}
            <g transform={`translate(196 ${loadY})`}>
              <rect width={44} height={30} rx={3} fill="#78350f" />
              {Array.from({ length: Math.min(n, 12) }).map((_, i) => (
                <rect key={i} x={3 + (i % 4) * 10} y={3 + Math.floor(i / 4) * 9} width={9} height={7} fill="#dc2626" stroke="#7f1d1d" strokeWidth={0.5} />
              ))}
            </g>
            {/* độ cao */}
            <line x1={150} x2={150} y1={groundY} y2={topY + 70} stroke="#ea580c" strokeDasharray="4 3" />
            <text x={100} y={(groundY + topY + 70) / 2} fontSize={13} fill="#c2410c" fontWeight={700}>h = {fmt(h, 1)} m</text>
            <text x={20} y={30} fontSize={14} fill="#1c1917" fontFamily="monospace">t = {fmt(elapsed, 0)} s</text>
          </svg>
        </Stage>
      }
      readouts={
        <>
          <Readout label="Lực kéo F = P" value={fmt(F, 0)} unit="N" />
          <Readout label="Quãng đường s = h" value={fmt(h, 1)} unit="m" />
          <Readout label="Công A" value={fmt(A, 1)} unit="J" tone="orange" />
          <Readout label="Thời gian t" value={fmt(t, 0)} unit="s" />
          <Readout label="Công suất P" value={fmt(P, 2)} unit="W" tone="green" />
        </>
      }
      controls={
        <>
          <Slider label="Số viên gạch (mỗi viên 18 N)" value={n} min={1} max={20} step={1} digits={0} unit="viên" onChange={setN} />
          <Slider label="Độ cao cần kéo h" value={h} min={1} max={10} step={0.5} unit="m" onChange={setH} />
          <Slider label="Thời gian kéo t" value={t} min={10} max={180} step={5} unit="s" digits={0} onChange={setT} />
          <RunControls startLabel="Kéo gạch" onRecord={() => addRecord({ "Số viên": n, "F (N)": F, "h (m)": h, "A (J)": A, "t (s)": t, "P (W)": Number(P.toFixed(2)) })} />
        </>
      }
      formula={<Formula>A = F·s (J)<br />P = A / t (W)<br /><span className="text-xs">Kéo đều: F = trọng lượng gạch</span></Formula>}
      below={<Observation>Thử tình huống SGK: anh Lâm 10 viên/60 s, anh An 12 viên/90 s, cùng h = 3,5 m. Ghi số liệu cả hai lần và so sánh công suất.</Observation>}
    />
  );
}
