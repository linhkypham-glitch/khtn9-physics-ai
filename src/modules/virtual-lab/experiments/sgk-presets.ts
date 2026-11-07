/** Các phép đo trong SGK (Bài 12): Hình 12.2 / Bảng 12.1 (nối tiếp, 12 V) và Hình 12.4 / Bảng 12.2 (song song, 6 V). */
export const SGK_PRESETS = {
  free: { label: "Tự chọn" },
  s12: { label: "SGK 12.1: R₁ nối tiếp R₂", mode: "series", R1: 6, R2: 10, U: 12, book: "A₁ = A₂ = 0,75 A" },
  s13: { label: "SGK 12.1: R₁ nối tiếp R₃", mode: "series", R1: 6, R2: 16, U: 12, book: "A₁ = A₂ = 0,54 A" },
  s23: { label: "SGK 12.1: R₂ nối tiếp R₃", mode: "series", R1: 10, R2: 16, U: 12, book: "A₁ = A₂ = 0,46 A" },
  par: { label: "SGK 12.2: R₁ song song R₂", mode: "parallel", R1: 10, R2: 6, U: 6, book: "I = 1,60 A; I₁ = 0,60 A; I₂ = 1,00 A" },
} as const;
export type PresetKey = keyof typeof SGK_PRESETS;
