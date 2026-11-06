import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BarChart3, CheckCircle2, ChevronLeft, Pencil, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAiConfigStatus } from "@/lib/ai/config";
import { requireRole } from "@/lib/auth/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { listVisibleClasses } from "@/modules/classes/repository";
import {
  AddFromBankButton,
  AiGeneratePanel,
  AssignForm,
  AutoFillButton,
  PublishControls,
  QuestionRowActions,
} from "@/modules/assessments/components/builder-widgets";
import { buildMatrix, DEFAULT_STRUCTURE, type AssessmentStructure } from "@/modules/assessments/logic";
import { LEVEL_LABELS, TYPE_LABELS } from "@/modules/question-bank/types";

export const metadata: Metadata = { title: "Soạn đề kiểm tra" };

const dt = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
const QSEL = "id, type, level, content, status, source, unit, answer_number, lessons!inner(number, title, chapters!inner(roman)), question_options(label, content, is_correct), question_subitems(label, content, is_true)";

export default async function Page({ params, searchParams }: PageProps<"/teacher/assessments/[id]">) {
  const user = await requireRole(["teacher", "admin"]);
  const { id } = await params;
  const { w } = await searchParams;
  const supabase = (await createSupabaseServerClient())!;
  const { data: a } = await supabase.from("assessments").select("*").eq("id", id).maybeSingle();
  if (!a) notFound();
  const editable = a.status === "draft" && (a.created_by === user.id || user.role === "admin");
  const owner = a.created_by === user.id || user.role === "admin";
  const structure = { ...DEFAULT_STRUCTURE, ...(a.structure as Partial<AssessmentStructure>) } as AssessmentStructure;

  const [{ data: aqs }, { data: assignments }, classes] = await Promise.all([
    supabase.from("assessment_questions").select(`points, sort_order, question_bank(${QSEL})`).eq("assessment_id", id).order("sort_order"),
    supabase.from("assessment_assignments").select("id, code, due_at, is_closed, classes(name)").eq("assessment_id", id).order("created_at", { ascending: false }),
    listVisibleClasses(),
  ]);
  const questions = (aqs ?? []).filter((x) => x.question_bank).map((x) => ({ ...x.question_bank!, points: Number(x.points) }));
  const inAssessment = new Set(questions.map((q) => q.id));
  const { data: bank } = editable
    ? await supabase.from("question_bank").select(QSEL).in("lesson_id", a.lesson_ids).in("status", ["approved", "published"]).order("sort_order").limit(400)
    : { data: [] };
  const available = (bank ?? []).filter((q) => !inAssessment.has(q.id));
  const matrix = buildMatrix(questions.map((q) => ({ type: q.type, level: q.level, points: q.points, lessonNumber: q.lessons.number, lessonTitle: q.lessons.title, chapterRoman: q.lessons.chapters.roman })));
  const drafts = questions.filter((q) => !["approved", "published"].includes(q.status)).length;
  const counts = { multiple_choice: 0, true_false: 0, short_answer: 0, essay: 0 };
  questions.forEach((q) => counts[q.type]++);
  const warnings = typeof w === "string" ? w.split("\n").filter(Boolean) : [];

  return (
    <>
      <PageHeader
        title={a.title}
        description={`${a.duration_minutes} phút · ${questions.length} câu · ${matrix.totalUnits} đơn vị trả lời · điểm thô ${matrix.totalPoints.toLocaleString("vi-VN")} → thang 10`}
        actions={<Button asChild variant="outline"><Link href="/teacher/assessments"><ChevronLeft /> Đề kiểm tra</Link></Button>}
      />
      {warnings.length > 0 && (
        <Alert variant="info" className="mb-4"><AlertDescription>{warnings.map((x) => <p key={x}>{x}</p>)}</AlertDescription></Alert>
      )}

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Badge variant={a.status === "published" ? "teal" : "amber"}>{a.status === "published" ? "Đã xuất bản" : "Nháp"}</Badge>
        <span className="text-sm text-muted-foreground">
          Cấu trúc mục tiêu: {structure.multiple_choice.count} TN · {structure.true_false.count} Đ-S · {structure.short_answer.count} TLN · {structure.essay?.count ?? 0} TL — hiện có {counts.multiple_choice} · {counts.true_false} · {counts.short_answer} · {counts.essay}
        </span>
        {drafts > 0 && <Badge variant="destructive">{drafts} câu chờ duyệt</Badge>}
      </div>
      {owner && <div className="mb-5"><PublishControls assessmentId={id} status={a.status} canDelete={!assignments?.length} /></div>}

      <Card className="mb-5 gap-3">
        <CardHeader>
          <CardTitle className="text-base">Ma trận & bản đặc tả rút gọn</CardTitle>
          <CardDescription>Tự động tính từ các câu hỏi trong đề (số câu theo dạng và mức độ nhận thức).</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-xs">
            <thead>
              <tr className="bg-orange-50">
                <th rowSpan={2} className="border px-2 py-1 text-left">Bài học</th>
                {(["multiple_choice", "true_false", "short_answer", "essay"] as const).map((t) => (
                  <th key={t} colSpan={3} className="border px-2 py-1">{TYPE_LABELS[t]}</th>
                ))}
                <th rowSpan={2} className="border px-2 py-1">Điểm</th>
              </tr>
              <tr className="bg-orange-50/60">
                {(["multiple_choice", "true_false", "short_answer", "essay"] as const).flatMap((t) =>
                  (["biet", "hieu", "van_dung"] as const).map((l) => <th key={t + l} className="border px-1 py-1 font-medium">{LEVEL_LABELS[l]}</th>),
                )}
              </tr>
            </thead>
            <tbody>
              {matrix.rows.map((r) => (
                <tr key={r.lesson}>
                  <td className="border px-2 py-1">Bài {r.lesson}. {r.title}</td>
                  {(["multiple_choice", "true_false", "short_answer", "essay"] as const).flatMap((t) =>
                    (["biet", "hieu", "van_dung"] as const).map((l) => <td key={t + l} className="border px-1 py-1 text-center tabular-nums">{r.cells[`${t}:${l}`] ?? ""}</td>),
                  )}
                  <td className="border px-2 py-1 text-center tabular-nums">{r.points.toLocaleString("vi-VN")}</td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td className="border px-2 py-1">Tỉ lệ điểm theo mức độ</td>
                <td colSpan={12} className="border px-2 py-1">
                  {matrix.byLevel.map((l) => `${LEVEL_LABELS[l.level]}: ${Math.round(l.percent)}% (${l.count} câu)`).join(" · ")}
                </td>
                <td className="border px-2 py-1 text-center">{matrix.totalPoints.toLocaleString("vi-VN")}</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <h2 className="mb-3 text-lg font-semibold">Câu hỏi trong đề</h2>
      <div className="mb-6 flex flex-col gap-3">
        {questions.length === 0 && <p className="text-sm text-muted-foreground">Đề chưa có câu hỏi.</p>}
        {questions.map((q, i) => (
          <Card key={q.id} className={cn("gap-2 py-4", !["approved", "published"].includes(q.status) && "border-red-300")}>
            <CardContent className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-md bg-primary px-2 py-0.5 font-bold text-primary-foreground">Câu {i + 1}</span>
                <Badge variant="blue">Bài {q.lessons.number}</Badge>
                <Badge variant="secondary">{TYPE_LABELS[q.type]}</Badge>
                <Badge variant={q.level === "biet" ? "teal" : q.level === "hieu" ? "amber" : "violet"}>{LEVEL_LABELS[q.level]}</Badge>
                {q.source.startsWith("AI") && <Badge variant="violet"><Sparkles /> AI</Badge>}
                {!["approved", "published"].includes(q.status) && (
                  <Link href={`/teacher/questions/${q.id}`} className="font-semibold text-destructive underline">Chưa duyệt – mở để kiểm tra & duyệt</Link>
                )}
                <span className="ml-auto" />
                <Button asChild size="sm" variant="ghost"><Link href={`/teacher/questions/${q.id}`}><Pencil /> Sửa</Link></Button>
                <QuestionRowActions assessmentId={id} questionId={q.id} points={q.points} editable={editable} />
              </div>
              <p className="text-sm whitespace-pre-line">{q.content}</p>
              {q.type === "multiple_choice" && (
                <p className="text-xs text-muted-foreground">
                  {[...q.question_options].sort((x, y) => x.label.localeCompare(y.label)).map((o) => (
                    <span key={o.label} className={cn("mr-3", o.is_correct && "font-semibold text-green-700")}>{o.label}. {o.content}{o.is_correct && " ✓"}</span>
                  ))}
                </p>
              )}
              {q.type === "true_false" && (
                <p className="text-xs text-muted-foreground">
                  {[...q.question_subitems].sort((x, y) => x.label.localeCompare(y.label)).map((s) => `${s.label}) ${s.is_true ? "Đ" : "S"}`).join(" · ")}
                </p>
              )}
              {q.type === "short_answer" && <p className="text-xs text-green-700">Đáp số: {Number(q.answer_number).toLocaleString("vi-VN")} {q.unit}</p>}
              {q.type === "essay" && <p className="text-xs text-sky-700">Tự luận – giáo viên chấm theo hướng dẫn chấm.</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {editable && (
        <div className="mb-6 grid gap-4 lg:grid-cols-2">
          <Card className="gap-3">
            <CardHeader><CardTitle className="text-base">Bổ sung tự động</CardTitle><CardDescription>Chọn thêm câu đã duyệt cho đủ cấu trúc đề.</CardDescription></CardHeader>
            <CardContent><AutoFillButton assessmentId={id} /></CardContent>
          </Card>
          <Card className="gap-3">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Sparkles className="size-4 text-violet-600" /> AI hỗ trợ soạn câu hỏi</CardTitle><CardDescription>Câu AI tạo ở trạng thái nháp, cần giáo viên duyệt.</CardDescription></CardHeader>
            <CardContent><AiGeneratePanel assessmentId={id} aiConfigured={getAiConfigStatus().configured} /></CardContent>
          </Card>
          <Card className="gap-3 lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Thêm từ ngân hàng ({available.length} câu phù hợp)</CardTitle></CardHeader>
            <CardContent className="max-h-[480px] overflow-y-auto">
              <ul className="divide-y">
                {available.map((q) => (
                  <li key={q.id} className="flex items-start gap-3 py-2 text-sm">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">Bài {q.lessons.number} · {TYPE_LABELS[q.type]} · {LEVEL_LABELS[q.level]}</p>
                      <p className="line-clamp-2">{q.content}</p>
                    </div>
                    <AddFromBankButton assessmentId={id} questionId={q.id} points={(structure[q.type] ?? { points: 1 }).points} />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="gap-3">
        <CardHeader>
          <CardTitle className="text-base">Giao bài cho lớp</CardTitle>
          {a.status !== "published" && <CardDescription>Hãy duyệt và xuất bản đề trước khi giao.</CardDescription>}
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {a.status === "published" && <AssignForm assessmentId={id} classes={classes.ok ? classes.data.map((c) => ({ id: c.id, name: c.name })) : []} />}
          {(assignments?.length ?? 0) > 0 && (
            <Table>
              <TableHeader><TableRow><TableHead>Mã bài giao</TableHead><TableHead>Lớp</TableHead><TableHead>Hạn nộp</TableHead><TableHead>Trạng thái</TableHead><TableHead /></TableRow></TableHeader>
              <TableBody>
                {assignments!.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="font-mono">{g.code}</TableCell>
                    <TableCell>Lớp {g.classes?.name}</TableCell>
                    <TableCell className="tabular-nums">{dt.format(new Date(g.due_at))}</TableCell>
                    <TableCell>{g.is_closed ? <Badge variant="secondary">Đã đóng</Badge> : <Badge variant="teal"><CheckCircle2 /> Đang mở</Badge>}</TableCell>
                    <TableCell className="text-right"><Button asChild size="sm"><Link href={`/teacher/assignments/${g.id}`}><BarChart3 /> Kết quả</Link></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
