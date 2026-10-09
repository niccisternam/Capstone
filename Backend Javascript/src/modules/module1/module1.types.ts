
export type ExtractionStatus =
  | "ENCONTRADO"
  | "AUSENTE"
  | "NO_APLICA"
  | "ILEGIBLE"
  | "INCIERTO";

export interface Evidence {
  pagina?: number;
  zona?: string;
  textoDetectado?: string;
}

export interface ExtractedField<T> {
  valor: T | null;
  estado: ExtractionStatus;
  confianza?: number;
  evidencia?: Evidence;
}

export interface ExtractedDetail {
  descripcion: ExtractedField<string>;
  cantidad: ExtractedField<string>;
  unidad: ExtractedField<string>;
  precioUnitario: ExtractedField<string>;
  descuentoPorcentaje: ExtractedField<string>;
  descuentoMonto: ExtractedField<string>;
  recargoPorcentaje: ExtractedField<string>;
  recargoMonto: ExtractedField<string>;
  totalLinea: ExtractedField<string>;
}

export interface ExtractedAdjustment {
  tipo: "DESCUENTO" | "RECARGO";
  modalidad: "PORCENTAJE" | "MONTO";
  valor: ExtractedField<string>;
  descripcion: ExtractedField<string>;
}

export interface ExtractionDocument {
  tipoDocumento: ExtractedField<string>;
  folio: ExtractedField<string>;
  fechaEmision: ExtractedField<string>;
  emisor: {
    rut: ExtractedField<string>;
    razonSocial: ExtractedField<string>;
  };
  receptor: {
    rut: ExtractedField<string>;
    nombre: ExtractedField<string>;
  };
  condicionTributaria: ExtractedField<"AFECTA" | "EXENTA" | "NO_AFECTA" | "MIXTA">;
  detalles: ExtractedField<ExtractedDetail[]>;
  ajustesGlobales: ExtractedField<ExtractedAdjustment[]>;
  totales: {
    neto: ExtractedField<string>;
    iva: ExtractedField<string>;
    exento: ExtractedField<string>;
    total: ExtractedField<string>;
  };
  medioPago: ExtractedField<string>;
}

export interface ExtractionResponse {
  documento: ExtractionDocument;
  errores: Array<{ codigo: string; mensaje: string; campo?: string }>;
  advertencias: Array<{ codigo: string; mensaje: string; campo?: string }>;
}

export interface Module1Identity {
  idUsuario: string;
  idEmpresa: string;
}

export interface Module1Dependencies {
  extractor: DocumentExtractor;
  now?: () => Date;
  storagePath: string;
}

export interface DocumentExtractor {
  extract(pdf: Buffer): Promise<ExtractionResponse>;
}
