import type { PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../shared/errors/app-error.js";
import { normalizeRut } from "../account-requests/rut.js";
import { findOwnedDocument } from "./document.lookup.js";
import { reviewSchema } from "./module1.schemas.js";
import type { Module1Identity } from "./module1.types.js";

type ReviewLine = {
  descripcion?: string;
  cantidad?: string;
  unidad?: string;
  precioUnitario?: string;
  descuentoPorcentaje?: string;
  descuentoMonto?: string;
  recargoPorcentaje?: string;
  recargoMonto?: string;
  totalLinea?: string;
};

type ReviewData = {
  tipoDocumento?: string;
  folio?: string;
  fechaEmision?: string;
  medioPago?: string;
  emisor?: { rut?: string; razonSocial?: string };
  receptor?: { rut?: string; nombre?: string };
  condicionTributaria?: "AFECTA" | "EXENTA" | "NO_AFECTA" | "MIXTA";
  totales?: { neto?: string; iva?: string; exento?: string; total?: string };
  detalles?: ReviewLine[];
  ajustesGlobales?: Array<{
    tipo: "DESCUENTO" | "RECARGO";
    modalidad: "PORCENTAJE" | "MONTO";
    valor?: string | null;
    descripcion?: string | null;
  }>;
};

const pick = <T>(value: T | undefined, fallback: T | null): T | null =>
  value === undefined ? fallback : value;
const decimalString = (value: { toString(): string } | null | undefined) =>
  value == null ? null : value.toString();

export class DocumentReviewService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly now: () => Date,
  ) {}

  async save(identity: Module1Identity, idDocumento: string, input: unknown) {
    const parsed = reviewSchema.parse(input);
    const document = await findOwnedDocument(
      this.prisma,
      identity,
      idDocumento,
    );
    if (!["PENDIENTE_REVISION", "CONFIRMADO"].includes(document.estado)) {
      throw new AppError(
        409,
        "DOCUMENT_NOT_IN_REVIEW",
        "El documento no está disponible para confirmación",
      );
    }
    const result = await this.prisma.resultadoExtraccion.findFirst({
      where: { idDocumento },
      orderBy: { idResultado: "desc" },
      include: { detalles: true, ajustesGlobales: true },
    });
    if (!result) {
      throw new AppError(
        409,
        "EXTRACTION_NOT_FOUND",
        "No existe una extracción para revisar",
      );
    }

    const data = parsed.datos as ReviewData;
    const extractedDetails = result.detalles;
    const reviewDetails =
      data.detalles ??
      extractedDetails.map((line) => ({
        descripcion: line.descripcion,
        cantidad: line.cantidad?.toString(),
        unidad: line.unidad,
        precioUnitario: line.precioUnitario?.toString(),
        descuentoPorcentaje: line.descuentoPorcentaje?.toString(),
        descuentoMonto: line.descuentoMonto?.toString(),
        recargoPorcentaje: line.recargoPorcentaje?.toString(),
        recargoMonto: line.recargoMonto?.toString(),
        totalLinea: line.totalLinea?.toString(),
      }));
    const reviewAdjustments =
      data.ajustesGlobales ??
      result.ajustesGlobales.map((adjustment) => ({
        tipo: adjustment.tipo,
        modalidad: adjustment.modalidad,
        valor: adjustment.valor?.toString(),
        descripcion: adjustment.descripcion,
      }));

    return this.prisma.revisionDocumento.create({
      data: {
        idDocumento,
        idResultado: result.idResultado,
        revisadoPorId: identity.idUsuario,
        estadoPago: parsed.estadoPago,
        observacion: parsed.observacion,
        tipoDocumento: pick(data.tipoDocumento, result.tipoDocumento),
        folio: pick(data.folio, result.folio),
        fechaEmision:
          data.fechaEmision === undefined
            ? result.fechaEmision
            : data.fechaEmision
              ? new Date(`${data.fechaEmision}T00:00:00Z`)
              : null,
        emisorRut: pick(data.emisor?.rut, result.emisorRut),
        emisorRazonSocial: pick(
          data.emisor?.razonSocial,
          result.emisorRazonSocial,
        ),
        receptorRut: pick(data.receptor?.rut, result.receptorRut),
        receptorNombre: pick(data.receptor?.nombre, result.receptorNombre),
        condicionTributaria: pick(
          data.condicionTributaria,
          result.condicionTributaria,
        ),
        neto: pick(data.totales?.neto, decimalString(result.neto)),
        iva: pick(data.totales?.iva, decimalString(result.iva)),
        exento: pick(data.totales?.exento, decimalString(result.exento)),
        total: pick(data.totales?.total, decimalString(result.total)),
        medioPago: pick(data.medioPago, result.medioPago),
        estado: "EDITANDO",
        detalles: {
          create: reviewDetails.map((line, index) => {
            const extracted = extractedDetails[index];
            return {
              idDetalleExtraccion: extracted?.idDetalle,
              numeroLinea: index + 1,
              descripcion: pick(line.descripcion, extracted?.descripcion),
              cantidad: pick(line.cantidad, decimalString(extracted?.cantidad)),
              unidad: pick(line.unidad, extracted?.unidad),
              precioUnitario: pick(
                line.precioUnitario,
                decimalString(extracted?.precioUnitario),
              ),
              descuentoPorcentaje: pick(
                line.descuentoPorcentaje,
                decimalString(extracted?.descuentoPorcentaje),
              ),
              descuentoMonto: pick(
                line.descuentoMonto,
                decimalString(extracted?.descuentoMonto),
              ),
              recargoPorcentaje: pick(
                line.recargoPorcentaje,
                decimalString(extracted?.recargoPorcentaje),
              ),
              recargoMonto: pick(
                line.recargoMonto,
                decimalString(extracted?.recargoMonto),
              ),
              totalLinea: pick(
                line.totalLinea,
                decimalString(extracted?.totalLinea),
              ),
            };
          }),
        },
        ajustesGlobales: reviewAdjustments.length
          ? {
              create: reviewAdjustments.map((adjustment, index) => ({
                numeroAjuste: index + 1,
                tipo: adjustment.tipo,
                modalidad: adjustment.modalidad,
                valor: adjustment.valor,
                descripcion: adjustment.descripcion,
              })),
            }
          : undefined,
      },
    });
  }

  async confirm(identity: Module1Identity, idDocumento: string) {
    const document = await findOwnedDocument(
      this.prisma,
      identity,
      idDocumento,
    );
    const review = await this.prisma.revisionDocumento.findFirst({
      where: {
        idDocumento: document.idDocumento,
        revisadoPorId: identity.idUsuario,
        estado: "EDITANDO",
      },
      orderBy: { createdAt: "desc" },
    });
    if (document.estado === "CONFIRMADO" && !review) return document;
    if (!review) {
      throw new AppError(
        409,
        "REVIEW_NOT_FOUND",
        "Debe guardar una revisión antes de confirmar",
      );
    }
    const confirmedAt = this.now();
    return this.prisma.$transaction(async (tx) => {
      await tx.revisionDocumento.updateMany({
        where: {
          idDocumento,
          estado: "CONFIRMADA",
          NOT: { idRevision: review.idRevision },
        },
        data: { estado: "PENDIENTE", confirmedAt: null },
      });
      await tx.revisionDocumento.update({
        where: { idRevision: review.idRevision },
        data: { estado: "CONFIRMADA", confirmedAt },
      });
      const empresa = await tx.empresa.findUniqueOrThrow({
        where: { idEmpresa: identity.idEmpresa },
        select: { rutEmpresa: true },
      });
      const direccion =
        review.emisorRut &&
        normalizeRut(review.emisorRut) === normalizeRut(empresa.rutEmpresa)
          ? "VENTA"
          : "COMPRA";
      return tx.documento.update({
        where: { idDocumento },
        data: { estado: "CONFIRMADO", confirmadoAt: confirmedAt, direccion },
      });
    });
  }

  async reopen(identity: Module1Identity, idDocumento: string) {
    const document = await findOwnedDocument(
      this.prisma,
      identity,
      idDocumento,
    );
    if (document.estado !== "CONFIRMADO") return document;
    return this.prisma.documento.update({
      where: { idDocumento },
      data: { estado: "PENDIENTE_REVISION", confirmadoAt: null },
    });
  }
}
