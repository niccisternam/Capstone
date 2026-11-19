"use client";

import React, { useState, useEffect, useId, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  checkResetPasswordRequirements,
  resetPasswordFieldsSchema,
} from "../schemas/reset-password.schema";
import { resetPassword, validateResetPasswordToken } from "@/api/auth.api";
import { Alert } from "@/components/feedback/Alert";
import { PasswordField } from "@/components/ui/PasswordField";
import { RequirementList } from "@/components/ui/RequirementList";

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

  // El token solo se considera válido tras confirmarlo con el backend: así un enlace
  // ya usado muestra su propio aviso al abrirlo, no el formulario.
  const [serverTokenStatus, setServerTokenStatus] = useState<
    "checking" | "valid" | "used" | "invalid" | "error" | null
  >(null);
  const [linkUsed, setLinkUsed] = useState<boolean>(false);

  useEffect(() => {
    if (!token) return;
    let active = true;
    validateResetPasswordToken(token)
      .then((res) => {
        if (!active) return;
        const estado = (res.data as { estado?: string } | undefined)?.estado;
        setServerTokenStatus(
          estado === "VALIDO" ? "valid" : estado === "USADO" ? "used" : "invalid",
        );
      })
      .catch(() => {
        if (active) setServerTokenStatus("error");
      });
    return () => {
      active = false;
    };
  }, [token]);

  const tokenStatus: "checking" | "valid" | "used" | "invalid" | "error" =
    token === null ? "checking" : token === "" ? "invalid" : serverTokenStatus ?? "checking";

  // Campos de contraseña (no se aplica trim)
  const [nuevaPassword, setNuevaPassword] = useState<string>("");
  const [confirmarPassword, setConfirmarPassword] = useState<string>("");

  // Estados de interacción para validación
  const [nuevaDirty, setNuevaDirty] = useState<boolean>(false);
  const [confirmDirty, setConfirmDirty] = useState<boolean>(false);

  // Estados de envío y retroalimentación
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
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
        // 1. Eliminar el token de memoria (el backend lo marca como usado)
        clearToken();
        // 2. Limpiar los campos de contraseña
        setNuevaPassword("");
        setConfirmarPassword("");
        // 3. Mostrar la confirmación antes de redirigir. `completed` evita que el estado
        //    "invalid" (el token ya no existe en memoria) sustituya el mensaje de éxito.
        setCompleted(true);
        // 4. Redirigir al login sin iniciar sesión
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else if (res.status === 400) {
        // Contraseña reutilizada o payload inválido: el token sigue vigente y el
        // usuario puede corregir la contraseña sin solicitar un enlace nuevo.
        const errData = res.data as { error?: { message?: string } } | undefined;
        setFeedback({
          type: "error",
          message:
            errData?.error?.message ??
            "La contraseña no puede ser idéntica a la anterior.",
        });
      } else if (res.status === 410) {
        // El enlace ya se usó para cambiar la contraseña
        clearToken();
        setLinkUsed(true);
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

  // Estado 0: contraseña restablecida. Se muestra la confirmación antes de redirigir
  // (el token ya fue eliminado de memoria, pero la vista de éxito tiene prioridad).
  if (completed) {
    return (
      <div role="alert" className="rounded-lg border border-green-200 bg-white p-6 sm:p-8 text-center shadow-xs space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900">
            Contraseña actualizada
          </h2>
          <p className="text-sm font-medium text-green-700">
            Tu contraseña ha sido actualizada exitosamente. Redirigiendo al inicio de sesión...
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            Ir a Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  // Estado 1: el enlace ya se usó para cambiar la contraseña
  if (linkUsed || tokenStatus === "used") {
    return (
      <div className="rounded-lg border border-amber-200 bg-white p-6 sm:p-8 text-center shadow-xs space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900">
            Enlace ya utilizado
          </h2>
          <p className="text-sm text-slate-600">
            Ya se realizó el cambio de contraseña con este enlace. Solicita uno nuevo si necesitas cambiarla nuevamente.
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

  // Estado 2: Verificando token al montar
  if (tokenStatus === "checking") {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" />
        <p className="text-sm font-medium text-slate-600">Verificando enlace de recuperación...</p>
      </div>
    );
  }

  // Estado 3: no fue posible verificar el enlace
  if (tokenStatus === "error") {
    return (
      <div className="rounded-lg border border-red-200 bg-white p-6 sm:p-8 text-center shadow-xs space-y-3">
        <h2 className="text-base font-bold text-slate-900">
          No fue posible verificar el enlace
        </h2>
        <p className="text-sm text-slate-600">
          No se pudo conectar con el servidor. Abre nuevamente el enlace desde tu correo.
        </p>
      </div>
    );
  }

  // Estado 4: Token inexistente o inválido
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

  // Estado 5: Formulario con token válido en memoria
  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="space-y-6"
      aria-label="Formulario de restablecimiento de contraseña"
    >
      {/* Mensaje de retroalimentación si existe */}
      {feedback && <Alert type={feedback.type}>{feedback.message}</Alert>}

      {/* Campo: Nueva Contraseña */}
      <PasswordField
        id={nuevaPassId}
        label="Nueva Contraseña:"
        placeholder="Ingrese su nueva contraseña"
        value={nuevaPassword}
        onChange={(value) => {
          setNuevaPassword(value);
          setNuevaDirty(true);
          setFeedback(null);
        }}
        disabled={isSubmitting}
      />

      {/* Campo: Confirmar Contraseña */}
      <PasswordField
        id={confirmPassId}
        label="Confirmar Contraseña:"
        placeholder="Repita su nueva contraseña"
        value={confirmarPassword}
        onChange={(value) => {
          setConfirmarPassword(value);
          setConfirmDirty(true);
          setFeedback(null);
        }}
        disabled={isSubmitting}
      />

      {/* Checklist visual reactivo de condiciones */}
      {(nuevaDirty || confirmDirty) && (
        <div className="space-y-1.5 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
          <p className="font-semibold text-slate-800">Condiciones de la contraseña:</p>
          <RequirementList
            items={[
              { label: "Entre 12 y 200 caracteres", met: requirements.hasMinLength },
              { label: "Al menos una letra mayúscula", met: requirements.hasUpper },
              { label: "Al menos una letra minúscula", met: requirements.hasLower },
              { label: "Al menos un número", met: requirements.hasNumber },
              { label: "Al menos un símbolo (!@#$...)", met: requirements.hasSymbol },
              { label: "Las contraseñas coinciden", met: requirements.passwordsMatch },
            ]}
          />
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
