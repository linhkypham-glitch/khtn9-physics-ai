import { z } from "zod";

import { USERNAME_PATTERN } from "@/lib/auth/student-account";

export const loginSchema = z.object({
  identifier: z
    .string({ error: "Vui lòng nhập email hoặc tên đăng nhập." })
    .trim()
    .min(1, "Vui lòng nhập email hoặc tên đăng nhập.")
    .max(254, "Quá dài.")
    .refine(
      (v) => (v.includes("@") ? z.email().safeParse(v).success : USERNAME_PATTERN.test(v.toLowerCase())),
      "Email hoặc tên đăng nhập không hợp lệ.",
    ),
  password: z
    .string({ error: "Vui lòng nhập mật khẩu." })
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự.")
    .max(128, "Mật khẩu quá dài."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const fullNameSchema = z
  .string({ error: "Vui lòng nhập họ và tên." })
  .trim()
  .min(2, "Họ và tên quá ngắn.")
  .max(80, "Họ và tên quá dài.")
  .regex(/^[\p{L}\s.'-]+$/u, "Họ và tên chỉ gồm chữ cái và khoảng trắng.");

export const enterClassSchema = z.object({
  fullName: fullNameSchema,
  className: z
    .string({ error: "Vui lòng nhập lớp." })
    .trim()
    .min(1, "Vui lòng nhập lớp.")
    .max(20, "Tên lớp tối đa 20 ký tự.")
    .regex(/^[\p{L}0-9 ._-]+$/u, "Tên lớp chỉ gồm chữ, số (ví dụ 9A)."),
});

export const classNameSchema = z
  .string({ error: "Vui lòng nhập tên lớp." })
  .trim()
  .min(1, "Vui lòng nhập tên lớp.")
  .max(20, "Tên lớp tối đa 20 ký tự.")
  .regex(/^[\p{L}0-9 ._-]+$/u, "Tên lớp chỉ gồm chữ, số, dấu chấm, gạch ngang.");
