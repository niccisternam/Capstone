import type { TablaChat } from "../chatTable";

const NUMERO = /^-?\$?\s*\d[\d.,]*$/;

function esColumnaNumerica(tabla: TablaChat, posicion: number): boolean {
  const valores = tabla.filas.map((fila) => (fila[posicion] ?? "").trim()).filter(Boolean);
  return valores.length > 0 && valores.every((valor) => NUMERO.test(valor));
}

/** Renderiza una tabla Markdown ya separada por `parsearMensaje`. */
export function TablaMensaje({ tabla }: { tabla: TablaChat }) {
  const numericas = tabla.encabezados.map((_, posicion) => esColumnaNumerica(tabla, posicion));

  return (
    <div className="my-2 overflow-x-auto whitespace-normal rounded-lg border border-slate-200">
      <table className="w-full min-w-[420px] border-collapse text-left text-[13px]">
        <thead>
          <tr className="bg-slate-100 text-slate-700">
            {tabla.encabezados.map((encabezado, posicion) => (
              <th
                key={posicion}
                scope="col"
                className={`border-b border-slate-200 px-3 py-2 font-semibold ${numericas[posicion] ? "text-right" : ""}`}
              >
                {encabezado}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tabla.filas.map((fila, posicionFila) => (
            <tr key={posicionFila} className={posicionFila % 2 ? "bg-slate-50" : "bg-white"}>
              {tabla.encabezados.map((_, posicion) => (
                <td
                  key={posicion}
                  className={`${posicionFila === tabla.filas.length - 1 ? "" : "border-b border-slate-100"} px-3 py-2 align-top ${numericas[posicion] ? "text-right tabular-nums" : ""}`}
                >
                  {fila[posicion] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
