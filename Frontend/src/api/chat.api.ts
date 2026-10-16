import { z } from "zod";
import { getAccessToken, request } from "./client";
import { call, parseIdentifier } from "./module1.api";

export const mensajeChatSchema = z.object({
  idMensaje: z.uuid(),
  rol: z.enum(["USUARIO", "ASISTENTE"]),
  contenido: z.string(),
  createdAt: z.iso.datetime({ offset: true }),
});
export type MensajeChat = z.infer<typeof mensajeChatSchema>;

const mensajesResponseSchema = z.object({ mensajes: z.array(mensajeChatSchema) });
// Fuera del closure de call(): un id inválido debe fallar como INVALID_IDENTIFIER, no como error de red.
const chatPath = (idNotebook: string) => `/module4/notebooks/${encodeURIComponent(parseIdentifier(idNotebook))}/chat`;

export async function getChat(idNotebook: string): Promise<MensajeChat[]> {
  const path = chatPath(idNotebook);
  return (await call(() => request<unknown>(path, {}, getAccessToken()), mensajesResponseSchema)).mensajes;
}

/** Devuelve la pregunta y la respuesta del asistente ya guardadas. */
export async function sendChatMessage(idNotebook: string, pregunta: string): Promise<MensajeChat[]> {
  const path = chatPath(idNotebook);
  return (await call(() => request<unknown>(path, { method: "POST", body: JSON.stringify({ pregunta }) }, getAccessToken()), mensajesResponseSchema)).mensajes;
}

export async function resetChat(idNotebook: string): Promise<void> {
  const path = chatPath(idNotebook);
  await call(() => request<unknown>(path, { method: "DELETE" }, getAccessToken()), z.object({ eliminado: z.literal(true) }));
}
