import type { PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../shared/errors/app-error.js";
import type { CompletePasswordRecoveryData } from "./auth.repository.js";

export class PrismaAuthRecoveryRepository {
  constructor(private readonly prisma: PrismaClient) {}

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
