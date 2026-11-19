import {
  toFechaEmisionInput,
  type AjusteGlobalExtraccion,
  type DetalleExtraccion,
  type DocumentoDetalle,
} from "@/api/module1.schemas";

export const text = (value: string | null) => value ?? "";

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
  estadoPago: string;
  observacion: string;
  detalles: DetalleExtraccion[];
  ajustes: AjusteGlobalExtraccion[];
};

export type SetReviewField = (key: keyof ReviewFormState, value: string) => void;
export type SetReviewDetail = (index: number, key: keyof DetalleExtraccion, value: string | null) => void;
export type SetReviewAdjustment = (index: number, key: keyof AjusteGlobalExtraccion, value: string | null) => void;

export function initialReviewForm(document: DocumentoDetalle): ReviewFormState {
  const result = document.resultados.at(-1);
  return {
    tipoDocumento: text(result?.tipoDocumento ?? null),
    folio: text(result?.folio ?? null),
    fechaEmision: toFechaEmisionInput(result?.fechaEmision ?? null) ?? "",
    emisorRut: text(result?.emisorRut ?? null),
    emisorRazonSocial: text(result?.emisorRazonSocial ?? null),
    receptorRut: text(result?.receptorRut ?? null),
    receptorNombre: text(result?.receptorNombre ?? null),
    condicionTributaria: result?.condicionTributaria ?? "",
    medioPago: text(result?.medioPago ?? null),
    neto: text(result?.neto ?? null),
    iva: text(result?.iva ?? null),
    exento: text(result?.exento ?? null),
    total: text(result?.total ?? null),
    estadoPago: "PENDIENTE",
    observacion: "",
    detalles: result?.detalles ?? [],
    ajustes: result?.ajustesGlobales ?? [],
  };
}
