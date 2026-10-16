"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { ApiError } from "@/api/api-error";
import { getChat, resetChat, sendChatMessage, type MensajeChat } from "@/api/chat.api";

const SUGERIDAS = ["¿Cuánto gastamos en total?", "¿A qué proveedor le compramos más?", "Listar facturas pendientes de pago"];
const errorMessage = (e: unknown, fallback: string) => e instanceof ApiError ? e.message : fallback;

function TextoEscribiendo({ texto, onProgress }: { texto: string; onProgress: () => void }) {
  const [visible, setVisible] = useState("");
  const velocidad = texto.length > 800 ? 6 : texto.length > 400 ? 12 : 35;
  useEffect(() => {
    let posicion = 0;
    const intervalo = window.setInterval(() => {
      posicion += 1;
      setVisible(texto.slice(0, posicion));
      window.requestAnimationFrame(onProgress);
      if (posicion >= texto.length) window.clearInterval(intervalo);
    }, velocidad);
    return () => window.clearInterval(intervalo);
  }, [texto, onProgress, velocidad]);
  return <>{visible}</>;
}

export function ChatPanel({ idNotebook }: { idNotebook: string }) {
  const [mensajes, setMensajes] = useState<MensajeChat[]>([]);
  const [pregunta, setPregunta] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensajeAnimado, setMensajeAnimado] = useState<string | null>(null);
  const mensajesRef = useRef<HTMLDivElement>(null);
  useEffect(() => { void getChat(idNotebook).then(setMensajes).catch((e) => setError(errorMessage(e, "No fue posible cargar la conversación."))); }, [idNotebook]);
  useEffect(() => { mensajesRef.current?.scrollTo({ top: mensajesRef.current.scrollHeight, behavior: "smooth" }); }, [mensajes, busy]);
  const mantenerAlFinal = useCallback(() => { mensajesRef.current?.scrollTo({ top: mensajesRef.current.scrollHeight, behavior: "auto" }); }, []);

  async function enviar(texto: string) {
    const limpio = texto.trim();
    if (!limpio || busy) return;
    const mensajeOptimista: MensajeChat = {
      idMensaje: crypto.randomUUID(),
      rol: "USUARIO",
      contenido: limpio,
      createdAt: new Date().toISOString(),
    };
    setBusy(true); setError(null); setPregunta("");
    setMensajes((actuales) => [...actuales, mensajeOptimista]);
    try {
      const nuevos = await sendChatMessage(idNotebook, limpio);
      const respuestas = nuevos.filter((mensaje) => mensaje.rol === "ASISTENTE");
      setMensajeAnimado(respuestas.at(-1)?.idMensaje ?? null);
      setMensajes((actuales) => [...actuales, ...respuestas]);
    }
    catch (e) {
      setMensajes((actuales) => actuales.filter((mensaje) => mensaje.idMensaje !== mensajeOptimista.idMensaje));
      setError(errorMessage(e, "No fue posible responder tu pregunta."));
    }
    finally { setBusy(false); }
  }

  async function reiniciar() {
    const confirmation = await Swal.fire({ title: "¿Reiniciar conversación?", text: "Se borrará el historial de este notebook.", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, reiniciar", cancelButtonText: "Cancelar", confirmButtonColor: "#dc2626", cancelButtonColor: "#64748b" });
    if (!confirmation.isConfirmed) return;
    try { await resetChat(idNotebook); setMensajes([]); setError(null); } catch (e) { setError(errorMessage(e, "No fue posible reiniciar la conversación.")); }
  }

  return <section className="mx-auto mt-8 flex h-[740px] max-h-[calc(100vh-2rem)] min-h-0 w-full max-w-[1000px] flex-col overflow-hidden rounded-[10px] border border-slate-300 bg-white shadow-md">
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-7">
      <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#2448c8] text-sm font-bold text-white">IA</span><h2 className="text-[15px] font-bold text-[#1c2333]">IA Capstone</h2></div>
      <button type="button" onClick={() => void reiniciar()} disabled={busy || !mensajes.length} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Reiniciar conversación</button>
    </header>
    <div ref={mensajesRef} aria-live="polite" className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#f6f7fa] px-5 py-6 sm:px-7">
      <div className="flex min-h-full flex-col justify-end gap-5">
      {!mensajes.length && !busy && <p className="m-auto text-sm text-slate-500">Haz una pregunta sobre los documentos confirmados de este notebook.</p>}
      {mensajes.map((mensaje) => {
        const esUsuario = mensaje.rol === "USUARIO";
        return <div key={mensaje.idMensaje} className={`flex w-full gap-3 py-2 ${esUsuario ? "justify-end" : "justify-start"}`}>
          {!esUsuario && <span aria-hidden="true" className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">IA</span>}
          <div className={`max-w-[85%] text-sm leading-6 ${esUsuario ? "text-right" : "text-left"}`}>
            <span className={`mb-1 block text-xs font-bold ${esUsuario ? "text-blue-800" : "text-blue-700"}`}>{esUsuario ? "Tú" : "IA Capstone"}</span>
            <span className={`whitespace-pre-wrap ${esUsuario ? "inline-block rounded-[16px_16px_4px_16px] bg-[#2448c8] px-4 py-2.5 text-left text-white" : "text-slate-950"}`}>{mensaje.rol === "ASISTENTE" && mensaje.idMensaje === mensajeAnimado ? <TextoEscribiendo texto={mensaje.contenido} onProgress={mantenerAlFinal} /> : mensaje.contenido}</span>
          </div>
          {esUsuario && <span aria-hidden="true" className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white">Tú</span>}
        </div>;
      })}
        {busy && <div role="status" aria-label="La IA está escribiendo" className="flex items-center gap-3 text-sm text-slate-600"><span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#2448c8] text-[10px] font-bold text-white">IA</span><span className="sr-only">La IA está escribiendo</span><span aria-hidden="true" className="flex items-center gap-1"><span className="chat-typing-dot" /><span className="chat-typing-dot" style={{ animationDelay: "200ms" }} /><span className="chat-typing-dot" style={{ animationDelay: "400ms" }} /></span></div>}
      </div>
    </div>
    {error && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="bg-[#f6f7fa] px-5 pb-5 sm:px-7"><div className="mb-3 flex flex-wrap gap-2">{SUGERIDAS.map((sugerida) => <button key={sugerida} type="button" disabled={busy} onClick={() => void enviar(sugerida)} className="rounded-full border border-[#cdd6f5] bg-white px-3 py-2 text-xs font-medium text-[#2448c8] hover:bg-blue-50 disabled:opacity-50">{sugerida}</button>)}</div>
    <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); void enviar(pregunta); }}>
      <label htmlFor="chat-pregunta" className="sr-only">Pregunta</label>
      <input id="chat-pregunta" value={pregunta} onChange={(event) => setPregunta(event.target.value)} maxLength={1000} disabled={busy} autoComplete="off" autoCorrect="off" spellCheck={false} placeholder="Escribe una consulta sobre los datos de este notebook…" className="min-w-0 flex-1 rounded-[14px] border-[1.5px] border-[#2448c8] bg-white px-4 py-3 text-sm text-[#1c2333] shadow-[0_0_0_3px_rgba(36,72,200,0.08)] outline-none placeholder:text-slate-400" />
       <button type="submit" aria-label="Enviar mensaje" disabled={busy || !pregunta.trim()} className="flex h-[42px] w-[42px] shrink-0 items-center justify-center self-center rounded-lg bg-[#2448c8] text-xl font-bold text-white hover:bg-blue-800 disabled:opacity-50">↑</button>
    </form>
    <p className="mt-2 text-[11.5px] text-slate-500">Consultas acotadas exclusivamente a los documentos confirmados de este notebook.</p></div>
  </section>;
}
