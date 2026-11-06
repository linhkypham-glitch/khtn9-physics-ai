import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { getSupabasePublicEnv } from "./env";

const PROTECTED_PREFIXES = ["/student", "/teacher", "/admin"];

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Làm mới phiên Supabase trên mỗi request và chặn truy cập khu vực cần đăng nhập.
 * Kiểm tra VAI TRÒ chi tiết được thực hiện ở layout phía máy chủ + RLS trong database.
 */
export async function updateSession(request: NextRequest) {
  const env = getSupabasePublicEnv();
  const { pathname } = request.nextUrl;

  if (!env) {
    if (isProtected(pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/setup";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // Không chèn logic giữa createServerClient và getClaims (khuyến nghị của Supabase).
  let userId: string | null = null;
  try {
    const { data } = await supabase.auth.getClaims();
    userId = (data?.claims?.sub as string | undefined) ?? null;
  } catch {
    userId = null;
  }

  // Học sinh vào bằng họ tên + lớp: có cookie phiên học sinh (xác minh chữ ký ở layout).
  const isStudentArea = pathname === "/student" || pathname.startsWith("/student/");
  const hasStudentCookie = Boolean(request.cookies.get("khtn9_hs")?.value);

  if (!userId && isProtected(pathname) && !(isStudentArea && hasStudentCookie)) {
    const url = request.nextUrl.clone();
    if (isStudentArea) {
      url.pathname = "/vao-hoc";
      url.search = "";
      return NextResponse.redirect(url);
    }
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  return response;
}
