import { z } from "zod";
import { isValidChileanRut, normalizeRut } from "./rut.js";

const rutSchema = z
  .string()
  .trim()
  .min(1, "El RUT es obligatorio")
  .transform(normalizeRut)
  .refine(isValidChileanRut, "El RUT no es válido");

export const createAccountRequestSchema = z.object({
  rutEmpresa: rutSchema,
  razonSocial: z.string().trim().min(2).max(200),
  rutUsuario: rutSchema,
  nombre: z.string().trim().min(2).max(100),
  apellido: z.string().trim().min(2).max(100),
  correo: z
    .string()
    .trim()
    .email()
    .max(320)
    .transform((value) => value.toLowerCase()),
  descripcion: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((value) => value || undefined),
});

export const requestIdSchema = z.object({ idSolicitud: z.string().uuid() });

export const listAccountRequestsSchema = z.object({
  estado: z.enum(["PENDIENTE", "APROBADA", "RECHAZADA"]).optional(),
});

export const approveAccountRequestSchema = z.object({
  razonSocial: z.string().trim().min(2).max(200).optional(),
  confirmacionSii: z.literal(true),
});

export const rejectAccountRequestSchema = z.object({
  motivo: z.string().trim().min(3).max(2000),
});

export type CreateAccountRequestInput = z.infer<
  typeof createAccountRequestSchema
>;
export type ApproveAccountRequestInput = z.infer<
  typeof approveAccountRequestSchema
>;
