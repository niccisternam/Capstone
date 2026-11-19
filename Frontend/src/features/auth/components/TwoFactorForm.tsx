"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { validateTwoFactorCode } from "../schemas/two-factor.schema";
import { verifyCode, resendCode } from "@/api/auth.api";
import { setAccessToken, parseJwtPayload } from "@/api/client";
import { Alert } from "@/components/feedback/Alert";
import { OtpInput } from "./OtpInput";

export function TwoFactorForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryChallenge = searchParams.get("challengeId") ?? "";
  const queryRecordar = searchParams.get("recordar") === "true";

  const emptySubscribe = () => () => {};

  const storedChallenge = useSyncExternalStore(
    emptySubscribe,
    () => (typeof window !== "undefined" ? sessionStorage.getItem("capstone_challenge_id") : null) ?? "",
    () => ""
  );
  // Tras reenviar el código, Express revoca el desafío anterior y emite uno nuevo:
  // el challengeId adoptado en memoria manda sobre la URL y sessionStorage.
  const [resentChallengeId, setResentChallengeId] = useState<string>("");
  const challengeId = resentChallengeId || queryChallenge || storedChallenge;

  const [recordarSesion, setRecordarSesion] = useState<boolean>(queryRecordar);

  // 6 casillas individuales para los dígitos
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);

  // Estados de validación y retroalimentación
  const [touched, setTouched] = useState<boolean>(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Estado para cooldown de reenvío de código
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [isResending, setIsResending] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined" && queryChallenge) {
      sessionStorage.setItem("capstone_challenge_id", queryChallenge);
    }
    // Auto-foco en la primera casilla al montar
    document.getElementById("otp-digit-0")?.focus();
  }, [queryChallenge]);

  // Manejo del temporizador de reenvío
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const fullCode = digits.join("");

  const handleDigitsChange = (nextDigits: string[]) => {
    setTouched(true);
    setFeedback(null);
    setDigits(nextDigits);

    const updatedCode = nextDigits.join("");
    setCodeError(updatedCode.length === 6 ? validateTwoFactorCode(updatedCode) : null);
  };

  // Envío del código de verificación
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(true);

    const err = validateTwoFactorCode(fullCode);
    setCodeError(err);

    if (err) {
      const firstEmptyIndex = digits.findIndex((d) => d === "");
      document.getElementById(`otp-digit-${firstEmptyIndex !== -1 ? firstEmptyIndex : 0}`)?.focus();
      return;
    }

    if (!challengeId) {
      setFeedback({
        type: "error",
        message: "No se encontró un desafío de inicio de sesión activo. Por favor vuelva a identificarse.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await verifyCode(challengeId, fullCode, recordarSesion);

      if (res.status === 200) {
        const verifyData = res.data as { accessToken?: string; [key: string]: unknown };
        const token = typeof verifyData?.accessToken === "string" ? verifyData.accessToken : null;

        if (token) {
          setAccessToken(token);
        }

        const payload = token ? parseJwtPayload(token) : null;
        const isAdmin = payload?.rol === "ADMINISTRADOR";

        setFeedback({
          type: "success",
          message: "Autenticación exitosa. Redirigiendo...",
        });
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("capstone_challenge_id");
        }

        // Redirigir según el rol del usuario autenticado
        setTimeout(() => {
          if (isAdmin) {
            router.push("/admin/solicitudes");
          } else {
            router.push("/usuario");
          }
        }, 1000);
      } else if (res.status === 400 || res.status === 401) {
        setFeedback({
          type: "error",
          message: "Código incorrecto o expirado. Verifique el código recibido.",
        });
      } else if (res.status === 429) {
        setFeedback({
          type: "error",
          message: "Demasiados intentos fallidos. Espere unos minutos antes de intentar.",
        });
      } else {
        const errData = res.data as { message?: string } | undefined;
        setFeedback({
          type: "error",
          message: errData?.message ?? `Error en la verificación (código ${res.status}).`,
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "No fue posible conectar con el servidor. Intente más tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reenvío del código por correo
  const handleResend = async () => {
    if (!challengeId || isResending || resendCooldown > 0) return;

    setIsResending(true);
    setFeedback(null);

    try {
      const res = await resendCode(challengeId);
      if (res.status === 200) {
        const data = res.data as { challengeId?: string } | undefined;
        const nextChallengeId =
          typeof data?.challengeId === "string" && data.challengeId.length > 0 ? data.challengeId : null;

        if (nextChallengeId) {
          // El código recién enviado pertenece al nuevo desafío: se adopta antes de que el
          // usuario lo escriba y se sincroniza en sessionStorage y en la URL para recargas.
          setResentChallengeId(nextChallengeId);
          if (typeof window !== "undefined") {
            sessionStorage.setItem("capstone_challenge_id", nextChallengeId);
          }
          const params = new URLSearchParams({ challengeId: nextChallengeId });
          if (recordarSesion) params.set("recordar", "true");
          router.replace(`/verificar-codigo?${params.toString()}`, { scroll: false });
        }

        // El código anterior dejó de ser válido: se limpian las casillas y el error.
        setDigits(["", "", "", "", "", ""]);
        setCodeError(null);
        document.getElementById("otp-digit-0")?.focus();
        setFeedback({
          type: "info",
          message: "Se ha enviado un nuevo código a su correo electrónico.",
        });
        setResendCooldown(60); // 60 segundos de cooldown
      } else {
        const errData = res.data as { message?: string } | undefined;
        setFeedback({
          type: "error",
          message: errData?.message ?? "No se pudo reenviar el código en este momento.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Error de conexión al solicitar un nuevo código.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="space-y-6"
      aria-label="Formulario de autenticación en dos pasos"
    >
      {/* Subtítulo dentro de la tarjeta al estilo del mockup */}
      <div className="text-left">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Autentificación 2FA
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Ingrese el código de 6 dígitos numéricos enviado a su correo.
        </p>
      </div>

      {/* Alerta de feedback general */}
      {feedback && (
        <Alert type={feedback.type} className="p-3">
          {feedback.message}
        </Alert>
      )}

      {/* Aviso si falta challengeId */}
      {!challengeId && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <span>
            No se detectó un inicio de sesión previo.{" "}
            <a href="/login" className="font-semibold underline">
              Ir al inicio de sesión
            </a>
          </span>
        </div>
      )}

      {/* Contenedor de las 6 casillas numéricas */}
      <div className="space-y-2">
        <OtpInput
          digits={digits}
          onChange={handleDigitsChange}
          disabled={isSubmitting}
          invalid={touched && !!codeError}
        />

        {/* Error inferior si no cumple las reglas */}
        {touched && codeError && (
          <p id="code-error" role="alert" className="text-xs font-medium text-red-600">
            {codeError}
          </p>
        )}
      </div>

      {/* Fila de acciones: Botón Verificar código y Checkbox Recordarme */}
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isSubmitting || fullCode.length !== 6}
          className="inline-flex items-center justify-center rounded-md border-2 border-slate-700 bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-800 shadow-xs transition-all hover:bg-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? "Verificando..." : "Verificar código"}
        </button>

        <label
          htmlFor="recordarme-2fa"
          className="inline-flex cursor-pointer items-center gap-2 select-none"
        >
          <input
            id="recordarme-2fa"
            type="checkbox"
            checked={recordarSesion}
            onChange={(e) => setRecordarSesion(e.target.checked)}
            disabled={isSubmitting}
            className="h-4 w-4 rounded border-slate-400 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          />
          <span className="text-xs font-medium text-slate-700">
            Recordarme
          </span>
        </label>
      </div>

      {/* Enlace para reenvío de código */}
      {challengeId && (
        <div className="pt-2 text-left">
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || resendCooldown > 0}
            className="text-xs font-medium text-blue-600 underline underline-offset-4 transition-colors hover:text-blue-800 disabled:text-slate-400 disabled:no-underline"
          >
            {resendCooldown > 0
              ? `Reenviar código en ${resendCooldown}s`
              : isResending
                ? "Reenviando código..."
                : "¿No recibió el código? Reenviar"}
          </button>
        </div>
      )}
    </form>
  );
}
