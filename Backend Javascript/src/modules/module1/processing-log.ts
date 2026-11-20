import { AppError } from "../../shared/errors/app-error.js";

// Describe la causa de un fallo de procesamiento para el log del servidor.
// Solo incluye códigos, nombres de campos/columnas y metadatos del error: nunca valores
// extraídos, contenido del PDF ni el mensaje completo de Prisma (que puede repetir los datos
// enviados en la consulta).

const MAX_MENSAJE = 200;
const MAX_CAMPOS = 20;

/** Rutas y tipos de los problemas de validación (p. ej. `documento.totales.neto` / `invalid_format`), sin valores. */
export function camposInvalidos(issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; code: string }>) {
  return {
    issueCount: issues.length,
    campos: issues.slice(0, MAX_CAMPOS).map((issue) => ({
      ruta: issue.path.map(String).join("."),
      tipo: issue.code,
    })),
  };
}

type PrismaLikeError = Error & { code?: unknown; meta?: unknown; clientVersion?: unknown };

function isPrismaError(error: unknown): error is PrismaLikeError {
  return (
    error instanceof Error &&
    (error.name.startsWith("PrismaClient") ||
      (typeof (error as PrismaLikeError).code === "string" && /^P\d{4}$/.test(String((error as PrismaLikeError).code))))
  );
}

export function describeProcessingError(error: unknown): Record<string, unknown> {
  if (error instanceof AppError) {
    return {
      origen: "app",
      codigo: error.code,
      ...(error.details !== undefined ? { detalles: error.details } : {}),
    };
  }
  if (isPrismaError(error)) {
    return {
      origen: "base_de_datos",
      tipo: error.name,
      ...(typeof error.code === "string" ? { prismaCodigo: error.code } : {}),
      ...(error.meta !== undefined ? { meta: error.meta } : {}),
    };
  }
  if (error instanceof Error) {
    return { origen: "desconocido", tipo: error.name, mensaje: error.message.slice(0, MAX_MENSAJE) };
  }
  return { origen: "desconocido", tipo: typeof error };
}

export function logProcessingFailure(context: {
  idDocumento: string;
  idIntento: string;
  numeroIntento: number;
  codigo: string;
  error: unknown;
}) {
  console.error(
    JSON.stringify({
      level: "error",
      event: "document_processing_failed",
      idDocumento: context.idDocumento,
      idIntento: context.idIntento,
      numeroIntento: context.numeroIntento,
      codigo: context.codigo,
      causa: describeProcessingError(context.error),
    }),
  );
}
