"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type LessonsPerChapterDatum = { chapter: string; title: string; lessons: number };

/** Biểu đồ cột (một chuỗi): số bài học trong mỗi chương – dữ liệu lấy từ database. */
export function LessonsPerChapterChart({ data }: { data: LessonsPerChapterDatum[] }) {
  return (
    <div className="h-64 w-full" role="img" aria-label="Biểu đồ số bài học theo chương">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="chapter" tickLine={false} axisLine={false} tick={{ fill: "#475569", fontSize: 12 }} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
          <Tooltip
            cursor={{ fill: "rgba(234, 88, 12, 0.08)" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as LessonsPerChapterDatum;
              return (
                <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-md">
                  <p className="font-medium">Chương {d.chapter}. {d.title}</p>
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground tabular-nums">{d.lessons}</span> bài học
                  </p>
                </div>
              );
            }}
          />
          <Bar dataKey="lessons" name="Số bài học" fill="#ea580c" radius={[4, 4, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
