"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ApiError } from "@/api/api-error";
import { consultarMetrica, metricas, type DatoWidget, type Metrica } from "@/api/dashboard.api";
import { resolverPeriodo, validarRango, type FiltrosPeriodo } from "../periodos";
import { DashboardFilters } from "./DashboardFilters";
import { MetricContent } from "./MetricContent";
import { Panel } from "./Panel";
import { DashboardSkeleton } from "./DashboardSkeleton";

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

export function DashboardPanel({ idNotebook }: { idNotebook: string }) {
  const [periodo, setPeriodo] = useState<FiltrosPeriodo>({ tipo: "todo" });
  const [mesesDisponibles, setMesesDisponibles] = useState<string[]>([]);
  const [paneles, setPaneles] = useState<PanelMetrica[]>([]);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const solicitudRef = useRef(0);

  const rango = useMemo(() => resolverPeriodo(periodo), [periodo]);
  const errorRango = periodo.tipo === "rango" ? validarRango(periodo.desde, periodo.hasta) : null;
  const desde = rango?.desde;
  const hasta = rango?.hasta;

  const cargar = useCallback(async () => {
    if (errorRango) return;

    const solicitud = ++solicitudRef.current;
    setActualizando(true);
    setLoading(true);
    setPaneles([]);

    const filtros = desde && hasta
      ? { direccion: "COMPRA" as const, desde, hasta }
      : { direccion: "COMPRA" as const };

    const disponibilidadPromise = consultarMetrica(idNotebook, "compras_por_periodo", {
      direccion: "COMPRA",
    }).catch(() => null);

    const [resultados, disponibilidad] = await Promise.all([
      Promise.all(
        metricas.map(async (metrica): Promise<PanelMetrica> => {
          try {
            const resultado = metrica === "compras_por_periodo" && !desde && !hasta
              ? await disponibilidadPromise
              : await consultarMetrica(idNotebook, metrica, filtros);
            if (!resultado) throw new Error("No fue posible cargar los meses disponibles.");
            return { metrica, datos: resultado.datos, actualizadoEn: resultado.actualizadoEn };
          } catch (error) {
            return { metrica, datos: [], error: errorMessage(error) };
          }
        }),
      ),
      disponibilidadPromise,
    ]);

    // Ignora respuestas de filtros anteriores que terminen después de la más reciente.
    if (solicitud !== solicitudRef.current) return;

    const meses = disponibilidad?.datos
      .map((fila) => String(fila.periodo ?? ""))
      .filter((mes) => /^\d{4}-(0[1-9]|1[0-2])$/.test(mes)) ?? [];
    setMesesDisponibles([...new Set(meses)].sort());

    setPaneles(resultados);
    setLoading(false);
    setActualizando(false);
  }, [idNotebook, desde, hasta, errorRango]);

  useEffect(() => {
    if (errorRango) return;
    const timer = window.setTimeout(() => void cargar(), 0);
    return () => window.clearTimeout(timer);
  }, [cargar, errorRango]);

  const ultimaActualizacion = paneles
    .map((panel) => panel.actualizadoEn)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);

  const aplicarFiltros = useCallback((siguiente: FiltrosPeriodo) => {
    if (siguiente.tipo === "rango" && validarRango(siguiente.desde, siguiente.hasta)) return;
    setLoading(true);
    setPeriodo(siguiente);
  }, []);

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
            disabled={actualizando || Boolean(errorRango)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
          >
            {actualizando ? "Actualizando…" : "Actualizar"}
          </button>
        </div>
      </header>

      <DashboardFilters valor={periodo} onCambio={aplicarFiltros} mesesDisponibles={mesesDisponibles} />

      {loading && <DashboardSkeleton />}

      {!loading && (
        <div className="dashboard-grid grid grid-cols-1 gap-x-5 gap-y-8 lg:grid-cols-12">
          {INDICADORES.map(({ metrica, titulo }) => {
            const panel = paneles.find((item) => item.metrica === metrica);
            if (panel?.error) {
              return (
                <Panel key={metrica} titulo={titulo} descripcion="No se pudo actualizar este indicador">
                  <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{panel.error}</p>
                </Panel>
              );
            }
            if (panel) {
              return <MetricContent key={metrica} metrica={metrica} datos={panel.datos} rango={rango} />;
            }
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
