import type { ReactNode } from "react";

export function Panel({
  titulo,
  descripcion,
  className = "",
  children,
}: {
  titulo: string;
  descripcion: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article className={`min-w-0 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 ${className}`}>
      <header className="mb-5">
        <h3 className="text-base font-bold tracking-tight text-slate-900">{titulo}</h3>
        <p className="mt-1 text-sm text-slate-500">{descripcion}</p>
      </header>
      {children}
    </article>
  );
}
