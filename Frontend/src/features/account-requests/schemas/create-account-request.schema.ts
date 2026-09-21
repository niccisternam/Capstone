import { z } from "zod";

/**
 * Limpia y aplica formato de RUT chileno en tiempo real (XXXXXXXX-X).
 * Elimina puntos, espacios y caracteres no numéricos excepto K,
 * y coloca el guion automáticamente antes del dígito verificador.
 */
export function formatRutInput(value: string): string {
  const cleaned = value.replace(/[^0-9kK]/g, "").toUpperCase().slice(0, 9);
  if (cleaned.length <= 1) return cleaned;
  return `${cleaned.slice(0, -1)}-${cleaned.slice(-1)}`;
}

/**
 * Normaliza un RUT chileno eliminando puntos y espacios,
 * asegurando mayúsculas y guion antes del dígito verificador.
 */
export function normalizeRut(value: string): string {
  const cleaned = value.replace(/\./g, "").replace(/\s/g, "").toUpperCase();
  const withoutDash = cleaned.replace(/-/g, "");
  if (withoutDash.length < 2) return cleaned;
  return `${withoutDash.slice(0, -1)}-${withoutDash.slice(-1)}`;
}

/**
 * Valida un RUT chileno usando el algoritmo oficial de Módulo 11.
 */
export function isValidChileanRut(value: string): boolean {
  const normalized = normalizeRut(value);
  const match = /^(\d{7,8})-([0-9K])$/.exec(normalized);
  if (!match) return false;

  const body = match[1];
  const providedDigit = match[2];
  if (!body || !providedDigit) return false;

  let sum = 0;
  let multiplier = 2;
  for (let index = body.length - 1; index >= 0; index -= 1) {
    sum += Number(body[index]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const result = 11 - (sum % 11);
  const expectedDigit = result === 11 ? "0" : result === 10 ? "K" : String(result);
  return providedDigit === expectedDigit;
}

export const rutEmpresaSchema = z
  .string()
  .trim()
  .min(1, "El RUT de la empresa es obligatorio")
  .refine(isValidChileanRut, "El RUT de la empresa no es válido");

export const razonSocialSchema = z
  .string()
  .trim()
  .min(1, "La razón social es obligatoria")
  .min(2, "La razón social debe tener al menos 2 caracteres")
  .max(200, "La razón social no puede superar los 200 caracteres");

export const rutUsuarioSchema = z
  .string()
  .trim()
  .min(1, "El RUT del solicitante es obligatorio")
  .refine(isValidChileanRut, "El RUT del solicitante no es válido");

export const nombreSchema = z
  .string()
  .trim()
  .min(1, "El nombre es obligatorio")
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(100, "El nombre no puede superar los 100 caracteres");

export const apellidoSchema = z
  .string()
  .trim()
  .min(1, "El apellido es obligatorio")
  .min(2, "El apellido debe tener al menos 2 caracteres")
  .max(100, "El apellido no puede superar los 100 caracteres");

export const correoSchema = z
  .string()
  .trim()
  .min(1, "El correo electrónico es obligatorio")
  .email("Debe tener formato de correo válido")
  .max(320, "El correo no puede superar los 320 caracteres")
  .transform((val) => val.toLowerCase());

export const descripcionSchema = z
  .string()
  .trim()
  .max(2000, "La descripción no puede superar los 2000 caracteres")
  .optional()
  .transform((val) => (val && val.length > 0 ? val : undefined));

export const createAccountRequestFormSchema = z.object({
  rutEmpresa: rutEmpresaSchema,
  razonSocial: razonSocialSchema,
  rutUsuario: rutUsuarioSchema,
  nombre: nombreSchema,
  apellido: apellidoSchema,
  correo: correoSchema,
  descripcion: descripcionSchema,
});

export type CreateAccountRequestFormData = {
  rutEmpresa: string;
  razonSocial: string;
  rutUsuario: string;
  nombre: string;
  apellido: string;
  correo: string;
  descripcion: string;
};

export function validateAccountRequestField(
  field: keyof CreateAccountRequestFormData,
  value: string
): string | null {
  switch (field) {
    case "rutEmpresa": {
      const res = rutEmpresaSchema.safeParse(value);
      return res.success ? null : res.error.issues[0]?.message ?? "RUT de empresa inválido";
    }
    case "razonSocial": {
      const res = razonSocialSchema.safeParse(value);
      return res.success ? null : res.error.issues[0]?.message ?? "Razón social inválida";
    }
    case "rutUsuario": {
      const res = rutUsuarioSchema.safeParse(value);
      return res.success ? null : res.error.issues[0]?.message ?? "RUT de solicitante inválido";
    }
    case "nombre": {
      const res = nombreSchema.safeParse(value);
      return res.success ? null : res.error.issues[0]?.message ?? "Nombre inválido";
    }
    case "apellido": {
      const res = apellidoSchema.safeParse(value);
      return res.success ? null : res.error.issues[0]?.message ?? "Apellido inválido";
    }
    case "correo": {
      const res = correoSchema.safeParse(value);
      return res.success ? null : res.error.issues[0]?.message ?? "Correo inválido";
    }
    case "descripcion": {
      const res = descripcionSchema.safeParse(value);
      return res.success ? null : res.error.issues[0]?.message ?? "Descripción inválida";
    }
    default:
      return null;
  }
}
