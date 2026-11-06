import type { ReactNode } from "react";

/** Banner chào mừng có gradient cho các trang tổng quan. */
export function WelcomeBanner({ title, subtitle, children }: { title: string; subtitle?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 px-6 py-7 text-white shadow-lg shadow-orange-500/25 sm:px-8">
      <div aria-hidden className="absolute -top-20 -right-10 size-64 rounded-full bg-white/10" />
      <div aria-hidden className="absolute -bottom-24 right-40 size-48 rounded-full bg-white/10" />
      <svg aria-hidden viewBox="0 0 200 200" className="absolute top-1/2 right-6 hidden size-36 -translate-y-1/2 text-white/25 md:block">
        <ellipse cx="100" cy="100" rx="90" ry="34" fill="none" stroke="currentColor" strokeWidth="6" />
        <ellipse cx="100" cy="100" rx="90" ry="34" fill="none" stroke="currentColor" strokeWidth="6" transform="rotate(60 100 100)" />
        <ellipse cx="100" cy="100" rx="90" ry="34" fill="none" stroke="currentColor" strokeWidth="6" transform="rotate(120 100 100)" />
        <circle cx="100" cy="100" r="14" fill="currentColor" />
      </svg>
      <div className="relative max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1.5 text-orange-50">{subtitle}</p>}
        {children && <div className="mt-4 flex flex-wrap gap-2">{children}</div>}
      </div>
    </section>
  );
}
