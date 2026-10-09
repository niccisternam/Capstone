import { z } from "zod";
import { getAccessToken, request, requestFormData, requestPdf, type ApiResult } from "./client";
import { ApiError, invalidResponseError, isAbortError, networkError, normalizeErrorBody } from "./api-error";
import {
  documentoDetalleResponseSchema,
  documentoResponseSchema,
  eliminarDocumentoResponseSchema,
  loteResponseSchema,
  notebookDetalleResponseSchema,
  notebookInputSchema,
  notebookResponseSchema,
  notebooksResponseSchema,
  reintentoResponseSchema,
  revisionInputSchema,
  revisionResponseSchema,
  type Documento,
  type DocumentoDetalle,
  type EliminarDocumentoResultado,
  type Lote,
  type Notebook,
  type NotebookConConteo,
  type NotebookDetalle,
  type NotebookInput,
  type ReintentoResultado,
  type RevisionDocumento,
  type RevisionInput,
} from "./module1.schemas";

const MODULE1_PATH = "/module1";

export const PDF_BATCH_LIMITS = {
  minFiles: 1,
  maxFiles: 10,
  maxBytes: 15 * 1024 * 1024,
} as const;

const PDF_SIGNATURE = [0x25, 0x50, 0x44, 0x46];

export type PdfFileIssueReason = "TIPO_NO_PERMITIDO" | "TAMANO_NO_PERMITIDO" | "FIRMA_NO_VALIDA";

export interface PdfFileIssue {
  fileName: string;
  motivo: PdfFileIssueReason;
}

export type PdfBatchValidation =
  | { ok: true }
  | { ok: false; code: "INVALID_BATCH_SIZE" }
  | { ok: false; code: "INVALID_PDF_FILE"; issues: PdfFileIssue[] };

const uuidSchema = z.uuid();

/**
 * Valida la cantidad y el contenido de los PDF antes de enviarlos.
 * Replica las reglas del backend: MIME application/pdf, entre 1 byte y 15 MB,
 * y firma %PDF al inicio del archivo.
 */
export async function validatePdfBatch(files: readonly File[]): Promise<PdfBatchValidation> {
  if (files.length < PDF_BATCH_LIMITS.minFiles || files.length > PDF_BATCH_LIMITS.maxFiles) {
    return { ok: false, code: "INVALID_BATCH_SIZE" };
  }

  const issues: PdfFileIssue[] = [];
  for (const file of files) {
    const motivo = await validatePdfFile(file);
    if (motivo) issues.push({ fileName: file.name, motivo });
  }

  return issues.length > 0 ? { ok: false, code: "INVALID_PDF_FILE", issues } : { ok: true };
}

async function validatePdfFile(file: File): Promise<PdfFileIssueReason | null> {
  if (file.type !== "application/pdf") return "TIPO_NO_PERMITIDO";
  if (file.size < 1 || file.size > PDF_BATCH_LIMITS.maxBytes) return "TAMANO_NO_PERMITIDO";
  const head = new Uint8Array(await file.slice(0, PDF_SIGNATURE.length).arrayBuffer());
  const hasSignature = head.length === PDF_SIGNATURE.length && PDF_SIGNATURE.every((byte, index) => head[index] === byte);
  return hasSignature ? null : "FIRMA_NO_VALIDA";
}

function parseIdentifier(value: string): string {
  const parsed = uuidSchema.safeParse(value);
  if (!parsed.success) throw new ApiError({ status: 400, code: "INVALID_IDENTIFIER" });
  return parsed.data;
}

function parseInput<TOutput>(schema: z.ZodType<TOutput>, value: unknown): TOutput {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    throw new ApiError({
      status: 400,
      code: "VALIDATION_ERROR",
      details: z.flattenError(parsed.error),
    });
  }
  return parsed.data;
}

async function execute(run: () => Promise<ApiResult<unknown>>): Promise<ApiResult<unknown>> {
  let result: ApiResult<unknown>;
  try {
    result = await run();
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw networkError();
  }
  if (result.status < 200 || result.status > 299) {
    throw normalizeErrorBody(result.status, result.data);
  }
  return result;
}

function parseResponse<TOutput>(result: ApiResult<unknown>, schema: z.ZodType<TOutput>): TOutput {
  const parsed = schema.safeParse(result.data);
  if (!parsed.success) throw invalidResponseError(result.status);
  return parsed.data;
}

async function call<TOutput>(run: () => Promise<ApiResult<unknown>>, schema: z.ZodType<TOutput>): Promise<TOutput> {
  return parseResponse(await execute(run), schema);
}

export async function listNotebooks(): Promise<NotebookConConteo[]> {
  const body = await call(() => request<unknown>(`${MODULE1_PATH}/notebooks`, {}, getAccessToken()), notebooksResponseSchema);
  return body.notebooks;
}

export async function createNotebook(input: NotebookInput): Promise<Notebook> {
  const payload = parseInput(notebookInputSchema, input);
  const body = await call(
    () => request<unknown>(`${MODULE1_PATH}/notebooks`, { method: "POST", body: JSON.stringify(payload) }, getAccessToken()),
    notebookResponseSchema,
  );
  return body.notebook;
}

export async function updateNotebook(idNotebook: string, input: NotebookInput): Promise<Notebook> {
  const id = parseIdentifier(idNotebook);
  const payload = parseInput(notebookInputSchema, input);
  const body = await call(() => request<unknown>(`${MODULE1_PATH}/notebooks/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(payload) }, getAccessToken()), notebookResponseSchema);
  return body.notebook;
}

export async function deleteNotebook(idNotebook: string): Promise<{ idNotebook: string; eliminado: true }> {
  const id = parseIdentifier(idNotebook);
  const body = await call(() => request<unknown>(`${MODULE1_PATH}/notebooks/${encodeURIComponent(id)}`, { method: "DELETE" }, getAccessToken()), z.object({ idNotebook: z.uuid(), eliminado: z.literal(true) }));
  return body;
}

export async function getNotebook(idNotebook: string): Promise<NotebookDetalle> {
  const id = parseIdentifier(idNotebook);
  const body = await call(
    () => request<unknown>(`${MODULE1_PATH}/notebooks/${encodeURIComponent(id)}`, {}, getAccessToken()),
    notebookDetalleResponseSchema,
  );
  return body.notebook;
}

/**
 * Carga entre 1 y 10 PDF en un solo lote. Los documentos quedan en PENDIENTE;
 * el procesamiento se inicia con processBatch.
 */
export async function uploadDocuments(idNotebook: string, files: readonly File[]): Promise<Lote> {
  const id = parseIdentifier(idNotebook);
  const validation = await validatePdfBatch(files);
  if (!validation.ok) throw pdfBatchError(validation);

  const formData = new FormData();
  for (const file of files) formData.append("documents", file, file.name);

  const body = await call(
    () => requestFormData<unknown>(`${MODULE1_PATH}/notebooks/${encodeURIComponent(id)}/documents`, formData, getAccessToken()),
    loteResponseSchema,
  );
  return body.lote;
}

function pdfBatchError(validation: Extract<PdfBatchValidation, { ok: false }>): ApiError {
  const archivos = validation.code === "INVALID_PDF_FILE"
    ? validation.issues.map((issue) => ({ nombre: issue.fileName, motivo: issue.motivo }))
    : [];
  return new ApiError({ status: 400, code: validation.code, details: { archivos } });
}

/**
 * Inicia el procesamiento secuencial del lote. La petición puede tardar varios minutos
 * porque el backend procesa todos los documentos antes de responder. No se aplica
 * timeout automático: un corte del cliente no detiene el procesamiento del servidor.
 */
export async function processBatch(idLote: string, options: { signal?: AbortSignal } = {}): Promise<Lote> {
  const id = parseIdentifier(idLote);
  const body = await call(
    () => request<unknown>(`${MODULE1_PATH}/batches/${encodeURIComponent(id)}/process`, { method: "POST", signal: options.signal }, getAccessToken()),
    loteResponseSchema,
  );
  return body.lote;
}

export async function getBatch(idLote: string): Promise<Lote> {
  const id = parseIdentifier(idLote);
  const body = await call(
    () => request<unknown>(`${MODULE1_PATH}/batches/${encodeURIComponent(id)}`, {}, getAccessToken()),
    loteResponseSchema,
  );
  return body.lote;
}

export async function getDocument(idDocumento: string): Promise<DocumentoDetalle> {
  const id = parseIdentifier(idDocumento);
  const body = await call(
    () => request<unknown>(`${MODULE1_PATH}/documents/${encodeURIComponent(id)}`, {}, getAccessToken()),
    documentoDetalleResponseSchema,
  );
  return body.documento;
}

export async function getDocumentPdf(idDocumento: string): Promise<Blob> {
  const id = parseIdentifier(idDocumento);
  const result = await execute(() => requestPdf(`${MODULE1_PATH}/documents/${encodeURIComponent(id)}/pdf`, getAccessToken()));
  const { data } = result;
  if (!(data instanceof Blob) || !data.type.startsWith("application/pdf")) {
    throw invalidResponseError(result.status);
  }
  return data;
}

/**
 * Guarda una revisión en estado EDITANDO. Cada llamada crea una revisión nueva.
 * Los campos omitidos conservan el valor extraído; null borra el valor.
 */
export async function saveReview(idDocumento: string, input: RevisionInput): Promise<RevisionDocumento> {
  const id = parseIdentifier(idDocumento);
  const payload = parseInput(revisionInputSchema, input);
  const body = await call(
    () => request<unknown>(
      `${MODULE1_PATH}/documents/${encodeURIComponent(id)}/review`,
      { method: "PATCH", body: JSON.stringify(payload) },
      getAccessToken(),
    ),
    revisionResponseSchema,
  );
  return body.revision;
}

export async function confirmDocument(idDocumento: string): Promise<Documento> {
  const id = parseIdentifier(idDocumento);
  const body = await call(
    () => request<unknown>(`${MODULE1_PATH}/documents/${encodeURIComponent(id)}/confirm`, { method: "POST" }, getAccessToken()),
    documentoResponseSchema,
  );
  return body.documento;
}

export async function reopenDocument(idDocumento: string): Promise<Documento> {
  const id = parseIdentifier(idDocumento);
  const body = await call(() => request<unknown>(`${MODULE1_PATH}/documents/${encodeURIComponent(id)}/reopen`, { method: "POST" }, getAccessToken()), documentoResponseSchema);
  return body.documento;
}

/**
 * Reintenta un documento en ERROR. El backend responde 200 incluso cuando el reintento
 * vuelve a fallar; en ese caso el resultado trae `error` en lugar de los campos del documento.
 */
export async function retryDocument(idDocumento: string): Promise<ReintentoResultado> {
  const id = parseIdentifier(idDocumento);
  const body = await call(
    () => request<unknown>(`${MODULE1_PATH}/documents/${encodeURIComponent(id)}/retry`, { method: "POST" }, getAccessToken()),
    reintentoResponseSchema,
  );
  return body.documento;
}

export async function deleteDocument(idDocumento: string): Promise<EliminarDocumentoResultado> {
  const id = parseIdentifier(idDocumento);
  return call(
    () => request<unknown>(`${MODULE1_PATH}/documents/${encodeURIComponent(id)}`, { method: "DELETE" }, getAccessToken()),
    eliminarDocumentoResponseSchema,
  );
}
