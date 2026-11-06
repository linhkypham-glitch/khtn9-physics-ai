/**
 * Màu nhận diện cho từng chương (dùng chuỗi class tĩnh để Tailwind sinh CSS).
 * I – cam (năng lượng cơ học) · II – tím (ánh sáng) · III – xanh dương (điện)
 * IV – xanh ngọc (điện từ) · V – xanh lá (năng lượng với cuộc sống)
 */
export type ChapterTheme = {
  gradient: string;
  soft: string;
  text: string;
  chip: string;
  ring: string;
  emoji: string;
};

const THEMES: ChapterTheme[] = [
  { gradient: "from-orange-500 to-amber-400", soft: "bg-orange-50", text: "text-orange-700", chip: "bg-orange-100 text-orange-700", ring: "ring-orange-200", emoji: "⚡" },
  { gradient: "from-violet-600 to-fuchsia-500", soft: "bg-violet-50", text: "text-violet-700", chip: "bg-violet-100 text-violet-700", ring: "ring-violet-200", emoji: "🌈" },
  { gradient: "from-blue-600 to-sky-500", soft: "bg-blue-50", text: "text-blue-700", chip: "bg-blue-100 text-blue-700", ring: "ring-blue-200", emoji: "🔌" },
  { gradient: "from-teal-600 to-emerald-500", soft: "bg-teal-50", text: "text-teal-700", chip: "bg-teal-100 text-teal-700", ring: "ring-teal-200", emoji: "🧲" },
  { gradient: "from-green-600 to-lime-500", soft: "bg-green-50", text: "text-green-700", chip: "bg-green-100 text-green-700", ring: "ring-green-200", emoji: "🌍" },
];

export function chapterTheme(chapterNumber: number): ChapterTheme {
  return THEMES[(Math.max(1, chapterNumber) - 1) % THEMES.length];
}
