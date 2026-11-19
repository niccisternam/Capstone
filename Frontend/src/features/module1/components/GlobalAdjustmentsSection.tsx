import type { AjusteGlobalExtraccion } from "@/api/module1.schemas";
import { text, type SetReviewAdjustment } from "./documentReviewForm";

export function GlobalAdjustmentsSection({
  ajustes,
  setAdjustment,
}: {
  ajustes: AjusteGlobalExtraccion[];
  setAdjustment: SetReviewAdjustment;
}) {
  return (
    <section className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold">Ajustes globales</h2>
      {ajustes.map((ajuste, index) => (
        <div key={ajuste.idAjuste} className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-4">
          <label className="text-xs font-semibold">
            Tipo
            <select
              value={ajuste.tipo}
              onChange={(event) => setAdjustment(index, "tipo", event.target.value)}
              className="mt-1 w-full rounded border px-2 py-1.5"
            >
              <option>DESCUENTO</option>
              <option>RECARGO</option>
            </select>
          </label>
          <label className="text-xs font-semibold">
            Modalidad
            <select
              value={ajuste.modalidad}
              onChange={(event) => setAdjustment(index, "modalidad", event.target.value)}
              className="mt-1 w-full rounded border px-2 py-1.5"
            >
              <option>PORCENTAJE</option>
              <option>MONTO</option>
            </select>
          </label>
          {(["valor", "descripcion"] as const).map((campo) => (
            <label key={campo} className="text-xs font-semibold">
              {campo}
              <input
                value={text(ajuste[campo] as string | null)}
                onChange={(event) => setAdjustment(index, campo, event.target.value || null)}
                className="mt-1 w-full rounded border px-2 py-1.5 font-normal"
              />
            </label>
          ))}
        </div>
      ))}
    </section>
  );
}
