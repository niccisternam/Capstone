export function DocumentReviewSkeleton() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6" aria-busy="true" role="status">
      <span className="sr-only">Cargando documento para revisión…</span>
      <div className="animate-pulse" aria-hidden="true">
        <div className="h-5 w-36 rounded bg-slate-200" />
        <div className="mt-4 h-8 w-72 max-w-full rounded bg-slate-200" />
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <div className="h-4 w-56 rounded bg-slate-100" />
          <div className="h-6 w-44 rounded-full bg-slate-100" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(20rem,0.9fr)_minmax(30rem,1.1fr)]">
          <section className="flex min-h-[28rem] flex-col rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:h-[calc(100vh-8rem)] lg:min-h-[38rem]">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="space-y-2">
                <div className="h-5 w-36 rounded bg-slate-200" />
                <div className="h-3 w-44 rounded bg-slate-100" />
              </div>
              <div className="h-6 w-32 rounded-full bg-slate-100" />
            </div>
            <div className="mt-3 flex-1 rounded-lg bg-slate-100" />
          </section>

          <div className="space-y-6">
            <div className="h-20 rounded-xl border border-amber-200 bg-amber-50" />

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="h-6 w-56 rounded bg-slate-200" />
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="h-3 w-24 rounded bg-slate-100" />
                    <div className="h-10 rounded-lg bg-slate-50" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="h-6 w-44 rounded bg-slate-200" />
              <div className="mt-5 space-y-3">
                <div className="h-9 rounded-lg bg-slate-100" />
                <div className="h-11 rounded-lg bg-slate-50" />
                <div className="h-11 rounded-lg bg-slate-50" />
                <div className="h-11 rounded-lg bg-slate-50" />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="h-6 w-48 rounded bg-slate-200" />
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="h-10 rounded-lg bg-slate-50" />
                <div className="h-10 rounded-lg bg-slate-50" />
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="ml-auto h-5 w-40 rounded bg-slate-200" />
              <div className="mt-4 ml-auto h-7 w-32 rounded bg-slate-200" />
              <div className="mt-6 flex flex-wrap justify-end gap-3">
                <div className="h-10 w-28 rounded-lg bg-slate-100" />
                <div className="h-10 w-40 rounded-lg bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
