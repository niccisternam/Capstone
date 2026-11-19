"use client";

import React, { useState } from "react";
import { rejectRequestSchema } from "../schemas/review-account-request.schema";

export function RejectRequestModal({
  correo,
  isProcessing,
  onCancel,
  onConfirm,
}: {
  correo: string;
  isProcessing: boolean;
  onCancel: () => void;
  onConfirm: (motivo: string) => void;
}) {
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validation = rejectRequestSchema.safeParse({ motivo });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? "Motivo inválido.");
      return;
    }

    setError(null);
    onConfirm(validation.data.motivo);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
    >
      <div className="w-full max-w-lg rounded-2xl border-2 border-slate-700 bg-white p-6 shadow-xl">
        <h3 className="text-lg font-extrabold text-slate-900">Rechazar Solicitud de Acceso</h3>

        <p className="mt-2 text-xs text-slate-600 sm:text-sm">
          Ingresa el motivo por el cual se rechaza esta solicitud. Este motivo será enviado por correo al solicitante ({correo}).
        </p>

        <form onSubmit={handleSubmit} className="mt-4">
          <div>
            <label
              htmlFor="rejectionReason"
              className="block text-xs font-bold uppercase tracking-wider text-slate-800"
            >
              Motivo de Rechazo <span className="text-rose-600">*</span>
            </label>
            <textarea
              id="rejectionReason"
              rows={4}
              required
              placeholder="Ej: El RUT de la empresa no se encuentra activo o no coincide con los antecedentes verificados en el SII..."
              value={motivo}
              onChange={(event) => {
                setMotivo(event.target.value);
                if (error) setError(null);
              }}
              disabled={isProcessing}
              className={`mt-1.5 w-full rounded-xl border p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 sm:text-sm ${
                error
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                  : "border-slate-300 focus:border-slate-800 focus:ring-slate-200"
              }`}
            />
            {error && <p className="mt-1 text-xs font-semibold text-rose-600">{error}</p>}
          </div>

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
              type="submit"
              disabled={isProcessing}
              className="rounded-lg border-2 border-slate-800 bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-rose-700 disabled:opacity-50 sm:text-sm"
            >
              {isProcessing ? "Rechazando..." : "Confirmar Rechazo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
