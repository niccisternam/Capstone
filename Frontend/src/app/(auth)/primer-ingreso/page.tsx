import { Suspense } from "react";
import type { Metadata } from "next";
import { FirstAccessForm } from "@/features/auth/components/FirstAccessForm";

export const metadata: Metadata = {
  title: "Primer Ingreso a la Plataforma | Capstone Tributario",
  description: "Definición obligatoria de contraseña definitiva en el primer acceso.",
};

export default function PrimerIngresoPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Barra superior con marca Capstone como figura en el mockup */}
      <header className="border-b border-slate-200 bg-white px-6 py-3.5 shadow-2xs">
        <div className="mx-auto max-w-5xl">
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Capstone
          </span>
        </div>
      </header>

      {/* Contenedor principal centrado */}
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-8 sm:px-6">
        {/* Encabezado del primer ingreso */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-blue-600">
            PRIMER INGRESO A LA PLATAFORMA
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-600">
            Establece tu nueva contraseña segura
          </p>
        </div>

        {/* Alerta de Seguridad informativa al estilo del mockup */}
        <div
          role="note"
          aria-label="Alerta de Seguridad"
          className="mb-6 rounded-md border-2 border-slate-700 bg-white p-4 text-xs sm:text-sm font-medium text-slate-800 shadow-xs"
        >
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 text-base font-bold text-blue-600">ⓘ</span>
            <p className="leading-relaxed">
              <span className="font-bold">Alerta de Seguridad</span> | Tu cuenta
              fue habilitada por administración con una credencial provisoria. Por
              políticas de seguridad, debes definir tu propia clave definitiva.
            </p>
          </div>
        </div>

        {/* Contenedor del formulario */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <Suspense
            fallback={
              <div className="py-8 text-center text-sm text-slate-500">
                Cargando formulario de primer ingreso...
              </div>
            }
          >
            <FirstAccessForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
