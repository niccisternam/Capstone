import type { Express } from "express";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { DocumentProcessor } from "./document-processor.service.js";
import { DocumentReviewService } from "./document-review.service.js";
import type { Module1Identity, DocumentExtractor } from "./module1.types.js";
import { NotebookService } from "./notebook.service.js";
import { DocumentService } from "./document.service.js";

export { validatePdfAndExtract } from "./document-processor.service.js";

export class Module1Service {
  private readonly notebooks: NotebookService;
  private readonly documents: DocumentService;
  private readonly reviews: DocumentReviewService;

  constructor(
    prisma: PrismaClient,
    extractor: DocumentExtractor,
    storagePath: string,
    now: () => Date = () => new Date(),
  ) {
    const processor = new DocumentProcessor(
      prisma,
      extractor,
      storagePath,
      now,
    );
    this.notebooks = new NotebookService(prisma, storagePath);
    this.documents = new DocumentService(
      prisma,
      processor,
      storagePath,
      now,
    );
    this.reviews = new DocumentReviewService(prisma, now);
  }

  createNotebook(identity: Module1Identity, input: unknown) {
    return this.notebooks.create(identity, input);
  }

  updateNotebook(identity: Module1Identity, idNotebook: string, input: unknown) {
    return this.notebooks.update(identity, idNotebook, input);
  }

  deleteNotebook(identity: Module1Identity, idNotebook: string) {
    return this.notebooks.delete(identity, idNotebook);
  }

  listNotebooks(identity: Module1Identity) {
    return this.notebooks.list(identity);
  }

  getNotebook(identity: Module1Identity, idNotebook: string, query?: unknown) {
    return this.notebooks.get(identity, idNotebook, query);
  }

  uploadDocuments(
    identity: Module1Identity,
    idNotebook: string,
    files: Express.Multer.File[],
  ) {
    return this.documents.upload(identity, idNotebook, files);
  }

  processBatch(identity: Module1Identity, idLote: string) {
    return this.documents.processBatch(identity, idLote);
  }

  getBatch(identity: Module1Identity, idLote: string) {
    return this.documents.getBatch(identity, idLote);
  }

  retryDocument(identity: Module1Identity, idDocumento: string) {
    return this.documents.retry(identity, idDocumento);
  }

  getDocument(identity: Module1Identity, idDocumento: string) {
    return this.documents.get(identity, idDocumento);
  }

  getPdf(identity: Module1Identity, idDocumento: string) {
    return this.documents.getPdf(identity, idDocumento);
  }

  saveReview(identity: Module1Identity, idDocumento: string, input: unknown) {
    return this.reviews.save(identity, idDocumento, input);
  }

  confirmDocument(identity: Module1Identity, idDocumento: string) {
    return this.reviews.confirm(identity, idDocumento);
  }

  reopenDocument(identity: Module1Identity, idDocumento: string) {
    return this.reviews.reopen(identity, idDocumento);
  }

  deleteDocument(identity: Module1Identity, idDocumento: string) {
    return this.documents.delete(identity, idDocumento);
  }
}
