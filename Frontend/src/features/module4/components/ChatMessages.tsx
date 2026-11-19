"use client";

import { useEffect, useState } from "react";
import type { MensajeChat } from "@/api/chat.api";
import { parsearMensaje } from "../chatTable";
import { TablaMensaje } from "./TablaMensaje";

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

export function MensajeBurbuja({
  mensaje,
  animado,
  onProgress,
}: {
  mensaje: MensajeChat;
  animado: boolean;
  onProgress: () => void;
}) {
  const esUsuario = mensaje.rol === "USUARIO";

  return (
    <div className={`flex w-full gap-3 py-2 ${esUsuario ? "justify-end" : "justify-start"}`}>
      {!esUsuario && (
        <span aria-hidden="true" className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">
          IA
        </span>
      )}
      <div className={`max-w-[85%] text-sm leading-6 ${esUsuario ? "text-right" : "text-left"}`}>
        <span className={`mb-1 block text-xs font-bold ${esUsuario ? "text-blue-800" : "text-blue-700"}`}>
          {esUsuario ? "Tú" : "IA Capstone"}
        </span>
        {esUsuario ? (
          <span className="inline-block whitespace-pre-wrap rounded-[16px_16px_4px_16px] bg-[#2448c8] px-4 py-2.5 text-left text-white">
            {mensaje.contenido}
          </span>
        ) : animado ? (
          <span className="whitespace-pre-wrap text-slate-950">
            <TextoEscribiendo texto={mensaje.contenido} onProgress={onProgress} />
          </span>
        ) : (
          <ContenidoAsistente contenido={mensaje.contenido} />
        )}
      </div>
      {esUsuario && (
        <span aria-hidden="true" className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-bold text-white">
          Tú
        </span>
      )}
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div role="status" aria-label="La IA está escribiendo" className="flex items-center gap-3 text-sm text-slate-600">
      <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#2448c8] text-[10px] font-bold text-white">
        IA
      </span>
      <span className="sr-only">La IA está escribiendo</span>
      <span aria-hidden="true" className="flex items-center gap-1">
        <span className="chat-typing-dot" />
        <span className="chat-typing-dot" style={{ animationDelay: "200ms" }} />
        <span className="chat-typing-dot" style={{ animationDelay: "400ms" }} />
      </span>
      <span className="text-xs text-slate-400">puede tardar unos segundos</span>
    </div>
  );
}
