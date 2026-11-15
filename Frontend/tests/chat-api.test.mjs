import test from "node:test";
import assert from "node:assert/strict";
import { loadTsModule } from "./helpers/ts-module-loader.mjs";

const client = await loadTsModule("src/api/client.ts");
const api = await loadTsModule("src/api/chat.api.ts");
const idNotebook = "0a000000-0000-4000-8000-000000000001";
const idConversacion = "0b000000-0000-4000-8000-000000000001";
const idCursor = "0d000000-0000-4000-8000-000000000001";
const conversacion = {
  idConversacion,
  titulo: "Nueva conversación",
  createdAt: "2026-11-13T12:00:00.000Z",
  updatedAt: "2026-11-13T12:00:00.000Z",
};
const mensaje = {
  idMensaje: "0c000000-0000-4000-8000-000000000001",
  rol: "ASISTENTE",
  contenido: "Respuesta",
  createdAt: "2026-11-13T12:00:01.000Z",
};

test("chat API usa rutas de conversaciones de Express y valida los contratos", async () => {
  const originalFetch = globalThis.fetch;
  const llamadas = [];
  client.setAccessToken("token-chat");
  globalThis.fetch = async (url, init) => {
    llamadas.push({ url: String(url), init });
    const method = init.method ?? "GET";
    const body = method === "DELETE"
      ? { idConversacion, eliminado: true }
      : method === "POST" && String(url).includes("/mensajes")
        ? { mensajes: [mensaje], conversacion: { ...conversacion, titulo: "¿Cuánto gastamos?" } }
        : method === "POST"
          ? { conversacion }
          : String(url).includes("/mensajes")
            ? { mensajes: [mensaje], hayMas: true }
            : { conversaciones: [conversacion], total: 1, pagina: Number(new URL(url).searchParams.get("pagina")), hayMas: false };
    return new Response(JSON.stringify(body), { status: method === "POST" ? 201 : 200, headers: { "content-type": "application/json" } });
  };

  try {
    assert.deepEqual(await api.getConversaciones(idNotebook), {
      conversaciones: [conversacion], total: 1, pagina: 1, hayMas: false,
    });
    assert.deepEqual(await api.crearConversacion(idNotebook), conversacion);
    assert.deepEqual(await api.getChat(idConversacion), { mensajes: [mensaje], hayMas: true });
    assert.deepEqual(await api.getChat(idConversacion, idCursor), { mensajes: [mensaje], hayMas: true });
    assert.deepEqual(await api.sendChatMessage(idConversacion, "¿Cuánto gastamos?"), {
      mensajes: [mensaje],
      conversacion: { ...conversacion, titulo: "¿Cuánto gastamos?" },
    });
    await api.eliminarConversacion(idConversacion);

    assert.deepEqual(llamadas.map(({ url, init }) => [url, init.method ?? "GET"]), [
      [`http://localhost:3000/api/v1/module4/notebooks/${idNotebook}/conversaciones?pagina=1`, "GET"],
      [`http://localhost:3000/api/v1/module4/notebooks/${idNotebook}/conversaciones`, "POST"],
      [`http://localhost:3000/api/v1/module4/conversaciones/${idConversacion}/mensajes`, "GET"],
      [`http://localhost:3000/api/v1/module4/conversaciones/${idConversacion}/mensajes?cursor=${idCursor}`, "GET"],
      [`http://localhost:3000/api/v1/module4/conversaciones/${idConversacion}/mensajes`, "POST"],
      [`http://localhost:3000/api/v1/module4/conversaciones/${idConversacion}`, "DELETE"],
    ]);
    assert.deepEqual(JSON.parse(llamadas[4].init.body), { pregunta: "¿Cuánto gastamos?" });
    assert.equal(new Headers(llamadas[0].init.headers).get("authorization"), "Bearer token-chat");
  } finally {
    globalThis.fetch = originalFetch;
    client.setAccessToken(null);
  }
});

test("chat API rechaza identificadores inválidos antes de llamar a Express", async () => {
  const originalFetch = globalThis.fetch;
  let llamadas = 0;
  globalThis.fetch = async () => {
    llamadas += 1;
    return new Response("{}", { status: 200 });
  };

  try {
    await assert.rejects(api.getConversaciones("no-es-uuid"), { code: "INVALID_IDENTIFIER" });
    await assert.rejects(api.getChat("no-es-uuid"), { code: "INVALID_IDENTIFIER" });
    await assert.rejects(api.getChat(idConversacion, "no-es-uuid"), { code: "INVALID_IDENTIFIER" });
    assert.equal(llamadas, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
