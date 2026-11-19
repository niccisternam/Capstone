import type { VerificationEmailSender } from "../../shared/email/verification-email.sender.js";
import { AppError } from "../../shared/errors/app-error.js";
import { randomBytes } from "node:crypto";
import { hashPassword, verifyPassword } from "../account-requests/password.js";
import type { AuthRepository } from "./auth.repository.js";
import type { LoginInput } from "./auth.schemas.js";
import type { AuthServiceOptions } from "./auth.config.js";
import { resolveAuthConfig } from "./auth.config.js";
import type { AuthConfig } from "./auth.config.js";
import { AuthCodeService } from "./auth-code.service.js";
import { assertCanLogin } from "./auth.guards.js";
import { AuthRecoveryService } from "./auth-recovery.service.js";
import { AuthSessionService } from "./auth-session.service.js";
import { JwtService } from "./jwt.service.js";

export type { AuthServiceOptions } from "./auth.config.js";

// Hash válido de una contraseña aleatoria descartada: se verifica cuando el correo no existe
// para que la respuesta tarde lo mismo y no revele qué correos están registrados.
const DUMMY_PASSWORD_HASH = hashPassword(randomBytes(32).toString("hex"));
export { generateVerificationCode } from "./auth.tokens.js";

export class AuthService {
  private readonly config: AuthConfig;
  private readonly codes: AuthCodeService;
  private readonly sessions: AuthSessionService;
  private readonly recovery: AuthRecoveryService;

  constructor(
    private readonly repository: AuthRepository,
    private readonly jwt: JwtService,
    emailSender: VerificationEmailSender,
    options: AuthServiceOptions,
  ) {
    this.config = resolveAuthConfig(options);
    this.codes = new AuthCodeService(repository, emailSender, this.config);
    this.sessions = new AuthSessionService(
      repository,
      jwt,
      this.codes,
      this.config,
    );
    this.recovery = new AuthRecoveryService(
      repository,
      emailSender,
      this.codes,
      this.config,
    );
  }

  async login(input: LoginInput) {
    const user = await this.repository.findUserByEmail(input.correo);
    const now = this.config.now();
    const currentlyBlocked =
      user?.estado === "BLOQUEADO" &&
      user.bloqueadoHasta !== null &&
      user.bloqueadoHasta.getTime() > now.getTime();
    if (currentlyBlocked) {
      throw new AppError(
        423,
        "ACCOUNT_BLOCKED",
        "La cuenta está temporalmente bloqueada",
      );
    }
    let validPassword = false;
    if (user) {
      validPassword = await verifyPassword(input.password, user.passwordHash);
    } else {
      await verifyPassword(input.password, await DUMMY_PASSWORD_HASH);
    }
    if (!user || !validPassword) {
      if (user && !currentlyBlocked) {
        const blocked = await this.repository.registerFailedLogin(
          user.idUsuario,
          now,
        );
        if (blocked) {
          throw new AppError(
            423,
            "ACCOUNT_BLOCKED",
            "La cuenta está bloqueada durante 15 minutos por intentos fallidos",
          );
        }
      }
      throw new AppError(
        401,
        "INVALID_CREDENTIALS",
        "Correo o contraseña incorrectos",
      );
    }
    assertCanLogin(user.estado, user.bloqueadoHasta, this.config.now());
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

    return this.codes.start(user, "CODIGO_INICIO_SESION");
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
      this.config.now(),
    );
    return this.codes.start(
      { ...user, debeCambiarPassword: false },
      "CODIGO_INICIO_SESION",
    );
  }

  async resendLoginCode(challengeId: string) {
    const challenge = await this.repository.findSecurityCodeById(
      challengeId,
      "CODIGO_INICIO_SESION",
    );
    // Un challenge vencido, revocado o con intentos agotados no puede reactivarse:
    // si no, un challengeId antiguo permitiría pedir códigos sin volver a validar la contraseña.
    if (
      !challenge ||
      challenge.usedAt ||
      challenge.revokedAt ||
      challenge.expiresAt.getTime() <= this.config.now().getTime() ||
      challenge.cantidadIntentos >= this.config.maxCodeAttempts
    ) {
      throw new AppError(
        400,
        "LOGIN_CODE_INVALID_OR_EXPIRED",
        "El código venció. Vuelve a iniciar sesión para recibir uno nuevo.",
      );
    }
    assertCanLogin(
      challenge.usuario.estado,
      challenge.usuario.bloqueadoHasta,
      this.config.now(),
    );
    return this.codes.start(challenge.usuario, "CODIGO_INICIO_SESION");
  }

  verifyLoginCode(
    challengeId: string,
    code: string,
    rememberSession: boolean,
  ) {
    return this.sessions.verifyLoginCode(challengeId, code, rememberSession);
  }

  refreshSession(refreshToken: string) {
    return this.sessions.refreshSession(refreshToken);
  }

  logout(refreshToken: string | undefined) {
    return this.sessions.logout(refreshToken);
  }

  requestPasswordRecovery(email: string) {
    return this.recovery.requestPasswordRecovery(email);
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

  validatePasswordRecoveryToken(token: string) {
    return this.recovery.validatePasswordRecoveryToken(token);
  }

  resetPassword(token: string, newPassword: string) {
    return this.recovery.resetPassword(token, newPassword);
  }
}
