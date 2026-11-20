import { z } from "zod";

// Catálogo cerrado del estado de pago interno. Debe coincidir con la constante
// homónima del frontend (src/api/module1.schemas.ts) y con el CHECK de la migración.
export const ESTADOS_PAGO = ["PENDIENTE", "PAGADO"] as const;
export const estadoPagoSchema = z.enum(ESTADOS_PAGO);

// Largos máximos de las columnas VARCHAR (resultado_extraccion, revision_documento, detalle_*).
// Validarlos aquí evita que un texto demasiado largo falle recién al insertar en la base.
export const LARGO_MAXIMO = {
  tipoDocumento: 100,
  folio: 30,
  rut: 12,
  razonSocial: 200,
  nombre: 200,
  medioPago: 40,
  unidad: 40,
} as const;
const texto = (max: number) => z.string().max(max);

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
  unidad: fieldSchema(texto(LARGO_MAXIMO.unidad)),
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
    tipoDocumento: fieldSchema(texto(LARGO_MAXIMO.tipoDocumento)),
    folio: fieldSchema(texto(LARGO_MAXIMO.folio)),
    fechaEmision: fieldSchema(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
    emisor: z.object({ rut: fieldSchema(texto(LARGO_MAXIMO.rut)), razonSocial: fieldSchema(texto(LARGO_MAXIMO.razonSocial)) }),
    receptor: z.object({ rut: fieldSchema(texto(LARGO_MAXIMO.rut)), nombre: fieldSchema(texto(LARGO_MAXIMO.nombre)) }),
    condicionTributaria: fieldSchema(z.enum(["AFECTA", "EXENTA", "NO_AFECTA", "MIXTA"])),
    detalles: z.object({ estado: status, valor: z.array(detailSchema).nullable(), confianza: z.number().min(0).max(1).optional(), evidencia: evidence }),
    ajustesGlobales: z.object({ estado: status, valor: z.array(adjustmentSchema).nullable(), confianza: z.number().min(0).max(1).optional(), evidencia: evidence }),
    totales: z.object({
      neto: fieldSchema(decimal), iva: fieldSchema(decimal), exento: fieldSchema(decimal), total: fieldSchema(decimal),
    }),
    medioPago: fieldSchema(texto(LARGO_MAXIMO.medioPago)),
  }),
  errores: z.array(z.object({ codigo: z.string(), mensaje: z.string(), campo: z.string().optional() })),
  advertencias: z.array(z.object({ codigo: z.string(), mensaje: z.string(), campo: z.string().optional() })),
});

export const createNotebookSchema = z.object({
  nombre: z.string().trim().min(1).max(150),
  descripcion: z.string().trim().max(5000).optional(),
  icono: z.string().trim().max(80).optional(),
  paletaColores: z.record(z.string(), z.string()).optional(),
});

export const notebookDocumentsQuerySchema = z.object({
  pagina: z.coerce.number().int().min(1).max(100000).default(1),
  buscar: z.string().trim().max(200).optional(),
  estado: z.enum(["PENDIENTE_REVISION", "CONFIRMADO"]).optional(),
  estadoPago: estadoPagoSchema.optional(),
  proveedor: z.string().trim().max(200).optional(),
});

const reviewDecimal = z.string().regex(/^-?\d+(\.\d+)?$/).nullable().optional();
const reviewText = z.string().nullable().optional();
const reviewTexto = (max: number) => texto(max).nullable().optional();
const reviewDetailSchema = z.object({
  descripcion: reviewText,
  cantidad: reviewDecimal,
  unidad: reviewTexto(LARGO_MAXIMO.unidad),
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
  tipoDocumento: reviewTexto(LARGO_MAXIMO.tipoDocumento),
  folio: reviewTexto(LARGO_MAXIMO.folio),
  fechaEmision: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  emisor: z.object({ rut: reviewTexto(LARGO_MAXIMO.rut), razonSocial: reviewTexto(LARGO_MAXIMO.razonSocial) }).partial().optional(),
  receptor: z.object({ rut: reviewTexto(LARGO_MAXIMO.rut), nombre: reviewTexto(LARGO_MAXIMO.nombre) }).partial().optional(),
  condicionTributaria: z.enum(["AFECTA", "EXENTA", "NO_AFECTA", "MIXTA"]).nullable().optional(),
  detalles: z.array(reviewDetailSchema).optional(),
  ajustesGlobales: z.array(reviewAdjustmentSchema).optional(),
  totales: z.object({ neto: reviewDecimal, iva: reviewDecimal, exento: reviewDecimal, total: reviewDecimal }).partial().optional(),
  medioPago: reviewTexto(LARGO_MAXIMO.medioPago),
});

export const reviewSchema = z.object({
  estadoPago: estadoPagoSchema,
  observacion: z.string().trim().max(5000).optional(),
  datos: reviewDataSchema,
});
