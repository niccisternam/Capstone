import { z } from "zod";

export const loginSchema = z.object({
  correo: z
    .string()
    .trim()
    .email()
    .max(320)
    .transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(200),
});

const passwordFieldsSchema = z
  .object({
    nuevaPassword: z
      .string()
      .min(12, "La contraseña debe tener al menos 12 caracteres")
      .max(200)
      .regex(/[a-z]/, "Debe incluir una minúscula")
      .regex(/[A-Z]/, "Debe incluir una mayúscula")
      .regex(/\d/, "Debe incluir un número")
      .regex(/[^A-Za-z0-9]/, "Debe incluir un símbolo"),
    confirmarPassword: z.string(),
  })
  .refine((data) => data.nuevaPassword === data.confirmarPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarPassword"],
  });

export const changeTemporaryPasswordSchema = passwordFieldsSchema;

export const resetPasswordSchema = passwordFieldsSchema;

export const verifyLoginCodeSchema = z.object({
  challengeId: z.string().uuid(),
  codigo: z.string().regex(/^\d{6}$/, "El código debe contener seis dígitos"),
  recordarSesion: z.boolean().default(false),
});

export const resendLoginCodeSchema = z.object({
  challengeId: z.string().uuid(),
});

export const requestPasswordRecoverySchema = z.object({
  correo: z
    .string()
    .trim()
    .email()
    .max(320)
    .transform((value) => value.toLowerCase()),
});

export const verifyRecoveryCodeSchema = z.object({
  correo: z
    .string()
    .trim()
    .email()
    .max(320)
    .transform((value) => value.toLowerCase()),
  codigo: z.string().regex(/^\d{6}$/, "El código debe contener seis dígitos"),
});

export type LoginInput = z.infer<typeof loginSchema>;
