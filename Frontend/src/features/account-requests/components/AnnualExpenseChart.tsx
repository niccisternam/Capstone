import React from "react";

export interface MonthlyExpenseData {
  month: string;
  amountM: number; // en millones (escala 0 a 50M)
}

export const ANNUAL_CHART_DATA: MonthlyExpenseData[] = [
  { month: "JAN", amountM: 25 },
  { month: "FEB", amountM: 45 },
  { month: "MAR", amountM: 50 },
  { month: "APR", amountM: 44 },
  { month: "MAY", amountM: 50 },
  { month: "JUN", amountM: 25 },
  { month: "JUL", amountM: 22 },
  { month: "AUG", amountM: 38 },
  { month: "SEP", amountM: 50 },
  { month: "OCT", amountM: 48 },
  { month: "NOV", amountM: 22 },
  { month: "DEC", amountM: 45 },
];

export function AnnualExpenseChart() {
  const maxScale = 50; // 50 M

  return (
    <div
      aria-label="Gráfico de barras de gestión de gastos anuales de enero a diciembre"
      className="relative mt-8 w-full select-none"
    >
      {/* Contenedor del área de trazado con eje Y y barras */}
      <div className="relative flex items-end">
        {/* Eje Y con etiqueta 50 M y 0 */}
        <div className="flex h-44 w-12 flex-col justify-between pr-2 text-right text-xs font-semibold text-slate-500">
          <span>50 M</span>
          <span>0</span>
        </div>

        {/* Área del gráfico de 12 barras */}
        <div className="relative flex h-44 flex-1 items-end justify-between gap-1.5 sm:gap-3 border-b-2 border-slate-600 pb-px">
          {/* Línea horizontal superior de 50 M */}
          <div className="pointer-events-none absolute inset-x-0 top-0 border-t border-slate-300" />

          {ANNUAL_CHART_DATA.map((item) => {
            const heightPercent = Math.round((item.amountM / maxScale) * 100);

            return (
              <div
                key={item.month}
                className="group relative flex h-full flex-1 flex-col justify-end items-center"
              >
                {/* Tooltip flotante al pasar el cursor */}
                <div className="pointer-events-none absolute -top-7 hidden rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-white shadow group-hover:block z-10">
                  {item.amountM}M
                </div>

                {/* Barra vertical con sombreado y borde según el boceto */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full max-w-10 rounded-t-xs border-2 border-slate-600 bg-slate-400 shadow-2xs transition-all group-hover:bg-slate-500"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Etiquetas de los 12 meses al pie del gráfico */}
      <div className="flex w-full pl-12 pt-2">
        <div className="flex w-full justify-between gap-1.5 sm:gap-3">
          {ANNUAL_CHART_DATA.map((item) => (
            <span
              key={item.month}
              className="flex-1 text-center text-[10px] sm:text-xs font-semibold text-slate-600 tracking-tight"
            >
              {item.month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
