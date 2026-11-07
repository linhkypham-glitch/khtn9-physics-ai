/**
 * Dữ liệu thí nghiệm ảo Hoá học 9 (Bài 18 – 31).
 * Mỗi kết quả (hiện tượng, phương trình) bám theo nội dung SGK KHTN 9 – Kết nối tri thức;
 * những chi tiết quan sát phổ biến mà SGK không nêu (màu dung dịch, lớp kim loại bám…) chỉ dùng để minh hoạ.
 * Phương trình được kiểm tra cân bằng tự động (tests/unit/chem-lab.test.ts).
 */

export type Visual = {
  /** Màu dung dịch trước (hex) */
  liquid: string;
  /** Màu dung dịch sau phản ứng */
  liquidAfter?: string;
  /** Vật rắn nhúng trong ống: màu trước / sau, nhãn */
  solid?: { color: string; colorAfter?: string; label: string };
  /** Lớp kim loại bám lên vật rắn (màu) */
  coating?: string;
  bubbles?: boolean;
  flame?: "orange" | "blue" | "bright";
  /** Khói / hơi (màu) */
  smoke?: string;
  /** Kết tủa / chất rắn lắng (màu) */
  precipitate?: string;
  /** Lớp bạc bám thành ống */
  mirror?: boolean;
  /** Dung dịch vẩn đục (nước vôi trong) */
  turbid?: boolean;
  /** Thành bình mờ đi vì hơi nước */
  fog?: boolean;
};

export type Outcome = {
  reacts: boolean;
  observation: string;
  equation?: string;
  /** Giải thích bằng kiến thức bài (ví dụ vị trí trong dãy hoạt động) */
  why?: string;
  facts?: { label: string; value: string }[];
  visual: Visual;
};

export type Subject = { id: string; label: string; outcome: Outcome };
export type Reagent = { id: string; label: string; subjects: Subject[] };

export type ChemLabConfig = {
  reagentLabel: string;
  subjectLabel: string;
  reagents: Reagent[];
  startLabel: string;
  formula: string;
  /** Hiện thanh dãy hoạt động hoá học (Bài 19); id của subject là kí hiệu kim loại */
  series?: boolean;
};

export const ACTIVITY_SERIES = ["K", "Na", "Ca", "Mg", "Al", "Zn", "Fe", "Pb", "H", "Cu", "Ag", "Au"] as const;

const WATER = "#bfdbfe";
const CLEAR = "#e0f2fe";
const BLUE = "#60a5fa";
const PALEBLUE = "#bae6fd";
const COPPER = "#c2410c";
const SILVER = "#cbd5e1";
const IRON = "#6b7280";
const NO_REACTION = (liquid: string, solid: Visual["solid"]): Visual => ({ liquid, solid });

/* ------------------------------------------------------------------ Bài 18 */
export const METAL_REACTIONS: ChemLabConfig = {
  reagentLabel: "Chất tác dụng với kim loại",
  subjectLabel: "Kim loại",
  startLabel: "Tiến hành",
  formula: "Kim loại + phi kim → oxide / muối\nKim loại hoạt động mạnh + H₂O → hydroxide + H₂\nKim loại + dung dịch acid / muối",
  reagents: [
    {
      id: "o2",
      label: "Khí oxygen (đun nóng)",
      subjects: [
        { id: "Fe", label: "Sắt (Fe)", outcome: { reacts: true, observation: "Đốt nóng dây sắt rồi đưa vào bình khí oxygen: dây sắt cháy sáng, tạo khói màu nâu đỏ (Hình 18.2).", equation: "3Fe + 2O₂ →(t°) Fe₃O₄", visual: { liquid: "#f5f5f4", solid: { color: IRON, colorAfter: "#7c2d12", label: "dây sắt" }, flame: "bright", smoke: "#b45309" } } },
        { id: "Al", label: "Nhôm (Al)", outcome: { reacts: true, observation: "Rắc bột nhôm trên ngọn lửa đèn cồn: nhôm cháy sáng, tạo thành chất rắn màu trắng.", equation: "4Al + 3O₂ →(t°) 2Al₂O₃", visual: { liquid: "#f5f5f4", solid: { color: SILVER, colorAfter: "#f8fafc", label: "bột nhôm" }, flame: "bright", precipitate: "#f8fafc" } } },
        { id: "Zn", label: "Kẽm (Zn)", outcome: { reacts: true, observation: "Kẽm phản ứng với khí oxygen khi đun nóng, tạo oxide kẽm.", equation: "2Zn + O₂ →(t°) 2ZnO", visual: { liquid: "#f5f5f4", solid: { color: "#94a3b8", colorAfter: "#e2e8f0", label: "kẽm" }, flame: "orange" } } },
        { id: "Cu", label: "Đồng (Cu)", outcome: { reacts: true, observation: "Đồng phản ứng với khí oxygen khi đun nóng, tạo oxide đồng.", equation: "2Cu + O₂ →(t°) 2CuO", visual: { liquid: "#f5f5f4", solid: { color: COPPER, colorAfter: "#1c1917", label: "đồng" }, flame: "orange" } } },
        { id: "Au", label: "Vàng (Au)", outcome: { reacts: false, observation: "Một số kim loại như vàng không phản ứng với khí oxygen – vì vậy đồ trang sức bằng vàng để lâu vẫn sáng đẹp.", visual: NO_REACTION("#f5f5f4", { color: "#eab308", label: "vàng" }) } },
      ],
    },
    {
      id: "cl2",
      label: "Khí chlorine (màu vàng lục)",
      subjects: [
        { id: "Na", label: "Natri (Na)", outcome: { reacts: true, observation: "Natri nóng chảy cháy trong bình khí chlorine, tạo thành tinh thể muối ăn màu trắng (Hình 18.3).", equation: "2Na + Cl₂ →(t°) 2NaCl", visual: { liquid: "#ecfccb", solid: { color: "#e2e8f0", label: "natri" }, flame: "bright", precipitate: "#f8fafc" } } },
        { id: "Fe", label: "Sắt (Fe)", outcome: { reacts: true, observation: "Dây sắt nung đỏ cháy trong khí chlorine, tạo thành muối iron(III) chloride màu nâu đỏ (Hình 18.4).", equation: "2Fe + 3Cl₂ →(t°) 2FeCl₃", visual: { liquid: "#ecfccb", solid: { color: IRON, colorAfter: "#9a3412", label: "dây sắt" }, flame: "orange", smoke: "#9a3412" } } },
        { id: "Cu", label: "Đồng (Cu)", outcome: { reacts: true, observation: "Kim loại có thể tác dụng với khí chlorine tạo thành muối chloride (ví dụ copper(II) chloride).", equation: "Cu + Cl₂ →(t°) CuCl₂", visual: { liquid: "#ecfccb", solid: { color: COPPER, colorAfter: "#65a30d", label: "đồng" }, flame: "orange" } } },
      ],
    },
    {
      id: "s",
      label: "Lưu huỳnh (đun nóng)",
      subjects: [
        { id: "Al", label: "Nhôm (Al)", outcome: { reacts: true, observation: "Kim loại tác dụng với lưu huỳnh (sulfur) tạo thành muối sulfide.", equation: "2Al + 3S →(t°) Al₂S₃", visual: { liquid: "#fef9c3", solid: { color: SILVER, colorAfter: "#a8a29e", label: "nhôm" }, flame: "orange" } } },
        { id: "Mg", label: "Magnesium (Mg)", outcome: { reacts: true, observation: "Magnesium tác dụng với lưu huỳnh tạo thành magnesium sulfide.", equation: "Mg + S →(t°) MgS", visual: { liquid: "#fef9c3", solid: { color: SILVER, colorAfter: "#a8a29e", label: "magnesium" }, flame: "bright" } } },
        { id: "Zn", label: "Kẽm (Zn)", outcome: { reacts: true, observation: "Kẽm tác dụng với lưu huỳnh tạo thành zinc sulfide.", equation: "Zn + S →(t°) ZnS", visual: { liquid: "#fef9c3", solid: { color: "#94a3b8", colorAfter: "#e5e5e5", label: "kẽm" }, flame: "orange" } } },
      ],
    },
    {
      id: "water",
      label: "Nước",
      subjects: [
        { id: "Na", label: "Natri (Na) – điều kiện thường", outcome: { reacts: true, observation: "Natri tác dụng với nước ở nhiệt độ thường, phản ứng toả nhiều nhiệt, giải phóng khí hydrogen (Hình 18.5). Natri là kim loại hoạt động hoá học mạnh.", equation: "2Na + 2H₂O → 2NaOH + H₂", visual: { liquid: WATER, solid: { color: "#e2e8f0", label: "natri" }, bubbles: true, flame: "orange" } } },
        { id: "Zn", label: "Kẽm (Zn) – hơi nước, nhiệt độ cao", outcome: { reacts: true, observation: "Những kim loại như Zn, Fe,... tác dụng với hơi nước ở nhiệt độ cao tạo thành oxide và khí hydrogen.", equation: "Zn + H₂O →(t°) ZnO + H₂", visual: { liquid: "#f5f5f4", solid: { color: "#94a3b8", colorAfter: "#e2e8f0", label: "kẽm" }, bubbles: true } } },
        { id: "Fe", label: "Sắt (Fe) – hơi nước, nhiệt độ cao", outcome: { reacts: true, observation: "Ở nhiệt độ cao, hơi nước tác dụng với sắt tạo thành oxide sắt từ và khí hydrogen.", equation: "3Fe + 4H₂O →(t°) Fe₃O₄ + 4H₂", visual: { liquid: "#f5f5f4", solid: { color: IRON, colorAfter: "#1f2937", label: "sắt" }, bubbles: true } } },
        { id: "Cu", label: "Đồng (Cu)", outcome: { reacts: false, observation: "Các kim loại Cu, Ag, Au,... không tác dụng với nước: đó là các kim loại hoạt động hoá học yếu.", visual: NO_REACTION(WATER, { color: COPPER, label: "đồng" }) } },
      ],
    },
    {
      id: "hcl",
      label: "Dung dịch hydrochloric acid (HCl)",
      subjects: [
        { id: "Fe", label: "Sắt (Fe)", outcome: { reacts: true, observation: "Sắt tác dụng với dung dịch HCl tạo muối iron(II) chloride và giải phóng khí hydrogen (bọt khí).", equation: "Fe + 2HCl → FeCl₂ + H₂", visual: { liquid: CLEAR, liquidAfter: "#ecfccb", solid: { color: IRON, label: "đinh sắt" }, bubbles: true } } },
        { id: "Al", label: "Nhôm (Al)", outcome: { reacts: true, observation: "Nhôm tác dụng với dung dịch HCl tạo aluminium chloride và giải phóng khí hydrogen.", equation: "2Al + 6HCl → 2AlCl₃ + 3H₂", visual: { liquid: CLEAR, solid: { color: SILVER, label: "nhôm" }, bubbles: true } } },
        { id: "Mg", label: "Magnesium (Mg)", outcome: { reacts: true, observation: "Magnesium tác dụng với dung dịch HCl tạo magnesium chloride và giải phóng khí hydrogen.", equation: "Mg + 2HCl → MgCl₂ + H₂", visual: { liquid: CLEAR, solid: { color: SILVER, label: "magnesium" }, bubbles: true } } },
        { id: "Cu", label: "Đồng (Cu)", outcome: { reacts: false, observation: "Các kim loại Cu, Ag, Au,... không tác dụng với dung dịch HCl.", visual: NO_REACTION(CLEAR, { color: COPPER, label: "đồng" }) } },
      ],
    },
    {
      id: "cuso4",
      label: "Dung dịch copper(II) sulfate (CuSO₄)",
      subjects: [
        { id: "Fe", label: "Sắt (Fe)", outcome: { reacts: true, observation: "Đinh sắt đẩy đồng ra khỏi muối: trên đinh sắt có lớp kim loại màu đỏ (đồng) bám vào, màu xanh của dung dịch nhạt dần. Sắt hoạt động hoá học mạnh hơn đồng.", equation: "Fe + CuSO₄ → FeSO₄ + Cu", visual: { liquid: BLUE, liquidAfter: "#d9f99d", solid: { color: IRON, label: "đinh sắt" }, coating: COPPER } } },
        { id: "Zn", label: "Kẽm (Zn)", outcome: { reacts: true, observation: "Kẽm đẩy đồng ra khỏi dung dịch muối tạo muối mới và kim loại mới.", equation: "Zn + CuSO₄ → ZnSO₄ + Cu", visual: { liquid: BLUE, liquidAfter: "#e0f2fe", solid: { color: "#94a3b8", label: "kẽm" }, coating: COPPER } } },
        { id: "Mg", label: "Magnesium (Mg)", outcome: { reacts: true, observation: "Magnesium đẩy đồng ra khỏi dung dịch muối tạo muối mới và kim loại mới.", equation: "Mg + CuSO₄ → MgSO₄ + Cu", visual: { liquid: BLUE, liquidAfter: "#e0f2fe", solid: { color: SILVER, label: "magnesium" }, coating: COPPER } } },
        { id: "Ag", label: "Bạc (Ag)", outcome: { reacts: false, observation: "Bạc hoạt động hoá học yếu hơn đồng nên không đẩy được đồng ra khỏi dung dịch muối.", visual: NO_REACTION(BLUE, { color: SILVER, label: "bạc" }) } },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ Bài 19 */
export const ACTIVITY_SERIES_LAB: ChemLabConfig = {
  reagentLabel: "Thí nghiệm",
  subjectLabel: "Kim loại",
  startLabel: "Tiến hành",
  series: true,
  formula: "K, Na, Ca, Mg, Al, Zn, Fe, Pb, H, Cu, Ag, Au\nTừ trái sang phải: mức độ hoạt động hoá học giảm dần",
  reagents: [
    {
      id: "water",
      label: "TN 1: với nước ở điều kiện thường",
      subjects: [
        { id: "Na", label: "Natri (Na)", outcome: { reacts: true, observation: "Natri phản ứng với nước ở điều kiện thường (Hình 18.5), giải phóng khí hydrogen.", equation: "2Na + 2H₂O → 2NaOH + H₂", why: "Na thuộc nhóm kim loại hoạt động hoá học mạnh (K, Na, Ca,…) nên tác dụng được với nước ở điều kiện thường.", visual: { liquid: WATER, solid: { color: "#e2e8f0", label: "natri" }, bubbles: true, flame: "orange" } } },
        { id: "Ca", label: "Calcium (Ca)", outcome: { reacts: true, observation: "Calcium tác dụng với nước ở điều kiện thường tạo calcium hydroxide và khí hydrogen.", equation: "Ca + 2H₂O → Ca(OH)₂ + H₂", why: "Ca đứng đầu dãy hoạt động (nhóm K, Na, Ca,…) nên tác dụng được với nước ở điều kiện thường.", visual: { liquid: WATER, solid: { color: "#e5e5e5", label: "calcium" }, bubbles: true } } },
        { id: "Fe", label: "Sắt (Fe)", outcome: { reacts: false, observation: "Đinh sắt không phản ứng với nước ở điều kiện thường.", why: "Fe là kim loại hoạt động hoá học trung bình, không thuộc nhóm K, Na, Ca nên không tác dụng với nước ở điều kiện thường.", visual: NO_REACTION(WATER, { color: IRON, label: "đinh sắt" }) } },
        { id: "Cu", label: "Đồng (Cu)", outcome: { reacts: false, observation: "Dây đồng không phản ứng với nước ở điều kiện thường.", why: "Cu là kim loại hoạt động hoá học yếu.", visual: NO_REACTION(WATER, { color: COPPER, label: "dây đồng" }) } },
      ],
    },
    {
      id: "hcl",
      label: "TN 2: với dung dịch HCl",
      subjects: [
        { id: "Fe", label: "Sắt (Fe)", outcome: { reacts: true, observation: "Sắt phản ứng với dung dịch HCl, giải phóng khí hydrogen (Hình 19.1).", equation: "Fe + 2HCl → FeCl₂ + H₂", why: "Fe đứng trước H trong dãy hoạt động nên đẩy được hydrogen ra khỏi dung dịch acid.", visual: { liquid: CLEAR, solid: { color: IRON, label: "đinh sắt" }, bubbles: true } } },
        { id: "Zn", label: "Kẽm (Zn)", outcome: { reacts: true, observation: "Kẽm phản ứng với dung dịch HCl, giải phóng khí hydrogen.", equation: "Zn + 2HCl → ZnCl₂ + H₂", why: "Zn đứng trước H trong dãy hoạt động.", visual: { liquid: CLEAR, solid: { color: "#94a3b8", label: "kẽm" }, bubbles: true } } },
        { id: "Cu", label: "Đồng (Cu)", outcome: { reacts: false, observation: "Dây đồng không phản ứng với dung dịch HCl (Hình 19.1).", why: "Cu đứng sau H trong dãy hoạt động nên không đẩy được hydrogen ra khỏi dung dịch acid.", visual: NO_REACTION(CLEAR, { color: COPPER, label: "dây đồng" }) } },
        { id: "Ag", label: "Bạc (Ag)", outcome: { reacts: false, observation: "Bạc không phản ứng với dung dịch HCl.", why: "Ag đứng sau H trong dãy hoạt động.", visual: NO_REACTION(CLEAR, { color: SILVER, label: "bạc" }) } },
      ],
    },
    {
      id: "h2so4",
      label: "Bài tập: với dung dịch H₂SO₄ loãng",
      subjects: [
        { id: "Mg", label: "Magnesium (Mg)", outcome: { reacts: true, observation: "Mg phản ứng với dung dịch H₂SO₄ loãng, giải phóng khí hydrogen.", equation: "Mg + H₂SO₄ → MgSO₄ + H₂", why: "Mg đứng trước H trong dãy hoạt động.", visual: { liquid: CLEAR, solid: { color: SILVER, label: "magnesium" }, bubbles: true } } },
        { id: "Zn", label: "Kẽm (Zn)", outcome: { reacts: true, observation: "Zn phản ứng với dung dịch H₂SO₄ loãng, giải phóng khí hydrogen.", equation: "Zn + H₂SO₄ → ZnSO₄ + H₂", why: "Zn đứng trước H trong dãy hoạt động.", visual: { liquid: CLEAR, solid: { color: "#94a3b8", label: "kẽm" }, bubbles: true } } },
        { id: "Ag", label: "Bạc (Ag)", outcome: { reacts: false, observation: "Ag không phản ứng với dung dịch H₂SO₄ loãng.", why: "Ag đứng sau H trong dãy hoạt động.", visual: NO_REACTION(CLEAR, { color: SILVER, label: "bạc" }) } },
      ],
    },
    {
      id: "agno3",
      label: "TN 3: với dung dịch AgNO₃",
      subjects: [
        { id: "Cu", label: "Đồng (Cu)", outcome: { reacts: true, observation: "Dây đồng nhúng trong dung dịch AgNO₃ có lớp kim loại màu trắng bạc bám vào, dung dịch chuyển dần sang màu xanh (Hình 19.2).", equation: "Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag", why: "Cu đứng trước Ag nên đẩy được Ag ra khỏi dung dịch muối; đồng hoạt động hoá học mạnh hơn bạc.", visual: { liquid: CLEAR, liquidAfter: PALEBLUE, solid: { color: COPPER, label: "dây đồng" }, coating: SILVER } } },
        { id: "Zn", label: "Kẽm (Zn)", outcome: { reacts: true, observation: "Kẽm đẩy bạc ra khỏi dung dịch AgNO₃.", equation: "Zn + 2AgNO₃ → Zn(NO₃)₂ + 2Ag", why: "Zn đứng trước Ag trong dãy hoạt động.", visual: { liquid: CLEAR, solid: { color: "#94a3b8", label: "kẽm" }, coating: SILVER } } },
        { id: "Au", label: "Vàng (Au)", outcome: { reacts: false, observation: "Vàng không đẩy được bạc ra khỏi dung dịch muối.", why: "Au đứng sau Ag trong dãy hoạt động.", visual: NO_REACTION(CLEAR, { color: "#eab308", label: "vàng" }) } },
      ],
    },
    {
      id: "cuso4",
      label: "Với dung dịch CuSO₄",
      subjects: [
        { id: "Fe", label: "Sắt (Fe)", outcome: { reacts: true, observation: "Sắt đẩy đồng ra khỏi dung dịch CuSO₄: có lớp đồng màu đỏ bám trên đinh sắt.", equation: "Fe + CuSO₄ → FeSO₄ + Cu", why: "Fe đứng trước Cu trong dãy hoạt động.", visual: { liquid: BLUE, liquidAfter: "#d9f99d", solid: { color: IRON, label: "đinh sắt" }, coating: COPPER } } },
        { id: "Ag", label: "Bạc (Ag)", outcome: { reacts: false, observation: "Bạc không đẩy được đồng ra khỏi dung dịch CuSO₄.", why: "Ag đứng sau Cu trong dãy hoạt động.", visual: NO_REACTION(BLUE, { color: SILVER, label: "bạc" }) } },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ Bài 20 */
export const METAL_EXTRACTION: ChemLabConfig = {
  reagentLabel: "Mức độ hoạt động hoá học",
  subjectLabel: "Kim loại cần tách",
  startLabel: "Xem quá trình tách",
  formula: "Quặng →(làm giàu quặng) Hợp chất chứa kim loại →(phương pháp hoá học) Kim loại",
  reagents: [
    {
      id: "strong",
      label: "Kim loại hoạt động mạnh (Na, Ca, Mg, Al,…)",
      subjects: [
        { id: "Al", label: "Nhôm (Al) từ quặng bauxite", outcome: { reacts: true, observation: "Điện phân nóng chảy aluminium oxide (nguyên liệu: quặng bauxite, thành phần chính là Al₂O₃). Cryolite dùng để hạ nhiệt độ nóng chảy của Al₂O₃, tiết kiệm năng lượng. Nhôm nóng chảy được thu ở đáy bể (Hình 20.1).", equation: "2Al₂O₃ →(điện phân nóng chảy, cryolite) 4Al + 3O₂", why: "Phương pháp điện phân nóng chảy dùng để tách các kim loại hoạt động hoá học mạnh như Na, Ca, Mg, Al,…", visual: { liquid: "#fde68a", solid: { color: SILVER, label: "Al nóng chảy" }, bubbles: true } } },
        { id: "Na", label: "Natri (Na)", outcome: { reacts: true, observation: "Natri là kim loại hoạt động hoá học mạnh nên không thể tách bằng phương pháp nhiệt luyện; phải dùng phương pháp điện phân nóng chảy.", why: "Phương pháp điện phân nóng chảy dùng để tách các kim loại hoạt động hoá học mạnh như Na, Ca, Mg, Al,…", visual: { liquid: "#fde68a", solid: { color: "#e2e8f0", label: "Na" }, bubbles: true } } },
      ],
    },
    {
      id: "medium",
      label: "Kim loại hoạt động trung bình (Fe, Zn,…)",
      subjects: [
        { id: "Fe", label: "Sắt (Fe) từ iron(III) oxide", outcome: { reacts: true, observation: "Ở nhiệt độ cao, sắt được tách ra khỏi iron(III) oxide bởi carbon monoxide (trong lò luyện gang).", equation: "Fe₂O₃ + 3CO →(t°) 2Fe + 3CO₂", why: "Phương pháp nhiệt luyện dùng các chất như C, CO, H₂, Al,… tác dụng với oxide kim loại ở nhiệt độ cao để tách các kim loại hoạt động hoá học trung bình như Fe, Zn,…", visual: { liquid: "#fee2e2", solid: { color: "#9a3412", colorAfter: IRON, label: "Fe₂O₃" }, flame: "orange" } } },
        { id: "Zn1", label: "Kẽm (Zn) – bước 1: đốt quặng ZnS", outcome: { reacts: true, observation: "Quặng chứa zinc sulfide (ZnS) được đốt trong không khí để chuyển thành zinc oxide (ZnO).", equation: "2ZnS + 3O₂ →(t°) 2ZnO + 2SO₂", why: "Chuyển zinc sulfide thành zinc oxide trước khi nhiệt luyện.", visual: { liquid: "#fef9c3", solid: { color: "#a8a29e", colorAfter: "#f5f5f4", label: "ZnS" }, flame: "orange" } } },
        { id: "Zn2", label: "Kẽm (Zn) – bước 2: ZnO tác dụng với carbon", outcome: { reacts: true, observation: "Kẽm được tách ra khỏi zinc oxide bởi carbon ở nhiệt độ cao.", equation: "ZnO + C →(t°) Zn + CO", why: "Nhiệt luyện: carbon lấy oxygen của oxide kim loại.", visual: { liquid: "#fef9c3", solid: { color: "#f5f5f4", colorAfter: "#94a3b8", label: "ZnO" }, flame: "orange" } } },
      ],
    },
    {
      id: "weak",
      label: "Kim loại hoạt động yếu (Ag, Au,…)",
      subjects: [
        { id: "Ag", label: "Bạc (Ag), vàng (Au)", outcome: { reacts: true, observation: "Chuyển hợp chất của kim loại thành muối tan; sau đó dùng kim loại hoạt động hoá học mạnh hơn đẩy kim loại ra khỏi muối, tách chúng khỏi dung dịch.", why: "Phương pháp thuỷ luyện dùng để tách các kim loại hoạt động hoá học yếu như Ag, Au,…", visual: { liquid: CLEAR, solid: { color: COPPER, label: "kim loại mạnh hơn" }, coating: SILVER } } },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ Bài 21 */
export const CHARCOAL_ADSORPTION: ChemLabConfig = {
  reagentLabel: "Chất hấp phụ",
  subjectLabel: "Thí nghiệm",
  startLabel: "Rót nước màu qua phễu",
  formula: "Tính hấp phụ: than giữ trên bề mặt các phân tử chất khí, chất tan trong dung dịch",
  reagents: [
    {
      id: "charcoal",
      label: "Bột than gỗ",
      subjects: [
        { id: "colour", label: "Rót nước màu pha loãng qua phễu có bột than", outcome: { reacts: true, observation: "Dung dịch thu được trong cốc thuỷ tinh bị mất màu do than gỗ đã giữ lại các phân tử chất màu trên bề mặt (Hình 21.1). Tính chất này gọi là tính hấp phụ; carbon dạng than hoạt tính được dùng trong mặt nạ phòng độc, chất khử màu, khử mùi.", why: "Đây là hiện tượng hấp phụ (vật lí), không tạo chất mới.", visual: { liquid: "#fb7185", liquidAfter: "#f8fafc", solid: { color: "#1c1917", label: "bột than" } } } },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ Bài 23 */
const ALKANE_EQ: Record<string, string> = {
  methane: "CH₄ + 2O₂ →(t°) CO₂ + 2H₂O",
  ethane: "2C₂H₆ + 7O₂ →(t°) 4CO₂ + 6H₂O",
  propane: "C₃H₈ + 5O₂ →(t°) 3CO₂ + 4H₂O",
  butane: "2C₄H₁₀ + 13O₂ →(t°) 8CO₂ + 10H₂O",
};
const ALKANE_HEAT: Record<string, string> = { methane: "891 kJ", ethane: "1 561 kJ", propane: "2 220 kJ", butane: "2 878 kJ" };
const ALKANES = [
  { id: "methane", label: "Methane (CH₄)" },
  { id: "ethane", label: "Ethane (C₂H₆)" },
  { id: "propane", label: "Propane (C₃H₈)" },
  { id: "butane", label: "Butane (C₄H₁₀)" },
];
export const ALKANE_COMBUSTION: ChemLabConfig = {
  reagentLabel: "Alkane đem đốt",
  subjectLabel: "Quan sát / thử sản phẩm",
  startLabel: "Đốt alkane",
  formula: "CₙH₂ₙ₊₂ + (3n + 1)/2 O₂ →(t°) nCO₂ + (n + 1)H₂O\nPhản ứng cháy toả nhiệt mạnh",
  reagents: ALKANES.map((a) => ({
    id: a.id,
    label: a.label,
    subjects: [
      { id: "fog", label: "Úp bình tam giác khô lên ngọn lửa", outcome: { reacts: true, observation: "Thành bình tam giác mờ đi: có hơi nước tạo thành. Alkane cháy toả nhiệt mạnh.", equation: ALKANE_EQ[a.id], facts: [{ label: "Nhiệt lượng toả ra khi đốt 1 mol", value: ALKANE_HEAT[a.id] }], visual: { liquid: "#f8fafc", flame: "blue", fog: true } } },
      { id: "limewater", label: "Rót nước vôi trong vào bình, lắc đều", outcome: { reacts: true, observation: "Nước vôi trong vẩn đục: có khí carbon dioxide tạo thành. Sản phẩm chủ yếu của phản ứng cháy alkane là CO₂ và H₂O.", equation: ALKANE_EQ[a.id], facts: [{ label: "Nhiệt lượng toả ra khi đốt 1 mol", value: ALKANE_HEAT[a.id] }], visual: { liquid: "#e0f2fe", turbid: true, flame: "blue" } } },
      { id: "incomplete", label: "Thiếu oxygen (cháy không hoàn toàn)", outcome: { reacts: true, observation: "Bên cạnh CO₂ và H₂O, một phần alkane cháy không hoàn toàn tạo một lượng nhỏ muội than (đơn chất carbon) và carbon monoxide.", why: "Cháy không hoàn toàn khi thiếu oxygen.", visual: { liquid: "#f8fafc", flame: "orange", smoke: "#292524" } } },
    ],
  })),
};

/* ------------------------------------------------------------------ Bài 24 */
export const ETHYLENE_LAB: ChemLabConfig = {
  reagentLabel: "Chất",
  subjectLabel: "Thử tính chất",
  startLabel: "Tiến hành",
  formula: "Ethylene CH₂=CH₂: có liên kết đôi C=C → phản ứng cộng, trùng hợp, cháy",
  reagents: [
    {
      id: "ethylene",
      label: "Ethylene (C₂H₄)",
      subjects: [
        { id: "burn", label: "Đốt ở đầu ống dẫn", outcome: { reacts: true, observation: "Ethylene cháy được, toả nhiều nhiệt; sản phẩm chủ yếu là khí carbon dioxide và hơi nước.", equation: "C₂H₄ + 3O₂ →(t°) 2CO₂ + 2H₂O", visual: { liquid: "#f8fafc", flame: "orange" } } },
        { id: "bromine", label: "Dẫn vào ống nghiệm đựng nước bromine", outcome: { reacts: true, observation: "Nước bromine mất màu: phân tử bromine cộng hợp vào nối đôi C=C tạo 1,2-dibromoethane (phản ứng cộng).", equation: "CH₂=CH₂ + Br–Br → CH₂Br–CH₂Br", why: "Liên kết kém bền trong liên kết đôi bị phá vỡ.", visual: { liquid: "#fbbf24", liquidAfter: "#f8fafc", bubbles: true } } },
        { id: "polymer", label: "Trùng hợp (t°, p, xúc tác)", outcome: { reacts: true, observation: "Các phân tử ethylene cộng hợp liên tiếp với nhau tạo polyethylene (PE): chất rắn, không tan trong nước, không độc, rất khó phân huỷ sinh học.", equation: "nCH₂=CH₂ →(t°, p, xúc tác) (–CH₂–CH₂–)ₙ", visual: { liquid: "#e0f2fe", precipitate: "#f8fafc" } } },
      ],
    },
    {
      id: "propylene",
      label: "Propylene (C₃H₆) – bài tập SGK",
      subjects: [
        { id: "burn", label: "Đốt cháy", outcome: { reacts: true, observation: "Propylene cũng là alkene (có liên kết đôi C=C) nên cháy tạo carbon dioxide và hơi nước.", equation: "2C₃H₆ + 9O₂ →(t°) 6CO₂ + 6H₂O", visual: { liquid: "#f8fafc", flame: "orange" } } },
        { id: "bromine", label: "Dẫn vào nước bromine", outcome: { reacts: true, observation: "Propylene làm mất màu nước bromine (phản ứng cộng) tương tự ethylene.", equation: "CH₃–CH=CH₂ + Br₂ → CH₃–CHBr–CH₂Br", visual: { liquid: "#fbbf24", liquidAfter: "#f8fafc" } } },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ Bài 26 */
export const ETHANOL_LAB: ChemLabConfig = {
  reagentLabel: "Chất",
  subjectLabel: "Thí nghiệm",
  startLabel: "Tiến hành",
  formula: "Nhóm –OH gây nên tính chất đặc trưng của ethylic alcohol\nC₂H₅OH: cháy toả nhiệt; tác dụng với Na giải phóng H₂",
  reagents: [
    {
      id: "ethanol",
      label: "Ethylic alcohol (C₂H₅OH)",
      subjects: [
        { id: "burn", label: "Đốt trong bát sứ (khoảng 1 mL)", outcome: { reacts: true, observation: "Ethylic alcohol cháy với ngọn lửa màu xanh nhạt, toả nhiều nhiệt, tạo carbon dioxide và hơi nước.", equation: "C₂H₅OH + 3O₂ →(t°) 2CO₂ + 3H₂O", why: "Dựa vào tính chất này, ethylic alcohol được dùng làm nhiên liệu (đèn cồn, xăng sinh học E5).", visual: { liquid: "#f1f5f9", flame: "blue" } } },
        { id: "sodium", label: "Cho mẩu natri vào ethylic alcohol tuyệt đối", outcome: { reacts: true, observation: "Mẩu natri tan dần, có bọt khí thoát ra (khí hydrogen) – nguyên tử hydrogen trong nhóm –OH bị natri thay thế (Hình 26.4).", equation: "2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂", visual: { liquid: "#f1f5f9", solid: { color: "#e2e8f0", label: "natri" }, bubbles: true } } },
        { id: "water", label: "Hoà vào nước", outcome: { reacts: false, observation: "Ethylic alcohol tan vô hạn trong nước (tính chất vật lí); không có phản ứng hoá học.", why: "Độ cồn là số mL ethylic alcohol nguyên chất có trong 100 mL dung dịch ở 20 °C.", visual: { liquid: WATER } } },
      ],
    },
    {
      id: "methanol",
      label: "Methyl alcohol (CH₃OH) – bài tập SGK",
      subjects: [
        { id: "sodium", label: "Cho mẩu natri vào chất lỏng", outcome: { reacts: true, observation: "Chất có nhóm –OH tác dụng được với natri tạo khí hydrogen.", equation: "2CH₃OH + 2Na → 2CH₃ONa + H₂", visual: { liquid: "#f1f5f9", solid: { color: "#e2e8f0", label: "natri" }, bubbles: true } } },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ Bài 27 */
export const ACETIC_ACID_LAB: ChemLabConfig = {
  reagentLabel: "Chất",
  subjectLabel: "Tác dụng với",
  startLabel: "Tiến hành",
  formula: "Acetic acid CH₃COOH là acid yếu, có đủ tính chất của một acid\nCH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O (ester hoá)",
  reagents: [
    {
      id: "acetic",
      label: "Dung dịch acetic acid",
      subjects: [
        { id: "litmus", label: "Giấy quỳ tím", outcome: { reacts: true, observation: "Giấy quỳ tím chuyển sang màu đỏ: acetic acid làm đổi màu chất chỉ thị acid.", visual: { liquid: "#fecaca", solid: { color: "#8b5cf6", colorAfter: "#ef4444", label: "giấy quỳ" } } } },
        { id: "mg", label: "Kim loại Mg", outcome: { reacts: true, observation: "Mg tan dần, có khí không màu thoát ra (hydrogen).", equation: "2CH₃COOH + Mg → (CH₃COO)₂Mg + H₂", visual: { liquid: CLEAR, solid: { color: SILVER, label: "Mg" }, bubbles: true } } },
        { id: "cuo", label: "Oxide kim loại CuO (đun nhẹ)", outcome: { reacts: true, observation: "Bột CuO màu đen tan dần, dung dịch chuyển sang màu xanh.", equation: "2CH₃COOH + CuO → (CH₃COO)₂Cu + H₂O", visual: { liquid: CLEAR, liquidAfter: "#67e8f9", solid: { color: "#1c1917", colorAfter: "#1c1917", label: "CuO" } } } },
        { id: "naoh", label: "Dung dịch NaOH (có phenolphthalein)", outcome: { reacts: true, observation: "Dung dịch NaOH có phenolphthalein màu hồng; nhỏ từ từ acetic acid vào thì màu hồng mất đi.", equation: "CH₃COOH + NaOH → CH₃COONa + H₂O", visual: { liquid: "#f9a8d4", liquidAfter: "#f8fafc" } } },
        { id: "caco3", label: "Đá vôi (CaCO₃)", outcome: { reacts: true, observation: "Đá vôi tan, có khí không màu thoát ra (carbon dioxide). Có thể dùng giấm ăn để loại bỏ lớp cặn CaCO₃ trong ấm đun nước.", equation: "2CH₃COOH + CaCO₃ → (CH₃COO)₂Ca + CO₂ + H₂O", visual: { liquid: CLEAR, solid: { color: "#f5f5f4", label: "đá vôi" }, bubbles: true } } },
        { id: "cu", label: "Kim loại Cu", outcome: { reacts: false, observation: "Đồng không tác dụng với dung dịch acetic acid.", why: "Cu đứng sau H trong dãy hoạt động nên không đẩy được hydrogen ra khỏi acid.", visual: NO_REACTION(CLEAR, { color: COPPER, label: "đồng" }) } },
        { id: "ester", label: "Ethylic alcohol + H₂SO₄ đặc, đun nóng (ester hoá)", outcome: { reacts: true, observation: "Sau khoảng 5 phút, đổ hỗn hợp sang dung dịch muối ăn bão hoà: xuất hiện lớp chất lỏng ở phía trên, không màu, có mùi thơm (ethyl acetate – một ester).", equation: "CH₃COOH + C₂H₅OH ⇌(H₂SO₄ đặc, t°) CH₃COOC₂H₅ + H₂O", visual: { liquid: "#e0f2fe", liquidAfter: "#f0f9ff", precipitate: "#fef9c3" } } },
        { id: "burn", label: "Đốt cháy", outcome: { reacts: true, observation: "Acetic acid cháy trong khí oxygen tạo khí carbon dioxide và hơi nước.", equation: "CH₃COOH + 2O₂ →(t°) 2CO₂ + 2H₂O", visual: { liquid: "#f8fafc", flame: "blue" } } },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ Bài 29 */
export const SUGAR_LAB: ChemLabConfig = {
  reagentLabel: "Chất",
  subjectLabel: "Phản ứng",
  startLabel: "Tiến hành",
  formula: "Glucose: tráng bạc, lên men rượu\nSaccharose: thuỷ phân tạo glucose và fructose (không tráng bạc)",
  reagents: [
    {
      id: "glucose",
      label: "Glucose (C₆H₁₂O₆)",
      subjects: [
        { id: "mirror", label: "Tráng bạc (AgNO₃/NH₃, nước nóng 70 – 80 °C)", outcome: { reacts: true, observation: "Sau khoảng 5 phút, trên thành ống nghiệm xuất hiện lớp bạc kim loại sáng bóng như gương (phản ứng tráng bạc).", equation: "C₆H₁₂O₆ + Ag₂O →(dung dịch NH₃, t°) C₆H₁₂O₇ + 2Ag", visual: { liquid: "#f1f5f9", mirror: true } } },
        { id: "ferment", label: "Lên men rượu (có enzyme)", outcome: { reacts: true, observation: "Dưới tác dụng của enzyme, glucose bị lên men tạo ethylic alcohol và carbon dioxide; phản ứng được dùng để sản xuất bia, rượu.", equation: "C₆H₁₂O₆ →(enzyme) 2C₂H₅OH + 2CO₂", visual: { liquid: "#fef3c7", bubbles: true } } },
      ],
    },
    {
      id: "saccharose",
      label: "Saccharose (C₁₂H₂₂O₁₁)",
      subjects: [
        { id: "mirror", label: "Tráng bạc (AgNO₃/NH₃, nước nóng)", outcome: { reacts: false, observation: "Saccharose không có phản ứng tráng bạc.", visual: { liquid: "#f1f5f9" } } },
        { id: "hydrolysis", label: "Thuỷ phân (acid hoặc enzyme, t°)", outcome: { reacts: true, observation: "Phản ứng đặc trưng của saccharose là thuỷ phân, sinh ra glucose và fructose (đường có cùng công thức phân tử với glucose nhưng khác công thức cấu tạo).", equation: "C₁₂H₂₂O₁₁ + H₂O →(enzyme hoặc acid, t°) C₆H₁₂O₆ + C₆H₁₂O₆", visual: { liquid: "#fef9c3" } } },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ Bài 30 */
export const STARCH_LAB: ChemLabConfig = {
  reagentLabel: "Chất",
  subjectLabel: "Thí nghiệm",
  startLabel: "Tiến hành",
  formula: "(C₆H₁₀O₅)ₙ + nH₂O →(enzyme hoặc acid, t°) nC₆H₁₂O₆\nHồ tinh bột + iodine → màu xanh tím",
  reagents: [
    {
      id: "starch",
      label: "Hồ tinh bột",
      subjects: [
        { id: "iodine", label: "Nhỏ dung dịch iodine", outcome: { reacts: true, observation: "Hồ tinh bột phản ứng với iodine tạo hợp chất có màu xanh tím.", visual: { liquid: "#f8fafc", liquidAfter: "#4c1d95" } } },
        { id: "hydrolysis", label: "Đun với HCl 2 M, để nguội rồi thử iodine", outcome: { reacts: true, observation: "Ống nghiệm (1) có HCl đã đun: sau khi nhỏ iodine không còn màu xanh tím vì tinh bột đã bị thuỷ phân thành glucose. Ống nghiệm (2) không có acid vẫn cho màu xanh tím.", equation: "(C₆H₁₀O₅)ₙ + nH₂O →(enzyme hoặc acid, t°) nC₆H₁₂O₆", why: "Thuỷ phân tinh bột tạo glucose nên tiêu hoá thức ăn giàu tinh bột cung cấp nhiều năng lượng cho cơ thể.", visual: { liquid: "#4c1d95", liquidAfter: "#fde68a", bubbles: false } } },
      ],
    },
    {
      id: "cellulose",
      label: "Cellulose",
      subjects: [
        { id: "iodine", label: "Nhỏ dung dịch iodine", outcome: { reacts: false, observation: "Khác với tinh bột, cellulose không tạo màu xanh tím với iodine.", visual: { liquid: "#f8fafc", solid: { color: "#f5f5f4", label: "cellulose" } } } },
        { id: "hydrolysis", label: "Thuỷ phân (acid hoặc enzyme)", outcome: { reacts: true, observation: "Cellulose cũng bị thuỷ phân tạo glucose trong môi trường acid hoặc nhờ enzyme riêng (cơ thể người không có enzyme thuỷ phân cellulose).", equation: "(C₆H₁₀O₅)ₘ + mH₂O →(enzyme hoặc acid, t°) mC₆H₁₂O₆", visual: { liquid: "#f8fafc", solid: { color: "#f5f5f4", label: "cellulose" } } } },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ Bài 31 */
export const PROTEIN_LAB: ChemLabConfig = {
  reagentLabel: "Mẫu thử",
  subjectLabel: "Tác nhân",
  startLabel: "Tiến hành",
  formula: "Protein + H₂O →(acid / base / enzyme) amino acid\nProtein bị đông tụ bởi acid, base, nhiệt độ; cháy có mùi khét",
  reagents: [
    {
      id: "egg",
      label: "Lòng trắng trứng (protein)",
      subjects: [
        { id: "hcl", label: "Thêm vài giọt HCl 1 M", outcome: { reacts: true, observation: "Dưới tác dụng của acid, protein bị đông tụ (lòng trắng trứng vón cục, trắng đục).", visual: { liquid: "#fef9c3", liquidAfter: "#f5f5f4", precipitate: "#f5f5f4" } } },
        { id: "heat", label: "Hơ nóng nhẹ trên ngọn lửa đèn cồn", outcome: { reacts: true, observation: "Dưới tác dụng của nhiệt độ, protein bị đông tụ.", visual: { liquid: "#fef9c3", liquidAfter: "#f5f5f4", precipitate: "#f5f5f4", flame: "orange" } } },
        { id: "burn", label: "Đun nóng mạnh đến khi có mùi khét", outcome: { reacts: true, observation: "Khi đun nóng ở nhiệt độ cao và không có nước, protein bị phân huỷ hoặc cháy, tạo ra các chất bay hơi và có mùi khét.", visual: { liquid: "#fef9c3", liquidAfter: "#78350f", flame: "orange", smoke: "#44403c" } } },
      ],
    },
    {
      id: "fibre",
      label: "Sợi vải (phân biệt tơ)",
      subjects: [
        { id: "silk", label: "Tơ tằm / len lông cừu – đốt thử", outcome: { reacts: true, observation: "Tơ tằm, len lông cừu chứa protein; khi cháy có mùi khét đặc trưng (giống mùi tóc cháy).", visual: { liquid: "#f8fafc", solid: { color: "#fde68a", colorAfter: "#44403c", label: "tơ tằm" }, flame: "orange", smoke: "#78716c" } } },
        { id: "nylon", label: "Tơ nylon – đốt thử", outcome: { reacts: true, observation: "Tơ nylon là tơ tổng hợp: khi đốt không có mùi khét đặc trưng của protein. Vì vậy có thể phân biệt tơ tự nhiên với tơ tổng hợp bằng cách đốt.", visual: { liquid: "#f8fafc", solid: { color: "#e2e8f0", colorAfter: "#a8a29e", label: "tơ nylon" }, flame: "orange" } } },
      ],
    },
  ],
};

export const CHEM_LABS: Record<string, ChemLabConfig> = {
  "metal-reactions": METAL_REACTIONS,
  "activity-series": ACTIVITY_SERIES_LAB,
  "metal-extraction": METAL_EXTRACTION,
  "charcoal-adsorption": CHARCOAL_ADSORPTION,
  "alkane-combustion": ALKANE_COMBUSTION,
  ethylene: ETHYLENE_LAB,
  ethanol: ETHANOL_LAB,
  "acetic-acid": ACETIC_ACID_LAB,
  "glucose-saccharose": SUGAR_LAB,
  "starch-cellulose": STARCH_LAB,
  protein: PROTEIN_LAB,
};
