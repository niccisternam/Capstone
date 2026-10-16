import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { randomUUID } from "node:crypto";
import { checkDatabaseConnection, prisma } from "./config/database.js";
import { createAccountRequestRouter } from "./modules/account-requests/account-request.routes.js";
import { AccountRequestService } from "./modules/account-requests/account-request.service.js";
import { PrismaAccountRequestRepository } from "./modules/account-requests/prisma-account-request.repository.js";
import { UnavailableAccountEmailSender } from "./modules/account-requests/account-email.sender.js";
import { NodemailerAccountEmailSender } from "./modules/account-requests/nodemailer-account-email.sender.js";
import { createAuthRouter } from "./modules/auth/auth.routes.js";
import { PrismaAuthRepository } from "./modules/auth/prisma-auth.repository.js";
import { AuthService } from "./modules/auth/auth.service.js";
import { JwtService } from "./modules/auth/jwt.service.js";
import type { AdminResolver } from "./shared/auth/admin-resolver.js";
import { createJwtAdminResolver } from "./shared/auth/jwt-admin-resolver.js";
import { NodemailerVerificationEmailSender } from "./shared/email/nodemailer-verification-email.sender.js";
import { UnavailableVerificationEmailSender } from "./shared/email/verification-email.sender.js";
import { errorHandler } from "./shared/errors/error-handler.js";
import { env } from "./config/env.js";
import { GeminiExtractor, UnavailableExtractor } from "./modules/module1/gemini.extractor.js";
import { createModule1Router } from "./modules/module1/module1.routes.js";
import { Module1Service } from "./modules/module1/module1.service.js";
import { createChatRouter } from "./modules/module4/chat.routes.js";
import { ChatService } from "./modules/module4/chat.service.js";
import { GeminiChatAssistant, UnavailableChatAssistant } from "./modules/module4/gemini.chat.js";

export interface AppDependencies {
  accountRequestService?: AccountRequestService;
  authService?: AuthService;
  adminResolver?: AdminResolver;
  databaseProbe?: () => Promise<void>;
  module1Service?: Module1Service;
  chatService?: ChatService;
}

export function createApp(dependencies: AppDependencies = {}) {
  const app = express();
  const repository = new PrismaAccountRequestRepository(prisma);
  const authRepository = new PrismaAuthRepository(prisma);
  const jwtService = new JwtService(env.JWT_SECRET, env.JWT_ACCESS_TTL);
  const verificationEmailSender =
    env.SMTP_USER && env.SMTP_PASS && env.MAIL_FROM
      ? new NodemailerVerificationEmailSender({
          host: env.SMTP_HOST,
          port: env.SMTP_PORT,
          secure: env.SMTP_SECURE,
          user: env.SMTP_USER,
          password: env.SMTP_PASS,
          from: env.MAIL_FROM,
        })
      : new UnavailableVerificationEmailSender();
  const accountEmailSender =
    env.SMTP_USER && env.SMTP_PASS && env.MAIL_FROM
      ? new NodemailerAccountEmailSender({
          host: env.SMTP_HOST,
          port: env.SMTP_PORT,
          secure: env.SMTP_SECURE,
          user: env.SMTP_USER,
          password: env.SMTP_PASS,
          from: env.MAIL_FROM,
        })
      : new UnavailableAccountEmailSender();
  const authService =
    dependencies.authService ??
    new AuthService(authRepository, jwtService, verificationEmailSender, {
      createId: randomUUID,
      codeSecret: env.JWT_SECRET,
      regularSessionDays: env.SESSION_DEFAULT_DAYS,
      rememberedSessionDays: env.SESSION_REMEMBER_DAYS,
      idleTimeoutMinutes: env.SESSION_IDLE_TIMEOUT_MINUTES,
      appOrigin: env.APP_ORIGIN,
    });
  const accountRequestService =
    dependencies.accountRequestService ??
    new AccountRequestService(repository, accountEmailSender, {
      createId: randomUUID,
    });
  const module1Service =
    dependencies.module1Service ??
    new Module1Service(
      prisma,
      env.GEMINI_API_KEY
        ? new GeminiExtractor(env.GEMINI_API_KEY, env.GEMINI_MODEL)
        : new UnavailableExtractor(),
      env.DOCUMENT_STORAGE_PATH,
    );

  const chatService =
    dependencies.chatService ??
    new ChatService(
      prisma,
      env.GEMINI_API_KEY
        ? new GeminiChatAssistant(env.GEMINI_API_KEY, env.GEMINI_MODEL)
        : new UnavailableChatAssistant(),
    );

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

  app.use("/api/v1/module1", createModule1Router(module1Service, jwtService, prisma));
  app.use("/api/v1/module4", createChatRouter(chatService, jwtService, prisma));

  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", service: "backend-javascript" });
  });

  app.get("/readiness", async (_req, res) => {
    try {
      await (dependencies.databaseProbe ?? checkDatabaseConnection)();
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

  app.use("/api/v1/auth", createAuthRouter(authService));

  app.use(
    "/api/v1/account-requests",
    createAccountRequestRouter(
      accountRequestService,
      dependencies.adminResolver ??
        createJwtAdminResolver(jwtService, authRepository),
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
