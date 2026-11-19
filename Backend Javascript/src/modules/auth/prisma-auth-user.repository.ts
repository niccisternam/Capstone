import type { PrismaClient } from "../../generated/prisma/client.js";
import type { AuthUser } from "./auth.types.js";

export class PrismaAuthUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  findUserByEmail(email: string): Promise<AuthUser | null> {
    return this.prisma.usuario.findFirst({
      where: { correo: { equals: email, mode: "insensitive" } },
    });
  }

  findUserById(id: string): Promise<AuthUser | null> {
    return this.prisma.usuario.findUnique({ where: { idUsuario: id } });
  }

  async registerFailedLogin(userId: string, now: Date): Promise<boolean> {
    return this.prisma.$transaction(async (transaction) => {
      let user = await transaction.usuario.findUniqueOrThrow({
        where: { idUsuario: userId },
      });
      let blocked = false;
      while (true) {
        if (
          user.estado === "BLOQUEADO" &&
          user.bloqueadoHasta &&
          user.bloqueadoHasta > now
        ) {
          blocked = true;
          break;
        }
        const attempts = user.intentosFallidos + 1;
        blocked = attempts >= 5;
        const updated = await transaction.usuario.updateMany({
          where: {
            idUsuario: userId,
            intentosFallidos: user.intentosFallidos,
            estado: user.estado,
          },
          data: {
            intentosFallidos: attempts,
            estado: blocked ? "BLOQUEADO" : user.estado,
            bloqueadoHasta: blocked
              ? new Date(now.getTime() + 15 * 60 * 1000)
              : user.bloqueadoHasta,
          },
        });
        if (updated.count === 1) break;
        user = await transaction.usuario.findUniqueOrThrow({
          where: { idUsuario: userId },
        });
      }
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
      return blocked;
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
}
