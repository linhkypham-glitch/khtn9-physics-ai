import { FIGURES_HH } from "./chemistry";
import { FIGURES_VL } from "./physics";
import type { FigureDef } from "./primitives";

const ALL: Record<number, FigureDef[]> = { ...FIGURES_VL, ...FIGURES_HH };

/** Hình minh hoạ gốc của ứng dụng cho một bài học (theo số bài). */
export function figuresForLesson(lessonNumber: number): FigureDef[] {
  return ALL[lessonNumber] ?? [];
}
export const FIGURE_LESSON_NUMBERS = Object.keys(ALL).map(Number);
