"use client";

import React, { useState, useId, useSyncExternalStore } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  validateNewPasswordField,
  validateConfirmPasswordField,
  checkPasswordRequirements,
  changeTemporaryPasswordFormSchema,
} from "../schemas/first-access.schema";
import { changeTemporaryPassword } from "@/api/auth.api";
import { Alert } from "@/components/feedback/Alert";
import { PasswordField } from "@/components/ui/PasswordField";
import { RequirementList } from "@/components/ui/RequirementList";

export function FirstAccessForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryCorreo = searchParams.get("correo") ?? "";
  const queryToken = searchParams.get("token") ?? "";

  const emptySubscribe = () => () => {};

  const storedCorreo = useSyncExternalStore(
    emptySubscribe,
    () => (typeof window !== "undefined" ? sessionStorage.getItem("capstone_first_access_correo") : null) ?? "carlos.soto@panaderia.cl",
    () => "carlos.soto@panaderia.cl"
  );
  const correo = queryCorreo || storedCorreo;

  const getActiveToken = (): string => {
    if (queryToken) return queryToken;
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("capstone_password_change_token") ?? "";
    }
    return "";
  };

  // IDs para accesibilidad
  const provisionalId = useId();
  const nuevaPassId = useId();
  const confirmPassId = useId();
  const nuevaPassErrorId = useId();
  const confirmPassErrorId = useId();

  // Estados de los campos
  const [passwordProvisoria, setPasswordProvisoria] = useState<string>("••••••••••••••••••••");
  const [nuevaPassword, setNuevaPassword] = useState<string>("");
  const [confirmarPassword, setConfirmarPassword] = useState<string>("");

  // Estados dirty para validación en tiempo real
  const [nuevaDirty, setNuevaDirty] = useState<boolean>(false);
  const [confirmDirty, setConfirmDirty] = useState<boolean>(false);

  // Errores
  const [nuevaError, setNuevaError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  // Retroalimentación y envío
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Requisitos calculados
  const requirements = checkPasswordRequirements(nuevaPassword);

  const handleNuevaChange = (val: string) => {
    setNuevaPassword(val);
    setNuevaDirty(true);
    setFeedback(null);

    const err = validateNewPasswordField(val);
    setNuevaError(err);

    if (confirmDirty) {
      setConfirmError(validateConfirmPasswordField(val, confirmarPassword));
    }
  };

  const handleConfirmChange = (val: string) => {
    setConfirmarPassword(val);
    setConfirmDirty(true);
    setFeedback(null);

    const err = validateConfirmPasswordField(nuevaPassword, val);
    setConfirmError(err);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNuevaDirty(true);
    setConfirmDirty(true);

    const errNueva = validateNewPasswordField(nuevaPassword);
    const errConfirm = validateConfirmPasswordField(nuevaPassword, confirmarPassword);

    setNuevaError(errNueva);
    setConfirmError(errConfirm);

    if (errNueva || errConfirm) {
      if (errNueva) {
        document.getElementById(nuevaPassId)?.focus();
      } else {
        document.getElementById(confirmPassId)?.focus();
      }
      return;
    }

    const parseResult = changeTemporaryPasswordFormSchema.safeParse({
      nuevaPassword,
      confirmarPassword,
    });

    if (!parseResult.success) {
      setFeedback({
        type: "error",
        message: "Por favor cumpla con todos los requisitos de seguridad.",
      });
      return;
    }

    const activeToken = getActiveToken();
    if (!activeToken) {
      setFeedback({
        type: "error",
        message:
          "No se detectó un token de cambio temporal activo. Por favor inicie sesión para obtenerlo.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await changeTemporaryPassword(
        activeToken,
        nuevaPassword,
        confirmarPassword
      );

      if (res.status === 200) {
        const data = res.data as {
          estado?: string;
          challengeId?: string;
        } | undefined;

        setFeedback({
          type: "success",
          message: "Contraseña actualizada exitosamente. Redirigiendo a verificación 2FA...",
        });

        // Limpiar tokens temporales de sesión
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("capstone_password_change_token");
        }

        // Si retorna desafío 2FA, redirigir a verificar-codigo
        const nextChallenge = data?.challengeId;
        setTimeout(() => {
          if (nextChallenge) {
            router.push(`/verificar-codigo?challengeId=${encodeURIComponent(nextChallenge)}`);
          } else {
            router.push("/login");
          }
        }, 1200);
      } else if (res.status === 409) {
        setFeedback({
          type: "error",
          message: "El cambio de contraseña provisoria ya fue realizado anteriormente.",
        });
      } else {
        const errData = res.data as { message?: string } | undefined;
        setFeedback({
          type: "error",
          message:
            errData?.message ?? `Error al actualizar contraseña (código ${res.status}).`,
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "No fue posible contactar al servidor. Intente más tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="space-y-6"
      aria-label="Formulario de primer ingreso y definición de clave definitiva"
    >
      {/* Alerta general de feedback si existe */}
      {feedback && <Alert type={feedback.type}>{feedback.message}</Alert>}

      {/* Campo 1: Correo de la Cuenta (Solo Lectura) */}
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-slate-800">
          Correo de la Cuenta:
        </label>
        <div className="relative">
          <input
            type="text"
            readOnly
            disabled
            value={`${correo} (Solo Lectura)`}
            aria-label="Correo de la cuenta, solo lectura"
            className="w-full rounded-md border border-slate-300 bg-slate-100 px-3.5 py-2 text-sm font-medium text-slate-600 shadow-xs cursor-not-allowed select-none"
          />
        </div>
      </div>

      {/* Campo 2: Contraseña Temporal Provisoria */}
      <PasswordField
        id={provisionalId}
        label="Contraseña Temporal Provisoria:"
        value={passwordProvisoria}
        onChange={setPasswordProvisoria}
        disabled={isSubmitting}
      />

      {/* Campo 3: Nueva Contraseña Definitiva */}
      <div className="space-y-1.5">
        <PasswordField
          id={nuevaPassId}
          label="Nueva Contraseña:"
          placeholder="Ingrese su nueva clave definitiva"
          value={nuevaPassword}
          onChange={handleNuevaChange}
          disabled={isSubmitting}
          invalid={nuevaDirty && !!nuevaError}
          describedBy={nuevaPassErrorId}
        />

        {/* Error inferior */}
        {nuevaDirty && nuevaError && (
          <p id={nuevaPassErrorId} role="alert" className="text-xs font-medium text-red-600">
            {nuevaError}
          </p>
        )}

        {/* Guía de requisitos de seguridad interactiva */}
        {nuevaDirty && (
          <div className="mt-2 space-y-1 rounded-md border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-600">
            <p className="font-semibold text-slate-700">Requisitos de seguridad:</p>
            <RequirementList
              items={[
                { label: "Mínimo 12 caracteres", met: requirements.hasMinLength },
                { label: "Una letra mayúscula", met: requirements.hasUpper },
                { label: "Una letra minúscula", met: requirements.hasLower },
                { label: "Un número", met: requirements.hasNumber },
                { label: "Un símbolo especial (!@#$...)", met: requirements.hasSymbol },
              ]}
            />
          </div>
        )}
      </div>

      {/* Campo 4: Confirmar Nueva Contraseña */}
      <div className="space-y-1.5">
        <PasswordField
          id={confirmPassId}
          label="Confirmar Nueva Contraseña:"
          placeholder="Repita su nueva clave"
          value={confirmarPassword}
          onChange={handleConfirmChange}
          disabled={isSubmitting}
          invalid={confirmDirty && !!confirmError}
          describedBy={confirmPassErrorId}
        />

        {/* Error inferior */}
        {confirmDirty && confirmError && (
          <p id={confirmPassErrorId} role="alert" className="text-xs font-medium text-red-600">
            {confirmError}
          </p>
        )}
      </div>

      {/* Botón de acción al pie derecho tal como en el mockup */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !requirements.isValid || nuevaPassword !== confirmarPassword}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? (
            <span>Activando cuenta...</span>
          ) : (
            <>
              <svg className="h-4 w-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <span>Activar Cuenta y Entrar al Sistema</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
