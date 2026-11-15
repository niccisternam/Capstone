import { z } from "zod";
import type { PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../shared/errors/app-error.js";
import type { Module1Identity } from "../module1/module1.types.js";
import { ejecutarConsultaChat } from "./chat.sql.js";
import type { ChatAssistant } from "./gemini.chat.js";

const preguntaSchema = z.object({ pregunta: z.string().trim().min(1).max(1000) });
const conversacionInputSchema = z.object({ titulo: z.string().trim().min(1).max(120).optional() });
const paginaSchema = z.coerce.number().int().min(1).max(1000);
const identifierSchema = z.string().uuid();
const mensajeSelect = { idMensaje: true, rol: true, contenido: true, createdAt: true } as const;
const conversacionSelect = { idConversacion: true, titulo: true, createdAt: true, updatedAt: true } as const;
const TITULO_NUEVO = "Nueva conversación";
const FUERA_DE_CONTEXTO = "Solo puedo ayudarte con la gestión y las finanzas de tu negocio a partir de los documentos de este notebook. Por ejemplo: \"¿En qué proveedor gastamos más?\" o \"¿Cómo puedo reducir mis gastos?\"";
const SIN_RESULTADOS = "No hay datos suficientes para responder a tu pregunta. Por favor, revisa los documentos de este notebook o haz otra pregunta.";
const CONVERSACIONES_POR_PAGINA = 20;
const MAX_CONVERSACIONES = 50;
const MENSAJES_POR_PAGINA = 50;
export const normalizarPregunta = (texto: string) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();

export class ChatService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly assistant: ChatAssistant,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async listar(identity: Module1Identity, idNotebook: string, inputPagina: unknown = 1) {
    const pagina = paginaSchema.parse(inputPagina);
    await this.findNotebook(identity, idNotebook);
    const where = { idEmpresa: identity.idEmpresa, idNotebook, idUsuario: identity.idUsuario };
    const [total, conversaciones] = await Promise.all([
      this.prisma.conversacionChat.count({ where }),
      this.prisma.conversacionChat.findMany({
        where,
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        skip: (pagina - 1) * CONVERSACIONES_POR_PAGINA,
        take: CONVERSACIONES_POR_PAGINA,
        select: conversacionSelect,
      }),
    ]);
    return { conversaciones, total, pagina, hayMas: pagina * CONVERSACIONES_POR_PAGINA < total };
  }

  async crear(identity: Module1Identity, idNotebook: string, input: unknown) {
    const { titulo = TITULO_NUEVO } = conversacionInputSchema.parse(input ?? {});
    await this.findNotebook(identity, idNotebook);
    const where = { idEmpresa: identity.idEmpresa, idNotebook, idUsuario: identity.idUsuario };
    const borrador = await this.prisma.conversacionChat.findFirst({
      where: { ...where, mensajes: { none: {} } },
      orderBy: { createdAt: "desc" },
      select: conversacionSelect,
    });
    if (borrador) return borrador;
    if (await this.prisma.conversacionChat.count({ where }) >= MAX_CONVERSACIONES) {
      throw new AppError(409, "CHAT_CONVERSATION_LIMIT", "Alcanzaste el límite de 50 conversaciones para este notebook. Elimina una para crear otra.");
    }
    return this.prisma.conversacionChat.create({
      data: { ...where, titulo },
      select: conversacionSelect,
    });
  }

  async historial(identity: Module1Identity, idConversacion: string, cursorInput?: unknown) {
    const cursor = cursorInput === undefined ? undefined : identifierSchema.parse(cursorInput);
    await this.findConversacion(identity, idConversacion);
    const args: {
      where: { idConversacion: string };
      orderBy: [{ createdAt: "desc" }, { idMensaje: "desc" }];
      take: number;
      select: typeof mensajeSelect;
      cursor?: { idMensaje: string };
      skip?: number;
    } = {
      where: { idConversacion },
      orderBy: [{ createdAt: "desc" }, { idMensaje: "desc" }],
      take: MENSAJES_POR_PAGINA + 1,
      select: mensajeSelect,
    };
    if (cursor !== undefined) {
      const ancla = await this.prisma.mensajeChat.findFirst({ where: { idMensaje: cursor, idConversacion }, select: { idMensaje: true } });
      if (!ancla) throw new AppError(400, "INVALID_CHAT_CURSOR", "El cursor del historial no es válido");
      args.cursor = { idMensaje: cursor };
      args.skip = 1;
    }
    const filas = await this.prisma.mensajeChat.findMany(args);
    const hayMas = filas.length > MENSAJES_POR_PAGINA;
    return { mensajes: filas.slice(0, MENSAJES_POR_PAGINA).reverse(), hayMas };
  }

  async enviar(identity: Module1Identity, idConversacion: string, input: unknown) {
    const { pregunta } = preguntaSchema.parse(input);
    const conversacion = await this.findConversacion(identity, idConversacion);
    const recientes = await this.prisma.mensajeChat.findMany({
      where: { idConversacion },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: { rol: true, contenido: true },
    });
    const historial = recientes.reverse();
    const preguntaRepetida = historial.findIndex((mensaje, indice) => mensaje.rol === "USUARIO" && normalizarPregunta(mensaje.contenido) === normalizarPregunta(pregunta) && historial[indice + 1]?.rol === "ASISTENTE");
    const createdAt = this.now();

    if (preguntaRepetida >= 0) {
      const [usuario, asistente, conversacionActualizada] = await this.prisma.$transaction([
        this.prisma.mensajeChat.create({ data: { idConversacion, rol: "USUARIO", contenido: pregunta, createdAt }, select: mensajeSelect }),
        this.prisma.mensajeChat.create({ data: { idConversacion, rol: "ASISTENTE", contenido: historial[preguntaRepetida + 1]!.contenido, createdAt: new Date(createdAt.getTime() + 1) }, select: mensajeSelect }),
        this.prisma.conversacionChat.update({ where: { idConversacion }, data: { updatedAt: createdAt }, select: conversacionSelect }),
      ]);
      return { mensajes: [usuario, asistente], conversacion: conversacionActualizada };
    }

    const plan = await this.assistant.planificar(pregunta, historial.slice(-6), this.now().toISOString().slice(0, 10));
    let respuesta = FUERA_DE_CONTEXTO;
    if (plan.tipo === "CONSEJO") {
      const filas = plan.sql ? await ejecutarConsultaChat(this.prisma, identity, conversacion.idNotebook, plan.sql) : [];
      respuesta = await this.assistant.redactar(pregunta, filas, "CONSEJO");
    } else if (plan.tipo === "SQL" && plan.sql) {
      const filas = await ejecutarConsultaChat(this.prisma, identity, conversacion.idNotebook, plan.sql);
      respuesta = filas.length ? await this.assistant.redactar(pregunta, filas, "SQL") : SIN_RESULTADOS;
    }

    const titulo = recientes.length === 0 && conversacion.titulo === TITULO_NUEVO
      ? pregunta.slice(0, 80)
      : undefined;
    const [usuario, asistente, conversacionActualizada] = await this.prisma.$transaction([
      this.prisma.mensajeChat.create({ data: { idConversacion, rol: "USUARIO", contenido: pregunta, createdAt }, select: mensajeSelect }),
      // +1 ms para que el orden por fecha sea estable entre la pregunta y su respuesta.
      this.prisma.mensajeChat.create({ data: { idConversacion, rol: "ASISTENTE", contenido: respuesta, sqlGenerado: plan.sql, createdAt: new Date(createdAt.getTime() + 1) }, select: mensajeSelect }),
      this.prisma.conversacionChat.update({ where: { idConversacion }, data: { updatedAt: createdAt, ...(titulo ? { titulo } : {}) }, select: conversacionSelect }),
    ]);
    return { mensajes: [usuario, asistente], conversacion: conversacionActualizada };
  }

  async eliminar(identity: Module1Identity, idConversacion: string) {
    await this.findConversacion(identity, idConversacion);
    await this.prisma.conversacionChat.delete({ where: { idConversacion } });
    return { idConversacion, eliminado: true };
  }

  private async findNotebook(identity: Module1Identity, idNotebook: string) {
    identifierSchema.parse(idNotebook);
    const notebook = await this.prisma.notebook.findFirst({ where: { idNotebook, idEmpresa: identity.idEmpresa }, select: { idNotebook: true } });
    if (!notebook) throw new AppError(404, "NOTEBOOK_NOT_FOUND", "Notebook no encontrado");
  }

  private async findConversacion(identity: Module1Identity, idConversacion: string) {
    identifierSchema.parse(idConversacion);
    const conversacion = await this.prisma.conversacionChat.findFirst({
      where: { idConversacion, idEmpresa: identity.idEmpresa, idUsuario: identity.idUsuario },
      select: { ...conversacionSelect, idEmpresa: true, idNotebook: true, idUsuario: true },
    });
    if (!conversacion) throw new AppError(404, "CONVERSATION_NOT_FOUND", "Conversación no encontrada");
    return conversacion;
  }
}
