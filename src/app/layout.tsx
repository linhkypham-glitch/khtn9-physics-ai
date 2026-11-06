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
  title: { default: "KHTN 9 – PHYSICS AI", template: "%s · PHYSICS AI" },
  description:
    "Nền tảng học tập, thí nghiệm mô phỏng, luyện tập và đánh giá môn KHTN 9 – phân môn Vật lý.",
};

export const viewport: Viewport = { themeColor: "#2563eb" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={beVietnam.variable}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}
