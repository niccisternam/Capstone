export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-1 sm:gap-2">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(Math.max(1, page - 1))}
        className="rounded border border-slate-400 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40"
      >
        &lt; Previous
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
        <button
          key={number}
          type="button"
          onClick={() => onChange(number)}
          className={`rounded border px-3 py-1 text-xs font-semibold transition-colors ${
            page === number
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-slate-400 bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          {number}
        </button>
      ))}

      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        className="rounded border border-slate-400 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40"
      >
        Next &gt;
      </button>
    </div>
  );
}
