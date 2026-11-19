import type { PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../shared/errors/app-error.js";
import type { Module1Identity } from "./module1.types.js";

export async function findOwnedDocument(
  prisma: PrismaClient,
  identity: Module1Identity,
  idDocumento: string,
) {
  const document = await prisma.documento.findFirst({
    where: { idDocumento, idEmpresa: identity.idEmpresa },
    include: { archivo: true },
  });
  if (!document) {
    throw new AppError(404, "DOCUMENT_NOT_FOUND", "Documento no encontrado");
  }
  if (!document.archivo) {
    throw new AppError(
      500,
      "PDF_NOT_FOUND",
      "El PDF asociado no está disponible",
    );
  }
  return document;
}
