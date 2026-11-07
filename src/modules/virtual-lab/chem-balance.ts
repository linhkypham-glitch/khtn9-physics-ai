/**
 * Kiểm tra cân bằng phương trình hoá học (dùng cho kiểm thử nội dung, không chạy ở giao diện).
 * Hỗ trợ: chỉ số dưới Unicode (₂), ngoặc tròn (nhóm nguyên tử), dấu chấm giữa (CaCO₃·MgCO₃),
 * kí hiệu liên kết (= và –) trong công thức cấu tạo thu gọn, hệ số nguyên hoặc phân số ("13/2 O₂"), mũi tên → hoặc ⇌ có điều kiện trong ngoặc ("→(t°)").
 * Không hỗ trợ polymer (chỉ số n) – phương trình loại này bị bỏ qua (trả về null).
 */

const SUB: Record<string, string> = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9" };

function normalize(s: string) {
  return s.replace(/[₀-₉]/g, (c) => SUB[c]);
}

type Counts = Map<string, number>;

function add(into: Counts, from: Counts, k: number) {
  for (const [el, n] of from) into.set(el, (into.get(el) ?? 0) + n * k);
}

function parseFormula(f: string): Counts {
  let i = 0;
  function group(): Counts {
    const total: Counts = new Map();
    while (i < f.length && f[i] !== ")") {
      if (f[i] === "(") {
        i++;
        const inner = group();
        i++; // ")"
        let num = "";
        while (/\d/.test(f[i] ?? "")) num += f[i++];
        add(total, inner, num ? Number(num) : 1);
      } else if (f[i] === "=" || f[i] === "–" || f[i] === "-") {
        i++; // kí hiệu liên kết trong công thức cấu tạo thu gọn (CH₂=CH₂, CH₃–CH₃)
      } else if (/[A-Z]/.test(f[i])) {
        let el = f[i++];
        while (/[a-z]/.test(f[i] ?? "")) el += f[i++];
        let num = "";
        while (/\d/.test(f[i] ?? "")) num += f[i++];
        total.set(el, (total.get(el) ?? 0) + (num ? Number(num) : 1));
      } else {
        throw new Error(`Kí tự không hợp lệ "${f[i]}" trong công thức "${f}"`);
      }
    }
    return total;
  }
  return group();
}

/** Công thức có thể có phần "·" (muối ngậm nước / phức hợp): cộng các phần lại. */
function parseSpecies(raw: string): { coef: number; counts: Counts } {
  const m = raw.trim().match(/^(\d+(?:\/\d+)?)?\s*(.+)$/);
  if (!m) throw new Error(`Không đọc được chất "${raw}"`);
  const coef = m[1] ? (m[1].includes("/") ? Number(m[1].split("/")[0]) / Number(m[1].split("/")[1]) : Number(m[1])) : 1;
  const counts: Counts = new Map();
  for (const part of m[2].split("·")) {
    const pm = part.match(/^(\d+)?(.+)$/);
    add(counts, parseFormula(pm![2]), pm![1] ? Number(pm![1]) : 1);
  }
  return { coef, counts };
}

function side(text: string): Counts {
  const total: Counts = new Map();
  for (const sp of text.split(/\s\+\s/)) {
    const { coef, counts } = parseSpecies(sp);
    add(total, counts, coef);
  }
  return total;
}

export type BalanceResult = { balanced: boolean; left: Record<string, number>; right: Record<string, number> };

/** Trả về null nếu phương trình thuộc loại bỏ qua (polymer); ném lỗi nếu không đọc được. */
export function checkEquation(equation: string): BalanceResult | null {
  const e = normalize(equation).replace(/\s+/g, " ").trim();
  if (/[ₙₘ]|[-–]\)n|\bn[A-Z]/.test(equation) || /\)n\b/.test(e)) return null;
  const parts = e.split(/\s*(?:→|⇌)(?:\((?:[^()]|\([^)]*\))*\))?\s*/);
  if (parts.length !== 2) throw new Error(`Phương trình phải có đúng một mũi tên: "${equation}"`);
  // bỏ phần chú thích trong ngoặc cuối chất như "(glucose)", "(fructose)"
  const strip = (s: string) => s.replace(/\s\((?:[a-z][^()]*)\)/g, "");
  const left = side(strip(parts[0]));
  const right = side(strip(parts[1]));
  const keys = new Set([...left.keys(), ...right.keys()]);
  let balanced = true;
  for (const k of keys) if (Math.abs((left.get(k) ?? 0) - (right.get(k) ?? 0)) > 1e-9) balanced = false;
  return { balanced, left: Object.fromEntries(left), right: Object.fromEntries(right) };
}
