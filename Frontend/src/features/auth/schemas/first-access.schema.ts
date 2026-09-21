import { z } from "zod";

/**
 * Requisitos de seguridad para la nueva contraseña definitiva:
 * - Mínimo 12 caracteres
 * - Máximo 200 caracteres
 * - Al menos una minúscula
 * - Al menos una mayúscula
 * - Al menos un número
 * - Al menos un símbolo o carácter especial
 */
export const newPasswordSchema = z
  .string()
  .min(12, "La contraseña debe tener al menos 12 caracteres.")
  .max(200, "La contraseña no puede superar los 200 caracteres.")
  .regex(/[a-z]/, "Debe incluir al menos una letra minúscula.")
  .regex(/[A-Z]/, "Debe incluir al menos una letra mayúscula.")
  .regex(/\d/, "Debe incluir al menos un número.")
  .regex(/[^A-Za-z0-9]/, "Debe incluir al menos un símbolo o carácter especial.");

/**
 * Esquema completo de cambio de contraseña temporal
 */
export const changeTemporaryPasswordFormSchema = z
  .object({
    nuevaPassword: newPasswordSchema,
    confirmarPassword: z.string().min(1, "Debe confirmar su nueva contraseña."),
  })
  .refine((data) => data.nuevaPassword === data.confirmarPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmarPassword"],
  });

export type ChangeTemporaryPasswordFormData = z.infer<
  typeof changeTemporaryPasswordFormSchema
>;

/**
 * Validador individual de requisitos para feedback visual dinámico
 */
export function checkPasswordRequirements(password: string) {
  return {
    hasMinLength: password.length >= 12,
    hasLower: /[a-z]/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
    isValid:
      password.length >= 12 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password),
  };
}

/**
 * Validador en tiempo real para el campo de nueva contraseña
 */
export function validateNewPasswordField(value: string): string | null {
  const result = newPasswordSchema.safeParse(value);
  if (!result.success) {
    return result.error.issues[0]?.message ?? "Contraseña inválida.";
  }
  return null;
}

/**
 * Validador en tiempo real para la confirmación de contraseña
 */
export function validateConfirmPasswordField(
  newPass: string,
  confirmPass: string
): string | null {
  if (!confirmPass) {
    return "Debe confirmar su nueva contraseña.";
  }
  if (newPass !== confirmPass) {
    return "Las contraseñas no coinciden.";
  }
  return null;
}
