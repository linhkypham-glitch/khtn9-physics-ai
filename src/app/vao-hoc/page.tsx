import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, FlaskConical, PencilLine, TriangleAlert } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { homePathForRole } from "@/lib/auth/roles";
import { getCurrentUser } from "@/lib/auth/session";
import { isStudentSessionAvailable } from "@/lib/auth/student-session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { EnterForm } from "./enter-form";

export const metadata: Metadata = { title: "Vào học" };

async function listClassNames(): Promise<string[]> {
  const admin = createSupabaseAdminClient();
  if (!admin) return [];
  const { data } = await admin
    .from("classes")
    .select("name, academic_years!inner(is_current)")
    .eq("is_active", true)
    .eq("academic_years.is_current", true)
    .order("name");
  return [...new Set((data ?? []).map((c) => c.name))];
}

export default async function EnterPage() {
  const [user, classNames] = await Promise.all([getCurrentUser(), listClassNames()]);
  const available = isStudentSessionAvailable();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Logo className="mb-8 justify-center" />
        <Card className="gap-6 overflow-hidden border-orange-100 pt-0 shadow-xl shadow-orange-500/10">
          <div className="bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-5 text-white">
            <p className="text-sm font-medium text-orange-50">Xin chào! 👋</p>
            <p className="text-xl font-bold">Vào học Vật lý 9</p>
            <div className="mt-3 flex gap-4 text-xs text-orange-50">
              <span className="flex items-center gap-1"><BookOpen className="size-3.5" /> Bài học</span>
              <span className="flex items-center gap-1"><FlaskConical className="size-3.5" /> Thí nghiệm</span>
              <span className="flex items-center gap-1"><PencilLine className="size-3.5" /> Luyện tập</span>
            </div>
          </div>
          <CardHeader className="px-6">
            <CardTitle>Nhập họ tên và lớp của em</CardTitle>
            <CardDescription>
              Không cần mật khẩu. Các bạn nhập cùng tên lớp sẽ được xếp chung lớp. Lần sau nhập đúng họ tên và lớp để xem lại
              kết quả học tập.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 px-6">
            {!available && (
              <Alert variant="warning">
                <TriangleAlert />
                <AlertTitle>Chưa sẵn sàng</AlertTitle>
                <AlertDescription>
                  <p>Máy chủ chưa cấu hình đầy đủ. <Link href="/setup" className="underline">Xem cấu hình</Link>.</p>
                </AlertDescription>
              </Alert>
            )}
            {user && (
              <Alert variant="info">
                <AlertDescription>
                  <p>
                    Bạn đang dùng tên <b>{user.fullName}</b>.{" "}
                    <Link href={homePathForRole(user.role)} className="font-semibold underline">Tiếp tục học →</Link>
                  </p>
                </AlertDescription>
              </Alert>
            )}
            <EnterForm classNames={classNames} disabled={!available} />
          </CardContent>
        </Card>
        <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">← Trang chủ</Link>
          <Button asChild variant="link" className="h-auto p-0 text-muted-foreground">
            <Link href="/login">Giáo viên đăng nhập</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
