/** Thời điểm hiện tại (ms). Dùng trong Server Component – mỗi request render một lần. */
export function requestTime(): number {
  return Date.now();
}
