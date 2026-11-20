import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Express } from "express";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../shared/errors/app-error.js";
import { findOwnedDocument } from "./document.lookup.js";
import { deleteFilesWithRecords } from "./file-deletion.js";
import type { DocumentProcessor } from "./document-processor.service.js";
import type { Module1Identity } from "./module1.types.js";

type UploadedFile = Express.Multer.File;

const BATCH_INCLUDE = {
  documentos: {
    orderBy: { posicionLote: "asc" as const },
    include: {
      archivo: true,
      intentos: { orderBy: { numeroIntento: "desc" as const }, take: 1 },
    },
  },
};

function presentBatch<
  T extends {
    documentos: Array<{
      archivo: { nombreOriginal: string } | null;
      estado: string;
      intentos: Array<{ errorCodigo: string | null; errorMensaje: string | null }>;
    }>;
  },
>(batch: T) {
  return {
    ...batch,
    documentos: batch.documentos.map(({ archivo, intentos, ...documento }) => ({
      ...documento,
      nombreArchivo: archivo?.nombreOriginal ?? null,
      ...(documento.estado === "ERROR" && intentos[0]?.errorCodigo
        ? {
            error: {
              code: intentos[0].errorCodigo,
              message:
                intentos[0].errorMensaje ??
                "No fue posible procesar el documento",
            },
          }
        : {}),
    })),
  };
}

export class DocumentService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly processor: DocumentProcessor,
    private readonly storagePath: string,
    private readonly now: () => Date,
  ) {}

  async upload(
    identity: Module1Identity,
    idNotebook: string,
    files: UploadedFile[],
  ) {
    if (files.length < 1 || files.length > 10) {
      throw new AppError(
        400,
        "INVALID_BATCH_SIZE",
        "El lote debe contener entre 1 y 10 documentos",
      );
    }
    const notebook = await this.prisma.notebook.findFirst({
      where: { idNotebook, idEmpresa: identity.idEmpresa },
    });
    if (!notebook) {
      throw new AppError(404, "NOTEBOOK_NOT_FOUND", "Notebook no encontrado");
    }
    for (const file of files) this.validateFile(file);
    await mkdir(path.resolve(this.storagePath), { recursive: true });

    const lote = await this.prisma.$transaction(async (tx) => {
      const created = await tx.loteProcesamiento.create({
        data: {
          idEmpresa: identity.idEmpresa,
          idNotebook,
          creadoPorId: identity.idUsuario,
          cantidadDocumentos: files.length,
        },
      });
      for (const [index, file] of files.entries()) {
        const idDocumento = randomUUID();
        const storageKey = `${identity.idEmpresa}/${idDocumento}.pdf`;
        const destination = path.resolve(this.storagePath, storageKey);
        await mkdir(path.dirname(destination), { recursive: true });
        await writeFile(destination, file.buffer);
        const documento = await tx.documento.create({
          data: {
            idDocumento,
            idEmpresa: identity.idEmpresa,
            idNotebook,
            idLote: created.idLote,
            cargadoPorId: identity.idUsuario,
            posicionLote: index + 1,
          },
        });
        await tx.archivoPDF.create({
          data: {
            idDocumento: documento.idDocumento,
            nombreOriginal: file.originalname,
            tipoMime: "application/pdf",
            tamanoBytes: file.size,
            hashArchivo: createHash("sha256").update(file.buffer).digest("hex"),
            storageKey,
          },
        });
      }
      return created;
    });

    const response = await this.prisma.loteProcesamiento.findUnique({
      where: { idLote: lote.idLote },
      include: { documentos: { include: { archivo: true } } },
    });
    return response
      ? {
          ...response,
          documentos: response.documentos.map(({ archivo, ...documento }) => ({
            ...documento,
            nombreArchivo: archivo?.nombreOriginal ?? null,
          })),
        }
      : response;
  }

  async processBatch(identity: Module1Identity, idLote: string) {
    const lote = await this.prisma.loteProcesamiento.findFirst({
      where: { idLote, idEmpresa: identity.idEmpresa },
      include: BATCH_INCLUDE,
    });
    if (!lote) {
      throw new AppError(404, "BATCH_NOT_FOUND", "Lote no encontrado");
    }
    await this.prisma.loteProcesamiento.update({
      where: { idLote },
      data: { procesamientoInicio: this.now() },
    });
    for (const documento of lote.documentos.filter(
      (item) => item.estado === "PENDIENTE",
    )) {
      await this.processor.process(identity, documento.idDocumento);
    }

    const result = await this.prisma.loteProcesamiento.update({
      where: { idLote },
      data: { procesamientoFin: this.now() },
      include: { documentos: { orderBy: { posicionLote: "asc" } } },
    });
    const processed = result.documentos.filter(
      (d) => d.estado === "PENDIENTE_REVISION" || d.estado === "CONFIRMADO",
    ).length;
    const errors = result.documentos.filter((d) => d.estado === "ERROR").length;
    const updated = await this.prisma.loteProcesamiento.update({
      where: { idLote },
      data: { cantidadProcesados: processed, cantidadErrores: errors },
      include: BATCH_INCLUDE,
    });
    return presentBatch(updated);
  }

  async getBatch(identity: Module1Identity, idLote: string) {
    const lote = await this.prisma.loteProcesamiento.findFirst({
      where: { idLote, idEmpresa: identity.idEmpresa },
      include: BATCH_INCLUDE,
    });
    if (!lote) {
      throw new AppError(404, "BATCH_NOT_FOUND", "Lote no encontrado");
    }
    return presentBatch(lote);
  }

  async retry(identity: Module1Identity, idDocumento: string) {
    const document = await findOwnedDocument(
      this.prisma,
      identity,
      idDocumento,
    );
    if (document.estado !== "ERROR") {
      throw new AppError(
        409,
        "DOCUMENT_NOT_RETRYABLE",
        "Solo se pueden reintentar documentos con error",
      );
    }
    const result = await this.processor.process(identity, idDocumento);
    if (result.estado === "ERROR" && "error" in result) {
      throw new AppError(422, result.error.code, result.error.message);
    }
    return result;
  }

  async get(identity: Module1Identity, idDocumento: string) {
    const document = await findOwnedDocument(
      this.prisma,
      identity,
      idDocumento,
    );
    const result = await this.prisma.documento.findUnique({
      where: { idDocumento: document.idDocumento },
      include: {
        archivo: true,
        resultados: {
          include: { detalles: true, ajustesGlobales: true },
          orderBy: { idResultado: "desc" },
        },
        revisiones: {
          include: { detalles: true, ajustesGlobales: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!result) {
      throw new AppError(404, "DOCUMENT_NOT_FOUND", "Documento no encontrado");
    }
    return {
      ...result,
      archivo: result.archivo
        ? {
            ...result.archivo,
            tamanoBytes: result.archivo.tamanoBytes.toString(),
          }
        : null,
    };
  }

  async getPdf(identity: Module1Identity, idDocumento: string) {
    const document = await findOwnedDocument(
      this.prisma,
      identity,
      idDocumento,
    );
    return {
      file: await readFile(
        path.resolve(this.storagePath, document.archivo!.storageKey),
      ),
      name: document.archivo!.nombreOriginal,
    };
  }

  async delete(identity: Module1Identity, idDocumento: string) {
    const document = await findOwnedDocument(
      this.prisma,
      identity,
      idDocumento,
    );
    if (
      !["PENDIENTE", "ERROR", "PENDIENTE_REVISION", "CONFIRMADO"].includes(
        document.estado,
      )
    ) {
      throw new AppError(
        409,
        "DOCUMENT_NOT_DELETABLE",
        "El documento se está procesando y no puede eliminarse",
      );
    }
    const filePaths = document.archivo?.storageKey
      ? [path.resolve(this.storagePath, document.archivo.storageKey)]
      : [];
    await deleteFilesWithRecords(filePaths, () =>
      this.prisma.documento.delete({ where: { idDocumento } }),
    );
    return { idDocumento, eliminado: true };
  }

  private validateFile(file: UploadedFile) {
    if (
      file.mimetype !== "application/pdf" ||
      file.size < 1 ||
      file.size > 15 * 1024 * 1024
    ) {
      throw new AppError(
        400,
        "INVALID_PDF_FILE",
        "Solo se aceptan PDF de hasta 15 MB",
      );
    }
    if (file.buffer.subarray(0, 4).toString("ascii") !== "%PDF") {
      throw new AppError(
        400,
        "INVALID_PDF_FILE",
        "El archivo no es un PDF válido",
      );
    }
  }
}
