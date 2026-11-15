import { Router } from "express";
import type { JwtService } from "../auth/jwt.service.js";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { requireModule1Auth, module1Identity } from "../module1/module1-auth.js";
import type { DashboardService } from "./dashboard.service.js";

export function createDashboardRouter(service: DashboardService, jwt: JwtService, prisma: PrismaClient) {
  const router = Router();
  router.use(requireModule1Auth(jwt, (id) => prisma.usuario.findUnique({ where: { idUsuario: id }, select: { idUsuario: true, idEmpresa: true, estado: true } })));

  router.get("/notebooks/:idNotebook/widgets", async (req, res, next) => { try { res.json({ widgets: await service.list(module1Identity(req), req.params.idNotebook) }); } catch (e) { next(e); } });
  router.post("/notebooks/:idNotebook/widgets", async (req, res, next) => { try { res.status(201).json({ widget: await service.create(module1Identity(req), req.params.idNotebook, req.body) }); } catch (e) { next(e); } });
  router.patch("/widgets/:idWidget", async (req, res, next) => { try { res.json({ widget: await service.update(module1Identity(req), req.params.idWidget, req.body) }); } catch (e) { next(e); } });
  router.delete("/widgets/:idWidget", async (req, res, next) => { try { res.json(await service.remove(module1Identity(req), req.params.idWidget)); } catch (e) { next(e); } });
  router.post("/notebooks/:idNotebook/query", async (req, res, next) => { try { res.json(await service.consultar(module1Identity(req), req.params.idNotebook, req.body)); } catch (e) { next(e); } });
  router.post("/notebooks/:idNotebook/suggest", async (req, res, next) => { try { res.json(await service.sugerir(module1Identity(req), req.params.idNotebook, req.body)); } catch (e) { next(e); } });
  return router;
}
