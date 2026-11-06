import Link from "next/link";
import { Info } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { CurriculumSource } from "../types";

/** Ghi rõ nguồn dữ liệu khi chưa kết nối database (không giả lập kết nối). */
export function CurriculumSourceNotice({ source }: { source: CurriculumSource }) {
  if (source === "database") return null;
  return (
    <Alert variant="warning" className="mb-4">
      <Info />
      <AlertTitle>Chưa kết nối database</AlertTitle>
      <AlertDescription>
        <p>
          Mục lục bên dưới là danh mục chuẩn trong mã nguồn. Hãy cấu hình Supabase để dữ liệu được đọc từ database.{" "}
          <Link href="/setup" className="font-medium underline">Xem hướng dẫn cấu hình</Link>
        </p>
      </AlertDescription>
    </Alert>
  );
}
