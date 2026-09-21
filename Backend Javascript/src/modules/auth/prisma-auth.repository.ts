import type { PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../shared/errors/app-error.js";
import type {
  AuthRepository,
  CompleteLoginData,
  CompletePasswordRecoveryData,
  RotateSessionData,
} from "./auth.repository.js";
import type {
  AuthSession,
  AuthUser,
  SecurityCodeChallenge,
  SecurityCodePurpose,
} from "./auth.types.js";

export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findUserByEmail(email: string): Promise<AuthUser | null> {
    return this.prisma.usuario.findFirst({
      where: { correo: { equals: email, mode: "insensitive" } },
    });
  }

  findUserById(id: string): Promise<AuthUser | null> {
    return this.prisma.usuario.findUnique({ where: { idUsuario: id } });
  }

  async registerFailedLogin(userId: string, now: Date): Promise<void> {
    await this.prisma.$transaction(async (transaction) => {
      const user = await transaction.usuario.findUniqueOrThrow({
        where: { idUsuario: userId },
      });
      const attempts = user.intentosFallidos + 1;
      const blocked = attempts >= 5;
      await transaction.usuario.update({
        where: { idUsuario: userId },
        data: {
          intentosFallidos: attempts,
          estado: blocked ? "BLOQUEADO" : user.estado,
          bloqueadoHasta: blocked
            ? new Date(now.getTime() + 15 * 60 * 1000)
            : user.bloqueadoHasta,
        },
      });
      await transaction.eventoSeguridad.create({
        data: {
          idUsuario: userId,
          tipoEvento: blocked ? "CUENTA_BLOQUEADA" : "LOGIN_FALLIDO",
          identificador: user.correo,
          exitoso: false,
          motivoFallo: "Credenciales inválidas",
          createdAt: now,
        },
      });
    });
  }

  async clearFailedLogins(
    userId: string,
    unblockTo?: "PENDIENTE" | "ACTIVO",
  ): Promise<void> {
    await this.prisma.usuario.update({
      where: { idUsuario: userId },
      data: {
        intentosFallidos: 0,
        bloqueadoHasta: null,
        estado: unblockTo,
      },
    });
  }

  async changeTemporaryPassword(
    userId: string,
    passwordHash: string,
    now: Date,
  ): Promise<void> {
    await this.prisma.usuario.update({
      where: { idUsuario: userId },
      data: {
        passwordHash,
        debeCambiarPassword: false,
        passwordChangedAt: now,
        intentosFallidos: 0,
      },
    });
  }

  async listSecurityCodeCreationTimes(
    userId: string,
    purpose: SecurityCodePurpose,
    since: Date,
  ): Promise<Date[]> {
    const codes = await this.prisma.tokenSeguridad.findMany({
      where: { idUsuario: userId, tipo: purpose, createdAt: { gte: since } },
      select: { createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    return codes.map((code) => code.createdAt);
  }

  async createSecurityCode(data: {
    id: string;
    userId: string;
    purpose: SecurityCodePurpose;
    tokenHash: string;
    now: Date;
    expiresAt: Date;
  }): Promise<void> {
    await this.prisma.$transaction(async (transaction) => {
      await transaction.tokenSeguridad.updateMany({
        where: {
          idUsuario: data.userId,
          tipo: data.purpose,
          revokedAt: null,
        },
        data: { revokedAt: data.now },
      });
      await transaction.tokenSeguridad.create({
        data: {
          idToken: data.id,
          idUsuario: data.userId,
          tipo: data.purpose,
          tokenHash: data.tokenHash,
          createdAt: data.now,
          expiresAt: data.expiresAt,
        },
      });
      if (data.purpose === "RECUPERACION_PASSWORD") {
        await transaction.eventoSeguridad.create({
          data: {
            idUsuario: data.userId,
            tipoEvento: "RECUPERACION_SOLICITADA",
            identificador: data.userId,
            exitoso: true,
            createdAt: data.now,
          },
        });
      }
    });
  }

  async revokeSecurityCode(id: string, now: Date): Promise<void> {
    await this.prisma.tokenSeguridad.updateMany({
      where: { idToken: id, revokedAt: null },
      data: { revokedAt: now },
    });
  }

  async findSecurityCodeById(
    id: string,
    purpose: SecurityCodePurpose,
  ): Promise<SecurityCodeChallenge | null> {
    const code = await this.prisma.tokenSeguridad.findFirst({
      where: { idToken: id, tipo: purpose },
      include: { usuario: true },
    });
    return code as SecurityCodeChallenge | null;
  }

  async findSecurityCodeByTokenHash(
    tokenHash: string,
    purpose: SecurityCodePurpose,
  ): Promise<SecurityCodeChallenge | null> {
    const code = await this.prisma.tokenSeguridad.findFirst({
      where: { tokenHash, tipo: purpose },
      include: { usuario: true },
    });
    return code as SecurityCodeChallenge | null;
  }

  async findLatestSecurityCode(
    userId: string,
    purpose: SecurityCodePurpose,
  ): Promise<SecurityCodeChallenge | null> {
    const code = await this.prisma.tokenSeguridad.findFirst({
      where: { idUsuario: userId, tipo: purpose },
      include: { usuario: true },
      orderBy: { createdAt: "desc" },
    });
    return code as SecurityCodeChallenge | null;
  }

  async registerInvalidCode(
    id: string,
    now: Date,
    revoke: boolean,
  ): Promise<void> {
    await this.prisma.$transaction(async (transaction) => {
      const code = await transaction.tokenSeguridad.update({
        where: { idToken: id },
        data: {
          cantidadIntentos: { increment: 1 },
          revokedAt: revoke ? now : undefined,
        },
      });
      await transaction.eventoSeguridad.create({
        data: {
          idUsuario: code.idUsuario,
          tipoEvento: "CODIGO_INVALIDO",
          identificador: code.idUsuario,
          exitoso: false,
          motivoFallo: revoke
            ? "Máximo de intentos alcanzado"
            : "Código incorrecto",
          createdAt: now,
        },
      });
    });
  }

  async markSecurityCodeUsed(id: string, now: Date): Promise<boolean> {
    const result = await this.prisma.tokenSeguridad.updateMany({
      where: {
        idToken: id,
        usedAt: null,
        revokedAt: null,
        expiresAt: { gt: now },
      },
      data: { usedAt: now },
    });
    return result.count === 1;
  }

  async completeLogin(data: CompleteLoginData): Promise<void> {
    await this.prisma.$transaction(async (transaction) => {
      const claimed = await transaction.tokenSeguridad.updateMany({
        where: {
          idToken: data.challengeId,
          tipo: "CODIGO_INICIO_SESION",
          usedAt: null,
          revokedAt: null,
          expiresAt: { gt: data.now },
        },
        data: { usedAt: data.now },
      });
      if (claimed.count !== 1) {
        throw new AppError(
          400,
          "LOGIN_CODE_INVALID_OR_EXPIRED",
          "Código inválido o vencido",
        );
      }
      await transaction.usuario.update({
        where: { idUsuario: data.userId },
        data: {
          estado: "ACTIVO",
          correoVerificadoAt: data.now,
          intentosFallidos: 0,
        },
      });
      await transaction.sesionUsuario.create({
        data: {
          idSesion: data.sessionId,
          idUsuario: data.userId,
          tokenHash: data.refreshTokenHash,
          recordarSesion: data.rememberSession,
          createdAt: data.now,
          ultimaActividadAt: data.now,
          expiresAt: data.expiresAt,
        },
      });
      await transaction.eventoSeguridad.create({
        data: {
          idUsuario: data.userId,
          tipoEvento: "LOGIN_EXITOSO",
          identificador: data.userId,
          exitoso: true,
          createdAt: data.now,
        },
      });
    });
  }

  async findSessionByTokenHash(tokenHash: string): Promise<AuthSession | null> {
    const session = await this.prisma.sesionUsuario.findUnique({
      where: { tokenHash },
      include: { usuario: true },
    });
    return session as AuthSession | null;
  }

  async rotateSession(data: RotateSessionData): Promise<boolean> {
    const updated = await this.prisma.sesionUsuario.updateMany({
      where: {
        idSesion: data.sessionId,
        tokenHash: data.currentTokenHash,
        revokedAt: null,
        expiresAt: { gt: data.now },
      },
      data: {
        tokenHash: data.newTokenHash,
        ultimaActividadAt: data.now,
      },
    });
    return updated.count === 1;
  }

  async revokeSessionByTokenHash(
    tokenHash: string,
    now: Date,
  ): Promise<boolean> {
    return this.prisma.$transaction(async (transaction) => {
      const session = await transaction.sesionUsuario.findUnique({
        where: { tokenHash },
      });
      if (!session || session.revokedAt) return false;
      const updated = await transaction.sesionUsuario.updateMany({
        where: { idSesion: session.idSesion, revokedAt: null },
        data: { revokedAt: now },
      });
      if (updated.count !== 1) return false;
      await transaction.eventoSeguridad.create({
        data: {
          idUsuario: session.idUsuario,
          tipoEvento: "SESION_CERRADA",
          identificador: session.idUsuario,
          exitoso: true,
          createdAt: now,
        },
      });
      return true;
    });
  }

  async completePasswordRecovery(
    data: CompletePasswordRecoveryData,
  ): Promise<void> {
    await this.prisma.$transaction(async (transaction) => {
      const tokenClaim = await transaction.tokenSeguridad.updateMany({
        where: {
          idToken: data.tokenId,
          idUsuario: data.userId,
          tipo: "RECUPERACION_PASSWORD",
          usedAt: null,
          revokedAt: null,
          expiresAt: { gt: data.now },
        },
        data: {
          usedAt: data.now,
          revokedAt: data.now,
        },
      });
      if (tokenClaim.count !== 1) {
        throw new AppError(
          401,
          "INVALID_RECOVERY_TOKEN",
          "El token de recuperación no es válido o ya fue utilizado",
        );
      }
      const user = await transaction.usuario.findUniqueOrThrow({
        where: { idUsuario: data.userId },
      });
      if (user.estado === "INACTIVO") {
        throw new AppError(403, "ACCOUNT_INACTIVE", "La cuenta está inactiva");
      }
      await transaction.usuario.update({
        where: { idUsuario: data.userId },
        data: {
          passwordHash: data.passwordHash,
          debeCambiarPassword: false,
          passwordChangedAt: data.now,
          intentosFallidos: 0,
          bloqueadoHasta: null,
          estado:
            user.estado === "BLOQUEADO"
              ? user.correoVerificadoAt
                ? "ACTIVO"
                : "PENDIENTE"
              : user.estado,
        },
      });
      await transaction.tokenSeguridad.updateMany({
        where: {
          idUsuario: data.userId,
          tipo: "RECUPERACION_PASSWORD",
          revokedAt: null,
        },
        data: { revokedAt: data.now },
      });
      await transaction.sesionUsuario.updateMany({
        where: { idUsuario: data.userId, revokedAt: null },
        data: { revokedAt: data.now },
      });
      await transaction.eventoSeguridad.create({
        data: {
          idUsuario: data.userId,
          tipoEvento: "CAMBIO_PASSWORD",
          identificador: data.userId,
          exitoso: true,
          createdAt: data.now,
        },
      });
    });
  }
}
