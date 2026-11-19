"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getAccountRequest,
  approveAccountRequest,
  rejectAccountRequest,
  type AccountRequestItem,
} from "@/api/accountRequests.api";
import { Alert, type AlertType } from "@/components/feedback/Alert";
import { ApproveRequestModal } from "./ApproveRequestModal";
import { RejectRequestModal } from "./RejectRequestModal";
import { RequestDetailCard } from "./RequestDetailCard";

interface AccountRequestDetailProps {
  id: string;
}

export function AccountRequestDetail({ id }: AccountRequestDetailProps) {
  const router = useRouter();
  const [solicitud, setSolicitud] = useState<AccountRequestItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<{ type: AlertType; message: string } | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

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

    void loadRequest();

    return () => {
      isMounted = false;
    };
  }, [id, router]);

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

  const handleReject = async (motivo: string) => {
    if (!solicitud || isProcessingAction) return;

    setIsProcessingAction(true);
    setFeedback(null);

    try {
      const res = await rejectAccountRequest(solicitud.idSolicitud, motivo);

      if (res.status === 200) {
        setSolicitud((prev) => (prev ? { ...prev, estado: "RECHAZADA", motivoRechazo: motivo } : null));
        setFeedback({
          type: "success",
          message:
            "Solicitud rechazada. Se ha notificado al solicitante por correo con el motivo indicado.",
        });
        setIsRejectModalOpen(false);
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

  const isPending = solicitud.estado === "PENDIENTE";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/admin/solicitudes"
          className="inline-flex w-fit items-center gap-2 rounded-lg border-2 border-slate-700 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-xs transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800 sm:text-sm"
        >
          <span>‹</span> Volver al listado
        </Link>
      </div>

      {feedback && <Alert type={feedback.type}>{feedback.message}</Alert>}

      <RequestDetailCard
        solicitud={solicitud}
        isPending={isPending}
        isProcessing={isProcessingAction}
        onApprove={() => setIsApproveModalOpen(true)}
        onReject={() => setIsRejectModalOpen(true)}
      />

      {isApproveModalOpen && (
        <ApproveRequestModal
          solicitud={solicitud}
          isProcessing={isProcessingAction}
          onCancel={() => setIsApproveModalOpen(false)}
          onConfirm={() => void handleApprove()}
        />
      )}

      {isRejectModalOpen && (
        <RejectRequestModal
          correo={solicitud.correo}
          isProcessing={isProcessingAction}
          onCancel={() => setIsRejectModalOpen(false)}
          onConfirm={(motivo) => void handleReject(motivo)}
        />
      )}
    </div>
  );
}
