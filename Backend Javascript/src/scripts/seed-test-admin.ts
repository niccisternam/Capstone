import { prisma } from "../config/database.js";
import { env } from "../config/env.js";
import { hashPassword } from "../modules/account-requests/password.js";

async function main() {
  if (env.NODE_ENV === "production") {
    throw new Error(
      "La cuenta administrativa artificial no puede crearse en producción",
    );
  }

  const email = env.AUTH_TEST_ADMIN_EMAIL ?? "admin@capstone.test";
  const passwordHash = await hashPassword("AdminTemporal1!");

  await prisma.$transaction(async (transaction) => {
    const company = await transaction.empresa.upsert({
      where: { rutEmpresa: "77777777-7" },
      update: {
        razonSocial: "Administración Capstone de prueba",
        estado: true,
      },
      create: {
        rutEmpresa: "77777777-7",
        razonSocial: "Administración Capstone de prueba",
      },
    });
    const existing = await transaction.usuario.findFirst({
      where: {
        OR: [
          { idEmpresa: company.idEmpresa },
          { rutUsuario: "6666666-2" },
          { correo: { equals: email, mode: "insensitive" } },
        ],
      },
    });

    if (existing) {
      await transaction.usuario.update({
        where: { idUsuario: existing.idUsuario },
        data: {
          idEmpresa: company.idEmpresa,
          rutUsuario: "6666666-2",
          nombre: "Administrador",
          apellido: "Prueba",
          correo: email,
          passwordHash,
          rol: "ADMINISTRADOR",
          estado: "ACTIVO",
          debeCambiarPassword: false,
          intentosFallidos: 0,
          bloqueadoHasta: null,
          correoVerificadoAt: new Date(),
        },
      });
    } else {
      await transaction.usuario.create({
        data: {
          idEmpresa: company.idEmpresa,
          rutUsuario: "6666666-2",
          nombre: "Administrador",
          apellido: "Prueba",
          correo: email,
          passwordHash,
          rol: "ADMINISTRADOR",
          estado: "ACTIVO",
          debeCambiarPassword: false,
          intentosFallidos: 0,
          bloqueadoHasta: null,
          correoVerificadoAt: new Date(),
        },
      });
    }
  });

  console.log(`Cuenta administrativa artificial lista: ${email}`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
