import { z } from "zod";

export const rejectRequestSchema = z.object({
  motivo: z
    .string()
    .trim()
    .min(1, "El motivo de rechazo es obligatorio.")
    .min(3, "El motivo de rechazo debe contener al menos 3 caracteres.")
    .max(2000, "El motivo de rechazo no puede superar los 2000 caracteres."),
});

export type RejectRequestFormData = z.infer<typeof rejectRequestSchema>;
