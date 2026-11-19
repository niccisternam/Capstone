import {
  Router,
  type CookieOptions,
  type Request,
  type Response,
} from "express";
import { readBearerToken } from "../../shared/auth/bearer.js";
import { handle } from "../../shared/http/handler.js";
import { createRateLimiter } from "../../shared/http/rate-limit.js";
import {
  changeTemporaryPasswordSchema,
  loginSchema,
  requestPasswordRecoverySchema,
  resendLoginCodeSchema,
  resetPasswordSchema,
  verifyLoginCodeSchema,
} from "./auth.schemas.js";
import type { AuthService } from "./auth.service.js";

const REFRESH_COOKIE = "capstone_refresh_token";

type SessionResult = {
  estado: string;
  tokenType: string;
  accessToken: string;
  expiresInSeconds: number;
  refreshToken: string;
  sessionId: string;
  rememberSession: boolean;
  refreshTokenExpiresAt: Date;
};

function readRefreshCookie(req: Request): string | undefined {
  const cookies = req.headers.cookie?.split(";") ?? [];
  for (const cookie of cookies) {
    const separator = cookie.indexOf("=");
    if (separator < 0) continue;
    const name = cookie.slice(0, separator).trim();
    if (name !== REFRESH_COOKIE) continue;
    try {
      return decodeURIComponent(cookie.slice(separator + 1));
    } catch {
      return undefined;
    }
  }
  return undefined;
}

const FIFTEEN_MINUTES = 15 * 60 * 1000;

export function createAuthRouter(
  service: AuthService,
  options: { rateLimit?: boolean } = {},
) {
  const router = Router();
  const disabled = !(options.rateLimit ?? process.env.NODE_ENV !== "test");
  const limit = (name: string, max: number) =>
    createRateLimiter({ name, max, windowMs: FIFTEEN_MINUTES, disabled });
  const loginLimit = limit("login", 20);
  const codeLimit = limit("verify-code", 20);
  const sendLimit = limit("send-email", 5);
  const passwordLimit = limit("password", 20);
  const cookieBase: CookieOptions = {
    httpOnly: true,
    // También seguro si el frontend se sirve por HTTPS aunque NODE_ENV no sea "production".
    secure:
      process.env.NODE_ENV === "production" ||
      (process.env.APP_ORIGIN ?? "").startsWith("https://"),
    sameSite: "lax",
    path: "/api/v1/auth",
  };

  function setRefreshCookie(
    res: Response,
    token: string,
    rememberSession: boolean,
    expiresAt: Date,
  ) {
    res.cookie(REFRESH_COOKIE, token, {
      ...cookieBase,
      ...(rememberSession ? { expires: expiresAt } : {}),
    });
  }

  function sendSession(res: Response, result: SessionResult) {
    const { refreshToken, ...response } = result;
    setRefreshCookie(
      res,
      refreshToken,
      result.rememberSession,
      result.refreshTokenExpiresAt,
    );
    res.status(200).json(response);
  }

  router.post(
    "/login",
    loginLimit,
    handle(async (req, res) => {
      res.status(200).json(await service.login(loginSchema.parse(req.body)));
    }),
  );

  router.post(
    "/change-temporary-password",
    passwordLimit,
    handle(async (req, res) => {
      const input = changeTemporaryPasswordSchema.parse(req.body);
      res.status(200).json(
        await service.changeTemporaryPassword(
          readBearerToken(req.headers.authorization),
          input.nuevaPassword,
        ),
      );
    }),
  );

  router.post(
    "/verify-code",
    codeLimit,
    handle(async (req, res) => {
      const input = verifyLoginCodeSchema.parse(req.body);
      sendSession(
        res,
        await service.verifyLoginCode(
          input.challengeId,
          input.codigo,
          input.recordarSesion,
        ),
      );
    }),
  );

  router.post(
    "/refresh",
    handle(async (req, res) => {
      sendSession(
        res,
        await service.refreshSession(readRefreshCookie(req) ?? ""),
      );
    }),
  );

  router.post(
    "/logout",
    handle(async (req, res) => {
      await service.logout(readRefreshCookie(req));
      res.clearCookie(REFRESH_COOKIE, cookieBase);
      res.status(204).send();
    }),
  );

  router.post(
    "/login-code/resend",
    sendLimit,
    handle(async (req, res) => {
      const input = resendLoginCodeSchema.parse(req.body);
      res.status(200).json(await service.resendLoginCode(input.challengeId));
    }),
  );

  router.post(
    "/forgot-password",
    sendLimit,
    handle(async (req, res) => {
      const input = requestPasswordRecoverySchema.parse(req.body);
      res.status(202).json(await service.requestPasswordRecovery(input.correo));
    }),
  );

  router.post("/verify-recovery-code", (_req, res) => {
    res.status(410).json({
      error: {
        code: "ENDPOINT_DEPRECATED",
        message:
          "La verificación mediante código de seis dígitos ha sido retirada. Utiliza el enlace enviado a tu correo.",
      },
    });
  });

  router.get(
    "/reset-password/validate",
    passwordLimit,
    handle(async (req, res) => {
      res.status(200).json(
        await service.validatePasswordRecoveryToken(
          readBearerToken(req.headers.authorization),
        ),
      );
    }),
  );

  router.post(
    "/reset-password",
    passwordLimit,
    handle(async (req, res) => {
      const input = resetPasswordSchema.parse(req.body);
      const result = await service.resetPassword(
        readBearerToken(req.headers.authorization),
        input.nuevaPassword,
      );
      res.clearCookie(REFRESH_COOKIE, cookieBase);
      res.status(200).json(result);
    }),
  );

  return router;
}
