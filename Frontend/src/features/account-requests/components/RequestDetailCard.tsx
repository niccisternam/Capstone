import type { AccountRequestItem } from "@/api/accountRequests.api";
import { formatDetailedDate } from "../utils/formatDate";
import { RequestStatusBadge } from "./RequestStatusBadge";

export function RequestDetailCard({
  solicitud,
  isPending,
  isProcessing,
  onApprove,
  onReject,
}: {
  solicitud: AccountRequestItem;
  isPending: boolean;
  isProcessing: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="rounded-2xl border-2 border-slate-700 bg-slate-100/90 p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-300 pb-3">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">DETALLE DEL SOLICITANTE</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 sm:text-sm">Estado de solicitud:</span>
          <RequestStatusBadge estado={solicitud.estado} variant="detail" />
        </div>
      </div>

      <div className="space-y-3 text-sm text-slate-800">
        <div>
          <span className="font-bold text-slate-900">Nombre Completo: </span>
          <span>{solicitud.nombre} {solicitud.apellido}</span>
        </div>

        <div>
          <span className="font-bold text-slate-900">Correo Electrónico: </span>
          <a href={`mailto:${solicitud.correo}`} className="font-medium text-blue-600 underline hover:text-blue-800">
            {solicitud.correo}
          </a>
        </div>

        <div>
          <span className="font-bold text-slate-900">RUT Personal: </span>
          <span className="font-mono">{solicitud.rutUsuario}</span>
        </div>

        <div>
          <span className="font-bold text-slate-900">RUT Empresa: </span>
          <span className="font-mono font-semibold">{solicitud.rutEmpresa}</span>
        </div>

        <div>
          <span className="font-bold text-slate-900">Emprendimiento / Razón Social: </span>
          <span className="font-medium">{solicitud.razonSocial ?? "No informada"}</span>
        </div>

        <div>
          <span className="font-bold text-slate-900">Fecha de Solicitud: </span>
          <span suppressHydrationWarning>{formatDetailedDate(solicitud.createdAt)}</span>
        </div>
      </div>

      <div className="mt-6 border-t border-slate-300 pt-4">
        <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-800">
          Mensaje ingresado por el usuario:
        </span>
        <div className="min-h-[5rem] rounded-xl border-2 border-slate-700 bg-white p-4 text-xs leading-relaxed text-slate-700 shadow-2xs sm:text-sm">
          {solicitud.descripcion && solicitud.descripcion.trim().length > 0 ? (
            solicitud.descripcion
          ) : (
            <span className="italic text-slate-400">El solicitante no incluyó una descripción adicional.</span>
          )}
        </div>
      </div>

      {solicitud.estado === "RECHAZADA" && solicitud.motivoRechazo && (
        <div className="mt-6 rounded-xl border border-rose-300 bg-rose-50 p-4">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-rose-900">Motivo de Rechazo:</span>
          <p className="text-xs font-medium text-rose-800 sm:text-sm">{solicitud.motivoRechazo}</p>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center justify-between gap-6 border-t border-slate-300 pt-6 sm:flex-row">
        <div className="w-full text-center sm:w-auto sm:text-left">
          <button
            type="button"
            disabled={!isPending || isProcessing}
            onClick={onReject}
            className="inline-flex w-full items-center justify-center rounded-lg border-2 border-slate-700 bg-rose-300 px-6 py-2.5 text-sm font-bold text-slate-900 shadow-xs transition-colors hover:bg-rose-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            Rechazar Solicitud
          </button>
          <p className="mt-1.5 text-[11px] text-slate-600">(Abre modal para ingresar motivo de rechazo)</p>
        </div>

        <div className="w-full text-center sm:w-auto sm:text-right">
          <button
            type="button"
            disabled={!isPending || isProcessing}
            onClick={onApprove}
            className="inline-flex w-full items-center justify-center rounded-lg border-2 border-slate-800 bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            ✓ Aprobar y Generar Cuenta
          </button>
          <p className="mt-1.5 text-[11px] text-slate-600">
            (Envía correo con clave temporal y enlace de activación al usuario)
          </p>
        </div>
      </div>
    </div>
  );
}
