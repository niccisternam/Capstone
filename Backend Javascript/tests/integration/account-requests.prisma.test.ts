import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "../../src/config/database.js";
import { PrismaAccountRequestRepository } from "../../src/modules/account-requests/prisma-account-request.repository.js";

const runDatabaseTests =
  process.env.RUN_DATABASE_TESTS === "true" ||
  process.env.npm_lifecycle_event === "test:db";
const databaseDescribe = runDatabaseTests ? describe : describe.skip;

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
    .padEnd(length, "8")
    .slice(0, length);
  const body = digits[0] === "0" ? `1${digits.slice(1)}` : digits;
  return `${body}-${checkDigit(body)}`;
}

databaseDescribe("PrismaAccountRequestRepository with Supabase", () => {
  const repository = new PrismaAccountRequestRepository(prisma);
  const adminCompanyId = randomUUID();
  const adminId = randomUUID();
  const requestId = randomUUID();
  const clientCompanyId = randomUUID();
  const clientUserId = randomUUID();
  const adminCompanyRut = uniqueRut(8);
  const adminUserRut = uniqueRut(7);
  const clientCompanyRut = uniqueRut(8);
  const clientUserRut = uniqueRut(8);

  beforeAll(async () => {
    await prisma.empresa.create({
      data: {
        idEmpresa: adminCompanyId,
        rutEmpresa: adminCompanyRut,
        razonSocial: "Administración de prueba",
        usuario: {
          create: {
            idUsuario: adminId,
            rutUsuario: adminUserRut,
            nombre: "Admin",
            apellido: "Prueba",
            correo: `admin-${adminId}@example.invalid`,
            passwordHash: "scrypt:test:hash",
            rol: "ADMINISTRADOR",
            estado: "ACTIVO",
            debeCambiarPassword: false,
          },
        },
      },
    });
  });

  afterAll(async () => {
    await prisma.solicitudCuenta.deleteMany({
      where: { idSolicitud: requestId },
    });
    await prisma.usuario.deleteMany({
      where: { idUsuario: { in: [adminId, clientUserId] } },
    });
    await prisma.empresa.deleteMany({
      where: { idEmpresa: { in: [adminCompanyId, clientCompanyId] } },
    });
    await prisma.$disconnect();
  });

  it("persists and approves a request atomically", async () => {
    const request = await repository.create(
      {
        rutEmpresa: clientCompanyRut,
        razonSocial: "Panadería de prueba",
        rutUsuario: clientUserRut,
        nombre: "Ana",
        apellido: "Pérez",
        correo: `cliente-${clientUserId}@example.invalid`,
        descripcion: "Prueba de integración",
      },
      requestId,
      new Date(),
    );

    const result = await repository.approve({
      idSolicitud: request.idSolicitud,
      adminId,
      reviewedAt: new Date(),
      company: {
        idEmpresa: clientCompanyId,
        rutEmpresa: request.rutEmpresa,
        razonSocial: "Panadería de prueba",
      },
      user: {
        idUsuario: clientUserId,
        idEmpresa: clientCompanyId,
        rutUsuario: request.rutUsuario,
        nombre: request.nombre,
        apellido: request.apellido,
        correo: request.correo,
        passwordHash: "scrypt:test:hash",
        rol: "USUARIO",
        estado: "PENDIENTE",
        debeCambiarPassword: true,
      },
    });

    expect(result.request.estado).toBe("APROBADA");
    expect(result.user.idEmpresa).toBe(result.company.idEmpresa);
    expect(
      await prisma.usuario.count({ where: { idEmpresa: clientCompanyId } }),
    ).toBe(1);
  });
});
