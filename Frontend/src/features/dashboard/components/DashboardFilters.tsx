"use client";

import { useState } from "react";
import type { Direccion } from "@/api/dashboard.api";
import { DIRECCIONES } from "../direccion";
import {
  etiquetaPeriodo,
  periodoInicial,
  validarRango,
  type FiltrosPeriodo,
  type TipoPeriodo,
} from "../periodos";

const TIPOS: ReadonlyArray<{ valor: TipoPeriodo; etiqueta: string }> = [
  { valor: "todo", etiqueta: "Todo el historial" },
  { valor: "rango", etiqueta: "Rango de meses" },
  { valor: "semestre", etiqueta: "Semestre" },
  { valor: "anio", etiqueta: "Año completo" },
];

const claseControl =
  "mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-400 focus:border-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

const claseEtiqueta = "text-xs font-semibold uppercase tracking-wide text-slate-500";

const nombresMeses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function etiquetaMes(mes: string): string {
  const [anio, numero] = mes.split("-");
  return `${nombresMeses[Number(numero) - 1] ?? mes} ${anio}`;
}

export function DashboardFilters({
  valor,
  onCambio,
  mesesDisponibles,
  direccion,
  onDireccionCambio,
}: {
  valor: FiltrosPeriodo;
  onCambio: (filtros: FiltrosPeriodo) => void;
  mesesDisponibles: string[];
  direccion: Direccion;
  onDireccionCambio: (direccion: Direccion) => void;
}) {
  const [pendiente, setPendiente] = useState<FiltrosPeriodo>(valor);
  const anios = [...new Set(mesesDisponibles.map((mes) => Number(mes.slice(0, 4))))].sort((a, b) => b - a);
  const error = pendiente.tipo === "rango" ? validarRango(pendiente.desde, pendiente.hasta) : null;
  const hayCambios = JSON.stringify(pendiente) !== JSON.stringify(valor);

  const cambiarTipo = (tipo: TipoPeriodo) => {
    if (tipo === "rango" && mesesDisponibles.length) {
      setPendiente({ tipo, desde: mesesDisponibles[0], hasta: mesesDisponibles[mesesDisponibles.length - 1] });
      return;
    }

    if ((tipo === "anio" || tipo === "semestre") && anios.length) {
      const anio = anios[0];
      setPendiente(
        tipo === "anio"
          ? { tipo, anio }
          : { tipo, anio, semestre: Number(mesesDisponibles.find((mes) => mes.startsWith(`${anio}-`))?.slice(5, 7)) <= 6 ? 1 : 2 },
      );
      return;
    }

    setPendiente(periodoInicial(tipo));
  };

  const aplicar = () => {
    if (!error) onCambio(pendiente);
  };

  return (
    <section
      aria-label="Filtros del dashboard"
      className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-[220px]">
          <span id="filtro-direccion" className={claseEtiqueta}>Tipo de documento</span>
          <div
            role="radiogroup"
            aria-labelledby="filtro-direccion"
            className="mt-1 inline-flex w-full rounded-lg border border-slate-300 bg-slate-50 p-1 text-sm font-semibold"
          >
            {DIRECCIONES.map((opcion) => {
              const seleccionada = opcion.valor === direccion;
              return (
                <button
                  key={opcion.valor}
                  type="button"
                  role="radio"
                  aria-checked={seleccionada}
                  onClick={() => onDireccionCambio(opcion.valor)}
                  className={`flex-1 rounded-md px-3 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${seleccionada ? "bg-white text-blue-800 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                >
                  {opcion.etiqueta}
                </button>
              );
            })}
          </div>
        </div>

        <label className="min-w-[190px]">
          <span className={claseEtiqueta}>Periodo</span>
          <select
            value={pendiente.tipo}
            onChange={(event) => cambiarTipo(event.target.value as TipoPeriodo)}
            className={`${claseControl} w-full`}
          >
            {TIPOS.map((tipo) => (
              <option key={tipo.valor} value={tipo.valor}>{tipo.etiqueta}</option>
            ))}
          </select>
        </label>

        {pendiente.tipo === "rango" && (
          <>
            <label>
              <span className={claseEtiqueta}>Desde</span>
              <div className="relative mt-1">
                <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-blue-700">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
                    <path d="M7 3.5v3M17 3.5v3M3.5 9h17" />
                  </svg>
                </span>
                <select
                  aria-label="Mes inicial"
                  value={pendiente.desde}
                  onChange={(event) => setPendiente({ ...pendiente, desde: event.target.value })}
                  className={`${claseControl} min-w-[180px] pl-10 pr-3`}
                >
                  {mesesDisponibles.map((mes) => (
                    <option key={mes} value={mes}>{etiquetaMes(mes)}</option>
                  ))}
                </select>
              </div>
            </label>
            <label>
              <span className={claseEtiqueta}>Hasta</span>
              <div className="relative mt-1">
                <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-blue-700">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
                    <path d="M7 3.5v3M17 3.5v3M3.5 9h17" />
                  </svg>
                </span>
                <select
                  aria-label="Mes final"
                  value={pendiente.hasta}
                  onChange={(event) => setPendiente({ ...pendiente, hasta: event.target.value })}
                  className={`${claseControl} min-w-[180px] pl-10 pr-3`}
                >
                  {mesesDisponibles.map((mes) => (
                    <option key={mes} value={mes}>{etiquetaMes(mes)}</option>
                  ))}
                </select>
              </div>
            </label>
          </>
        )}

        {pendiente.tipo === "semestre" && (
          <>
            <label>
              <span className={claseEtiqueta}>Año</span>
              <select
                value={pendiente.anio}
                onChange={(event) => setPendiente({ ...pendiente, anio: Number(event.target.value) })}
                className={claseControl}
              >
                {anios.map((anio) => <option key={anio} value={anio}>{anio}</option>)}
              </select>
            </label>
            <label>
              <span className={claseEtiqueta}>Semestre</span>
              <select
                value={pendiente.semestre}
                onChange={(event) => setPendiente({ ...pendiente, semestre: Number(event.target.value) as 1 | 2 })}
                className={claseControl}
              >
                <option value={1}>S1 · Enero – Junio</option>
                <option value={2}>S2 · Julio – Diciembre</option>
              </select>
            </label>
          </>
        )}

        {pendiente.tipo === "anio" && (
          <label>
            <span className={claseEtiqueta}>Año</span>
            <select
              value={pendiente.anio}
              onChange={(event) => setPendiente({ ...pendiente, anio: Number(event.target.value) })}
              className={claseControl}
            >
              {anios.map((anio) => <option key={anio} value={anio}>{anio}</option>)}
            </select>
          </label>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-red-700">{error}</p>
      )}
      {!mesesDisponibles.length && (
        <p className="mt-3 text-sm text-slate-500">No hay meses con documentos disponibles para filtrar.</p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <p aria-live="polite" className="text-sm text-slate-600">
          {hayCambios ? "Pendiente: " : "Mostrando: "}
          <span className={`font-semibold ${hayCambios ? "text-blue-700" : "text-slate-900"}`}>
            {etiquetaPeriodo(pendiente)}
          </span>
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {pendiente.tipo !== "todo" && (
            <button
              type="button"
              onClick={() => setPendiente({ tipo: "todo" })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Limpiar
            </button>
          )}
          <button
            type="button"
            onClick={aplicar}
            disabled={!hayCambios || Boolean(error)}
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Aplicar filtro
          </button>
        </div>
      </div>
    </section>
  );
}
