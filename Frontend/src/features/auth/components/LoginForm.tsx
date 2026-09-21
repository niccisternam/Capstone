"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  loginSchema,
  validateEmailField,
  validatePasswordField,
} from "../schemas/login.schema";
import { login } from "@/api/auth.api";

export function LoginForm() {
  const router = useRouter();
  const correoInputId = useId();
  const correoErrorId = useId();
  const passwordInputId = useId();
  const passwordErrorId = useId();
  const recordarId = useId();

  // Estados de los campos
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [recordarSesion, setRecordarSesion] = useState(false);

  // Control de interacción: la validación solo se activa cuando el usuario escribe
  const [correoDirty, setCorreoDirty] = useState(false);
  const [passwordDirty, setPasswordDirty] = useState(false);

  // Errores específicos
  const [correoError, setCorreoError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Estados de retroalimentación y envío
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Manejador en tiempo real para Correo Electrónico
  const handleCorreoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCorreo(value);
    setCorreoDirty(true);
    setFeedback(null);

    // Validación en tiempo real usando el esquema Zod
    const error = validateEmailField(value);
    setCorreoError(error);
  };

  // Manejador en tiempo real para Contraseña
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordDirty(true);
    setFeedback(null);

    // Validación en tiempo real usando el esquema Zod (preserva mayúsculas, minúsculas y símbolos)
    const error = validatePasswordField(value);
    setPasswordError(error);
  };

  // Manejador de envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Activar estados dirty al intentar enviar
    setCorreoDirty(true);
    setPasswordDirty(true);

    const emailErr = validateEmailField(correo);
    const passErr = validatePasswordField(password);

    setCorreoError(emailErr);
    setPasswordError(passErr);

    if (emailErr || passErr) {
      if (emailErr) {
        document.getElementById(correoInputId)?.focus();
      } else {
        document.getElementById(passwordInputId)?.focus();
      }
      return;
    }

    // Normalizar mediante Zod (elimina espacios y convierte a minúsculas el correo)
    const parseResult = loginSchema.safeParse({
      correo,
      password,
      recordarSesion,
    });

    if (!parseResult.success) {
      setFeedback({
        type: "error",
        message: "Por favor corrija los errores del formulario.",
      });
      return;
    }

    const { correo: correoNormalizado, password: passwordOriginal } = parseResult.data;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await login({
        correo: correoNormalizado,
        password: passwordOriginal,
      });

      if (res.status === 200) {
        const data = res.data as {
          estado?: string;
          challengeId?: string;
          passwordChangeToken?: string;
        } | undefined;

        if (data?.estado === "CAMBIO_PASSWORD_REQUERIDO" && data.passwordChangeToken) {
          setFeedback({
            type: "info",
            message: "Primer acceso detectado. Redirigiendo a definir contraseña...",
          });
          if (typeof window !== "undefined") {
            sessionStorage.setItem("capstone_password_change_token", data.passwordChangeToken);
            sessionStorage.setItem("capstone_first_access_correo", correoNormalizado);
          }
          router.push(
            `/primer-ingreso?token=${encodeURIComponent(data.passwordChangeToken)}&correo=${encodeURIComponent(correoNormalizado)}`
          );
          return;
        }

        if (data?.estado === "CODIGO_REQUERIDO" && data.challengeId) {
          setFeedback({
            type: "success",
            message: "Código enviado a su correo. Redirigiendo a verificación...",
          });
          if (typeof window !== "undefined") {
            sessionStorage.setItem("capstone_challenge_id", data.challengeId);
          }
          router.push(
            `/verificar-codigo?challengeId=${encodeURIComponent(data.challengeId)}&recordar=${recordarSesion}`
          );
          return;
        }

        setFeedback({
          type: "success",
          message: "Credenciales verificadas. Redirigiendo...",
        });
      } else if (res.status === 401) {
        setFeedback({
          type: "error",
          message: "Correo o contraseña incorrectos. Verifique sus credenciales.",
        });
      } else if (res.status === 429) {
        setFeedback({
          type: "error",
          message: "Demasiados intentos. Por favor espere unos minutos.",
        });
      } else {
        const errData = res.data as { message?: string } | undefined;
        setFeedback({
          type: "error",
          message: errData?.message ?? `Error en el inicio de sesión (código ${res.status}).`,
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "No fue posible conectar con el servidor. Intente nuevamente más tarde.",
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
      aria-label="Formulario de inicio de sesión"
    >
      {/* Mensaje global de feedback si existe */}
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

      {/* Campo: Correo Electrónico */}
      <div className="space-y-1.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
          <label
            htmlFor={correoInputId}
            className="text-sm font-medium text-slate-800 sm:w-44 shrink-0"
          >
            Correo Electrónico
          </label>
          <div className="w-full">
            <input
              id={correoInputId}
              name="correo"
              type="email"
              autoComplete="email"
              placeholder="ejemplo@empresa.cl"
              value={correo}
              onChange={handleCorreoChange}
              disabled={isSubmitting}
              aria-invalid={correoDirty && !!correoError}
              aria-describedby={correoDirty && correoError ? correoErrorId : undefined}
              className={`w-full rounded-md border bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-1 ${
                correoDirty && correoError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-400"
                  : "border-slate-400 focus:border-blue-600 focus:ring-blue-500"
              }`}
            />
          </div>
        </div>
        {/* Contenedor del mensaje de error inferior */}
        {correoDirty && correoError && (
          <div className="sm:pl-48">
            <p id={correoErrorId} role="alert" className="text-xs font-medium text-red-600">
              {correoError}
            </p>
          </div>
        )}
      </div>

      {/* Campo: Contraseña */}
      <div className="space-y-1.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
          <label
            htmlFor={passwordInputId}
            className="text-sm font-medium text-slate-800 sm:w-44 shrink-0"
          >
            Contraseña:
          </label>
          <div className="w-full">
            <input
              id={passwordInputId}
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              disabled={isSubmitting}
              aria-invalid={passwordDirty && !!passwordError}
              aria-describedby={passwordDirty && passwordError ? passwordErrorId : undefined}
              className={`w-full rounded-md border bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-1 ${
                passwordDirty && passwordError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-400"
                  : "border-slate-400 focus:border-blue-600 focus:ring-blue-500"
              }`}
            />
          </div>
        </div>
        {/* Contenedor del mensaje de error inferior */}
        {passwordDirty && passwordError && (
          <div className="sm:pl-48">
            <p id={passwordErrorId} role="alert" className="text-xs font-medium text-red-600">
              {passwordError}
            </p>
          </div>
        )}
      </div>

      {/* Opción: Recordar la conexión */}
      <div className="sm:pl-48">
        <label
          htmlFor={recordarId}
          className="inline-flex cursor-pointer items-center gap-2 select-none"
        >
          <input
            id={recordarId}
            type="checkbox"
            checked={recordarSesion}
            onChange={(e) => setRecordarSesion(e.target.checked)}
            disabled={isSubmitting}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          />
          <span className="text-xs font-medium text-slate-700">
            Recordar la conexión
          </span>
        </label>
      </div>

      {/* Acciones: Botón Ingresar y ¿Olvidó su contraseña? */}
      <div className="flex flex-wrap items-center gap-4 pt-2 sm:pl-48">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-1.5 rounded-md border-2 border-slate-700 bg-slate-100 px-5 py-1.5 text-sm font-semibold text-slate-800 shadow-xs transition-all hover:bg-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? (
            <span>Ingresando...</span>
          ) : (
            <>
              <span>Ingresar</span>
              <svg
                aria-hidden="true"
                className="h-3.5 w-3.5 text-slate-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </>
          )}
        </button>

        <Link
          href="/recuperar-clave"
          className="text-xs font-medium text-blue-600 underline underline-offset-4 transition-colors hover:text-blue-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded-xs"
        >
          ¿Olvidó su contraseña?
        </Link>
      </div>
    </form>
  );
}
