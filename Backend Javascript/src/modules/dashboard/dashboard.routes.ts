import { Router } from "express";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { handle } from "../../shared/http/handler.js";
import type { JwtService } from "../auth/jwt.service.js";
import { module1Identity, requireModule1Auth } from "../module1/module1-auth.js";
import type { DashboardService } from "./dashboard.service.js";

export function createDashboardRouter(
  service: DashboardService,
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

  router.get(
    "/notebooks/:idNotebook/widgets",
    handle(async (req, res) => {
      res.json({
        widgets: await service.list(
          module1Identity(req),
          req.params.idNotebook!,
        ),
      });
    }),
  );

  router.post(
    "/notebooks/:idNotebook/widgets",
    handle(async (req, res) => {
      res.status(201).json({
        widget: await service.create(
          module1Identity(req),
          req.params.idNotebook!,
          req.body,
        ),
      });
    }),
  );

  router.patch(
    "/widgets/:idWidget",
    handle(async (req, res) => {
      res.json({
        widget: await service.update(
          module1Identity(req),
          req.params.idWidget!,
          req.body,
        ),
      });
    }),
  );

  router.delete(
    "/widgets/:idWidget",
    handle(async (req, res) => {
      res.json(
        await service.remove(module1Identity(req), req.params.idWidget!),
      );
    }),
  );

  router.post(
    "/notebooks/:idNotebook/query",
    handle(async (req, res) => {
      res.json(
        await service.consultar(
          module1Identity(req),
          req.params.idNotebook!,
          req.body,
        ),
      );
    }),
  );

  router.post(
    "/notebooks/:idNotebook/suggest",
    handle(async (req, res) => {
      res.json(
        await service.sugerir(
          module1Identity(req),
          req.params.idNotebook!,
          req.body,
        ),
      );
    }),
  );

  return router;
}
