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

  // Visibilidad de contraseñas (icono de ojo)
  const [showProvisoria, setShowProvisoria] = useState<boolean>(false);
  const [showNueva, setShowNueva] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

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

  const handleNuevaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNuevaPassword(val);
    setNuevaDirty(true);
    setFeedback(null);

    const err = validateNewPasswordField(val);
    setNuevaError(err);

    if (confirmDirty) {
      setConfirmError(validateConfirmPasswordField(val, confirmarPassword));
    }
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
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
      {feedback && (
        <div
          role="alert"
          className={`rounded-md p-3.5 text-sm font-medium transition-all ${
            feedback.type === "error"
              ? "border border-red-200 bg-red-50 text-red-700"
              : feedback.type === "success"
                ? "border border-green-200 bg-green-50 text-green-700"
                : "border border-blue-200 bg-blue-50 text-blue-700"
          }`}
        >
          {feedback.message}
        </div>
      )}

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

      {/* Campo 2: Contraseña Temporal Provisoria (con ojo) */}
      <div className="space-y-1.5">
        <label
          htmlFor={provisionalId}
          className="block text-sm font-semibold text-slate-800"
        >
          Contraseña Temporal Provisoria:
        </label>
        <div className="relative flex items-center">
          <input
            id={provisionalId}
            type={showProvisoria ? "text" : "password"}
            value={passwordProvisoria}
            onChange={(e) => setPasswordProvisoria(e.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-md border border-slate-400 bg-white px-3.5 py-2 pr-10 text-sm text-slate-800 shadow-xs focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowProvisoria(!showProvisoria)}
            aria-label={showProvisoria ? "Ocultar contraseña provisoria" : "Mostrar contraseña provisoria"}
            className="absolute right-3 text-slate-500 hover:text-slate-800 focus:outline-hidden"
          >
            {showProvisoria ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Campo 3: Nueva Contraseña Definitiva */}
      <div className="space-y-1.5">
        <label
          htmlFor={nuevaPassId}
          className="block text-sm font-semibold text-slate-800"
        >
          Nueva Contraseña:
        </label>
        <div className="relative flex items-center">
          <input
            id={nuevaPassId}
            type={showNueva ? "text" : "password"}
            placeholder="Ingrese su nueva clave definitiva"
            value={nuevaPassword}
            onChange={handleNuevaChange}
            disabled={isSubmitting}
            aria-invalid={nuevaDirty && !!nuevaError}
            aria-describedby={nuevaDirty && nuevaError ? nuevaPassErrorId : undefined}
            className={`w-full rounded-md border bg-white px-3.5 py-2 pr-10 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-offset-1 ${
              nuevaDirty && nuevaError
                ? "border-red-500 focus:border-red-500 focus:ring-red-400"
                : "border-slate-400 focus:border-blue-600 focus:ring-blue-500"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowNueva(!showNueva)}
            aria-label={showNueva ? "Ocultar nueva contraseña" : "Mostrar nueva contraseña"}
            className="absolute right-3 text-slate-500 hover:text-slate-800 focus:outline-hidden"
          >
            {showNueva ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            )}
          </button>
        </div>

        {/* Error inferior */}
        {nuevaDirty && nuevaError && (
          <p id={nuevaPassErrorId} role="alert" className="text-xs font-medium text-red-600">
            {nuevaError}
          </p>
        )}

        {/* Guía de requisitos de seguridad interactiva */}
        {nuevaDirty && (
          <div className="mt-2 space-y-1 rounded-md bg-slate-50 p-2.5 text-xs text-slate-600 border border-slate-200">
            <p className="font-semibold text-slate-700">Requisitos de seguridad:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
              <li className={`flex items-center gap-1.5 ${requirements.hasMinLength ? "text-green-700 font-medium" : "text-slate-500"}`}>
                <span>{requirements.hasMinLength ? "✓" : "○"}</span> Mínimo 12 caracteres
              </li>
              <li className={`flex items-center gap-1.5 ${requirements.hasUpper ? "text-green-700 font-medium" : "text-slate-500"}`}>
                <span>{requirements.hasUpper ? "✓" : "○"}</span> Una letra mayúscula
              </li>
              <li className={`flex items-center gap-1.5 ${requirements.hasLower ? "text-green-700 font-medium" : "text-slate-500"}`}>
                <span>{requirements.hasLower ? "✓" : "○"}</span> Una letra minúscula
              </li>
              <li className={`flex items-center gap-1.5 ${requirements.hasNumber ? "text-green-700 font-medium" : "text-slate-500"}`}>
                <span>{requirements.hasNumber ? "✓" : "○"}</span> Un número
              </li>
              <li className={`flex items-center gap-1.5 ${requirements.hasSymbol ? "text-green-700 font-medium" : "text-slate-500"}`}>
                <span>{requirements.hasSymbol ? "✓" : "○"}</span> Un símbolo especial (!@#$...)
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Campo 4: Confirmar Nueva Contraseña */}
      <div className="space-y-1.5">
        <label
          htmlFor={confirmPassId}
          className="block text-sm font-semibold text-slate-800"
        >
          Confirmar Nueva Contraseña:
        </label>
        <div className="relative flex items-center">
          <input
            id={confirmPassId}
            type={showConfirm ? "text" : "password"}
            placeholder="Repita su nueva clave"
            value={confirmarPassword}
            onChange={handleConfirmChange}
            disabled={isSubmitting}
            aria-invalid={confirmDirty && !!confirmError}
            aria-describedby={confirmDirty && confirmError ? confirmPassErrorId : undefined}
            className={`w-full rounded-md border bg-white px-3.5 py-2 pr-10 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs focus:outline-hidden focus:ring-2 focus:ring-offset-1 ${
              confirmDirty && confirmError
                ? "border-red-500 focus:border-red-500 focus:ring-red-400"
                : "border-slate-400 focus:border-blue-600 focus:ring-blue-500"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            aria-label={showConfirm ? "Ocultar confirmación" : "Mostrar confirmación"}
            className="absolute right-3 text-slate-500 hover:text-slate-800 focus:outline-hidden"
          >
            {showConfirm ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            )}
          </button>
        </div>

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
