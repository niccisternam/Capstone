import { Router } from "express";
import type { JwtService } from "../auth/jwt.service.js";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { requireModule1Auth, module1Identity } from "../module1/module1-auth.js";
import type { ChatService } from "./chat.service.js";

export function createChatRouter(service: ChatService, jwt: JwtService, prisma: PrismaClient) {
  const router = Router();
  router.use(requireModule1Auth(jwt, (id) => prisma.usuario.findUnique({ where: { idUsuario: id }, select: { idUsuario: true, idEmpresa: true, estado: true } })));

  router.get("/notebooks/:idNotebook/chat", async (req, res, next) => { try { res.json({ mensajes: await service.historial(module1Identity(req), req.params.idNotebook) }); } catch (e) { next(e); } });
  router.post("/notebooks/:idNotebook/chat", async (req, res, next) => { try { res.status(201).json({ mensajes: await service.enviar(module1Identity(req), req.params.idNotebook, req.body) }); } catch (e) { next(e); } });
  router.delete("/notebooks/:idNotebook/chat", async (req, res, next) => { try { res.json(await service.reiniciar(module1Identity(req), req.params.idNotebook)); } catch (e) { next(e); } });
  return router;
}
