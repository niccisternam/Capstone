import type { Metadata } from "next";
import Link from "next/link";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { LoginIllustration } from "@/features/auth/components/LoginIllustration";

export const metadata: Metadata = {
  title: "Portal de Usuario | Capstone",
  description: "Panel de usuario regular del sistema de gestión documental Capstone.",
};

export default function UsuarioPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 justify-between">
      {/* Barra superior con marca Capstone, distintivo de usuario y botón de cerrar sesión */}
      <header className="border-b border-slate-300 bg-white px-6 py-3.5 shadow-2xs">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-slate-900 transition-opacity hover:opacity-90"
          >
            Capstone
          </Link>
          <div className="flex items-center gap-3">
            <span className="rounded-md border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              Rol: Usuario
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Contenedor central con el mensaje de rol usuario */}
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-12 sm:px-6">
        <div className="rounded-2xl border-2 border-slate-700 bg-white p-8 sm:p-12 shadow-sm text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-6">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Estás con rol usuario.
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-md mx-auto">
            Tu sesión ha sido iniciada exitosamente con permisos de usuario estándar. Las funcionalidades de subida de comprobantes, carpetas inteligentes y consulta al asistente IA se están integrando.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <LogoutButton className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-slate-800" />
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border-2 border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50"
            >
              Ir a la página principal
            </Link>
          </div>
        </div>
      </main>

      {/* Ilustración de barras al pie */}
      <div className="w-full">
        <LoginIllustration />
      </div>
    </div>
  );
}
