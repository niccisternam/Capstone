import type { DatoWidget } from "@/api/dashboard.api";
import { clp, numero } from "./dashboardFormat";

export function Ranking({
  filas,
  etiqueta,
  valor,
  color,
}: {
  filas: DatoWidget[];
  etiqueta: string;
  valor: string;
  color: "teal" | "indigo";
}) {
  if (!filas.length) return <p className="py-8 text-center text-sm text-slate-500">Aún no hay datos para comparar.</p>;
  const maximo = Math.max(...filas.map((fila) => numero(fila[valor])), 1);
  const paleta =
    color === "teal"
      ? { first: "bg-teal-100 text-teal-800", bar: "bg-teal-700", rest: "bg-teal-500" }
      : { first: "bg-indigo-100 text-indigo-800", bar: "bg-indigo-700", rest: "bg-indigo-500" };

  return (
    <ol className="space-y-4">
      {filas.slice(0, 7).map((fila, indice) => {
        const nombre = String(fila[etiqueta] ?? "Sin identificar");
        const monto = numero(fila[valor]);
        return (
          <li
            key={`${nombre}-${indice}`}
            title={nombre}
            className="rounded-lg px-2 py-1 transition-colors hover:bg-white/80"
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
                  indice === 0 ? paleta.first : "bg-white text-slate-500"
                }`}
              >
                {indice + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">{nombre}</span>
              <span className="shrink-0 text-sm font-bold tabular-nums text-slate-900">{clp(monto)}</span>
            </div>
            <div className="ml-9 mt-2 h-2 overflow-hidden rounded-full bg-white">
              <div
                className={`dashboard-meter h-full rounded-full ${indice === 0 ? paleta.bar : paleta.rest}`}
                style={{ width: `${Math.max((monto / maximo) * 100, 1)}%`, animationDelay: `${indice * 55}ms` }}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
