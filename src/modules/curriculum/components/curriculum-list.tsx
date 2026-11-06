import Link from "next/link";
import { ChevronRight, FlaskConical } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatChapterLabel, formatLessonLabel, type CurriculumChapter } from "../types";

const CHAPTER_TONES = [
  "bg-blue-soft text-primary",
  "bg-amber-soft text-amber",
  "bg-violet-soft text-violet",
  "bg-teal-soft text-teal",
  "bg-green-100 text-green-700",
];

/**
 * Danh sách chương & bài học.
 * `lessonHref` = null → chỉ hiển thị (không có liên kết, ví dụ ở trang chủ công khai).
 */
export function CurriculumList({
  chapters,
  lessonHref,
  compact = false,
}: {
  chapters: CurriculumChapter[];
  lessonHref: ((slug: string) => string) | null;
  compact?: boolean;
}) {
  return (
    <div className={cn("grid gap-4", !compact && "lg:grid-cols-2")}>
      {chapters.map((chapter, idx) => (
        <Card key={chapter.number} className="gap-3">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold",
                  CHAPTER_TONES[idx % CHAPTER_TONES.length],
                )}
                aria-hidden
              >
                {chapter.roman}
              </span>
              <div className="min-w-0">
                <CardTitle className="text-base uppercase tracking-wide">{formatChapterLabel(chapter)}</CardTitle>
                <p className="text-xs text-muted-foreground">{chapter.lessons.length} bài học</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-3">
            <ul className="flex flex-col">
              {chapter.lessons.map((lesson) => {
                const inner = (
                  <>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold tabular-nums text-muted-foreground">
                      {lesson.number}
                    </span>
                    <span className="min-w-0 flex-1 text-sm leading-snug">{formatLessonLabel(lesson)}</span>
                    {lesson.lessonType === "practice" && (
                      <Badge variant="teal" className="hidden sm:inline-flex">
                        <FlaskConical /> Thực hành
                      </Badge>
                    )}
                  </>
                );
                return (
                  <li key={lesson.slug}>
                    {lessonHref ? (
                      <Link
                        href={lessonHref(lesson.slug)}
                        className="group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-accent"
                      >
                        {inner}
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 px-2 py-2">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
