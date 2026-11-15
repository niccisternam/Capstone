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

export const conversacionChatSchema = z.object({
  idConversacion: z.uuid(),
  titulo: z.string(),
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }),
});
export type ConversacionChat = z.infer<typeof conversacionChatSchema>;

const conversacionesResponseSchema = z.object({
  conversaciones: z.array(conversacionChatSchema),
  total: z.number().int().nonnegative(),
  pagina: z.number().int().positive(),
  hayMas: z.boolean(),
});
const conversacionResponseSchema = z.object({ conversacion: conversacionChatSchema });
const mensajesResponseSchema = z.object({ mensajes: z.array(mensajeChatSchema), hayMas: z.boolean() });
const enviarResponseSchema = z.object({
  mensajes: z.array(mensajeChatSchema),
  conversacion: conversacionChatSchema,
});

const notebookConversationsPath = (idNotebook: string) =>
  `/module4/notebooks/${encodeURIComponent(parseIdentifier(idNotebook))}/conversaciones`;
const conversationPath = (idConversacion: string) =>
  `/module4/conversaciones/${encodeURIComponent(parseIdentifier(idConversacion))}`;

export async function getConversaciones(idNotebook: string, pagina = 1) {
  const path = `${notebookConversationsPath(idNotebook)}?pagina=${pagina}`;
  return call(() => request<unknown>(path, {}, getAccessToken()), conversacionesResponseSchema);
}

export async function crearConversacion(idNotebook: string): Promise<ConversacionChat> {
  const path = notebookConversationsPath(idNotebook);
  return (await call(() => request<unknown>(path, { method: "POST", body: JSON.stringify({}) }, getAccessToken()), conversacionResponseSchema)).conversacion;
}

export async function getChat(idConversacion: string, cursor?: string) {
  const path = `${conversationPath(idConversacion)}/mensajes${cursor ? `?cursor=${encodeURIComponent(parseIdentifier(cursor))}` : ""}`;
  return call(() => request<unknown>(path, {}, getAccessToken()), mensajesResponseSchema);
}

/** Devuelve la pregunta, la respuesta y los metadatos actualizados de la conversación. */
export async function sendChatMessage(idConversacion: string, pregunta: string) {
  const path = `${conversationPath(idConversacion)}/mensajes`;
  return call(() => request<unknown>(path, { method: "POST", body: JSON.stringify({ pregunta }) }, getAccessToken()), enviarResponseSchema);
}

export async function eliminarConversacion(idConversacion: string): Promise<void> {
  const path = conversationPath(idConversacion);
  await call(
    () => request<unknown>(path, { method: "DELETE" }, getAccessToken()),
    z.object({ idConversacion: z.uuid(), eliminado: z.literal(true) }),
  );
}
