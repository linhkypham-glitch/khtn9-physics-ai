"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LearningObjectiveRow, LessonMaterialRow } from "@/types/database";
import {
  deleteMaterialAction,
  deleteObjectiveAction,
  moveMaterialAction,
  saveMaterialAction,
  saveObjectiveAction,
  type ContentResult,
  type MaterialInput,
} from "../content-actions";

const SECTION_LABELS = { knowledge: "Kiến thức", experiment: "Thí nghiệm", practice: "Luyện tập", self_assessment: "Tự đánh giá" } as const;
const KIND_LABELS = { text: "Văn bản", formula: "Công thức", example: "Ví dụ", image: "Hình ảnh (URL)", video: "Video (YouTube/URL)", link: "Liên kết tài liệu" } as const;
type Section = keyof typeof SECTION_LABELS;
type Kind = keyof typeof KIND_LABELS;

const textareaCls = "min-h-24 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30";
const selectCls = "h-10 rounded-lg border border-input bg-card px-3 text-sm";

function Msg({ r }: { r: ContentResult | null }) {
  if (!r || !r.message) return null;
  return <Alert variant={r.ok ? "success" : "destructive"}><AlertDescription>{r.message}</AlertDescription></Alert>;
}

/* ---------------- Mục tiêu / yêu cầu cần đạt ---------------- */

function ObjectiveRow({ lessonId, o }: { lessonId: string; o: LearningObjectiveRow }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(o.content);
  const [pending, start] = useTransition();
  const [r, setR] = useState<ContentResult | null>(null);
  if (!editing) {
    return (
      <li className="flex items-start gap-2 rounded-lg border bg-card px-3 py-2 text-sm">
        <span className="flex-1 whitespace-pre-line">{o.content}</span>
        <Button size="icon" variant="ghost" className="size-7" aria-label="Sửa" onClick={() => setEditing(true)}><Pencil /></Button>
        <Button size="icon" variant="ghost" className="size-7 text-muted-foreground hover:text-destructive" aria-label="Xoá" disabled={pending} onClick={() => window.confirm("Xoá mục này?") && start(async () => { const res = await deleteObjectiveAction(lessonId, o.id); if (!res.ok) window.alert(res.message); })}>
          {pending ? <Loader2 className="animate-spin" /> : <Trash2 />}
        </Button>
      </li>
    );
  }
  return (
    <li className="flex flex-col gap-2 rounded-lg border bg-card p-3">
      <textarea className={textareaCls} value={text} maxLength={1000} onChange={(e) => setText(e.target.value)} aria-label="Nội dung" />
      <div className="flex gap-2">
        <Button size="sm" disabled={pending} onClick={() => start(async () => { const res = await saveObjectiveAction(lessonId, o.id, { kind: o.kind, content: text }); setR(res); if (res.ok) setEditing(false); })}>
          {pending ? <Loader2 className="animate-spin" /> : <Save />} Lưu
        </Button>
        <Button size="sm" variant="ghost" onClick={() => { setEditing(false); setText(o.content); setR(null); }}><X /> Huỷ</Button>
      </div>
      <Msg r={r} />
    </li>
  );
}

function ObjectiveList({ lessonId, kind, title, items }: { lessonId: string; kind: "objective" | "requirement"; title: string; items: LearningObjectiveRow[] }) {
  const [text, setText] = useState("");
  const [pending, start] = useTransition();
  const [r, setR] = useState<ContentResult | null>(null);
  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-3">
        {items.length ? <ul className="flex flex-col gap-2">{items.map((o) => <ObjectiveRow key={o.id} lessonId={lessonId} o={o} />)}</ul> : <p className="text-sm text-muted-foreground">Chưa có mục nào.</p>}
        <div className="flex flex-col gap-2">
          <textarea className={textareaCls} value={text} maxLength={1000} onChange={(e) => setText(e.target.value)} placeholder="Thêm mục mới…" aria-label={`Thêm ${title.toLowerCase()}`} />
          <Button size="sm" variant="outline" className="self-start" disabled={pending || text.trim().length < 3} onClick={() => start(async () => { const res = await saveObjectiveAction(lessonId, null, { kind, content: text }); setR(res); if (res.ok) setText(""); })}>
            {pending ? <Loader2 className="animate-spin" /> : <Plus />} Thêm
          </Button>
          <Msg r={r} />
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------------- Học liệu ---------------- */

function toInput(m: LessonMaterialRow | null, section: Section): MaterialInput {
  return m
    ? { section: m.section, kind: m.kind === "file" ? "link" : m.kind, title: m.title, body: m.body ?? "", url: m.url ?? "", is_published: m.is_published }
    : { section, kind: "text", title: "", body: "", url: "", is_published: true };
}

function MaterialForm({ lessonId, material, section, onDone }: { lessonId: string; material: LessonMaterialRow | null; section: Section; onDone: () => void }) {
  const [v, setV] = useState<MaterialInput>(() => toInput(material, section));
  const [pending, start] = useTransition();
  const [r, setR] = useState<ContentResult | null>(null);
  const needsUrl = ["image", "video", "link"].includes(v.kind);
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-primary/40 bg-card p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="m-section">Khu vực</Label>
          <select id="m-section" className={selectCls} value={v.section} onChange={(e) => setV({ ...v, section: e.target.value as Section })}>
            {Object.entries(SECTION_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="m-kind">Loại học liệu</Label>
          <select id="m-kind" className={selectCls} value={v.kind} onChange={(e) => setV({ ...v, kind: e.target.value as Kind })}>
            {Object.entries(KIND_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="m-title">Tiêu đề</Label>
        <Input id="m-title" value={v.title} maxLength={200} onChange={(e) => setV({ ...v, title: e.target.value })} />
      </div>
      {needsUrl && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="m-url">Đường dẫn {v.kind === "video" ? "(YouTube sẽ được nhúng trực tiếp)" : ""}</Label>
          <Input id="m-url" value={v.url ?? ""} maxLength={1000} placeholder="https://…" onChange={(e) => setV({ ...v, url: e.target.value })} />
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="m-body">{needsUrl ? "Mô tả (tuỳ chọn)" : v.kind === "formula" ? "Công thức (mỗi dòng một công thức)" : "Nội dung"}</Label>
        <textarea id="m-body" className={`${textareaCls} ${v.kind === "formula" ? "font-mono" : ""} min-h-32`} value={v.body ?? ""} maxLength={10000} onChange={(e) => setV({ ...v, body: e.target.value })} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" className="size-4 accent-primary" checked={v.is_published} onChange={(e) => setV({ ...v, is_published: e.target.checked })} />
        Xuất bản (học sinh nhìn thấy)
      </label>
      <div className="flex gap-2">
        <Button disabled={pending} onClick={() => start(async () => { const res = await saveMaterialAction(lessonId, material?.id ?? null, v); setR(res); if (res.ok) onDone(); })}>
          {pending ? <Loader2 className="animate-spin" /> : <Save />} {material ? "Lưu thay đổi" : "Thêm học liệu"}
        </Button>
        <Button variant="ghost" onClick={onDone}><X /> Huỷ</Button>
      </div>
      <Msg r={r} />
    </div>
  );
}

function MaterialRow({ lessonId, m, first, last }: { lessonId: string; m: LessonMaterialRow; first: boolean; last: boolean }) {
  const [editing, setEditing] = useState(false);
  const [pending, start] = useTransition();
  const act = (fn: () => Promise<ContentResult>) => start(async () => { const res = await fn(); if (!res.ok) window.alert(res.message); });
  if (editing) return <MaterialForm lessonId={lessonId} material={m} section={m.section} onDone={() => setEditing(false)} />;
  return (
    <div className="flex items-start gap-2 rounded-lg border bg-card px-3 py-2">
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-1.5 font-medium">
          {m.title}
          <Badge variant="secondary">{KIND_LABELS[m.kind as Kind] ?? m.kind}</Badge>
          {!m.is_published && <Badge variant="amber">Bản nháp</Badge>}
        </p>
        {m.body && <p className="line-clamp-2 text-sm whitespace-pre-line text-muted-foreground">{m.body}</p>}
        {m.url && <p className="truncate text-xs text-primary">{m.url}</p>}
      </div>
      <div className="flex shrink-0 items-center">
        <Button size="icon" variant="ghost" className="size-8" aria-label="Lên" disabled={pending || first} onClick={() => act(() => moveMaterialAction(lessonId, m.id, -1))}><ArrowUp /></Button>
        <Button size="icon" variant="ghost" className="size-8" aria-label="Xuống" disabled={pending || last} onClick={() => act(() => moveMaterialAction(lessonId, m.id, 1))}><ArrowDown /></Button>
        <Button size="icon" variant="ghost" className="size-8" aria-label={m.is_published ? "Ẩn với học sinh" : "Xuất bản"} disabled={pending} onClick={() => act(() => saveMaterialAction(lessonId, m.id, { ...toInput(m, m.section), is_published: !m.is_published }))}>
          {m.is_published ? <EyeOff /> : <Eye />}
        </Button>
        <Button size="icon" variant="ghost" className="size-8" aria-label="Sửa" onClick={() => setEditing(true)}><Pencil /></Button>
        <Button size="icon" variant="ghost" className="size-8 text-muted-foreground hover:text-destructive" aria-label="Xoá" disabled={pending} onClick={() => window.confirm(`Xoá học liệu “${m.title}”?`) && act(() => deleteMaterialAction(lessonId, m.id))}>
          {pending ? <Loader2 className="animate-spin" /> : <Trash2 />}
        </Button>
      </div>
    </div>
  );
}

function SectionCard({ lessonId, section, items }: { lessonId: string; section: Section; items: LessonMaterialRow[] }) {
  const [adding, setAdding] = useState(false);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <CardTitle className="text-base">{SECTION_LABELS[section]}</CardTitle>
          <CardDescription>{items.length} học liệu · {items.filter((m) => m.is_published).length} đã xuất bản</CardDescription>
        </div>
        {!adding && <Button size="sm" variant="outline" onClick={() => setAdding(true)}><Plus /> Thêm</Button>}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {items.map((m, i) => <MaterialRow key={m.id} lessonId={lessonId} m={m} first={i === 0} last={i === items.length - 1} />)}
        {!items.length && !adding && <p className="text-sm text-muted-foreground">Chưa có học liệu.</p>}
        {adding && <MaterialForm lessonId={lessonId} material={null} section={section} onDone={() => setAdding(false)} />}
      </CardContent>
    </Card>
  );
}

export function LessonContentEditor({ lessonId, objectives, materials }: { lessonId: string; objectives: LearningObjectiveRow[]; materials: LessonMaterialRow[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <ObjectiveList lessonId={lessonId} kind="objective" title="Mục tiêu bài học" items={objectives.filter((o) => o.kind === "objective")} />
        <ObjectiveList lessonId={lessonId} kind="requirement" title="Yêu cầu cần đạt" items={objectives.filter((o) => o.kind === "requirement")} />
      </div>
      {(Object.keys(SECTION_LABELS) as Section[]).map((s) => (
        <SectionCard key={s} lessonId={lessonId} section={s} items={materials.filter((m) => m.section === s)} />
      ))}
    </div>
  );
}
