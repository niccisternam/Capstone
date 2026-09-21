"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getAccountRequest,
  approveAccountRequest,
  rejectAccountRequest,
  type AccountRequestItem,
} from "@/api/accountRequests.api";
import { rejectRequestSchema } from "../schemas/review-account-request.schema";

interface AccountRequestDetailProps {
  id: string;
}

function formatDetailedDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = date.getDate().toString().padStart(2, "0");
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day} de ${month} de ${year} - ${hours}:${minutes} hrs`;
  } catch {
    return dateString;
  }
}

export function AccountRequestDetail({ id }: AccountRequestDetailProps) {
  const router = useRouter();
  const [solicitud, setSolicitud] = useState<AccountRequestItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  // Estados para modal de rechazo
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionError, setRejectionError] = useState<string | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // Modal de confirmación para aprobación
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadRequest() {
      setIsLoading(true);
      try {
        const res = await getAccountRequest(id);
        if (!isMounted) return;

        if (res.status === 200 && res.data?.solicitud) {
          setSolicitud(res.data.solicitud);
        } else if (res.status === 403) {
          router.replace("/usuario");
          return;
        } else if (res.status === 401) {
          router.replace("/login");
          return;
        } else {
          setSolicitud(null);
          setFeedback({
            type: "error",
            message: `No se encontró la solicitud con ID "${id}".`,
          });
        }
      } catch {
        if (isMounted) {
          setSolicitud(null);
          setFeedback({
            type: "error",
            message: "Error de conexión al obtener los detalles de la solicitud.",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRequest();

    return () => {
      isMounted = false;
    };
  }, [id, router]);

  // Manejador de Aprobación (NO requiere descripción)
  const handleApprove = async () => {
    if (!solicitud || isProcessingAction) return;

    setIsProcessingAction(true);
    setFeedback(null);

    try {
      const res = await approveAccountRequest(solicitud.idSolicitud);

      if (res.status === 200 || res.status === 201) {
        setSolicitud((prev) => (prev ? { ...prev, estado: "APROBADA" } : null));
        setFeedback({
          type: "success",
          message:
            "Solicitud aprobada con éxito. Se ha creado la empresa y el usuario, y se envió la clave temporal por correo.",
        });
        setIsApproveModalOpen(false);
      } else {
        const errData = res.data as { error?: { message?: string } } | undefined;
        setFeedback({
          type: "error",
          message:
            errData?.error?.message ??
            `No fue posible aprobar la solicitud (código ${res.status}).`,
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Error de comunicación con el servidor al intentar aprobar.",
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  // Manejador de Rechazo (SÍ requiere descripción/motivo)
  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!solicitud || isProcessingAction) return;

    const validation = rejectRequestSchema.safeParse({ motivo: rejectionReason });
    if (!validation.success) {
      setRejectionError(validation.error.issues[0]?.message ?? "Motivo inválido.");
      return;
    }

    setRejectionError(null);
    setIsProcessingAction(true);
    setFeedback(null);

    try {
      const res = await rejectAccountRequest(solicitud.idSolicitud, validation.data.motivo);

      if (res.status === 200) {
        setSolicitud((prev) =>
          prev
            ? {
                ...prev,
                estado: "RECHAZADA",
                motivoRechazo: validation.data.motivo,
              }
            : null
        );
        setFeedback({
          type: "success",
          message:
            "Solicitud rechazada. Se ha notificado al solicitante por correo con el motivo indicado.",
        });
        setIsRejectModalOpen(false);
        setRejectionReason("");
      } else {
        const errData = res.data as { error?: { message?: string } } | undefined;
        setFeedback({
          type: "error",
          message:
            errData?.error?.message ??
            `No fue posible rechazar la solicitud (código ${res.status}).`,
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Error de comunicación con el servidor al intentar rechazar.",
      });
    } finally {
      setIsProcessingAction(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
          <svg className="h-5 w-5 animate-spin text-slate-900" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Cargando detalle de la solicitud...
        </div>
      </div>
    );
  }

  if (!solicitud) {
    return (
      <div className="rounded-xl border border-rose-300 bg-rose-50 p-6 text-center">
        <p className="text-sm font-semibold text-rose-800">
          {feedback?.message || "No se encontró la solicitud solicitada."}
        </p>
        <div className="mt-4">
          <Link
            href="/admin/solicitudes"
            className="inline-flex items-center text-sm font-bold text-slate-900 underline hover:text-slate-700"
          >
            ← Volver al listado
          </Link>
        </div>
      </div>
    );
  }

  const isPendiente = solicitud.estado === "PENDIENTE";
  const isAprobada = solicitud.estado === "APROBADA";
  const isRechazada = solicitud.estado === "RECHAZADA";

  return (
    <div className="space-y-6">
      {/* Barra superior de navegación y estado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/admin/solicitudes"
          className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-700 bg-white px-4 py-2 text-xs sm:text-sm font-bold text-slate-800 shadow-xs transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800 w-fit"
        >
          <span>‹</span> Volver al listado
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-semibold text-slate-600">
            Estado de solicitud:
          </span>
          <span
            className={`inline-flex items-center rounded-md px-3 py-1 text-xs font-bold border ${
              isPendiente
                ? "bg-amber-100 text-amber-900 border-amber-300"
                : isAprobada
                ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                : "bg-rose-100 text-rose-900 border-rose-300"
            }`}
          >
            {isPendiente ? "Pendiente" : isAprobada ? "Aprobada" : "Rechazada"}
          </span>
        </div>
      </div>

      {/* Alerta de Feedback */}
      {feedback && (
        <div
          role="alert"
          className={`rounded-lg p-4 text-sm font-medium border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-300"
              : feedback.type === "error"
              ? "bg-rose-50 text-rose-900 border-rose-300"
              : "bg-blue-50 text-blue-900 border-blue-300"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Tarjeta principal con el Detalle del Solicitante según mockup */}
      <div className="rounded-2xl border-2 border-slate-700 bg-slate-100/90 p-6 sm:p-8 shadow-sm">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-3 mb-6">
          DETALLE DEL SOLICITANTE
        </h2>

        {/* Lista de campos requeridos (SIN NÚMERO DE TELÉFONO) */}
        <div className="space-y-3 text-sm text-slate-800">
          <div>
            <span className="font-bold text-slate-900">Nombre Completo: </span>
            <span>
              {solicitud.nombre} {solicitud.apellido}
            </span>
          </div>

          <div>
            <span className="font-bold text-slate-900">Correo Electrónico: </span>
            <a
              href={`mailto:${solicitud.correo}`}
              className="text-blue-600 underline font-medium hover:text-blue-800"
            >
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

        {/* Sección: Mensaje ingresado por el usuario (descripción) */}
        <div className="mt-6 pt-4 border-t border-slate-300">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
            Mensaje ingresado por el usuario:
          </label>
          <div className="rounded-xl border-2 border-slate-700 bg-white p-4 text-xs sm:text-sm text-slate-700 shadow-2xs leading-relaxed min-h-[5rem]">
            {solicitud.descripcion && solicitud.descripcion.trim().length > 0 ? (
              solicitud.descripcion
            ) : (
              <span className="italic text-slate-400">
                El solicitante no incluyó una descripción adicional.
              </span>
            )}
          </div>
        </div>

        {/* Si ya fue rechazada, mostrar motivo registrado */}
        {isRechazada && solicitud.motivoRechazo && (
          <div className="mt-6 rounded-xl border border-rose-300 bg-rose-50 p-4">
            <span className="block text-xs font-bold uppercase tracking-wider text-rose-900 mb-1">
              Motivo de Rechazo:
            </span>
            <p className="text-xs sm:text-sm text-rose-800 font-medium">
              {solicitud.motivoRechazo}
            </p>
          </div>
        )}

        {/* Botones de acción inferiores al estilo del mockup */}
        <div className="mt-8 pt-6 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Botón Rechazar Solicitud */}
          <div className="w-full sm:w-auto text-center sm:text-left">
            <button
              type="button"
              disabled={!isPendiente || isProcessingAction}
              onClick={() => {
                setRejectionError(null);
                setRejectionReason("");
                setIsRejectModalOpen(true);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border-2 border-slate-700 bg-rose-300 hover:bg-rose-400 px-6 py-2.5 text-sm font-bold text-slate-900 shadow-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
            >
              Rechazar Solicitud
            </button>
            <p className="mt-1.5 text-[11px] text-slate-600">
              (Abre modal para ingresar motivo de rechazo)
            </p>
          </div>

          {/* Botón Aprobar y Generar Cuenta */}
          <div className="w-full sm:w-auto text-center sm:text-right">
            <button
              type="button"
              disabled={!isPendiente || isProcessingAction}
              onClick={() => setIsApproveModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border-2 border-slate-800 bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-sm font-bold text-white shadow-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              ✓ Aprobar y Generar Cuenta
            </button>
            <p className="mt-1.5 text-[11px] text-slate-600">
              (Envía correo con clave temporal y enlace de activación al usuario)
            </p>
          </div>
        </div>
      </div>

      {/* Modal para Confirmación de Aprobación */}
      {isApproveModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-md rounded-2xl border-2 border-slate-700 bg-white p-6 shadow-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-lg font-extrabold text-slate-900 text-center">
              ¿Aprobar Solicitud de Acceso?
            </h3>

            <p className="mt-3 text-xs sm:text-sm text-slate-600 text-center leading-relaxed">
              Al confirmar, se creará la empresa{" "}
              <strong className="text-slate-900">{solicitud.razonSocial}</strong> ({solicitud.rutEmpresa}) y el usuario para{" "}
              <strong className="text-slate-900">{solicitud.correo}</strong>. Se le enviará automáticamente un correo con su contraseña provisional.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={isProcessingAction}
                onClick={() => setIsApproveModalOpen(false)}
                className="rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isProcessingAction}
                onClick={handleApprove}
                className="rounded-lg bg-blue-600 hover:bg-blue-700 border-2 border-slate-800 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-xs transition-colors disabled:opacity-50"
              >
                {isProcessingAction ? "Aprobando..." : "Confirmar Aprobación"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Motivo Obligatorio de Rechazo */}
      {isRejectModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4"
        >
          <div className="w-full max-w-lg rounded-2xl border-2 border-slate-700 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-extrabold text-slate-900">
              Rechazar Solicitud de Acceso
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Ingresa el motivo por el cual se rechaza esta solicitud. Este motivo será enviado por correo al solicitante ({solicitud.correo}).
            </p>

            <form onSubmit={handleReject} className="mt-4">
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
                  value={rejectionReason}
                  onChange={(e) => {
                    setRejectionReason(e.target.value);
                    if (rejectionError) setRejectionError(null);
                  }}
                  disabled={isProcessingAction}
                  className={`mt-1.5 w-full rounded-xl border p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                    rejectionError
                      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                      : "border-slate-300 focus:border-slate-800 focus:ring-slate-200"
                  }`}
                />
                {rejectionError && (
                  <p className="mt-1 text-xs font-semibold text-rose-600">
                    {rejectionError}
                  </p>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  disabled={isProcessingAction}
                  onClick={() => setIsRejectModalOpen(false)}
                  className="rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isProcessingAction}
                  className="rounded-lg bg-rose-600 hover:bg-rose-700 border-2 border-slate-800 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-xs transition-colors disabled:opacity-50"
                >
                  {isProcessingAction ? "Rechazando..." : "Confirmar Rechazo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
