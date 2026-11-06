import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ error: "Vui lòng nhập email." })
    .trim()
    .min(1, "Vui lòng nhập email.")
    .max(254, "Email quá dài.")
    .pipe(z.email("Email không hợp lệ.")),
  password: z
    .string({ error: "Vui lòng nhập mật khẩu." })
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự.")
    .max(128, "Mật khẩu quá dài."),
});

export type LoginInput = z.infer<typeof loginSchema>;
