import { Router, type RequestHandler } from "express";
import type { JwtService } from "../auth/jwt.service.js";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { requireModule1Auth, module1Identity } from "../module1/module1-auth.js";
import { AppError } from "../../shared/errors/app-error.js";
import type { ChatService } from "./chat.service.js";
import { crearLimitePreguntas } from "./chat.rate-limit.js";

export function createChatRouter(service: ChatService, jwt: JwtService, prisma: PrismaClient) {
  const router = Router();
  const limitarPreguntas = crearLimitePreguntas();
  router.use(requireModule1Auth(jwt, (id) => prisma.usuario.findUnique({ where: { idUsuario: id }, select: { idUsuario: true, idEmpresa: true, estado: true } })));
  const aplicarLimitePreguntas: RequestHandler = (req, res, next) => {
    try {
      const espera = limitarPreguntas(module1Identity(req).idUsuario);
      if (espera) {
        res.setHeader("Retry-After", String(espera));
        throw new AppError(429, "CHAT_RATE_LIMITED", "Alcanzaste el límite de 20 preguntas por minuto. Espera antes de volver a intentarlo.");
      }
      next();
    } catch (error) { next(error); }
  };

  router.get("/notebooks/:idNotebook/conversaciones", async (req, res, next) => { try { res.json(await service.listar(module1Identity(req), req.params.idNotebook, req.query.pagina)); } catch (e) { next(e); } });
  router.post("/notebooks/:idNotebook/conversaciones", async (req, res, next) => { try { res.status(201).json({ conversacion: await service.crear(module1Identity(req), req.params.idNotebook, req.body) }); } catch (e) { next(e); } });
  router.get("/conversaciones/:idConversacion/mensajes", async (req, res, next) => { try { res.json(await service.historial(module1Identity(req), req.params.idConversacion, req.query.cursor)); } catch (e) { next(e); } });
  router.post("/conversaciones/:idConversacion/mensajes", aplicarLimitePreguntas, async (req, res, next) => { try { res.status(201).json(await service.enviar(module1Identity(req), req.params.idConversacion as string, req.body)); } catch (e) { next(e); } });
  router.delete("/conversaciones/:idConversacion", async (req, res, next) => { try { res.json(await service.eliminar(module1Identity(req), req.params.idConversacion)); } catch (e) { next(e); } });
  return router;
}
