import type { PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../shared/errors/app-error.js";
import type { Module1Identity } from "../module1/module1.types.js";
import { ejecutarMetrica, type Filtros, type Metrica } from "./dashboard.metrics.js";
import { consultaSchema } from "./dashboard.schemas.js";

export class DashboardService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async consultar(identity: Module1Identity, idNotebook: string, input: unknown) {
    const { metrica, filtros } = consultaSchema.parse(input);
    await this.findNotebook(identity, idNotebook);
    return { metrica, filtros, datos: await this.datos(identity, idNotebook, metrica, filtros), actualizadoEn: this.now().toISOString() };
  }

  private datos(identity: Module1Identity, idNotebook: string, metrica: Metrica, filtros: Filtros) {
    return ejecutarMetrica(this.prisma, { idEmpresa: identity.idEmpresa, idNotebook, metrica, filtros });
  }

  private async findNotebook(identity: Module1Identity, idNotebook: string) {
    const notebook = await this.prisma.notebook.findFirst({ where: { idNotebook, idEmpresa: identity.idEmpresa }, select: { idNotebook: true } });
    if (!notebook) throw new AppError(404, "NOTEBOOK_NOT_FOUND", "Notebook no encontrado");
  }
}
