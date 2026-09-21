import type { Metadata } from "next";
import Link from "next/link";
import { AccountRequestDetail } from "@/features/account-requests/components/AccountRequestDetail";
import { LogoutButton } from "@/features/auth/components/LogoutButton";

export const metadata: Metadata = {
  title: "Detalle de Solicitud | Capstone Admin",
  description: "Módulo administrativo para revisar, autorizar o rechazar solicitudes de acceso.",
};

interface AdminSolicitudDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminSolicitudDetailPage({
  params,
}: AdminSolicitudDetailPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Barra superior con marca Capstone y botón Cerrar Sesión */}
      <header className="border-b border-slate-300 bg-white px-6 py-3.5 shadow-2xs">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-slate-900 transition-opacity hover:opacity-90"
          >
            Capstone
          </Link>
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-300">
              Panel de Administración
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Contenedor central */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        {/* Encabezado del módulo */}
        <div className="mb-6 text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            GESTIÓN DE SOLICITUDES DE ACCESO
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-600">
            Revisa y autoriza las peticiones de nuevas cuentas recibidas desde la página de bienvenida.
          </p>
        </div>

        {/* Detalle interactivo con aprobación y rechazo */}
        <AccountRequestDetail id={id} />
      </main>
    </div>
  );
}
