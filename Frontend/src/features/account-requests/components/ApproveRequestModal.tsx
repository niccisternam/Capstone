import type { AccountRequestItem } from "@/api/accountRequests.api";

export function ApproveRequestModal({
  solicitud,
  isProcessing,
  onCancel,
  onConfirm,
}: {
  solicitud: AccountRequestItem;
  isProcessing: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
    >
      <div className="w-full max-w-md rounded-2xl border-2 border-slate-700 bg-white p-6 shadow-xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h3 className="text-center text-lg font-extrabold text-slate-900">¿Aprobar Solicitud de Acceso?</h3>

        <p className="mt-3 text-center text-xs leading-relaxed text-slate-600 sm:text-sm">
          Al confirmar, se creará la empresa{" "}
          <strong className="text-slate-900">{solicitud.razonSocial}</strong> ({solicitud.rutEmpresa}) y el usuario para{" "}
          <strong className="text-slate-900">{solicitud.correo}</strong>. Se le enviará automáticamente un correo con su contraseña provisional.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={isProcessing}
            onClick={onCancel}
            className="rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:text-sm"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onClick={onConfirm}
            className="rounded-lg border-2 border-slate-800 bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-blue-700 disabled:opacity-50 sm:text-sm"
          >
            {isProcessing ? "Aprobando..." : "Confirmar Aprobación"}
          </button>
        </div>
      </div>
    </div>
  );
}
