import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ClipboardList, Pencil, Plus, Sparkles } from "lucide-react";

import { QuestionStatusButtons } from "@/components/questions/question-status-buttons";
import { Button } from "@/components/ui/button";

import { EmptyState, ErrorState } from "@/components/dashboard/states";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { LEVEL_LABELS, TYPE_LABELS, type CognitiveLevel, type QuestionType } from "@/modules/question-bank/types";

export const metadata: Metadata = { title: "Ngân hàng câu hỏi" };

const STATUS_LABELS = { draft: "Nháp", reviewed: "Đã xem", approved: "Đã duyệt", published: "Đã xuất bản" } as const;

export default async function Page({ searchParams }: PageProps<"/teacher/questions">) {
  await requireRole(["teacher", "admin"]);
  const sp = await searchParams;
  const lessonFilter = typeof sp.bai === "string" ? Number(sp.bai) : null;
  const typeFilter = typeof sp.dang === "string" && sp.dang in TYPE_LABELS ? (sp.dang as QuestionType) : null;
  const levelFilter = typeof sp.muc === "string" && sp.muc in LEVEL_LABELS ? (sp.muc as CognitiveLevel) : null;
  const draftOnly = sp.tt === "nhap";

  const supabase = await createSupabaseServerClient();
  if (!supabase) return <ErrorState description="Supabase chưa được cấu hình." />;

  const { data: lessons } = await supabase.from("lessons").select("id, number, title").order("number");
  let query = supabase
    .from("question_bank")
    .select("id, code, type, level, content, unit, answer_number, tolerance, explanation, formula, status, source, lessons!inner(number, title), question_options(label, content, is_correct), question_subitems(label, content, is_true)")
    .order("sort_order");
  if (lessonFilter) query = query.eq("lessons.number", lessonFilter);
  if (typeFilter) query = query.eq("type", typeFilter);
  if (levelFilter) query = query.eq("level", levelFilter);
  if (draftOnly) query = query.in("status", ["draft", "reviewed"]);
  const { data: questions, error } = await query.limit(300);

  const href = (patch: Record<string, string | null>) => {
    const params = new URLSearchParams();
    const cur = { bai: lessonFilter ? String(lessonFilter) : null, dang: typeFilter, muc: levelFilter, tt: draftOnly ? "nhap" : null, ...patch };
    Object.entries(cur).forEach(([k, v]) => v && params.set(k, v));
    const qs = params.toString();
    return `/teacher/questions${qs ? `?${qs}` : ""}`;
  };
  const chip = (active: boolean) =>
    cn("rounded-full border px-3 py-1 text-sm transition-colors", active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-accent");

  return (
    <>
      <PageHeader
        title="Ngân hàng câu hỏi"
        description={`${questions?.length ?? 0} câu hỏi · lọc theo bài học, dạng câu hỏi, mức độ nhận thức và trạng thái duyệt`}
        actions={
          <Button asChild>
            <Link href={`/teacher/questions/new${lessonFilter ? `?bai=${lessonFilter}` : ""}`}><Plus /> Thêm câu hỏi</Link>
          </Button>
        }
      />

      <Card className="mb-5 gap-3 py-4">
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            <Link href={href({ bai: null })} className={chip(!lessonFilter)}>Tất cả bài</Link>
            {(lessons ?? []).map((l) => (
              <Link key={l.id} href={href({ bai: String(l.number) })} className={chip(lessonFilter === l.number)} title={l.title}>Bài {l.number}</Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Link href={href({ dang: null })} className={chip(!typeFilter)}>Mọi dạng</Link>
            {(Object.keys(TYPE_LABELS) as QuestionType[]).filter((t) => t !== "essay").map((t) => (
              <Link key={t} href={href({ dang: t })} className={chip(typeFilter === t)}>{TYPE_LABELS[t]}</Link>
            ))}
            <span className="mx-1 w-px bg-border" />
            <Link href={href({ muc: null })} className={chip(!levelFilter)}>Mọi mức độ</Link>
            {(Object.keys(LEVEL_LABELS) as CognitiveLevel[]).map((l) => (
              <Link key={l} href={href({ muc: l })} className={chip(levelFilter === l)}>{LEVEL_LABELS[l]}</Link>
            ))}
            <span className="mx-1 w-px bg-border" />
            <Link href={href({ tt: draftOnly ? null : "nhap" })} className={chip(draftOnly)}>Chờ duyệt (nháp, AI)</Link>
          </div>
        </CardContent>
      </Card>

      {error ? (
        <ErrorState description="Không tải được ngân hàng câu hỏi." />
      ) : !questions?.length ? (
        <EmptyState icon={ClipboardList} title="Không có câu hỏi phù hợp" />
      ) : (
        <div className="flex flex-col gap-3">
          {questions.map((q) => (
            <Card key={q.id} className="gap-3 py-4">
              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Badge variant="blue">Bài {q.lessons.number}</Badge>
                  <Badge variant="secondary">{TYPE_LABELS[q.type]}</Badge>
                  <Badge variant={q.level === "biet" ? "teal" : q.level === "hieu" ? "amber" : "violet"}>{LEVEL_LABELS[q.level]}</Badge>
                  <Badge variant={q.status === "published" ? "outline" : "destructive"}>{STATUS_LABELS[q.status]}</Badge>
                  {q.source.startsWith("AI") && <Badge variant="violet"><Sparkles /> AI</Badge>}
                  <span className="ml-auto font-mono text-muted-foreground">{q.code}</span>
                  <QuestionStatusButtons id={q.id} status={q.status} />
                  <Button asChild size="sm" variant="outline"><Link href={`/teacher/questions/${q.id}`}><Pencil /> Sửa</Link></Button>
                </div>
                <p className="font-medium whitespace-pre-line">{q.content}</p>
                {q.type === "multiple_choice" && (
                  <ul className="grid gap-1 text-sm sm:grid-cols-2">
                    {[...q.question_options].sort((a, b) => a.label.localeCompare(b.label)).map((o) => (
                      <li key={o.label} className={cn("flex gap-2 rounded-lg px-2 py-1", o.is_correct && "bg-green-50 font-medium text-green-800")}>
                        <b>{o.label}.</b> {o.content} {o.is_correct && <CheckCircle2 className="size-4 shrink-0" />}
                      </li>
                    ))}
                  </ul>
                )}
                {q.type === "true_false" && (
                  <ul className="text-sm">
                    {[...q.question_subitems].sort((a, b) => a.label.localeCompare(b.label)).map((s) => (
                      <li key={s.label} className="flex justify-between gap-3 border-b py-1 last:border-0">
                        <span><b>{s.label})</b> {s.content}</span>
                        <b className={s.is_true ? "text-green-700" : "text-red-600"}>{s.is_true ? "Đúng" : "Sai"}</b>
                      </li>
                    ))}
                  </ul>
                )}
                {q.type === "short_answer" && (
                  <p className="text-sm">Đáp án: <b className="text-green-700">{Number(q.answer_number).toLocaleString("vi-VN")} {q.unit}</b> <span className="text-muted-foreground">(sai số cho phép ±{Number(q.tolerance).toLocaleString("vi-VN")})</span></p>
                )}
                <details className="text-sm">
                  <summary className="cursor-pointer font-medium text-primary">Lời giải</summary>
                  <p className="mt-1 whitespace-pre-line text-muted-foreground">{q.explanation}</p>
                  {q.formula && <p className="mt-1 font-mono text-orange-800">{q.formula}</p>}
                </details>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
