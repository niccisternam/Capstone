import type { VerificationEmailSender } from "../../shared/email/verification-email.sender.js";
import { AppError } from "../../shared/errors/app-error.js";
import type { AuthConfig } from "./auth.config.js";
import type { AuthRepository } from "./auth.repository.js";
import { codeMatches, hashCode } from "./auth.tokens.js";
import type {
  AuthUser,
  SecurityCodeChallenge,
  SecurityCodePurpose,
} from "./auth.types.js";

export class AuthCodeService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly emailSender: VerificationEmailSender,
    private readonly config: AuthConfig,
  ) {}

  async start(user: AuthUser, purpose: SecurityCodePurpose) {
    const now = this.config.now();
    await this.assertCanSendCode(user.idUsuario, purpose, now);
    const id = this.config.createId();
    const code = this.config.generateCode();
    if (!/^\d{6}$/.test(code)) {
      throw new Error("El generador de códigos produjo un valor inválido");
    }
    const expiresAt = new Date(
      now.getTime() + this.config.challengeTtlMinutes * 60 * 1000,
    );
    await this.repository.createSecurityCode({
      id,
      userId: user.idUsuario,
      purpose,
      tokenHash: hashCode(this.config.codeSecret, id, purpose, code),
      now,
      expiresAt,
    });

    try {
      await this.emailSender.sendLoginVerificationCode({
        recipient: user.correo,
        code,
        expiresInMinutes: this.config.challengeTtlMinutes,
      });
    } catch {
      await this.repository.revokeSecurityCode(id, this.config.now());
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

  async assertCanSendCode(
    userId: string,
    purpose: SecurityCodePurpose,
    now: Date,
  ): Promise<void> {
    const windowStart = new Date(
      now.getTime() - this.config.sendWindowMinutes * 60 * 1000,
    );
    const creationTimes = await this.repository.listSecurityCodeCreationTimes(
      userId,
      purpose,
      windowStart,
    );
    if (creationTimes.length >= this.config.maxSendsPerWindow) {
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
      if (elapsedSeconds < this.config.resendCooldownSeconds) {
        throw new AppError(
          429,
          "CODE_RESEND_TOO_SOON",
          "Debes esperar antes de solicitar otro código",
          {
            retryAfterSeconds:
              this.config.resendCooldownSeconds - elapsedSeconds,
          },
        );
      }
    }
  }

  async assertValidCode(
    challenge: SecurityCodeChallenge | null,
    code: string,
    flow: "LOGIN" | "RECOVERY",
  ): Promise<void> {
    const now = this.config.now();
    if (
      !challenge ||
      challenge.usedAt ||
      challenge.revokedAt ||
      challenge.expiresAt.getTime() <= now.getTime() ||
      challenge.cantidadIntentos >= this.config.maxCodeAttempts
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

    if (!codeMatches(this.config.codeSecret, challenge!, code)) {
      const revoke =
        challenge!.cantidadIntentos + 1 >= this.config.maxCodeAttempts;
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

  private throwInvalidRecoveryCode(): never {
    throw new AppError(
      400,
      "RECOVERY_CODE_INVALID_OR_EXPIRED",
      "Código de recuperación inválido o vencido",
    );
  }
}
