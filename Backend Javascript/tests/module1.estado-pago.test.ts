import { describe, expect, it, vi } from "vitest";
import { Prisma } from "../src/generated/prisma/client.js";
import type { PrismaClient } from "../src/generated/prisma/client.js";
import { ejecutarMetrica } from "../src/modules/dashboard/dashboard.metrics.js";
import { NotebookService } from "../src/modules/module1/notebook.service.js";
import { ESTADOS_PAGO, notebookDocumentsQuerySchema, reviewSchema } from "../src/modules/module1/module1.schemas.js";

const identity = {
  idEmpresa: "0a000000-0000-4000-8000-000000000001",
  idUsuario: "0b000000-0000-4000-8000-000000000001",
};
const idNotebook = "0d000000-0000-4000-8000-000000000001";

const datosMinimos = {
  datos: {},
};

describe("catálogo de estado de pago", () => {
  it("contiene solo PENDIENTE y PAGADO", () => {
    expect([...ESTADOS_PAGO]).toEqual(["PENDIENTE", "PAGADO"]);
  });

  it("la revisión rechaza cualquier valor fuera del catálogo", () => {
    expect(reviewSchema.safeParse({ ...datosMinimos, estadoPago: "OTRO" }).success).toBe(false);
    expect(reviewSchema.safeParse({ ...datosMinimos, estadoPago: "pagado" }).success).toBe(false);
    expect(reviewSchema.safeParse({ ...datosMinimos, estadoPago: "" }).success).toBe(false);
    expect(reviewSchema.safeParse({ ...datosMinimos, estadoPago: "PAGADO" }).success).toBe(true);
    expect(reviewSchema.safeParse({ ...datosMinimos, estadoPago: "PENDIENTE" }).success).toBe(true);
  });

  it("el filtro del listado rechaza valores fuera del catálogo", () => {
    expect(notebookDocumentsQuerySchema.safeParse({ estadoPago: "OTRO" }).success).toBe(false);
    expect(notebookDocumentsQuerySchema.safeParse({ estadoPago: "PAGADO" }).success).toBe(true);
    expect(notebookDocumentsQuerySchema.safeParse({}).success).toBe(true);
  });
});

describe("filtro de estado de pago en el listado", () => {
  it("«Pendiente» busca revisiones confirmadas con estado PENDIENTE, incluidas las confirmadas", async () => {
    const documento = {
      idDocumento: "0e000000-0000-4000-8000-000000000001",
      idNotebook,
      idLote: "0f000000-0000-4000-8000-000000000001",
      posicionLote: 1,
      estado: "CONFIRMADO",
      createdAt: new Date("2026-11-13T12:00:00.000Z"),
      confirmadoAt: new Date("2026-11-14T12:00:00.000Z"),
      resultados: [],
      revisiones: [],
    };
    const prisma = {
      notebook: {
        findFirst: vi.fn().mockResolvedValue({ idNotebook, idEmpresa: identity.idEmpresa, nombre: "Compras", _count: { documentos: 1 } }),
      },
      documento: {
        count: vi.fn().mockResolvedValue(1),
        findMany: vi.fn().mockImplementation(({ distinct }) => Promise.resolve(distinct ? [] : [documento])),
      },
    };
    const service = new NotebookService(prisma as unknown as PrismaClient, "/tmp");

    await service.get(identity, idNotebook, { estadoPago: "PENDIENTE" });

    const pageCall = prisma.documento.findMany.mock.calls.map(([args]) => args).find((args) => !args.distinct);
    expect(pageCall.where.AND).toEqual(expect.arrayContaining([
      { revisiones: { some: { estado: "CONFIRMADA", estadoPago: "PENDIENTE" } } },
    ]));
  });
});

describe("métrica pagos_pendientes del dashboard", () => {
  it("compara el estado de pago exacto, sin normalizar en la consulta", async () => {
    const queries: Prisma.Sql[] = [];
    const prisma = {
      $queryRaw: vi.fn().mockImplementation((strings: TemplateStringsArray, ...values: unknown[]) => {
        queries.push(Prisma.sql(strings, ...values));
        return Promise.resolve([{ pendiente: "0", documentos: 0 }]);
      }),
    };

    await ejecutarMetrica(prisma as unknown as PrismaClient, {
      idEmpresa: identity.idEmpresa,
      idNotebook,
      metrica: "pagos_pendientes",
      filtros: {},
    });

    const sql = queries[0]!.sql;
    expect(sql).toContain(`r."estado_pago" = 'PENDIENTE'`);
    expect(sql).not.toContain("upper(btrim");
  });
});
