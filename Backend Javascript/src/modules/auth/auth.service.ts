import {
  createHash,
  createHmac,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from "node:crypto";
import type { VerificationEmailSender } from "../../shared/email/verification-email.sender.js";
import { AppError } from "../../shared/errors/app-error.js";
import { hashPassword, verifyPassword } from "../account-requests/password.js";
import type { AuthRepository } from "./auth.repository.js";
import type { LoginInput } from "./auth.schemas.js";
import type {
  AuthUser,
  SecurityCodeChallenge,
  SecurityCodePurpose,
} from "./auth.types.js";
import { JwtService } from "./jwt.service.js";

interface AuthServiceOptions {
  createId: () => string;
  codeSecret: string;
  now?: () => Date;
  generateCode?: () => string;
  generateToken?: () => string;
  challengeTtlMinutes?: number;
  recoveryTokenTtlMinutes?: number;
  maxCodeAttempts?: number;
  resendCooldownSeconds?: number;
  maxSendsPerWindow?: number;
  sendWindowMinutes?: number;
  regularSessionDays?: number;
  rememberedSessionDays?: number;
  idleTimeoutMinutes?: number;
  appOrigin?: string;
}

const RECOVERY_RESPONSE = {
  estado: "RECUPERACION_SOLICITADA" as const,
  mensaje:
    "Si existe una cuenta asociada al correo, recibirás un enlace de recuperación.",
};

export function generateVerificationCode(): string {
  return randomInt(100000, 1000000).toString();
}

export class AuthService {
  private readonly now: () => Date;
  private readonly generateCode: () => string;
  private readonly generateToken: () => string;
  private readonly challengeTtlMinutes: number;
  private readonly recoveryTokenTtlMinutes: number;
  private readonly maxCodeAttempts: number;
  private readonly resendCooldownSeconds: number;
  private readonly maxSendsPerWindow: number;
  private readonly sendWindowMinutes: number;
  private readonly regularSessionDays: number;
  private readonly rememberedSessionDays: number;
  private readonly idleTimeoutMinutes: number;
  private readonly appOrigin: string;

  constructor(
    private readonly repository: AuthRepository,
    private readonly jwt: JwtService,
    private readonly emailSender: VerificationEmailSender,
    private readonly options: AuthServiceOptions,
  ) {
    this.now = options.now ?? (() => new Date());
    this.generateCode = options.generateCode ?? generateVerificationCode;
    this.generateToken =
      options.generateToken ?? (() => randomBytes(32).toString("base64url"));
    this.challengeTtlMinutes = options.challengeTtlMinutes ?? 5;
    this.recoveryTokenTtlMinutes = options.recoveryTokenTtlMinutes ?? 15;
    this.maxCodeAttempts = options.maxCodeAttempts ?? 3;
    this.resendCooldownSeconds = options.resendCooldownSeconds ?? 60;
    this.maxSendsPerWindow = options.maxSendsPerWindow ?? 3;
    this.sendWindowMinutes = options.sendWindowMinutes ?? 15;
    this.regularSessionDays = options.regularSessionDays ?? 7;
    this.rememberedSessionDays = options.rememberedSessionDays ?? 30;
    this.idleTimeoutMinutes = options.idleTimeoutMinutes ?? 30;
    this.appOrigin = options.appOrigin ?? "http://localhost:5173";
  }

  async login(input: LoginInput) {
    const user = await this.repository.findUserByEmail(input.correo);
    const validPassword = user
      ? await verifyPassword(input.password, user.passwordHash)
      : false;
    if (!user || !validPassword) {
      if (user)
        await this.repository.registerFailedLogin(user.idUsuario, this.now());
      throw new AppError(
        401,
        "INVALID_CREDENTIALS",
        "Correo o contraseña incorrectos",
      );
    }
    this.assertCanLogin(user.estado, user.bloqueadoHasta);
    const unblockTo =
      user.estado === "BLOQUEADO"
        ? user.correoVerificadoAt
          ? ("ACTIVO" as const)
          : ("PENDIENTE" as const)
        : undefined;
    await this.repository.clearFailedLogins(user.idUsuario, unblockTo);

    if (user.debeCambiarPassword) {
      return {
        estado: "CAMBIO_PASSWORD_REQUERIDO" as const,
        passwordChangeToken: await this.jwt.createPasswordChangeToken(
          user.idUsuario,
        ),
        expiresInSeconds: 600,
      };
    }

    return this.startSecurityCode(user, "CODIGO_INICIO_SESION");
  }

  async changeTemporaryPassword(token: string, newPassword: string) {
    const userId = await this.jwt.verifyPasswordChangeToken(token);
    const user = await this.repository.findUserById(userId);
    if (!user || !user.debeCambiarPassword) {
      throw new AppError(
        409,
        "PASSWORD_CHANGE_NOT_REQUIRED",
        "El cambio temporal ya fue realizado",
      );
    }

    await this.repository.changeTemporaryPassword(
      userId,
      await hashPassword(newPassword),
      this.now(),
    );
    return this.startSecurityCode(
      { ...user, debeCambiarPassword: false },
      "CODIGO_INICIO_SESION",
    );
  }

  async resendLoginCode(challengeId: string) {
    const challenge = await this.repository.findSecurityCodeById(
      challengeId,
      "CODIGO_INICIO_SESION",
    );
    if (!challenge || challenge.usedAt) {
      throw new AppError(
        400,
        "LOGIN_CODE_INVALID_OR_EXPIRED",
        "Código inválido o vencido",
      );
    }
    this.assertCanLogin(
      challenge.usuario.estado,
      challenge.usuario.bloqueadoHasta,
    );
    return this.startSecurityCode(challenge.usuario, "CODIGO_INICIO_SESION");
  }

  async verifyLoginCode(
    challengeId: string,
    code: string,
    rememberSession: boolean,
  ) {
    const challenge = await this.repository.findSecurityCodeById(
      challengeId,
      "CODIGO_INICIO_SESION",
    );
    await this.assertValidCode(challenge, code, "LOGIN");
    this.assertCanLogin(
      challenge!.usuario.estado,
      challenge!.usuario.bloqueadoHasta,
    );

    const refreshToken = randomBytes(48).toString("base64url");
    const sessionId = this.options.createId();
    const now = this.now();
    const sessionDays = rememberSession
      ? this.rememberedSessionDays
      : this.regularSessionDays;
    const expiresAt = new Date(
      now.getTime() + sessionDays * 24 * 60 * 60 * 1000,
    );
    await this.repository.completeLogin({
      challengeId,
      userId: challenge!.idUsuario,
      sessionId,
      refreshTokenHash: createHash("sha256").update(refreshToken).digest("hex"),
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
      }),
      expiresInSeconds: 900,
      refreshToken,
      sessionId,
      rememberSession,
      refreshTokenExpiresAt: expiresAt,
    };
  }

  async refreshSession(refreshToken: string) {
    const currentTokenHash = this.hashRefreshToken(refreshToken);
    const session =
      await this.repository.findSessionByTokenHash(currentTokenHash);
    const now = this.now();
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
        this.idleTimeoutMinutes * 60 * 1000 <=
        now.getTime()
    ) {
      await this.repository.revokeSessionByTokenHash(currentTokenHash, now);
      this.throwInvalidRefreshToken();
    }
    this.assertCanLogin(
      session!.usuario.estado,
      session!.usuario.bloqueadoHasta,
    );

    const newRefreshToken = randomBytes(48).toString("base64url");
    const rotated = await this.repository.rotateSession({
      sessionId: session!.idSesion,
      currentTokenHash,
      newTokenHash: this.hashRefreshToken(newRefreshToken),
      now,
    });
    if (!rotated) this.throwInvalidRefreshToken();

    return {
      estado: "SESION_RENOVADA" as const,
      tokenType: "Bearer" as const,
      accessToken: await this.jwt.createAccessToken({
        idUsuario: session!.usuario.idUsuario,
        rol: session!.usuario.rol,
      }),
      expiresInSeconds: 900,
      refreshToken: newRefreshToken,
      sessionId: session!.idSesion,
      rememberSession: session!.recordarSesion,
      refreshTokenExpiresAt: session!.expiresAt,
    };
  }

  async logout(refreshToken: string | undefined) {
    if (refreshToken) {
      await this.repository.revokeSessionByTokenHash(
        this.hashRefreshToken(refreshToken),
        this.now(),
      );
    }
  }

  async requestPasswordRecovery(email: string) {
    const user = await this.repository.findUserByEmail(email);
    if (!user || user.estado === "INACTIVO") return RECOVERY_RESPONSE;

    try {
      const now = this.now();
      await this.assertCanSendCode(user.idUsuario, "RECUPERACION_PASSWORD", now);
      const id = this.options.createId();
      const rawToken = this.generateToken();
      const tokenHash = this.hashRecoveryToken(rawToken);
      const expiresAt = new Date(
        now.getTime() + this.recoveryTokenTtlMinutes * 60 * 1000,
      );

      await this.repository.createSecurityCode({
        id,
        userId: user.idUsuario,
        purpose: "RECUPERACION_PASSWORD",
        tokenHash,
        now,
        expiresAt,
      });

      const recoveryUrl = `${this.appOrigin.replace(/\/+$/, "")}/recuperar-password#token=${rawToken}`;
      try {
        await this.emailSender.sendPasswordRecoveryLink({
          recipient: user.correo,
          userName: user.nombre,
          recoveryUrl,
          expiresInMinutes: this.recoveryTokenTtlMinutes,
        });
      } catch {
        await this.repository.revokeSecurityCode(id, this.now());
        return RECOVERY_RESPONSE;
      }
    } catch (error) {
      if (
        error instanceof AppError &&
        [
          "CODE_RESEND_TOO_SOON",
          "CODE_SEND_LIMIT_EXCEEDED",
          "EMAIL_DELIVERY_FAILED",
        ].includes(error.code)
      ) {
        return RECOVERY_RESPONSE;
      }
      throw error;
    }
    return RECOVERY_RESPONSE;
  }

  /**
   * @deprecated Retirado en favor del enlace directo de recuperación enviado por correo.
   */
  async verifyRecoveryCode(): Promise<never> {
    throw new AppError(
      410,
      "ENDPOINT_DEPRECATED",
      "La verificación por código de recuperación ha sido retirada. Utiliza el enlace enviado a tu correo.",
    );
  }

  async resetPassword(token: string, newPassword: string) {
    if (!token || typeof token !== "string" || token.trim().length === 0) {
      throw new AppError(
        401,
        "INVALID_RECOVERY_TOKEN",
        "El token de recuperación no es válido o ya fue utilizado",
      );
    }
    const tokenHash = this.hashRecoveryToken(token.trim());
    const challenge = await this.repository.findSecurityCodeByTokenHash(
      tokenHash,
      "RECUPERACION_PASSWORD",
    );
    const now = this.now();
    if (
      !challenge ||
      challenge.usedAt ||
      challenge.revokedAt ||
      challenge.expiresAt.getTime() <= now.getTime()
    ) {
      throw new AppError(
        401,
        "INVALID_RECOVERY_TOKEN",
        "El token de recuperación no es válido o ya fue utilizado",
      );
    }
    if (!challenge.usuario) {
      throw new AppError(
        401,
        "INVALID_RECOVERY_TOKEN",
        "El token de recuperación no es válido o ya fue utilizado",
      );
    }
    if (challenge.usuario.estado === "INACTIVO") {
      throw new AppError(403, "ACCOUNT_INACTIVE", "La cuenta está inactiva");
    }

    await this.repository.completePasswordRecovery({
      tokenId: challenge.idToken,
      userId: challenge.idUsuario,
      passwordHash: await hashPassword(newPassword),
      now,
    });

    return { estado: "PASSWORD_ACTUALIZADA" as const };
  }

  private async startSecurityCode(
    user: AuthUser,
    purpose: SecurityCodePurpose,
  ) {
    const now = this.now();
    await this.assertCanSendCode(user.idUsuario, purpose, now);
    const id = this.options.createId();
    const code = this.generateCode();
    if (!/^\d{6}$/.test(code)) {
      throw new Error("El generador de códigos produjo un valor inválido");
    }
    const expiresAt = new Date(
      now.getTime() + this.challengeTtlMinutes * 60 * 1000,
    );
    await this.repository.createSecurityCode({
      id,
      userId: user.idUsuario,
      purpose,
      tokenHash: this.hashCode(id, purpose, code),
      now,
      expiresAt,
    });

    try {
      const email = {
        recipient: user.correo,
        code,
        expiresInMinutes: this.challengeTtlMinutes,
      };
      await this.emailSender.sendLoginVerificationCode(email);
    } catch {
      await this.repository.revokeSecurityCode(id, this.now());
      throw new AppError(
        503,
        "EMAIL_DELIVERY_FAILED",
        "No fue posible enviar el código de verificación. Inténtalo nuevamente.",
      );
    }

    return {
      estado: "CODIGO_REQUERIDO" as const,
      challengeId: id,
      expiresAt,
    };
  }

  private async assertCanSendCode(
    userId: string,
    purpose: SecurityCodePurpose,
    now: Date,
  ): Promise<void> {
    const windowStart = new Date(
      now.getTime() - this.sendWindowMinutes * 60 * 1000,
    );
    const creationTimes = await this.repository.listSecurityCodeCreationTimes(
      userId,
      purpose,
      windowStart,
    );
    if (creationTimes.length >= this.maxSendsPerWindow) {
      throw new AppError(
        429,
        "CODE_SEND_LIMIT_EXCEEDED",
        "Se alcanzó el límite temporal de envío de códigos",
      );
    }
    const latest = creationTimes[0];
    if (latest) {
      const elapsedSeconds = Math.floor(
        (now.getTime() - latest.getTime()) / 1000,
      );
      if (elapsedSeconds < this.resendCooldownSeconds) {
        throw new AppError(
          429,
          "CODE_RESEND_TOO_SOON",
          "Debes esperar antes de solicitar otro código",
          { retryAfterSeconds: this.resendCooldownSeconds - elapsedSeconds },
        );
      }
    }
  }

  private async assertValidCode(
    challenge: SecurityCodeChallenge | null,
    code: string,
    flow: "LOGIN" | "RECOVERY",
  ): Promise<void> {
    const now = this.now();
    if (
      !challenge ||
      challenge.usedAt ||
      challenge.revokedAt ||
      challenge.expiresAt.getTime() <= now.getTime() ||
      challenge.cantidadIntentos >= this.maxCodeAttempts
    ) {
      if (flow === "LOGIN") {
        throw new AppError(
          400,
          "LOGIN_CODE_INVALID_OR_EXPIRED",
          "Código inválido o vencido",
        );
      }
      this.throwInvalidRecoveryCode();
    }

    if (!this.codeMatches(challenge!, code)) {
      const revoke = challenge!.cantidadIntentos + 1 >= this.maxCodeAttempts;
      await this.repository.registerInvalidCode(
        challenge!.idToken,
        now,
        revoke,
      );
      if (flow === "LOGIN") {
        throw new AppError(
          400,
          revoke ? "LOGIN_CODE_ATTEMPTS_EXCEEDED" : "LOGIN_CODE_INVALID",
          revoke
            ? "Código bloqueado por demasiados intentos"
            : "Código incorrecto",
        );
      }
      this.throwInvalidRecoveryCode();
    }
  }

  private codeMatches(challenge: SecurityCodeChallenge, code: string): boolean {
    const expected = Buffer.from(challenge.tokenHash, "hex");
    const actual = Buffer.from(
      this.hashCode(challenge.idToken, challenge.tipo, code),
      "hex",
    );
    return (
      expected.length === actual.length && timingSafeEqual(expected, actual)
    );
  }

  private hashCode(
    id: string,
    purpose: SecurityCodePurpose,
    code: string,
  ): string {
    return createHmac("sha256", this.options.codeSecret)
      .update(`${id}:${purpose}:${code}`)
      .digest("hex");
  }

  private hashRefreshToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  private hashRecoveryToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  private throwInvalidRefreshToken(): never {
    throw new AppError(
      401,
      "INVALID_REFRESH_TOKEN",
      "La sesión no es válida o ha vencido",
    );
  }

  private throwInvalidRecoveryCode(): never {
    throw new AppError(
      400,
      "RECOVERY_CODE_INVALID_OR_EXPIRED",
      "Código de recuperación inválido o vencido",
    );
  }

  private assertCanLogin(status: string, blockedUntil: Date | null) {
    if (status === "INACTIVO") {
      throw new AppError(403, "ACCOUNT_INACTIVE", "La cuenta está inactiva");
    }
    if (
      status === "BLOQUEADO" &&
      (!blockedUntil || blockedUntil.getTime() > this.now().getTime())
    ) {
      throw new AppError(
        423,
        "ACCOUNT_BLOCKED",
        "La cuenta está temporalmente bloqueada",
      );
    }
  }
}
