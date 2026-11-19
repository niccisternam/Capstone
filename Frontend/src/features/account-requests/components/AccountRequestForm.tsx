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
import { AccountRequestSuccess } from "./AccountRequestSuccess";
import { FormField } from "./FormField";

const CAMPOS: (keyof CreateAccountRequestFormData)[] = [
  "rutEmpresa",
  "razonSocial",
  "rutUsuario",
  "nombre",
  "apellido",
  "correo",
  "descripcion",
];

const INITIAL_FORM_DATA: CreateAccountRequestFormData = {
  rutEmpresa: "",
  razonSocial: "",
  rutUsuario: "",
  nombre: "",
  apellido: "",
  correo: "",
  descripcion: "",
};

const estadoInicial = <T,>(value: T) =>
  Object.fromEntries(CAMPOS.map((campo) => [campo, value])) as Record<keyof CreateAccountRequestFormData, T>;

export function AccountRequestForm() {
  const [formData, setFormData] = useState<CreateAccountRequestFormData>(INITIAL_FORM_DATA);
  const [dirty, setDirty] = useState(estadoInicial(false));
  const [errors, setErrors] = useState(estadoInicial<string | null>(null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [createdRequest, setCreatedRequest] = useState<AccountRequestItem | null>(null);

  const handleRutChange = (field: "rutEmpresa" | "rutUsuario", rawValue: string) => {
    const formatted = formatRutInput(rawValue);
    setFormData((prev) => ({ ...prev, [field]: formatted }));

    if (dirty[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateAccountRequestField(field, formatted) }));
    }
  };

  const handleInputChange = (field: keyof CreateAccountRequestFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (dirty[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateAccountRequestField(field, value) }));
    }
  };

  const handleBlur = (field: keyof CreateAccountRequestFormData) => {
    setDirty((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateAccountRequestField(field, formData[field]) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setDirty(estadoInicial(true));

    const validationResult = createAccountRequestFormSchema.safeParse(formData);

    if (!validationResult.success) {
      const newErrors = estadoInicial<string | null>(null);
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
      const res = await createAccountRequest(validationResult.data);

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

  if (createdRequest) {
    return <AccountRequestSuccess request={createdRequest} razonSocial={formData.razonSocial} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border-2 border-slate-700 bg-white p-6 shadow-sm sm:p-10"
    >
      {serverError && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm font-medium text-rose-800"
        >
          {serverError}
        </div>
      )}

      {/* Sección 1: Datos de la Empresa */}
      <div className="mb-6 border-b border-slate-200 pb-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-blue-600">1. Datos de la Empresa</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            id="rutEmpresa"
            label="RUT Empresa"
            required
            mono
            placeholder="76123456-0"
            value={formData.rutEmpresa}
            onChange={(value) => handleRutChange("rutEmpresa", value)}
            onBlur={() => handleBlur("rutEmpresa")}
            error={errors.rutEmpresa}
            showError={dirty.rutEmpresa}
            disabled={isSubmitting}
          />
          <FormField
            id="razonSocial"
            label="Razón Social"
            required
            autoComplete="organization"
            placeholder="Ej: Panadería Ejemplo SpA"
            value={formData.razonSocial}
            onChange={(value) => handleInputChange("razonSocial", value)}
            onBlur={() => handleBlur("razonSocial")}
            error={errors.razonSocial}
            showError={dirty.razonSocial}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Sección 2: Datos del Solicitante */}
      <div className="mb-6 border-b border-slate-200 pb-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-blue-600">2. Datos del Solicitante</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            id="rutUsuario"
            label="RUT del Solicitante"
            required
            mono
            placeholder="12345678-5"
            value={formData.rutUsuario}
            onChange={(value) => handleRutChange("rutUsuario", value)}
            onBlur={() => handleBlur("rutUsuario")}
            error={errors.rutUsuario}
            showError={dirty.rutUsuario}
            disabled={isSubmitting}
          />
          <FormField
            id="correo"
            label="Correo Electrónico"
            required
            type="email"
            autoComplete="email"
            placeholder="ana@ejemplo.cl"
            value={formData.correo}
            onChange={(value) => handleInputChange("correo", value)}
            onBlur={() => handleBlur("correo")}
            error={errors.correo}
            showError={dirty.correo}
            disabled={isSubmitting}
          />
          <FormField
            id="nombre"
            label="Nombre"
            required
            autoComplete="given-name"
            placeholder="Ej: Ana"
            value={formData.nombre}
            onChange={(value) => handleInputChange("nombre", value)}
            onBlur={() => handleBlur("nombre")}
            error={errors.nombre}
            showError={dirty.nombre}
            disabled={isSubmitting}
          />
          <FormField
            id="apellido"
            label="Apellido"
            required
            autoComplete="family-name"
            placeholder="Ej: Pérez"
            value={formData.apellido}
            onChange={(value) => handleInputChange("apellido", value)}
            onBlur={() => handleBlur("apellido")}
            error={errors.apellido}
            showError={dirty.apellido}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Sección 3: Descripción Opcional */}
      <div className="mb-8">
        <FormField
          id="descripcion"
          label={
            <>
              Descripción <span className="font-normal text-slate-500">(Opcional)</span>
            </>
          }
          multiline
          rows={3}
          placeholder="Agrega información adicional sobre tu empresa o solicitud si lo deseas..."
          value={formData.descripcion}
          onChange={(value) => handleInputChange("descripcion", value)}
          onBlur={() => handleBlur("descripcion")}
          error={errors.descripcion}
          showError={dirty.descripcion}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Link
          href="/"
          className="order-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900 sm:order-1"
        >
          ← Volver al inicio
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="order-1 inline-flex w-full items-center justify-center rounded-lg border-2 border-slate-800 bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 sm:order-2 sm:w-auto"
        >
          {isSubmitting ? "Enviando solicitud..." : "Enviar Solicitud"}
        </button>
      </div>
    </form>
  );
}
