import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";

import "@/styles/globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "KHTN 9 – Kết nối tri thức", template: "%s · KHTN 9" },
  description:
    "Nền tảng học tập, thí nghiệm mô phỏng, luyện tập và đánh giá môn KHTN 9 (Vật lý, Hoá học).",
};

export const viewport: Viewport = { themeColor: "#ea580c" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={beVietnam.variable}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
