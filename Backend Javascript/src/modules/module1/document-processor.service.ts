import { readFile } from "node:fs/promises";
import path from "node:path";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../shared/errors/app-error.js";
import { validatePdfTextLayer } from "./pdf-text.service.js";
import { findOwnedDocument } from "./document.lookup.js";
import { extractionResponseSchema } from "./module1.schemas.js";
import type {
  DocumentExtractor,
  ExtractionDocument,
  ExtractionResponse,
  Module1Identity,
} from "./module1.types.js";

const decimal = (value: string | null | undefined) =>
  value == null ? null : value;
const fieldValue = <T>(field: { valor: T | null }) => field.valor;

export async function validatePdfAndExtract(
  buffer: Buffer,
  extractor: DocumentExtractor,
) {
  const validation = await validatePdfTextLayer(buffer);
  const response = await extractor.extract(buffer);
  const checked = extractionResponseSchema.safeParse(response);
  if (!checked.success) {
    throw new AppError(
      422,
      "AI_INVALID_RESPONSE",
      "La respuesta del servicio de IA no cumple la estructura documental requerida: faltan campos obligatorios o contiene tipos de datos inválidos",
      checked.error.flatten(),
    );
  }
  return { validation, response: checked.data };
}

export class DocumentProcessor {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly extractor: DocumentExtractor,
    private readonly storagePath: string,
    private readonly now: () => Date,
  ) {}

  async process(identity: Module1Identity, idDocumento: string) {
    const document = await findOwnedDocument(
      this.prisma,
      identity,
      idDocumento,
    );
    const attemptNumber =
      (await this.prisma.intentoProcesamiento.count({
        where: { idDocumento },
      })) + 1;
    const attempt = await this.prisma.$transaction(async (tx) => {
      await tx.documento.update({
        where: { idDocumento },
        data: { estado: "PROCESANDO" },
      });
      return tx.intentoProcesamiento.create({
        data: { idDocumento, numeroIntento: attemptNumber },
      });
    });

    try {
      const buffer = await readFile(
        path.resolve(this.storagePath, document.archivo!.storageKey),
      );
      const extracted = await validatePdfAndExtract(buffer, this.extractor);
      await this.prisma.intentoProcesamiento.update({
        where: { idIntento: attempt.idIntento },
        data: {
          validacionPdf: {
            contieneTexto: true,
            paginas: extracted.validation.pages,
            caracteresTexto: extracted.validation.textCharacters,
          },
        },
      });
      await this.persistExtraction(
        identity,
        document.idDocumento,
        attempt.idIntento,
        extracted.response.documento as ExtractionDocument,
        extracted.response,
      );
      return this.prisma.documento.update({
        where: { idDocumento },
        data: { estado: "PENDIENTE_REVISION" },
      });
    } catch (error) {
      const appError =
        error instanceof AppError
          ? error
          : new AppError(
              422,
              "DOCUMENT_PROCESSING_FAILED",
              "No fue posible procesar el documento",
            );
      await this.prisma.$transaction([
        this.prisma.intentoProcesamiento.update({
          where: { idIntento: attempt.idIntento },
          data: {
            finAt: this.now(),
            errorCodigo: appError.code,
            errorMensaje: appError.message,
          },
        }),
        this.prisma.documento.update({
          where: { idDocumento },
          data: { estado: "ERROR" },
        }),
      ]);
      return {
        idDocumento,
        estado: "ERROR" as const,
        error: { code: appError.code, message: appError.message },
      };
    }
  }

  private async persistExtraction(
    identity: Module1Identity,
    idDocumento: string,
    idIntento: string,
    data: ExtractionDocument,
    response: ExtractionResponse,
  ) {
    const d = data;
    const details = d.detalles.valor?.map((item, index) => ({
      numeroLinea: index + 1,
      descripcion: fieldValue(item.descripcion),
      descripcionEstado: item.descripcion.estado,
      cantidad: decimal(fieldValue(item.cantidad)),
      cantidadEstado: item.cantidad.estado,
      unidad: fieldValue(item.unidad),
      unidadEstado: item.unidad.estado,
      precioUnitario: decimal(fieldValue(item.precioUnitario)),
      precioUnitarioEstado: item.precioUnitario.estado,
      descuentoPorcentaje: decimal(fieldValue(item.descuentoPorcentaje)),
      descuentoPorcentajeEstado: item.descuentoPorcentaje.estado,
      descuentoMonto: decimal(fieldValue(item.descuentoMonto)),
      descuentoMontoEstado: item.descuentoMonto.estado,
      recargoPorcentaje: decimal(fieldValue(item.recargoPorcentaje)),
      recargoPorcentajeEstado: item.recargoPorcentaje.estado,
      recargoMonto: decimal(fieldValue(item.recargoMonto)),
      recargoMontoEstado: item.recargoMonto.estado,
      totalLinea: decimal(fieldValue(item.totalLinea)),
      totalLineaEstado: item.totalLinea.estado,
      metadata: JSON.parse(JSON.stringify(item)),
    }));
    const adjustments = d.ajustesGlobales.valor?.map((item, index) => ({
      numeroAjuste: index + 1,
      tipo: item.tipo,
      modalidad: item.modalidad,
      valor: decimal(fieldValue(item.valor)),
      valorEstado: item.valor.estado,
      descripcion: fieldValue(item.descripcion),
      descripcionEstado: item.descripcion.estado,
    }));

    await this.prisma.resultadoExtraccion.create({
      data: {
        idDocumento,
        idIntento,
        tipoDocumento: fieldValue(d.tipoDocumento),
        tipoDocumentoEstado: d.tipoDocumento.estado,
        folio: fieldValue(d.folio),
        folioEstado: d.folio.estado,
        fechaEmision: fieldValue(d.fechaEmision)
          ? new Date(`${fieldValue(d.fechaEmision)}T00:00:00Z`)
          : null,
        fechaEmisionEstado: d.fechaEmision.estado,
        emisorRut: fieldValue(d.emisor.rut),
        emisorRutEstado: d.emisor.rut.estado,
        emisorRazonSocial: fieldValue(d.emisor.razonSocial),
        emisorRazonSocialEstado: d.emisor.razonSocial.estado,
        receptorRut: fieldValue(d.receptor.rut),
        receptorRutEstado: d.receptor.rut.estado,
        receptorNombre: fieldValue(d.receptor.nombre),
        receptorNombreEstado: d.receptor.nombre.estado,
        condicionTributaria: fieldValue(d.condicionTributaria),
        condicionEstado: d.condicionTributaria.estado,
        neto: decimal(fieldValue(d.totales.neto)),
        netoEstado: d.totales.neto.estado,
        iva: decimal(fieldValue(d.totales.iva)),
        ivaEstado: d.totales.iva.estado,
        exento: decimal(fieldValue(d.totales.exento)),
        exentoEstado: d.totales.exento.estado,
        total: decimal(fieldValue(d.totales.total)),
        totalEstado: d.totales.total.estado,
        medioPago: fieldValue(d.medioPago),
        medioPagoEstado: d.medioPago.estado,
        metadata: JSON.parse(
          JSON.stringify({ identidad: identity, documento: d }),
        ),
        errores: JSON.parse(JSON.stringify(response.errores)),
        advertencias: JSON.parse(JSON.stringify(response.advertencias)),
        detalles: details ? { create: details } : undefined,
        ajustesGlobales: adjustments ? { create: adjustments } : undefined,
      },
    });
  }
}
