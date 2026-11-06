import Link from "next/link";

import { LessonsPerChapterChart } from "@/components/charts/lessons-per-chapter-chart";
import { ErrorState } from "@/components/dashboard/states";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CurriculumResult } from "@/modules/curriculum/types";
import { countLessons } from "@/modules/curriculum/types";

/** Thẻ tổng quan chương trình: biểu đồ số bài theo chương (dữ liệu database). */
export function CurriculumOverviewCard({ curriculum, href }: { curriculum: CurriculumResult; href: string }) {
  if (!curriculum.ok) return <ErrorState title="Không tải được chương trình học" description={curriculum.error} />;
  const data = curriculum.chapters.map((c) => ({ chapter: c.roman, title: c.title, lessons: c.lessons.length }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chương trình học</CardTitle>
        <CardDescription>
          Số bài học theo chương · {curriculum.chapters.length} chương, {countLessons(curriculum.chapters)} bài
        </CardDescription>
        <CardAction>
          <Button asChild variant="outline" size="sm"><Link href={href}>Xem tất cả</Link></Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <LessonsPerChapterChart data={data} />
        <ul className="mt-3 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
          {curriculum.chapters.map((c) => (
            <li key={c.number}>
              <span className="font-semibold text-foreground">{c.roman}.</span> {c.title} – {c.lessons.length} bài
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
