export function NotebookDetailSkeleton() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6" aria-busy="true" role="status">
      <span className="sr-only">Cargando notebook…</span>
      <div className="animate-pulse" aria-hidden="true">
        <div className="h-9 w-40 rounded-lg bg-slate-200" />

        <div className="mt-5 rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-slate-200" />
              <div className="space-y-2">
                <div className="h-6 w-48 rounded bg-slate-200 sm:w-64" />
                <div className="h-4 w-64 rounded bg-slate-100 sm:w-80" />
              </div>
            </div>
            <div className="h-8 w-8 rounded-lg bg-slate-100" />
          </div>
        </div>

        <div className="mt-8 flex gap-2 border-b-2 border-slate-200 pb-0.5">
          <div className="h-9 w-32 rounded-t-lg bg-slate-200" />
          <div className="h-9 w-32 rounded-t-lg bg-slate-100" />
          <div className="h-9 w-32 rounded-t-lg bg-slate-100" />
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-6 w-56 rounded bg-slate-200" />
            <div className="mt-2 h-4 w-80 max-w-full rounded bg-slate-100" />
            <div className="mt-5 h-32 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50" />
          </div>

          <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-5 w-40 rounded bg-slate-200" />
            <div className="mt-4 space-y-3">
              <div className="h-12 rounded-lg bg-slate-100" />
              <div className="h-12 rounded-lg bg-slate-100" />
              <div className="h-12 rounded-lg bg-slate-50" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
