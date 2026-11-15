"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/api/api-error";
import { consultarMetrica, metricas, type DatoWidget, type Metrica } from "@/api/dashboard.api";

const INDICADORES: { metrica: Metrica; titulo: string }[] = [
  { metrica: "resumen_montos", titulo: "Resumen de montos" },
  { metrica: "pagos_pendientes", titulo: "Pagos pendientes" },
  { metrica: "compras_por_periodo", titulo: "Compras por mes" },
  { metrica: "compras_por_proveedor", titulo: "Compras por proveedor" },
  { metrica: "compras_por_producto", titulo: "Compras por producto" },
  { metrica: "descuentos_recargos", titulo: "Descuentos y recargos" },
];

type PanelMetrica = {
  metrica: Metrica;
  datos: DatoWidget[];
  actualizadoEn?: string;
  error?: string;
};

const errorMessage = (error: unknown) =>
  error instanceof ApiError ? error.message : "No fue posible cargar este gráfico.";

const numero = (valor: unknown) => {
  const n = Number(valor);
  return Number.isFinite(n) ? n : 0;
};

const clp = (valor: unknown) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(numero(valor));

const clpCompacto = (valor: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(valor);

function Panel({
  titulo,
  descripcion,
  className = "",
  children,
}: {
  titulo: string;
  descripcion: string;
  className?: string;
  children: React.ReactNode;
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

function ResumenMontos({ fila }: { fila: DatoWidget }) {
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

function TendenciaMensual({ filas }: { filas: DatoWidget[] }) {
  const periodos = filas.slice(-12);
  if (!periodos.length) return <p className="py-8 text-center text-sm text-slate-500">Aún no hay compras por periodo.</p>;

  const ancho = 720;
  const alto = 250;
  const margen = { arriba: 14, derecha: 12, abajo: 38, izquierda: 58 };
  const anchoGrafico = ancho - margen.izquierda - margen.derecha;
  const altoGrafico = alto - margen.arriba - margen.abajo;
  const maximo = Math.max(...periodos.map((fila) => numero(fila.total)), 1) * 1.18;
  const espacio = anchoGrafico / periodos.length;
  const anchoBarra = Math.min(34, espacio * 0.56);
  const niveles = [0, 0.5, 1];

  return (
    <div className="overflow-x-auto">
      <figure className="min-w-[640px] rounded-xl bg-white px-3 pb-1 pt-4">
        <svg
          viewBox={`0 0 ${ancho} ${alto}`}
          role="img"
          aria-label={`Compras mensuales de los últimos ${periodos.length} periodos`}
          className="h-auto w-full overflow-visible"
        >
          <desc>Gráfico de barras verticales con el total confirmado por mes de emisión.</desc>
          {niveles.map((nivel) => {
            const y = margen.arriba + altoGrafico * (1 - nivel);
            return (
              <g key={nivel}>
                <line
                  x1={margen.izquierda}
                  x2={ancho - margen.derecha}
                  y1={y}
                  y2={y}
                  stroke={nivel === 0 ? "#c8d5e5" : "#e3eaf4"}
                  strokeDasharray={nivel === 0 ? undefined : "3 5"}
                />
                <text x={margen.izquierda - 8} y={y + 4} textAnchor="end" fill="#64748b" fontSize="12">
                  {clpCompacto(maximo * nivel)}
                </text>
              </g>
            );
          })}
          {periodos.map((fila, index) => {
            const valor = numero(fila.total);
            const barraAlto = (valor / maximo) * altoGrafico;
            const x = margen.izquierda + index * espacio + (espacio - anchoBarra) / 2;
            const y = margen.arriba + altoGrafico - barraAlto;
            const periodo = String(fila.periodo ?? "");
            const fecha = new Date(`${periodo}-01T12:00:00`);
            const mes = Number.isNaN(fecha.getTime())
              ? periodo
              : new Intl.DateTimeFormat("es-CL", { month: "short", year: "2-digit" }).format(fecha);
            return (
              <g key={periodo}>
                <rect
                  x={x}
                  y={y}
                  width={anchoBarra}
                  height={Math.max(barraAlto, 2)}
                  rx="5"
                  fill={index === periodos.length - 1 ? "#0f766e" : "#416fc0"}
                >
                  <title>{`${mes}: ${clp(valor)} · ${numero(fila.documentos)} documentos`}</title>
                </rect>
                {periodos.length <= 6 && (
                  <text
                    x={x + anchoBarra / 2}
                    y={Math.max(y - 8, margen.arriba + 10)}
                    textAnchor="middle"
                    fill="#233b5c"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {clpCompacto(valor)}
                  </text>
                )}
                <text
                  x={x + anchoBarra / 2}
                  y={alto - 13}
                  textAnchor="middle"
                  fill="#526780"
                  fontSize="12"
                >
                  {mes}
                </text>
              </g>
            );
          })}
        </svg>
      </figure>
      <p className="mt-2 text-right text-xs text-slate-500">Últimos {periodos.length} periodos con compras</p>
    </div>
  );
}

function Ranking({
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
  const paleta = color === "teal"
    ? { first: "bg-teal-100 text-teal-800", bar: "bg-teal-700", rest: "bg-teal-500" }
    : { first: "bg-indigo-100 text-indigo-800", bar: "bg-indigo-700", rest: "bg-indigo-500" };

  return (
    <ol className="space-y-4">
      {filas.slice(0, 7).map((fila, indice) => {
        const nombre = String(fila[etiqueta] ?? "Sin identificar");
        const monto = numero(fila[valor]);
        return (
          <li key={`${nombre}-${indice}`} title={nombre} className="rounded-lg px-2 py-1 transition-colors hover:bg-white/80">
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
                className={`h-full rounded-full ${indice === 0 ? paleta.bar : paleta.rest}`}
                style={{ width: `${Math.max((monto / maximo) * 100, 1)}%` }}
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function PagosPendientes({ fila }: { fila: DatoWidget }) {
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

function Ajustes({ filas }: { filas: DatoWidget[] }) {
  const ajustesLinea = filas.filter((fila) => fila.origen === "LINEA");
  const hayGlobales = filas.some((fila) => fila.origen === "GLOBAL");
  if (!filas.length) return <p className="py-8 text-center text-sm text-slate-500">No hay descuentos ni recargos registrados.</p>;
  return (
    <>
      {ajustesLinea.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {ajustesLinea.map((fila, indice) => (
            <div key={`${String(fila.tipo)}-${indice}`} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base font-bold ${fila.tipo === "DESCUENTO" ? "bg-teal-100 text-teal-800" : "bg-orange-100 text-orange-800"}`}>
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

function Contenido({ metrica, datos }: { metrica: Metrica; datos: DatoWidget[] }) {
  const [fila] = datos;

  switch (metrica) {
    case "resumen_montos":
      return fila ? <ResumenMontos fila={fila} /> : <Panel titulo="Total de compras" descripcion="Documentos confirmados"><p className="py-6 text-sm text-slate-500">Sin documentos confirmados.</p></Panel>;
    case "compras_por_periodo":
      return (
        <Panel titulo="Compras por mes" descripcion="Evolución según fecha de emisión" className="border-blue-200 bg-[#f7f9fe] lg:col-span-12">
          <TendenciaMensual filas={datos} />
        </Panel>
      );
    case "compras_por_proveedor":
      return (
        <Panel titulo="Principales proveedores" descripcion="Ordenados por total de compras" className="border-teal-200 bg-[#f5fbf9] lg:col-span-6">
          <Ranking filas={datos} etiqueta="proveedor" valor="total" color="teal" />
        </Panel>
      );
    case "compras_por_producto":
      return (
        <Panel titulo="Productos y servicios" descripcion="Líneas con mayor total" className="border-indigo-200 bg-[#f7f8ff] lg:col-span-6">
          <Ranking filas={datos} etiqueta="producto" valor="total" color="indigo" />
        </Panel>
      );
    case "pagos_pendientes":
      return (
        <Panel titulo="Pagos pendientes" descripcion="Compromisos marcados como pendientes" className="border-amber-300 bg-[#fffdf7] lg:col-span-4">
          <PagosPendientes fila={fila ?? { pendiente: "0", documentos: 0 }} />
        </Panel>
      );
    case "descuentos_recargos":
      return (
        <Panel titulo="Descuentos y recargos" descripcion="Montos registrados por tipo y origen" className="border-slate-300 bg-[#f8fafc] lg:col-span-12">
          <Ajustes filas={datos} />
        </Panel>
      );
  }
}

export function DashboardPanel({ idNotebook }: { idNotebook: string }) {
  const [paneles, setPaneles] = useState<PanelMetrica[]>([]);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(false);

  const cargar = useCallback(async () => {
    setActualizando(true);
    setLoading(true);
    setPaneles([]);
    const resultados = await Promise.all(
      metricas.map(async (metrica): Promise<PanelMetrica> => {
        try {
          const resultado = await consultarMetrica(idNotebook, metrica);
          return { metrica, datos: resultado.datos, actualizadoEn: resultado.actualizadoEn };
        } catch (error) {
          return { metrica, datos: [], error: errorMessage(error) };
        }
      }),
    );
    setPaneles(resultados);
    setLoading(false);
    setActualizando(false);
  }, [idNotebook]);

  useEffect(() => {
    const timer = window.setTimeout(() => void cargar(), 0);
    return () => window.clearTimeout(timer);
  }, [cargar]);

  const ultimaActualizacion = paneles
    .map((panel) => panel.actualizadoEn)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);

  return (
    <section className="mt-6" aria-label="Dashboard del notebook">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-[#162a43]">Resumen del notebook</h2>
          <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-600">
            Compras confirmadas, proveedores y pagos pendientes en un solo vistazo.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {ultimaActualizacion && !loading && (
            <span className="hidden text-xs tabular-nums text-slate-400 sm:inline">
              Actualizado {new Date(ultimaActualizacion).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <button
            type="button"
            onClick={() => void cargar()}
            disabled={actualizando}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
          >
            {actualizando ? "Actualizando…" : "Actualizar"}
          </button>
        </div>
      </header>

      {loading && (
        <p aria-live="polite" className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
          Cargando los indicadores…
        </p>
      )}

      {!loading && (
        <div className="grid grid-cols-1 gap-x-5 gap-y-8 lg:grid-cols-12">
          {INDICADORES.map(({ metrica, titulo }) => {
            const panel = paneles.find((item) => item.metrica === metrica);
            if (metrica === "resumen_montos" && panel && !panel.error) {
              return <Contenido key={metrica} metrica={metrica} datos={panel.datos} />;
            }
            if (panel?.error) {
              return (
                <Panel key={metrica} titulo={titulo} descripcion="No se pudo actualizar este indicador">
                  <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{panel.error}</p>
                </Panel>
              );
            }
            if (panel) return <Contenido key={metrica} metrica={metrica} datos={panel.datos} />;
            return (
              <Panel key={metrica} titulo={titulo} descripcion="Documentos confirmados">
                <p className="text-sm text-slate-500">No fue posible cargar este indicador.</p>
              </Panel>
            );
          })}
        </div>
      )}
    </section>
  );
}
