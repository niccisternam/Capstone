import { describe, expect, it, vi } from "vitest";
import type { PrismaClient } from "../src/generated/prisma/client.js";
import { ChatService } from "../src/modules/module4/chat.service.js";
import type { ChatAssistant } from "../src/modules/module4/gemini.chat.js";

const identity = {
  idEmpresa: "0a000000-0000-4000-8000-000000000001",
  idUsuario: "0b000000-0000-4000-8000-000000000001",
};
const conversation = {
  idConversacion: "0c000000-0000-4000-8000-000000000001",
  idEmpresa: identity.idEmpresa,
  idNotebook: "0d000000-0000-4000-8000-000000000001",
  idUsuario: identity.idUsuario,
  titulo: "Nueva conversación",
  createdAt: new Date("2026-11-13T12:00:00.000Z"),
  updatedAt: new Date("2026-11-13T12:00:00.000Z"),
};
const message = {
  idMensaje: "0e000000-0000-4000-8000-000000000001",
  rol: "USUARIO",
  contenido: "Pregunta anterior",
  createdAt: new Date("2026-11-13T11:59:00.000Z"),
};
const assistant: ChatAssistant = {
  planificar: vi.fn().mockResolvedValue({ tipo: "FUERA_DE_CONTEXTO", sql: null }),
  redactar: vi.fn(),
};

function createService(options: {
  conversationExists?: boolean;
  emptyConversation?: boolean;
  conversationCount?: number;
  messages?: typeof message[];
  cursorExists?: boolean;
} = {}) {
  const prisma = {
    notebook: { findFirst: vi.fn().mockResolvedValue({ idNotebook: conversation.idNotebook }) },
    conversacionChat: {
      findMany: vi.fn().mockResolvedValue([conversation]),
      findFirst: vi.fn().mockImplementation(({ where }) => Promise.resolve(
        where.mensajes ? (options.emptyConversation ? conversation : null) : (options.conversationExists === false ? null : conversation),
      )),
      count: vi.fn().mockResolvedValue(options.conversationCount ?? 1),
      create: vi.fn().mockResolvedValue(conversation),
      update: vi.fn().mockImplementation(({ data }) => Promise.resolve({ ...conversation, ...data })),
      delete: vi.fn().mockResolvedValue(conversation),
    },
    mensajeChat: {
      findMany: vi.fn().mockResolvedValue(options.messages ?? []),
      findFirst: vi.fn().mockResolvedValue(options.cursorExists === false ? null : { idMensaje: message.idMensaje }),
      create: vi.fn().mockImplementation(({ data }) => Promise.resolve({ idMensaje: message.idMensaje, ...data })),
    },
    $transaction: vi.fn((operations: Promise<unknown>[]) => Promise.all(operations)),
  };
  return { service: new ChatService(prisma as unknown as PrismaClient, assistant), prisma };
}

describe("ChatService conversations", () => {
  it("lists conversations privately in pages of 20", async () => {
    const { service, prisma } = createService();

    await expect(service.listar(identity, conversation.idNotebook, "2")).resolves.toEqual({
      conversaciones: [conversation],
      total: 1,
      pagina: 2,
      hayMas: false,
    });
    expect(prisma.conversacionChat.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { idEmpresa: identity.idEmpresa, idNotebook: conversation.idNotebook, idUsuario: identity.idUsuario },
      skip: 20,
      take: 20,
    }));
  });

  it("does not expose a conversation belonging to another user", async () => {
    const { service, prisma } = createService({ conversationExists: false });

    await expect(service.historial(identity, conversation.idConversacion)).rejects.toMatchObject({
      status: 404,
      code: "CONVERSATION_NOT_FOUND",
    });
    expect(prisma.conversacionChat.findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: { idConversacion: conversation.idConversacion, idEmpresa: identity.idEmpresa, idUsuario: identity.idUsuario },
    }));
  });

  it("reuses an empty conversation and blocks creation at the 50-chat limit", async () => {
    const reusable = createService({ emptyConversation: true });
    await expect(reusable.service.crear(identity, conversation.idNotebook, {})).resolves.toEqual(conversation);
    expect(reusable.prisma.conversacionChat.create).not.toHaveBeenCalled();

    const full = createService({ conversationCount: 50 });
    await expect(full.service.crear(identity, conversation.idNotebook, {})).rejects.toMatchObject({
      status: 409,
      code: "CHAT_CONVERSATION_LIMIT",
    });
  });

  it("paginates history in 50-message chunks and rejects cursors from another chat", async () => {
    const messages = Array.from({ length: 51 }, (_, index) => ({ ...message, idMensaje: `message-${50 - index}` }));
    const { service, prisma } = createService({ messages });

    const page = await service.historial(identity, conversation.idConversacion);
    expect(page.mensajes).toHaveLength(50);
    expect(page.hayMas).toBe(true);
    expect(page.mensajes[0]?.idMensaje).toBe("message-1");
    expect(page.mensajes.at(-1)?.idMensaje).toBe("message-50");
    expect(prisma.mensajeChat.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 51 }));

    const missingCursor = createService({ cursorExists: false });
    await expect(missingCursor.service.historial(identity, conversation.idConversacion, message.idMensaje)).rejects.toMatchObject({
      status: 400,
      code: "INVALID_CHAT_CURSOR",
    });
  });

  it("deletes only a conversation owned by the authenticated user", async () => {
    const { service, prisma } = createService();

    await expect(service.eliminar(identity, conversation.idConversacion)).resolves.toEqual({
      idConversacion: conversation.idConversacion,
      eliminado: true,
    });
    expect(prisma.conversacionChat.delete).toHaveBeenCalledWith({ where: { idConversacion: conversation.idConversacion } });
  });

  it("stores messages against the conversation and titles it from the first question", async () => {
    const { service, prisma } = createService();

    const result = await service.enviar(identity, conversation.idConversacion, { pregunta: "  ¿Cuánto gastamos?  " });

    expect(prisma.mensajeChat.create).toHaveBeenCalledTimes(2);
    expect(prisma.mensajeChat.create).toHaveBeenNthCalledWith(1, expect.objectContaining({
      data: expect.objectContaining({ idConversacion: conversation.idConversacion, rol: "USUARIO", contenido: "¿Cuánto gastamos?" }),
    }));
    expect(prisma.mensajeChat.create).toHaveBeenNthCalledWith(2, expect.objectContaining({
      data: expect.objectContaining({ idConversacion: conversation.idConversacion, rol: "ASISTENTE" }),
    }));
    expect(prisma.conversacionChat.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ titulo: "¿Cuánto gastamos?" }),
    }));
    expect(result.mensajes).toHaveLength(2);
    expect(result.conversacion.titulo).toBe("¿Cuánto gastamos?");
  });
});
