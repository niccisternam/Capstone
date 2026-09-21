import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "../../src/config/database.js";
import {
  hashPassword,
  verifyPassword,
} from "../../src/modules/account-requests/password.js";
import { PrismaAuthRepository } from "../../src/modules/auth/prisma-auth.repository.js";
import { AuthService } from "../../src/modules/auth/auth.service.js";
import { JwtService } from "../../src/modules/auth/jwt.service.js";
import type {
  PasswordRecoveryLinkEmail,
  VerificationCodeEmail,
  VerificationEmailSender,
} from "../../src/shared/email/verification-email.sender.js";

const runDatabaseTests =
  process.env.RUN_DATABASE_TESTS === "true" ||
  process.env.npm_lifecycle_event === "test:db";
const databaseDescribe = runDatabaseTests ? describe : describe.skip;

class CapturingEmailSender implements VerificationEmailSender {
  login?: VerificationCodeEmail;
  recovery?: PasswordRecoveryLinkEmail;

  async sendLoginVerificationCode(email: VerificationCodeEmail) {
    this.login = email;
  }

  async sendPasswordRecoveryLink(email: PasswordRecoveryLinkEmail) {
    this.recovery = email;
  }
}

function checkDigit(body: string): string {
  let sum = 0;
  let multiplier = 2;
  for (let index = body.length - 1; index >= 0; index -= 1) {
    sum += Number(body[index]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const result = 11 - (sum % 11);
  return result === 11 ? "0" : result === 10 ? "K" : String(result);
}

function uniqueRut(length: 7 | 8): string {
  const digits = randomUUID()
    .replace(/\D/g, "")
    .padEnd(length, "7")
    .slice(0, length);
  const body = digits[0] === "0" ? `1${digits.slice(1)}` : digits;
  return `${body}-${checkDigit(body)}`;
}

databaseDescribe("AuthService with Prisma and Supabase", () => {
  const repository = new PrismaAuthRepository(prisma);
  const emailSender = new CapturingEmailSender();
  const companyId = randomUUID();
  const userId = randomUUID();
  const email = `auth-${userId}@example.invalid`;
  const jwt = new JwtService("integration-secret-at-least-16-characters");
  const service = new AuthService(repository, jwt, emailSender, {
    createId: randomUUID,
    codeSecret: "integration-secret-at-least-16-characters",
    generateCode: () => "654321",
    generateToken: () => "supabase-integration-recovery-token-xyz-12345",
    appOrigin: "http://localhost:5173",
  });

  beforeAll(async () => {
    await prisma.empresa.create({
      data: {
        idEmpresa: companyId,
        rutEmpresa: uniqueRut(8),
        razonSocial: "Empresa integración autenticación",
        usuario: {
          create: {
            idUsuario: userId,
            rutUsuario: uniqueRut(7),
            nombre: "Usuario",
            apellido: "Integración",
            correo: email,
            passwordHash: await hashPassword("InicialSegura123!"),
            rol: "USUARIO",
            estado: "ACTIVO",
            debeCambiarPassword: false,
            correoVerificadoAt: new Date(),
          },
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.eventoSeguridad.deleteMany({ where: { idUsuario: userId } });
    await prisma.sesionUsuario.deleteMany({ where: { idUsuario: userId } });
    await prisma.tokenSeguridad.deleteMany({ where: { idUsuario: userId } });
    await prisma.usuario.deleteMany({ where: { idUsuario: userId } });
    await prisma.empresa.deleteMany({ where: { idEmpresa: companyId } });
    await prisma.$disconnect();
  });

  it("persists login and recovery codes without plaintext and completes both flows", async () => {
    const login = await service.login({
      correo: email,
      password: "InicialSegura123!",
    });
    expect(login.estado).toBe("CODIGO_REQUERIDO");
    if (login.estado !== "CODIGO_REQUERIDO")
      throw new Error("Estado de login inesperado");
    const loginCode = await prisma.tokenSeguridad.findUniqueOrThrow({
      where: { idToken: login.challengeId },
    });
    expect(loginCode.tipo).toBe("CODIGO_INICIO_SESION");
    expect(loginCode.tokenHash).not.toContain("654321");
    expect(emailSender.login?.code).toBe("654321");

    const authenticated = await service.verifyLoginCode(
      login.challengeId,
      "654321",
      false,
    );
    expect(authenticated.estado).toBe("AUTENTICADO");
    expect(
      await prisma.sesionUsuario.count({ where: { idUsuario: userId } }),
    ).toBe(1);
    const renewed = await service.refreshSession(authenticated.refreshToken);
    expect(renewed.estado).toBe("SESION_RENOVADA");
    await expect(
      service.refreshSession(authenticated.refreshToken),
    ).rejects.toMatchObject({ code: "INVALID_REFRESH_TOKEN" });

    await service.requestPasswordRecovery(email);
    expect(emailSender.recovery?.recoveryUrl).toContain(
      "http://localhost:5173/recuperar-password#token=supabase-integration-recovery-token-xyz-12345",
    );
    expect(emailSender.recovery?.userName).toBe("Usuario");

    const recoveryTokenRecord = await prisma.tokenSeguridad.findFirstOrThrow({
      where: { idUsuario: userId, tipo: "RECUPERACION_PASSWORD" },
    });
    expect(recoveryTokenRecord.tokenHash).not.toContain(
      "supabase-integration-recovery-token",
    );
    expect(recoveryTokenRecord.usedAt).toBeNull();
    expect(recoveryTokenRecord.revokedAt).toBeNull();

    await service.resetPassword(
      "supabase-integration-recovery-token-xyz-12345",
      "RecuperadaSegura123!",
    );

    const updatedTokenRecord = await prisma.tokenSeguridad.findUniqueOrThrow({
      where: { idToken: recoveryTokenRecord.idToken },
    });
    expect(updatedTokenRecord.usedAt).not.toBeNull();
    expect(updatedTokenRecord.revokedAt).not.toBeNull();

    const updated = await prisma.usuario.findUniqueOrThrow({
      where: { idUsuario: userId },
    });
    expect(
      await verifyPassword("RecuperadaSegura123!", updated.passwordHash),
    ).toBe(true);
    expect(
      await prisma.sesionUsuario.count({
        where: { idUsuario: userId, revokedAt: { not: null } },
      }),
    ).toBe(1);
  });
});
