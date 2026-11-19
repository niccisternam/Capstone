"use client";

import type { Documento } from "@/api/module1.schemas";

export const labels: Record<Documento["estado"], string> = { PENDIENTE: "Pendiente", PROCESANDO: "Procesando", PENDIENTE_REVISION: "Procesado correctamente", ERROR: "Error", CONFIRMADO: "Confirmado" };
export const colors: Record<Documento["estado"], string> = { PENDIENTE: "bg-slate-100 text-slate-700", PROCESANDO: "bg-blue-100 text-blue-700", PENDIENTE_REVISION: "bg-emerald-100 text-emerald-800", ERROR: "bg-red-100 text-red-700", CONFIRMADO: "bg-emerald-100 text-emerald-800" };

const processingErrorMessages: Record<string, string> = {
  INVALID_PDF_FILE: "El archivo no es un PDF válido o está dañado.",
  PDF_TEXT_EXTRACTION_FAILED: "El PDF no contiene una capa de texto procesable.",
  AI_INVALID_RESPONSE: "El servicio de IA devolvió una respuesta incompleta o con datos inválidos. Se esperaba información estructurada de tipo de documento, folio, fecha, emisor, receptor, condición tributaria, medio de pago, detalles, ajustes y totales.",
  AI_INVALID_JSON: "El servicio de IA devolvió una respuesta que no se pudo interpretar como información documental estructurada.",
  DOCUMENT_PROCESSING_FAILED: "Ocurrió un error inesperado durante el procesamiento.",
};

export function documentErrorMessage(document: Documento) {
  return document.error
    ? processingErrorMessages[document.error.code] ?? document.error.message
    : "No fue posible procesar este documento.";
}

export type Action = "retry" | "delete";
export type ActionHandler = (batchId: string, documentId: string, action: Action) => Promise<void>;

export function DownloadIcon({ loading }: { loading: boolean }) {
  return loading
    ? <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4 animate-spin motion-reduce:animate-none"><circle cx="10" cy="10" r="7" stroke="currentColor" strokeOpacity=".25" strokeWidth="2" /><path d="M10 3a7 7 0 0 1 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
    : <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4"><path d="M10 2.75v9m0 0 3.5-3.5M10 11.75l-3.5-3.5M3.5 12.75v2.5a1.25 1.25 0 0 0 1.25 1.25h10.5a1.25 1.25 0 0 0 1.25-1.25v-2.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
