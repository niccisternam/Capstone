"use client";

import React, { useState, useId, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  checkResetPasswordRequirements,
  resetPasswordFieldsSchema,
} from "../schemas/reset-password.schema";
import { resetPassword } from "@/api/auth.api";

let memoryToken: string | null = null;
let tokenListeners: Array<() => void> = [];

function subscribeToToken(callback: () => void) {
  tokenListeners.push(callback);
  return () => {
    tokenListeners = tokenListeners.filter((l) => l !== callback);
  };
}

function getTokenSnapshot(): string | null {
  if (memoryToken !== null) return memoryToken;
  if (typeof window === "undefined") return null;

  const hash = window.location.hash;
  if (hash.startsWith("#token=")) {
    memoryToken = hash.slice(7).trim() || "";
  } else if (hash.includes("token=")) {
    const match = /[#&]token=([^&]+)/.exec(hash);
    if (match?.[1]) {
      try {
        memoryToken = decodeURIComponent(match[1]).trim() || "";
      } catch {
        memoryToken = match[1].trim() || "";
      }
    }
  } else {
    memoryToken = "";
  }

  // Eliminar el fragmento de la URL sin alterar el historial
  if (window.location.hash) {
    window.history.replaceState(null, "", window.location.pathname);
  }

  return memoryToken;
}

function getServerTokenSnapshot(): string | null {
  return null;
}

function clearToken() {
  memoryToken = "";
  tokenListeners.forEach((l) => l());
}

export function ResetPasswordForm() {
  const router = useRouter();
  const nuevaPassId = useId();
  const confirmPassId = useId();

  // El token se resuelve de forma segura mediante store externo para garantizar hidratación idéntica
  const token = useSyncExternalStore(subscribeToToken, getTokenSnapshot, getServerTokenSnapshot);

  const tokenStatus: "checking" | "valid" | "invalid" =
    token === null ? "checking" : token === "" ? "invalid" : "valid";

  // Campos de contraseña (no se aplica trim)
  const [nuevaPassword, setNuevaPassword] = useState<string>("");
  const [confirmarPassword, setConfirmarPassword] = useState<string>("");

  // Visibilidad de contraseñas (icono de ojo)
  const [showNueva, setShowNueva] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  // Estados de interacción para validación
  const [nuevaDirty, setNuevaDirty] = useState<boolean>(false);
  const [confirmDirty, setConfirmDirty] = useState<boolean>(false);

  // Estados de envío y retroalimentación
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Evaluación en tiempo real de condiciones
  const requirements = checkResetPasswordRequirements(nuevaPassword, confirmarPassword);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token || !requirements.isValid) {
      return;
    }

    const parseResult = resetPasswordFieldsSchema.safeParse({
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

    setIsSubmitting(true);
    setFeedback(null);

    try {
      // Envío exclusivo al endpoint con retry = false
      const res = await resetPassword(token, nuevaPassword, confirmarPassword);

      if (res.status === 200) {
        // 1. Eliminar el token de memoria
        clearToken();
        // 2. Limpiar los campos de contraseña
        setNuevaPassword("");
        setConfirmarPassword("");
        // 3. Mostrar que la contraseña fue actualizada
        setFeedback({
          type: "success",
          message: "Tu contraseña ha sido actualizada exitosamente. Redirigiendo al inicio de sesión...",
        });
        // 4. Redirigir al login sin iniciar sesión
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        // Token inválido, utilizado, revocado o vencido
        // 1. Eliminar token de memoria y deshabilitar formulario
        clearToken();
        // 2. Mostrar mensaje claro
        setFeedback({
          type: "error",
          message:
            "El enlace de recuperación ya no es válido, ha expirado o ya fue utilizado. Por favor solicita uno nuevo.",
        });
      }
    } catch {
      // En caso de fallo de red
      setFeedback({
        type: "error",
        message: "No fue posible conectar con el servidor. Intente nuevamente más tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Estado 1: Verificando token al montar
  if (tokenStatus === "checking") {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
        <p className="text-sm font-medium text-slate-600">Verificando enlace de recuperación...</p>
      </div>
    );
  }

  // Estado 2: Token inexistente o inválido
  if (tokenStatus === "invalid") {
    return (
      <div className="rounded-lg border border-red-200 bg-white p-6 sm:p-8 text-center shadow-xs space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900">
            Enlace no válido o expirado
          </h2>
          <p className="text-sm text-slate-600">
            El enlace de recuperación no es válido. Solicita uno nuevo.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/recuperar-clave"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            Solicitar nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  // Estado 3: Formulario con token válido en memoria
  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="space-y-6"
      aria-label="Formulario de restablecimiento de contraseña"
    >
      {/* Mensaje de retroalimentación si existe */}
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

      {/* Campo: Nueva Contraseña */}
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
            placeholder="Ingrese su nueva contraseña"
            value={nuevaPassword}
            onChange={(e) => {
              setNuevaPassword(e.target.value);
              setNuevaDirty(true);
              setFeedback(null);
            }}
            disabled={isSubmitting}
            className="w-full rounded-md border border-slate-400 bg-white px-3.5 py-2 pr-10 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
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
      </div>

      {/* Campo: Confirmar Contraseña */}
      <div className="space-y-1.5">
        <label
          htmlFor={confirmPassId}
          className="block text-sm font-semibold text-slate-800"
        >
          Confirmar Contraseña:
        </label>
        <div className="relative flex items-center">
          <input
            id={confirmPassId}
            type={showConfirm ? "text" : "password"}
            placeholder="Repita su nueva contraseña"
            value={confirmarPassword}
            onChange={(e) => {
              setConfirmarPassword(e.target.value);
              setConfirmDirty(true);
              setFeedback(null);
            }}
            disabled={isSubmitting}
            className="w-full rounded-md border border-slate-400 bg-white px-3.5 py-2 pr-10 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
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
      </div>

      {/* Checklist visual reactivo de condiciones */}
      {(nuevaDirty || confirmDirty) && (
        <div className="space-y-1.5 rounded-md bg-slate-50 p-3 text-xs text-slate-700 border border-slate-200">
          <p className="font-semibold text-slate-800">Condiciones de la contraseña:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
            <li className={`flex items-center gap-1.5 ${requirements.hasMinLength ? "text-green-700 font-medium" : "text-slate-500"}`}>
              <span>{requirements.hasMinLength ? "✓" : "○"}</span> Entre 12 y 200 caracteres
            </li>
            <li className={`flex items-center gap-1.5 ${requirements.hasUpper ? "text-green-700 font-medium" : "text-slate-500"}`}>
              <span>{requirements.hasUpper ? "✓" : "○"}</span> Al menos una letra mayúscula
            </li>
            <li className={`flex items-center gap-1.5 ${requirements.hasLower ? "text-green-700 font-medium" : "text-slate-500"}`}>
              <span>{requirements.hasLower ? "✓" : "○"}</span> Al menos una letra minúscula
            </li>
            <li className={`flex items-center gap-1.5 ${requirements.hasNumber ? "text-green-700 font-medium" : "text-slate-500"}`}>
              <span>{requirements.hasNumber ? "✓" : "○"}</span> Al menos un número
            </li>
            <li className={`flex items-center gap-1.5 ${requirements.hasSymbol ? "text-green-700 font-medium" : "text-slate-500"}`}>
              <span>{requirements.hasSymbol ? "✓" : "○"}</span> Al menos un símbolo (!@#$...)
            </li>
            <li className={`flex items-center gap-1.5 ${requirements.passwordsMatch ? "text-green-700 font-medium" : "text-slate-500"}`}>
              <span>{requirements.passwordsMatch ? "✓" : "○"}</span> Las contraseñas coinciden
            </li>
          </ul>
        </div>
      )}

      {/* Botón de envío deshabilitado según condiciones */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting || !requirements.isValid || !token}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? "Restableciendo contraseña..." : "Restablecer Contraseña"}
        </button>
      </div>

      {/* Enlace para volver a Iniciar Sesión */}
      <div className="pt-2">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 rounded-xs"
        >
          ← Volver a Iniciar Sesión
        </Link>
      </div>
    </form>
  );
}
