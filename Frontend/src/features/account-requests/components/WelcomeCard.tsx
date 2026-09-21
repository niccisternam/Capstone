import React from "react";
import Link from "next/link";
import { AnnualExpenseChart } from "./AnnualExpenseChart";

export function WelcomeCard() {
  return (
    <div className="w-full max-w-3xl rounded-2xl border-2 border-slate-700 bg-white p-6 shadow-sm sm:p-10">
      {/* Título principal */}
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        Tu gestión documental con el poder de la IA.
      </h1>

      {/* Párrafos explicativos */}
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-700 sm:text-base">
        <p>
          Sube tus comprobantes, organiza tus gastos por carpetas inteligentes y
          pregúntale a nuestro asistente lo que necesitas saber de tus compras al instante.
        </p>
        <p>
          Únete a tu equipo de trabajo. Contacta a administración para habilitar tu usuario autorizado.
        </p>
      </div>

      {/* Botón de acción hacia solicitud de cuenta */}
      <div className="mt-6">
        <Link
          href="/solicitud-cuenta"
          className="inline-flex items-center justify-center rounded-lg border-2 border-slate-800 bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Solicitar mi cuenta
        </Link>
      </div>

      {/* Gráfico de barras de gastos anuales */}
      <div className="mt-6 pt-4">
        <AnnualExpenseChart />
      </div>
    </div>
  );
}
