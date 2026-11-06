import { notFound } from "next/navigation";

import { ErrorState } from "@/components/dashboard/states";
import { getCurrentUser } from "@/lib/auth/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { loadPublicLessonQuestions } from "@/modules/question-bank/repository";
import { experimentForLesson } from "@/modules/virtual-lab/catalog";
import { getLessonBySlug } from "../repository";
import { LessonView, type LessonResults } from "./lesson-view";

async function loadResults(userId: string, lessonId: string, experimentKey: string | null): Promise<LessonResults> {
  const admin = createSupabaseAdminClient();
  if (!admin) return { attempts: [], experimentRuns: 0 };
  const [attempts, exp] = await Promise.all([
    admin
      .from("practice_attempts")
      .select("id, score, correct_units, total_units, duration_seconds, submitted_at")
      .eq("user_id", userId)
      .eq("lesson_id", lessonId)
      .eq("mode", "self_assessment")
      .order("submitted_at", { ascending: false })
      .limit(20),
    experimentKey
      ? admin.from("experiments").select("id, experiment_attempts(count)").eq("key", experimentKey).eq("experiment_attempts.user_id", userId).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  const runs = (exp.data as { experiment_attempts?: { count: number }[] } | null)?.experiment_attempts?.[0]?.count ?? 0;
  return {
    attempts: (attempts.data ?? []).map((a) => ({
      id: a.id,
      score: Number(a.score),
      correctUnits: a.correct_units,
      totalUnits: a.total_units,
      durationSeconds: a.duration_seconds,
      submittedAt: a.submitted_at,
    })),
    experimentRuns: runs,
  };
}

export async function LessonPage({ slug, basePath, viewer }: { slug: string; basePath: string; viewer: "student" | "staff" }) {
  const result = await getLessonBySlug(slug);
  if (!result.ok) {
    if (result.reason === "not_found") notFound();
    return (
      <ErrorState
        title="Không tải được bài học"
        description={result.reason === "not_configured" ? "Supabase chưa được cấu hình." : "Vui lòng thử lại sau."}
      />
    );
  }
  const lesson = result.lesson;
  const experiment = experimentForLesson(lesson.number);
  const [user, questions] = await Promise.all([getCurrentUser(), loadPublicLessonQuestions(lesson.id)]);
  const results = user ? await loadResults(user.id, lesson.id, experiment?.key ?? null) : null;

  return (
    <LessonView
      lesson={lesson}
      basePath={basePath}
      viewer={viewer}
      experiment={experiment}
      questions={questions}
      canSave={Boolean(user)}
      results={results}
    />
  );
}
