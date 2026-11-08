import { alkane, BarChart, CompareTable, Equations, Hub, LineChart, Molecule, PieChart, Steps, type FigureDef, type MoleculeDef } from "./primitives";

/* ---- mô hình phân tử dùng chung ---- */
const METHANE: MoleculeDef = { atoms: [["C", 1, 1], ["H", 1, 0], ["H", 1, 2], ["H", 0, 1], ["H", 2, 1]], bonds: [[0, 1], [0, 2], [0, 3], [0, 4]], label: "Methane CH₄" };
const ETHYLENE: MoleculeDef = {
  atoms: [["C", 1, 1], ["C", 2, 1], ["H", 0, 0], ["H", 0, 2], ["H", 3, 0], ["H", 3, 2]],
  bonds: [[0, 1, 2], [0, 2], [0, 3], [1, 4], [1, 5]],
  highlight: [0, 1],
  label: "Ethylene C₂H₄ (có liên kết đôi)",
};
const ETHANOL: MoleculeDef = {
  atoms: [["C", 1, 1], ["C", 2, 1], ["O", 3, 1], ["H", 4, 1], ["H", 1, 0], ["H", 1, 2], ["H", 0, 1], ["H", 2, 0], ["H", 2, 2]],
  bonds: [[0, 1], [1, 2], [2, 3], [0, 4], [0, 5], [0, 6], [1, 7], [1, 8]],
  highlight: [2, 3],
  label: "Ethanol C₂H₅OH (nhóm –OH)",
};
const DIMETHYL_ETHER: MoleculeDef = {
  atoms: [["C", 1, 1], ["O", 2, 1], ["C", 3, 1], ["H", 1, 0], ["H", 1, 2], ["H", 0, 1], ["H", 3, 0], ["H", 3, 2], ["H", 4, 1]],
  bonds: [[0, 1], [1, 2], [0, 3], [0, 4], [0, 5], [2, 6], [2, 7], [2, 8]],
  label: "Dimethyl ether CH₃–O–CH₃",
};
const ACETIC: MoleculeDef = {
  atoms: [["C", 1, 1], ["C", 2, 1], ["O", 2, 0], ["O", 3, 1], ["H", 4, 1], ["H", 1, 0], ["H", 1, 2], ["H", 0, 1]],
  bonds: [[0, 1], [1, 2, 2], [1, 3], [3, 4], [0, 5], [0, 6], [0, 7]],
  highlight: [1, 2, 3, 4],
  label: "Acetic acid CH₃COOH (nhóm –COOH)",
};
const GLYCINE: MoleculeDef = {
  atoms: [["N", 1, 1], ["C", 2, 1], ["C", 3, 1], ["O", 3, 0], ["O", 4, 1], ["H", 5, 1], ["H", 0, 0], ["H", 0, 2], ["H", 2, 0], ["H", 2, 2]],
  bonds: [[0, 1], [1, 2], [2, 3, 2], [2, 4], [4, 5], [0, 6], [0, 7], [1, 8], [1, 9]],
  highlight: [0, 2, 3, 4, 5],
  label: "Glycine H₂N–CH₂–COOH",
};
const ISOBUTANE: MoleculeDef = {
  atoms: [["C", 2, 1], ["C", 1, 1], ["C", 3, 1], ["C", 2, 2], ["H", 2, 0], ["H", 0, 0], ["H", 0, 1], ["H", 0, 2], ["H", 4, 0], ["H", 4, 1], ["H", 4, 2], ["H", 1, 3], ["H", 2, 3], ["H", 3, 3]],
  bonds: [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [1, 6], [1, 7], [2, 8], [2, 9], [2, 10], [3, 11], [3, 12], [3, 13]],
  label: "Isobutane (mạch nhánh)",
};

const row = "flex flex-wrap items-end justify-center gap-6";

/* ---------------------------------------------------------------- Bài 18 */
const B18: FigureDef[] = [
  {
    id: "b18-tinh-chat-vat-ly",
    title: "Tính chất vật lí và ứng dụng của kim loại",
    caption: "Tính chất vật lí quyết định ứng dụng: dẻo → kéo sợi, dát mỏng; dẫn điện → dây điện; dẫn nhiệt → dụng cụ nấu; ánh kim → trang sức.",
    render: () => (
      <Hub
        center={{ emoji: "🔩", title: "Kim loại", text: "Tính chất vật lí chung" }}
        items={[
          { emoji: "🔨", title: "Tính dẻo", text: "Kéo sợi, dát mỏng, rèn (Cu, Al, Au)", tone: "orange" },
          { emoji: "⚡", title: "Dẫn điện", text: "Dây điện (Cu, Al); Ag dẫn điện tốt nhất", tone: "amber" },
          { emoji: "🍳", title: "Dẫn nhiệt", text: "Nồi, chảo, tản nhiệt", tone: "rose" },
          { emoji: "✨", title: "Ánh kim", text: "Trang sức, gương, đồ trang trí", tone: "violet" },
          { emoji: "⚖️", title: "Khối lượng riêng", text: "Al nhẹ (chế tạo máy bay), Pb nặng", tone: "blue" },
          { emoji: "🌡️", title: "Nhiệt độ nóng chảy", text: "W cao nhất (dây tóc bóng đèn), Hg lỏng", tone: "green" },
        ]}
      />
    ),
  },
  {
    id: "b18-tinh-chat-hoa-hoc",
    title: "Sơ đồ tính chất hoá học của kim loại",
    caption: "Kim loại thường tham gia 4 kiểu phản ứng; ở mọi phản ứng nguyên tử kim loại đều nhường electron.",
    render: () => (
      <div className="flex flex-col gap-4">
        <Hub
          center={{ emoji: "⚗️", title: "Kim loại M" }}
          items={[
            { title: "+ Phi kim", text: "Tạo oxide, muối (2Mg + O₂ → 2MgO)", tone: "orange" },
            { title: "+ Dung dịch acid", text: "Tạo muối + H₂ (Zn + 2HCl → ZnCl₂ + H₂)", tone: "rose" },
            { title: "+ Nước", text: "Chỉ K, Na, Ca…: base + H₂", tone: "blue" },
            { title: "+ Dung dịch muối", text: "Kim loại mạnh đẩy kim loại yếu (Fe + CuSO₄)", tone: "green" },
          ]}
        />
      </div>
    ),
  },
];

/* ---------------------------------------------------------------- Bài 19 */
const SERIES = ["K", "Na", "Ca", "Mg", "Al", "Zn", "Fe", "Pb", "H", "Cu", "Ag", "Au"];
function ActivitySeriesFigure() {
  const col = (m: string, i: number) => {
    const t = i / (SERIES.length - 1);
    return m === "H" ? "#38bdf8" : `rgb(${Math.round(249 - t * 120)},${Math.round(115 + t * 60)},${Math.round(22 + t * 60)})`;
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-1">
        {SERIES.map((m, i) => (
          <span key={m} className="flex size-10 items-center justify-center rounded-lg border text-sm font-bold text-white shadow-sm" style={{ background: col(m, i) }}>{m}</span>
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><span>Mạnh</span><div className="h-1 flex-1 rounded bg-gradient-to-r from-orange-500 to-slate-300" /><span>Yếu</span></div>
      <div className="grid gap-2 text-xs sm:grid-cols-3">
        <p className="rounded-lg border border-rose-200 bg-rose-50 p-2"><b>K, Na, Ca</b> phản ứng với nước ở điều kiện thường.</p>
        <p className="rounded-lg border border-sky-200 bg-sky-50 p-2">Kim loại <b>đứng trước H</b> đẩy H₂ khỏi dung dịch acid (HCl, H₂SO₄ loãng).</p>
        <p className="rounded-lg border border-green-200 bg-green-50 p-2">Kim loại <b>đứng trước</b> (trừ K, Na, Ca) đẩy kim loại <b>đứng sau</b> ra khỏi dung dịch muối.</p>
      </div>
    </div>
  );
}
const B19: FigureDef[] = [
  { id: "b19-day-hoat-dong", title: "Dãy hoạt động hoá học của kim loại", caption: "Mức độ hoạt động hoá học giảm dần từ trái sang phải. Ví dụ: Fe + CuSO₄ → FeSO₄ + Cu (Fe đứng trước Cu).", render: () => <ActivitySeriesFigure /> },
];

/* ---------------------------------------------------------------- Bài 20 */
const B20: FigureDef[] = [
  {
    id: "b20-phuong-phap-tach",
    title: "Chọn phương pháp tách kim loại theo mức độ hoạt động",
    caption: "Kim loại càng hoạt động càng khó tách ra khỏi hợp chất, cần phương pháp mạnh hơn.",
    render: () => (
      <CompareTable
        cols={[{ title: "K … Al", tone: "rose" }, { title: "Zn … Pb", tone: "orange" }, { title: "Cu … Au", tone: "green" }]}
        rows={[
          { label: "Phương pháp", cells: ["Điện phân nóng chảy", "Nhiệt luyện (C, CO, H₂)", "Nhiệt phân / thuỷ luyện"] },
          { label: "Ví dụ", cells: ["2Al₂O₃ → 4Al + 3O₂", "Fe₂O₃ + 3CO → 2Fe + 3CO₂", "Fe + CuSO₄ → FeSO₄ + Cu"] },
        ]}
      />
    ),
  },
  {
    id: "b20-san-xuat-gang-thep",
    title: "Sản xuất gang và thép",
    caption: "Gang chứa 2–5 % carbon, thép chứa dưới 2 % carbon. Thép được luyện từ gang bằng cách giảm lượng carbon (oxi hoá bớt C, Si, Mn…).",
    render: () => (
      <div className="flex flex-col gap-4">
        <Steps
          items={[
            { emoji: "⛰️", title: "Quặng sắt", text: "Fe₂O₃, Fe₃O₄", tone: "amber" },
            { emoji: "🏭", title: "Lò cao", text: "Than cốc (C) tạo CO khử oxide sắt", tone: "rose", via: "+ than cốc, đá vôi, không khí nóng" },
            { emoji: "🔶", title: "Gang", text: "2 – 5 % C", tone: "orange" },
            { emoji: "🔥", title: "Lò luyện thép", text: "Thổi O₂ để oxi hoá bớt C", tone: "violet", via: "+ O₂" },
            { emoji: "🏗️", title: "Thép", text: "< 2 % C", tone: "blue" },
          ]}
        />
        <Equations items={[{ label: "Khử oxide sắt", eq: "Fe₂O₃ + 3CO → 2Fe + 3CO₂" }]} />
      </div>
    ),
  },
  {
    id: "b20-ham-luong-carbon",
    title: "Hàm lượng carbon: thép và gang",
    caption: "Hàm lượng carbon càng cao, vật liệu càng cứng nhưng càng giòn.",
    render: () => (
      <svg viewBox="0 0 420 110" className="mx-auto h-auto w-full max-w-md" role="img" aria-label="Thang hàm lượng carbon">
        <rect x={20} y={30} width={150} height={26} rx={6} fill="#38bdf8" /><rect x={170} y={30} width={230} height={26} rx={6} fill="#f97316" />
        <text x={95} y={48} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff">Thép</text><text x={285} y={48} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff">Gang</text>
        <line x1={20} y1={70} x2={400} y2={70} stroke="#64748b" />
        {[[20, "0"], [170, "2 %"], [400, "5 %"]].map(([x, t]) => <g key={t as string}><line x1={x as number} y1={66} x2={x as number} y2={74} stroke="#64748b" /><text x={x as number} y={90} textAnchor="middle" fontSize={12} fill="#475569">{t}</text></g>)}
        <text x={210} y={106} textAnchor="middle" fontSize={11} fill="#64748b">hàm lượng carbon</text>
      </svg>
    ),
  },
];

/* ---------------------------------------------------------------- Bài 21 */
const B21: FigureDef[] = [
  {
    id: "b21-kim-loai-phi-kim",
    title: "So sánh kim loại và phi kim",
    caption: "Phi kim thường không dẫn điện, không có ánh kim; carbon (than chì) là ngoại lệ dẫn điện.",
    render: () => (
      <CompareTable
        cols={[{ title: "Kim loại", tone: "orange" }, { title: "Phi kim", tone: "blue" }]}
        rows={[
          { label: "Trạng thái", cells: ["Rắn (trừ Hg)", "Rắn, lỏng (Br₂), khí (O₂, Cl₂)"] },
          { label: "Dẫn điện, nhiệt", cells: ["Tốt", "Kém (trừ than chì)"] },
          { label: "Ánh kim", cells: ["Có", "Không (trừ iodine)"] },
          { label: "Tính dẻo", cells: ["Dẻo, kéo sợi, dát mỏng", "Giòn (ở thể rắn)"] },
          { label: "Khi phản ứng", cells: ["Dễ nhường electron", "Dễ nhận electron"] },
        ]}
      />
    ),
  },
  {
    id: "b21-hap-phu-than",
    title: "Than hoạt tính hấp phụ chất màu, mùi",
    caption: "Than có cấu trúc xốp, diện tích bề mặt lớn nên hấp phụ chất màu, chất độc, mùi: dùng trong mặt nạ phòng độc, lọc nước.",
    render: () => (
      <Steps
        items={[
          { emoji: "🧪", title: "Dung dịch có màu", text: "Mực, mùi", tone: "violet" },
          { emoji: "⚫", title: "Thêm than hoạt tính", text: "Chất màu bám lên bề mặt than", tone: "slate", via: "lắc đều" },
          { emoji: "💧", title: "Lọc bỏ than", text: "Dung dịch nhạt màu / hết mùi", tone: "blue", via: "lọc" },
        ]}
      />
    ),
  },
];

/* ---------------------------------------------------------------- Bài 22 */
const B22: FigureDef[] = [
  {
    id: "b22-cong-thuc-cau-tao",
    title: "Công thức cấu tạo: methane, ethane, ethylene",
    caption: "Trong hợp chất hữu cơ, C luôn có hoá trị IV, H hoá trị I. Quả cầu xám: C, trắng: H.",
    render: () => (
      <div className={row}>
        <Molecule m={METHANE} />
        <Molecule m={alkane(2, "Ethane C₂H₆")} />
        <Molecule m={ETHYLENE} />
      </div>
    ),
  },
  {
    id: "b22-dong-phan",
    title: "Cùng công thức phân tử, khác cấu tạo → khác tính chất",
    caption: "Ethanol (lỏng, tan trong nước) và dimethyl ether (khí) cùng có công thức C₂H₆O nhưng cách liên kết khác nhau.",
    render: () => (
      <div className={row}>
        <Molecule m={ETHANOL} />
        <Molecule m={DIMETHYL_ETHER} />
      </div>
    ),
  },
  {
    id: "b22-mach-carbon",
    title: "Các dạng mạch carbon",
    caption: "Mạch carbon có thể là mạch thẳng, mạch nhánh hoặc mạch vòng.",
    render: () => (
      <div className={row}>
        <Molecule m={alkane(4, "Mạch thẳng (butane)")} unit={34} />
        <Molecule m={ISOBUTANE} unit={34} />
        <svg viewBox="0 0 120 130" className="h-auto w-28" role="img" aria-label="Mạch vòng">
          <polygon points="60,18 100,41 100,87 60,110 20,87 20,41" fill="none" stroke="#334155" strokeWidth={4} />
          {[[60, 18], [100, 41], [100, 87], [60, 110], [20, 87], [20, 41]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={11} fill="#475569" />)}
          <text x={60} y={128} textAnchor="middle" fontSize={11} fontWeight={600} fill="#475569">Mạch vòng (carbon)</text>
        </svg>
      </div>
    ),
  },
];

/* ---------------------------------------------------------------- Bài 23 */
const B23: FigureDef[] = [
  {
    id: "b23-alkane",
    title: "Dãy alkane: CₙH₂ₙ₊₂",
    caption: "Chỉ có liên kết đơn C–C và C–H. Mỗi nguyên tử carbon liên kết với 4 nguyên tử khác.",
    render: () => (
      <div className={row}>
        <Molecule m={METHANE} unit={40} />
        <Molecule m={alkane(2, "Ethane C₂H₆")} unit={40} />
        <Molecule m={alkane(3, "Propane C₃H₈")} unit={40} />
        <Molecule m={alkane(4, "Butane C₄H₁₀")} unit={40} />
      </div>
    ),
  },
  {
    id: "b23-nhiet-chay",
    title: "Nhiệt toả ra khi đốt cháy 1 mol alkane (kJ)",
    caption: "Mạch carbon càng dài, đốt 1 mol càng toả nhiều nhiệt. Nhưng tính theo 1 gam thì lại giảm nhẹ (55,7 → 49,6 kJ/g).",
    render: () => (
      <BarChart unit="kJ/mol" valueDigits={0} data={[{ label: "CH₄", value: 891 }, { label: "C₂H₆", value: 1561 }, { label: "C₃H₈", value: 2220 }, { label: "C₄H₁₀", value: 2878 }]} max={3300} />
    ),
  },
  {
    id: "b23-chay",
    title: "Phản ứng cháy và phản ứng thế của alkane",
    caption: "Alkane cháy toả nhiều nhiệt (làm nhiên liệu); dưới ánh sáng, alkane có thể thế H bằng Cl.",
    render: () => (
      <Equations items={[{ label: "Cháy", eq: "CH₄ + 2O₂ → CO₂ + 2H₂O" }, { label: "Thế", eq: "CH₄ + Cl₂ → CH₃Cl + HCl (ánh sáng)" }]} />
    ),
  },
];

/* ---------------------------------------------------------------- Bài 24 */
const B24: FigureDef[] = [
  {
    id: "b24-ethylene",
    title: "Ethylene C₂H₄ và phản ứng cộng",
    caption: "Liên kết đôi C=C kém bền: một liên kết bị bẻ gãy để cộng thêm nguyên tử khác → dung dịch bromine mất màu.",
    render: () => (
      <div className="flex flex-col gap-4">
        <div className={row}><Molecule m={ETHYLENE} /></div>
        <Equations items={[{ label: "Cộng bromine", eq: "CH₂=CH₂ + Br₂ → CH₂Br–CH₂Br" }, { label: "Cháy", eq: "C₂H₄ + 3O₂ → 2CO₂ + 2H₂O" }]} />
      </div>
    ),
  },
  {
    id: "b24-trung-hop",
    title: "Phản ứng trùng hợp tạo polyethylene (PE)",
    caption: "Nhiều phân tử ethylene (monomer) kết hợp với nhau thành phân tử rất lớn (polymer): túi nylon, màng bọc thực phẩm.",
    render: () => (
      <Steps
        items={[
          { emoji: "🔹", title: "Nhiều phân tử C₂H₄", text: "monomer", tone: "blue" },
          { emoji: "🔗", title: "–CH₂–CH₂–CH₂–CH₂–…", text: "mạch dài nối tiếp", tone: "orange", via: "nhiệt độ, áp suất, xúc tác" },
          { emoji: "🛍️", title: "Polyethylene (PE)", text: "túi, màng bọc, ống nhựa", tone: "green" },
        ]}
      />
    ),
  },
];

/* ---------------------------------------------------------------- Bài 25 */
function Distillation() {
  const frac = [
    { n: "Khí (C₁–C₄)", d: "Khí đốt, gas", c: "#bae6fd", t: "< 40 °C" },
    { n: "Xăng", d: "Nhiên liệu xe máy, ô tô", c: "#fde68a", t: "40–180 °C" },
    { n: "Dầu hoả", d: "Nhiên liệu máy bay, đèn dầu", c: "#fdba74", t: "180–250 °C" },
    { n: "Dầu diesel", d: "Nhiên liệu xe tải, tàu", c: "#fb923c", t: "250–350 °C" },
    { n: "Dầu mazut", d: "Nhiên liệu lò, nhựa đường", c: "#78350f", t: "> 350 °C" },
  ];
  return (
    <div className="flex items-stretch gap-3">
      <div className="flex w-28 flex-col items-center justify-between rounded-xl border bg-orange-50 p-2 text-center text-xs font-semibold text-orange-900">
        <span>🛢️ Dầu thô</span><span aria-hidden>→ đun nóng →</span><span>Tháp chưng cất</span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        {frac.map((f) => (
          <div key={f.n} className="flex items-center gap-2 rounded-lg border px-3 py-1.5" style={{ background: f.c, color: f.n === "Dầu mazut" ? "#fff" : "#1c1917" }}>
            <span className="w-28 text-sm font-bold">{f.n}</span><span className="flex-1 text-xs">{f.d}</span><span className="text-xs font-medium">{f.t}</span>
          </div>
        ))}
        <p className="text-center text-[10px] text-muted-foreground">▲ nhẹ, sôi thấp (lên đỉnh tháp) — nặng, sôi cao (xuống đáy tháp) ▼</p>
      </div>
    </div>
  );
}
const B25: FigureDef[] = [
  { id: "b25-chung-cat", title: "Chưng cất phân đoạn dầu mỏ", caption: "Dầu mỏ là hỗn hợp nhiều hydrocarbon. Chưng cất tách thành các phân đoạn theo nhiệt độ sôi (giá trị gần đúng).", render: () => <Distillation /> },
  {
    id: "b25-khai-thac",
    title: "Từ mỏ dầu, khí đến nhiên liệu",
    caption: "Dầu mỏ và khí thiên nhiên nằm trong lòng đất, được khai thác rồi chế biến thành nhiên liệu và nguyên liệu hoá học.",
    render: () => (
      <Steps
        items={[
          { emoji: "🌊", title: "Khai thác", text: "giàn khoan trên biển, trên đất liền", tone: "blue" },
          { emoji: "🚢", title: "Vận chuyển", text: "đường ống, tàu chở dầu", tone: "slate" },
          { emoji: "🏭", title: "Nhà máy lọc dầu", text: "chưng cất, chế biến", tone: "orange" },
          { emoji: "⛽", title: "Sản phẩm", text: "xăng, dầu, hoá chất, nhựa", tone: "green" },
        ]}
      />
    ),
  },
];

/* ---------------------------------------------------------------- Bài 26 */
const B26: FigureDef[] = [
  {
    id: "b26-ethanol",
    title: "Phân tử ethanol và nhóm –OH",
    caption: "Nhóm –OH (O và H được tô vàng) quyết định tính chất đặc trưng của ethanol: tan vô hạn trong nước, tác dụng với Na.",
    render: () => <div className={row}><Molecule m={ETHANOL} /></div>,
  },
  {
    id: "b26-do-con",
    title: "Độ cồn là gì?",
    caption: "Độ cồn là số mL ethanol nguyên chất có trong 100 mL dung dịch. Ví dụ cồn 70° dùng để sát khuẩn.",
    render: () => (
      <div className="flex items-end justify-center gap-6">
        <svg viewBox="0 0 120 190" className="h-44 w-auto" role="img" aria-label="Cồn 70 độ">
          <rect x={30} y={10} width={60} height={170} rx={8} fill="#fff" stroke="#475569" strokeWidth={3} />
          <rect x={33} y={13 + 164 * 0.3} width={54} height={164 * 0.7} fill="#fb923c" opacity={0.85} />
          <rect x={33} y={13} width={54} height={164 * 0.3} fill="#bae6fd" opacity={0.8} />
          <text x={60} y={70} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0369a1">30 mL nước</text>
          <text x={60} y={125} textAnchor="middle" fontSize={12} fontWeight={700} fill="#fff">70 mL</text>
          <text x={60} y={141} textAnchor="middle" fontSize={11} fill="#fff">ethanol</text>
        </svg>
        <div className="max-w-48 text-sm"><p className="font-bold text-orange-700">Cồn 70°</p><p className="text-xs text-muted-foreground">100 mL dung dịch chứa 70 mL ethanol nguyên chất.</p></div>
      </div>
    ),
  },
  {
    id: "b26-dieu-che",
    title: "Hai cách điều chế ethanol",
    caption: "Ethanol được sản xuất bằng lên men tinh bột/đường, hoặc cộng nước vào ethylene.",
    render: () => (
      <div className="flex flex-col gap-3">
        <Steps items={[{ emoji: "🌾", title: "Tinh bột, đường", tone: "amber" }, { emoji: "🍺", title: "Lên men", text: "men rượu", tone: "violet", via: "enzyme" }, { emoji: "🥃", title: "Ethanol", tone: "orange" }]} />
        <Equations items={[{ label: "Từ ethylene", eq: "C₂H₄ + H₂O → C₂H₅OH (acid, t°)" }]} />
      </div>
    ),
  },
];

/* ---------------------------------------------------------------- Bài 27 */
const B27: FigureDef[] = [
  {
    id: "b27-acetic",
    title: "Phân tử acetic acid và nhóm –COOH",
    caption: "Nhóm –COOH (được tô vàng) làm acetic acid có tính acid: đổi màu quỳ tím, tác dụng với kim loại, base, muối carbonate.",
    render: () => <div className={row}><Molecule m={ACETIC} /></div>,
  },
  {
    id: "b27-este",
    title: "Phản ứng ester hoá",
    caption: "Acetic acid + ethanol (H₂SO₄ đặc, đun nóng) tạo ethyl acetate, chất lỏng có mùi thơm; phản ứng thuận nghịch.",
    render: () => (
      <div className="flex flex-col gap-3">
        <Steps items={[{ emoji: "🧴", title: "CH₃COOH", text: "acetic acid", tone: "rose" }, { emoji: "🥃", title: "+ C₂H₅OH", text: "ethanol", tone: "orange", via: "H₂SO₄ đặc, t°" }, { emoji: "🍐", title: "CH₃COOC₂H₅ + H₂O", text: "ethyl acetate (mùi thơm)", tone: "green" }]} />
      </div>
    ),
  },
  {
    id: "b27-giam-an",
    title: "Giấm ăn và các ứng dụng",
    caption: "Giấm ăn là dung dịch acetic acid loãng (2–5 %), điều chế bằng cách lên men ethanol.",
    render: () => <Steps items={[{ emoji: "🥃", title: "Ethanol", tone: "orange" }, { emoji: "🦠", title: "Lên men giấm", text: "men giấm + O₂", tone: "violet", via: "O₂" }, { emoji: "🍶", title: "Giấm ăn", text: "gia vị, tẩy cặn", tone: "green" }]} />,
  },
];

/* ---------------------------------------------------------------- Bài 28 */
const B28: FigureDef[] = [
  {
    id: "b28-chat-beo",
    title: "Cấu tạo chất béo",
    caption: "Chất béo (triglyceride) gồm 1 phân tử glycerol liên kết với 3 gốc acid béo. Dầu thực vật thường lỏng, mỡ động vật thường rắn.",
    render: () => (
      <svg viewBox="0 0 440 150" className="mx-auto h-auto w-full max-w-lg" role="img" aria-label="Cấu tạo chất béo">
        <rect x={10} y={14} width={46} height={122} rx={10} fill="#fcd34d" stroke="#b45309" />
        <text x={33} y={78} textAnchor="middle" fontSize={12} fontWeight={700} fill="#78350f" transform="rotate(-90 33 78)">Glycerol</text>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={56} y={22 + i * 42} width={26} height={24} fill="#fb923c" stroke="#9a3412" />
            <path d={`M82,${34 + i * 42} q30,-12 60,0 t60,0 t60,0 t60,0 t60,0`} fill="none" stroke="#9a3412" strokeWidth={4} />
            <text x={69} y={38 + i * 42} textAnchor="middle" fontSize={10} fill="#fff" fontWeight={700}>COO</text>
          </g>
        ))}
        <text x={310} y={146} textAnchor="middle" fontSize={11} fill="#64748b">3 gốc acid béo (mạch carbon dài)</text>
      </svg>
    ),
  },
  {
    id: "b28-xa-phong",
    title: "Phản ứng xà phòng hoá",
    caption: "Đun chất béo với dung dịch kiềm (NaOH) tạo glycerol và muối của acid béo – thành phần chính của xà phòng.",
    render: () => (
      <div className="flex flex-col gap-3">
        <Steps items={[{ emoji: "🧈", title: "Chất béo", tone: "amber" }, { emoji: "🧪", title: "+ NaOH", text: "đun nóng", tone: "blue", via: "t°" }, { emoji: "🧼", title: "Muối acid béo (xà phòng) + glycerol", tone: "green" }]} />
      </div>
    ),
  },
];

/* ---------------------------------------------------------------- Bài 29 */
const B29: FigureDef[] = [
  {
    id: "b29-carbohydrate",
    title: "Họ carbohydrate: glucose – saccharose – tinh bột – cellulose",
    caption: "Glucose, saccharose, tinh bột, cellulose là những carbohydrate quen thuộc; chúng chứa C, H, O.",
    render: () => (
      <Hub
        center={{ emoji: "🍬", title: "Carbohydrate" }}
        items={[
          { emoji: "🍇", title: "Glucose C₆H₁₂O₆", text: "Có trong quả chín; tráng bạc", tone: "violet" },
          { emoji: "🍯", title: "Saccharose C₁₂H₂₂O₁₁", text: "Đường mía, đường củ cải", tone: "amber" },
          { emoji: "🍚", title: "Tinh bột (C₆H₁₀O₅)ₙ", text: "Gạo, ngô, khoai; hồ tinh bột + iodine → xanh tím", tone: "orange" },
          { emoji: "🌿", title: "Cellulose (C₆H₁₀O₅)ₙ", text: "Gỗ, bông; không tan trong nước", tone: "green" },
        ]}
      />
    ),
  },
  {
    id: "b29-thuy-phan",
    title: "Thuỷ phân tạo glucose",
    caption: "Saccharose, tinh bột, cellulose thuỷ phân (có acid hoặc enzyme) tạo glucose; glucose lên men tạo ethanol.",
    render: () => <Steps items={[{ emoji: "🍚", title: "Tinh bột / cellulose", tone: "orange" }, { emoji: "🍇", title: "Glucose", tone: "violet", via: "H₂O, acid hoặc enzyme" }, { emoji: "🥃", title: "Ethanol + CO₂", tone: "amber", via: "men rượu" }]} />,
  },
];

/* ---------------------------------------------------------------- Bài 30 */
const B30: FigureDef[] = [
  {
    id: "b30-quang-hop",
    title: "Cây xanh tạo tinh bột và cellulose nhờ quang hợp",
    caption: "Khi có ánh sáng và chất diệp lục, cây xanh biến CO₂ và H₂O thành glucose, rồi tạo tinh bột (dự trữ) và cellulose (thành tế bào).",
    render: () => (
      <div className="flex flex-col gap-3">
        <Steps items={[{ emoji: "☀️", title: "CO₂ + H₂O", text: "ánh sáng, chất diệp lục", tone: "green" }, { emoji: "🍇", title: "Glucose", tone: "violet", via: "quang hợp" }, { emoji: "🍚", title: "Tinh bột", text: "củ, hạt (dự trữ)", tone: "orange" }, { emoji: "🌳", title: "Cellulose", text: "thân, vỏ (cấu trúc)", tone: "amber" }]} />
        <Equations items={[{ eq: "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (ánh sáng, diệp lục)" }]} />
      </div>
    ),
  },
  {
    id: "b30-nhan-biet",
    title: "Nhận biết tinh bột bằng dung dịch iodine",
    caption: "Tinh bột làm dung dịch iodine (màu vàng nâu) chuyển sang màu xanh tím; khi đun nóng màu mất đi và hiện lại khi để nguội.",
    render: () => (
      <div className="flex flex-wrap items-center justify-center gap-4">
        {[{ t: "Dung dịch iodine", c: "#b45309" }, { t: "+ hồ tinh bột", c: "#3730a3" }].map((x, i) => (
          <div key={x.t} className="flex items-center gap-4">
            {i === 1 && <span aria-hidden className="text-xl">→</span>}
            <div className="flex flex-col items-center gap-1">
              <svg viewBox="0 0 70 100" className="h-24 w-auto" aria-hidden><path d="M12,6 L12,70 Q12,92 35,92 Q58,92 58,70 L58,6" fill="none" stroke="#475569" strokeWidth={3} /><path d="M14,40 L14,70 Q14,90 35,90 Q56,90 56,70 L56,40 Z" fill={x.c} opacity={0.9} /></svg>
              <span className="text-xs font-medium">{x.t}</span>
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

/* ---------------------------------------------------------------- Bài 31 */
const B31: FigureDef[] = [
  {
    id: "b31-amino-peptide",
    title: "Amino acid → chuỗi peptide → protein",
    caption: "Protein là polymer thiên nhiên gồm nhiều amino acid liên kết với nhau (liên kết peptide). Nhóm –NH₂ và –COOH (tô vàng) tham gia tạo liên kết.",
    render: () => (
      <div className="flex flex-col gap-3">
        <div className={row}><Molecule m={GLYCINE} /></div>
        <Steps items={[{ emoji: "🔸", title: "Amino acid", tone: "amber" }, { emoji: "🔗", title: "Peptide", text: "vài đến hàng chục amino acid", tone: "orange", via: "liên kết peptide" }, { emoji: "🧬", title: "Protein", text: "chuỗi dài, cuộn gấp phức tạp", tone: "violet" }]} />
      </div>
    ),
  },
  {
    id: "b31-vai-tro",
    title: "Vai trò của protein",
    caption: "Protein cấu tạo nên cơ thể và điều hoà hoạt động sống. Khi đun nóng hoặc gặp acid, kiềm, protein bị đông tụ.",
    render: () => (
      <Hub
        center={{ emoji: "🥚", title: "Protein" }}
        items={[
          { emoji: "💪", title: "Xây dựng cơ thể", text: "Cơ, da, tóc, móng", tone: "rose" },
          { emoji: "⚙️", title: "Enzyme", text: "Xúc tác phản ứng sinh hoá", tone: "blue" },
          { emoji: "🛡️", title: "Kháng thể", text: "Bảo vệ cơ thể", tone: "green" },
        ]}
      />
    ),
  },
];

/* ---------------------------------------------------------------- Bài 32 */
const Bead = ({ c }: { c: string }) => <span className="inline-block size-5 rounded-full border-2 border-slate-700" style={{ background: c }} />;

function PolymerChain() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground">Monomer:</span>
        <Bead c="#f97316" /><Bead c="#f97316" /><Bead c="#f97316" />
        <span className="text-lg" aria-hidden>→</span>
        <span className="text-xs font-semibold text-muted-foreground">Polymer:</span>
        <div className="flex items-center">{Array.from({ length: 9 }).map((_, i) => <span key={i} className="flex items-center"><Bead c="#f97316" />{i < 8 && <i className="h-0.5 w-2 bg-slate-700" />}</span>)}</div>
      </div>
      <div className="grid gap-2 text-center text-xs sm:grid-cols-3">
        {[{ t: "Mạch không phân nhánh", d: "PE, PVC" }, { t: "Mạch phân nhánh", d: "Tinh bột (amylopectin)" }, { t: "Mạng không gian", d: "Cao su lưu hoá, bakelite" }].map((x) => (
          <div key={x.t} className="rounded-lg border bg-muted/40 p-2"><p className="font-semibold">{x.t}</p><p className="text-muted-foreground">{x.d}</p></div>
        ))}
      </div>
    </div>
  );
}
const B32: FigureDef[] = [
  { id: "b32-polymer", title: "Polymer: nhiều mắt xích nối thành mạch dài", caption: "Polymer được tạo từ nhiều monomer giống nhau (mắt xích). Polymer có thể có mạch thẳng, mạch nhánh hoặc mạng không gian.", render: () => <PolymerChain /> },
  {
    id: "b32-5r",
    title: "Giảm ô nhiễm nhựa: quy tắc 5R",
    caption: "Rác thải nhựa phân huỷ rất chậm; hãy ưu tiên giảm thiểu và tái sử dụng.",
    render: () => (
      <Steps
        items={[
          { emoji: "🚫", title: "Refuse", text: "Từ chối đồ nhựa dùng một lần", tone: "rose" },
          { emoji: "📉", title: "Reduce", text: "Giảm sử dụng", tone: "orange" },
          { emoji: "🔁", title: "Reuse", text: "Tái sử dụng", tone: "amber" },
          { emoji: "♻️", title: "Recycle", text: "Tái chế", tone: "green" },
          { emoji: "🌱", title: "Rot", text: "Dùng vật liệu phân huỷ", tone: "blue" },
        ]}
      />
    ),
  },
];

/* ---------------------------------------------------------------- Bài 33 */
const B33: FigureDef[] = [
  {
    id: "b33-thanh-phan-vo-trai-dat",
    title: "Thành phần các nguyên tố trong vỏ Trái Đất (% khối lượng)",
    caption: "Oxygen và silicon chiếm gần ¾ khối lượng vỏ Trái Đất; kim loại phổ biến nhất là aluminium.",
    render: () => (
      <PieChart
        data={[
          { label: "Oxygen (O)", value: 46.1, color: "#ef4444" },
          { label: "Silicon (Si)", value: 28.2, color: "#f59e0b" },
          { label: "Aluminium (Al)", value: 8.23, color: "#94a3b8" },
          { label: "Iron (Fe)", value: 5.63, color: "#78350f" },
          { label: "Calcium (Ca)", value: 4.15, color: "#22c55e" },
          { label: "Sodium (Na)", value: 2.36, color: "#a78bfa" },
          { label: "Magnesium (Mg)", value: 2.33, color: "#06b6d4" },
          { label: "Potassium (K)", value: 2.09, color: "#ec4899" },
          { label: "Khác", value: 0.91, color: "#cbd5e1" },
        ]}
      />
    ),
  },
  {
    id: "b33-tai-nguyen",
    title: "Tài nguyên từ vỏ Trái Đất",
    caption: "Khoáng sản và nhiên liệu hoá thạch được khai thác từ vỏ Trái Đất. Chúng không tái tạo nên cần khai thác, sử dụng hợp lí.",
    render: () => (
      <Hub
        center={{ emoji: "🌍", title: "Vỏ Trái Đất" }}
        items={[
          { emoji: "⛏️", title: "Quặng kim loại", text: "Sắt, nhôm, đồng…", tone: "slate" },
          { emoji: "🪨", title: "Đá, cát, đất sét", text: "Vật liệu xây dựng", tone: "amber" },
          { emoji: "🛢️", title: "Nhiên liệu hoá thạch", text: "Than, dầu mỏ, khí tự nhiên", tone: "rose" },
        ]}
      />
    ),
  },
];

/* ---------------------------------------------------------------- Bài 34 */
const B34: FigureDef[] = [
  {
    id: "b34-vat-lieu",
    title: "Từ nguyên liệu đến vật liệu silicate",
    caption: "Silicate và đá vôi là nguyên liệu để sản xuất thuỷ tinh, xi măng, gốm sứ, vôi.",
    render: () => (
      <div className="flex flex-col gap-3">
        <Steps items={[{ emoji: "🏖️", title: "Cát, soda, đá vôi", tone: "amber" }, { emoji: "🔥", title: "Nung chảy ~1500 °C", tone: "rose", via: "nhiệt độ cao" }, { emoji: "🪟", title: "Thuỷ tinh", tone: "blue" }]} />
        <Steps items={[{ emoji: "🪨", title: "Đá vôi, đất sét", tone: "slate" }, { emoji: "🏭", title: "Nung trong lò quay", tone: "rose", via: "nghiền, nung" }, { emoji: "🏗️", title: "Xi măng", text: "+ nước, cát → vữa, bê tông", tone: "green" }]} />
        <Equations items={[{ label: "Nung vôi", eq: "CaCO₃ → CaO + CO₂ (t°)" }]} />
      </div>
    ),
  },
];

/* ---------------------------------------------------------------- Bài 35 */
const B35: FigureDef[] = [
  {
    id: "b35-chu-trinh-carbon",
    title: "Chu trình carbon trong tự nhiên",
    caption: "Carbon di chuyển giữa khí quyển, sinh vật và nhiên liệu hoá thạch. Đốt nhiên liệu hoá thạch làm tăng lượng CO₂ trong khí quyển.",
    render: () => (
      <Steps
        items={[
          { emoji: "☁️", title: "CO₂ trong khí quyển", tone: "slate" },
          { emoji: "🌳", title: "Cây xanh", text: "quang hợp", tone: "green", via: "hấp thụ CO₂" },
          { emoji: "🐄", title: "Động vật", text: "ăn thực vật, hô hấp", tone: "amber", via: "thức ăn" },
          { emoji: "🏭", title: "Đốt nhiên liệu, hô hấp, phân huỷ", tone: "rose", via: "thải CO₂" },
        ]}
      />
    ),
  },
  {
    id: "b35-hieu-ung-nha-kinh",
    title: "Hiệu ứng nhà kính",
    caption: "Các khí nhà kính (CO₂, CH₄…) giữ lại một phần nhiệt từ Trái Đất, làm Trái Đất ấm lên; quá nhiều khí nhà kính gây nóng lên toàn cầu.",
    render: () => (
      <Steps
        items={[
          { emoji: "☀️", title: "Ánh sáng Mặt Trời", text: "chiếu xuống Trái Đất", tone: "amber" },
          { emoji: "🌍", title: "Mặt đất nóng lên", text: "phát bức xạ nhiệt", tone: "orange", via: "hấp thụ" },
          { emoji: "☁️", title: "Khí nhà kính", text: "CO₂, CH₄ giữ lại nhiệt", tone: "slate", via: "bức xạ nhiệt" },
          { emoji: "🌡️", title: "Nhiệt độ tăng", text: "băng tan, nước biển dâng", tone: "rose" },
        ]}
      />
    ),
  },
  {
    id: "b35-san-luong-dau-tho",
    title: "Sản lượng dầu thô thế giới (tỉ thùng/năm)",
    caption: "Nhu cầu sử dụng nhiên liệu hoá thạch tăng nhanh trong nhiều thập kỉ, kéo theo lượng CO₂ thải ra tăng.",
    render: () => (
      <LineChart
        points={[[1988, 23.7], [1992, 24.5], [1996, 26.2], [2000, 28.2], [2004, 30.5], [2008, 31.8], [2012, 33.2], [2016, 35.4]]}
        xLabel="Năm"
        yLabel="tỉ thùng"
        yMax={40}
        xTicks={[1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016]}
      />
    ),
  },
];

export const FIGURES_HH: Record<number, FigureDef[]> = {
  18: B18, 19: B19, 20: B20, 21: B21, 22: B22, 23: B23, 24: B24, 25: B25, 26: B26,
  27: B27, 28: B28, 29: B29, 30: B30, 31: B31, 32: B32, 33: B33, 34: B34, 35: B35,
};
