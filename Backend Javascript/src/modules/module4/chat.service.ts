import { z } from "zod";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../shared/errors/app-error.js";
import type { Module1Identity } from "../module1/module1.types.js";
import { ejecutarConsultaChat } from "./chat.sql.js";
import type { ChatAssistant } from "./gemini.chat.js";

const preguntaSchema = z.object({ pregunta: z.string().trim().min(1).max(1000) });
const mensajeSelect = { idMensaje: true, rol: true, contenido: true, createdAt: true } as const;
const FUERA_DE_CONTEXTO = "Solo puedo ayudarte con la gestión y las finanzas de tu negocio a partir de los documentos de este notebook. Por ejemplo: \"¿En qué proveedor gastamos más?\" o \"¿Cómo puedo reducir mis gastos?\"";
const SIN_RESULTADOS = "No encontré documentos confirmados en este notebook que respondan a esa pregunta.";

export class ChatService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly assistant: ChatAssistant,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async historial(identity: Module1Identity, idNotebook: string) {
    await this.findNotebook(identity, idNotebook);
    return this.prisma.mensajeChat.findMany({ where: { idEmpresa: identity.idEmpresa, idNotebook, idUsuario: identity.idUsuario }, orderBy: { createdAt: "asc" }, select: mensajeSelect });
  }

  async enviar(identity: Module1Identity, idNotebook: string, input: unknown) {
    const { pregunta } = preguntaSchema.parse(input);
    await this.findNotebook(identity, idNotebook);
    const recientes = await this.prisma.mensajeChat.findMany({ where: { idEmpresa: identity.idEmpresa, idNotebook, idUsuario: identity.idUsuario }, orderBy: { createdAt: "desc" }, take: 6, select: { rol: true, contenido: true } });
    const plan = await this.assistant.planificar(pregunta, recientes.reverse(), this.now().toISOString().slice(0, 10));
    let respuesta = FUERA_DE_CONTEXTO;
    if (plan.tipo === "CONSEJO") {
      const filas = plan.sql ? await ejecutarConsultaChat(this.prisma, identity, idNotebook, plan.sql) : [];
      respuesta = await this.assistant.redactar(pregunta, filas, "CONSEJO");
    } else if (plan.tipo === "SQL" && plan.sql) {
      const filas = await ejecutarConsultaChat(this.prisma, identity, idNotebook, plan.sql);
      respuesta = filas.length ? await this.assistant.redactar(pregunta, filas, "SQL") : SIN_RESULTADOS;
    }
    const base = { idEmpresa: identity.idEmpresa, idNotebook, idUsuario: identity.idUsuario };
    const createdAt = this.now();
    return this.prisma.$transaction([
      this.prisma.mensajeChat.create({ data: { ...base, rol: "USUARIO", contenido: pregunta, createdAt }, select: mensajeSelect }),
      // +1 ms para que el orden por fecha sea estable entre la pregunta y su respuesta.
      this.prisma.mensajeChat.create({ data: { ...base, rol: "ASISTENTE", contenido: respuesta, sqlGenerado: plan.sql, createdAt: new Date(createdAt.getTime() + 1) }, select: mensajeSelect }),
    ]);
  }

  async reiniciar(identity: Module1Identity, idNotebook: string) {
    await this.findNotebook(identity, idNotebook);
    await this.prisma.mensajeChat.deleteMany({ where: { idEmpresa: identity.idEmpresa, idNotebook, idUsuario: identity.idUsuario } });
    return { idNotebook, eliminado: true };
  }

  private async findNotebook(identity: Module1Identity, idNotebook: string) {
    const notebook = await this.prisma.notebook.findFirst({ where: { idNotebook, idEmpresa: identity.idEmpresa }, select: { idNotebook: true } });
    if (!notebook) throw new AppError(404, "NOTEBOOK_NOT_FOUND", "Notebook no encontrado");
  }
}
