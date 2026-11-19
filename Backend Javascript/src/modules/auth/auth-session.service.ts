import { randomBytes } from "node:crypto";
import { AppError } from "../../shared/errors/app-error.js";
import type { AuthConfig } from "./auth.config.js";
import type { AuthCodeService } from "./auth-code.service.js";
import { assertCanLogin } from "./auth.guards.js";
import type { AuthRepository } from "./auth.repository.js";
import { hashToken } from "./auth.tokens.js";
import type { JwtService } from "./jwt.service.js";

export class AuthSessionService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly jwt: JwtService,
    private readonly codes: AuthCodeService,
    private readonly config: AuthConfig,
  ) {}

  async verifyLoginCode(
    challengeId: string,
    code: string,
    rememberSession: boolean,
  ) {
    const challenge = await this.repository.findSecurityCodeById(
      challengeId,
      "CODIGO_INICIO_SESION",
    );
    await this.codes.assertValidCode(challenge, code, "LOGIN");
    assertCanLogin(
      challenge!.usuario.estado,
      challenge!.usuario.bloqueadoHasta,
      this.config.now(),
    );

    const refreshToken = randomBytes(48).toString("base64url");
    const sessionId = this.config.createId();
    const now = this.config.now();
    const sessionDays = rememberSession
      ? this.config.rememberedSessionDays
      : this.config.regularSessionDays;
    const expiresAt = new Date(
      now.getTime() + sessionDays * 24 * 60 * 60 * 1000,
    );
    await this.repository.completeLogin({
      challengeId,
      userId: challenge!.idUsuario,
      sessionId,
      refreshTokenHash: hashToken(refreshToken),
      rememberSession,
      now,
      expiresAt,
    });

    return {
      estado: "AUTENTICADO" as const,
      tokenType: "Bearer",
      accessToken: await this.jwt.createAccessToken({
        idUsuario: challenge!.usuario.idUsuario,
        rol: challenge!.usuario.rol,
        razonSocial: challenge!.usuario.empresa?.razonSocial,
      }),
      expiresInSeconds: 900,
      refreshToken,
      sessionId,
      rememberSession,
      refreshTokenExpiresAt: expiresAt,
    };
  }

  async refreshSession(refreshToken: string) {
    const currentTokenHash = hashToken(refreshToken);
    const session =
      await this.repository.findSessionByTokenHash(currentTokenHash);
    const now = this.config.now();
    if (
      !session ||
      session.revokedAt ||
      session.expiresAt.getTime() <= now.getTime()
    ) {
      this.throwInvalidRefreshToken();
    }

    if (
      !session!.recordarSesion &&
      session!.ultimaActividadAt.getTime() +
        this.config.idleTimeoutMinutes * 60 * 1000 <=
        now.getTime()
    ) {
      await this.repository.revokeSessionByTokenHash(currentTokenHash, now);
      this.throwInvalidRefreshToken();
    }
    assertCanLogin(
      session!.usuario.estado,
      session!.usuario.bloqueadoHasta,
      now,
    );

    const newRefreshToken = randomBytes(48).toString("base64url");
    const rotated = await this.repository.rotateSession({
      sessionId: session!.idSesion,
      currentTokenHash,
      newTokenHash: hashToken(newRefreshToken),
      now,
    });
    if (!rotated) this.throwInvalidRefreshToken();

    return {
      estado: "SESION_RENOVADA" as const,
      tokenType: "Bearer" as const,
      accessToken: await this.jwt.createAccessToken({
        idUsuario: session!.usuario.idUsuario,
        rol: session!.usuario.rol,
        razonSocial: session!.usuario.empresa?.razonSocial,
      }),
      expiresInSeconds: 900,
      refreshToken: newRefreshToken,
      sessionId: session!.idSesion,
      rememberSession: session!.recordarSesion,
      refreshTokenExpiresAt: session!.expiresAt,
    };
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (refreshToken) {
      await this.repository.revokeSessionByTokenHash(
        hashToken(refreshToken),
        this.config.now(),
      );
    }
  }

  private throwInvalidRefreshToken(): never {
    throw new AppError(
      401,
      "INVALID_REFRESH_TOKEN",
      "La sesión no es válida o ha vencido",
    );
  }
}
