import type { NextConfig } from "next";

/**
 * Cache Components được tắt có chủ đích: gần như mọi trang của ứng dụng
 * phụ thuộc vào phiên đăng nhập và dữ liệu được bảo vệ bởi RLS, nên dùng
 * mô hình render động truyền thống sẽ đơn giản và an toàn hơn.
 */
const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
