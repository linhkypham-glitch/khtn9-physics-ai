import type { Metadata } from "next";
import Link from "next/link";

import { SetupStatusPanel } from "@/components/dashboard/setup-status-panel";
import { Logo } from "@/components/layout/logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSetupStatus } from "@/lib/setup-status";

export const metadata: Metadata = { title: "Cấu hình hệ thống" };

const STEPS = [
  {
    title: "1. Tạo dự án Supabase",
    body: (
      <>
        Tạo dự án tại supabase.com (hoặc chạy cục bộ bằng <code>npx supabase start</code>). Lấy <b>Project URL</b> và
        khóa <b>Publishable</b> (hoặc anon) trong mục Project Settings → API Keys.
      </>
    ),
  },
  {
    title: "2. Tạo file .env.local",
    body: (
      <>
        Sao chép <code>.env.example</code> thành <code>.env.local</code> và điền <code>NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
        <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>. Khóa bí mật (<code>SUPABASE_SECRET_KEY</code>, API key AI) chỉ
        đặt ở máy chủ, không bao giờ có tiền tố <code>NEXT_PUBLIC_</code>.
      </>
    ),
  },
  {
    title: "3. Chạy migration và seed",
    body: (
      <>
        Cục bộ: <code>npx supabase db reset</code>. Supabase Cloud: <code>npx supabase link</code> rồi{" "}
        <code>npx supabase db push</code>, sau đó chạy <code>supabase/seed/01_curriculum.sql</code> và{" "}
        <code>02_system_settings.sql</code> trong SQL Editor. Không chạy file dữ liệu demo trên môi trường thật.
      </>
    ),
  },
  {
    title: "4. Tạo tài khoản quản trị đầu tiên",
    body: (
      <>
        Tạo người dùng trong Supabase → Authentication, sau đó chạy SQL:{" "}
        <code>update public.profiles set role = &apos;admin&apos; where email = &apos;email-cua-ban&apos;;</code>
      </>
    ),
  },
  {
    title: "5. (Tuỳ chọn) Cấu hình AI",
    body: (
      <>
        Đặt <code>AI_PROVIDER</code> (anthropic | openai | gemini) và API key tương ứng. Nếu bỏ trống, ứng dụng vẫn chạy –
        chỉ các chức năng AI bị tắt.
      </>
    ),
  },
];

export default async function SetupPage() {
  const status = await getSetupStatus();
  return (
    <div className="min-h-dvh">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <Link href="/login" className="text-sm font-medium text-primary hover:underline">Đăng nhập</Link>
        </div>
      </header>
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cấu hình hệ thống</h1>
          <p className="mt-1 text-muted-foreground">
            Kiểm tra kết nối thực tế tới Supabase và dịch vụ AI. Trang này không hiển thị giá trị bí mật.
          </p>
        </div>
        <SetupStatusPanel status={status} />
        <Card>
          <CardHeader>
            <CardTitle>Hướng dẫn thiết lập</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 text-sm leading-relaxed [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px]">
            {STEPS.map((s) => (
              <div key={s.title}>
                <p className="font-semibold">{s.title}</p>
                <p className="mt-1 text-muted-foreground">{s.body}</p>
              </div>
            ))}
            <p className="text-muted-foreground">Chi tiết đầy đủ xem file <code>README.md</code> trong mã nguồn.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
