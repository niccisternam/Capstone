import { z } from "zod";

/**
 * Limpia cualquier texto extrayendo únicamente dígitos del 0 al 9,
 * truncando a un máximo de 6 dígitos.
 * Elimina espacios, letras, símbolos, puntos y guiones.
 */
export function cleanNumericCode(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 6);
}

/**
 * Esquema de validación para el código de 6 dígitos 2FA:
 * - Se maneja como texto para preservar ceros iniciales (ej: "001234").
 * - Obligatorio.
 * - Debe contener exactamente 6 caracteres.
 * - Solo puede contener números del 0 al 9.
 */
export const twoFactorCodeSchema = z
  .string()
  .min(1, "El código es obligatorio.")
  .length(6, "Debe contener exactamente 6 dígitos.")
  .regex(/^\d{6}$/, "Solo puede contener números del 0 al 9.");

/**
 * Esquema para la verificación completa del código frente a Express
 */
export const verifyCodeSchema = z.object({
  challengeId: z.string().min(1, "El identificador de desafío es requerido."),
  codigo: twoFactorCodeSchema,
  recordarSesion: z.boolean().default(false),
});

export type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;

/**
 * Validador para el código completo de 2FA
 */
export function validateTwoFactorCode(code: string): string | null {
  const result = twoFactorCodeSchema.safeParse(code);
  if (!result.success) {
    return result.error.issues[0]?.message ?? "Código inválido.";
  }
  return null;
}
