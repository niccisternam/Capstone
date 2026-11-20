import type { Documento } from "@/api/module1.schemas";

// Lógica pura del resumen de procesamiento de un lote. Se calcula siempre desde
// `batch.documentos` (y no desde los contadores congelados del backend) para que
// el aviso siga siendo correcto tras reintentar o eliminar documentos con error.

const ESTADOS_CORRECTOS: ReadonlyArray<Documento["estado"]> = ["PENDIENTE_REVISION", "CONFIRMADO"];

export type DocumentoFallido = { idDocumento: string; nombre: string };

export type ResumenProcesamiento = {
  correctos: number;
  errores: number;
  documentosConError: DocumentoFallido[];
};

export type AvisoProcesamiento = {
  tono: "exito" | "alerta";
  titulo: string;
  detalle: string;
};

export function nombreDocumento(documento: Pick<Documento, "nombreArchivo" | "posicionLote">): string {
  return documento.nombreArchivo?.trim() || `Documento ${documento.posicionLote}`;
}

export function resumenProcesamiento(documentos: readonly Documento[]): ResumenProcesamiento {
  const documentosConError = documentos
    .filter((documento) => documento.estado === "ERROR")
    .map((documento) => ({ idDocumento: documento.idDocumento, nombre: nombreDocumento(documento) }));

  return {
    correctos: documentos.filter((documento) => ESTADOS_CORRECTOS.includes(documento.estado)).length,
    errores: documentosConError.length,
    documentosConError,
  };
}

function documentos(cantidad: number): string {
  return `${cantidad} ${cantidad === 1 ? "documento" : "documentos"}`;
}

/** Devuelve null cuando el lote no tiene documentos procesados ni fallidos. */
export function avisoProcesamiento(resumen: ResumenProcesamiento): AvisoProcesamiento | null {
  if (resumen.correctos + resumen.errores === 0) return null;

  if (resumen.errores === 0) {
    return {
      tono: "exito",
      titulo: `Procesamiento finalizado: ${documentos(resumen.correctos)} procesado${resumen.correctos === 1 ? "" : "s"} correctamente.`,
      detalle: "",
    };
  }

  return {
    tono: "alerta",
    titulo: `${resumen.correctos} correcto${resumen.correctos === 1 ? "" : "s"}, ${resumen.errores} con error.`,
    detalle: "Puedes reintentar o eliminar los documentos con error.",
  };
}
