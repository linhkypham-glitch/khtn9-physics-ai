"use client";

import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center px-4 text-center">
      <TriangleAlert className="size-12 text-destructive" aria-hidden />
      <h1 className="mt-4 text-2xl font-bold">Đã xảy ra lỗi</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Hệ thống gặp sự cố khi tải trang. Vui lòng thử lại. {error.digest && <span className="block text-xs">Mã lỗi: {error.digest}</span>}
      </p>
      <Button onClick={reset} className="mt-6"><RotateCcw /> Thử lại</Button>
    </div>
  );
}
