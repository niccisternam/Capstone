import { z } from "zod";

/**
 * Esquema de validación para la recuperación de contraseña:
 * - Obligatorio
 * - Eliminación de espacios iniciales y finales
 * - Formato de correo válido
 * - Máximo 100 caracteres
 * - Conversión a minúsculas
 */
export const recoverySchema = z.object({
  correo: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z
        .string()
        .min(1, "El correo electrónico es obligatorio.")
        .max(320, "El correo electrónico no puede superar los 320 caracteres.")
        .email("Debe tener formato de correo válido.")
        .transform((val) => val.toLowerCase())
    ),
});

export type RecoveryFormData = z.infer<typeof recoverySchema>;

/**
 * Validador en tiempo real para el campo de correo de recuperación
 */
export function validateRecoveryEmail(value: string): string | null {
  const result = recoverySchema.shape.correo.safeParse(value);
  if (!result.success) {
    return result.error.issues[0]?.message ?? "Correo inválido.";
  }
  return null;
}
