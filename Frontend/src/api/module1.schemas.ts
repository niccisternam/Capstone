import { z } from "zod";

// Fuente: Backend Javascript/src/modules/module1/module1.schemas.ts y module1.service.ts.
// Los esquemas de respuesta listan solo los campos que el frontend usa.
// Zod descarta el resto de campos del backend al parsear.

const DECIMAL_PATTERN = /^-?\d+(\.\d+)?$/;
const FECHA_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const timestampSchema = z.iso.datetime({ offset: true });
const decimalSchema = z.string().regex(DECIMAL_PATTERN);
const nullableDecimalSchema = decimalSchema.nullable();
const nullableTextSchema = z.string().nullable();

export const estadoDocumentoSchema = z.enum([
  "PENDIENTE",
  "PROCESANDO",
  "PENDIENTE_REVISION",
  "ERROR",
  "CONFIRMADO",
]);
export const estadoExtraccionSchema = z.enum(["ENCONTRADO", "AUSENTE", "NO_APLICA", "ILEGIBLE", "INCIERTO"]);
export const condicionTributariaSchema = z.enum(["AFECTA", "EXENTA", "NO_AFECTA", "MIXTA"]);
export const tipoAjusteSchema = z.enum(["DESCUENTO", "RECARGO"]);
export const modalidadAjusteSchema = z.enum(["PORCENTAJE", "MONTO"]);
export const estadoRevisionSchema = z.enum(["PENDIENTE", "EDITANDO", "CONFIRMADA"]);

export const notebookSchema = z.object({
  idNotebook: z.uuid(),
  nombre: z.string(),
  descripcion: nullableTextSchema,
  icono: nullableTextSchema,
  paletaColores: z.record(z.string(), z.string()).nullable(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export const notebookConConteoSchema = notebookSchema
  .extend({ _count: z.object({ documentos: z.number().int().nonnegative() }) })
  .transform(({ _count, ...notebook }) => ({ ...notebook, totalDocumentos: _count.documentos }));

export const documentoSchema = z.object({
  idDocumento: z.uuid(),
  idNotebook: z.uuid(),
  idLote: z.uuid(),
  posicionLote: z.number().int().positive(),
  estado: estadoDocumentoSchema,
  createdAt: timestampSchema,
  confirmadoAt: timestampSchema.nullable(),
  folio: nullableTextSchema.optional(),
  proveedor: nullableTextSchema.optional(),
  rutEmisor: nullableTextSchema.optional(),
  fechaEmision: timestampSchema.nullable().optional(),
  estadoPago: nullableTextSchema.optional(),
  nombreArchivo: nullableTextSchema.optional(),
  error: z.object({ code: z.string(), message: z.string() }).optional(),
});

export const notebookDetalleSchema = notebookSchema.extend({
  documentos: z.array(documentoSchema),
});

export const loteSchema = z.object({
  idLote: z.uuid(),
  idNotebook: z.uuid(),
  cantidadDocumentos: z.number().int().nonnegative(),
  cantidadProcesados: z.number().int().nonnegative(),
  cantidadErrores: z.number().int().nonnegative(),
  createdAt: timestampSchema,
  procesamientoInicio: timestampSchema.nullable(),
  procesamientoFin: timestampSchema.nullable(),
  documentos: z.array(documentoSchema),
});

// tamanoBytes (BigInt) no se incluye: hoy el backend no puede serializarlo en JSON.
export const archivoPdfSchema = z.object({
  idArchivo: z.uuid(),
  nombreOriginal: z.string(),
  tipoMime: z.string(),
  createdAt: timestampSchema,
});

export const detalleExtraccionSchema = z.object({
  idDetalle: z.uuid(),
  numeroLinea: z.number().int().positive(),
  descripcion: nullableTextSchema,
  descripcionEstado: estadoExtraccionSchema,
  cantidad: nullableDecimalSchema,
  cantidadEstado: estadoExtraccionSchema,
  unidad: nullableTextSchema,
  unidadEstado: estadoExtraccionSchema,
  precioUnitario: nullableDecimalSchema,
  precioUnitarioEstado: estadoExtraccionSchema,
  descuentoPorcentaje: nullableDecimalSchema,
  descuentoPorcentajeEstado: estadoExtraccionSchema,
  descuentoMonto: nullableDecimalSchema,
  descuentoMontoEstado: estadoExtraccionSchema,
  recargoPorcentaje: nullableDecimalSchema,
  recargoPorcentajeEstado: estadoExtraccionSchema,
  recargoMonto: nullableDecimalSchema,
  recargoMontoEstado: estadoExtraccionSchema,
  totalLinea: nullableDecimalSchema,
  totalLineaEstado: estadoExtraccionSchema,
});

export const ajusteGlobalExtraccionSchema = z.object({
  idAjuste: z.uuid(),
  numeroAjuste: z.number().int().positive(),
  tipo: tipoAjusteSchema,
  modalidad: modalidadAjusteSchema,
  valor: nullableDecimalSchema,
  valorEstado: estadoExtraccionSchema,
  descripcion: nullableTextSchema,
  descripcionEstado: estadoExtraccionSchema,
});

export const resultadoExtraccionSchema = z.object({
  idResultado: z.uuid(),
  tipoDocumento: nullableTextSchema,
  tipoDocumentoEstado: estadoExtraccionSchema,
  folio: nullableTextSchema,
  folioEstado: estadoExtraccionSchema,
  fechaEmision: timestampSchema.nullable(),
  fechaEmisionEstado: estadoExtraccionSchema,
  emisorRut: nullableTextSchema,
  emisorRutEstado: estadoExtraccionSchema,
  emisorRazonSocial: nullableTextSchema,
  emisorRazonSocialEstado: estadoExtraccionSchema,
  receptorRut: nullableTextSchema,
  receptorRutEstado: estadoExtraccionSchema,
  receptorNombre: nullableTextSchema,
  receptorNombreEstado: estadoExtraccionSchema,
  condicionTributaria: condicionTributariaSchema.nullable(),
  condicionEstado: estadoExtraccionSchema,
  neto: nullableDecimalSchema,
  netoEstado: estadoExtraccionSchema,
  iva: nullableDecimalSchema,
  ivaEstado: estadoExtraccionSchema,
  exento: nullableDecimalSchema,
  exentoEstado: estadoExtraccionSchema,
  total: nullableDecimalSchema,
  totalEstado: estadoExtraccionSchema,
  medioPago: nullableTextSchema,
  medioPagoEstado: estadoExtraccionSchema,
  // Contiene confianza y evidencia por campo; el frontend no lo interpreta todavía.
  metadata: z.unknown(),
  errores: z.unknown(),
  advertencias: z.unknown(),
  detalles: z.array(detalleExtraccionSchema),
  ajustesGlobales: z.array(ajusteGlobalExtraccionSchema),
});

export const revisionDocumentoSchema = z.object({
  idRevision: z.uuid(),
  idDocumento: z.uuid(),
  idResultado: z.uuid(),
  estado: estadoRevisionSchema,
  estadoPago: nullableTextSchema,
  observacion: nullableTextSchema,
  tipoDocumento: nullableTextSchema,
  folio: nullableTextSchema,
  fechaEmision: timestampSchema.nullable(),
  emisorRut: nullableTextSchema,
  emisorRazonSocial: nullableTextSchema,
  receptorRut: nullableTextSchema,
  receptorNombre: nullableTextSchema,
  condicionTributaria: condicionTributariaSchema.nullable(),
  neto: nullableDecimalSchema,
  iva: nullableDecimalSchema,
  exento: nullableDecimalSchema,
  total: nullableDecimalSchema,
  medioPago: nullableTextSchema,
  createdAt: timestampSchema,
  confirmedAt: timestampSchema.nullable(),
});

export const detalleRevisionSchema = z.object({
  idDetalle: z.uuid(),
  idDetalleExtraccion: z.uuid().nullable(),
  numeroLinea: z.number().int().positive(),
  descripcion: nullableTextSchema,
  cantidad: nullableDecimalSchema,
  unidad: nullableTextSchema,
  precioUnitario: nullableDecimalSchema,
  descuentoPorcentaje: nullableDecimalSchema,
  descuentoMonto: nullableDecimalSchema,
  recargoPorcentaje: nullableDecimalSchema,
  recargoMonto: nullableDecimalSchema,
  totalLinea: nullableDecimalSchema,
});

export const ajusteGlobalRevisionSchema = z.object({
  idAjuste: z.uuid(),
  numeroAjuste: z.number().int().positive(),
  tipo: tipoAjusteSchema,
  modalidad: modalidadAjusteSchema,
  valor: nullableDecimalSchema,
  descripcion: nullableTextSchema,
});

export const revisionConDetalleSchema = revisionDocumentoSchema.extend({
  detalles: z.array(detalleRevisionSchema),
  ajustesGlobales: z.array(ajusteGlobalRevisionSchema),
});

export const documentoDetalleSchema = documentoSchema.extend({
  archivo: archivoPdfSchema,
  resultados: z.array(resultadoExtraccionSchema),
  revisiones: z.array(revisionConDetalleSchema),
});

// Forma devuelta por POST /documents/:id/retry cuando el reintento vuelve a fallar.
export const documentoReintentoFallidoSchema = z.object({
  idDocumento: z.uuid(),
  estado: z.literal("ERROR"),
  error: z.object({ code: z.string(), message: z.string() }),
});

export const reintentoResultadoSchema = z.union([documentoSchema, documentoReintentoFallidoSchema]);

export const notebooksResponseSchema = z.object({ notebooks: z.array(notebookConConteoSchema) });
export const notebookResponseSchema = z.object({ notebook: notebookSchema });
export const notebookDetalleResponseSchema = z.object({ notebook: notebookDetalleSchema });
export const loteResponseSchema = z.object({ lote: loteSchema });
export const documentoResponseSchema = z.object({ documento: documentoSchema });
export const documentoDetalleResponseSchema = z.object({ documento: documentoDetalleSchema });
export const reintentoResponseSchema = z.object({ documento: reintentoResultadoSchema });
export const revisionResponseSchema = z.object({ revision: revisionDocumentoSchema });
export const eliminarDocumentoResponseSchema = z.object({
  idDocumento: z.uuid(),
  eliminado: z.literal(true),
});

// Entradas: mismas reglas que el backend. Un campo omitido conserva el valor extraído;
// un null borra el valor; un array de detalles o ajustes reemplaza la lista completa.

export const notebookInputSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio.").max(150, "El nombre no puede superar los 150 caracteres."),
  descripcion: z.string().trim().max(5000, "La descripción no puede superar los 5000 caracteres.").optional(),
  icono: z.string().trim().max(80, "El icono no puede superar los 80 caracteres.").optional(),
  paletaColores: z.record(z.string(), z.string()).optional(),
});

const reviewTextInputSchema = z.string().nullable().optional();
const reviewDecimalInputSchema = decimalSchema.nullable().optional();

export const detalleRevisionInputSchema = z.object({
  descripcion: reviewTextInputSchema,
  cantidad: reviewDecimalInputSchema,
  unidad: reviewTextInputSchema,
  precioUnitario: reviewDecimalInputSchema,
  descuentoPorcentaje: reviewDecimalInputSchema,
  descuentoMonto: reviewDecimalInputSchema,
  recargoPorcentaje: reviewDecimalInputSchema,
  recargoMonto: reviewDecimalInputSchema,
  totalLinea: reviewDecimalInputSchema,
});

export const ajusteRevisionInputSchema = z.object({
  tipo: tipoAjusteSchema,
  modalidad: modalidadAjusteSchema,
  valor: reviewDecimalInputSchema,
  descripcion: reviewTextInputSchema,
});

export const datosRevisionInputSchema = z.object({
  tipoDocumento: reviewTextInputSchema,
  folio: reviewTextInputSchema,
  fechaEmision: z.string().regex(FECHA_PATTERN).nullable().optional(),
  emisor: z.object({ rut: reviewTextInputSchema, razonSocial: reviewTextInputSchema }).partial().optional(),
  receptor: z.object({ rut: reviewTextInputSchema, nombre: reviewTextInputSchema }).partial().optional(),
  condicionTributaria: condicionTributariaSchema.nullable().optional(),
  detalles: z.array(detalleRevisionInputSchema).optional(),
  ajustesGlobales: z.array(ajusteRevisionInputSchema).optional(),
  totales: z
    .object({
      neto: reviewDecimalInputSchema,
      iva: reviewDecimalInputSchema,
      exento: reviewDecimalInputSchema,
      total: reviewDecimalInputSchema,
    })
    .partial()
    .optional(),
  medioPago: reviewTextInputSchema,
});

export const revisionInputSchema = z.object({
  estadoPago: z.string().trim().min(1, "Indica el estado de pago.").max(40, "El estado de pago no puede superar los 40 caracteres."),
  observacion: z.string().trim().max(5000, "La observación no puede superar los 5000 caracteres."),
  datos: datosRevisionInputSchema,
});

export type EstadoDocumento = z.infer<typeof estadoDocumentoSchema>;
export type EstadoExtraccion = z.infer<typeof estadoExtraccionSchema>;
export type CondicionTributaria = z.infer<typeof condicionTributariaSchema>;
export type TipoAjuste = z.infer<typeof tipoAjusteSchema>;
export type ModalidadAjuste = z.infer<typeof modalidadAjusteSchema>;
export type EstadoRevision = z.infer<typeof estadoRevisionSchema>;

export type Notebook = z.infer<typeof notebookSchema>;
export type NotebookConConteo = z.infer<typeof notebookConConteoSchema>;
export type NotebookDetalle = z.infer<typeof notebookDetalleSchema>;
export type Documento = z.infer<typeof documentoSchema>;
export type Lote = z.infer<typeof loteSchema>;
export type ArchivoPdf = z.infer<typeof archivoPdfSchema>;
export type DetalleExtraccion = z.infer<typeof detalleExtraccionSchema>;
export type AjusteGlobalExtraccion = z.infer<typeof ajusteGlobalExtraccionSchema>;
export type ResultadoExtraccion = z.infer<typeof resultadoExtraccionSchema>;
export type RevisionDocumento = z.infer<typeof revisionDocumentoSchema>;
export type DetalleRevision = z.infer<typeof detalleRevisionSchema>;
export type AjusteGlobalRevision = z.infer<typeof ajusteGlobalRevisionSchema>;
export type RevisionConDetalle = z.infer<typeof revisionConDetalleSchema>;
export type DocumentoDetalle = z.infer<typeof documentoDetalleSchema>;
export type DocumentoReintentoFallido = z.infer<typeof documentoReintentoFallidoSchema>;
export type ReintentoResultado = z.infer<typeof reintentoResultadoSchema>;
export type EliminarDocumentoResultado = z.infer<typeof eliminarDocumentoResponseSchema>;

export type NotebookInput = z.input<typeof notebookInputSchema>;
export type DetalleRevisionInput = z.input<typeof detalleRevisionInputSchema>;
export type AjusteRevisionInput = z.input<typeof ajusteRevisionInputSchema>;
export type DatosRevisionInput = z.input<typeof datosRevisionInputSchema>;
export type RevisionInput = z.input<typeof revisionInputSchema>;

/**
 * El backend devuelve fechaEmision como fecha UTC a medianoche (@db.Date).
 * Para reenviarla en una revisión se usa solo la parte AAAA-MM-DD.
 */
export function toFechaEmisionInput(fechaEmision: string | null): string | null {
  return fechaEmision === null ? null : fechaEmision.slice(0, 10);
}
