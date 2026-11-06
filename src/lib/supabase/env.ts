/**
 * Đọc cấu hình Supabase từ biến môi trường.
 * Chỉ URL và khóa công khai (publishable/anon) được phép xuất hiện ở trình duyệt.
 * Ứng dụng vẫn khởi chạy khi chưa cấu hình: các trang sẽ hiển thị hướng dẫn thiết lập.
 */
export type SupabasePublicEnv = { url: string; publishableKey: string };

export function getSupabasePublicEnv(): SupabasePublicEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  // Ưu tiên khóa publishable mới; dùng anon key (JWT cũ) nếu khóa publishable để trống.
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !publishableKey) return null;
  if (!/^https?:\/\//.test(url)) return null;
  return { url, publishableKey };
}

export function isSupabaseConfigured(): boolean {
  return getSupabasePublicEnv() !== null;
}
