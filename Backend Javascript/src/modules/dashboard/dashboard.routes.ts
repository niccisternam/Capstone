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

  return router;
}
