/**
 * Kiểu dữ liệu tiện dụng dựa trên file sinh tự động `supabase.ts`.
 * Sinh lại sau mỗi migration: npm run db:types
 */
import type { Database } from "./supabase";

export type { Database };

type PublicSchema = Database["public"];
export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"];
export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T];

export type UserRole = Enums<"user_role">;
export type ClassMemberRole = Enums<"class_member_role">;
export type LessonType = Enums<"lesson_type">;
export type LessonSection = Enums<"lesson_section">;
export type MaterialKind = Enums<"material_kind">;

export type Profile = Tables<"profiles">;
export type ChapterRow = Tables<"chapters">;
export type LessonRow = Tables<"lessons">;
export type ClassRow = Tables<"classes">;
export type LearningObjectiveRow = Tables<"learning_objectives">;
export type LessonMaterialRow = Tables<"lesson_materials">;
