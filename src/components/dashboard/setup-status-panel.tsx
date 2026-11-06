import { CheckCircle2, CircleAlert, XCircle } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { aiKeyEnvName } from "@/lib/ai/config";
import type { SetupStatus } from "@/lib/setup-status";

type Level = "ok" | "warn" | "error";

function Row({ level, title, children }: { level: Level; title: string; children: ReactNode }) {
  const Icon = level === "ok" ? CheckCircle2 : level === "warn" ? CircleAlert : XCircle;
  const color = level === "ok" ? "text-success" : level === "warn" ? "text-amber" : "text-destructive";
  return (
    <li className="flex gap-3 py-3">
      <Icon className={`mt-0.5 size-5 shrink-0 ${color}`} aria-hidden />
      <div className="min-w-0">
        <p className="font-medium">
          {title}{" "}
          <span className="sr-only">{level === "ok" ? "(đã sẵn sàng)" : level === "warn" ? "(cảnh báo)" : "(chưa sẵn sàng)"}</span>
        </p>
        <div className="text-sm text-muted-foreground">{children}</div>
      </div>
    </li>
  );
}

/** Bảng trạng thái cấu hình thực tế – chỉ hiển thị trạng thái, không hiển thị giá trị bí mật. */
export function SetupStatusPanel({ status }: { status: SetupStatus }) {
  const { database: db } = status;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trạng thái cấu hình</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          <Row level={status.supabaseEnv ? "ok" : "error"} title="Biến môi trường Supabase">
            {status.supabaseEnv ? (
              "Đã có NEXT_PUBLIC_SUPABASE_URL và khóa publishable/anon."
            ) : (
              <>Thiếu <code>NEXT_PUBLIC_SUPABASE_URL</code> hoặc <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>.</>
            )}
          </Row>
          <Row
            level={!status.supabaseEnv ? "error" : db.reachable ? (db.lessons > 0 ? "ok" : "warn") : "error"}
            title="Kết nối database & dữ liệu chương trình học"
          >
            {!status.supabaseEnv
              ? "Chưa kiểm tra được vì thiếu cấu hình Supabase."
              : db.reachable
                ? db.lessons > 0
                  ? `Kết nối thành công: ${db.chapters} chương, ${db.lessons} bài học.`
                  : "Kết nối thành công nhưng chưa có dữ liệu. Hãy chạy migration và seed chương trình học."
                : `Không truy vấn được database${db.error ? `: ${db.error}` : ""}. Kiểm tra URL/khóa và migration.`}
          </Row>
          <Row level={status.m2.ready ? "ok" : "error"} title="Câu hỏi, thí nghiệm, lớp học (cập nhật Milestone 2)">
            {status.m2.ready
              ? `Đã cập nhật: ${status.m2.questions} câu hỏi, ${status.m2.experiments} thí nghiệm.`
              : "Chưa cập nhật database. Chạy file supabase/cloud-update-m2.sql trong Supabase → SQL Editor."}
          </Row>
          <Row level={status.serviceRole ? "ok" : "error"} title="Khóa service-role (chỉ phía máy chủ)">
            {status.serviceRole
              ? "Đã cấu hình. Dùng cho học sinh vào học bằng họ tên, chấm bài và quản lý lớp."
              : "Chưa cấu hình SUPABASE_SECRET_KEY – học sinh chưa vào học được, chưa chấm bài được."}
          </Row>
          <Row level={status.ai.configured ? "ok" : "warn"} title="Dịch vụ AI">
            {status.ai.configured ? (
              `Đã cấu hình nhà cung cấp: ${status.ai.provider}${status.ai.model ? ` (${status.ai.model})` : ""}.`
            ) : (
              <>
                Chức năng AI chưa được cấu hình – các chức năng khác vẫn hoạt động bình thường. {status.ai.reason}
                {status.ai.provider && <> Cần đặt <code>{aiKeyEnvName(status.ai.provider)}</code>.</>}
              </>
            )}
          </Row>
        </ul>
      </CardContent>
    </Card>
  );
}
