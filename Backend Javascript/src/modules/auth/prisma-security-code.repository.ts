import type { PrismaClient } from "../../generated/prisma/client.js";
import type {
  SecurityCodeChallenge,
  SecurityCodePurpose,
} from "./auth.types.js";

export class PrismaSecurityCodeRepository {
  constructor(private readonly prisma: PrismaClient) {}

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
      include: { usuario: { include: { empresa: { select: { razonSocial: true } } } } },
    });
    return code as SecurityCodeChallenge | null;
  }

  async findSecurityCodeByTokenHash(
    tokenHash: string,
    purpose: SecurityCodePurpose,
  ): Promise<SecurityCodeChallenge | null> {
    const code = await this.prisma.tokenSeguridad.findFirst({
      where: { tokenHash, tipo: purpose },
      include: { usuario: { include: { empresa: { select: { razonSocial: true } } } } },
    });
    return code as SecurityCodeChallenge | null;
  }

  async findLatestSecurityCode(
    userId: string,
    purpose: SecurityCodePurpose,
  ): Promise<SecurityCodeChallenge | null> {
    const code = await this.prisma.tokenSeguridad.findFirst({
      where: { idUsuario: userId, tipo: purpose },
      include: { usuario: { include: { empresa: { select: { razonSocial: true } } } } },
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
}
