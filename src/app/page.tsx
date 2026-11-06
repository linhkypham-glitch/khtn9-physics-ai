import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenText,
  ClipboardList,
  FlaskConical,
  GraduationCap,
  LogIn,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { ErrorState } from "@/components/dashboard/states";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurriculumList } from "@/modules/curriculum/components/curriculum-list";
import { CurriculumSourceNotice } from "@/modules/curriculum/components/curriculum-source-notice";
import { getCurriculum } from "@/modules/curriculum/repository";
import { countLessons } from "@/modules/curriculum/types";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: BookOpenText,
    title: "Bài học theo chương trình",
    text: "Mỗi bài có 5 khu vực: Kiến thức, Thí nghiệm, Luyện tập, Tự đánh giá và Kết quả học tập.",
    tone: "bg-blue-soft text-primary",
  },
  {
    icon: FlaskConical,
    title: "Phòng thí nghiệm ảo",
    text: "Mô phỏng tương tác: điều chỉnh thông số, quan sát hiện tượng, đọc số đo và đồ thị.",
    tone: "bg-teal-soft text-teal",
  },
  {
    icon: ClipboardList,
    title: "Ngân hàng câu hỏi & đề kiểm tra",
    text: "Trắc nghiệm, đúng – sai, trả lời ngắn, tự luận; giáo viên soạn đề hoặc dùng AI hỗ trợ và duyệt.",
    tone: "bg-amber-soft text-amber",
  },
  {
    icon: Sparkles,
    title: "Giải thích sau mỗi câu",
    text: "Đáp án đúng, lời giải, công thức Vật lý liên quan và kiến thức cần ghi nhớ.",
    tone: "bg-violet-soft text-violet",
  },
  {
    icon: BarChart3,
    title: "Phân tích quá trình học tập",
    text: "Theo dõi tiến bộ cá nhân và lớp theo chương, dạng câu hỏi và mức độ nhận thức.",
    tone: "bg-blue-soft text-primary",
  },
  {
    icon: ShieldCheck,
    title: "Bảo mật & phân quyền",
    text: "Phân quyền Quản trị viên, Giáo viên, Học sinh kiểm tra ở máy chủ và cơ sở dữ liệu.",
    tone: "bg-teal-soft text-teal",
  },
];

const ROLES = [
  { icon: GraduationCap, title: "Học sinh", text: "Học bài, làm thí nghiệm, luyện tập, làm bài được giao và theo dõi tiến bộ." },
  { icon: Users, title: "Giáo viên", text: "Quản lý lớp, cập nhật học liệu, soạn đề, giao bài, chấm và xem báo cáo." },
  { icon: ShieldCheck, title: "Quản trị viên", text: "Quản lý tài khoản, lớp học, chương trình học và cấu hình hệ thống." },
];

export default async function HomePage() {
  const curriculum = await getCurriculum();

  return (
    <div className="min-h-dvh bg-card">
      <header className="sticky top-0 z-30 border-b bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="flex items-center gap-1 sm:gap-2">
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <a href="#chuong-trinh">Chương trình</a>
            </Button>
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/login">
                <LogIn /> Giáo viên
              </Link>
            </Button>
            <Button asChild>
              <Link href="/vao-hoc">Vào học</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-background">
          <div aria-hidden className="absolute -top-32 -right-32 size-[28rem] rounded-full bg-blue-soft/70 blur-3xl" />
          <div aria-hidden className="absolute -bottom-40 -left-24 size-[22rem] rounded-full bg-teal-soft/60 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="size-1.5 rounded-full bg-primary" /> KHTN 9 · Phân môn Vật lý · Kết nối tri thức
              </p>
              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-balance sm:text-5xl">
                Học Vật lý 9 bằng <span className="text-primary">thí nghiệm</span>, luyện tập và{" "}
                <span className="text-rose-600">dữ liệu</span>.
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                PHYSICS AI là nền tảng học tập, thí nghiệm mô phỏng, kiểm tra đánh giá và phân tích quá trình học
                tập dành cho học sinh lớp 9 và giáo viên.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="bg-gradient-to-r from-orange-600 to-amber-500 shadow-lg shadow-orange-500/30 hover:from-orange-700 hover:to-amber-600">
                  <Link href="/vao-hoc">
                    Vào học ngay <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#chuong-trinh">Xem chương trình học</a>
                </Button>
              </div>
            </div>

            {/* Minh họa: tia sáng khúc xạ (trang trí) */}
            <div className="relative mx-auto w-full max-w-md" aria-hidden>
              <div className="rounded-2xl border bg-card p-5 shadow-lg">
                <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Khúc xạ ánh sáng</span>
                  <span>không khí → nước</span>
                </div>
                <svg viewBox="0 0 320 220" className="w-full">
                  <rect x="0" y="110" width="320" height="110" rx="10" fill="#dbeafe" />
                  <line x1="0" y1="110" x2="320" y2="110" stroke="#93c5fd" strokeWidth="2" />
                  <line x1="160" y1="10" x2="160" y2="210" stroke="#94a3b8" strokeDasharray="5 5" />
                  <line x1="60" y1="20" x2="160" y2="110" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                  <line x1="160" y1="110" x2="222" y2="205" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                  <line x1="160" y1="110" x2="260" y2="20" stroke="#f59e0b" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="160" cy="110" r="4" fill="#ea580c" />
                  <text x="122" y="64" fontSize="12" fill="#475569">i</text>
                  <text x="172" y="160" fontSize="12" fill="#475569">r</text>
                </svg>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-muted px-2 py-2"><p className="text-muted-foreground">n₁</p><p className="font-semibold">1,00</p></div>
                  <div className="rounded-lg bg-muted px-2 py-2"><p className="text-muted-foreground">n₂</p><p className="font-semibold">1,33</p></div>
                  <div className="rounded-lg bg-muted px-2 py-2"><p className="text-muted-foreground">n₁sin i = n₂sin r</p><p className="font-semibold">Snell</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tính năng */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Một nền tảng – trọn vẹn quá trình học</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Kết nối bài học, thí nghiệm, luyện tập, kiểm tra và phân tích kết quả trong cùng một hệ thống.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text, tone }) => (
              <Card key={title} className="gap-3 shadow-none">
                <CardHeader>
                  <span className={cn("mb-2 flex size-10 items-center justify-center rounded-lg", tone)}>
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{text}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Chương trình học */}
        <section id="chuong-trinh" className="scroll-mt-16 bg-background">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Chương trình KHTN 9 – Vật lý</h2>
            {curriculum.ok ? (
              <>
                <p className="mt-2 mb-6 text-muted-foreground">
                  {curriculum.chapters.length} chương · {countLessons(curriculum.chapters)} bài học theo sách Kết nối
                  tri thức với cuộc sống. Bấm “Vào học ngay”, nhập họ tên và lớp để bắt đầu – không cần mật khẩu.
                </p>
                <CurriculumSourceNotice source={curriculum.source} />
                <CurriculumList chapters={curriculum.chapters} lessonHref={null} />
              </>
            ) : (
              <div className="mt-6">
                <ErrorState title="Không tải được chương trình học" description={curriculum.error} />
              </div>
            )}
          </div>
        </section>

        {/* Vai trò */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Dành cho ai?</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {ROLES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-xl border p-5">
                <Icon className="size-6 text-primary" aria-hidden />
                <p className="mt-3 font-semibold">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} KHTN 9 – PHYSICS AI</p>
          <p>Nền tảng học tập Vật lý dành cho học sinh lớp 9</p>
        </div>
      </footer>
    </div>
  );
}
