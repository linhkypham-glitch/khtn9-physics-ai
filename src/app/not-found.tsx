import Link from "next/link";
import { SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center px-4 text-center">
      <SearchX className="size-12 text-muted-foreground" aria-hidden />
      <h1 className="mt-4 text-2xl font-bold">Không tìm thấy trang</h1>
      <p className="mt-2 text-muted-foreground">Trang bạn tìm không tồn tại hoặc đã được di chuyển.</p>
      <Button asChild className="mt-6"><Link href="/">Về trang chủ</Link></Button>
    </div>
  );
}
