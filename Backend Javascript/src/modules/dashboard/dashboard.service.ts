import type { PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../shared/errors/app-error.js";
import type { Module1Identity } from "../module1/module1.types.js";
import type { WidgetPlanner } from "./dashboard.ai.js";
import { ejecutarMetrica, type Filtros, type Metrica } from "./dashboard.metrics.js";
import { consultaSchema, filtrosSchema, sugerenciaSchema, widgetInputSchema, widgetUpdateSchema } from "./dashboard.schemas.js";

export class DashboardService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly planner: WidgetPlanner,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async list(identity: Module1Identity, idNotebook: string) {
    await this.findNotebook(identity, idNotebook);
    const widgets = await this.prisma.dashboardWidget.findMany({
      where: { idEmpresa: identity.idEmpresa, idNotebook },
      orderBy: [{ orden: "asc" }, { createdAt: "asc" }],
    });
    return this.conDatos(identity, idNotebook, widgets);
  }

  async create(identity: Module1Identity, idNotebook: string, input: unknown) {
    const data = widgetInputSchema.parse(input);
    await this.findNotebook(identity, idNotebook);
    const widget = await this.prisma.dashboardWidget.create({
      data: { idEmpresa: identity.idEmpresa, idNotebook, creadoPorId: identity.idUsuario, ...data },
    });
    const [resultado] = await this.conDatos(identity, idNotebook, [widget]);
    return resultado;
  }

  async update(identity: Module1Identity, idWidget: string, input: unknown) {
    const data = widgetUpdateSchema.parse(input);
    const widget = await this.findWidget(identity, idWidget);
    const updated = await this.prisma.dashboardWidget.update({ where: { idWidget }, data });
    const [resultado] = await this.conDatos(identity, widget.idNotebook, [updated]);
    return resultado;
  }

  async remove(identity: Module1Identity, idWidget: string) {
    await this.findWidget(identity, idWidget);
    await this.prisma.dashboardWidget.delete({ where: { idWidget } });
    return { idWidget, eliminado: true };
  }

  async consultar(identity: Module1Identity, idNotebook: string, input: unknown) {
    const { metrica, filtros } = consultaSchema.parse(input);
    await this.findNotebook(identity, idNotebook);
    return { metrica, filtros, datos: await this.datos(identity, idNotebook, metrica, filtros), actualizadoEn: this.now().toISOString() };
  }

  async sugerir(identity: Module1Identity, idNotebook: string, input: unknown) {
    const { pregunta } = sugerenciaSchema.parse(input);
    await this.findNotebook(identity, idNotebook);
    const spec = await this.planner.planificar(pregunta);
    return { ...spec, datos: await this.datos(identity, idNotebook, spec.metrica, spec.filtros), actualizadoEn: this.now().toISOString() };
  }

  private conDatos<T extends { metrica: string; filtros: unknown }>(identity: Module1Identity, idNotebook: string, widgets: T[]) {
    return Promise.all(
      widgets.map(async (widget) => {
        // Strip legacy date keys from persisted widget JSON; date ranges are no longer supported.
        const filtros = filtrosSchema.strip().parse(widget.filtros);
        return {
          ...widget,
          filtros,
          datos: await this.datos(identity, idNotebook, widget.metrica as Metrica, filtros),
          actualizadoEn: this.now().toISOString(),
        };
      }),
    );
  }

  private datos(identity: Module1Identity, idNotebook: string, metrica: Metrica, filtros: Filtros) {
    return ejecutarMetrica(this.prisma, { idEmpresa: identity.idEmpresa, idNotebook, metrica, filtros });
  }

  private async findNotebook(identity: Module1Identity, idNotebook: string) {
    const notebook = await this.prisma.notebook.findFirst({ where: { idNotebook, idEmpresa: identity.idEmpresa }, select: { idNotebook: true } });
    if (!notebook) throw new AppError(404, "NOTEBOOK_NOT_FOUND", "Notebook no encontrado");
  }

  private async findWidget(identity: Module1Identity, idWidget: string) {
    const widget = await this.prisma.dashboardWidget.findFirst({ where: { idWidget, idEmpresa: identity.idEmpresa } });
    if (!widget) throw new AppError(404, "WIDGET_NOT_FOUND", "Widget no encontrado");
    return widget;
  }
}
