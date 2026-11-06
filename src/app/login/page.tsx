import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FlaskConical, LineChart, Sparkles, TriangleAlert } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { safeRedirectPath } from "@/lib/auth/roles";
import { getCurrentUser } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Đăng nhập" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  const nextPath = typeof next === "string" ? next : "";
  const configured = isSupabaseConfigured();

  const user = configured ? await getCurrentUser() : null;
  if (user) redirect(safeRedirectPath(nextPath, user.role));

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div className="relative z-10 flex items-center gap-2.5 font-semibold">
          <span className="text-lg tracking-tight">PHYSICS AI</span>
          <span className="text-sm font-medium text-blue-100">· KHTN 9 – Vật lý</span>
        </div>
        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-bold leading-tight">Học Vật lý bằng thí nghiệm, luyện tập và dữ liệu.</h2>
          <ul className="mt-8 space-y-4 text-blue-50">
            <li className="flex gap-3">
              <FlaskConical className="size-5 shrink-0" /> Thí nghiệm mô phỏng tương tác theo từng bài học
            </li>
            <li className="flex gap-3">
              <Sparkles className="size-5 shrink-0" /> Giải thích sau mỗi câu hỏi, ôn tập đúng phần còn yếu
            </li>
            <li className="flex gap-3">
              <LineChart className="size-5 shrink-0" /> Theo dõi tiến bộ và phân tích quá trình học tập
            </li>
          </ul>
        </div>
        <p className="relative z-10 text-sm text-blue-100">KHTN 9 – Kết nối tri thức với cuộc sống</p>
        <div aria-hidden className="absolute -right-24 -bottom-24 size-96 rounded-full border-[40px] border-white/10" />
        <div aria-hidden className="absolute top-20 -right-10 size-40 rounded-full bg-white/5" />
      </div>

      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Logo className="mb-8 lg:hidden" />
          <Card className="gap-6 py-7">
            <CardHeader className="px-6">
              <CardTitle className="text-xl">Đăng nhập</CardTitle>
              <CardDescription>Dùng tài khoản do nhà trường hoặc giáo viên cấp.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 px-6">
              {!configured && (
                <Alert variant="warning">
                  <TriangleAlert />
                  <AlertTitle>Chưa cấu hình Supabase</AlertTitle>
                  <AlertDescription>
                    <p>
                      Chức năng đăng nhập chưa hoạt động.{" "}
                      <Link href="/setup" className="font-medium underline">Xem hướng dẫn cấu hình</Link>.
                    </p>
                  </AlertDescription>
                </Alert>
              )}
              <LoginForm next={nextPath} disabled={!configured} />
            </CardContent>
          </Card>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">← Về trang chủ</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
