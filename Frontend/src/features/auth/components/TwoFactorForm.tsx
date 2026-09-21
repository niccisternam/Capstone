"use client";

import React, { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cleanNumericCode, validateTwoFactorCode } from "../schemas/two-factor.schema";
import { verifyCode, resendCode } from "@/api/auth.api";
import { setAccessToken, parseJwtPayload } from "@/api/client";

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
  const challengeId = queryChallenge || storedChallenge;

  const [recordarSesion, setRecordarSesion] = useState<boolean>(queryRecordar);

  // 6 casillas individuales para los dígitos
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
    inputRefs.current[0]?.focus();
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

  // Manejo de pegado en cualquiera de las casillas
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, startIndex: number) => {
    e.preventDefault();
    setTouched(true);
    setFeedback(null);

    const pastedText = e.clipboardData.getData("text");
    const cleaned = cleanNumericCode(pastedText);

    if (!cleaned) return;

    const newDigits = [...digits];
    // Si pega 6 dígitos completos, llenamos desde el inicio o desde donde esté
    const targetStart = cleaned.length === 6 ? 0 : startIndex;

    for (let i = 0; i < cleaned.length && targetStart + i < 6; i++) {
      newDigits[targetStart + i] = cleaned[i];
    }

    setDigits(newDigits);

    // Validar el nuevo código completo
    const updatedFullCode = newDigits.join("");
    if (updatedFullCode.length === 6) {
      setCodeError(validateTwoFactorCode(updatedFullCode));
    } else {
      setCodeError(null);
    }

    // Foco en la siguiente casilla libre o en la última
    const nextEmptyIndex = newDigits.findIndex((d) => d === "");
    const focusTarget = nextEmptyIndex !== -1 ? nextEmptyIndex : 5;
    inputRefs.current[focusTarget]?.focus();
  };

  // Manejo de cambio en cada casilla individual
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const rawVal = e.target.value;
    setTouched(true);
    setFeedback(null);

    // Filtrar caracteres no numéricos al escribir
    const numericOnly = cleanNumericCode(rawVal);

    if (!numericOnly) {
      const newDigits = [...digits];
      newDigits[index] = "";
      setDigits(newDigits);
      setCodeError(null);
      return;
    }

    // Tomar solo el último dígito ingresado
    const digit = numericOnly.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    const updatedCode = newDigits.join("");
    if (updatedCode.length === 6) {
      setCodeError(validateTwoFactorCode(updatedCode));
    } else {
      setCodeError(null);
    }

    // Salto automático a la siguiente casilla
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Manejo de teclas especiales (Backspace, Flechas)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      setFeedback(null);

      const newDigits = [...digits];

      if (digits[index] !== "") {
        // Borrar el dígito actual
        newDigits[index] = "";
        setDigits(newDigits);
        setCodeError(null);
      } else if (index > 0) {
        // Si ya estaba vacío, retroceder y borrar el anterior
        newDigits[index - 1] = "";
        setDigits(newDigits);
        setCodeError(null);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Envío del código de verificación
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(true);

    const err = validateTwoFactorCode(fullCode);
    setCodeError(err);

    if (err) {
      const firstEmptyIndex = digits.findIndex((d) => d === "");
      const target = firstEmptyIndex !== -1 ? firstEmptyIndex : 0;
      inputRefs.current[target]?.focus();
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
        <div
          role="alert"
          className={`rounded-md p-3 text-sm font-medium transition-all ${
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
        <div
          className="flex items-center justify-start gap-2 sm:gap-3.5"
          role="group"
          aria-label="Casillas de código de verificación de 6 dígitos"
        >
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              id={`otp-digit-${index}`}
              name={`otp-digit-${index}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={digit}
              disabled={isSubmitting}
              onPaste={(e) => handlePaste(e, index)}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-label={`Dígito ${index + 1} de 6`}
              aria-invalid={touched && !!codeError}
              className={`h-12 w-11 sm:h-14 sm:w-13 rounded-md border-2 bg-white text-center text-xl sm:text-2xl font-bold text-slate-900 shadow-xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-1 ${
                touched && codeError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-400"
                  : "border-slate-700 focus:border-blue-600 focus:ring-blue-500"
              }`}
            />
          ))}
        </div>

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
