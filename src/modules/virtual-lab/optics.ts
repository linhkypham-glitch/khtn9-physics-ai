/**
 * Hàm quang học dùng chung cho các mô phỏng (thuần toán học, có kiểm thử).
 * Góc tính bằng độ ở giao diện, radian bên trong.
 */
export const deg = (rad: number) => (rad * 180) / Math.PI;
export const rad = (d: number) => (d * Math.PI) / 180;

/** Định luật khúc xạ n₁·sin i = n₂·sin r. Trả về r (độ) hoặc null nếu phản xạ toàn phần. */
export function snell(iDeg: number, n1: number, n2: number): number | null {
  const s = (n1 * Math.sin(rad(iDeg))) / n2;
  if (s > 1 + 1e-12) return null;
  return deg(Math.asin(Math.min(1, s)));
}

/** Góc tới hạn (độ) khi ánh sáng đi từ n₁ sang n₂ (n₁ > n₂), null nếu không tồn tại. */
export function criticalAngle(n1: number, n2: number): number | null {
  if (n1 <= n2) return null;
  return deg(Math.asin(n2 / n1));
}

export type Vec = { x: number; y: number };
const dot = (a: Vec, b: Vec) => a.x * b.x + a.y * b.y;
const norm = (a: Vec): Vec => {
  const l = Math.hypot(a.x, a.y);
  return { x: a.x / l, y: a.y / l };
};

/**
 * Khúc xạ vector: d – hướng tia tới (đơn vị), nrm – pháp tuyến đơn vị hướng VỀ phía tia tới.
 * Trả về hướng tia khúc xạ, hoặc null nếu phản xạ toàn phần.
 */
export function refractVec(d: Vec, nrm: Vec, n1: number, n2: number): Vec | null {
  const dn = norm(d);
  const cosi = -dot(nrm, dn);
  const eta = n1 / n2;
  const k = 1 - eta * eta * (1 - cosi * cosi);
  if (k < 0) return null;
  return norm({ x: eta * dn.x + (eta * cosi - Math.sqrt(k)) * nrm.x, y: eta * dn.y + (eta * cosi - Math.sqrt(k)) * nrm.y });
}

export function reflectVec(d: Vec, nrm: Vec): Vec {
  const k = 2 * dot(d, nrm);
  return { x: d.x - k * nrm.x, y: d.y - k * nrm.y };
}

/** Giao của tia (p + t·d, t > 0) với đoạn thẳng AB. */
export function raySegment(p: Vec, d: Vec, a: Vec, b: Vec): { t: number; point: Vec } | null {
  const e = { x: b.x - a.x, y: b.y - a.y };
  const den = d.x * e.y - d.y * e.x;
  if (Math.abs(den) < 1e-12) return null;
  const t = ((a.x - p.x) * e.y - (a.y - p.y) * e.x) / den;
  const u = ((a.x - p.x) * d.y - (a.y - p.y) * d.x) / den;
  if (t <= 1e-9 || u < 0 || u > 1) return null;
  return { t, point: { x: p.x + t * d.x, y: p.y + t * d.y } };
}

/**
 * Lăng kính góc chiết quang A, chiết suất n, góc tới i₁ (độ).
 * Trả về r₁, r₂, i₂ và góc lệch D = i₁ + i₂ − A; null nếu tia không ló ra ở mặt thứ hai.
 */
export function prismDeviation(i1: number, A: number, n: number) {
  const r1 = deg(Math.asin(Math.sin(rad(i1)) / n));
  const r2 = A - r1;
  const s = n * Math.sin(rad(r2));
  if (r2 < 0 || s > 1) return { r1, r2, i2: null, D: null };
  const i2 = deg(Math.asin(s));
  return { r1, r2, i2, D: i1 + i2 - A };
}

/**
 * Thấu kính mỏng: 1/f = 1/d + 1/d' (f < 0 với thấu kính phân kì).
 * d' > 0: ảnh thật (khác phía vật); d' < 0: ảnh ảo; null: vật tại tiêu điểm (ảnh ở vô cực).
 * k = −d'/d: k < 0 ảnh ngược chiều.
 */
export function thinLens(d: number, f: number): { dPrime: number; k: number } | null {
  const inv = 1 / f - 1 / d;
  if (Math.abs(inv) < 1e-9) return null;
  const dPrime = 1 / inv;
  return { dPrime, k: -dPrime / d };
}

export function describeImage(img: { dPrime: number; k: number } | null): string {
  if (!img) return "Không cho ảnh (ảnh ở rất xa – vật đặt tại tiêu điểm)";
  const real = img.dPrime > 0 ? "Ảnh thật" : "Ảnh ảo";
  const dir = img.k < 0 ? "ngược chiều" : "cùng chiều";
  const a = Math.abs(img.k);
  const size = Math.abs(a - 1) < 0.02 ? "bằng vật" : a > 1 ? "lớn hơn vật" : "nhỏ hơn vật";
  return `${real}, ${dir}, ${size}`;
}

/** Chiết suất thuỷ tinh (tham khảo) theo màu – tăng dần từ đỏ đến tím. */
export const SPECTRUM = [
  { name: "Đỏ", color: "#ef4444", n: 1.513 },
  { name: "Da cam", color: "#f97316", n: 1.516 },
  { name: "Vàng", color: "#eab308", n: 1.519 },
  { name: "Lục", color: "#22c55e", n: 1.522 },
  { name: "Lam", color: "#0ea5e9", n: 1.527 },
  { name: "Chàm", color: "#4f46e5", n: 1.530 },
  { name: "Tím", color: "#a21caf", n: 1.533 },
] as const;

export const MEDIA = {
  air: { label: "Không khí", n: 1.0, fill: "#ffffff" },
  water: { label: "Nước", n: 1.33, fill: "#bae6fd" },
  glass: { label: "Thuỷ tinh", n: 1.5, fill: "#ccfbf1" },
  diamond: { label: "Kim cương", n: 2.42, fill: "#e9d5ff" },
} as const;
export type MediumKey = keyof typeof MEDIA;
