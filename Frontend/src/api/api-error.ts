export type ApiErrorKind =
  | "NETWORK"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "VALIDATION"
  | "UNAVAILABLE"
  | "INVALID_RESPONSE"
  | "UNEXPECTED";

const MESSAGES_BY_KIND: Record<ApiErrorKind, string> = {
  NETWORK: "No fue posible conectar con el servidor. Verifica tu conexión e inténtalo nuevamente.",
  UNAUTHENTICATED: "Tu sesión ya no es válida. Inicia sesión nuevamente.",
  FORBIDDEN: "No tienes permisos para realizar esta acción.",
  NOT_FOUND: "No encontramos el recurso solicitado.",
  CONFLICT: "La información cambió o ya existe. Actualiza la vista e inténtalo nuevamente.",
  VALIDATION: "Revisa los datos ingresados.",
  UNAVAILABLE: "El servicio no está disponible temporalmente. Inténtalo más tarde.",
  INVALID_RESPONSE: "El servidor devolvió una respuesta inesperada.",
  UNEXPECTED: "Ocurrió un error inesperado. Inténtalo nuevamente.",
};

const MESSAGES_BY_CODE: Record<string, string> = {
  AUTHENTICATION_REQUIRED: "Tu sesión ya no es válida. Inicia sesión nuevamente.",
  INVALID_AUTH_TOKEN: "Tu sesión ya no es válida. Inicia sesión nuevamente.",
  USER_NOT_ACTIVE: "Tu usuario no está habilitado para usar esta función.",
  NOTEBOOK_NOT_FOUND: "No encontramos el notebook solicitado.",
  NOTEBOOK_NAME_TAKEN: "Ya existe un notebook con ese nombre.",
  NOTEBOOK_NOT_EMPTY: "No se puede eliminar un notebook que contiene documentos.",
  INVALID_BATCH_SIZE: "Debes seleccionar entre 1 y 10 documentos PDF.",
  INVALID_PDF_FILE: "Uno o más archivos no son PDF válidos o superan 15 MB.",
  BATCH_NOT_FOUND: "No encontramos el lote solicitado.",
  DOCUMENT_NOT_FOUND: "No encontramos el documento solicitado.",
  PDF_NOT_FOUND: "El PDF original no está disponible.",
  DOCUMENT_NOT_RETRYABLE: "Solo puedes reintentar documentos con error.",
  DOCUMENT_NOT_IN_REVIEW: "El documento ya no está pendiente de revisión. Actualiza la vista.",
  EXTRACTION_NOT_FOUND: "No existe una extracción para revisar este documento.",
  REVIEW_NOT_FOUND: "Guarda la revisión antes de confirmar el documento.",
  DOCUMENT_NOT_DELETABLE: "Este documento ya inició su procesamiento y no puede eliminarse.",
  VALIDATION_ERROR: "Revisa los datos ingresados.",
  INTERNAL_ERROR: "Ocurrió un error interno en el servidor. Inténtalo nuevamente más tarde.",
  NETWORK_ERROR: "No fue posible conectar con el servidor. Verifica tu conexión e inténtalo nuevamente.",
  INVALID_IDENTIFIER: "El identificador solicitado no es válido.",
  INVALID_RESPONSE: "El servidor devolvió una respuesta inesperada.",
  PDF_WITHOUT_TEXT: "El PDF no contiene texto seleccionable. Verifica que no sea solo una imagen o utiliza una versión con texto.",
  PDF_TEXT_EXTRACTION_FAILED: "No pudimos leer el contenido del PDF. Intenta cargarlo nuevamente o revisa que el archivo no esté dañado.",
  AI_NOT_CONFIGURED: "El procesamiento documental no está disponible en este momento. Inténtalo más tarde.",
  AI_UNAVAILABLE: "El servicio de análisis no está disponible temporalmente. Inténtalo más tarde.",
  AI_RATE_LIMITED: "Se alcanzó temporalmente el límite del servicio de análisis. Espera antes de volver a intentarlo.",
  AI_BAD_REQUEST: "El servicio de análisis rechazó la configuración de la solicitud. Contacta al administrador.",
  AI_AUTHENTICATION: "La configuración del servicio de análisis no tiene permisos válidos.",
  AI_MODEL_NOT_FOUND: "El modelo de análisis configurado no está disponible.",
  AI_INVALID_JSON: "No pudimos interpretar los datos del documento. Puedes reintentar el procesamiento.",
  AI_INVALID_RESPONSE: "El servicio de IA devolvió una respuesta incompleta o con datos inválidos para la estructura documental requerida. El documento quedó marcado con error; puedes revisar el mensaje y reintentarlo.",
  CHAT_QUERY_REJECTED: "No pude convertir tu pregunta en una consulta segura. Intenta reformularla.",
  CHAT_QUERY_FAILED: "No pude obtener los datos para responder esa pregunta. Intenta reformularla.",
  DOCUMENT_PROCESSING_FAILED: "No pudimos procesar este documento. Puedes reintentarlo desde la lista.",
};

interface ApiErrorOptions {
  status: number;
  code: string;
  details?: unknown;
  kind?: ApiErrorKind;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly kind: ApiErrorKind;
  readonly details: unknown;

  constructor(options: ApiErrorOptions) {
    const kind = options.kind ?? kindFromStatus(options.status);
    super(MESSAGES_BY_CODE[options.code] ?? MESSAGES_BY_KIND[kind]);
    this.name = "ApiError";
    this.status = options.status;
    this.code = options.code;
    this.kind = kind;
    this.details = options.details;
  }
}

export function messageForApiCode(code: string): string {
  return MESSAGES_BY_CODE[code] ?? MESSAGES_BY_KIND.UNEXPECTED;
}

function kindFromStatus(status: number): ApiErrorKind {
  if (status === 0) return "NETWORK";
  if (status === 400 || status === 422) return "VALIDATION";
  if (status === 401) return "UNAUTHENTICATED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 409) return "CONFLICT";
  if (status === 502 || status === 503) return "UNAVAILABLE";
  return "UNEXPECTED";
}

function readErrorEnvelope(body: unknown): { code: string; details: unknown } | null {
  if (typeof body !== "object" || body === null || !("error" in body)) return null;
  const error = body.error;
  if (typeof error !== "object" || error === null || !("code" in error)) return null;
  if (typeof error.code !== "string") return null;
  return { code: error.code, details: "details" in error ? error.details : undefined };
}

/**
 * Convierte una respuesta de error de Express en ApiError.
 * El mensaje visible sale del catálogo del frontend, nunca del texto del servidor.
 * Los detalles solo se conservan para errores de validación.
 */
export function normalizeErrorBody(status: number, body: unknown): ApiError {
  const envelope = readErrorEnvelope(body);
  if (!envelope) {
    return new ApiError({ status, code: "UNKNOWN_ERROR" });
  }
  return new ApiError({
    status,
    code: envelope.code,
    details: envelope.code === "VALIDATION_ERROR" ? envelope.details : undefined,
  });
}

export function networkError(): ApiError {
  return new ApiError({ status: 0, code: "NETWORK_ERROR" });
}

export function invalidResponseError(status: number): ApiError {
  return new ApiError({ status, code: "INVALID_RESPONSE", kind: "INVALID_RESPONSE" });
}

export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}
