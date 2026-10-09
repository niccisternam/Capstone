"use client";

import { useState } from "react";
import { z } from "zod";
import { createNotebook, updateNotebook } from "@/api/module1.api";
import { ApiError } from "@/api/api-error";
import { notebookInputSchema, type NotebookInput } from "@/api/module1.schemas";

const emptyValues: NotebookInput = {
  nombre: "",
  descripcion: "",
  icono: "📁",
  paletaColores: { principal: "#2563eb", secundaria: "#dbeafe" },
};

const iconOptions = ["📁", "📂", "🧾", "📊", "🏠", "🗃️", "⭐", "🚚", "🏢", "🏦", "🧮", "🏷️"];

export function NotebookForm({ onCreated, onCancel, initialValues, idNotebook }: { onCreated: (id: string) => void; onCancel: () => void; initialValues?: NotebookInput; idNotebook?: string }) {
  const editing = Boolean(idNotebook);
  const [values, setValues] = useState<NotebookInput>(initialValues ?? emptyValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update(field: keyof NotebookInput, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setServerError(null);
  }

  function updateColor(key: string, value: string) {
    setValues((current) => ({ ...current, paletaColores: { ...current.paletaColores, [key]: value } }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = notebookInputSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const [field, messages] of Object.entries(z.flattenError(parsed.error).fieldErrors as Record<string, string[] | undefined>)) {
        if (messages?.[0]) fieldErrors[field] = messages[0];
      }
      setErrors(fieldErrors);
      return;
    }
    setSaving(true);
    setServerError(null);
    try {
      const notebook = editing && idNotebook ? await updateNotebook(idNotebook, parsed.data) : await createNotebook(parsed.data);
      onCreated(notebook.idNotebook);
    } catch (error) {
      if (error instanceof ApiError && error.code === "NOTEBOOK_NAME_TAKEN") setServerError("Ya existe un notebook con ese nombre.");
      else setServerError(error instanceof Error ? error.message : "No fue posible crear el notebook.");
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/40 p-4" role="dialog" aria-modal="true" aria-labelledby="new-notebook-title">
      <form onSubmit={submit} className="w-full max-w-lg rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4"><div><h2 id="new-notebook-title" className="text-xl font-bold text-slate-900">{editing ? "Editar notebook" : "Crear notebook"}</h2><p className="mt-1 text-sm text-slate-500">Organiza tus documentos en un espacio de trabajo.</p></div><button type="button" onClick={onCancel} className="text-2xl leading-none text-slate-400 hover:text-slate-700" aria-label="Cerrar">×</button></div>
        {serverError && <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{serverError}</div>}
        <div className="mt-5 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">Nombre<input autoFocus value={values.nombre} onChange={(e) => update("nombre", e.target.value)} className="mt-1 w-full rounded-lg border-2 border-slate-200 px-3 py-2 font-normal outline-none focus:border-blue-500" maxLength={150} />{errors.nombre && <span className="mt-1 block text-xs font-normal text-red-600">{errors.nombre}</span>}</label>
          <label className="block text-sm font-semibold text-slate-700">Descripción<textarea value={values.descripcion} onChange={(e) => update("descripcion", e.target.value)} className="mt-1 min-h-24 w-full rounded-lg border-2 border-slate-200 px-3 py-2 font-normal outline-none focus:border-blue-500" maxLength={5000} /></label>
          <fieldset><legend className="text-sm font-semibold text-slate-700">Icono</legend><div className="mt-2 grid grid-cols-6 gap-2">{iconOptions.map((icon) => <button key={icon} type="button" onClick={() => update("icono", icon)} className={`flex h-12 items-center justify-center rounded-lg border-2 text-2xl transition ${values.icono === icon ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200" : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50"}`} aria-label={`Seleccionar icono ${icon}`} aria-pressed={values.icono === icon}>{icon}</button>)}</div></fieldset>
          <fieldset><legend className="text-sm font-semibold text-slate-700">Paleta de colores</legend><div className="mt-2 flex gap-4"><label className="flex items-center gap-2 text-xs text-slate-600">Principal<input type="color" value={values.paletaColores?.principal ?? "#2563eb"} onChange={(e) => updateColor("principal", e.target.value)} /></label><label className="flex items-center gap-2 text-xs text-slate-600">Secundaria<input type="color" value={values.paletaColores?.secundaria ?? "#dbeafe"} onChange={(e) => updateColor("secundaria", e.target.value)} /></label></div></fieldset>
        </div>
        <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onCancel} className="rounded-lg border-2 border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancelar</button><button disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{saving ? "Guardando…" : editing ? "Guardar cambios" : "Crear notebook"}</button></div>
      </form>
    </div>
  );
}
