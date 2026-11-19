import type { DatoWidget } from "@/api/dashboard.api";
import { clp, numero } from "./dashboardFormat";

export function ResumenMontos({ fila }: { fila: DatoWidget }) {
  return (
    <article className="relative overflow-hidden rounded-2xl bg-[#162a43] p-6 text-white sm:p-7 lg:col-span-8">
      <div aria-hidden="true" className="absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/10" />
      <div aria-hidden="true" className="absolute -right-5 -top-12 h-44 w-44 rounded-full border border-white/10" />
      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-white">Total de compras</h3>
            <p className="mt-1 text-sm text-blue-100/75">Suma de documentos confirmados</p>
          </div>
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-blue-100">
            {numero(fila.documentos)} documentos
          </span>
        </div>
        <p className="mt-7 text-4xl font-semibold tracking-tight sm:text-5xl">{clp(fila.total)}</p>
        <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-white/15 pt-5">
          {[
            ["Neto", fila.neto],
            ["IVA", fila.iva],
            ["Exento", fila.exento],
          ].map(([nombre, monto]) => (
            <div key={String(nombre)} className="min-w-0">
              <dt className="text-xs text-blue-100/70">{String(nombre)}</dt>
              <dd className="mt-1 truncate text-sm font-semibold text-white sm:text-base">{clp(monto)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

export function PagosPendientes({ fila }: { fila: DatoWidget }) {
  const documentos = numero(fila.documentos);
  return (
    <div className="min-h-[154px] rounded-xl border-l-4 border-amber-500 bg-[#fff5df] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-amber-950">Por pagar</p>
        <span className="rounded-full bg-amber-200/70 px-2.5 py-1 text-xs font-semibold text-amber-950">Pendiente</span>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-[#3b2b13]">{clp(fila.pendiente)}</p>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-amber-300/80 pt-3">
        <p className="text-sm text-amber-950/75">Documentos pendientes</p>
        <p className="text-xl font-bold tabular-nums text-amber-950">{documentos}</p>
      </div>
    </div>
  );
}

export function Ajustes({ filas }: { filas: DatoWidget[] }) {
  const ajustesLinea = filas.filter((fila) => fila.origen === "LINEA");
  const hayGlobales = filas.some((fila) => fila.origen === "GLOBAL");
  if (!filas.length) return <p className="py-8 text-center text-sm text-slate-500">No hay descuentos ni recargos registrados.</p>;
  return (
    <>
      {ajustesLinea.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {ajustesLinea.map((fila, indice) => (
            <div
              key={`${String(fila.tipo)}-${indice}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base font-bold ${
                    fila.tipo === "DESCUENTO" ? "bg-teal-100 text-teal-800" : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {fila.tipo === "DESCUENTO" ? "−" : "+"}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{String(fila.tipo ?? "Ajuste")}</p>
                  <p className="mt-0.5 text-xs text-slate-500">Por línea · {numero(fila.registros)} registros</p>
                </div>
              </div>
              <span className="shrink-0 text-sm font-bold tabular-nums text-slate-900">{clp(fila.total)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-4 text-center text-sm text-slate-500">No hay ajustes por línea.</p>
      )}
      {hayGlobales && (
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
          Los ajustes globales no se muestran porque el origen aún no distingue porcentajes de montos.
        </p>
      )}
    </>
  );
}
