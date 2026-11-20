import path from "node:path";
import type { Prisma, PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../shared/errors/app-error.js";
import { deleteFilesWithRecords } from "./file-deletion.js";
import { createNotebookSchema, notebookDocumentsQuerySchema } from "./module1.schemas.js";
import type { Module1Identity } from "./module1.types.js";

const DOCUMENTOS_POR_PAGINA = 50;
const ESTADOS_EXISTENTES = ["PENDIENTE_REVISION", "CONFIRMADO"] as const;
const ESTADOS_EN_COLA = ["PENDIENTE", "PROCESANDO", "ERROR"] as const;
const ETIQUETAS_ESTADO = {
  PENDIENTE_REVISION: "pendiente de confirmacion",
  CONFIRMADO: "confirmado",
} as const;

function normalizar(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function fechaBuscada(value: string) {
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const dmy = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
  const [year, month, day] = iso
    ? [Number(iso[1]), Number(iso[2]), Number(iso[3])]
    : dmy
      ? [Number(dmy[3]), Number(dmy[2]), Number(dmy[1])]
      : [];
  if (!year || !month || !day) return null;
  const fecha = new Date(Date.UTC(year, month - 1, day));
  return fecha.getUTCFullYear() === year && fecha.getUTCMonth() === month - 1 && fecha.getUTCDate() === day
    ? fecha
    : null;
}

function documentosWhere(
  idEmpresa: string,
  idNotebook: string,
  filtros: ReturnType<typeof notebookDocumentsQuerySchema.parse>,
): Prisma.DocumentoWhereInput {
  const where: Prisma.DocumentoWhereInput = {
    idEmpresa,
    idNotebook,
    estado: filtros.estado ?? { in: [...ESTADOS_EXISTENTES] },
  };
  const condiciones: Prisma.DocumentoWhereInput[] = [];

  if (filtros.proveedor) {
    condiciones.push({
      OR: [
        { revisiones: { some: { estado: "CONFIRMADA", emisorRazonSocial: filtros.proveedor } } },
        { resultados: { some: { emisorRazonSocial: filtros.proveedor } } },
      ],
    });
  }

  if (filtros.estadoPago) {
    // Solo cuentan las revisiones confirmadas; así coincide con la métrica pagos_pendientes del dashboard.
    condiciones.push({ revisiones: { some: { estado: "CONFIRMADA", estadoPago: filtros.estadoPago } } });
  }

  if (filtros.buscar) {
    const contiene = { contains: filtros.buscar, mode: "insensitive" as const };
    const fecha = fechaBuscada(filtros.buscar);
    const estados = ESTADOS_EXISTENTES.filter((estado) =>
      normalizar(ETIQUETAS_ESTADO[estado]).includes(normalizar(filtros.buscar!)),
    );
    condiciones.push({
      OR: [
        { revisiones: { some: { estado: "CONFIRMADA", OR: [
          { folio: contiene },
          { emisorRazonSocial: contiene },
          { emisorRut: contiene },
          { estadoPago: contiene },
        ] } } },
        { resultados: { some: { OR: [
          { folio: contiene },
          { emisorRazonSocial: contiene },
          { emisorRut: contiene },
        ] } } },
        ...(fecha ? [
          { revisiones: { some: { estado: "CONFIRMADA" as const, fechaEmision: fecha } } },
          { resultados: { some: { fechaEmision: fecha } } },
        ] : []),
        ...(estados.length ? [{ estado: { in: [...estados] } }] : []),
      ],
    });
  }

  if (condiciones.length) where.AND = condiciones;
  return where;
}

export class NotebookService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly storagePath: string,
  ) {}

  async create(identity: Module1Identity, input: unknown) {
    const data = createNotebookSchema.parse(input);
    const exists = await this.prisma.notebook.findFirst({
      where: {
        idEmpresa: identity.idEmpresa,
        nombre: { equals: data.nombre, mode: "insensitive" },
      },
    });
    if (exists) {
      throw new AppError(
        409,
        "NOTEBOOK_NAME_TAKEN",
        "Ya existe un notebook con ese nombre",
      );
    }
    return this.prisma.notebook.create({
      data: {
        idEmpresa: identity.idEmpresa,
        creadoPorId: identity.idUsuario,
        ...data,
      },
    });
  }

  async update(identity: Module1Identity, idNotebook: string, input: unknown) {
    const data = createNotebookSchema.parse(input);
    const notebook = await this.prisma.notebook.findFirst({
      where: { idNotebook, idEmpresa: identity.idEmpresa },
    });
    if (!notebook) {
      throw new AppError(404, "NOTEBOOK_NOT_FOUND", "Notebook no encontrado");
    }
    const exists = await this.prisma.notebook.findFirst({
      where: {
        idEmpresa: identity.idEmpresa,
        nombre: { equals: data.nombre, mode: "insensitive" },
        NOT: { idNotebook },
      },
    });
    if (exists) {
      throw new AppError(
        409,
        "NOTEBOOK_NAME_TAKEN",
        "Ya existe un notebook con ese nombre",
      );
    }
    return this.prisma.notebook.update({ where: { idNotebook }, data });
  }

  async delete(identity: Module1Identity, idNotebook: string) {
    const notebook = await this.prisma.notebook.findFirst({
      where: { idNotebook, idEmpresa: identity.idEmpresa },
      include: { documentos: { include: { archivo: true } } },
    });
    if (!notebook) {
      throw new AppError(404, "NOTEBOOK_NOT_FOUND", "Notebook no encontrado");
    }
    const filePaths = notebook.documentos.flatMap((document) =>
      document.archivo?.storageKey
        ? [path.resolve(this.storagePath, document.archivo.storageKey)]
        : [],
    );
    await deleteFilesWithRecords(filePaths, () =>
      this.prisma.$transaction(async (tx) => {
        await tx.documento.deleteMany({
          where: { idEmpresa: identity.idEmpresa, idNotebook },
        });
        await tx.loteProcesamiento.deleteMany({
          where: { idEmpresa: identity.idEmpresa, idNotebook },
        });
        await tx.notebook.delete({ where: { idNotebook } });
      }),
    );
    return { idNotebook, eliminado: true };
  }

  list(identity: Module1Identity) {
    return this.prisma.notebook.findMany({
      where: { idEmpresa: identity.idEmpresa },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { documentos: true } } },
    });
  }

  async get(identity: Module1Identity, idNotebook: string, query: unknown = {}) {
    const filtros = notebookDocumentsQuerySchema.parse(query);
    const where = documentosWhere(identity.idEmpresa, idNotebook, filtros);
    const [notebook, total, documentos, enCola] = await Promise.all([
      this.prisma.notebook.findFirst({
        where: { idNotebook, idEmpresa: identity.idEmpresa },
        include: { _count: { select: { documentos: true } } },
      }),
      this.prisma.documento.count({ where }),
      this.prisma.documento.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { idDocumento: "desc" }],
        skip: (filtros.pagina - 1) * DOCUMENTOS_POR_PAGINA,
        take: DOCUMENTOS_POR_PAGINA,
        include: {
          resultados: { orderBy: { idResultado: "desc" }, take: 1 },
          revisiones: {
            where: { estado: "CONFIRMADA" },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      }),
      this.prisma.documento.findMany({
        where: { idEmpresa: identity.idEmpresa, idNotebook, estado: { in: [...ESTADOS_EN_COLA] } },
        distinct: ["idLote"],
        select: { idLote: true },
      }),
    ]);
    if (!notebook) {
      throw new AppError(404, "NOTEBOOK_NOT_FOUND", "Notebook no encontrado");
    }
    const { _count, ...detalle } = notebook;
    return {
      ...detalle,
      documentos: documentos.map(({ resultados, revisiones, ...documento }) => {
        const resultado = resultados[0];
        const revision = revisiones[0];
        return {
          ...documento,
          folio: revision?.folio ?? resultado?.folio ?? null,
          proveedor:
            revision?.emisorRazonSocial ?? resultado?.emisorRazonSocial ?? null,
          rutEmisor: revision?.emisorRut ?? resultado?.emisorRut ?? null,
          fechaEmision:
            revision?.fechaEmision ?? resultado?.fechaEmision ?? null,
          estadoPago: revision?.estadoPago ?? null,
        };
      }),
      totalDocumentos: _count.documentos,
      total,
      pagina: filtros.pagina,
      hayMas: filtros.pagina * DOCUMENTOS_POR_PAGINA < total,
      lotesPendientes: enCola.map((documento) => documento.idLote),
    };
  }
}
