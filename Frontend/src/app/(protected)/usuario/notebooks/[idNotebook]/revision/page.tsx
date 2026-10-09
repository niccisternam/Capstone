"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDocument, getNotebook } from "@/api/module1.api";
import type { Documento, DocumentoDetalle } from "@/api/module1.schemas";
import { DocumentReviewForm } from "@/features/module1/components/DocumentReviewForm";
import { PdfViewer } from "@/features/module1/components/PdfViewer";

const labels: Record<Documento["estado"], string> = { PENDIENTE: "Pendiente", PROCESANDO: "Procesando", PENDIENTE_REVISION: "Pendiente de confirmación", ERROR: "Error", CONFIRMADO: "Confirmado" };
const colors: Record<Documento["estado"], string> = { PENDIENTE: "bg-slate-100 text-slate-700", PROCESANDO: "bg-blue-100 text-blue-700", PENDIENTE_REVISION: "bg-amber-100 text-amber-800", ERROR: "bg-red-100 text-red-800", CONFIRMADO: "bg-emerald-100 text-emerald-800" };

export default function BatchReviewPage({ params }: { params: Promise<{ idNotebook: string }> }) {
  const [documents, setDocuments] = useState<DocumentoDetalle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void params.then(({ idNotebook }) => getNotebook(idNotebook).then(async (notebook) => {
      const pending = notebook.documentos.filter((document) => document.estado === "PENDIENTE_REVISION");
      const details = await Promise.all(pending.map((document) => getDocument(document.idDocumento)));
      if (active) setDocuments(details);
    }).catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "No fue posible cargar los documentos."); }).finally(() => { if (active) setLoading(false); }));
    return () => { active = false; };
  }, [params]);

  function updateStatus(idDocumento: string, estado: Documento["estado"]) {
    setDocuments((current) => current.map((document) => document.idDocumento === idDocumento ? { ...document, estado } : document));
  }

  const allDocumentsConfirmed = documents.length > 0 && documents.every((document) => document.estado === "CONFIRMADO");

  if (loading) return <main className="flex min-h-[60vh] items-center justify-center text-sm text-slate-600">Cargando documentos para revisión…</main>;
  if (error) return <main className="mx-auto max-w-4xl px-4 py-10"><Link href="/usuario" className="text-sm font-semibold text-blue-600">← Volver</Link><p className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">{error}</p></main>;

  return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6"><Link href="/usuario" className="text-sm font-semibold text-blue-600">← Volver a notebooks</Link><h1 className="mt-4 text-2xl font-extrabold text-slate-900">Confirmación de documentos</h1><p className="mt-1 text-sm text-slate-600">Revisa y confirma todos los documentos del lote en una sola página.</p><section className="mt-6 overflow-x-auto rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm"><table className="w-full min-w-[36rem] text-left text-sm"><thead><tr className="border-b-2 border-slate-200 text-xs uppercase text-slate-500"><th className="px-3 py-3">Documento</th><th className="px-3 py-3">Estado</th><th className="px-3 py-3">Ir a revisión</th></tr></thead><tbody>{documents.map((document, index) => <tr key={document.idDocumento} className="border-b border-slate-200"><td className="px-3 py-3 font-semibold">{document.archivo.nombreOriginal}</td><td className="px-3 py-3"><span className={`rounded-full px-3 py-1.5 text-xs font-bold ${colors[document.estado]}`}>{labels[document.estado]}</span></td><td className="px-3 py-3"><a href={`#document-${document.idDocumento}`} className="font-semibold text-blue-600 hover:text-blue-800">Documento {index + 1}</a></td></tr>)}</tbody></table></section>{documents.length === 0 ? <section className="mt-6 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-8 text-center text-emerald-800"><p className="font-semibold">No hay documentos pendientes de confirmación.</p><Link href="/usuario" className="mt-4 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700">Volver a notebooks</Link></section> : <><div className="mt-8 space-y-10">{documents.map((document, index) => <section id={`document-${document.idDocumento}`} key={document.idDocumento} className="scroll-mt-6 rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 shadow-sm"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Documento {index + 1}</p><h2 className="mt-1 text-lg font-bold text-slate-900">{document.archivo.nombreOriginal}</h2></div><span className={`rounded-full px-3 py-1.5 text-xs font-bold ${colors[document.estado]}`}>{labels[document.estado]}</span></div><div className="grid gap-6 lg:grid-cols-[minmax(20rem,0.9fr)_minmax(30rem,1.1fr)]"><PdfViewer idDocumento={document.idDocumento} fileName={document.archivo.nombreOriginal} status={document.estado}/><DocumentReviewForm document={document} onStatusChange={(status) => updateStatus(document.idDocumento, status)} onDone={() => undefined} batchMode/></div></section>)}</div>{allDocumentsConfirmed && <section className="mt-8 flex flex-col items-center gap-3 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6 text-center"><p className="font-semibold text-emerald-800">Todos los documentos están confirmados y guardados.</p><Link href="/usuario" className="inline-flex rounded-lg bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md">Guardar y volver al notebook</Link></section>}</>}</main>;
}





