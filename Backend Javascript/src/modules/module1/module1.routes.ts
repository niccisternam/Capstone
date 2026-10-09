import { Router } from "express";
import multer from "multer";
import type { JwtService } from "../auth/jwt.service.js";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { requireModule1Auth, module1Identity } from "./module1-auth.js";
import type { Module1Service } from "./module1.service.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { files: 10, fileSize: 15 * 1024 * 1024 } });

export function createModule1Router(service: Module1Service, jwt: JwtService, prisma: PrismaClient) {
  const router = Router();
  const auth = requireModule1Auth(jwt, (id) => prisma.usuario.findUnique({ where: { idUsuario: id }, select: { idUsuario: true, idEmpresa: true, estado: true } }));
  router.use(auth);

  router.post("/notebooks", async (req, res, next) => { try { res.status(201).json({ notebook: await service.createNotebook(module1Identity(req), req.body) }); } catch (e) { next(e); } });
  router.patch("/notebooks/:idNotebook", async (req, res, next) => { try { res.json({ notebook: await service.updateNotebook(module1Identity(req), req.params.idNotebook, req.body) }); } catch (e) { next(e); } });
  router.delete("/notebooks/:idNotebook", async (req, res, next) => { try { res.json(await service.deleteNotebook(module1Identity(req), req.params.idNotebook)); } catch (e) { next(e); } });
  router.get("/notebooks", async (req, res, next) => { try { res.json({ notebooks: await service.listNotebooks(module1Identity(req)) }); } catch (e) { next(e); } });
  router.get("/notebooks/:idNotebook", async (req, res, next) => { try { res.json({ notebook: await service.getNotebook(module1Identity(req), req.params.idNotebook) }); } catch (e) { next(e); } });
  router.post("/notebooks/:idNotebook/documents", upload.array("documents", 10), async (req, res, next) => { try { res.status(201).json({ lote: await service.uploadDocuments(module1Identity(req), String(req.params.idNotebook), (req.files as Express.Multer.File[] | undefined) ?? []) }); } catch (e) { next(e); } });
  router.post("/batches/:idLote/process", async (req, res, next) => { try { res.json({ lote: await service.processBatch(module1Identity(req), req.params.idLote) }); } catch (e) { next(e); } });
  router.get("/batches/:idLote", async (req, res, next) => { try { res.json({ lote: await service.getBatch(module1Identity(req), req.params.idLote) }); } catch (e) { next(e); } });
  router.post("/documents/:idDocumento/retry", async (req, res, next) => { try { res.json({ documento: await service.retryDocument(module1Identity(req), req.params.idDocumento) }); } catch (e) { next(e); } });
  router.get("/documents/:idDocumento", async (req, res, next) => { try { res.json({ documento: await service.getDocument(module1Identity(req), req.params.idDocumento) }); } catch (e) { next(e); } });
  router.get("/documents/:idDocumento/pdf", async (req, res, next) => { try { const pdf = await service.getPdf(module1Identity(req), req.params.idDocumento); res.type("application/pdf").setHeader("Content-Disposition", `inline; filename="${pdf.name.replace(/[^a-zA-Z0-9._-]/g, "_")}"`).send(pdf.file); } catch (e) { next(e); } });
  router.patch("/documents/:idDocumento/review", async (req, res, next) => { try { res.json({ revision: await service.saveReview(module1Identity(req), req.params.idDocumento, req.body) }); } catch (e) { next(e); } });
  router.post("/documents/:idDocumento/confirm", async (req, res, next) => { try { res.json({ documento: await service.confirmDocument(module1Identity(req), req.params.idDocumento) }); } catch (e) { next(e); } });
  router.post("/documents/:idDocumento/reopen", async (req, res, next) => { try { res.json({ documento: await service.reopenDocument(module1Identity(req), req.params.idDocumento) }); } catch (e) { next(e); } });
  router.delete("/documents/:idDocumento", async (req, res, next) => { try { res.json(await service.deleteDocument(module1Identity(req), req.params.idDocumento)); } catch (e) { next(e); } });
  return router;
}
