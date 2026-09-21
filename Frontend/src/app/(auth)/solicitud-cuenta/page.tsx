import type { Metadata } from "next";
import Link from "next/link";
import { AccountRequestForm } from "@/features/account-requests/components/AccountRequestForm";
import { LoginIllustration } from "@/features/auth/components/LoginIllustration";

export const metadata: Metadata = {
  title: "Solicitar Cuenta | Capstone Tributario",
  description: "Solicita una nueva cuenta corporativa para acceder a la gestión documental con IA de Capstone.",
};

export default function SolicitudCuentaPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Barra superior con marca Capstone y acceso a Iniciar Sesión */}
      <header className="border-b border-sky-300 bg-sky-200 px-6 py-4 shadow-2xs">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
          >
            Capstone
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Iniciar Sesión
          </Link>
        </div>
      </header>

      {/* Contenedor central del formulario */}
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-8 sm:px-6">
        {/* Encabezado del formulario */}
        <div className="mb-6 text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            SOLICITUD DE CUENTA
          </h1>
          <p className="mt-1.5 text-sm font-medium text-slate-600">
            Completa los datos de tu empresa y usuario para solicitar la habilitación de tu cuenta en Capstone.
          </p>
        </div>

        {/* Formulario con validación en tiempo real y autoformato de RUT */}
        <AccountRequestForm />
      </main>

      {/* Ilustración de barras al pie para mantener coherencia visual */}
      <div className="mt-8 w-full">
        <LoginIllustration />
      </div>
    </div>
  );
}
