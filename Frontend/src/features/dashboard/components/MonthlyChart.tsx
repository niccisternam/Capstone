import type { DatoWidget } from "@/api/dashboard.api";
import { etiquetaRango, mesesDelRango, type RangoMeses } from "../periodos";
import { clp, clpCompacto, numero } from "./dashboardFormat";

export function TendenciaMensual({ filas, rango }: { filas: DatoWidget[]; rango: RangoMeses | null }) {
  // Con un periodo activo se muestran todos sus meses, incluidos los que no tienen compras.
  const periodos = rango
    ? (() => {
        const porPeriodo = new Map(filas.map((fila) => [String(fila.periodo ?? ""), fila]));
        return mesesDelRango(rango).map(
          (periodo) => porPeriodo.get(periodo) ?? { periodo, total: "0", documentos: 0 },
        );
      })()
    : filas.slice(-12);
  if (!periodos.length) return <p className="py-8 text-center text-sm text-slate-500">Aún no hay compras por periodo.</p>;

  const alto = 250;
  const margen = { arriba: 14, derecha: 12, abajo: 38, izquierda: 58 };
  // Cada mes conserva ~56 px para que las etiquetas del eje X no se solapen.
  const ancho = Math.max(720, periodos.length * 56 + margen.izquierda + margen.derecha);
  const anchoGrafico = ancho - margen.izquierda - margen.derecha;
  const altoGrafico = alto - margen.arriba - margen.abajo;
  const maximo = Math.max(...periodos.map((fila) => numero(fila.total)), 1) * 1.18;
  const espacio = anchoGrafico / periodos.length;
  const anchoBarra = Math.min(34, espacio * 0.56);
  const niveles = [0, 0.5, 1];

  return (
    <div className="overflow-x-auto">
      <figure className="rounded-xl bg-white px-3 pb-1 pt-4" style={{ minWidth: ancho }}>
        <svg
          viewBox={`0 0 ${ancho} ${alto}`}
          role="img"
          aria-label={rango ? `Compras mensuales de ${etiquetaRango(rango)}` : `Compras mensuales de los últimos ${periodos.length} periodos`}
          className="h-auto w-full overflow-visible"
        >
          <desc>Gráfico de barras verticales con el total confirmado por mes de emisión.</desc>
          {niveles.map((nivel) => {
            const y = margen.arriba + altoGrafico * (1 - nivel);
            return (
              <g key={nivel}>
                <line
                  x1={margen.izquierda}
                  x2={ancho - margen.derecha}
                  y1={y}
                  y2={y}
                  stroke={nivel === 0 ? "#c8d5e5" : "#e3eaf4"}
                  strokeDasharray={nivel === 0 ? undefined : "3 5"}
                />
                <text x={margen.izquierda - 8} y={y + 4} textAnchor="end" fill="#64748b" fontSize="12">
                  {clpCompacto(maximo * nivel)}
                </text>
              </g>
            );
          })}
          {periodos.map((fila, index) => {
            const valor = numero(fila.total);
            const barraAlto = (valor / maximo) * altoGrafico;
            const x = margen.izquierda + index * espacio + (espacio - anchoBarra) / 2;
            const y = margen.arriba + altoGrafico - barraAlto;
            const periodo = String(fila.periodo ?? "");
            const fecha = new Date(`${periodo}-01T12:00:00`);
            const mes = Number.isNaN(fecha.getTime())
              ? periodo
              : new Intl.DateTimeFormat("es-CL", { month: "short", year: "2-digit" }).format(fecha);
            return (
              <g key={periodo}>
                <rect
                  x={x}
                  y={y}
                  width={anchoBarra}
                  height={Math.max(barraAlto, 2)}
                  rx="5"
                  className="dashboard-bar"
                  style={{ animationDelay: `${index * 45}ms` }}
                  fill={index === periodos.length - 1 ? "#0f766e" : "#416fc0"}
                >
                  <title>{`${mes}: ${clp(valor)} · ${numero(fila.documentos)} documentos`}</title>
                </rect>
                {periodos.length <= 6 && (
                  <text
                    x={x + anchoBarra / 2}
                    y={Math.max(y - 8, margen.arriba + 10)}
                    textAnchor="middle"
                    fill="#233b5c"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {clpCompacto(valor)}
                  </text>
                )}
                <text x={x + anchoBarra / 2} y={alto - 13} textAnchor="middle" fill="#526780" fontSize="12">
                  {mes}
                </text>
              </g>
            );
          })}
        </svg>
      </figure>
      <p className="mt-2 text-right text-xs text-slate-500">
        {rango ? `Periodo: ${etiquetaRango(rango)}` : `Últimos ${periodos.length} periodos con compras`}
      </p>
    </div>
  );
}
