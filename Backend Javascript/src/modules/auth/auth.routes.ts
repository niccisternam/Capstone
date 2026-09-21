import {
  Router,
  type CookieOptions,
  type Request,
  type Response,
} from "express";
import { AppError } from "../../shared/errors/app-error.js";
import {
  changeTemporaryPasswordSchema,
  loginSchema,
  requestPasswordRecoverySchema,
  resendLoginCodeSchema,
  resetPasswordSchema,
  verifyLoginCodeSchema,
} from "./auth.schemas.js";
import type { AuthService } from "./auth.service.js";

function bearerToken(authorization: string | undefined): string {
  const match = /^Bearer\s+(.+)$/i.exec(authorization ?? "");
  if (!match?.[1]) {
    throw new AppError(
      401,
      "AUTHENTICATION_REQUIRED",
      "Se requiere un token de autenticación",
    );
  }
  return match[1];
}

export function createAuthRouter(service: AuthService) {
  const router = Router();
  const refreshCookieName = "capstone_refresh_token";
  const cookieBase: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/v1/auth",
  };

  function readRefreshCookie(req: Request): string | undefined {
    const cookies = req.headers.cookie?.split(";") ?? [];
    for (const cookie of cookies) {
      const separator = cookie.indexOf("=");
      if (separator < 0) continue;
      const name = cookie.slice(0, separator).trim();
      if (name !== refreshCookieName) continue;
      try {
        return decodeURIComponent(cookie.slice(separator + 1));
      } catch {
        return undefined;
      }
    }
    return undefined;
  }

  function setRefreshCookie(
    res: Response,
    token: string,
    rememberSession: boolean,
    expiresAt: Date,
  ) {
    res.cookie(refreshCookieName, token, {
      ...cookieBase,
      ...(rememberSession ? { expires: expiresAt } : {}),
    });
  }

  router.post("/login", async (req, res, next) => {
    try {
      res.status(200).json(await service.login(loginSchema.parse(req.body)));
    } catch (error) {
      next(error);
    }
  });

  router.post("/change-temporary-password", async (req, res, next) => {
    try {
      const input = changeTemporaryPasswordSchema.parse(req.body);
      const result = await service.changeTemporaryPassword(
        bearerToken(req.headers.authorization),
        input.nuevaPassword,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  router.post("/verify-code", async (req, res, next) => {
    try {
      const input = verifyLoginCodeSchema.parse(req.body);
      const result = await service.verifyLoginCode(
        input.challengeId,
        input.codigo,
        input.recordarSesion,
      );
      setRefreshCookie(
        res,
        result.refreshToken,
        result.rememberSession,
        result.refreshTokenExpiresAt,
      );
      const { refreshToken: _refreshToken, ...response } = result;
      void _refreshToken;
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  router.post("/refresh", async (req, res, next) => {
    try {
      const result = await service.refreshSession(readRefreshCookie(req) ?? "");
      setRefreshCookie(
        res,
        result.refreshToken,
        result.rememberSession,
        result.refreshTokenExpiresAt,
      );
      const { refreshToken: _refreshToken, ...response } = result;
      void _refreshToken;
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  router.post("/logout", async (req, res, next) => {
    try {
      await service.logout(readRefreshCookie(req));
      res.clearCookie(refreshCookieName, cookieBase);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  router.post("/login-code/resend", async (req, res, next) => {
    try {
      const input = resendLoginCodeSchema.parse(req.body);
      res.status(200).json(await service.resendLoginCode(input.challengeId));
    } catch (error) {
      next(error);
    }
  });

  router.post("/forgot-password", async (req, res, next) => {
    try {
      const input = requestPasswordRecoverySchema.parse(req.body);
      res.status(202).json(await service.requestPasswordRecovery(input.correo));
    } catch (error) {
      next(error);
    }
  });

  router.post("/verify-recovery-code", (_req, res) => {
    res.status(410).json({
      error: {
        code: "ENDPOINT_DEPRECATED",
        message:
          "La verificación mediante código de seis dígitos ha sido retirada. Utiliza el enlace enviado a tu correo.",
      },
    });
  });

  router.post("/reset-password", async (req, res, next) => {
    try {
      const input = resetPasswordSchema.parse(req.body);
      const result = await service.resetPassword(
        bearerToken(req.headers.authorization),
        input.nuevaPassword,
      );
      res.clearCookie(refreshCookieName, cookieBase);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
