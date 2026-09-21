import { z } from "zod";

/**
 * Esquema de validación para el campo correo:
 * - Obligatorio
 * - Trim de espacios iniciales y finales
 * - Máximo 100 caracteres
 * - Formato de correo válido
 * - Conversión a minúsculas
 */
export const emailInputSchema = z
  .string()
  .transform((val) => val.trim())
  .pipe(
    z
      .string()
      .min(1, "El correo electrónico es obligatorio.")
      .max(100, "El correo electrónico no puede superar los 100 caracteres.")
      .email("Debe tener formato de correo válido.")
      .transform((val) => val.toLowerCase())
  );

/**
 * Esquema de validación para el campo contraseña:
 * - Obligatoria
 * - No modifica mayúsculas, minúsculas ni símbolos
 */
export const passwordInputSchema = z
  .string()
  .min(1, "La contraseña es obligatoria.");

/**
 * Esquema completo del formulario de inicio de sesión
 */
export const loginSchema = z.object({
  correo: emailInputSchema,
  password: passwordInputSchema,
  recordarSesion: z.boolean().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Validador individual en tiempo real para correo electrónico usando el esquema Zod
 */
export function validateEmailField(value: string): string | null {
  const result = emailInputSchema.safeParse(value);
  if (!result.success) {
    return result.error.issues[0]?.message ?? "Correo inválido.";
  }
  return null;
}

/**
 * Validador individual en tiempo real para contraseña usando el esquema Zod
 */
export function validatePasswordField(value: string): string | null {
  const result = passwordInputSchema.safeParse(value);
  if (!result.success) {
    return result.error.issues[0]?.message ?? "Contraseña inválida.";
  }
  return null;
}
