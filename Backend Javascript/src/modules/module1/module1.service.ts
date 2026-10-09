import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Express } from "express";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../shared/errors/app-error.js";
import { validatePdfTextLayer } from "./pdf-text.service.js";
import { createNotebookSchema, extractionResponseSchema, reviewSchema } from "./module1.schemas.js";
import type { DocumentExtractor, ExtractionDocument, Module1Identity } from "./module1.types.js";

type UploadedFile = Express.Multer.File;
type ReviewLine = { descripcion?: string; cantidad?: string; unidad?: string; precioUnitario?: string; descuentoPorcentaje?: string; descuentoMonto?: string; recargoPorcentaje?: string; recargoMonto?: string; totalLinea?: string };
type ReviewData = {
  tipoDocumento?: string; folio?: string; fechaEmision?: string; medioPago?: string;
  emisor?: { rut?: string; razonSocial?: string };
  receptor?: { rut?: string; nombre?: string };
  condicionTributaria?: "AFECTA" | "EXENTA" | "NO_AFECTA" | "MIXTA";
  totales?: { neto?: string; iva?: string; exento?: string; total?: string };
  detalles?: ReviewLine[];
  ajustesGlobales?: Array<{ tipo: "DESCUENTO" | "RECARGO"; modalidad: "PORCENTAJE" | "MONTO"; valor?: string | null; descripcion?: string | null }>;
};

export async function validatePdfAndExtract(buffer: Buffer, extractor: DocumentExtractor) {
  const validation = await validatePdfTextLayer(buffer);
  const response = await extractor.extract(buffer);
  const checked = extractionResponseSchema.safeParse(response);
  if (!checked.success) throw new AppError(422, "AI_INVALID_RESPONSE", "La respuesta del servicio de IA no cumple la estructura documental requerida: faltan campos obligatorios o contiene tipos de datos inválidos", checked.error.flatten());
  return { validation, response: checked.data };
}
const decimal = (value: string | null | undefined) => value == null ? null : value;
const fieldValue = <T>(field: { valor: T | null }) => field.valor;

export class Module1Service {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly extractor: DocumentExtractor,
    private readonly storagePath: string,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async createNotebook(identity: Module1Identity, input: unknown) {
    const data = createNotebookSchema.parse(input);
    const exists = await this.prisma.notebook.findFirst({ where: { idEmpresa: identity.idEmpresa, nombre: { equals: data.nombre, mode: "insensitive" } } });
    if (exists) throw new AppError(409, "NOTEBOOK_NAME_TAKEN", "Ya existe un notebook con ese nombre");
    return this.prisma.notebook.create({ data: { idEmpresa: identity.idEmpresa, creadoPorId: identity.idUsuario, ...data } });
  }

  async updateNotebook(identity: Module1Identity, idNotebook: string, input: unknown) {
    const data = createNotebookSchema.parse(input);
    const notebook = await this.prisma.notebook.findFirst({ where: { idNotebook, idEmpresa: identity.idEmpresa } });
    if (!notebook) throw new AppError(404, "NOTEBOOK_NOT_FOUND", "Notebook no encontrado");
    const exists = await this.prisma.notebook.findFirst({ where: { idEmpresa: identity.idEmpresa, nombre: { equals: data.nombre, mode: "insensitive" }, NOT: { idNotebook } } });
    if (exists) throw new AppError(409, "NOTEBOOK_NAME_TAKEN", "Ya existe un notebook con ese nombre");
    return this.prisma.notebook.update({ where: { idNotebook }, data });
  }

  async deleteNotebook(identity: Module1Identity, idNotebook: string) {
    const notebook = await this.prisma.notebook.findFirst({ where: { idNotebook, idEmpresa: identity.idEmpresa }, include: { documentos: { include: { archivo: true } } } });
    if (!notebook) throw new AppError(404, "NOTEBOOK_NOT_FOUND", "Notebook no encontrado");
    await this.prisma.$transaction(async (tx) => {
      await tx.documento.deleteMany({ where: { idEmpresa: identity.idEmpresa, idNotebook } });
      await tx.loteProcesamiento.deleteMany({ where: { idEmpresa: identity.idEmpresa, idNotebook } });
      await tx.notebook.delete({ where: { idNotebook } });
    });
    await Promise.all(notebook.documentos.flatMap((document) => document.archivo?.storageKey ? [unlink(path.resolve(this.storagePath, document.archivo.storageKey)).catch(() => undefined)] : []));
    return { idNotebook, eliminado: true };
  }

  listNotebooks(identity: Module1Identity) {
    return this.prisma.notebook.findMany({ where: { idEmpresa: identity.idEmpresa }, orderBy: { createdAt: "desc" }, include: { _count: { select: { documentos: true } } } });
  }

  async getNotebook(identity: Module1Identity, idNotebook: string) {
    const notebook = await this.prisma.notebook.findFirst({ where: { idNotebook, idEmpresa: identity.idEmpresa }, include: { documentos: { orderBy: { createdAt: "desc" }, include: { resultados: { orderBy: { idResultado: "desc" }, take: 1 }, revisiones: { where: { estado: "CONFIRMADA" }, orderBy: { createdAt: "desc" }, take: 1 } } } } });
    if (!notebook) throw new AppError(404, "NOTEBOOK_NOT_FOUND", "Notebook no encontrado");
    return { ...notebook, documentos: notebook.documentos.map(({ resultados, revisiones, ...documento }) => { const resultado = resultados[0]; const revision = revisiones[0]; return { ...documento, folio: revision?.folio ?? resultado?.folio ?? null, proveedor: revision?.emisorRazonSocial ?? resultado?.emisorRazonSocial ?? null, rutEmisor: revision?.emisorRut ?? resultado?.emisorRut ?? null, fechaEmision: revision?.fechaEmision ?? resultado?.fechaEmision ?? null, estadoPago: revision?.estadoPago ?? null }; }) };
  }

  async uploadDocuments(identity: Module1Identity, idNotebook: string, files: UploadedFile[]) {
    if (files.length < 1 || files.length > 10) throw new AppError(400, "INVALID_BATCH_SIZE", "El lote debe contener entre 1 y 10 documentos");
    const notebook = await this.prisma.notebook.findFirst({ where: { idNotebook, idEmpresa: identity.idEmpresa } });
    if (!notebook) throw new AppError(404, "NOTEBOOK_NOT_FOUND", "Notebook no encontrado");
    for (const file of files) this.validateFile(file);
    await mkdir(path.resolve(this.storagePath), { recursive: true });
    const lote = await this.prisma.$transaction(async (tx) => {
      const created = await tx.loteProcesamiento.create({ data: { idEmpresa: identity.idEmpresa, idNotebook, creadoPorId: identity.idUsuario, cantidadDocumentos: files.length } });
      for (const [index, file] of files.entries()) {
        const idDocumento = randomUUID();
        const storageKey = `${identity.idEmpresa}/${idDocumento}.pdf`;
        const destination = path.resolve(this.storagePath, storageKey);
        await mkdir(path.dirname(destination), { recursive: true });
        await writeFile(destination, file.buffer);
        const documento = await tx.documento.create({ data: { idDocumento, idEmpresa: identity.idEmpresa, idNotebook, idLote: created.idLote, cargadoPorId: identity.idUsuario, posicionLote: index + 1 } });
        await tx.archivoPDF.create({ data: { idDocumento: documento.idDocumento, nombreOriginal: file.originalname, tipoMime: "application/pdf", tamanoBytes: file.size, hashArchivo: createHash("sha256").update(file.buffer).digest("hex"), storageKey } });
      }
      return created;
    });
    const response = await this.prisma.loteProcesamiento.findUnique({ where: { idLote: lote.idLote }, include: { documentos: { include: { archivo: true } } } });
    return response ? { ...response, documentos: response.documentos.map(({ archivo, ...documento }) => ({ ...documento, nombreArchivo: archivo?.nombreOriginal ?? null })) } : response;
  }

  private validateFile(file: UploadedFile) {
    if (file.mimetype !== "application/pdf" || file.size < 1 || file.size > 15 * 1024 * 1024) throw new AppError(400, "INVALID_PDF_FILE", "Solo se aceptan PDF de hasta 15 MB");
    if (file.buffer.subarray(0, 4).toString("ascii") !== "%PDF") throw new AppError(400, "INVALID_PDF_FILE", "El archivo no es un PDF válido");
  }

  async processBatch(identity: Module1Identity, idLote: string) {
    const lote = await this.prisma.loteProcesamiento.findFirst({ where: { idLote, idEmpresa: identity.idEmpresa }, include: { documentos: { orderBy: { posicionLote: "asc" }, include: { archivo: true, intentos: { orderBy: { numeroIntento: "desc" }, take: 1 } } } } });
    if (!lote) throw new AppError(404, "BATCH_NOT_FOUND", "Lote no encontrado");
    await this.prisma.loteProcesamiento.update({ where: { idLote }, data: { procesamientoInicio: this.now() } });
    for (const documento of lote.documentos.filter((item) => item.estado === "PENDIENTE")) await this.processDocument(identity, documento.idDocumento);
    const result = await this.prisma.loteProcesamiento.update({ where: { idLote }, data: { procesamientoFin: this.now() }, include: { documentos: { orderBy: { posicionLote: "asc" } } } });
    const processed = result.documentos.filter((d) => d.estado === "PENDIENTE_REVISION" || d.estado === "CONFIRMADO").length;
    const errors = result.documentos.filter((d) => d.estado === "ERROR").length;
    const updated = await this.prisma.loteProcesamiento.update({ where: { idLote }, data: { cantidadProcesados: processed, cantidadErrores: errors }, include: { documentos: { orderBy: { posicionLote: "asc" }, include: { archivo: true, intentos: { orderBy: { numeroIntento: "desc" }, take: 1 } } } } });
    return { ...updated, documentos: updated.documentos.map(({ archivo, intentos, ...documento }) => ({ ...documento, nombreArchivo: archivo?.nombreOriginal ?? null, ...(documento.estado === "ERROR" && intentos[0]?.errorCodigo ? { error: { code: intentos[0].errorCodigo, message: intentos[0].errorMensaje ?? "No fue posible procesar el documento" } } : {}) })) };
  }

  async getBatch(identity: Module1Identity, idLote: string) {
    const lote = await this.prisma.loteProcesamiento.findFirst({ where: { idLote, idEmpresa: identity.idEmpresa }, include: { documentos: { orderBy: { posicionLote: "asc" }, include: { archivo: true, intentos: { orderBy: { numeroIntento: "desc" }, take: 1 } } } } });
    if (!lote) throw new AppError(404, "BATCH_NOT_FOUND", "Lote no encontrado");
    return { ...lote, documentos: lote.documentos.map(({ archivo, intentos, ...documento }) => ({ ...documento, nombreArchivo: archivo?.nombreOriginal ?? null, ...(documento.estado === "ERROR" && intentos[0]?.errorCodigo ? { error: { code: intentos[0].errorCodigo, message: intentos[0].errorMensaje ?? "No fue posible procesar el documento" } } : {}) })) };
  }

  async retryDocument(identity: Module1Identity, idDocumento: string) {
    const document = await this.findDocument(identity, idDocumento);
    if (document.estado !== "ERROR") throw new AppError(409, "DOCUMENT_NOT_RETRYABLE", "Solo se pueden reintentar documentos con error");
    const result = await this.processDocument(identity, idDocumento);
    if (result.estado === "ERROR" && "error" in result) {
      throw new AppError(422, result.error.code, result.error.message);
    }
    return result;
  }

  private async processDocument(identity: Module1Identity, idDocumento: string) {
    const document = await this.findDocument(identity, idDocumento);
    const attemptNumber = await this.prisma.intentoProcesamiento.count({ where: { idDocumento } }) + 1;
    const attempt = await this.prisma.$transaction(async (tx) => {
      await tx.documento.update({ where: { idDocumento }, data: { estado: "PROCESANDO" } });
      return tx.intentoProcesamiento.create({ data: { idDocumento, numeroIntento: attemptNumber } });
    });
    try {
      const buffer = await readFile(path.resolve(this.storagePath, document.archivo!.storageKey));
      const extracted = await validatePdfAndExtract(buffer, this.extractor);
      await this.prisma.intentoProcesamiento.update({ where: { idIntento: attempt.idIntento }, data: { validacionPdf: { contieneTexto: true, paginas: extracted.validation.pages, caracteresTexto: extracted.validation.textCharacters } } });
      await this.persistExtraction(identity, document.idDocumento, attempt.idIntento, extracted.response.documento as ExtractionDocument, extracted.response);
      return this.prisma.documento.update({ where: { idDocumento }, data: { estado: "PENDIENTE_REVISION" } });
    } catch (error) {
      const appError = error instanceof AppError ? error : new AppError(422, "DOCUMENT_PROCESSING_FAILED", "No fue posible procesar el documento");
      await this.prisma.$transaction([
        this.prisma.intentoProcesamiento.update({ where: { idIntento: attempt.idIntento }, data: { finAt: this.now(), errorCodigo: appError.code, errorMensaje: appError.message } }),
        this.prisma.documento.update({ where: { idDocumento }, data: { estado: "ERROR" } }),
      ]);
      return { idDocumento, estado: "ERROR", error: { code: appError.code, message: appError.message } };
    }
  }

  private async persistExtraction(identity: Module1Identity, idDocumento: string, idIntento: string, data: ExtractionDocument, response: { errores: unknown[]; advertencias: unknown[] }) {
    const d = data;
    const details = d.detalles.valor?.map((item, index) => ({
      numeroLinea: index + 1,
      descripcion: fieldValue(item.descripcion), descripcionEstado: item.descripcion.estado,
      cantidad: decimal(fieldValue(item.cantidad)), cantidadEstado: item.cantidad.estado,
      unidad: fieldValue(item.unidad), unidadEstado: item.unidad.estado,
      precioUnitario: decimal(fieldValue(item.precioUnitario)), precioUnitarioEstado: item.precioUnitario.estado,
      descuentoPorcentaje: decimal(fieldValue(item.descuentoPorcentaje)), descuentoPorcentajeEstado: item.descuentoPorcentaje.estado,
      descuentoMonto: decimal(fieldValue(item.descuentoMonto)), descuentoMontoEstado: item.descuentoMonto.estado,
      recargoPorcentaje: decimal(fieldValue(item.recargoPorcentaje)), recargoPorcentajeEstado: item.recargoPorcentaje.estado,
      recargoMonto: decimal(fieldValue(item.recargoMonto)), recargoMontoEstado: item.recargoMonto.estado,
      totalLinea: decimal(fieldValue(item.totalLinea)), totalLineaEstado: item.totalLinea.estado,
      metadata: JSON.parse(JSON.stringify(item)),
    }));
    const adjustments = d.ajustesGlobales.valor?.map((item, index) => ({
      numeroAjuste: index + 1, tipo: item.tipo, modalidad: item.modalidad,
      valor: decimal(fieldValue(item.valor)), valorEstado: item.valor.estado,
      descripcion: fieldValue(item.descripcion), descripcionEstado: item.descripcion.estado,
    }));
    await this.prisma.resultadoExtraccion.create({ data: {
      idDocumento, idIntento,
      tipoDocumento: fieldValue(d.tipoDocumento), tipoDocumentoEstado: d.tipoDocumento.estado,
      folio: fieldValue(d.folio), folioEstado: d.folio.estado,
      fechaEmision: fieldValue(d.fechaEmision) ? new Date(`${fieldValue(d.fechaEmision)}T00:00:00Z`) : null, fechaEmisionEstado: d.fechaEmision.estado,
      emisorRut: fieldValue(d.emisor.rut), emisorRutEstado: d.emisor.rut.estado, emisorRazonSocial: fieldValue(d.emisor.razonSocial), emisorRazonSocialEstado: d.emisor.razonSocial.estado,
      receptorRut: fieldValue(d.receptor.rut), receptorRutEstado: d.receptor.rut.estado, receptorNombre: fieldValue(d.receptor.nombre), receptorNombreEstado: d.receptor.nombre.estado,
      condicionTributaria: fieldValue(d.condicionTributaria), condicionEstado: d.condicionTributaria.estado,
      neto: decimal(fieldValue(d.totales.neto)), netoEstado: d.totales.neto.estado, iva: decimal(fieldValue(d.totales.iva)), ivaEstado: d.totales.iva.estado, exento: decimal(fieldValue(d.totales.exento)), exentoEstado: d.totales.exento.estado, total: decimal(fieldValue(d.totales.total)), totalEstado: d.totales.total.estado,
      medioPago: fieldValue(d.medioPago), medioPagoEstado: d.medioPago.estado,
      metadata: JSON.parse(JSON.stringify({ identidad: identity, documento: d })), errores: JSON.parse(JSON.stringify(response.errores)), advertencias: JSON.parse(JSON.stringify(response.advertencias)),
      detalles: details ? { create: details } : undefined,
      ajustesGlobales: adjustments ? { create: adjustments } : undefined,
    } });
  }

  async getDocument(identity: Module1Identity, idDocumento: string) {
    const document = await this.findDocument(identity, idDocumento);
    const result = await this.prisma.documento.findUnique({ where: { idDocumento: document.idDocumento }, include: { archivo: true, resultados: { include: { detalles: true, ajustesGlobales: true }, orderBy: { idResultado: "desc" } }, revisiones: { include: { detalles: true, ajustesGlobales: true }, orderBy: { createdAt: "desc" } } } });
    if (!result) throw new AppError(404, "DOCUMENT_NOT_FOUND", "Documento no encontrado");
    return {
      ...result,
      archivo: result.archivo ? { ...result.archivo, tamanoBytes: result.archivo.tamanoBytes.toString() } : null,
    };
  }

  async getPdf(identity: Module1Identity, idDocumento: string) {
    const document = await this.findDocument(identity, idDocumento);
    return { file: await readFile(path.resolve(this.storagePath, document.archivo!.storageKey)), name: document.archivo!.nombreOriginal };
  }

  async saveReview(identity: Module1Identity, idDocumento: string, input: unknown) {
    const parsed = reviewSchema.parse(input);
    const document = await this.findDocument(identity, idDocumento);
    if (!["PENDIENTE_REVISION", "CONFIRMADO"].includes(document.estado)) throw new AppError(409, "DOCUMENT_NOT_IN_REVIEW", "El documento no está disponible para confirmación");
    const result = await this.prisma.resultadoExtraccion.findFirst({ where: { idDocumento }, orderBy: { idResultado: "desc" }, include: { detalles: true, ajustesGlobales: true } });
    if (!result) throw new AppError(409, "EXTRACTION_NOT_FOUND", "No existe una extracción para revisar");
    const data = parsed.datos as ReviewData;
    const pick = <T>(value: T | undefined, fallback: T | null): T | null => value === undefined ? fallback : value;
    const decimalString = (value: { toString(): string } | null | undefined) => value == null ? null : value.toString();
    const extractedDetails = result.detalles;
    const reviewDetails = data.detalles ?? extractedDetails.map((line) => ({
      descripcion: line.descripcion, cantidad: line.cantidad?.toString(), unidad: line.unidad,
      precioUnitario: line.precioUnitario?.toString(), descuentoPorcentaje: line.descuentoPorcentaje?.toString(), descuentoMonto: line.descuentoMonto?.toString(),
      recargoPorcentaje: line.recargoPorcentaje?.toString(), recargoMonto: line.recargoMonto?.toString(), totalLinea: line.totalLinea?.toString(),
    }));
    const reviewAdjustments = data.ajustesGlobales ?? result.ajustesGlobales.map((adjustment) => ({
      tipo: adjustment.tipo, modalidad: adjustment.modalidad, valor: adjustment.valor?.toString(), descripcion: adjustment.descripcion,
    }));
    return this.prisma.revisionDocumento.create({ data: {
      idDocumento, idResultado: result.idResultado, revisadoPorId: identity.idUsuario, estadoPago: parsed.estadoPago, observacion: parsed.observacion,
      tipoDocumento: pick(data.tipoDocumento, result.tipoDocumento), folio: pick(data.folio, result.folio), fechaEmision: data.fechaEmision === undefined ? result.fechaEmision : data.fechaEmision ? new Date(`${data.fechaEmision}T00:00:00Z`) : null,
      emisorRut: pick(data.emisor?.rut, result.emisorRut), emisorRazonSocial: pick(data.emisor?.razonSocial, result.emisorRazonSocial), receptorRut: pick(data.receptor?.rut, result.receptorRut), receptorNombre: pick(data.receptor?.nombre, result.receptorNombre),
      condicionTributaria: pick(data.condicionTributaria, result.condicionTributaria), neto: pick(data.totales?.neto, decimalString(result.neto)), iva: pick(data.totales?.iva, decimalString(result.iva)), exento: pick(data.totales?.exento, decimalString(result.exento)), total: pick(data.totales?.total, decimalString(result.total)), medioPago: pick(data.medioPago, result.medioPago), estado: "EDITANDO",
      detalles: { create: reviewDetails.map((line, index) => {
        const extracted = extractedDetails[index];
        return { idDetalleExtraccion: extracted?.idDetalle, numeroLinea: index + 1, descripcion: pick(line.descripcion, extracted?.descripcion), cantidad: pick(line.cantidad, decimalString(extracted?.cantidad)), unidad: pick(line.unidad, extracted?.unidad), precioUnitario: pick(line.precioUnitario, decimalString(extracted?.precioUnitario)), descuentoPorcentaje: pick(line.descuentoPorcentaje, decimalString(extracted?.descuentoPorcentaje)), descuentoMonto: pick(line.descuentoMonto, decimalString(extracted?.descuentoMonto)), recargoPorcentaje: pick(line.recargoPorcentaje, decimalString(extracted?.recargoPorcentaje)), recargoMonto: pick(line.recargoMonto, decimalString(extracted?.recargoMonto)), totalLinea: pick(line.totalLinea, decimalString(extracted?.totalLinea)) };
      }) },
      ajustesGlobales: reviewAdjustments.length ? { create: reviewAdjustments.map((adjustment, index) => ({ numeroAjuste: index + 1, tipo: adjustment.tipo, modalidad: adjustment.modalidad, valor: adjustment.valor, descripcion: adjustment.descripcion })) } : undefined,
    } });
  }

  async confirmDocument(identity: Module1Identity, idDocumento: string) {
    const document = await this.findDocument(identity, idDocumento);
    const review = await this.prisma.revisionDocumento.findFirst({ where: { idDocumento: document.idDocumento, revisadoPorId: identity.idUsuario, estado: "EDITANDO" }, orderBy: { createdAt: "desc" } });
    if (document.estado === "CONFIRMADO" && !review) return document;
    if (!review) throw new AppError(409, "REVIEW_NOT_FOUND", "Debe guardar una revisión antes de confirmar");
    const confirmedAt = this.now();
    return this.prisma.$transaction(async (tx) => {
      await tx.revisionDocumento.updateMany({ where: { idDocumento, estado: "CONFIRMADA", NOT: { idRevision: review.idRevision } }, data: { estado: "PENDIENTE", confirmedAt: null } });
      await tx.revisionDocumento.update({ where: { idRevision: review.idRevision }, data: { estado: "CONFIRMADA", confirmedAt } });
      return tx.documento.update({ where: { idDocumento }, data: { estado: "CONFIRMADO", confirmadoAt: confirmedAt } });
    });
  }

  async reopenDocument(identity: Module1Identity, idDocumento: string) {
    const document = await this.findDocument(identity, idDocumento);
    if (document.estado !== "CONFIRMADO") return document;
    return this.prisma.documento.update({ where: { idDocumento }, data: { estado: "PENDIENTE_REVISION", confirmadoAt: null } });
  }

  async deleteDocument(identity: Module1Identity, idDocumento: string) {
    const document = await this.findDocument(identity, idDocumento);
    if (!["PENDIENTE", "ERROR", "PENDIENTE_REVISION", "CONFIRMADO"].includes(document.estado)) throw new AppError(409, "DOCUMENT_NOT_DELETABLE", "El documento se está procesando y no puede eliminarse");
    await this.prisma.documento.delete({ where: { idDocumento } });
    await unlink(path.resolve(this.storagePath, document.archivo!.storageKey)).catch(() => undefined);
    return { idDocumento, eliminado: true };
  }

  private async findDocument(identity: Module1Identity, idDocumento: string) {
    const document = await this.prisma.documento.findFirst({ where: { idDocumento, idEmpresa: identity.idEmpresa }, include: { archivo: true } });
    if (!document) throw new AppError(404, "DOCUMENT_NOT_FOUND", "Documento no encontrado");
    if (!document.archivo) throw new AppError(500, "PDF_NOT_FOUND", "El PDF asociado no está disponible");
    return document;
  }
}
