function ReviewSectionSkeleton() {
  return (
    <section className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <div className="h-3 w-24 rounded bg-slate-200" />
          <div className="h-5 w-64 max-w-full rounded bg-slate-200" />
        </div>
        <div className="h-6 w-40 rounded-full bg-slate-200" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(20rem,0.9fr)_minmax(30rem,1.1fr)]">
        <div className="min-h-[28rem] rounded-2xl border-2 border-slate-200 bg-white p-4 lg:min-h-[38rem]">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="h-5 w-36 rounded bg-slate-200" />
            <div className="h-6 w-32 rounded-full bg-slate-100" />
          </div>
          <div className="mt-3 h-[calc(100%-3.5rem)] rounded-lg bg-slate-100" />
        </div>
        <div className="space-y-6">
          <div className="h-20 rounded-xl border border-amber-200 bg-amber-50" />
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="h-6 w-56 rounded bg-slate-200" />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="h-3 w-24 rounded bg-slate-100" />
                  <div className="h-10 rounded-lg bg-slate-50" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="h-6 w-44 rounded bg-slate-200" />
            <div className="mt-5 space-y-3">
              <div className="h-11 rounded-lg bg-slate-50" />
              <div className="h-11 rounded-lg bg-slate-50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BatchReviewSkeleton() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6" aria-busy="true" role="status">
      <span className="sr-only">Cargando documentos para revisión…</span>
      <div className="animate-pulse" aria-hidden="true">
        <div className="h-5 w-36 rounded bg-slate-200" />
        <div className="mt-4 h-8 w-80 max-w-full rounded bg-slate-200" />
        <div className="mt-2 h-4 w-96 max-w-full rounded bg-slate-100" />

        <section className="mt-6 rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm">
          <div className="h-9 rounded bg-slate-50" />
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 border-b border-slate-100 py-3 last:border-0">
              <div className="h-4 flex-1 rounded bg-slate-100" />
              <div className="h-6 w-40 rounded-full bg-slate-100" />
              <div className="h-4 w-24 rounded bg-slate-100" />
            </div>
          ))}
        </section>

        <div className="mt-8 space-y-10">
          <ReviewSectionSkeleton />
          <ReviewSectionSkeleton />
        </div>
      </div>
    </main>
  );
}
