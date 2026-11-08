import Link from "next/link";
import {
  BarChart3,
  BookOpenText,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ExternalLink,
  FlaskConical,
  Image as ImageIcon,
  PencilLine,
  Target,
} from "lucide-react";

import { EmptyState } from "@/components/dashboard/states";
import { PracticePanel } from "@/components/questions/practice-panel";
import { SelfAssessmentPanel } from "@/components/questions/self-assessment-panel";
import { chapterTheme } from "@/lib/chapter-theme";
import { cn } from "@/lib/utils";
import type { PublicQuestion } from "@/modules/question-bank/types";
import type { ExperimentDef } from "@/modules/virtual-lab/catalog";
import { ExperimentPanel } from "@/modules/virtual-lab/experiment-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LessonMaterialRow, LessonSection } from "@/types/database";
import type { LessonDetail } from "../repository";
import { formatChapterLabel } from "../types";
import { FigureCard } from "../figures/primitives";
import { figuresForLesson } from "../figures";
import { youtubeEmbedUrl } from "../video";

const SECTIONS: { value: LessonSection | "results"; label: string; icon: typeof BookOpenText }[] = [
  { value: "knowledge", label: "Kiến thức", icon: BookOpenText },
  { value: "experiment", label: "Thí nghiệm", icon: FlaskConical },
  { value: "practice", label: "Luyện tập", icon: PencilLine },
  { value: "self_assessment", label: "Tự đánh giá", icon: ClipboardCheck },
  { value: "results", label: "Kết quả học tập", icon: BarChart3 },
];

function MaterialItem({ m }: { m: LessonMaterialRow }) {
  const embed = m.kind === "video" && m.url ? youtubeEmbedUrl(m.url) : null;
  return (
    <Card className="gap-2 py-4">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-base">{m.title}</CardTitle>
        {!m.is_published && <Badge variant="amber">Bản nháp</Badge>}
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-relaxed">
        {m.body &&
          (m.kind === "formula" ? (
            <pre className="overflow-x-auto rounded-lg bg-blue-soft px-4 py-3 font-mono text-base text-accent-foreground">{m.body}</pre>
          ) : (
            <p className="whitespace-pre-line">{m.body}</p>
          ))}
        {m.url && m.kind === "image" && (
          // eslint-disable-next-line @next/next/no-img-element -- URL do giáo viên nhập, không qua next/image
          <img src={m.url} alt={m.title} className="max-h-96 rounded-lg border" loading="lazy" />
        )}
        {embed && (
          <div className="aspect-video overflow-hidden rounded-lg border">
            <iframe src={embed} title={m.title} className="size-full" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
          </div>
        )}
        {m.url && m.kind !== "image" && !embed && (
          <a href={m.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
            Mở tài liệu <ExternalLink className="size-3.5" />
          </a>
        )}
      </CardContent>
    </Card>
  );
}

function MaterialList({ items, emptyTitle, emptyDescription }: { items: LessonMaterialRow[]; emptyTitle: string; emptyDescription: string }) {
  if (items.length === 0) return <EmptyState title={emptyTitle} description={emptyDescription} />;
  return <div className="grid gap-4">{items.map((m) => <MaterialItem key={m.id} m={m} />)}</div>;
}

export type LessonResults = {
  attempts: { id: string; score: number; correctUnits: number; totalUnits: number; durationSeconds: number | null; submittedAt: string }[];
  experimentRuns: number;
};

const dateTime = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

function ResultsPanel({ results, viewer }: { results: LessonResults | null; viewer: "student" | "staff" }) {
  if (!results || (results.attempts.length === 0 && results.experimentRuns === 0)) {
    return (
      <EmptyState
        icon={BarChart3}
        title={viewer === "student" ? "Em chưa có kết quả ở bài này" : "Chưa có dữ liệu kết quả học tập"}
        description={
          viewer === "student"
            ? "Hãy làm thí nghiệm và bài Tự đánh giá – kết quả sẽ được lưu tại đây."
            : "Kết quả của bạn khi làm thử sẽ hiển thị tại đây. Kết quả học sinh xem trong trang Lớp học."
        }
      />
    );
  }
  const scores = results.attempts.map((a) => a.score);
  const best = scores.length ? Math.max(...scores) : null;
  const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
  const latest = results.attempts[0];
  const trend = results.attempts.length > 1 ? latest.score - results.attempts[results.attempts.length - 1].score : null;
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Số lần tự đánh giá", String(results.attempts.length)],
          ["Điểm cao nhất", best === null ? "—" : best.toLocaleString("vi-VN")],
          ["Điểm trung bình", avg === null ? "—" : avg.toLocaleString("vi-VN", { maximumFractionDigits: 2 })],
          ["Lần làm thí nghiệm đã lưu", String(results.experimentRuns)],
        ].map(([l, v]) => (
          <Card key={l} className="gap-1 py-4 text-center">
            <p className="text-2xl font-bold text-primary tabular-nums">{v}</p>
            <p className="text-xs text-muted-foreground">{l}</p>
          </Card>
        ))}
      </div>
      {trend !== null && (
        <p className={cn("rounded-xl px-4 py-2.5 text-sm", trend >= 0 ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-900")}>
          {trend > 0 ? `📈 Tiến bộ ${trend.toLocaleString("vi-VN")} điểm so với lần làm đầu tiên.` : trend === 0 ? "Điểm giữ ổn định so với lần đầu." : "Điểm lần gần nhất thấp hơn lần đầu – hãy xem lại phần Kiến thức và Luyện tập."}
          {latest && latest.score < 5 ? " Gợi ý: ôn lại lý thuyết, công thức và làm lại phần Luyện tập." : ""}
        </p>
      )}
      {results.attempts.length > 0 && (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thời điểm</TableHead>
                <TableHead className="text-right">Điểm</TableHead>
                <TableHead className="text-right">Ý đúng</TableHead>
                <TableHead className="text-right">Thời gian</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.attempts.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="tabular-nums">{dateTime.format(new Date(a.submittedAt))}</TableCell>
                  <TableCell className="text-right font-bold tabular-nums">{a.score.toLocaleString("vi-VN")}</TableCell>
                  <TableCell className="text-right tabular-nums">{a.correctUnits}/{a.totalUnits}</TableCell>
                  <TableCell className="text-right tabular-nums">{a.durationSeconds === null ? "—" : `${Math.floor(a.durationSeconds / 60)} phút ${a.durationSeconds % 60} giây`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

/** Trang bài học với 5 khu vực: Kiến thức, Thí nghiệm, Luyện tập, Tự đánh giá, Kết quả học tập. */
export function LessonView({
  lesson,
  basePath,
  viewer,
  experiment,
  questions,
  canSave,
  results,
}: {
  lesson: LessonDetail;
  basePath: string;
  viewer: "student" | "staff";
  experiment: ExperimentDef | null;
  questions: PublicQuestion[] | null;
  canSave: boolean;
  results: LessonResults | null;
}) {
  const theme = chapterTheme(lesson.chapter.number);
  const figures = figuresForLesson(lesson.number);
  const bySection = (s: LessonSection) => lesson.materials.filter((m) => m.section === s);
  const objectives = lesson.objectives.filter((o) => o.kind === "objective");
  const requirements = lesson.objectives.filter((o) => o.kind === "requirement");

  return (
    <div className="flex flex-col gap-6">
      <div className={cn("relative overflow-hidden rounded-3xl bg-gradient-to-r px-6 py-6 text-white shadow-lg sm:px-8", theme.gradient)}>
        <span aria-hidden className="absolute -right-4 -bottom-8 text-[120px] leading-none opacity-15">{theme.emoji}</span>
        <nav aria-label="Đường dẫn" className="relative mb-3 flex flex-wrap items-center gap-1 text-sm text-white/85">
          <Link href={basePath} className="hover:text-white hover:underline">Chương trình học</Link>
          <ChevronRight className="size-3.5" aria-hidden />
          <span>{formatChapterLabel(lesson.chapter)}</span>
        </nav>
        <div className="relative flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-white/25 px-3 py-0.5 text-sm font-semibold">Bài {lesson.number}</span>
          {lesson.lessonType === "practice" && <span className="flex items-center gap-1 rounded-full bg-white/25 px-3 py-0.5 text-sm font-semibold"><FlaskConical className="size-3.5" /> Bài thực hành</span>}
        </div>
        <h1 className="relative mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{lesson.title}.</h1>
        {lesson.summary && <p className="relative mt-2 max-w-3xl text-white/90">{lesson.summary}</p>}
        {viewer === "staff" && (
          <Button asChild size="sm" variant="secondary" className="relative mt-4">
            <Link href={`/teacher/curriculum/${lesson.slug}/edit`}><PencilLine /> Sửa nội dung bài học</Link>
          </Button>
        )}
      </div>

      <Tabs defaultValue="knowledge">
        <TabsList>
          {SECTIONS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value}>
              <Icon aria-hidden /> {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="knowledge" className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="gap-3">
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Target className="size-4 text-primary" /> Mục tiêu bài học</CardTitle></CardHeader>
              <CardContent>
                {objectives.length ? (
                  <ul className="list-disc space-y-1.5 pl-5 text-sm">{objectives.map((o) => <li key={o.id}>{o.content}</li>)}</ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Giáo viên chưa cập nhật mục tiêu bài học.</p>
                )}
              </CardContent>
            </Card>
            <Card className="gap-3">
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ClipboardCheck className="size-4 text-teal" /> Yêu cầu cần đạt</CardTitle></CardHeader>
              <CardContent>
                {requirements.length ? (
                  <ul className="list-disc space-y-1.5 pl-5 text-sm">{requirements.map((o) => <li key={o.id}>{o.content}</li>)}</ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Giáo viên chưa cập nhật yêu cầu cần đạt.</p>
                )}
              </CardContent>
            </Card>
          </div>
          {figures.length > 0 && (
            <section aria-label="Hình ảnh trực quan" className="grid gap-3">
              <h2 className="flex items-center gap-2 text-base font-semibold"><ImageIcon className="size-4 text-primary" aria-hidden /> Hình ảnh trực quan</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {figures.map((f, i) => (
                  <div key={f.id} className={figures.length % 2 === 1 && i === figures.length - 1 ? "lg:col-span-2" : undefined}>
                    <FigureCard title={f.title} caption={f.caption}>{f.render()}</FigureCard>
                  </div>
                ))}
              </div>
            </section>
          )}
          <MaterialList
            items={bySection("knowledge")}
            emptyTitle="Chưa có nội dung lý thuyết"
            emptyDescription="Nội dung lý thuyết, công thức, ví dụ, hình ảnh và video sẽ hiển thị tại đây khi giáo viên xuất bản."
          />
        </TabsContent>

        <TabsContent value="experiment" className="flex flex-col gap-6">
          {experiment ? (
            <ExperimentPanel def={experiment} canSave={canSave} />
          ) : (
            <EmptyState title="Bài này chưa có thí nghiệm ảo" description="SGK bài này không có thí nghiệm thực hành hoặc chỉ có hoạt động quan sát, thảo luận. Xem các hoạt động trong sách ở bên dưới." />
          )}
          {bySection("experiment").length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold">Thí nghiệm, hoạt động trong sách giáo khoa</h3>
              <MaterialList items={bySection("experiment")} emptyTitle="" emptyDescription="" />
            </div>
          )}
        </TabsContent>

        <TabsContent value="practice">
          {questions === null ? (
            <EmptyState title="Chưa tải được câu hỏi" description="Máy chủ chưa cấu hình SUPABASE_SECRET_KEY." />
          ) : questions.length === 0 ? (
            <EmptyState title="Chưa có câu hỏi luyện tập" description="Giáo viên sẽ bổ sung câu hỏi cho bài học này." />
          ) : (
            <PracticePanel lessonId={lesson.id} questions={questions} />
          )}
        </TabsContent>

        <TabsContent value="self_assessment">
          {questions === null || questions.length === 0 ? (
            <EmptyState title="Chưa có bài tự đánh giá" description="Bài tự đánh giá được tạo từ ngân hàng câu hỏi của bài học." />
          ) : (
            <SelfAssessmentPanel lessonId={lesson.id} questions={questions} canSave={canSave} />
          )}
        </TabsContent>

        <TabsContent value="results">
          <ResultsPanel results={results} viewer={viewer} />
        </TabsContent>
      </Tabs>

      <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:justify-between">
        {lesson.prev ? (
          <Button asChild variant="outline" className="h-auto justify-start py-2 whitespace-normal">
            <Link href={`${basePath}/${lesson.prev.slug}`}>
              <ChevronLeft /> <span className="text-left">Bài {lesson.prev.number}. {lesson.prev.title}</span>
            </Link>
          </Button>
        ) : <span />}
        {lesson.next && (
          <Button asChild variant="outline" className="h-auto justify-end py-2 whitespace-normal">
            <Link href={`${basePath}/${lesson.next.slug}`}>
              <span className="text-right">Bài {lesson.next.number}. {lesson.next.title}</span> <ChevronRight />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
