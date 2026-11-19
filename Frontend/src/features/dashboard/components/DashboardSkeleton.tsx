import type { ReactNode } from "react";

function SkeletonPanel({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <article className={`min-w-0 animate-pulse rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 ${className}`}>
      <div className="mb-5 space-y-2">
        <div className="h-4 w-40 rounded bg-slate-200" />
        <div className="h-3 w-56 max-w-full rounded bg-slate-100" />
      </div>
      {children}
    </article>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-8 lg:grid-cols-12" aria-busy="true" role="status">
      <span className="sr-only">Cargando los indicadores del dashboard…</span>

      <div className="animate-pulse rounded-2xl bg-slate-200 p-6 sm:p-7 lg:col-span-8" aria-hidden="true">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-2">
            <div className="h-5 w-36 rounded bg-white/60" />
            <div className="h-3 w-52 rounded bg-white/40" />
          </div>
          <div className="h-6 w-24 rounded-full bg-white/40" />
        </div>
        <div className="mt-7 h-12 w-64 max-w-full rounded bg-white/60" />
        <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/40 pt-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-3 w-20 rounded bg-white/40" />
              <div className="h-4 w-24 rounded bg-white/60" />
            </div>
          ))}
        </div>
      </div>

      <SkeletonPanel className="lg:col-span-4">
        <div className="h-4 w-24 rounded bg-slate-200" />
        <div className="mt-4 h-9 w-32 rounded bg-slate-200" />
        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
          <div className="h-3 w-32 rounded bg-slate-100" />
          <div className="h-5 w-10 rounded bg-slate-100" />
        </div>
      </SkeletonPanel>

      <SkeletonPanel className="lg:col-span-12">
        <div className="h-64 rounded-xl bg-slate-50" />
      </SkeletonPanel>

      <SkeletonPanel className="lg:col-span-6">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="h-3 w-40 rounded bg-slate-100" />
                <div className="h-3 w-16 rounded bg-slate-100" />
              </div>
              <div className="h-2 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </SkeletonPanel>

      <SkeletonPanel className="lg:col-span-6">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div className="h-3 w-40 rounded bg-slate-100" />
                <div className="h-3 w-16 rounded bg-slate-100" />
              </div>
              <div className="h-2 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </SkeletonPanel>

      <SkeletonPanel className="lg:col-span-12">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-16 rounded-xl bg-slate-50" />
          ))}
        </div>
      </SkeletonPanel>
    </div>
  );
}
