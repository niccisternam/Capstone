import type { PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../shared/errors/app-error.js";
import type {
  CompleteLoginData,
  RotateSessionData,
} from "./auth.repository.js";
import type { AuthSession } from "./auth.types.js";

export class PrismaAuthSessionRepository {
  constructor(private readonly prisma: PrismaClient) {}

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
      include: { usuario: { include: { empresa: { select: { razonSocial: true } } } } },
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
}
