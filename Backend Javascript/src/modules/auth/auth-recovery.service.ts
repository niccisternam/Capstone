import type { VerificationEmailSender } from "../../shared/email/verification-email.sender.js";
import { AppError } from "../../shared/errors/app-error.js";
import { hashPassword, verifyPassword } from "../account-requests/password.js";
import type { AuthConfig } from "./auth.config.js";
import type { AuthCodeService } from "./auth-code.service.js";
import type { AuthRepository } from "./auth.repository.js";
import { hashToken } from "./auth.tokens.js";

const RECOVERY_RESPONSE = {
  estado: "RECUPERACION_SOLICITADA" as const,
  mensaje:
    "Si existe una cuenta asociada al correo, recibirás un enlace de recuperación.",
};

export class AuthRecoveryService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly emailSender: VerificationEmailSender,
    private readonly codes: AuthCodeService,
    private readonly config: AuthConfig,
  ) {}

  async requestPasswordRecovery(email: string) {
    const user = await this.repository.findUserByEmail(email);
    if (!user || user.estado === "INACTIVO") return RECOVERY_RESPONSE;

    try {
      const now = this.config.now();
      await this.codes.assertCanSendCode(
        user.idUsuario,
        "RECUPERACION_PASSWORD",
        now,
      );
      const id = this.config.createId();
      const rawToken = this.config.generateToken();
      const expiresAt = new Date(
        now.getTime() + this.config.recoveryTokenTtlMinutes * 60 * 1000,
      );

      await this.repository.createSecurityCode({
        id,
        userId: user.idUsuario,
        purpose: "RECUPERACION_PASSWORD",
        tokenHash: hashToken(rawToken),
        now,
        expiresAt,
      });

      const recoveryUrl = `${this.config.appOrigin.replace(/\/+$/, "")}/recuperar-password#token=${rawToken}`;
      try {
        await this.emailSender.sendPasswordRecoveryLink({
          recipient: user.correo,
          userName: user.nombre,
          recoveryUrl,
          expiresInMinutes: this.config.recoveryTokenTtlMinutes,
        });
      } catch {
        await this.repository.revokeSecurityCode(id, this.config.now());
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

  async validatePasswordRecoveryToken(token: string) {
    const trimmed = typeof token === "string" ? token.trim() : "";
    if (!trimmed) return { estado: "INVALIDO" as const };
    const challenge = await this.repository.findSecurityCodeByTokenHash(
      hashToken(trimmed),
      "RECUPERACION_PASSWORD",
    );
    if (!challenge) return { estado: "INVALIDO" as const };
    if (challenge.usedAt) return { estado: "USADO" as const };
    if (
      challenge.revokedAt ||
      challenge.expiresAt.getTime() <= this.config.now().getTime()
    ) {
      return { estado: "EXPIRADO" as const };
    }
    return { estado: "VALIDO" as const };
  }

  async resetPassword(token: string, newPassword: string) {
    if (!token || typeof token !== "string" || token.trim().length === 0) {
      throw new AppError(
        401,
        "INVALID_RECOVERY_TOKEN",
        "El token de recuperación no es válido o ya fue utilizado",
      );
    }
    const tokenHash = hashToken(token.trim());
    const challenge = await this.repository.findSecurityCodeByTokenHash(
      tokenHash,
      "RECUPERACION_PASSWORD",
    );
    const now = this.config.now();
    if (!challenge) {
      throw new AppError(
        401,
        "INVALID_RECOVERY_TOKEN",
        "El token de recuperación no es válido o ya fue utilizado",
      );
    }
    if (challenge.usedAt) {
      throw new AppError(
        410,
        "RECOVERY_TOKEN_USED",
        "Este enlace ya fue utilizado para cambiar la contraseña. Solicita un nuevo enlace si necesitas cambiarla nuevamente.",
      );
    }
    if (challenge.revokedAt || challenge.expiresAt.getTime() <= now.getTime()) {
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
    if (await verifyPassword(newPassword, challenge.usuario.passwordHash)) {
      throw new AppError(
        400,
        "PASSWORD_REUSE",
        "La contraseña no puede ser idéntica a la anterior.",
      );
    }

    await this.repository.completePasswordRecovery({
      tokenId: challenge.idToken,
      userId: challenge.idUsuario,
      passwordHash: await hashPassword(newPassword),
      now,
    });

    return { estado: "PASSWORD_ACTUALIZADA" as const };
  }
}
