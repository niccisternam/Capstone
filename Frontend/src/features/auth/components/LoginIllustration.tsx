import React from "react";

/**
 * Ilustración decorativa inferior basada en el mockup.
 * Representa gráficos de barras estadísticas/tributarias que sostienen la composición.
 */
export function LoginIllustration() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative mx-auto w-full max-w-4xl overflow-hidden px-4 select-none opacity-80"
    >
      <div className="flex h-36 items-end justify-center gap-3 sm:gap-4">
        {/* Barra 1 - Sombreada */}
        <div className="flex flex-col items-center">
          <div className="h-10 w-8 sm:w-10 rounded-t border-2 border-slate-600 bg-slate-400 shadow-sm" />
        </div>

        {/* Barra 2 - Blanca / Contorno alto */}
        <div className="flex flex-col items-center">
          <div className="h-20 w-8 sm:w-10 rounded-t border-2 border-slate-600 bg-white shadow-sm" />
        </div>

        {/* Barra 3 - Línea alta */}
        <div className="hidden h-28 w-px bg-slate-400 sm:block" />

        {/* Barra 4 - Sombreada media */}
        <div className="flex flex-col items-center">
          <div className="h-24 w-10 sm:w-12 rounded-t border-2 border-slate-700 bg-slate-500 shadow-sm" />
        </div>

        {/* Barra 5 - Blanca alta */}
        <div className="flex flex-col items-center">
          <div className="h-28 w-10 sm:w-12 rounded-t border-2 border-slate-600 bg-white shadow-sm" />
        </div>

        {/* Líneas intermedias verticales estilizadas como en el boceto */}
        <div className="h-32 w-px bg-slate-400" />
        <div className="h-28 w-px bg-slate-400" />
        <div className="h-36 w-px bg-slate-400" />

        {/* Barra 6 - Sombreada */}
        <div className="flex flex-col items-center">
          <div className="h-24 w-10 sm:w-12 rounded-t border-2 border-slate-700 bg-slate-500 shadow-sm" />
        </div>

        {/* Barra 7 - Blanca final */}
        <div className="hidden flex-col items-center sm:flex">
          <div className="h-16 w-8 sm:w-10 rounded-t border-2 border-slate-600 bg-white shadow-sm" />
        </div>
      </div>

      {/* Línea horizontal de base */}
      <div className="h-0.5 w-full bg-slate-600" />
    </div>
  );
}
