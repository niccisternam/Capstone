import { text, type DetalleFormulario, type SetReviewDetail } from "./documentReviewForm";

const CAMPOS: (keyof DetalleFormulario)[] = [
  "descripcion",
  "cantidad",
  "unidad",
  "precioUnitario",
  "descuentoPorcentaje",
  "descuentoMonto",
  "recargoPorcentaje",
  "recargoMonto",
  "totalLinea",
];

export function DocumentDetailsSection({
  detalles,
  setDetail,
}: {
  detalles: DetalleFormulario[];
  setDetail: SetReviewDetail;
}) {
  return (
    <section className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold">Detalles</h2>
      {detalles.map((detalle, index) => (
        <div key={detalle.idDetalle} className="mt-5 rounded-xl bg-slate-50 p-4">
          <h3 className="font-semibold">Item {detalle.numeroLinea}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {CAMPOS.map((campo) => (
              <label key={campo} className="text-xs font-semibold text-slate-600">
                {campo}
                <input
                  value={text(detalle[campo] as string | null)}
                  onChange={(event) => setDetail(index, campo, event.target.value || null)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm font-normal"
                />
              </label>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
