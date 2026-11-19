import { ReviewField } from "./ReviewField";
import type { ReviewFormState, SetReviewField } from "./documentReviewForm";

export function ReviewTotalsSection({
  form,
  setField,
  saving,
  confirming,
  allConfirmed,
  dirty,
  editingConfirmed,
  batchMode,
  onSave,
  onConfirm,
  onDone,
}: {
  form: ReviewFormState;
  setField: SetReviewField;
  saving: boolean;
  confirming: boolean;
  allConfirmed: boolean;
  dirty: boolean;
  editingConfirmed: boolean;
  batchMode: boolean;
  onSave: () => void;
  onConfirm: () => void;
  onDone: () => void;
}) {
  return (
    <section className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold">Totales y confirmación interna</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <ReviewField label="Neto" value={form.neto} onChange={(value) => setField("neto", value)} />
        <ReviewField label="IVA" value={form.iva} onChange={(value) => setField("iva", value)} />
        <ReviewField label="Exento" value={form.exento} onChange={(value) => setField("exento", value)} />
        <ReviewField label="Total" value={form.total} onChange={(value) => setField("total", value)} />
        <label className="text-sm font-semibold">
          Estado de pago interno
          <select
            value={form.estadoPago}
            onChange={(event) => setField("estadoPago", event.target.value)}
            className="mt-1 w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 font-normal"
          >
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="PAGADO">PAGADO</option>
          </select>
        </label>
        <label className="text-sm font-semibold">
          Observación
          <textarea
            value={form.observacion}
            onChange={(event) => setField("observacion", event.target.value)}
            className="mt-1 min-h-24 w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 font-normal"
          />
        </label>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Al confirmar se guardan automáticamente tus cambios y el documento pasa a estado Confirmado.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {editingConfirmed && !batchMode && !allConfirmed && (
          <button
            disabled={saving || confirming}
            onClick={onSave}
            className="rounded-lg border-2 border-blue-600 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition-all hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-md disabled:opacity-50"
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
        )}
        <button
          disabled={saving || confirming || (allConfirmed && !dirty)}
          onClick={onConfirm}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md disabled:opacity-50"
        >
          {confirming
            ? "Guardando y confirmando…"
            : allConfirmed && !dirty
              ? "Documento confirmado"
              : editingConfirmed
                ? "Guardar y confirmar cambios"
                : "Confirmar documento"}
        </button>
        {allConfirmed && !batchMode && (
          <button
            onClick={onDone}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md"
          >
            Finalizar y volver al notebook
          </button>
        )}
      </div>
    </section>
  );
}
