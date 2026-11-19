import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { prisma } from "./config/database.js";
import { env } from "./config/env.js";
import {
  createServices,
  type AppDependencies,
} from "./config/services.js";
import { createAccountRequestRouter } from "./modules/account-requests/account-request.routes.js";
import { createAuthRouter } from "./modules/auth/auth.routes.js";
import { createDashboardRouter } from "./modules/dashboard/dashboard.routes.js";
import { createModule1Router } from "./modules/module1/module1.routes.js";
import { createChatRouter } from "./modules/module4/chat.routes.js";
import { errorHandler } from "./shared/errors/error-handler.js";

export type { AppDependencies } from "./config/services.js";

export function createApp(dependencies: AppDependencies = {}) {
  const app = express();
  const services = createServices(dependencies);

  app.use(helmet());
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    res.vary("Origin");
    if (origin === env.APP_ORIGIN) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type,Authorization",
      );
      res.status(204).send();
      return;
    }
    next();
  });
  app.use(express.json({ limit: "2mb" }));
  app.use(
    pinoHttp({
      redact: ["req.headers.authorization"],
    }),
  );

  app.use(
    "/api/v1/module1",
    createModule1Router(services.module1Service, services.jwtService, prisma),
  );
  app.use(
    "/api/v1/module4",
    createChatRouter(services.chatService, services.jwtService, prisma),
  );
  app.use(
    "/api/v1/dashboard",
    createDashboardRouter(services.dashboardService, services.jwtService, prisma),
  );

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", service: "backend-javascript" });
  });

  app.get("/readiness", async (_req, res) => {
    try {
      await services.databaseProbe();
      res.status(200).json({
        status: "ready",
        service: "backend-javascript",
        database: "ok",
      });
    } catch {
      res.status(503).json({
        status: "not_ready",
        service: "backend-javascript",
        database: "error",
      });
    }
  });

  app.use("/api/v1/auth", createAuthRouter(services.authService));

  app.use(
    "/api/v1/account-requests",
    createAccountRequestRouter(
      services.accountRequestService,
      services.adminResolver,
    ),
  );

  app.use((_req, res) => {
    res
      .status(404)
      .json({ error: { code: "NOT_FOUND", message: "Ruta no encontrada" } });
  });

  app.use(errorHandler);

  return app;
}

export const app = createApp();
