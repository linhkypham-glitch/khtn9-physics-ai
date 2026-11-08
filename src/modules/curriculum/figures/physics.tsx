import { BarChart, Equations, Hub, LineChart, Steps, type FigureDef } from "./primitives";

const rad = (d: number) => (d * Math.PI) / 180;
const Defs = ({ id, color }: { id: string; color: string }) => (
  <defs>
    <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill={color} /></marker>
  </defs>
);

/* ---------------------------------------------------------------- Bài 2 */
function EnergyBars() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className="mb-1 text-center text-xs font-medium">Động năng của vật 1 kg: Wđ = ½mv²</p>
        <BarChart unit="J" data={[{ label: "v = 1 m/s", value: 0.5, color: "#f97316" }, { label: "v = 2 m/s", value: 2, color: "#f97316" }, { label: "v = 3 m/s", value: 4.5, color: "#f97316" }]} max={5.5} />
        <p className="text-center text-xs text-muted-foreground">Tốc độ gấp đôi → động năng gấp 4 lần</p>
      </div>
      <div>
        <p className="mb-1 text-center text-xs font-medium">Thế năng của vật 1 kg: Wt = 10·m·h</p>
        <BarChart unit="J" data={[{ label: "h = 1 m", value: 10, color: "#3b82f6" }, { label: "h = 2 m", value: 20, color: "#3b82f6" }, { label: "h = 3 m", value: 30, color: "#3b82f6" }]} max={34} valueDigits={0} />
        <p className="text-center text-xs text-muted-foreground">Độ cao gấp đôi → thế năng gấp đôi</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Bài 3 */
function PendulumFigure() {
  const px = 260, py = 28, L = 170, th = rad(50);
  const A = { x: px - L * Math.sin(th), y: py + L * Math.cos(th) };
  const B = { x: px + L * Math.sin(th), y: A.y };
  const O = { x: px, y: py + L };
  const bar = (x: number, wd: number, wt: number) => (
    <g>
      <rect x={x - 45} y={252} width={90 * wt} height={16} fill="#3b82f6" /><rect x={x - 45 + 90 * wt} y={252} width={90 * wd} height={16} fill="#f97316" />
      <rect x={x - 45} y={252} width={90} height={16} fill="none" stroke="#475569" />
    </g>
  );
  return (
    <svg viewBox="0 0 520 290" className="mx-auto h-auto w-full max-w-xl" role="img" aria-label="Con lắc đơn và sự chuyển hoá động năng – thế năng">
      <line x1={190} y1={py} x2={330} y2={py} stroke="#334155" strokeWidth={5} />
      <path d={`M${A.x},${A.y} A${L},${L} 0 0 0 ${B.x},${B.y}`} fill="none" stroke="#94a3b8" strokeDasharray="5 5" />
      {[A, B].map((p, i) => <line key={i} x1={px} y1={py} x2={p.x} y2={p.y} stroke="#94a3b8" strokeDasharray="4 4" />)}
      <line x1={px} y1={py} x2={O.x} y2={O.y} stroke="#334155" strokeWidth={2} />
      {[A, O, B].map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={14} fill={i === 1 ? "#f97316" : "#3b82f6"} stroke="#1e293b" strokeWidth={2} opacity={i === 1 ? 1 : 0.85} />)}
      <text x={A.x - 30} y={A.y + 5} fontWeight={700}>A</text><text x={O.x + 22} y={O.y + 5} fontWeight={700}>O</text><text x={B.x + 20} y={B.y + 5} fontWeight={700}>B</text>
      <line x1={A.x - 6} y1={A.y} x2={O.x + 40} y2={A.y} stroke="#64748b" strokeDasharray="3 3" /><line x1={O.x - 40} y1={O.y} x2={O.x + 40} y2={O.y} stroke="#64748b" strokeDasharray="3 3" />
      <line x1={O.x + 34} y1={A.y} x2={O.x + 34} y2={O.y} stroke="#0f172a" markerEnd="url(#pend-a)" markerStart="url(#pend-a)" /><Defs id="pend-a" color="#0f172a" />
      <text x={O.x + 40} y={(A.y + O.y) / 2 + 4} fontSize={13} fontWeight={700}>h</text>
      {bar(A.x, 0, 1)}{bar(O.x, 1, 0)}{bar(B.x, 0, 1)}
      <text x={A.x} y={246} textAnchor="middle" fontSize={11}>A: toàn thế năng</text><text x={O.x} y={246} textAnchor="middle" fontSize={11}>O: toàn động năng</text><text x={B.x} y={246} textAnchor="middle" fontSize={11}>B: toàn thế năng</text>
      <rect x={20} y={20} width={12} height={12} fill="#3b82f6" /><text x={38} y={30} fontSize={12}>Thế năng</text><rect x={20} y={40} width={12} height={12} fill="#f97316" /><text x={38} y={50} fontSize={12}>Động năng</text>
    </svg>
  );
}

/* ---------------------------------------------------------------- Bài 4 */
function WorkFigure() {
  return (
    <svg viewBox="0 0 600 220" className="mx-auto h-auto w-full max-w-2xl" role="img" aria-label="Công của lực: đẩy xe và nâng vật">
      <Defs id="w-f" color="#dc2626" /><Defs id="w-s" color="#0f172a" />
      <line x1={20} y1={160} x2={290} y2={160} stroke="#475569" strokeWidth={3} />
      <rect x={70} y={105} width={80} height={38} rx={5} fill="#fbbf24" stroke="#92400e" strokeWidth={2} /><circle cx={90} cy={150} r={10} fill="#334155" /><circle cx={130} cy={150} r={10} fill="#334155" />
      <line x1={20} y1={124} x2={68} y2={124} stroke="#dc2626" strokeWidth={4} markerEnd="url(#w-f)" /><text x={28} y={112} fill="#dc2626" fontWeight={700}>F</text>
      <rect x={190} y={105} width={80} height={38} rx={5} fill="#fde68a" stroke="#92400e" strokeDasharray="5 4" strokeWidth={2} />
      <line x1={110} y1={182} x2={230} y2={182} stroke="#0f172a" markerEnd="url(#w-s)" markerStart="url(#w-s)" /><text x={166} y={202} fontWeight={700}>s</text>
      <text x={150} y={36} textAnchor="middle" fontSize={13} fontWeight={600}>Đẩy xe: A = F·s</text><text x={150} y={56} textAnchor="middle" fontSize={11} fill="#64748b">(lực cùng hướng dịch chuyển)</text>
      <line x1={390} y1={20} x2={390} y2={52} stroke="#475569" strokeWidth={3} /><line x1={350} y1={20} x2={430} y2={20} stroke="#475569" strokeWidth={4} />
      <line x1={390} y1={52} x2={390} y2={98} stroke="#64748b" strokeWidth={2} /><rect x={364} y={98} width={52} height={36} rx={4} fill="#fbbf24" stroke="#92400e" strokeWidth={2} />
      <line x1={450} y1={134} x2={450} y2={74} stroke="#dc2626" strokeWidth={4} markerEnd="url(#w-f)" /><text x={458} y={104} fill="#dc2626" fontWeight={700}>F = P</text>
      <line x1={340} y1={98} x2={340} y2={190} stroke="#0f172a" markerEnd="url(#w-s)" markerStart="url(#w-s)" /><text x={322} y={148} fontWeight={700}>h</text>
      <line x1={330} y1={190} x2={500} y2={190} stroke="#475569" strokeWidth={3} />
      <text x={450} y={36} textAnchor="middle" fontSize={13} fontWeight={600}>Nâng vật: A = P·h</text>
    </svg>
  );
}

/* ---------------------------------------------------------------- Bài 5 */
function RefractionFigure() {
  const i = rad(50), n2 = 1.33, r = Math.asin(Math.sin(i) / n2), cx = 230, cy = 150, R = 125, a = 44;
  const pt = (ang: number, len: number, sign: number) => ({ x: cx + sign * len * Math.sin(ang), y: cy - Math.sign(1) * 0 + 0 });
  void pt;
  return (
    <svg viewBox="0 0 460 310" className="mx-auto h-auto w-full max-w-md" role="img" aria-label="Khúc xạ ánh sáng từ không khí vào nước">
      <Defs id="r-a" color="#f59e0b" />
      <rect x={0} y={cy} width={460} height={160} fill="#bfdbfe" opacity={0.7} />
      <line x1={0} y1={cy} x2={460} y2={cy} stroke="#334155" strokeWidth={2} />
      <line x1={cx} y1={14} x2={cx} y2={300} stroke="#475569" strokeDasharray="6 5" />
      <text x={cx + 6} y={20} fontSize={12} fill="#475569">pháp tuyến</text>
      <line x1={cx - R * Math.sin(i)} y1={cy - R * Math.cos(i)} x2={cx} y2={cy} stroke="#f59e0b" strokeWidth={4} markerEnd="url(#r-a)" />
      <line x1={cx} y1={cy} x2={cx + R * Math.sin(i)} y2={cy - R * Math.cos(i)} stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" opacity={0.55} />
      <line x1={cx} y1={cy} x2={cx + R * Math.sin(r)} y2={cy + R * Math.cos(r)} stroke="#f59e0b" strokeWidth={4} markerEnd="url(#r-a)" />
      <path d={`M${cx},${cy - a} A${a},${a} 0 0 0 ${cx - a * Math.sin(i)},${cy - a * Math.cos(i)}`} fill="none" stroke="#0f172a" />
      <path d={`M${cx},${cy + a} A${a},${a} 0 0 0 ${cx + a * Math.sin(r)},${cy + a * Math.cos(r)}`} fill="none" stroke="#0f172a" />
      <text x={cx - 38} y={cy - 56} fontSize={14} fontWeight={700}>i = 50°</text><text x={cx + 20} y={cy + 66} fontSize={14} fontWeight={700}>r ≈ {Math.round((r * 180) / Math.PI)}°</text>
      <text x={cx - 150} y={cy - 98} fontSize={12}>tia tới</text><text x={cx + 70} y={cy + 100} fontSize={12}>tia khúc xạ</text><text x={cx + 78} y={cy - 70} fontSize={11} fill="#64748b">tia phản xạ</text>
      <text x={10} y={30} fontSize={13} fontWeight={600}>Không khí (n₁ = 1)</text><text x={10} y={296} fontSize={13} fontWeight={600}>Nước (n₂ = 1,33)</text>
      <text x={cx + 8} y={cy + 16} fontSize={12}>I</text>
    </svg>
  );
}

/* ---------------------------------------------------------------- Bài 6 */
function TotalReflectionFigure() {
  const panels = [
    { i: 30, title: "i < i_th", note: "có tia khúc xạ và tia phản xạ" },
    { i: 41.8, title: "i = i_th ≈ 41,8°", note: "tia khúc xạ đi sát mặt phân cách (r = 90°)" },
    { i: 60, title: "i > i_th", note: "chỉ còn tia phản xạ: phản xạ toàn phần" },
  ];
  return (
    <svg viewBox="0 0 660 250" className="mx-auto h-auto w-full max-w-3xl" role="img" aria-label="Phản xạ toàn phần: ba trường hợp góc tới">
      <Defs id="t-a" color="#f59e0b" />
      {panels.map((p, k) => {
        const cx = 110 + k * 220, cy = 130, L = 95, i = rad(p.i);
        const sinr = Math.min(1, 1.5 * Math.sin(i)), r = Math.asin(sinr);
        const refr = sinr < 1 - 1e-9 || k === 1;
        return (
          <g key={k}>
            <rect x={cx - 100} y={cy} width={200} height={100} fill="#bae6fd" opacity={0.6} />
            <line x1={cx - 100} y1={cy} x2={cx + 100} y2={cy} stroke="#334155" strokeWidth={2} />
            <line x1={cx} y1={cy - 90} x2={cx} y2={cy + 95} stroke="#64748b" strokeDasharray="5 4" />
            <line x1={cx - L * Math.sin(i)} y1={cy + L * Math.cos(i)} x2={cx} y2={cy} stroke="#f59e0b" strokeWidth={3.5} markerEnd="url(#t-a)" />
            {k !== 2 && <line x1={cx} y1={cy} x2={cx + L * Math.sin(r)} y2={cy - L * Math.cos(r)} stroke="#f59e0b" strokeWidth={3.5} opacity={k === 0 ? 0.9 : 1} markerEnd={refr ? "url(#t-a)" : undefined} />}
            <line x1={cx} y1={cy} x2={cx + L * Math.sin(i)} y2={cy + L * Math.cos(i)} stroke="#f59e0b" strokeWidth={k === 0 ? 1.8 : 3.5} opacity={k === 0 ? 0.45 : 1} markerEnd="url(#t-a)" />
            <text x={cx} y={20} textAnchor="middle" fontWeight={700} fontSize={13}>{p.title}</text>
            <text x={cx} y={38} textAnchor="middle" fontSize={10.5} fill="#475569">{p.note}</text>
            <text x={cx - 96} y={cy - 6} fontSize={10.5}>Không khí</text><text x={cx - 96} y={cy + 92} fontSize={10.5}>Thuỷ tinh (n = 1,5)</text>
          </g>
        );
      })}
      <text x={330} y={246} textAnchor="middle" fontSize={11} fill="#475569">Ánh sáng đi từ môi trường chiết quang hơn (n₁ = 1,5) sang kém hơn (n₂ = 1): sin i_th = n₂/n₁</text>
    </svg>
  );
}

/* ---------------------------------------------------------------- Bài 7 */
function PrismFigure() {
  const colors = [["Đỏ", "#ef4444"], ["Da cam", "#f97316"], ["Vàng", "#facc15"], ["Lục", "#22c55e"], ["Lam", "#3b82f6"], ["Chàm", "#4f46e5"], ["Tím", "#7c3aed"]];
  const exit = { x: 270, y: 122 };
  return (
    <svg viewBox="0 0 620 260" className="mx-auto h-auto w-full max-w-2xl" role="img" aria-label="Tán sắc ánh sáng qua lăng kính">
      <line x1={30} y1={96} x2={200} y2={122} stroke="#475569" strokeWidth={5} /><line x1={200} y1={122} x2={exit.x} y2={exit.y} stroke="#cbd5e1" strokeWidth={4} />
      <polygon points="232,34 160,206 304,206" fill="#bae6fd" fillOpacity={0.55} stroke="#0369a1" strokeWidth={2.5} />
      {colors.map(([name, c], k) => (
        <line key={name} x1={exit.x} y1={exit.y} x2={520} y2={150 + k * 15} stroke={c} strokeWidth={3} />
      ))}
      <rect x={520} y={120} width={14} height={120} fill="#e2e8f0" stroke="#64748b" />
      {colors.map(([name, c], k) => <rect key={name} x={520} y={146 + k * 15} width={14} height={13} fill={c} />)}
      {colors.map(([name], k) => <text key={name} x={542} y={157 + k * 15} fontSize={11}>{name}</text>)}
      <text x={30} y={80} fontSize={12} fontWeight={600}>Ánh sáng trắng</text><text x={232} y={26} textAnchor="middle" fontSize={12} fontWeight={600}>Lăng kính</text><text x={500} y={112} textAnchor="end" fontSize={11}>Màn</text>
      <text x={310} y={246} textAnchor="middle" fontSize={11} fill="#475569">Tia đỏ lệch ít nhất, tia tím lệch nhiều nhất về phía đáy: chiết suất của lăng kính nhỏ nhất với ánh sáng đỏ, lớn nhất với ánh sáng tím</text>
    </svg>
  );
}

/* ---------------------------------------------------------------- Bài 8 / 10: thấu kính */
function ParallelBeams() {
  const y0 = 100, xL = 150;
  const ys = [-48, -24, 0, 24, 48];
  return (
    <svg viewBox="0 0 640 210" className="mx-auto h-auto w-full max-w-2xl" role="img" aria-label="Chùm tia song song qua thấu kính hội tụ và phân kì">
      {[0, 1].map((k) => {
        const ox = k * 320, f = k === 0 ? 100 : -100;
        return (
          <g key={k}>
            <line x1={ox + 10} y1={y0} x2={ox + 300} y2={y0} stroke="#475569" />
            <line x1={ox + xL} y1={y0 - 62} x2={ox + xL} y2={y0 + 62} stroke="#0369a1" strokeWidth={4} />
            <path d={k === 0 ? `M${ox + xL - 8},${y0 - 52} L${ox + xL},${y0 - 64} L${ox + xL + 8},${y0 - 52} M${ox + xL - 8},${y0 + 52} L${ox + xL},${y0 + 64} L${ox + xL + 8},${y0 + 52}` : `M${ox + xL - 8},${y0 - 66} L${ox + xL},${y0 - 54} L${ox + xL + 8},${y0 - 66} M${ox + xL - 8},${y0 + 66} L${ox + xL},${y0 + 54} L${ox + xL + 8},${y0 + 66}`} fill="none" stroke="#0369a1" strokeWidth={3} />
            {ys.map((dy) => {
              const x2 = ox + xL + 150;
              const slope = k === 0 ? -dy / f : -dy / Math.abs(f) * -1 * -1;
              const endY = k === 0 ? y0 + dy + (-dy / f) * 150 : y0 + dy + (dy / Math.abs(f)) * 150;
              void slope;
              return (
                <g key={dy}>
                  <line x1={ox + 10} y1={y0 + dy} x2={ox + xL} y2={y0 + dy} stroke="#f59e0b" strokeWidth={2.2} />
                  <line x1={ox + xL} y1={y0 + dy} x2={x2} y2={endY} stroke="#f59e0b" strokeWidth={2.2} />
                  {k === 1 && <line x1={ox + xL} y1={y0 + dy} x2={ox + xL - 100} y2={y0} stroke="#f59e0b" strokeWidth={1.4} strokeDasharray="4 4" opacity={0.7} />}
                </g>
              );
            })}
            <circle cx={ox + xL + (k === 0 ? 100 : -100)} cy={y0} r={4} fill="#dc2626" /><text x={ox + xL + (k === 0 ? 100 : -100) - 4} y={y0 + 18} fontSize={12} fontWeight={700} fill="#dc2626">F</text>
            <text x={ox + xL} y={18} textAnchor="middle" fontSize={12.5} fontWeight={700}>{k === 0 ? "Thấu kính hội tụ" : "Thấu kính phân kì"}</text>
            <text x={ox + xL} y={200} textAnchor="middle" fontSize={11} fill="#475569">{k === 0 ? "chùm tia ló hội tụ tại tiêu điểm F" : "chùm tia ló phân kì; đường kéo dài đi qua F"}</text>
          </g>
        );
      })}
    </svg>
  );
}

function LensImage({ f, d, h, title, note }: { f: number; d: number; h: number; title: string; note: string }) {
  const y0 = 125, xL = 300, xo = xL - d;
  const dd = 1 / (1 / f - 1 / d); // d' có dấu: dương = thật, âm = ảo
  const virtual = dd < 0;
  const tipImg = y0 + (h * dd) / d;
  const ext = 250;
  const rayDir = { dx: Math.abs(f), dy: f > 0 ? h : -h };
  const ray1End = { x: xL + ext, y: y0 - h + (rayDir.dy * ext) / rayDir.dx };
  const ray2End = { x: xL + ext, y: y0 + (ext * h) / d };
  return (
    <svg viewBox="0 0 600 250" className="mx-auto h-auto w-full max-w-2xl" role="img" aria-label={title}>
      <Defs id="l-o" color="#2563eb" /><Defs id="l-i" color="#dc2626" />
      <line x1={10} y1={y0} x2={590} y2={y0} stroke="#475569" />
      <line x1={xL} y1={y0 - 80} x2={xL} y2={y0 + 80} stroke="#0369a1" strokeWidth={4} />
      <path d={f > 0 ? `M${xL - 9},${y0 - 68} L${xL},${y0 - 82} L${xL + 9},${y0 - 68} M${xL - 9},${y0 + 68} L${xL},${y0 + 82} L${xL + 9},${y0 + 68}` : `M${xL - 9},${y0 - 84} L${xL},${y0 - 70} L${xL + 9},${y0 - 84} M${xL - 9},${y0 + 84} L${xL},${y0 + 70} L${xL + 9},${y0 + 84}`} fill="none" stroke="#0369a1" strokeWidth={3} />
      {[-1, 1].map((s) => <g key={s}><line x1={xL + s * Math.abs(f)} y1={y0 - 5} x2={xL + s * Math.abs(f)} y2={y0 + 5} stroke="#dc2626" strokeWidth={2.5} /><text x={xL + s * Math.abs(f) - 4} y={y0 + 20} fontSize={12} fontWeight={700} fill="#dc2626">{s === 1 ? (f > 0 ? "F′" : "F") : (f > 0 ? "F" : "F′")}</text></g>)}
      <text x={xL + 6} y={y0 + 34} fontSize={11}>O</text>
      <line x1={xo} y1={y0} x2={xo} y2={y0 - h} stroke="#2563eb" strokeWidth={4} markerEnd="url(#l-o)" /><text x={xo - 6} y={y0 + 16} fontSize={12} fontWeight={700} fill="#2563eb">A</text><text x={xo - 6} y={y0 - h - 6} fontSize={12} fontWeight={700} fill="#2563eb">B</text>
      {/* tia 1 song song trục chính */}
      <line x1={xo} y1={y0 - h} x2={xL} y2={y0 - h} stroke="#f59e0b" strokeWidth={2.2} />
      <line x1={xL} y1={y0 - h} x2={ray1End.x} y2={ray1End.y} stroke="#f59e0b" strokeWidth={2.2} />
      {virtual && <line x1={xL} y1={y0 - h} x2={xL + dd} y2={tipImg} stroke="#f59e0b" strokeWidth={1.6} strokeDasharray="5 4" />}
      {/* tia 2 qua quang tâm */}
      <line x1={xo} y1={y0 - h} x2={ray2End.x} y2={ray2End.y} stroke="#f59e0b" strokeWidth={2.2} />
      {virtual && <line x1={xo} y1={y0 - h} x2={xL + dd} y2={tipImg} stroke="#f59e0b" strokeWidth={1.6} strokeDasharray="5 4" />}
      <line x1={xL + dd} y1={y0} x2={xL + dd} y2={tipImg} stroke="#dc2626" strokeWidth={4} strokeDasharray={virtual ? "6 4" : undefined} markerEnd="url(#l-i)" />
      <text x={xL + dd + 8} y={tipImg + (tipImg > y0 ? 14 : -4)} fontSize={12} fontWeight={700} fill="#dc2626">B′</text><text x={xL + dd + 8} y={y0 + (tipImg > y0 ? -6 : 16)} fontSize={12} fontWeight={700} fill="#dc2626">A′</text>
      <text x={300} y={18} textAnchor="middle" fontSize={13} fontWeight={700}>{title}</text><text x={300} y={238} textAnchor="middle" fontSize={11} fill="#475569">{note}</text>
    </svg>
  );
}

/* ---------------------------------------------------------------- Bài 11 */
const Resistor = ({ x, y, label, vertical = false }: { x: number; y: number; label: string; vertical?: boolean }) => (
  <g>
    <rect x={vertical ? x - 12 : x - 30} y={vertical ? y - 30 : y - 12} width={vertical ? 24 : 60} height={vertical ? 60 : 24} fill="#fff" stroke="#334155" strokeWidth={2.5} />
    <text x={vertical ? x + 20 : x} y={vertical ? y + 4 : y - 18} textAnchor={vertical ? "start" : "middle"} fontSize={13} fontWeight={700}>{label}</text>
  </g>
);
const Battery = ({ x, y }: { x: number; y: number }) => (
  <g stroke="#0f172a">
    <line x1={x - 16} y1={y - 6} x2={x + 16} y2={y - 6} strokeWidth={4} /><line x1={x - 9} y1={y + 6} x2={x + 9} y2={y + 6} strokeWidth={4} />
    <text x={x + 24} y={y - 2} fontSize={12} stroke="none" fill="#dc2626">+</text><text x={x + 24} y={y + 14} fontSize={12} stroke="none" fill="#0369a1">−</text>
  </g>
);
const Meter = ({ x, y, t }: { x: number; y: number; t: string }) => (
  <g><circle cx={x} cy={y} r={16} fill="#fff" stroke="#334155" strokeWidth={2.5} /><text x={x} y={y + 5} textAnchor="middle" fontWeight={700} fontSize={14}>{t}</text></g>
);

function Circuit({ kind }: { kind: "ohm" | "series" | "parallel" }) {
  if (kind === "ohm")
    return (
      <svg viewBox="0 0 520 220" className="mx-auto h-auto w-full max-w-lg" role="img" aria-label="Sơ đồ mạch điện khảo sát định luật Ohm">
        <g fill="none" stroke="#334155" strokeWidth={2.5}>
          <path d="M60,50 L120,50 M170,50 L244,50 M276,50 L400,50 L400,90 M400,150 L400,190 L60,190 L60,128 M60,112 L60,50" />
          <path d="M400,70 L470,70 L470,98 M470,134 L470,170 L400,170" />
        </g>
        <Battery x={60} y={120} />
        <circle cx={120} cy={50} r={4} fill="#334155" /><circle cx={170} cy={50} r={4} fill="#334155" /><line x1={120} y1={50} x2={162} y2={30} stroke="#334155" strokeWidth={3} /><text x={138} y={24} fontSize={12} fontWeight={700}>K</text>
        <Meter x={260} y={50} t="A" /><Resistor x={400} y={120} label="R" vertical /><Meter x={470} y={116} t="V" />
        <text x={260} y={92} textAnchor="middle" fontSize={11} fill="#475569">ampe kế mắc nối tiếp</text><text x={470} y={200} textAnchor="middle" fontSize={11} fill="#475569">vôn kế mắc song song với R</text>
      </svg>
    );
  if (kind === "series")
    return (
      <svg viewBox="0 0 330 190" className="mx-auto h-auto w-full max-w-xs" role="img" aria-label="Đoạn mạch nối tiếp">
        <path d="M40,40 L80,40 M140,40 L190,40 M250,40 L290,40 L290,150 L40,150 L40,106 M40,90 L40,40" fill="none" stroke="#334155" strokeWidth={2.5} />
        <Battery x={40} y={98} /><Resistor x={110} y={40} label="R₁" /><Resistor x={220} y={40} label="R₂" />
        <text x={165} y={180} textAnchor="middle" fontSize={12} fontWeight={600}>Nối tiếp</text>
      </svg>
    );
  return (
    <svg viewBox="0 0 330 190" className="mx-auto h-auto w-full max-w-xs" role="img" aria-label="Đoạn mạch song song">
      <path d="M40,100 L40,30 L110,30 M170,30 L290,30 L290,150 L40,150 L40,112 M110,30 L110,60 M110,120 L110,150 M200,30 L200,60 M200,120 L200,150 M110,60 L110,60" fill="none" stroke="#334155" strokeWidth={2.5} />
      <path d="M110,30 L110,50 M110,130 L110,150 M200,30 L200,50 M200,130 L200,150" stroke="#334155" strokeWidth={2.5} />
      <Battery x={40} y={106} /><Resistor x={110} y={90} label="R₁" vertical /><Resistor x={200} y={90} label="R₂" vertical />
      <text x={165} y={180} textAnchor="middle" fontSize={12} fontWeight={600}>Song song</text>
    </svg>
  );
}

/* ---------------------------------------------------------------- Bài 14 */
function InductionFigure() {
  const panels = [
    { title: "Nam châm lại gần cuộn dây", needle: 38, arrow: 1, note: "số đường sức qua cuộn dây tăng → kim lệch" },
    { title: "Nam châm đứng yên", needle: 0, arrow: 0, note: "số đường sức không đổi → kim chỉ số 0" },
    { title: "Nam châm ra xa cuộn dây", needle: -38, arrow: -1, note: "số đường sức giảm → kim lệch ngược chiều" },
  ];
  return (
    <svg viewBox="0 0 690 250" className="mx-auto h-auto w-full max-w-3xl" role="img" aria-label="Thí nghiệm cảm ứng điện từ với nam châm và cuộn dây">
      <Defs id="i-a" color="#dc2626" />
      {panels.map((p, k) => {
        const ox = k * 230, mx = ox + 40 + (p.arrow === 1 ? 20 : p.arrow === -1 ? -20 : 0);
        return (
          <g key={k}>
            <text x={ox + 115} y={20} textAnchor="middle" fontSize={12.5} fontWeight={700}>{p.title}</text>
            <circle cx={ox + 115} cy={78} r={34} fill="#fff" stroke="#334155" strokeWidth={2.5} />
            <path d={`M${ox + 90},${70} A28,28 0 0 1 ${ox + 140},${70}`} fill="none" stroke="#cbd5e1" />
            <line x1={ox + 115} y1={92} x2={ox + 115 + 28 * Math.sin(rad(p.needle))} y2={92 - 28 * Math.cos(rad(p.needle))} stroke="#dc2626" strokeWidth={3} strokeLinecap="round" />
            <text x={ox + 115} y={62} textAnchor="middle" fontSize={11} fontWeight={700}>G</text>
            {[0, 1, 2, 3, 4].map((c) => <ellipse key={c} cx={ox + 150 + c * 9} cy={170} rx={7} ry={30} fill="none" stroke="#b45309" strokeWidth={3.5} />)}
            <path d={`M${ox + 150},142 L${ox + 150},112 L${ox + 115},112 M${ox + 186},142 L${ox + 186},120 L${ox + 190},120 L${ox + 190},112`} fill="none" stroke="#64748b" strokeWidth={2} />
            <g transform={`translate(${mx} 152)`}><rect width={44} height={32} fill="#2563eb" /><rect x={44} width={44} height={32} fill="#dc2626" /><text x={16} y={21} fill="#fff" fontWeight={800}>S</text><text x={60} y={21} fill="#fff" fontWeight={800}>N</text></g>
            {p.arrow !== 0 && <line x1={p.arrow === 1 ? mx - 6 : mx + 100} y1={218} x2={p.arrow === 1 ? mx + 40 : mx + 54} y2={218} stroke="#dc2626" strokeWidth={3} markerEnd="url(#i-a)" />}
            <text x={ox + 115} y={244} textAnchor="middle" fontSize={10.5} fill="#475569">{p.note}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------------------------------------------------------------- đăng ký */
export const FIGURES_VL: Record<number, FigureDef[]> = {
  2: [{ id: "energy-bars", title: "Động năng và thế năng thay đổi thế nào?", caption: "Hai biểu đồ minh hoạ công thức Wđ = ½mv² (tỉ lệ với bình phương tốc độ) và Wt = P·h (tỉ lệ với độ cao).", render: () => <EnergyBars /> }],
  3: [{ id: "pendulum", title: "Sự chuyển hoá động năng – thế năng của con lắc", caption: "Ở A và B vật cao nhất (thế năng lớn nhất, động năng bằng 0); ở O vật thấp nhất (động năng lớn nhất). Khi bỏ qua ma sát, cơ năng không đổi.", render: () => <PendulumFigure /> }],
  4: [{ id: "work", title: "Công cơ học: lực và quãng đường dịch chuyển", caption: "Công A = F·s (F, s cùng hướng). Nâng vật lên cao h: lực nâng bằng trọng lượng P nên A = P·h. Công suất P = A/t cho biết công thực hiện trong một giây.", render: () => <WorkFigure /> }],
  5: [{ id: "refraction", title: "Tia sáng khúc xạ khi đi từ không khí vào nước", caption: "Ánh sáng đi từ môi trường chiết suất nhỏ (không khí) sang môi trường chiết suất lớn (nước) thì góc khúc xạ r nhỏ hơn góc tới i: tia khúc xạ lệch lại gần pháp tuyến. Hình vẽ với i = 50° và n₂ = 1,33 theo định luật n₁·sin i = n₂·sin r.", render: () => <RefractionFigure /> }],
  6: [{ id: "tir", title: "Ba trường hợp khi ánh sáng đi từ thuỷ tinh ra không khí", caption: "Khi i tăng dần, tia khúc xạ mờ dần và tia phản xạ sáng dần; từ i = i_th không còn tia khúc xạ.", render: () => <TotalReflectionFigure /> }],
  7: [{ id: "prism", title: "Tán sắc ánh sáng trắng qua lăng kính", caption: "Chùm sáng trắng hẹp qua lăng kính cho dải màu từ đỏ đến tím (quang phổ của ánh sáng trắng).", render: () => <PrismFigure /> }],
  8: [
    { id: "beams", title: "Chùm tia song song qua thấu kính", caption: "Thấu kính hội tụ (rìa mỏng): chùm tia ló hội tụ tại tiêu điểm F. Thấu kính phân kì (rìa dày): chùm tia ló phân kì, đường kéo dài của chúng đi qua tiêu điểm F.", render: () => <ParallelBeams /> },
    { id: "real", title: "Ảnh thật của vật đặt ngoài tiêu cự (d > f)", caption: "Hai tia đặc biệt: tia tới song song trục chính cho tia ló qua tiêu điểm; tia qua quang tâm O đi thẳng. Giao điểm B′ là ảnh của B: ảnh thật, ngược chiều với vật.", render: () => <LensImage f={90} d={230} h={44} title="Thấu kính hội tụ, d > f" note="Ảnh thật, ngược chiều (vẽ theo tỉ lệ: f = 90, d = 230, d′ ≈ 148)" /> },
    { id: "virtual", title: "Ảnh ảo của vật đặt trong tiêu cự (d < f)", caption: "Các tia ló phân kì nên phải kéo dài ngược lại (nét đứt) để tìm ảnh ảo B′: ảnh ảo, cùng chiều và lớn hơn vật. Ảnh ảo vẽ bằng nét đứt.", render: () => <LensImage f={90} d={55} h={34} title="Thấu kính hội tụ, d < f" note="Ảnh ảo, cùng chiều, lớn hơn vật" /> },
    { id: "diverge", title: "Ảnh của vật qua thấu kính phân kì", caption: "Ở mọi vị trí của vật, thấu kính phân kì luôn cho ảnh ảo, cùng chiều và nhỏ hơn vật.", render: () => <LensImage f={-90} d={170} h={50} title="Thấu kính phân kì" note="Ảnh ảo, cùng chiều, nhỏ hơn vật (nằm trong khoảng tiêu cự)" /> },
  ],
  9: [{ id: "silbermann", title: "Phương pháp đối xứng (Silbermann): d = d′ = 2f", caption: "Khi vật cách thấu kính 2f thì ảnh thật cũng cách thấu kính 2f và cao bằng vật; khoảng cách vật – màn L = 4f nên f = (d + d′)/4.", render: () => <LensImage f={75} d={150} h={44} title="Vật tại d = 2f cho ảnh d′ = 2f" note="Ảnh thật, ngược chiều, cao bằng vật (h′ = h)" /> }],
  10: [
    { id: "magnifier", title: "Kính lúp: vật đặt trong khoảng tiêu cự", caption: "Kính lúp là thấu kính hội tụ tiêu cự ngắn. Đặt vật trong khoảng từ quang tâm O đến tiêu điểm F, mắt nhìn thấy ảnh ảo cùng chiều, lớn hơn vật.", render: () => <LensImage f={90} d={55} h={34} title="Kính lúp" note="Ảnh ảo, cùng chiều, lớn hơn vật" /> },
    { id: "bội-giác", title: "Số bội giác G = 25/f (f tính bằng cm)", caption: "Tiêu cự càng ngắn thì số bội giác càng lớn: kính 2x có f = 12,5 cm; 5x có f = 5 cm; 10x có f = 2,5 cm.", render: () => <BarChart unit="G (lần)" data={[{ label: "f = 12,5 cm", value: 2, color: "#a78bfa", note: "kính 2x" }, { label: "f = 5 cm", value: 5, color: "#8b5cf6", note: "kính 5x" }, { label: "f = 2,5 cm", value: 10, color: "#6d28d9", note: "kính 10x" }]} max={11.5} valueDigits={0} /> },
  ],
  11: [
    { id: "ohm-circuit", title: "Sơ đồ mạch điện khảo sát định luật Ohm", caption: "Ampe kế mắc nối tiếp với điện trở để đo cường độ dòng điện I; vôn kế mắc song song với điện trở để đo hiệu điện thế U.", render: () => <Circuit kind="ohm" /> },
    { id: "iu-graph", title: "Đồ thị I – U của điện trở R = 6 Ω", caption: "Số liệu giống Bảng 11.2 của SGK (3 V → 0,5 A; 9 V → 1,5 A). Đồ thị là đường thẳng đi qua gốc toạ độ: I tỉ lệ thuận với U, thương U/I = 6 Ω không đổi.", render: () => <LineChart points={[[0, 0], [3, 0.5], [6, 1], [9, 1.5], [12, 2]]} xLabel="U (V)" yLabel="I (A)" yMax={2} xTicks={[0, 3, 6, 9, 12]} /> },
  ],
  12: [{ id: "series-parallel", title: "Đoạn mạch nối tiếp và đoạn mạch song song", caption: "Nối tiếp: I = I₁ = I₂; U = U₁ + U₂; R_tđ = R₁ + R₂. Song song: U = U₁ = U₂; I = I₁ + I₂; 1/R_tđ = 1/R₁ + 1/R₂.", render: () => <div className="grid gap-3 sm:grid-cols-2"><Circuit kind="series" /><Circuit kind="parallel" /></div> }],
  13: [
    { id: "energy-conversion", title: "Năng lượng điện chuyển hoá thành các dạng năng lượng khác", caption: "Thiết bị điện hoạt động nhờ năng lượng điện (điện năng); năng lượng này được chuyển hoá thành nhiều dạng khác nhau.", render: () => <Hub center={{ emoji: "⚡", title: "Điện năng", text: "W = U·I·t" }} items={[{ emoji: "💡", title: "Đèn điện", text: "quang năng (và nhiệt năng)", tone: "amber" }, { emoji: "🌀", title: "Quạt điện, động cơ", text: "cơ năng", tone: "blue" }, { emoji: "👕", title: "Bàn là, nồi cơm điện", text: "nhiệt năng", tone: "rose" }, { emoji: "🔋", title: "Sạc pin", text: "hoá năng", tone: "green" }]} /> },
    { id: "power-formulas", title: "Năng lượng điện, công suất điện và công suất định mức", caption: "Công suất định mức ghi trên thiết bị: ví dụ bóng đèn 220 V – 60 W sáng bình thường khi mắc vào hiệu điện thế 220 V, khi đó công suất là 60 W.", render: () => <Equations items={[{ label: "Năng lượng điện", eq: "W = U·I·t   (J)" }, { label: "Công suất điện", eq: "𝒫 = U·I   (W)" }, { label: "Đơn vị thực tế", eq: "1 kWh = 3,6·10⁶ J (một “số điện”)" }, { label: "Ví dụ", eq: "220 V – 60 W: I = 60/220 ≈ 0,27 A" }]} /> },
  ],
  14: [{ id: "induction", title: "Dòng điện cảm ứng khi nam châm chuyển động so với cuộn dây", caption: "Kim điện kế lệch khi số đường sức từ xuyên qua tiết diện cuộn dây biến thiên (tăng hoặc giảm), lệch ngược chiều nhau; nam châm đứng yên thì kim chỉ số 0.", render: () => <InductionFigure /> }],
  15: [{ id: "ac-effects", title: "Bốn tác dụng của dòng điện xoay chiều", caption: "Mỗi tác dụng có ứng dụng riêng. Lưu ý: dòng điện xoay chiều có thể gây nguy hiểm đến tính mạng, cần thận trọng khi sử dụng điện ở gia đình.", render: () => <Hub center={{ emoji: "〰️", title: "Dòng điện xoay chiều" }} items={[{ emoji: "🔥", title: "Tác dụng nhiệt", text: "máy sấy tóc, ấm đun nước, bàn là", tone: "rose" }, { emoji: "💡", title: "Tác dụng phát sáng", text: "đèn sợi đốt, đèn huỳnh quang", tone: "amber" }, { emoji: "🧲", title: "Tác dụng từ", text: "cuộn dây hút đinh sắt, nam châm điện, động cơ điện", tone: "blue" }, { emoji: "🫀", title: "Tác dụng sinh lí", text: "co giật cơ (nguy hiểm); máy khử rung tim", tone: "violet" }]} /> }],
  16: [{ id: "energy-cycles", title: "Vòng năng lượng trên Trái Đất", caption: "Năng lượng của Trái Đất đến từ Mặt Trời. Nhiên liệu hoá thạch hình thành từ xác sinh vật qua hàng triệu năm nên có nguồn gốc từ Mặt Trời.", render: () => (
    <div className="flex flex-col gap-4">
      <div><p className="mb-1.5 text-xs font-semibold text-muted-foreground">Vòng năng lượng giữa các vật sống</p><Steps items={[{ emoji: "☀️", title: "Mặt Trời", tone: "amber" }, { emoji: "🌳", title: "Thực vật", text: "hoá năng", tone: "green", via: "quang hợp" }, { emoji: "🐿️", title: "Động vật", tone: "orange", via: "ăn thực vật" }, { emoji: "♨️", title: "CO₂, H₂O, nhiệt", tone: "slate", via: "hô hấp" }]} /></div>
      <div><p className="mb-1.5 text-xs font-semibold text-muted-foreground">Vòng năng lượng theo vòng tuần hoàn của nước</p><Steps items={[{ emoji: "☀️", title: "Mặt Trời", tone: "amber" }, { emoji: "☁️", title: "Hơi nước, mây", tone: "blue", via: "làm nóng, bay hơi" }, { emoji: "🌧️", title: "Mưa, tuyết", tone: "blue", via: "ngưng tụ" }, { emoji: "🌊", title: "Dòng chảy, sóng, gió", text: "thuỷ năng, phong năng", tone: "green" }]} /></div>
      <div><p className="mb-1.5 text-xs font-semibold text-muted-foreground">Nhiên liệu hoá thạch</p><Steps items={[{ emoji: "🍂", title: "Xác sinh vật", tone: "green" }, { emoji: "⛏️", title: "Trầm tích", tone: "slate", via: "bị vùi lấp hàng triệu năm" }, { emoji: "🛢️", title: "Than, dầu mỏ, khí", tone: "slate", via: "biến đổi" }, { emoji: "🔥", title: "Nhiệt, CO₂", tone: "rose", via: "đốt cháy" }]} /></div>
    </div>) }],
  17: [{ id: "renewables", title: "Một số dạng năng lượng tái tạo", caption: "Năng lượng tái tạo được bổ sung liên tục trong tự nhiên. Mỗi dạng đều có ưu điểm (sạch, có sẵn) và hạn chế (chi phí đầu tư, phụ thuộc thời tiết, ảnh hưởng môi trường sống).", render: () => <Hub center={{ emoji: "♻️", title: "Năng lượng tái tạo" }} items={[{ emoji: "☀️", title: "Mặt Trời", text: "pin mặt trời, thu nhiệt. Hạn chế: giá thành cao, chiếm diện tích lớn", tone: "amber" }, { emoji: "🌬️", title: "Gió", text: "tua-bin gió. Hạn chế: tiếng ồn, ảnh hưởng chim di cư", tone: "blue" }, { emoji: "🌊", title: "Sóng biển", text: "phụ thuộc mùa, chịu ảnh hưởng thiên tai; đầu tư cao", tone: "blue" }, { emoji: "💧", title: "Dòng sông", text: "nhà máy thuỷ điện. Hạn chế: ảnh hưởng hệ sinh thái, dân cư", tone: "green" }, { emoji: "💡", title: "Sử dụng hiệu quả năng lượng", text: "đèn LED, tắt thiết bị khi không dùng, phương tiện công cộng", tone: "violet" }, { emoji: "🌱", title: "Bảo vệ môi trường", text: "giảm phát thải, trồng và bảo vệ rừng", tone: "green" }]} /> }],
};
