"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { ApiError } from "@/api/api-error";
import {
  crearConversacion,
  eliminarConversacion,
  getChat,
  getConversaciones,
  sendChatMessage,
  type ConversacionChat,
  type MensajeChat,
} from "@/api/chat.api";
import { contieneTabla, parsearMensaje } from "../chatTable";
import { TablaMensaje } from "./TablaMensaje";

const SUGERIDAS = ["¿Cuánto gastamos en total?", "¿A qué proveedor le compramos más?", "Listar facturas pendientes de pago"];
const MENSAJES_POR_PAGINA = 50;
const CONVERSACIONES_POR_PAGINA = 20;
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

/** Texto normal o mezcla de texto y tablas reales, sin mostrar los pipes de Markdown. */
function ContenidoAsistente({ contenido }: { contenido: string }) {
  const bloques = parsearMensaje(contenido);
  if (!bloques.some((bloque) => bloque.tipo === "tabla")) {
    return <span className="whitespace-pre-wrap text-slate-950">{contenido}</span>;
  }
  return (
    <div className="space-y-1 text-slate-950">
      {bloques.map((bloque, indice) =>
        bloque.tipo === "tabla" ? (
          <TablaMensaje key={indice} tabla={bloque.tabla} />
        ) : (
          <p key={indice} className="whitespace-pre-wrap">{bloque.contenido}</p>
        ),
      )}
    </div>
  );
}

export function ChatPanel({ idNotebook }: { idNotebook: string }) {
  const [conversaciones, setConversaciones] = useState<ConversacionChat[]>([]);
  const [totalConversaciones, setTotalConversaciones] = useState(0);
  const [paginaConversaciones, setPaginaConversaciones] = useState(1);
  const [hayMasConversaciones, setHayMasConversaciones] = useState(false);
  const [cargandoConversaciones, setCargandoConversaciones] = useState(false);
  const [idActiva, setIdActiva] = useState<string | null>(null);
  const [mensajes, setMensajes] = useState<MensajeChat[]>([]);
  const [hayMasMensajes, setHayMasMensajes] = useState(false);
  const [pregunta, setPregunta] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cargandoAnteriores, setCargandoAnteriores] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensajeAnimado, setMensajeAnimado] = useState<string | null>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const mensajesRef = useRef<HTMLDivElement>(null);
  const loadId = useRef(0);
  const preservarScroll = useRef<{ height: number; top: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const requestId = ++loadId.current;
    void getConversaciones(idNotebook, 1).then(async (resultado) => {
      if (cancelled) return;
      setConversaciones(resultado.conversaciones);
      setTotalConversaciones(resultado.total);
      setPaginaConversaciones(resultado.pagina);
      setHayMasConversaciones(resultado.hayMas);
      const primera = resultado.conversaciones[0];
      if (primera) {
        setIdActiva(primera.idConversacion);
        const historial = await getChat(primera.idConversacion);
        if (!cancelled && requestId === loadId.current) {
          setMensajes(historial.mensajes);
          setHayMasMensajes(historial.hayMas);
        }
      }
    }).catch((e) => {
      if (!cancelled) setError(errorMessage(e, "No fue posible cargar las conversaciones."));
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [idNotebook]);

  useLayoutEffect(() => {
    const container = mensajesRef.current;
    const anterior = preservarScroll.current;
    if (container && anterior) {
      container.scrollTop = anterior.top + container.scrollHeight - anterior.height;
      preservarScroll.current = null;
    } else {
      container?.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [mensajes, busy]);
  const mantenerAlFinal = useCallback(() => { mensajesRef.current?.scrollTo({ top: mensajesRef.current.scrollHeight, behavior: "auto" }); }, []);

  function actualizarConversacion(actualizada: ConversacionChat) {
    setConversaciones((actuales) => [actualizada, ...actuales.filter((item) => item.idConversacion !== actualizada.idConversacion)]
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
      .slice(0, CONVERSACIONES_POR_PAGINA));
  }

  async function seleccionar(idConversacion: string) {
    const requestId = ++loadId.current;
    preservarScroll.current = null;
    setIdActiva(idConversacion);
    setMensajes([]);
    setHayMasMensajes(false);
    setCargandoAnteriores(false);
    setLoading(true);
    setError(null);
    setMobileSidebarOpen(false);
    try {
      const historial = await getChat(idConversacion);
      if (requestId === loadId.current) {
        setMensajes(historial.mensajes);
        setHayMasMensajes(historial.hayMas);
      }
    } catch (e) {
      if (requestId === loadId.current) setError(errorMessage(e, "No fue posible cargar la conversación."));
    } finally {
      if (requestId === loadId.current) setLoading(false);
    }
  }

  function nuevaConversacion() {
    if (busy || loading) return;
    ++loadId.current;
    preservarScroll.current = null;
    setIdActiva(null);
    setMensajes([]);
    setHayMasMensajes(false);
    setCargandoAnteriores(false);
    setPregunta("");
    setError(null);
    setLoading(false);
    setMobileSidebarOpen(false);
  }

  async function cargarMasConversaciones() {
    if (busy || cargandoConversaciones || !hayMasConversaciones) return;
    const siguientePagina = paginaConversaciones + 1;
    setCargandoConversaciones(true);
    try {
      const resultado = await getConversaciones(idNotebook, siguientePagina);
      setConversaciones((actuales) => [...actuales, ...resultado.conversaciones.filter((item) => !actuales.some((actual) => actual.idConversacion === item.idConversacion))]);
      setPaginaConversaciones(resultado.pagina);
      setTotalConversaciones(resultado.total);
      setHayMasConversaciones(resultado.hayMas);
    } catch (e) {
      setError(errorMessage(e, "No fue posible cargar más conversaciones."));
    } finally {
      setCargandoConversaciones(false);
    }
  }

  async function cargarMensajesAnteriores() {
    const cursor = mensajes[0]?.idMensaje;
    if (!idActiva || !cursor || busy || cargandoAnteriores || !hayMasMensajes) return;
    const idSolicitado = idActiva;
    const requestId = loadId.current;
    const container = mensajesRef.current;
    preservarScroll.current = { height: container?.scrollHeight ?? 0, top: container?.scrollTop ?? 0 };
    setCargandoAnteriores(true);
    try {
      const anteriores = await getChat(idSolicitado, cursor);
      if (requestId !== loadId.current) return;
      setMensajes((actuales) => [...anteriores.mensajes.filter((item) => !actuales.some((actual) => actual.idMensaje === item.idMensaje)), ...actuales]);
      setHayMasMensajes(anteriores.hayMas);
    } catch (e) {
      preservarScroll.current = null;
      setError(errorMessage(e, "No fue posible cargar mensajes anteriores."));
    } finally {
      setCargandoAnteriores(false);
    }
  }

  async function enviar(texto: string) {
    const limpio = texto.trim();
    if (!limpio || busy || loading || cargandoAnteriores || cargandoConversaciones) return;
    const mensajeOptimista: MensajeChat = {
      idMensaje: crypto.randomUUID(),
      rol: "USUARIO",
      contenido: limpio,
      createdAt: new Date().toISOString(),
    };
    setBusy(true); setError(null); setPregunta("");
    setMensajes((actuales) => [...actuales, mensajeOptimista]);
    let idConversacion = idActiva;
    try {
      if (!idConversacion) {
        const nueva = await crearConversacion(idNotebook);
        idConversacion = nueva.idConversacion;
        const yaEstaba = conversaciones.some((item) => item.idConversacion === nueva.idConversacion);
        setConversaciones((actuales) => [nueva, ...actuales.filter((item) => item.idConversacion !== nueva.idConversacion)].slice(0, CONVERSACIONES_POR_PAGINA));
        if (!yaEstaba) setTotalConversaciones((total) => total + 1);
        setIdActiva(nueva.idConversacion);
      }
      const resultado = await sendChatMessage(idConversacion, limpio);
      actualizarConversacion(resultado.conversacion);
      const respuestas = resultado.mensajes.filter((mensaje) => mensaje.rol === "ASISTENTE");
      const ultima = respuestas.at(-1);
      // Las tablas se muestran completas: animarlas dejaría tablas a medio formar.
      setMensajeAnimado(ultima && !contieneTabla(ultima.contenido) ? ultima.idMensaje : null);
      setMensajes((actuales) => {
        const actualizados = [...actuales, ...respuestas];
        if (actualizados.length > MENSAJES_POR_PAGINA) setHayMasMensajes(true);
        return actualizados.slice(-MENSAJES_POR_PAGINA);
      });
    } catch (e) {
      setMensajes((actuales) => actuales.filter((mensaje) => mensaje.idMensaje !== mensajeOptimista.idMensaje));
      // Si la IA falló o expiró, la pregunta vuelve al campo para reintentar sin escribirla de nuevo.
      setPregunta((actual) => actual.trim() ? actual : limpio);
      setError(errorMessage(e, "No fue posible responder tu pregunta."));
    } finally { setBusy(false); }
  }

  async function eliminarActiva() {
    if (!idActiva) return;
    const confirmation = await Swal.fire({ title: "¿Eliminar conversación?", text: "Se borrarán sus mensajes de este notebook.", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar", confirmButtonColor: "#dc2626", cancelButtonColor: "#64748b" });
    if (!confirmation.isConfirmed) return;
    setBusy(true);
    try {
      await eliminarConversacion(idActiva);
      const restantes = conversaciones.filter((item) => item.idConversacion !== idActiva);
      setConversaciones(restantes);
      setTotalConversaciones((total) => Math.max(0, total - 1));
      setIdActiva(null);
      setMensajes([]);
      setHayMasMensajes(false);
      setError(null);
      if (restantes[0]) await seleccionar(restantes[0].idConversacion);
    } catch (e) {
      setError(errorMessage(e, "No fue posible eliminar la conversación."));
    } finally { setBusy(false); }
  }

  const activa = conversaciones.find((item) => item.idConversacion === idActiva);
  const controlsBusy = busy || loading || cargandoAnteriores || cargandoConversaciones;
  return <section className="relative mx-auto mt-8 flex h-[740px] max-h-[calc(100vh-2rem)] min-h-0 w-full max-w-[1200px] overflow-hidden rounded-[10px] border border-slate-300 bg-white shadow-md">
    {mobileSidebarOpen && <button type="button" aria-label="Cerrar panel de conversaciones" onClick={() => setMobileSidebarOpen(false)} className="absolute inset-0 z-20 cursor-default bg-slate-950/30 lg:hidden" />}
    <aside id="chat-conversation-sidebar" aria-label="Conversaciones" className={`${mobileSidebarOpen ? "absolute inset-y-0 left-0 z-30 flex w-[min(84vw,300px)] shadow-xl lg:static lg:z-auto lg:w-[270px] lg:shadow-none" : "hidden lg:flex"} ${sidebarExpanded ? "lg:w-[270px] lg:shrink-0" : "lg:w-0 lg:overflow-hidden"} flex-col border-r border-slate-200 bg-[#f8f9fc]`}>
      <header className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
        <div><h2 className="text-sm font-bold text-slate-900">Conversaciones</h2><p className="mt-1 text-xs text-slate-500">{totalConversaciones} de 50</p></div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={nuevaConversacion} disabled={controlsBusy} aria-label="Nueva conversación" title="Nueva conversación" className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2448c8] text-xl font-medium text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-50">+</button>
          <button type="button" onClick={() => setMobileSidebarOpen(false)} aria-label="Cerrar conversaciones" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-blue-700 lg:hidden">×</button>
        </div>
      </header>
      <nav aria-label="Historial de conversaciones" className="min-h-0 flex-1 overflow-y-auto p-2">
        {conversaciones.length === 0 && !loading && <p className="px-3 py-5 text-sm leading-5 text-slate-500">Tus chats aparecerán aquí después de enviar el primer mensaje.</p>}
        <ul className="space-y-1">
          {conversaciones.map((item) => <li key={item.idConversacion}>
            <button type="button" onClick={() => void seleccionar(item.idConversacion)} aria-current={idActiva === item.idConversacion ? "page" : undefined} disabled={controlsBusy} className={`w-full rounded-lg border-l-[3px] px-3 py-3 text-left text-sm leading-5 focus-visible:outline-2 focus-visible:outline-blue-700 disabled:opacity-60 ${idActiva === item.idConversacion ? "border-[#2448c8] bg-white font-semibold text-slate-900 shadow-sm" : "border-transparent text-slate-600 hover:bg-white hover:text-slate-900"}`}>
              <span className="block truncate">{item.titulo}</span>
              <span className="mt-1 block text-[11px] font-normal text-slate-400">{new Date(item.updatedAt).toLocaleDateString("es-CL", { day: "2-digit", month: "short" })}</span>
            </button>
          </li>)}
        </ul>
        {hayMasConversaciones && <button type="button" onClick={() => void cargarMasConversaciones()} disabled={controlsBusy} className="mt-2 w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-[#2448c8] hover:bg-blue-50 disabled:opacity-50">{cargandoConversaciones ? "Cargando…" : "Ver chats anteriores"}</button>}
      </nav>
      <div className="border-t border-slate-200 px-4 py-3 text-[11px] text-slate-500">Cada conversación mantiene su propio contexto.</div>
    </aside>
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="flex min-h-[69px] flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={() => setMobileSidebarOpen((open) => !open)} aria-expanded={mobileSidebarOpen} aria-controls="chat-conversation-sidebar" aria-label={mobileSidebarOpen ? "Ocultar conversaciones" : "Mostrar conversaciones"} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-lg text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-700 lg:hidden">{mobileSidebarOpen ? "×" : "☰"}</button>
          <button type="button" onClick={() => setSidebarExpanded((open) => !open)} aria-expanded={sidebarExpanded} aria-controls="chat-conversation-sidebar" aria-label={sidebarExpanded ? "Ocultar conversaciones" : "Mostrar conversaciones"} className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-lg text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-blue-700 lg:flex">{sidebarExpanded ? "‹" : "›"}</button>
          <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#2448c8] text-sm font-bold text-white">IA</span>
          <div className="min-w-0"><h2 className="truncate text-[15px] font-bold text-[#1c2333]">{activa?.titulo ?? "Nueva conversación"}</h2><p className="text-[11px] text-slate-500">Notebook actual</p></div>
        </div>
        <button type="button" onClick={() => void eliminarActiva()} disabled={controlsBusy || !idActiva} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">Eliminar chat</button>
      </header>
      <div ref={mensajesRef} aria-live="polite" className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#f6f7fa] px-5 py-6 sm:px-7">
          {hayMasMensajes && <div className="mb-5 text-center"><button type="button" onClick={() => void cargarMensajesAnteriores()} disabled={controlsBusy} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:border-blue-300 hover:text-[#2448c8] disabled:opacity-50">{cargandoAnteriores ? "Cargando mensajes…" : "Ver mensajes anteriores"}</button></div>}
        <div className="flex min-h-full flex-col justify-end gap-5">
          {loading && <p role="status" className="m-auto text-sm text-slate-500">Cargando conversación…</p>}
          {!loading && !mensajes.length && !busy && <p className="m-auto max-w-sm text-center text-sm leading-6 text-slate-500">{activa ? "Haz una pregunta sobre los documentos confirmados de este notebook." : "Este chat nuevo aún no se guarda. Envía un mensaje para comenzarlo."}</p>}
          {mensajes.map((mensaje) => {
            const esUsuario = mensaje.rol === "USUARIO";
            const esAnimado = !esUsuario && mensaje.idMensaje === mensajeAnimado;
            return <div key={mensaje.idMensaje} className={`flex w-full gap-3 py-2 ${esUsuario ? "justify-end" : "justify-start"}`}>
              {!esUsuario && <span aria-hidden="true" className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">IA</span>}
              <div className={`max-w-[85%] text-sm leading-6 ${esUsuario ? "text-right" : "text-left"}`}>
                <span className={`mb-1 block text-xs font-bold ${esUsuario ? "text-blue-800" : "text-blue-700"}`}>{esUsuario ? "Tú" : "IA Capstone"}</span>
                {esUsuario ? (
                  <span className="inline-block whitespace-pre-wrap rounded-[16px_16px_4px_16px] bg-[#2448c8] px-4 py-2.5 text-left text-white">{mensaje.contenido}</span>
                ) : esAnimado ? (
                  <span className="whitespace-pre-wrap text-slate-950"><TextoEscribiendo texto={mensaje.contenido} onProgress={mantenerAlFinal} /></span>
                ) : (
                  <ContenidoAsistente contenido={mensaje.contenido} />
                )}
              </div>
              {esUsuario && <span aria-hidden="true" className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white">Tú</span>}
            </div>;
          })}
          {busy && <div role="status" aria-label="La IA está escribiendo" className="flex items-center gap-3 text-sm text-slate-600"><span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#2448c8] text-[10px] font-bold text-white">IA</span><span className="sr-only">La IA está escribiendo</span><span aria-hidden="true" className="flex items-center gap-1"><span className="chat-typing-dot" /><span className="chat-typing-dot" style={{ animationDelay: "200ms" }} /><span className="chat-typing-dot" style={{ animationDelay: "400ms" }} /></span><span className="text-xs text-slate-400">puede tardar unos segundos</span></div>}
        </div>
      </div>
      {error && <p role="alert" className="mx-5 mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700 sm:mx-7">{error}</p>}
      <div className="bg-[#f6f7fa] px-5 pb-5 sm:px-7"><div className="mb-3 flex flex-wrap gap-2">{SUGERIDAS.map((sugerida) => <button key={sugerida} type="button" disabled={controlsBusy} onClick={() => void enviar(sugerida)} className="rounded-full border border-[#cdd6f5] bg-white px-3 py-2 text-xs font-medium text-[#2448c8] hover:bg-blue-50 disabled:opacity-50">{sugerida}</button>)}</div>
        <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); void enviar(pregunta); }}>
          <label htmlFor="chat-pregunta" className="sr-only">Pregunta</label>
          <input id="chat-pregunta" value={pregunta} onChange={(event) => setPregunta(event.target.value)} maxLength={1000} disabled={controlsBusy} autoComplete="off" autoCorrect="off" spellCheck={false} placeholder="Escribe una consulta sobre los datos de este notebook…" className="min-w-0 flex-1 rounded-[14px] border-[1.5px] border-[#2448c8] bg-white px-4 py-3 text-sm text-[#1c2333] shadow-[0_0_0_3px_rgba(36,72,200,0.08)] outline-none placeholder:text-slate-400" />
          <button type="submit" aria-label="Enviar mensaje" disabled={controlsBusy || !pregunta.trim()} className="flex h-[42px] w-[42px] shrink-0 items-center justify-center self-center rounded-lg bg-[#2448c8] text-xl font-bold text-white hover:bg-blue-800 disabled:opacity-50">↑</button>
        </form>
        <p className="mt-2 text-[11.5px] text-slate-500">Consultas acotadas exclusivamente a los documentos confirmados de este notebook.</p>
      </div>
    </div>
  </section>;
}
