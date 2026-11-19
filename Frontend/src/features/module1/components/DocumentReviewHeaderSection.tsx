import { ReviewField } from "./ReviewField";
import type { ReviewFormState, SetReviewField } from "./documentReviewForm";

const CONDICIONES = ["AFECTA", "EXENTA", "NO_AFECTA", "MIXTA"];

export function DocumentReviewHeaderSection({
  form,
  setField,
}: {
  form: ReviewFormState;
  setField: SetReviewField;
}) {
  return (
    <section className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold">Encabezado y participantes</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <ReviewField label="Tipo de documento" value={form.tipoDocumento} onChange={(value) => setField("tipoDocumento", value)} />
        <ReviewField label="Folio" value={form.folio} onChange={(value) => setField("folio", value)} />
        <ReviewField label="Fecha de emisión" type="date" value={form.fechaEmision} onChange={(value) => setField("fechaEmision", value)} />
        <label className="text-sm font-semibold">
          Condición tributaria
          <select
            value={form.condicionTributaria}
            onChange={(event) => setField("condicionTributaria", event.target.value)}
            className="mt-1 w-full rounded-lg border-2 border-slate-200 px-3 py-2 font-normal"
          >
            <option value="">Sin informar</option>
            {CONDICIONES.map((condicion) => (
              <option key={condicion}>{condicion}</option>
            ))}
          </select>
        </label>
        <ReviewField label="RUT emisor" value={form.emisorRut} onChange={(value) => setField("emisorRut", value)} />
        <ReviewField label="Razón social emisor" value={form.emisorRazonSocial} onChange={(value) => setField("emisorRazonSocial", value)} />
        <ReviewField label="RUT receptor" value={form.receptorRut} onChange={(value) => setField("receptorRut", value)} />
        <ReviewField label="Nombre receptor" value={form.receptorNombre} onChange={(value) => setField("receptorNombre", value)} />
        <ReviewField label="Medio de pago extraído" value={form.medioPago} onChange={(value) => setField("medioPago", value)} />
      </div>
    </section>
  );
}
