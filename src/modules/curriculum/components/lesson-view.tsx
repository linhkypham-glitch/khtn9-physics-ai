import Link from "next/link";
import {
  BarChart3,
  BookOpenText,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ExternalLink,
  FlaskConical,
  PencilLine,
  Target,
} from "lucide-react";

import { EmptyState } from "@/components/dashboard/states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LessonMaterialRow, LessonSection } from "@/types/database";
import type { LessonDetail } from "../repository";
import { formatChapterLabel } from "../types";

const SECTIONS: { value: LessonSection | "results"; label: string; icon: typeof BookOpenText }[] = [
  { value: "knowledge", label: "Kiến thức", icon: BookOpenText },
  { value: "experiment", label: "Thí nghiệm", icon: FlaskConical },
  { value: "practice", label: "Luyện tập", icon: PencilLine },
  { value: "self_assessment", label: "Tự đánh giá", icon: ClipboardCheck },
  { value: "results", label: "Kết quả học tập", icon: BarChart3 },
];

function MaterialItem({ m }: { m: LessonMaterialRow }) {
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
        {m.url && m.kind !== "image" && (
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

/** Trang bài học với 5 khu vực: Kiến thức, Thí nghiệm, Luyện tập, Tự đánh giá, Kết quả học tập. */
export function LessonView({ lesson, basePath, viewer }: { lesson: LessonDetail; basePath: string; viewer: "student" | "staff" }) {
  const bySection = (s: LessonSection) => lesson.materials.filter((m) => m.section === s);
  const objectives = lesson.objectives.filter((o) => o.kind === "objective");
  const requirements = lesson.objectives.filter((o) => o.kind === "requirement");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <nav aria-label="Đường dẫn" className="mb-3 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <Link href={basePath} className="hover:text-foreground">Chương trình học</Link>
          <ChevronRight className="size-3.5" aria-hidden />
          <span>{formatChapterLabel(lesson.chapter)}</span>
        </nav>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="blue">Bài {lesson.number}</Badge>
          {lesson.lessonType === "practice" && (
            <Badge variant="teal"><FlaskConical /> Bài thực hành</Badge>
          )}
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
          Bài {lesson.number}. {lesson.title}.
        </h1>
        {lesson.summary && <p className="mt-2 max-w-3xl text-muted-foreground">{lesson.summary}</p>}
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
          <MaterialList
            items={bySection("knowledge")}
            emptyTitle="Chưa có nội dung lý thuyết"
            emptyDescription="Nội dung lý thuyết, công thức, ví dụ, hình ảnh và video sẽ hiển thị tại đây khi giáo viên xuất bản."
          />
        </TabsContent>

        <TabsContent value="experiment">
          <MaterialList
            items={bySection("experiment")}
            emptyTitle="Chưa có thí nghiệm cho bài học này"
            emptyDescription="Thí nghiệm mô phỏng tương tác của bài học sẽ xuất hiện tại đây."
          />
        </TabsContent>

        <TabsContent value="practice">
          <MaterialList
            items={bySection("practice")}
            emptyTitle="Chưa có bài luyện tập"
            emptyDescription="Câu hỏi trắc nghiệm, đúng – sai, trả lời ngắn và bài tập tính toán sẽ hiển thị tại đây."
          />
        </TabsContent>

        <TabsContent value="self_assessment">
          <MaterialList
            items={bySection("self_assessment")}
            emptyTitle="Chưa có bài tự đánh giá"
            emptyDescription="Bài kiểm tra theo bài học có chấm điểm tự động và giải thích đáp án sẽ hiển thị tại đây."
          />
        </TabsContent>

        <TabsContent value="results">
          <EmptyState
            icon={BarChart3}
            title={viewer === "student" ? "Bạn chưa có kết quả học tập ở bài này" : "Chưa có dữ liệu kết quả học tập"}
            description={
              viewer === "student"
                ? "Lịch sử học, kết quả luyện tập và nội dung cần ôn tập sẽ được ghi nhận khi bạn làm bài."
                : "Kết quả của học sinh sẽ được tổng hợp tại đây khi có bài làm."
            }
          />
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
