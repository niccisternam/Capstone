import { describe, expect, it, vi } from "vitest";
import type { PrismaClient } from "../src/generated/prisma/client.js";
import { NotebookService } from "../src/modules/module1/notebook.service.js";

const identity = {
  idEmpresa: "0a000000-0000-4000-8000-000000000001",
  idUsuario: "0b000000-0000-4000-8000-000000000001",
};
const idNotebook = "0d000000-0000-4000-8000-000000000001";
const documento = {
  idDocumento: "0e000000-0000-4000-8000-000000000001",
  idEmpresa: identity.idEmpresa,
  idNotebook,
  idLote: "0f000000-0000-4000-8000-000000000001",
  cargadoPorId: identity.idUsuario,
  posicionLote: 1,
  estado: "CONFIRMADO",
  direccion: "COMPRA",
  createdAt: new Date("2026-11-13T12:00:00.000Z"),
  confirmadoAt: null,
  resultados: [],
  revisiones: [],
};

function createService() {
  const prisma = {
    notebook: {
      findFirst: vi.fn().mockResolvedValue({
        idNotebook,
        idEmpresa: identity.idEmpresa,
        nombre: "Compras",
        descripcion: null,
        icono: null,
        paletaColores: null,
        createdAt: new Date("2026-11-01T12:00:00.000Z"),
        updatedAt: new Date("2026-11-01T12:00:00.000Z"),
        _count: { documentos: 120 },
      }),
    },
    documento: {
      count: vi.fn().mockResolvedValue(120),
      findMany: vi.fn().mockImplementation(({ distinct }) => Promise.resolve(distinct ? [{ idLote: documento.idLote }] : [documento])),
    },
  };
  return { service: new NotebookService(prisma as unknown as PrismaClient, "/tmp"), prisma };
}

describe("NotebookService documentos paginados", () => {
  it("devuelve 50 documentos por página y busca en todo el notebook", async () => {
    const { service, prisma } = createService();

    const result = await service.get(identity, idNotebook, { pagina: "2", buscar: "proveedor" });

    expect(result).toMatchObject({ total: 120, pagina: 2, hayMas: true, totalDocumentos: 120, lotesPendientes: [documento.idLote] });
    const pageCall = prisma.documento.findMany.mock.calls.map(([args]) => args).find((args) => !args.distinct);
    expect(pageCall).toMatchObject({ skip: 50, take: 50 });
    expect(pageCall.where.AND[0].OR).toEqual(expect.arrayContaining([
      expect.objectContaining({ revisiones: expect.anything() }),
      expect.objectContaining({ resultados: expect.anything() }),
    ]));
  });

  it("limita la tabla a documentos procesados cuando no hay filtros", async () => {
    const { service, prisma } = createService();

    await service.get(identity, idNotebook);

    const pageCall = prisma.documento.findMany.mock.calls.map(([args]) => args).find((args) => !args.distinct);
    expect(pageCall).toMatchObject({
      where: { idEmpresa: identity.idEmpresa, idNotebook, estado: { in: ["PENDIENTE_REVISION", "CONFIRMADO"] } },
      skip: 0,
      take: 50,
    });
  });
});
