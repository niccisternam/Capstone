import { z } from "zod";

/**
 * Esquema de validación para la nueva contraseña tras recuperación:
 * - Entre 12 y 200 caracteres
 * - Al menos una letra minúscula
 * - Al menos una letra mayúscula
 * - Al menos un número
 * - Al menos un símbolo
 * - NO aplicar trim
 */
export const resetPasswordFieldsSchema = z
  .object({
    nuevaPassword: z
      .string()
      .min(12, "La contraseña debe tener al menos 12 caracteres.")
      .max(200, "La contraseña no puede superar los 200 caracteres.")
      .regex(/[a-z]/, "Debe incluir al menos una letra minúscula.")
      .regex(/[A-Z]/, "Debe incluir al menos una letra mayúscula.")
      .regex(/\d/, "Debe incluir al menos un número.")
      .regex(/[^A-Za-z0-9]/, "Debe incluir al menos un símbolo o carácter especial."),
    confirmarPassword: z.string().min(1, "Debe confirmar su nueva contraseña."),
  })
  .refine((data) => data.nuevaPassword === data.confirmarPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmarPassword"],
  });

export type ResetPasswordFieldsFormData = z.infer<typeof resetPasswordFieldsSchema>;

/**
 * Comprobación de requisitos individuales para la lista visual de condiciones
 */
export function checkResetPasswordRequirements(password: string, confirmPassword?: string) {
  const hasMinLength = password.length >= 12 && password.length <= 200;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = typeof confirmPassword === "string" && confirmPassword.length > 0 && password === confirmPassword;

  const isValid =
    hasMinLength &&
    hasLower &&
    hasUpper &&
    hasNumber &&
    hasSymbol &&
    (confirmPassword !== undefined ? passwordsMatch : true);

  return {
    hasMinLength,
    hasLower,
    hasUpper,
    hasNumber,
    hasSymbol,
    passwordsMatch,
    isValid,
  };
}
