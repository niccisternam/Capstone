import { randomUUID } from "node:crypto";
import { checkDatabaseConnection, prisma } from "./database.js";
import { env } from "./env.js";
import { AccountRequestService } from "../modules/account-requests/account-request.service.js";
import { UnavailableAccountEmailSender } from "../modules/account-requests/account-email.sender.js";
import { NodemailerAccountEmailSender } from "../modules/account-requests/nodemailer-account-email.sender.js";
import { PrismaAccountRequestRepository } from "../modules/account-requests/prisma-account-request.repository.js";
import { AuthService } from "../modules/auth/auth.service.js";
import { JwtService } from "../modules/auth/jwt.service.js";
import { PrismaAuthRepository } from "../modules/auth/prisma-auth.repository.js";
import { ChatService } from "../modules/module4/chat.service.js";
import { GeminiChatAssistant, UnavailableChatAssistant } from "../modules/module4/gemini.chat.js";
import { DashboardService } from "../modules/dashboard/dashboard.service.js";
import { GeminiWidgetPlanner, UnavailableWidgetPlanner } from "../modules/dashboard/dashboard.ai.js";
import { GeminiExtractor, UnavailableExtractor } from "../modules/module1/gemini.extractor.js";
import { Module1Service } from "../modules/module1/module1.service.js";
import type { AdminResolver } from "../shared/auth/admin-resolver.js";
import { createJwtAdminResolver } from "../shared/auth/jwt-admin-resolver.js";
import { NodemailerVerificationEmailSender } from "../shared/email/nodemailer-verification-email.sender.js";
import { UnavailableVerificationEmailSender } from "../shared/email/verification-email.sender.js";

export interface AppDependencies {
  accountRequestService?: AccountRequestService;
  authService?: AuthService;
  adminResolver?: AdminResolver;
  databaseProbe?: () => Promise<void>;
  module1Service?: Module1Service;
  chatService?: ChatService;
  dashboardService?: DashboardService;
}

export interface AppServices {
  authService: AuthService;
  accountRequestService: AccountRequestService;
  module1Service: Module1Service;
  chatService: ChatService;
  dashboardService: DashboardService;
  adminResolver: AdminResolver;
  databaseProbe: () => Promise<void>;
  jwtService: JwtService;
}

/**
 * Composition root: crea los repositorios y servicios del backend a partir de
 * las variables de entorno. Las pruebas pueden inyectar implementaciones.
 */
export function createServices(
  dependencies: AppDependencies = {},
): AppServices {
  const authRepository = new PrismaAuthRepository(prisma);
  const jwtService = new JwtService(env.JWT_SECRET, env.JWT_ACCESS_TTL);
  const hasSmtp = Boolean(env.SMTP_USER && env.SMTP_PASS && env.MAIL_FROM);
  const smtp = hasSmtp
    ? {
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_SECURE,
        user: env.SMTP_USER!,
        password: env.SMTP_PASS!,
        from: env.MAIL_FROM!,
      }
    : null;

  const authService =
    dependencies.authService ??
    new AuthService(
      authRepository,
      jwtService,
      smtp
        ? new NodemailerVerificationEmailSender(smtp)
        : new UnavailableVerificationEmailSender(),
      {
        createId: randomUUID,
        codeSecret: env.JWT_SECRET,
        regularSessionDays: env.SESSION_DEFAULT_DAYS,
        rememberedSessionDays: env.SESSION_REMEMBER_DAYS,
        idleTimeoutMinutes: env.SESSION_IDLE_TIMEOUT_MINUTES,
        appOrigin: env.APP_ORIGIN,
      },
    );

  const accountRequestService =
    dependencies.accountRequestService ??
    new AccountRequestService(
      new PrismaAccountRequestRepository(prisma),
      smtp
        ? new NodemailerAccountEmailSender(smtp)
        : new UnavailableAccountEmailSender(),
      { createId: randomUUID },
    );

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
        ? new GeminiChatAssistant(
            env.GEMINI_API_KEY,
            env.GEMINI_MODEL,
            env.GEMINI_TIMEOUT_MS,
          )
        : new UnavailableChatAssistant(),
    );

  const dashboardService =
    dependencies.dashboardService ??
    new DashboardService(
      prisma,
      env.GEMINI_API_KEY
        ? new GeminiWidgetPlanner(env.GEMINI_API_KEY, env.GEMINI_MODEL)
        : new UnavailableWidgetPlanner(),
    );

  return {
    authService,
    accountRequestService,
    module1Service,
    chatService,
    dashboardService,
    adminResolver:
      dependencies.adminResolver ??
      createJwtAdminResolver(jwtService, authRepository),
    databaseProbe: dependencies.databaseProbe ?? checkDatabaseConnection,
    jwtService,
  };
}
