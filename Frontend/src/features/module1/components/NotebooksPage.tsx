"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { listNotebooks } from "@/api/module1.api";
import type { NotebookConConteo } from "@/api/module1.schemas";
import { NotebookForm } from "./NotebookForm";

export function NotebooksPage() {
  const [notebooks, setNotebooks] = useState<NotebookConConteo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const load = useCallback(async () => { setLoading(true); setError(null); try { setNotebooks(await listNotebooks()); } catch (e) { setError(e instanceof Error ? e.message : "No fue posible cargar tus notebooks."); } finally { setLoading(false); } }, []);
  useEffect(() => { const timer = window.setTimeout(() => { void load(); }, 0); return () => window.clearTimeout(timer); }, [load]);

  return <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10 sm:px-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Módulo 1</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">Mis notebooks</h1><p className="mt-2 text-sm text-slate-600">Gestiona tus espacios de documentos tributarios.</p></div><button onClick={() => setShowForm(true)} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md shadow-sm hover:bg-blue-700">+ Crear notebook</button></div>
    {loading && <section className="mt-8 rounded-2xl border-2 border-slate-200 bg-white p-10 text-center shadow-sm" aria-live="polite"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" /><p className="mt-3 text-sm text-slate-600">Cargando notebooks…</p></section>}
    {!loading && error && <section role="alert" className="mt-8 rounded-2xl border-2 border-red-200 bg-red-50 p-8 text-center"><p className="font-semibold text-red-800">No pudimos cargar tus notebooks</p><p className="mt-2 text-sm text-red-700">{error}</p><button onClick={() => void load()} className="mt-5 rounded-lg border-2 border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100">Reintentar</button></section>}
    {!loading && !error && notebooks.length === 0 && <section className="mt-8 rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center shadow-sm"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">📁</div><h2 className="mt-4 text-xl font-bold text-slate-900">Aún no tienes notebooks</h2><p className="mt-2 text-sm text-slate-600">Crea el primero para comenzar a organizar tus documentos.</p><button onClick={() => setShowForm(true)} className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md hover:bg-blue-700">Crear mi primer notebook</button></section>}
    {!loading && !error && notebooks.length > 0 && <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{notebooks.map((notebook) => <Link key={notebook.idNotebook} href={`/usuario/notebooks/${notebook.idNotebook}`} className="rounded-2xl border-2 border-slate-200 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md" style={{ backgroundImage: `linear-gradient(135deg, color-mix(in srgb, ${notebook.paletaColores?.principal ?? "#2563eb"} 14%, white), color-mix(in srgb, ${notebook.paletaColores?.secundaria ?? "#dbeafe"} 24%, white))` }}><div className="flex items-start justify-between"><span className="flex h-11 w-11 items-center justify-center rounded-xl text-xl" style={{ backgroundColor: notebook.paletaColores?.secundaria ?? "#dbeafe" }}>{notebook.icono === "folder" ? "📁" : (notebook.icono ?? "📁")}</span><span className="text-xs text-slate-500">{notebook.totalDocumentos} documentos</span></div><h2 className="mt-5 font-bold text-slate-900">{notebook.nombre}</h2><p className="mt-1 line-clamp-2 min-h-10 text-sm text-slate-600">{notebook.descripcion || "Sin descripción"}</p></Link>)}</div>}
    {showForm && <NotebookForm onCancel={() => setShowForm(false)} onCreated={(id) => router.push(`/usuario/notebooks/${id}`)} />}
  </main>;
}
