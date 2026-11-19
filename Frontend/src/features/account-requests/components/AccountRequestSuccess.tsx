import Link from "next/link";
import type { AccountRequestItem } from "@/api/accountRequests.api";

export function AccountRequestSuccess({
  request,
  razonSocial,
}: {
  request: AccountRequestItem;
  razonSocial: string;
}) {
  return (
    <div className="rounded-2xl border-2 border-slate-700 bg-white p-6 text-center shadow-sm sm:p-10">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
        ¡Solicitud enviada con éxito!
      </h2>

      <p className="mx-auto mt-3 max-w-lg text-sm text-slate-600 sm:text-base">
        Tu solicitud de cuenta ha quedado registrada bajo el estado{" "}
        <span className="rounded border border-amber-300 bg-amber-50 px-2 py-0.5 font-semibold text-amber-700">
          Pendiente de revisión
        </span>
        . Un administrador verificará los antecedentes de tu empresa en el SII.
      </p>

      <div className="mx-auto mt-6 max-w-lg space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-xs text-slate-700 sm:text-sm">
        <div className="flex justify-between border-b border-slate-200 pb-1.5">
          <span className="font-semibold text-slate-500">Folio:</span>
          <span className="font-mono font-bold text-slate-900">{request.idSolicitud}</span>
        </div>
        <div className="flex justify-between border-b border-slate-200 pb-1.5">
          <span className="font-semibold text-slate-500">Empresa:</span>
          <span className="font-medium text-slate-900">{request.razonSocial ?? razonSocial}</span>
        </div>
        <div className="flex justify-between border-b border-slate-200 pb-1.5">
          <span className="font-semibold text-slate-500">RUT Empresa:</span>
          <span className="font-mono text-slate-900">{request.rutEmpresa}</span>
        </div>
        <div className="flex justify-between border-b border-slate-200 pb-1.5">
          <span className="font-semibold text-slate-500">Solicitante:</span>
          <span className="font-medium text-slate-900">
            {request.nombre} {request.apellido}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-slate-500">Correo de contacto:</span>
          <span className="font-medium text-slate-900">{request.correo}</span>
        </div>
      </div>

      <p className="mx-auto mt-5 max-w-lg text-xs text-slate-500">
        Una vez aprobada tu solicitud, recibirás un correo electrónico con tu contraseña temporal para iniciar sesión y configurar tu clave definitiva.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/login"
          className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 sm:w-auto"
        >
          Ir a Iniciar Sesión
        </Link>
        <Link
          href="/"
          className="inline-flex w-full items-center justify-center rounded-lg border-2 border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800 sm:w-auto"
        >
          Volver a la página principal
        </Link>
      </div>
    </div>
  );
}
