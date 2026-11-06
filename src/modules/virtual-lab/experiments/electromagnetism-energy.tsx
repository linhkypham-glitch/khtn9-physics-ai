"use client";

import { useState } from "react";

import { Formula, fmt, LabLayout, Observation, Readout, RunControls, Segmented, Slider, Stage, useAnimationLoop, useLab, useOnReset, useSnapshot } from "@/components/experiments/lab-kit";

/** Đồ thị cuộn theo thời gian (SVG đơn giản). */
function ScopeChart({ data, label, color = "#ea580c", range = 1 }: { data: number[]; label: string; color?: string; range?: number }) {
  const W = 600;
  const H = 100;
  const path = data.map((v, i) => `${i ? "L" : "M"}${((i / Math.max(1, data.length - 1)) * W).toFixed(1)},${(H / 2 - (v / range) * (H / 2 - 8)).toFixed(1)}`).join(" ");
  return (
    <div className="rounded-2xl border bg-stone-900 p-2">
      <p className="px-1 text-xs text-stone-300">{label}</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={label}>
        {[0.25, 0.5, 0.75].map((f) => <line key={f} x1={0} x2={W} y1={H * f} y2={H * f} stroke="#44403c" strokeDasharray={f === 0.5 ? undefined : "3 4"} />)}
        {data.length > 1 && <path d={path} fill="none" stroke={color} strokeWidth={2.5} />}
      </svg>
    </div>
  );
}

/* ======================================================================== */
/* Bài 14 – Cảm ứng điện từ                                                 */
/* ======================================================================== */

export function InductionLab() {
  const { running, addRecord } = useLab();
  const [mode, setMode] = useState<"magnet" | "generator">("magnet");
  const [rps, setRps] = useState(1); // vòng/giây
  const INIT = { pos: 0, lastPos: 0, current: 0, phase: 0, t: 0, trace: [] as number[], autoDir: 1 };
  const [sim, setSim] = useState(INIT);
  const pos = sim.pos; // vị trí nam châm 0 (xa) … 100 (trong lòng cuộn dây)
  const setPos = (p: number) => setSim({ ...sim, pos: p });
  useSnapshot({ che_do: mode, vong_moi_giay: rps });

  // Số đường sức từ qua cuộn dây (tỉ đối) theo vị trí nam châm
  const flux = (p: number) => Math.exp(-((p - 100) ** 2) / (2 * 28 ** 2));

  useAnimationLoop(true, (dt) => {
    const st = { ...sim, t: sim.t + dt };
    if (mode === "magnet") {
      if (running) {
        // tự động đưa nam châm vào – ra
        st.pos = sim.pos + sim.autoDir * 70 * dt;
        if (st.pos >= 100) { st.pos = 100; st.autoDir = -1; }
        if (st.pos <= 0) { st.pos = 0; st.autoDir = 1; }
      }
      const dphi = (flux(st.pos) - flux(sim.lastPos)) / Math.max(dt, 1e-3);
      st.lastPos = st.pos;
      st.current = sim.current * 0.75 + -dphi * 0.6 * 0.25;
    } else {
      if (running) st.phase = sim.phase + 2 * Math.PI * rps * dt;
      st.current = running ? Math.sin(st.phase) * Math.min(1, rps / 3) : sim.current * 0.9;
    }
    st.trace = [...sim.trace.slice(-239), st.current];
    setSim(st);
  });
  useOnReset(() => setSim(INIT));

  const cur = sim.current;
  const needle = Math.max(-60, Math.min(60, cur * 70));
  const ledA = cur > 0.06;
  const ledB = cur < -0.06;
  const coilAngle = sim.phase;

  return (
    <LabLayout
      stage={
        <Stage>
          <svg viewBox="0 0 600 260" className="w-full" role="img" aria-label="Thí nghiệm cảm ứng điện từ">
            {mode === "magnet" ? (
              <>
                {/* cuộn dây */}
                {Array.from({ length: 9 }).map((_, i) => (
                  <ellipse key={i} cx={360 + i * 12} cy={130} rx={8} ry={46} fill="none" stroke="#b45309" strokeWidth={4} />
                ))}
                <path d="M360,84 L360,40 L170,40 L170,70 M456,84 L456,30 L230,30 L230,70" fill="none" stroke="#57534e" strokeWidth={2.5} />
                {/* nam châm */}
                <g transform={`translate(${60 + pos * 3.2} 112)`}>
                  <rect width={60} height={36} fill="#2563eb" rx={3} />
                  <rect x={60} width={60} height={36} fill="#dc2626" rx={3} />
                  <text x={22} y={24} fill="white" fontWeight={800}>S</text>
                  <text x={84} y={24} fill="white" fontWeight={800}>N</text>
                </g>
              </>
            ) : (
              <>
                <rect x={300} y={60} width={50} height={140} fill="#dc2626" rx={4} />
                <rect x={470} y={60} width={50} height={140} fill="#2563eb" rx={4} />
                <text x={317} y={136} fill="white" fontWeight={800} fontSize={20}>N</text>
                <text x={487} y={136} fill="white" fontWeight={800} fontSize={20}>S</text>
                <ellipse cx={410} cy={130} rx={Math.max(4, Math.abs(Math.cos(coilAngle)) * 50)} ry={60} fill="none" stroke="#b45309" strokeWidth={6} />
                <line x1={410} x2={410} y1={60} y2={30} stroke="#57534e" strokeWidth={3} />
                <path d="M410,30 L200,30 L200,70" fill="none" stroke="#57534e" strokeWidth={2.5} />
                <path d="M410,200 L410,230 L230,230 L230,180" fill="none" stroke="#57534e" strokeWidth={2.5} />
              </>
            )}
            {/* điện kế */}
            <g transform="translate(200 125)">
              <circle r={52} fill="white" stroke="#44403c" strokeWidth={3} />
              <path d="M-40,-10 A42,42 0 0 1 40,-10" fill="none" stroke="#a8a29e" />
              <text x={-4} y={30} fontSize={14} fontWeight={800}>G</text>
              <line x1={0} y1={14} x2={Math.sin((needle * Math.PI) / 180) * 40} y2={14 - Math.cos((needle * Math.PI) / 180) * 40} stroke="#dc2626" strokeWidth={3} strokeLinecap="round" />
              <circle r={4} cy={14} fill="#1c1917" />
            </g>
            {/* hai đèn LED mắc song song ngược chiều */}
            <g transform="translate(60 210)">
              <circle r={12} fill={ledA ? "#ef4444" : "#fecaca"} stroke="#7f1d1d" style={{ filter: ledA ? "drop-shadow(0 0 8px #ef4444)" : undefined }} />
              <circle cx={36} r={12} fill={ledB ? "#22c55e" : "#bbf7d0"} stroke="#14532d" style={{ filter: ledB ? "drop-shadow(0 0 8px #22c55e)" : undefined }} />
              <text x={-10} y={30} fontSize={10} fill="#44403c">2 LED ngược chiều</text>
            </g>
          </svg>
          <div className="px-3 pb-3">
            <ScopeChart data={sim.trace} label="Cường độ dòng điện cảm ứng theo thời gian" range={1} />
          </div>
        </Stage>
      }
      readouts={
        <>
          <Readout label="Dòng điện cảm ứng" value={Math.abs(cur) < 0.03 ? "Không có" : cur > 0 ? "Chiều (+)" : "Chiều (−)"} tone={Math.abs(cur) < 0.03 ? "default" : "orange"} />
          {mode === "generator" && <Readout label="Tần số f" value={fmt(rps, 1)} unit="Hz" tone="blue" />}
          {mode === "generator" && <Readout label="Đổi chiều mỗi giây" value={fmt(2 * rps, 0)} unit="lần" tone="green" />}
          {mode === "magnet" && <Readout label="Đường sức qua cuộn dây" value={fmt(flux(pos) * 100, 0)} unit="%" tone="blue" />}
        </>
      }
      controls={
        <>
          <Segmented label="Thí nghiệm" value={mode} options={[{ value: "magnet", label: "Nam châm & cuộn dây" }, { value: "generator", label: "Máy phát xoay chiều" }]} onChange={(v) => { setMode(v); setSim({ ...sim, trace: [] }); }} />
          {mode === "magnet" ? (
            <Slider label="Vị trí nam châm (kéo để di chuyển)" value={Math.round(pos)} min={0} max={100} step={1} unit="%" digits={0} onChange={setPos} />
          ) : (
            <Slider label="Tốc độ quay cuộn dây" value={rps} min={0.25} max={3} step={0.25} unit="vòng/s" onChange={setRps} />
          )}
          <RunControls
            startLabel={mode === "magnet" ? "Tự động đưa vào – ra" : "Quay cuộn dây"}
            onRecord={() => addRecord({ "Thí nghiệm": mode === "magnet" ? "Nam châm – cuộn dây" : "Máy phát", "Trạng thái": mode === "magnet" ? `Vị trí ${Math.round(pos)}%` : `${rps} vòng/s`, "Dòng cảm ứng": Math.abs(cur) < 0.03 ? "Không" : "Có", "Chiều": Math.abs(cur) < 0.03 ? "—" : cur > 0 ? "+" : "−" })}
          />
        </>
      }
      formula={<Formula>Có dòng điện cảm ứng khi số đường sức từ qua cuộn dây kín biến thiên.<br />Mỗi vòng quay: dòng điện đổi chiều 2 lần.</Formula>}
      below={
        <Observation tone={Math.abs(cur) < 0.03 ? "info" : "success"}>
          {mode === "magnet"
            ? Math.abs(cur) < 0.03
              ? "Nam châm đứng yên → số đường sức không đổi → kim điện kế chỉ số 0."
              : "Nam châm chuyển động → số đường sức thay đổi → xuất hiện dòng điện cảm ứng. Đưa vào và kéo ra cho dòng điện ngược chiều nhau."
            : "Cuộn dây quay: số đường sức luân phiên tăng, giảm nên dòng điện luân phiên đổi chiều – dòng điện xoay chiều. Hai đèn LED sáng luân phiên."}
        </Observation>
      }
    />
  );
}

/* ======================================================================== */
/* Bài 15 – Tác dụng của dòng điện xoay chiều                               */
/* ======================================================================== */

export function AcEffectsLab() {
  const { running, addRecord } = useLab();
  const [source, setSource] = useState<"dc" | "ac">("ac");
  const [freq, setFreq] = useState(2);
  const [U, setU] = useState(12);
  const [st, setSt] = useState({ t: 0, temp: 25, trace: [] as number[] });
  useSnapshot({ nguon: source, tan_so: freq, U });

  useAnimationLoop(running, (dt) => {
    const t = st.t + dt;
    const i = source === "dc" ? U / 12 : (U / 12) * Math.SQRT2 * Math.sin(2 * Math.PI * freq * t);
    // nhiệt độ dây nung: công suất ∝ i², toả nhiệt ra môi trường
    setSt({ t, temp: st.temp + (i * i * 60 - (st.temp - 25) * 0.4) * dt, trace: [...st.trace.slice(-239), i] });
  });
  useOnReset(() => setSt({ t: 0, temp: 25, trace: [] }));

  const iNow = running ? (st.trace[st.trace.length - 1] ?? 0) : 0;
  const brightness = running ? (source === "dc" ? U / 12 : Math.min(1, (iNow * iNow) / ((U / 12) ** 2 || 1))) : 0;
  const fastAc = source === "ac" && freq > 8;
  const glow = source === "ac" && fastAc ? (running ? U / 12 : 0) : brightness;
  const needleAngle = running ? (source === "dc" ? 50 * (U / 12) : fastAc ? Math.sin(st.t * 80) * 6 : 50 * (iNow / ((U / 12) * Math.SQRT2 || 1))) : 0;

  return (
    <LabLayout
      stage={
        <Stage>
          <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-3">
              <p className="text-sm font-semibold">Tác dụng phát sáng</p>
              <svg viewBox="0 0 100 120" className="h-28" role="img" aria-label="Bóng đèn">
                <circle cx={50} cy={50} r={34} fill={`rgba(250,204,21,${0.15 + glow * 0.85})`} stroke="#a16207" strokeWidth={2} style={{ filter: glow > 0.3 ? `drop-shadow(0 0 ${glow * 18}px #facc15)` : undefined }} />
                <path d="M38,60 Q44,40 50,60 Q56,40 62,60" fill="none" stroke={glow > 0.2 ? "#f97316" : "#78716c"} strokeWidth={2} />
                <rect x={38} y={84} width={24} height={22} fill="#a8a29e" rx={2} />
              </svg>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-3">
              <p className="text-sm font-semibold">Tác dụng nhiệt</p>
              <svg viewBox="0 0 120 120" className="h-28" role="img" aria-label="Dây nung">
                <path d="M10,60 Q20,30 30,60 T50,60 T70,60 T90,60 T110,60" fill="none" stroke={st.temp > 60 ? `rgb(${Math.min(255, 120 + st.temp)},${Math.max(40, 200 - st.temp)},40)` : "#57534e"} strokeWidth={5} />
              </svg>
              <p className="font-mono text-sm tabular-nums">{fmt(st.temp, 0)} °C</p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-3">
              <p className="text-sm font-semibold">Tác dụng từ</p>
              <svg viewBox="0 0 120 120" className="h-28" role="img" aria-label="Kim nam châm gần dây dẫn">
                <line x1={10} x2={110} y1={20} y2={20} stroke="#57534e" strokeWidth={4} />
                <circle cx={60} cy={75} r={34} fill="#f5f5f4" stroke="#a8a29e" />
                <g transform={`rotate(${needleAngle} 60 75)`}>
                  <polygon points="60,45 66,75 54,75" fill="#dc2626" />
                  <polygon points="60,105 66,75 54,75" fill="#2563eb" />
                </g>
              </svg>
              <p className="text-xs text-muted-foreground">{!running ? "Kim chỉ hướng Bắc – Nam" : source === "dc" ? "Kim lệch và đứng yên" : fastAc ? "Kim rung nhẹ tại chỗ" : "Kim dao động qua lại"}</p>
            </div>
          </div>
          <div className="px-3 pb-3">
            <ScopeChart data={st.trace} label="Cường độ dòng điện theo thời gian" range={Math.max(0.2, (U / 12) * Math.SQRT2)} color={source === "dc" ? "#38bdf8" : "#f97316"} />
          </div>
        </Stage>
      }
      readouts={
        <>
          <Readout label="Loại nguồn" value={source === "dc" ? "Một chiều (DC)" : "Xoay chiều (AC)"} tone="orange" />
          {source === "ac" && <Readout label="Tần số" value={fmt(freq, 1)} unit="Hz" />}
          <Readout label="Nhiệt độ dây nung" value={fmt(st.temp, 0)} unit="°C" tone="red" />
          <Readout label="Vôn kế chỉ" value={fmt(running ? U : 0, 1)} unit={source === "dc" ? "V (DC)" : "V (AC ~)"} tone="blue" />
        </>
      }
      controls={
        <>
          <Segmented label="Nguồn điện" value={source} options={[{ value: "ac", label: "Xoay chiều (AC)" }, { value: "dc", label: "Một chiều (DC)" }]} onChange={setSource} />
          {source === "ac" && <Slider label="Tần số (quay chậm để quan sát)" value={freq} min={0.5} max={50} step={0.5} unit="Hz" digits={1} onChange={setFreq} />}
          <Slider label="Hiệu điện thế (hiệu dụng)" value={U} min={3} max={12} step={1} unit="V" digits={0} onChange={setU} />
          <RunControls startLabel="Bật nguồn" onRecord={() => running && addRecord({ "Nguồn": source === "dc" ? "DC" : `AC ${freq} Hz`, "U (V)": U, "Đèn": brightness > 0.05 || glow > 0.05 ? "Sáng" : "Tắt", "Nhiệt độ (°C)": Math.round(st.temp), "Kim nam châm": source === "dc" ? "Lệch, đứng yên" : "Dao động" })} />
        </>
      }
      formula={<Formula>Dòng điện xoay chiều có tác dụng: nhiệt, phát sáng, từ, sinh lí.<br />Lực từ đổi chiều khi dòng điện đổi chiều.</Formula>}
      below={<Observation tone="warning">An toàn điện: mạng điện gia đình 220 V rất nguy hiểm (tác dụng sinh lí). Mô phỏng chỉ dùng hiệu điện thế thấp.</Observation>}
    />
  );
}

/* ======================================================================== */
/* Bài 16 – Năng lượng hoá thạch                                            */
/* ======================================================================== */

const FUELS = {
  coal: { label: "Than đá", q: 27e6, co2: 2.4, emoji: "🪨" },
  kerosene: { label: "Dầu hoả", q: 44e6, co2: 3.1, emoji: "🛢️" },
  gas: { label: "Khí đốt", q: 44e6, co2: 2.75, emoji: "🔥" },
  wood: { label: "Củi khô (sinh khối)", q: 10e6, co2: 1.6, emoji: "🪵" },
} as const;
type FuelKey = keyof typeof FUELS;
const PLANT_EFFICIENCY = 0.35; // hiệu suất nhà máy nhiệt điện (tham khảo)

export function FossilEnergyLab() {
  const { running, setRunning, addRecord } = useLab();
  const [fuel, setFuel] = useState<FuelKey>("coal");
  const [m, setM] = useState(2);
  const [burnedFrac, setBurned] = useState(0);
  const burned = { current: burnedFrac };
  useSnapshot({ nhien_lieu: FUELS[fuel].label, m_kg: m });

  useAnimationLoop(running, (dt) => {
    const next = Math.min(1, burnedFrac + dt / 4);
    setBurned(next);
    if (next >= 1) setRunning(false);
  });
  useOnReset(() => setBurned(0));

  const F = FUELS[fuel];
  const Qtotal = F.q * m;
  const Q = Qtotal * burned.current;
  const co2 = F.co2 * m * burned.current;
  const kWh = (PLANT_EFFICIENCY * Q) / 3.6e6;

  return (
    <LabLayout
      stage={
        <Stage>
          <svg viewBox="0 0 600 220" className="w-full" role="img" aria-label="Vòng năng lượng và đốt nhiên liệu">
            {[
              { x: 60, t: "☀️", l: "Mặt Trời" },
              { x: 170, t: "🌿", l: "Quang hợp" },
              { x: 280, t: "🦕", l: "Sinh vật" },
              { x: 390, t: F.emoji, l: "Nhiên liệu" },
              { x: 500, t: "🔥", l: "Đốt cháy" },
            ].map((n, i) => (
              <g key={n.l}>
                <circle cx={n.x} cy={60} r={32} fill={i === 4 && running ? "#fed7aa" : "#fff7ed"} stroke="#fdba74" strokeWidth={2} />
                <text x={n.x} y={70} textAnchor="middle" fontSize={26}>{n.t}</text>
                <text x={n.x} y={112} textAnchor="middle" fontSize={11} fill="#57534e">{n.l}</text>
                {i < 4 && <path d={`M${n.x + 36},60 L${n.x + 74},60`} stroke="#ea580c" strokeWidth={2.5} markerEnd="url(#arr)" />}
              </g>
            ))}
            <defs>
              <marker id="arr" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#ea580c" /></marker>
            </defs>
            <text x={300} y={140} textAnchor="middle" fontSize={11} fill="#78716c">… hàng triệu năm …</text>
            {/* thanh nhiệt lượng */}
            <rect x={40} y={165} width={520} height={18} rx={9} fill="#f5f5f4" />
            <rect x={40} y={165} width={520 * burned.current} height={18} rx={9} fill="url(#heat)" />
            <defs>
              <linearGradient id="heat"><stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#dc2626" /></linearGradient>
            </defs>
            <text x={40} y={205} fontSize={12} fill="#44403c">Đã đốt {fmt(burned.current * m, 2)} / {fmt(m, 1)} kg</text>
            {running && Array.from({ length: 6 }).map((_, i) => (
              <circle key={i} cx={500 + Math.sin(burned.current * 40 + i) * 14} cy={22 - ((burned.current * 600 + i * 15) % 30)} r={4} fill="#a8a29e" opacity={0.6} />
            ))}
          </svg>
        </Stage>
      }
      readouts={
        <>
          <Readout label="Năng suất toả nhiệt q" value={fmt(F.q / 1e6, 0)} unit="·10⁶ J/kg" />
          <Readout label="Nhiệt lượng Q" value={fmt(Q / 1e6, 1)} unit="·10⁶ J" tone="red" />
          <Readout label="CO₂ ước tính" value={fmt(co2, 2)} unit="kg" tone="orange" />
          <Readout label="Điện năng (nhiệt điện ~35%)" value={fmt(kWh, 1)} unit="kWh" tone="blue" />
        </>
      }
      controls={
        <>
          <Segmented label="Nhiên liệu" value={fuel} options={(Object.keys(FUELS) as FuelKey[]).map((k) => ({ value: k, label: FUELS[k].label }))} onChange={(v) => { setFuel(v); setBurned(0); setRunning(false); }} />
          <Slider label="Khối lượng nhiên liệu m" value={m} min={0.1} max={10} step={0.1} unit="kg" digits={1} onChange={(v) => { setM(v); setBurned(0); setRunning(false); }} />
          <RunControls startLabel="Đốt nhiên liệu" onRecord={() => addRecord({ "Nhiên liệu": F.label, "m (kg)": m, "Q (10⁶ J)": Number((Qtotal / 1e6).toFixed(1)), "CO₂ (kg)": Number((F.co2 * m).toFixed(2)), "kWh (35%)": Number(((PLANT_EFFICIENCY * Qtotal) / 3.6e6).toFixed(1)) })} />
        </>
      }
      formula={<Formula>Q = q·m<br />Hệ số phát thải CO₂ và hiệu suất là giá trị tham khảo, gần đúng.</Formula>}
      below={<Observation>Nhiên liệu hoá thạch có nguồn gốc từ năng lượng Mặt Trời tích luỹ qua hàng triệu năm, không tái tạo được; khi đốt thải ra CO₂ gây hiệu ứng nhà kính.</Observation>}
    />
  );
}

/* ======================================================================== */
/* Bài 17 – Năng lượng tái tạo                                              */
/* ======================================================================== */

export function RenewableLab() {
  const { running, addRecord } = useLab();
  const [kind, setKind] = useState<"solar" | "wind" | "hydro">("solar");
  const [H, setH] = useState(800); // W/m²
  const [S, setS] = useState(10); // m²
  const [eta, setEta] = useState(20); // %
  const [v, setV] = useState(8); // m/s
  const [D, setD] = useState(20); // m
  const [Q, setQ] = useState(5); // m³/s
  const [h, setHh] = useState(40); // m
  const [etaH, setEtaH] = useState(85);
  const [angleDeg, setAngle] = useState(0);
  const angle = { current: angleDeg };
  useSnapshot({ nguon: kind });

  const A = (Math.PI * D * D) / 4;
  const windOn = v >= 3;
  const P =
    kind === "solar" ? H * S * (eta / 100) : kind === "wind" ? (windOn ? 0.5 * 1.2 * A * v ** 3 * 0.4 : 0) : (etaH / 100) * 10 * 1000 * Q * h;

  useAnimationLoop(running, (dt) => setAngle((angleDeg + (kind === "wind" ? (windOn ? v * 25 : 0) : kind === "hydro" ? Q * 30 : 0) * dt) % 360));
  useOnReset(() => setAngle(0));

  const pText = P >= 1e6 ? `${fmt(P / 1e6, 2)} MW` : P >= 1e3 ? `${fmt(P / 1e3, 2)} kW` : `${fmt(P, 0)} W`;

  return (
    <LabLayout
      stage={
        <Stage className="bg-gradient-to-b from-sky-100 to-green-50">
          <svg viewBox="0 0 600 240" className="w-full" role="img" aria-label="Nguồn năng lượng tái tạo">
            <rect x={0} y={200} width={600} height={40} fill="#86efac" />
            {kind === "solar" && (
              <>
                <circle cx={90} cy={60} r={30 + H / 60} fill="#fde047" opacity={0.3 + H / 1500} />
                <circle cx={90} cy={60} r={26} fill="#facc15" />
                {running && Array.from({ length: 5 }).map((_, i) => (
                  <line key={i} x1={120} y1={70 + i * 8} x2={300 + i * 30} y2={150} stroke="#fbbf24" strokeWidth={2} strokeDasharray="6 6" opacity={H / 1000} style={{ animation: "flow 0.6s linear infinite" }} />
                ))}
                {Array.from({ length: Math.min(6, Math.ceil(S / 3)) }).map((_, i) => (
                  <g key={i} transform={`translate(${280 + i * 50} 140) skewX(-20)`}>
                    <rect width={44} height={56} fill="#1e3a8a" stroke="#93c5fd" />
                    <line x1={22} x2={22} y1={0} y2={56} stroke="#93c5fd" />
                    <line x1={0} x2={44} y1={28} y2={28} stroke="#93c5fd" />
                  </g>
                ))}
              </>
            )}
            {kind === "wind" && (
              <>
                <rect x={296} y={80} width={8} height={120} fill="#e7e5e4" stroke="#a8a29e" />
                <g transform={`rotate(${angle.current} 300 80)`}>
                  {[0, 120, 240].map((a) => (
                    <path key={a} d={`M300,80 L${300 + 6},${80 - 10 - D * 3} L${300 - 4},${80 - 8 - D * 3} Z`} fill="#fafaf9" stroke="#78716c" transform={`rotate(${a} 300 80)`} />
                  ))}
                </g>
                <circle cx={300} cy={80} r={7} fill="#57534e" />
                {running && windOn && Array.from({ length: 4 }).map((_, i) => (
                  <path key={i} d={`M20,${50 + i * 35} q40,-10 80,0 t80,0`} fill="none" stroke="#7dd3fc" strokeWidth={2} strokeDasharray="10 8" style={{ animation: `flow ${Math.max(0.2, 3 / v)}s linear infinite` }} />
                ))}
              </>
            )}
            {kind === "hydro" && (
              <>
                <path d={`M0,${200 - h * 1.2} L180,${200 - h * 1.2} L200,200 L0,200 Z`} fill="#38bdf8" opacity={0.7} />
                <rect x={180} y={200 - h * 1.2 - 10} width={24} height={h * 1.2 + 10} fill="#a8a29e" />
                <path d={`M204,${200 - h * 0.3} L330,185`} stroke="#0ea5e9" strokeWidth={4 + Q} strokeDasharray="8 6" style={running ? { animation: "flow 0.5s linear infinite" } : undefined} />
                <g transform={`rotate(${angle.current} 360 180)`}>
                  {[0, 60, 120, 180, 240, 300].map((a) => (
                    <rect key={a} x={358} y={150} width={4} height={30} fill="#57534e" transform={`rotate(${a} 360 180)`} />
                  ))}
                </g>
                <circle cx={360} cy={180} r={8} fill="#44403c" />
                <text x={60} y={200 - h * 1.2 - 16} fontSize={12} fill="#0c4a6e">Hồ chứa – h = {h} m</text>
              </>
            )}
            <g transform="translate(470 30)">
              <rect width={110} height={44} rx={8} fill="#1c1917" />
              <text x={55} y={18} textAnchor="middle" fontSize={10} fill="#a8a29e">CÔNG SUẤT</text>
              <text x={55} y={36} textAnchor="middle" fontSize={15} fontFamily="monospace" fill={running ? "#4ade80" : "#57534e"}>{running ? pText : "—"}</text>
            </g>
          </svg>
        </Stage>
      }
      readouts={
        <>
          <Readout label="Công suất điện" value={running ? pText : "—"} tone="green" />
          <Readout label="Điện năng 1 giờ" value={running ? fmt(P / 1000, 2) : "—"} unit="kWh" tone="blue" />
          {kind === "wind" && <Readout label="Tua-bin" value={windOn ? "Đang phát điện" : "Gió quá yếu (< 3 m/s)"} tone={windOn ? "orange" : "red"} />}
        </>
      }
      controls={
        <>
          <Segmented label="Nguồn năng lượng" value={kind} options={[{ value: "solar", label: "☀️ Mặt Trời" }, { value: "wind", label: "🌬️ Gió" }, { value: "hydro", label: "💧 Thuỷ điện" }]} onChange={setKind} />
          {kind === "solar" && (
            <>
              <Slider label="Cường độ bức xạ H" value={H} min={0} max={1000} step={50} unit="W/m²" digits={0} onChange={setH} />
              <Slider label="Diện tích tấm pin S" value={S} min={1} max={20} step={1} unit="m²" digits={0} onChange={setS} />
              <Slider label="Hiệu suất pin η" value={eta} min={10} max={25} step={1} unit="%" digits={0} onChange={setEta} />
            </>
          )}
          {kind === "wind" && (
            <>
              <Slider label="Tốc độ gió v" value={v} min={0} max={15} step={0.5} unit="m/s" digits={1} onChange={setV} />
              <Slider label="Đường kính cánh quạt D" value={D} min={4} max={40} step={1} unit="m" digits={0} onChange={setD} />
            </>
          )}
          {kind === "hydro" && (
            <>
              <Slider label="Lưu lượng nước" value={Q} min={0.5} max={20} step={0.5} unit="m³/s" digits={1} onChange={setQ} />
              <Slider label="Độ cao cột nước h" value={h} min={5} max={100} step={5} unit="m" digits={0} onChange={setHh} />
              <Slider label="Hiệu suất η" value={etaH} min={60} max={95} step={1} unit="%" digits={0} onChange={setEtaH} />
            </>
          )}
          <RunControls startLabel="Vận hành" onRecord={() => running && addRecord({ "Nguồn": kind === "solar" ? "Mặt Trời" : kind === "wind" ? "Gió" : "Thuỷ điện", "Thông số": kind === "solar" ? `H=${H}, S=${S}, η=${eta}%` : kind === "wind" ? `v=${v} m/s, D=${D} m` : `Q=${Q} m³/s, h=${h} m`, "P (kW)": Number((P / 1000).toFixed(2)) })} />
        </>
      }
      formula={
        kind === "solar" ? <Formula>P = H·S·η</Formula> : kind === "wind" ? <Formula>P ≈ ½·ρ·A·v³·Cp<br /><span className="text-xs">ρ = 1,2 kg/m³; Cp ≈ 0,4; A = πD²/4 – công suất tăng 8 lần khi tốc độ gió tăng gấp đôi.</span></Formula> : <Formula>P = η·10·m·h / t<br /><span className="text-xs">mỗi giây m = 1000·Q (kg)</span></Formula>
      }
      below={<Observation>{kind === "solar" ? "Không có nắng (ban đêm, trời nhiều mây) thì pin Mặt Trời không phát điện – cần kết hợp lưu trữ hoặc nguồn khác." : kind === "wind" ? "Gió yếu hoặc thay đổi liên tục làm công suất điện gió không ổn định." : "Thuỷ điện ổn định hơn nhưng phụ thuộc lượng mưa và ảnh hưởng hệ sinh thái."}</Observation>}
    />
  );
}
