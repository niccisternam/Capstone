"use client";

import React, { useState } from "react";
import Link from "next/link";
import { createAccountRequest, type AccountRequestItem } from "@/api/accountRequests.api";
import {
  createAccountRequestFormSchema,
  formatRutInput,
  validateAccountRequestField,
  type CreateAccountRequestFormData,
} from "../schemas/create-account-request.schema";

const INITIAL_FORM_DATA: CreateAccountRequestFormData = {
  rutEmpresa: "",
  razonSocial: "",
  rutUsuario: "",
  nombre: "",
  apellido: "",
  correo: "",
  descripcion: "",
};

export function AccountRequestForm() {
  const [formData, setFormData] = useState<CreateAccountRequestFormData>(INITIAL_FORM_DATA);
  const [dirty, setDirty] = useState<Record<keyof CreateAccountRequestFormData, boolean>>({
    rutEmpresa: false,
    razonSocial: false,
    rutUsuario: false,
    nombre: false,
    apellido: false,
    correo: false,
    descripcion: false,
  });
  const [errors, setErrors] = useState<Record<keyof CreateAccountRequestFormData, string | null>>({
    rutEmpresa: null,
    razonSocial: null,
    rutUsuario: null,
    nombre: null,
    apellido: null,
    correo: null,
    descripcion: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [createdRequest, setCreatedRequest] = useState<AccountRequestItem | null>(null);

  const handleRutChange = (field: "rutEmpresa" | "rutUsuario", rawValue: string) => {
    const formatted = formatRutInput(rawValue);
    setFormData((prev) => ({ ...prev, [field]: formatted }));

    if (dirty[field]) {
      const err = validateAccountRequestField(field, formatted);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleInputChange = (
    field: keyof CreateAccountRequestFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (dirty[field]) {
      const err = validateAccountRequestField(field, value);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleBlur = (field: keyof CreateAccountRequestFormData) => {
    setDirty((prev) => ({ ...prev, [field]: true }));
    const err = validateAccountRequestField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Marcar todos los campos como dirty
    setDirty({
      rutEmpresa: true,
      razonSocial: true,
      rutUsuario: true,
      nombre: true,
      apellido: true,
      correo: true,
      descripcion: true,
    });

    const validationResult = createAccountRequestFormSchema.safeParse(formData);

    if (!validationResult.success) {
      const newErrors: Record<keyof CreateAccountRequestFormData, string | null> = {
        rutEmpresa: null,
        razonSocial: null,
        rutUsuario: null,
        nombre: null,
        apellido: null,
        correo: null,
        descripcion: null,
      };

      for (const issue of validationResult.error.issues) {
        const field = issue.path[0] as keyof CreateAccountRequestFormData;
        if (field && !newErrors[field]) {
          newErrors[field] = issue.message;
        }
      }

      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createAccountRequest({
        rutEmpresa: validationResult.data.rutEmpresa,
        razonSocial: validationResult.data.razonSocial,
        rutUsuario: validationResult.data.rutUsuario,
        nombre: validationResult.data.nombre,
        apellido: validationResult.data.apellido,
        correo: validationResult.data.correo,
        descripcion: validationResult.data.descripcion,
      });

      if (res.status === 201 && res.data?.solicitud) {
        setCreatedRequest(res.data.solicitud);
      } else {
        const errorData = (res.data as { error?: { code?: string; message?: string } })?.error;
        if (res.status === 409) {
          if (errorData?.code === "COMPANY_ALREADY_REGISTERED") {
            setServerError("La empresa informada ya tiene un usuario cliente registrado en el sistema.");
          } else if (errorData?.code === "ACCOUNT_REQUEST_DUPLICATE") {
            setServerError("Ya existe una solicitud pendiente o un usuario con estos datos (RUT o correo).");
          } else {
            setServerError(errorData?.message || "Conflicto con una solicitud o registro existente.");
          }
        } else {
          setServerError(
            errorData?.message ||
              `Ocurrió un error al enviar la solicitud (código ${res.status}). Por favor intenta más tarde.`
          );
        }
      }
    } catch {
      setServerError("Error de comunicación con el servidor. Verifica tu conexión e intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pantalla de éxito tras registrar la solicitud
  if (createdRequest) {
    return (
      <div className="rounded-2xl border-2 border-slate-700 bg-white p-6 shadow-sm sm:p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          ¡Solicitud enviada con éxito!
        </h2>

        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
          Tu solicitud de cuenta ha quedado registrada bajo el estado{" "}
          <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
            Pendiente de revisión
          </span>
          . Un administrador verificará los antecedentes de tu empresa en el SII.
        </p>

        {/* Resumen del folio y datos enviados */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-xs sm:text-sm text-slate-700 space-y-2 max-w-lg mx-auto">
          <div className="flex justify-between border-b border-slate-200 pb-1.5">
            <span className="font-semibold text-slate-500">Folio:</span>
            <span className="font-mono font-bold text-slate-900">{createdRequest.idSolicitud}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-1.5">
            <span className="font-semibold text-slate-500">Empresa:</span>
            <span className="font-medium text-slate-900">{createdRequest.razonSocial ?? formData.razonSocial}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-1.5">
            <span className="font-semibold text-slate-500">RUT Empresa:</span>
            <span className="font-mono text-slate-900">{createdRequest.rutEmpresa}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-1.5">
            <span className="font-semibold text-slate-500">Solicitante:</span>
            <span className="font-medium text-slate-900">{createdRequest.nombre} {createdRequest.apellido}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-slate-500">Correo de contacto:</span>
            <span className="font-medium text-slate-900">{createdRequest.correo}</span>
          </div>
        </div>

        <p className="mt-5 text-xs text-slate-500 max-w-lg mx-auto">
          Una vez aprobada tu solicitud, recibirás un correo electrónico con tu contraseña temporal para iniciar sesión y configurar tu clave definitiva.
        </p>

        {/* Acciones tras completar el registro */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Ir a Iniciar Sesión
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border-2 border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
          >
            Volver a la página principal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border-2 border-slate-700 bg-white p-6 shadow-sm sm:p-10"
    >
      {/* Alerta de error del servidor */}
      {serverError && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm font-medium text-rose-800"
        >
          {serverError}
        </div>
      )}

      {/* Sección 1: Datos de la Empresa */}
      <div className="border-b border-slate-200 pb-6 mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600 mb-4">
          1. Datos de la Empresa
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* RUT Empresa */}
          <div>
            <label
              htmlFor="rutEmpresa"
              className="block text-xs font-bold uppercase tracking-wide text-slate-700"
            >
              RUT Empresa <span className="text-rose-500">*</span>
            </label>
            <input
              id="rutEmpresa"
              name="rutEmpresa"
              type="text"
              inputMode="text"
              autoComplete="off"
              placeholder="76123456-0"
              value={formData.rutEmpresa}
              onChange={(e) => handleRutChange("rutEmpresa", e.target.value)}
              onBlur={() => handleBlur("rutEmpresa")}
              disabled={isSubmitting}
              className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 disabled:bg-slate-100 font-mono ${
                dirty.rutEmpresa && errors.rutEmpresa
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                  : "border-slate-300 focus:border-slate-800 focus:ring-slate-200"
              }`}
            />
            {dirty.rutEmpresa && errors.rutEmpresa && (
              <p className="mt-1 text-xs font-semibold text-rose-600">
                {errors.rutEmpresa}
              </p>
            )}
          </div>

          {/* Razón Social */}
          <div>
            <label
              htmlFor="razonSocial"
              className="block text-xs font-bold uppercase tracking-wide text-slate-700"
            >
              Razón Social <span className="text-rose-500">*</span>
            </label>
            <input
              id="razonSocial"
              name="razonSocial"
              type="text"
              autoComplete="organization"
              placeholder="Ej: Panadería Ejemplo SpA"
              value={formData.razonSocial}
              onChange={(e) => handleInputChange("razonSocial", e.target.value)}
              onBlur={() => handleBlur("razonSocial")}
              disabled={isSubmitting}
              className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 disabled:bg-slate-100 ${
                dirty.razonSocial && errors.razonSocial
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                  : "border-slate-300 focus:border-slate-800 focus:ring-slate-200"
              }`}
            />
            {dirty.razonSocial && errors.razonSocial && (
              <p className="mt-1 text-xs font-semibold text-rose-600">
                {errors.razonSocial}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sección 2: Datos del Solicitante / Usuario */}
      <div className="border-b border-slate-200 pb-6 mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-blue-600 mb-4">
          2. Datos del Solicitante
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* RUT Usuario */}
          <div>
            <label
              htmlFor="rutUsuario"
              className="block text-xs font-bold uppercase tracking-wide text-slate-700"
            >
              RUT del Solicitante <span className="text-rose-500">*</span>
            </label>
            <input
              id="rutUsuario"
              name="rutUsuario"
              type="text"
              inputMode="text"
              autoComplete="off"
              placeholder="12345678-5"
              value={formData.rutUsuario}
              onChange={(e) => handleRutChange("rutUsuario", e.target.value)}
              onBlur={() => handleBlur("rutUsuario")}
              disabled={isSubmitting}
              className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 disabled:bg-slate-100 font-mono ${
                dirty.rutUsuario && errors.rutUsuario
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                  : "border-slate-300 focus:border-slate-800 focus:ring-slate-200"
              }`}
            />
            {dirty.rutUsuario && errors.rutUsuario && (
              <p className="mt-1 text-xs font-semibold text-rose-600">
                {errors.rutUsuario}
              </p>
            )}
          </div>

          {/* Correo Electrónico */}
          <div>
            <label
              htmlFor="correo"
              className="block text-xs font-bold uppercase tracking-wide text-slate-700"
            >
              Correo Electrónico <span className="text-rose-500">*</span>
            </label>
            <input
              id="correo"
              name="correo"
              type="email"
              autoComplete="email"
              placeholder="ana@ejemplo.cl"
              value={formData.correo}
              onChange={(e) => handleInputChange("correo", e.target.value)}
              onBlur={() => handleBlur("correo")}
              disabled={isSubmitting}
              className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 disabled:bg-slate-100 ${
                dirty.correo && errors.correo
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                  : "border-slate-300 focus:border-slate-800 focus:ring-slate-200"
              }`}
            />
            {dirty.correo && errors.correo && (
              <p className="mt-1 text-xs font-semibold text-rose-600">
                {errors.correo}
              </p>
            )}
          </div>

          {/* Nombre */}
          <div>
            <label
              htmlFor="nombre"
              className="block text-xs font-bold uppercase tracking-wide text-slate-700"
            >
              Nombre <span className="text-rose-500">*</span>
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              autoComplete="given-name"
              placeholder="Ej: Ana"
              value={formData.nombre}
              onChange={(e) => handleInputChange("nombre", e.target.value)}
              onBlur={() => handleBlur("nombre")}
              disabled={isSubmitting}
              className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 disabled:bg-slate-100 ${
                dirty.nombre && errors.nombre
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                  : "border-slate-300 focus:border-slate-800 focus:ring-slate-200"
              }`}
            />
            {dirty.nombre && errors.nombre && (
              <p className="mt-1 text-xs font-semibold text-rose-600">
                {errors.nombre}
              </p>
            )}
          </div>

          {/* Apellido */}
          <div>
            <label
              htmlFor="apellido"
              className="block text-xs font-bold uppercase tracking-wide text-slate-700"
            >
              Apellido <span className="text-rose-500">*</span>
            </label>
            <input
              id="apellido"
              name="apellido"
              type="text"
              autoComplete="family-name"
              placeholder="Ej: Pérez"
              value={formData.apellido}
              onChange={(e) => handleInputChange("apellido", e.target.value)}
              onBlur={() => handleBlur("apellido")}
              disabled={isSubmitting}
              className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 disabled:bg-slate-100 ${
                dirty.apellido && errors.apellido
                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
                  : "border-slate-300 focus:border-slate-800 focus:ring-slate-200"
              }`}
            />
            {dirty.apellido && errors.apellido && (
              <p className="mt-1 text-xs font-semibold text-rose-600">
                {errors.apellido}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sección 3: Descripción Opcional */}
      <div className="mb-8">
        <label
          htmlFor="descripcion"
          className="block text-xs font-bold uppercase tracking-wide text-slate-700"
        >
          Descripción <span className="font-normal text-slate-500">(Opcional)</span>
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={3}
          placeholder="Agrega información adicional sobre tu empresa o solicitud si lo deseas..."
          value={formData.descripcion}
          onChange={(e) => handleInputChange("descripcion", e.target.value)}
          onBlur={() => handleBlur("descripcion")}
          disabled={isSubmitting}
          className={`mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 disabled:bg-slate-100 ${
            dirty.descripcion && errors.descripcion
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200"
              : "border-slate-300 focus:border-slate-800 focus:ring-slate-200"
          }`}
        />
        {dirty.descripcion && errors.descripcion && (
          <p className="mt-1 text-xs font-semibold text-rose-600">
            {errors.descripcion}
          </p>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/"
          className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors order-2 sm:order-1"
        >
          ← Volver al inicio
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 border-2 border-slate-800 px-8 py-3 text-sm font-bold text-white shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
        >
          {isSubmitting ? "Enviando solicitud..." : "Enviar Solicitud"}
        </button>
      </div>
    </form>
  );
}
