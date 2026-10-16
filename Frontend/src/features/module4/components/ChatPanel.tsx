"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ApiError } from "@/api/api-error";
import { getChat, resetChat, sendChatMessage, type MensajeChat } from "@/api/chat.api";

const SUGERIDAS = ["¿Cuánto gastamos en total?", "¿A qué proveedor le compramos más?", "Listar facturas pendientes de pago"];
const errorMessage = (e: unknown, fallback: string) => e instanceof ApiError ? e.message : fallback;

export function ChatPanel({ idNotebook }: { idNotebook: string }) {
  const [mensajes, setMensajes] = useState<MensajeChat[]>([]);
  const [pregunta, setPregunta] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { void getChat(idNotebook).then(setMensajes).catch((e) => setError(errorMessage(e, "No fue posible cargar la conversación."))); }, [idNotebook]);

  async function enviar(texto: string) {
    const limpio = texto.trim();
    if (!limpio || busy) return;
    setBusy(true); setError(null);
    try { const nuevos = await sendChatMessage(idNotebook, limpio); setMensajes((actuales) => [...actuales, ...nuevos]); setPregunta(""); }
    catch (e) { setError(errorMessage(e, "No fue posible responder tu pregunta.")); }
    finally { setBusy(false); }
  }

  async function reiniciar() {
    const confirmation = await Swal.fire({ title: "¿Reiniciar conversación?", text: "Se borrará el historial de este notebook.", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, reiniciar", cancelButtonText: "Cancelar", confirmButtonColor: "#dc2626", cancelButtonColor: "#64748b" });
    if (!confirmation.isConfirmed) return;
    try { await resetChat(idNotebook); setMensajes([]); setError(null); } catch (e) { setError(errorMessage(e, "No fue posible reiniciar la conversación.")); }
  }

  return <section className="mt-8 w-full rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-sm font-bold uppercase text-blue-700">Preguntas sugeridas</h2><button type="button" onClick={() => void reiniciar()} disabled={busy || !mensajes.length} className="rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50">Reiniciar conversación</button></div>
    <div className="mt-3 flex flex-wrap gap-2">{SUGERIDAS.map((sugerida) => <button key={sugerida} type="button" disabled={busy} onClick={() => void enviar(sugerida)} className="rounded-lg border border-blue-300 bg-blue-100 px-3 py-2 text-xs font-semibold text-blue-900 hover:bg-blue-200 disabled:opacity-50">{sugerida}</button>)}</div>
    <div aria-live="polite" className="mt-4 flex min-h-64 flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      {!mensajes.length && !busy && <p className="m-auto text-sm text-slate-500">Haz una pregunta sobre los documentos confirmados de este notebook.</p>}
      {mensajes.map((mensaje) => <div key={mensaje.idMensaje} className={`max-w-[85%] whitespace-pre-wrap rounded-xl border px-4 py-3 text-sm ${mensaje.rol === "USUARIO" ? "self-end border-slate-300 bg-white text-slate-800" : "self-start border-blue-200 bg-blue-50 text-slate-800"}`}><span className="mb-1 block text-xs font-bold text-slate-500">{mensaje.rol === "USUARIO" ? "Tú" : "IA Capstone"}</span>{mensaje.contenido}</div>)}
      {busy && <p role="status" className="self-start rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800">Analizando tu pregunta…</p>}
    </div>
    {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <form className="mt-4 flex gap-2" onSubmit={(event) => { event.preventDefault(); void enviar(pregunta); }}>
      <label htmlFor="chat-pregunta" className="sr-only">Pregunta</label>
      <input id="chat-pregunta" value={pregunta} onChange={(event) => setPregunta(event.target.value)} maxLength={1000} disabled={busy} placeholder="Escribe una consulta sobre los datos de este notebook (ej. ¿Cuáles fueron los 3 proveedores con más gasto?)" className="min-w-0 flex-1 rounded-lg border-2 border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none" />
      <button type="submit" disabled={busy || !pregunta.trim()} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">Enviar</button>
    </form>
    <p className="mt-2 text-xs text-slate-500">Consultas acotadas exclusivamente a los documentos confirmados de este notebook.</p>
  </section>;
}
