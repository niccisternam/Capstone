"use client";

import React, { useState, useId } from "react";
import Link from "next/link";
import { recoverySchema, validateRecoveryEmail } from "../schemas/recovery.schema";
import { forgotPassword } from "@/api/auth.api";

export function RecoveryForm() {
  const correoId = useId();
  const errorId = useId();

  const [correo, setCorreo] = useState<string>("");
  const [correoDirty, setCorreoDirty] = useState<boolean>(false);
  const [correoError, setCorreoError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const handleCorreoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCorreo(val);
    setCorreoDirty(true);
    setFeedback(null);

    const err = validateRecoveryEmail(val);
    setCorreoError(err);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCorreoDirty(true);

    const err = validateRecoveryEmail(correo);
    setCorreoError(err);

    if (err) {
      document.getElementById(correoId)?.focus();
      return;
    }

    const parseResult = recoverySchema.safeParse({ correo });
    if (!parseResult.success) {
      setFeedback({
        type: "error",
        message: "Por favor ingrese un correo electrónico válido.",
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await forgotPassword(parseResult.data.correo);

      // El backend Express responde 200 o 202 con respuesta genérica anti-enumeración
      if (res.status === 200 || res.status === 202) {
        setFeedback({
          type: "success",
          message:
            "Si existe una cuenta asociada a este correo, se enviará un enlace de recuperación seguro con vigencia de 15 minutos. Por favor revisa tu bandeja de entrada y la carpeta de spam.",
        });
      } else if (res.status === 429) {
        setFeedback({
          type: "error",
          message:
            "Se han realizado demasiadas solicitudes recientemente. Por favor espere unos minutos antes de intentar nuevamente.",
        });
      } else {
        const errData = res.data as { message?: string } | undefined;
        setFeedback({
          type: "error",
          message:
            errData?.message ??
            `Ocurrió un error al procesar la solicitud (código ${res.status}).`,
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
      aria-label="Formulario de recuperación de contraseña"
    >
      {/* Caja de mensaje informativo destacada en el mockup */}
      <div
        role="note"
        aria-label="Información de vigencia del enlace"
        className="rounded-md border-2 border-slate-700 bg-white p-3.5 text-xs sm:text-sm font-medium text-slate-800 shadow-xs"
      >
        <p>Te enviaremos un enlace de recuperación seguro con vigencia de 15 min.</p>
      </div>

      {/* Alerta de feedback general si existe */}
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

      {/* Campo: Correo Electrónico Registrado */}
      <div className="space-y-1.5">
        <label
          htmlFor={correoId}
          className="block text-sm font-semibold text-slate-800"
        >
          Correo Electrónico Registrado:
        </label>
        <div className="relative">
          <input
            id={correoId}
            name="correo"
            type="email"
            autoComplete="email"
            placeholder="ejem: carlos.soto@panaderia.cl"
            value={correo}
            onChange={handleCorreoChange}
            disabled={isSubmitting}
            aria-invalid={correoDirty && !!correoError}
            aria-describedby={correoDirty && correoError ? errorId : undefined}
            className={`w-full rounded-md border bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-1 ${
              correoDirty && correoError
                ? "border-red-500 focus:border-red-500 focus:ring-red-400"
                : "border-slate-400 focus:border-blue-600 focus:ring-blue-500"
            }`}
          />
        </div>

        {/* Error inferior */}
        {correoDirty && correoError && (
          <p id={errorId} role="alert" className="text-xs font-medium text-red-600">
            {correoError}
          </p>
        )}
      </div>

      {/* Botón de acción */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? "Enviando enlace..." : "Enviar Enlace de Recuperación"}
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
