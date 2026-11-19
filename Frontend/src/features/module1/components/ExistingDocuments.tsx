"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getNotebook } from "@/api/module1.api";
import type { Documento } from "@/api/module1.schemas";
import { Pagination } from "@/components/ui/Pagination";
import { colors, DownloadIcon, labels, type ActionHandler } from "./notebookDocumentsShared";

const DOCUMENTOS_POR_PAGINA = 50;

export function ExistingDocuments({ idNotebook, initialDocuments, initialTotal, refreshKey, action, downloadingPdf, onDownload, onAction }: { idNotebook: string; initialDocuments: Documento[]; initialTotal: number; refreshKey: number; action: string | null; downloadingPdf: string | null; onDownload: (document: Documento) => void; onAction: ActionHandler }) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("TODOS");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [companyFilter, setCompanyFilter] = useState("TODAS");
  const [loading, setLoading] = useState(false);
  const [tableAnimation, setTableAnimation] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const skipInitialFetch = useRef(true);
  const companies = [...new Set(documents.map((document) => document.proveedor).filter((company): company is string => Boolean(company?.trim())))].sort((a, b) => a.localeCompare(b, "es"));
  const totalPages = Math.max(1, Math.ceil(total / DOCUMENTOS_POR_PAGINA));
  const hasFilters = Boolean(search) || paymentFilter !== "TODOS" || statusFilter !== "TODOS" || companyFilter !== "TODAS";
  const clearFilters = () => { setSearch(""); setPaymentFilter("TODOS"); setStatusFilter("TODOS"); setCompanyFilter("TODAS"); setPage(1); };

  useEffect(() => {
    const timer = window.setTimeout(() => { setDebouncedSearch(search.trim()); setPage(1); }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (skipInitialFetch.current) { skipInitialFetch.current = false; return; }
    let active = true;
    setLoading(true);
    setError(null);
    void getNotebook(idNotebook, {
      pagina: page,
      buscar: debouncedSearch || undefined,
      estado: statusFilter === "TODOS" ? undefined : statusFilter as "PENDIENTE_REVISION" | "CONFIRMADO",
      estadoPago: paymentFilter === "TODOS" ? undefined : paymentFilter,
      proveedor: companyFilter === "TODAS" ? undefined : companyFilter,
    }).then((notebook) => {
      if (!active) return;
      setDocuments(notebook.documentos);
      setTotal(notebook.total);
      setTableAnimation((current) => current + 1);
      if (!notebook.documentos.length && page > 1 && notebook.total > 0) setPage(Math.ceil(notebook.total / DOCUMENTOS_POR_PAGINA));
    }).catch((reason) => {
      if (active) setError(reason instanceof Error ? reason.message : "No fue posible cargar los documentos.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [idNotebook, page, debouncedSearch, statusFilter, paymentFilter, companyFilter, refreshKey]);

  if (!initialTotal && !total && !hasFilters) return null;
  return <section className="order-1 w-full rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-bold">Documentos existentes</h2><p className="mt-1 text-sm text-slate-500">Busca y filtra los documentos cargados en este notebook.</p></div>{hasFilters && <button type="button" onClick={clearFilters} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Limpiar filtros</button>}</div><div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4"><label className="lg:col-span-2"><span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Buscar</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Folio, proveedor, RUT, fecha o estado" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-600 focus:outline-2 focus:outline-offset-2 focus:outline-blue-600" /></label><label><span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estado de pago</span><select value={paymentFilter} onChange={(event) => { setPaymentFilter(event.target.value); setPage(1); }} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-blue-600 focus:outline-2 focus:outline-offset-2 focus:outline-blue-600"><option value="TODOS">Todos</option>{[...new Set(documents.map((document) => document.estadoPago ?? "PENDIENTE"))].sort().map((status) => <option key={status} value={status}>{status}</option>)}</select></label><label><span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estado documento</span><select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-blue-600 focus:outline-2 focus:outline-offset-2 focus:outline-blue-600"><option value="TODOS">Todos</option>{[...new Set(documents.map((document) => document.estado))].map((status) => <option key={status} value={status}>{labels[status]}</option>)}</select></label><label className="md:col-span-2 lg:col-span-1"><span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Empresa/proveedor</span><select value={companyFilter} onChange={(event) => { setCompanyFilter(event.target.value); setPage(1); }} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-blue-600 focus:outline-2 focus:outline-offset-2 focus:outline-blue-600"><option value="TODAS">Todas</option>{companies.map((company) => <option key={company} value={company}>{company}</option>)}</select></label></div>{error && <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<p className="mt-3 text-xs text-slate-500" aria-live="polite">{loading ? "Cargando documentos…" : `Mostrando ${documents.length} de ${total} documentos · Página ${page} de ${totalPages}`}</p>{!loading && !documents.length && <p className="mt-4 rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-600">No hay documentos que coincidan con los filtros.</p>}<div key={tableAnimation} className="documents-page-transition mt-2 max-h-[620px] overflow-x-auto overflow-y-auto rounded-lg border border-slate-200"><table className="w-full text-sm"><thead className="sticky top-0 z-10 bg-white"><tr className="border-b-2 border-slate-200 text-xs uppercase text-slate-500"><th className="px-3 py-3 text-left">Folio</th><th className="px-3 py-3 text-left">Proveedor/Emisor</th><th className="px-3 py-3 text-left">RUT Emisor</th><th className="px-3 py-3 text-left">Fecha emisión</th><th className="px-3 py-3 text-left">Estado documento</th><th className="px-3 py-3 text-left">Estado pago</th><th className="px-3 py-3 text-right">Acciones</th></tr></thead><tbody>{documents.map((document) => <tr key={document.idDocumento} className="border-b border-slate-200"><td className="px-3 py-4 text-left">{document.folio ?? "—"}</td><td className="px-3 py-4 text-left">{document.proveedor ?? "—"}</td><td className="px-3 py-4 text-left">{document.rutEmisor ?? "—"}</td><td className="px-3 py-4 text-left">{document.fechaEmision ? new Date(document.fechaEmision).toLocaleDateString("es-CL") : "—"}</td><td className="px-3 py-4 text-left"><span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${document.estado === "PENDIENTE_REVISION" ? "bg-amber-100 text-amber-800" : colors[document.estado]}`}>{document.estado === "PENDIENTE_REVISION" ? "Pendiente de confirmación" : labels[document.estado]}</span></td><td className="px-3 py-4 text-left">{document.estadoPago ?? "PENDIENTE"}</td><td className="px-3 py-4 text-right align-middle"><div className="flex justify-end gap-2">{["PENDIENTE_REVISION", "CONFIRMADO"].includes(document.estado) && <Link href={`/usuario/documentos/${document.idDocumento}/revision?notebook=${encodeURIComponent(idNotebook)}`} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white">Editar</Link>}<button type="button" aria-label={`${downloadingPdf === document.idDocumento ? "Descargando" : "Descargar"} PDF ${document.nombreArchivo ?? document.folio ?? ""}`} title="Descargar PDF" disabled={downloadingPdf === document.idDocumento} onClick={() => onDownload(document)} className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-blue-800 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-50"><DownloadIcon loading={downloadingPdf === document.idDocumento} /></button>{["PENDIENTE_REVISION", "CONFIRMADO"].includes(document.estado) && <button disabled={action === document.idDocumento} onClick={() => void onAction("existing", document.idDocumento, "delete")} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md">Eliminar</button>}</div></td></tr>)}</tbody></table></div>{totalPages > 1 && <Pagination page={page} totalPages={totalPages} onChange={setPage} />}</section>;
}
