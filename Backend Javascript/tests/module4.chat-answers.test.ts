import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PrismaClient } from "../src/generated/prisma/client.js";
import { ChatService } from "../src/modules/module4/chat.service.js";
import { respuestaLocal } from "../src/modules/module4/chat.format.js";
import type { ChatAssistant, PlanConsulta } from "../src/modules/module4/gemini.chat.js";

vi.mock("../src/modules/module4/chat.sql.js", () => ({
  ejecutarConsultaChat: vi.fn(),
}));

import { ejecutarConsultaChat } from "../src/modules/module4/chat.sql.js";

const ejecutarConsulta = vi.mocked(ejecutarConsultaChat);

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
  createdAt: new Date("2026-11-19T12:00:00.000Z"),
  updatedAt: new Date("2026-11-19T12:00:00.000Z"),
};

function createService(options: { plan: PlanConsulta; filas?: Record<string, unknown>[]; redactado?: string }) {
  const assistant: ChatAssistant = {
    planificar: vi.fn().mockResolvedValue(options.plan),
    redactar: vi.fn().mockResolvedValue(options.redactado ?? "respuesta redactada"),
  };
  const prisma = {
    conversacionChat: {
      findFirst: vi.fn().mockResolvedValue(conversation),
      update: vi.fn().mockImplementation(({ data }) => Promise.resolve({ ...conversation, ...data })),
    },
    mensajeChat: {
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockImplementation(({ data }) => Promise.resolve({ idMensaje: conversation.idConversacion, ...data })),
    },
    $transaction: vi.fn((operations: Promise<unknown>[]) => Promise.all(operations)),
  };
  const service = new ChatService(
    prisma as unknown as PrismaClient,
    assistant,
    () => new Date("2026-11-19T12:00:00.000Z"),
  );
  return { service, assistant, prisma };
}

function respuestaDe(mensajes: Array<{ rol: string; contenido: string }>) {
  return mensajes.find((mensaje) => mensaje.rol === "ASISTENTE")?.contenido;
}

beforeEach(() => {
  ejecutarConsulta.mockReset();
});

describe("ChatService respuestas rápidas", () => {
  it("responde sin una segunda llamada a la IA cuando el SQL devuelve una sola fila", async () => {
    ejecutarConsulta.mockResolvedValue([{ total_gastos: "76493200" }]);
    const { service, assistant } = createService({ plan: { tipo: "SQL", sql: "SELECT SUM(total) AS total_gastos FROM v_chat_documentos" } });

    const resultado = await service.enviar(identity, conversation.idConversacion, { pregunta: "¿Cuánto gastamos en total?" });

    expect(respuestaDe(resultado.mensajes)).toBe("Total gastos: $76.493.200");
    expect(assistant.redactar).not.toHaveBeenCalled();
    expect(assistant.planificar).toHaveBeenCalledTimes(1);
  });

  it("delega en la IA cuando el resultado tiene varias filas", async () => {
    const filas = [{ proveedor: "A SpA", total: "1000" }, { proveedor: "B SpA", total: "2000" }];
    ejecutarConsulta.mockResolvedValue(filas);
    const { service, assistant } = createService({ plan: { tipo: "SQL", sql: "SELECT emisor_razon_social AS proveedor, total FROM v_chat_documentos" } });

    const resultado = await service.enviar(identity, conversation.idConversacion, { pregunta: "¿Cuánto gastamos por proveedor?" });

    expect(respuestaDe(resultado.mensajes)).toBe("respuesta redactada");
    expect(assistant.redactar).toHaveBeenCalledWith("¿Cuánto gastamos por proveedor?", filas, "SQL");
  });

  it("siempre redacta con IA los consejos, aunque haya una sola fila", async () => {
    const filas = [{ total_gastos: "76493200" }];
    ejecutarConsulta.mockResolvedValue(filas);
    const { service, assistant } = createService({ plan: { tipo: "CONSEJO", sql: "SELECT SUM(total) AS total_gastos FROM v_chat_documentos" } });

    const resultado = await service.enviar(identity, conversation.idConversacion, { pregunta: "¿Cómo reduzco mis gastos?" });

    expect(respuestaDe(resultado.mensajes)).toBe("respuesta redactada");
    expect(assistant.redactar).toHaveBeenCalledWith("¿Cómo reduzco mis gastos?", filas, "CONSEJO");
  });

  it("no inventa una respuesta cuando el SQL devuelve una fila vacía", async () => {
    ejecutarConsulta.mockResolvedValue([{ total_gastos: null }]);
    const { service, assistant } = createService({ plan: { tipo: "SQL", sql: "SELECT SUM(total) AS total_gastos FROM v_chat_documentos" } });

    const resultado = await service.enviar(identity, conversation.idConversacion, { pregunta: "¿Cuánto gastamos en total?" });

    expect(respuestaDe(resultado.mensajes)).toContain("No hay datos suficientes");
    expect(assistant.redactar).not.toHaveBeenCalled();
  });

  it("reutiliza el plan de una pregunta idéntica en el mismo contexto", async () => {
    ejecutarConsulta.mockResolvedValue([{ total_gastos: "76493200" }]);
    const { service, assistant } = createService({ plan: { tipo: "SQL", sql: "SELECT SUM(total) AS total_gastos FROM v_chat_documentos" } });

    await service.enviar(identity, conversation.idConversacion, { pregunta: "¿Cuánto gastamos en total?" });
    await service.enviar(identity, conversation.idConversacion, { pregunta: "¿Cuánto gastamos en total?" });

    expect(assistant.planificar).toHaveBeenCalledTimes(1);
    expect(ejecutarConsulta).toHaveBeenCalledTimes(2);
  });
});

describe("respuestaLocal", () => {
  it("formatea montos, fechas y textos legibles", () => {
    expect(respuestaLocal([{ total_gastos: "76493200" }])).toBe("Total gastos: $76.493.200");
    expect(respuestaLocal([{ proveedor: "Asesorías del Pacífico SpA", total_comprado: "20979700" }])).toBe("Proveedor: Asesorías del Pacífico SpA · Total comprado: $20.979.700");
    expect(respuestaLocal([{ fecha_emision: "2026-11-19T00:00:00.000Z", cantidad: "3" }])).toBe("Fecha emision: 19/11/2026 · Cantidad: 3");
  });

  it("no interpreta como número un folio ni inventa datos ausentes", () => {
    expect(respuestaLocal([{ folio: "2026" }])).toBe("Folio: 2026");
    expect(respuestaLocal([{ proveedor: null, total_gastos: "10" }])).toBe("Proveedor: sin dato · Total gastos: $10");
  });

  it("solo responde localmente una fila con pocas columnas", () => {
    expect(respuestaLocal([])).toBeNull();
    expect(respuestaLocal([{ total: null }])).toBeNull();
    expect(respuestaLocal([{ total: "1" }, { total: "2" }])).toBeNull();
    expect(respuestaLocal([{ a: "1", b: "2", c: "3", d: "4", e: "5", f: "6", g: "7" }])).toBeNull();
  });
});
