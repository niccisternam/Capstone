import {
  estadoPagoSchema,
  toFechaEmisionInput,
  type AjusteGlobalExtraccion,
  type DetalleExtraccion,
  type DocumentoDetalle,
  type EstadoPago,
  type RevisionConDetalle,
} from "@/api/module1.schemas";

export const text = (value: string | null) => value ?? "";

/** Campos editables de una línea; comunes a la extracción y a la revisión guardada. */
export type DetalleFormulario = Pick<
  DetalleExtraccion,
  | "idDetalle"
  | "numeroLinea"
  | "descripcion"
  | "cantidad"
  | "unidad"
  | "precioUnitario"
  | "descuentoPorcentaje"
  | "descuentoMonto"
  | "recargoPorcentaje"
  | "recargoMonto"
  | "totalLinea"
>;

/** Campos editables de un ajuste global; comunes a la extracción y a la revisión guardada. */
export type AjusteFormulario = Pick<
  AjusteGlobalExtraccion,
  "idAjuste" | "numeroAjuste" | "tipo" | "modalidad" | "valor" | "descripcion"
>;

export type ReviewFormState = {
  tipoDocumento: string;
  folio: string;
  fechaEmision: string;
  emisorRut: string;
  emisorRazonSocial: string;
  receptorRut: string;
  receptorNombre: string;
  condicionTributaria: string;
  medioPago: string;
  neto: string;
  iva: string;
  exento: string;
  total: string;
  estadoPago: EstadoPago;
  observacion: string;
  detalles: DetalleFormulario[];
  ajustes: AjusteFormulario[];
};

export type SetReviewField = (key: keyof ReviewFormState, value: string) => void;
export type SetReviewDetail = (index: number, key: keyof DetalleFormulario, value: string | null) => void;
export type SetReviewAdjustment = (index: number, key: keyof AjusteFormulario, value: string | null) => void;

/**
 * Revisión guardada más reciente. Cada guardado crea una revisión nueva con todos los
 * campos, así que la última refleja lo que el usuario dejó (confirmado o no).
 * Se ordena aquí para no depender del orden de la respuesta.
 */
export function latestRevision(document: Pick<DocumentoDetalle, "revisiones">): RevisionConDetalle | undefined {
  return [...document.revisiones].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))[0];
}

const estadoPagoInicial = (value: string | null | undefined): EstadoPago => {
  const parsed = estadoPagoSchema.safeParse(value);
  return parsed.success ? parsed.data : "PENDIENTE";
};

/**
 * Estado inicial del formulario. Si el documento ya tiene una revisión guardada (por ejemplo,
 * al reabrir un documento confirmado), se parte de ella para no perder el estado de pago,
 * la observación ni las correcciones previas. Sin revisión, se parte de la extracción.
 */
export function initialReviewForm(document: DocumentoDetalle): ReviewFormState {
  const revision = latestRevision(document);
  const source = revision ?? document.resultados.at(-1);
  return {
    tipoDocumento: text(source?.tipoDocumento ?? null),
    folio: text(source?.folio ?? null),
    fechaEmision: toFechaEmisionInput(source?.fechaEmision ?? null) ?? "",
    emisorRut: text(source?.emisorRut ?? null),
    emisorRazonSocial: text(source?.emisorRazonSocial ?? null),
    receptorRut: text(source?.receptorRut ?? null),
    receptorNombre: text(source?.receptorNombre ?? null),
    condicionTributaria: source?.condicionTributaria ?? "",
    medioPago: text(source?.medioPago ?? null),
    neto: text(source?.neto ?? null),
    iva: text(source?.iva ?? null),
    exento: text(source?.exento ?? null),
    total: text(source?.total ?? null),
    estadoPago: estadoPagoInicial(revision?.estadoPago),
    observacion: text(revision?.observacion ?? null),
    detalles: source?.detalles ?? [],
    ajustes: source?.ajustesGlobales ?? [],
  };
}
