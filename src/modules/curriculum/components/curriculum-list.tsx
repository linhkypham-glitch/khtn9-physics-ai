import Link from "next/link";
import { ChevronRight, FlaskConical } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { chapterTheme } from "@/lib/chapter-theme";
import { cn } from "@/lib/utils";
import { formatChapterLabel, formatLessonLabel, type CurriculumChapter } from "../types";

/**
 * Danh sách chương & bài học (mỗi chương một màu nhận diện).
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
    <div className={cn("grid gap-5", !compact && "lg:grid-cols-2")}>
      {chapters.map((chapter) => {
        const theme = chapterTheme(chapter.number);
        return (
          <Card key={chapter.number} className="gap-0 overflow-hidden border-white/70 py-0">
            <div className={cn("relative flex items-center gap-3 bg-gradient-to-r px-5 py-4 text-white", theme.gradient)}>
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-lg font-bold ring-1 ring-white/30" aria-hidden>
                {chapter.roman}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-white/80">Chương {chapter.roman}</p>
                <p className="font-semibold leading-snug">{chapter.title}</p>
              </div>
              <span className="ml-auto rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium">{chapter.lessons.length} bài</span>
              <span aria-hidden className="absolute -right-2 -bottom-4 text-6xl opacity-15">{theme.emoji}</span>
            </div>
            <ul className="flex flex-col p-2">
              {chapter.lessons.map((lesson) => {
                const inner = (
                  <>
                    <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold tabular-nums", theme.chip)}>
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
                      <Link href={lessonHref(lesson.slug)} className={cn("group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors", "hover:bg-slate-50")}>
                        {inner}
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3 px-3 py-2.5">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
            {!compact && <p className="sr-only">{formatChapterLabel(chapter)}</p>}
          </Card>
        );
      })}
    </div>
  );
}
