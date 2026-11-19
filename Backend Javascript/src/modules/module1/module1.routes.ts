import { Router } from "express";
import multer from "multer";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { handle } from "../../shared/http/handler.js";
import type { JwtService } from "../auth/jwt.service.js";
import { module1Identity, requireModule1Auth } from "./module1-auth.js";
import type { Module1Service } from "./module1.service.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 10, fileSize: 15 * 1024 * 1024 },
});

export function createModule1Router(
  service: Module1Service,
  jwt: JwtService,
  prisma: PrismaClient,
) {
  const router = Router();
  router.use(
    requireModule1Auth(jwt, (id) =>
      prisma.usuario.findUnique({
        where: { idUsuario: id },
        select: { idUsuario: true, idEmpresa: true, estado: true },
      }),
    ),
  );

  router.post(
    "/notebooks",
    handle(async (req, res) => {
      res.status(201).json({
        notebook: await service.createNotebook(module1Identity(req), req.body),
      });
    }),
  );

  router.patch(
    "/notebooks/:idNotebook",
    handle(async (req, res) => {
      res.json({
        notebook: await service.updateNotebook(
          module1Identity(req),
          req.params.idNotebook!,
          req.body,
        ),
      });
    }),
  );

  router.delete(
    "/notebooks/:idNotebook",
    handle(async (req, res) => {
      res.json(
        await service.deleteNotebook(
          module1Identity(req),
          req.params.idNotebook!,
        ),
      );
    }),
  );

  router.get(
    "/notebooks",
    handle(async (req, res) => {
      res.json({ notebooks: await service.listNotebooks(module1Identity(req)) });
    }),
  );

  router.get(
    "/notebooks/:idNotebook",
    handle(async (req, res) => {
      res.json({
        notebook: await service.getNotebook(
          module1Identity(req),
          req.params.idNotebook!,
          req.query,
        ),
      });
    }),
  );

  router.post(
    "/notebooks/:idNotebook/documents",
    upload.array("documents", 10),
    handle(async (req, res) => {
      res.status(201).json({
        lote: await service.uploadDocuments(
          module1Identity(req),
          req.params.idNotebook!,
          (req.files as Express.Multer.File[] | undefined) ?? [],
        ),
      });
    }),
  );

  router.post(
    "/batches/:idLote/process",
    handle(async (req, res) => {
      res.json({
        lote: await service.processBatch(
          module1Identity(req),
          req.params.idLote!,
        ),
      });
    }),
  );

  router.get(
    "/batches/:idLote",
    handle(async (req, res) => {
      res.json({
        lote: await service.getBatch(module1Identity(req), req.params.idLote!),
      });
    }),
  );

  router.post(
    "/documents/:idDocumento/retry",
    handle(async (req, res) => {
      res.json({
        documento: await service.retryDocument(
          module1Identity(req),
          req.params.idDocumento!,
        ),
      });
    }),
  );

  router.get(
    "/documents/:idDocumento",
    handle(async (req, res) => {
      res.json({
        documento: await service.getDocument(
          module1Identity(req),
          req.params.idDocumento!,
        ),
      });
    }),
  );

  router.get(
    "/documents/:idDocumento/pdf",
    handle(async (req, res) => {
      const pdf = await service.getPdf(
        module1Identity(req),
        req.params.idDocumento!,
      );
      res
        .type("application/pdf")
        .setHeader(
          "Content-Disposition",
          `inline; filename="${pdf.name.replace(/[^a-zA-Z0-9._-]/g, "_")}"`,
        )
        .send(pdf.file);
    }),
  );

  router.patch(
    "/documents/:idDocumento/review",
    handle(async (req, res) => {
      res.json({
        revision: await service.saveReview(
          module1Identity(req),
          req.params.idDocumento!,
          req.body,
        ),
      });
    }),
  );

  router.post(
    "/documents/:idDocumento/confirm",
    handle(async (req, res) => {
      res.json({
        documento: await service.confirmDocument(
          module1Identity(req),
          req.params.idDocumento!,
        ),
      });
    }),
  );

  router.post(
    "/documents/:idDocumento/reopen",
    handle(async (req, res) => {
      res.json({
        documento: await service.reopenDocument(
          module1Identity(req),
          req.params.idDocumento!,
        ),
      });
    }),
  );

  router.delete(
    "/documents/:idDocumento",
    handle(async (req, res) => {
      res.json(
        await service.deleteDocument(
          module1Identity(req),
          req.params.idDocumento!,
        ),
      );
    }),
  );

  return router;
}
