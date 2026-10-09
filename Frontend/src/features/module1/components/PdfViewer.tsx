"use client";

import { useEffect, useState } from "react";
import { getDocumentPdf } from "@/api/module1.api";
import type { Documento } from "@/api/module1.schemas";

const statusLabels: Record<Documento["estado"], string> = { PENDIENTE: "Pendiente", PROCESANDO: "Procesando", PENDIENTE_REVISION: "Pendiente de confirmación", ERROR: "Error", CONFIRMADO: "Confirmado" };
const statusColors: Record<Documento["estado"], string> = { PENDIENTE: "bg-slate-100 text-slate-700", PROCESANDO: "bg-blue-100 text-blue-700", PENDIENTE_REVISION: "bg-amber-100 text-amber-800", ERROR: "bg-red-100 text-red-800", CONFIRMADO: "bg-emerald-100 text-emerald-800" };

export function PdfViewer({ idDocumento, fileName, status }: { idDocumento: string; fileName: string; status: Documento["estado"] }) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;
    const timer = window.setTimeout(() => {
      void getDocumentPdf(idDocumento).then((blob) => {
        if (!active) return;
        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
      }).catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "No fue posible cargar el PDF.");
      });
    }, 0);
    return () => {
      active = false;
      window.clearTimeout(timer);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [idDocumento]);

  return <section className="flex min-h-[28rem] flex-col rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:h-[calc(100vh-8rem)] lg:min-h-[38rem]" aria-label="Visor del documento PDF">
    <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3"><div><h2 className="font-bold text-slate-900">Documento original</h2><p className="max-w-[16rem] truncate text-xs text-slate-500" title={fileName}>{fileName}</p></div><div className="flex items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusColors[status]}`}>Estado: {statusLabels[status]}</span>{pdfUrl && <a href={pdfUrl} target="_blank" rel="noreferrer" className="shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Abrir PDF</a>}</div></div>
    <div className="mt-3 flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg bg-slate-100">{error ? <div role="alert" className="p-6 text-center text-sm text-red-700"><p className="font-semibold">No se pudo cargar el PDF</p><p className="mt-2">{error}</p></div> : pdfUrl ? <iframe src={`${pdfUrl}#toolbar=1&navpanes=0&pagemode=none&view=FitH`} title={`PDF original: ${fileName}`} className="h-full min-h-[24rem] w-full border-0" /> : <div className="flex flex-col items-center gap-3 text-sm text-slate-600"><span className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600" /><span>Cargando documento PDF…</span></div>}</div>
  </section>;
}
