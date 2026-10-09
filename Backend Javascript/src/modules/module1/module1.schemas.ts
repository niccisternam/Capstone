import { z } from "zod";

const status = z.enum(["ENCONTRADO", "AUSENTE", "NO_APLICA", "ILEGIBLE", "INCIERTO"]);
const evidence = z.object({
  pagina: z.number().int().positive().optional(),
  zona: z.string().max(100).optional(),
  textoDetectado: z.string().max(2000).optional(),
}).optional();

export const fieldSchema = <T extends z.ZodTypeAny>(value: T) => z.object({
  valor: value.nullable(),
  estado: status,
  confianza: z.number().min(0).max(1).optional(),
  evidencia: evidence,
});

const decimal = z.string().regex(/^-?\d+(\.\d+)?$/);
const percentage = fieldSchema(decimal).superRefine((field, ctx) => {
  if (field.valor !== null) {
    const value = Number(field.valor);
    if (value < 0 || value > 100) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El porcentaje debe estar entre 0 y 100" });
  }
});
const detailSchema = z.object({
  descripcion: fieldSchema(z.string()),
  cantidad: fieldSchema(decimal),
  unidad: fieldSchema(z.string()),
  precioUnitario: fieldSchema(decimal),
  descuentoPorcentaje: percentage,
  descuentoMonto: fieldSchema(decimal),
  recargoPorcentaje: percentage,
  recargoMonto: fieldSchema(decimal),
  totalLinea: fieldSchema(decimal),
});

const adjustmentSchema = z.object({
  tipo: z.enum(["DESCUENTO", "RECARGO"]),
  modalidad: z.enum(["PORCENTAJE", "MONTO"]),
  valor: fieldSchema(decimal),
  descripcion: fieldSchema(z.string()),
});

export const extractionResponseSchema = z.object({
  documento: z.object({
    tipoDocumento: fieldSchema(z.string()),
    folio: fieldSchema(z.string()),
    fechaEmision: fieldSchema(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    emisor: z.object({ rut: fieldSchema(z.string()), razonSocial: fieldSchema(z.string()) }),
    receptor: z.object({ rut: fieldSchema(z.string()), nombre: fieldSchema(z.string()) }),
    condicionTributaria: fieldSchema(z.enum(["AFECTA", "EXENTA", "NO_AFECTA", "MIXTA"])),
    detalles: z.object({ estado: status, valor: z.array(detailSchema).nullable(), confianza: z.number().min(0).max(1).optional(), evidencia: evidence }),
    ajustesGlobales: z.object({ estado: status, valor: z.array(adjustmentSchema).nullable(), confianza: z.number().min(0).max(1).optional(), evidencia: evidence }),
    totales: z.object({
      neto: fieldSchema(decimal), iva: fieldSchema(decimal), exento: fieldSchema(decimal), total: fieldSchema(decimal),
    }),
    medioPago: fieldSchema(z.string()),
  }),
  errores: z.array(z.object({ codigo: z.string(), mensaje: z.string(), campo: z.string().optional() })),
  advertencias: z.array(z.object({ codigo: z.string(), mensaje: z.string(), campo: z.string().optional() })),
});

export const createNotebookSchema = z.object({
  nombre: z.string().trim().min(1).max(150),
  descripcion: z.string().trim().max(5000).optional(),
  icono: z.string().trim().max(80).optional(),
  paletaColores: z.record(z.string()).optional(),
});

const reviewDecimal = z.string().regex(/^-?\d+(\.\d+)?$/).nullable().optional();
const reviewText = z.string().nullable().optional();
const reviewDetailSchema = z.object({
  descripcion: reviewText,
  cantidad: reviewDecimal,
  unidad: reviewText,
  precioUnitario: reviewDecimal,
  descuentoPorcentaje: reviewDecimal,
  descuentoMonto: reviewDecimal,
  recargoPorcentaje: reviewDecimal,
  recargoMonto: reviewDecimal,
  totalLinea: reviewDecimal,
});
const reviewAdjustmentSchema = z.object({
  tipo: z.enum(["DESCUENTO", "RECARGO"]),
  modalidad: z.enum(["PORCENTAJE", "MONTO"]),
  valor: reviewDecimal,
  descripcion: reviewText,
});

export const reviewDataSchema = z.object({
  tipoDocumento: reviewText,
  folio: reviewText,
  fechaEmision: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  emisor: z.object({ rut: reviewText, razonSocial: reviewText }).partial().optional(),
  receptor: z.object({ rut: reviewText, nombre: reviewText }).partial().optional(),
  condicionTributaria: z.enum(["AFECTA", "EXENTA", "NO_AFECTA", "MIXTA"]).nullable().optional(),
  detalles: z.array(reviewDetailSchema).optional(),
  ajustesGlobales: z.array(reviewAdjustmentSchema).optional(),
  totales: z.object({ neto: reviewDecimal, iva: reviewDecimal, exento: reviewDecimal, total: reviewDecimal }).partial().optional(),
  medioPago: reviewText,
});

export const reviewSchema = z.object({
  estadoPago: z.string().trim().min(1).max(40),
  observacion: z.string().trim().max(5000).optional(),
  datos: reviewDataSchema,
});
