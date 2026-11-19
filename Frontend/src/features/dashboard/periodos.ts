export type TipoPeriodo = "todo" | "rango" | "semestre" | "anio";

export type FiltrosPeriodo =
  | { tipo: "todo" }
  | { tipo: "rango"; desde: string; hasta: string }
  | { tipo: "semestre"; anio: number; semestre: 1 | 2 }
  | { tipo: "anio"; anio: number };

export type RangoMeses = { desde: string; hasta: string };

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const MES_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;

const dosDigitos = (valor: number) => String(valor).padStart(2, "0");

export function esMesValido(valor: string): boolean {
  return MES_PATTERN.test(valor);
}

export function validarRango(desde: string, hasta: string): string | null {
  if (!esMesValido(desde) || !esMesValido(hasta)) return "Selecciona el mes inicial y el mes final.";
  if (desde > hasta) return "El mes inicial no puede ser posterior al mes final.";
  return null;
}

/** Convierte la selección de la barra de filtros en un rango de meses inclusivo. */
export function resolverPeriodo(filtros: FiltrosPeriodo): RangoMeses | null {
  switch (filtros.tipo) {
    case "todo":
      return null;
    case "rango":
      return validarRango(filtros.desde, filtros.hasta) ? null : { desde: filtros.desde, hasta: filtros.hasta };
    case "semestre": {
      const inicio = filtros.semestre === 1 ? 1 : 7;
      return { desde: `${filtros.anio}-${dosDigitos(inicio)}`, hasta: `${filtros.anio}-${dosDigitos(inicio + 5)}` };
    }
    case "anio":
      return { desde: `${filtros.anio}-01`, hasta: `${filtros.anio}-12` };
  }
}

/** Lista todos los meses (YYYY-MM) entre dos límites inclusivos. */
export function mesesDelRango({ desde, hasta }: RangoMeses): string[] {
  if (validarRango(desde, hasta)) return [];

  let [anio, mes] = desde.split("-").map(Number);
  const [anioFinal, mesFinal] = hasta.split("-").map(Number);
  const meses: string[] = [];

  while (anio < anioFinal || (anio === anioFinal && mes <= mesFinal)) {
    meses.push(`${anio}-${dosDigitos(mes)}`);
    mes += 1;
    if (mes > 12) {
      mes = 1;
      anio += 1;
    }
  }

  return meses;
}

export function etiquetaRango({ desde, hasta }: RangoMeses): string {
  const [anioDesde, mesDesde] = desde.split("-").map(Number);
  const [anioHasta, mesHasta] = hasta.split("-").map(Number);
  return `${MESES[mesDesde - 1]} ${anioDesde} – ${MESES[mesHasta - 1]} ${anioHasta}`;
}

export function etiquetaPeriodo(filtros: FiltrosPeriodo): string {
  switch (filtros.tipo) {
    case "todo":
      return "Todo el historial";
    case "rango": {
      const error = validarRango(filtros.desde, filtros.hasta);
      return error ? "Rango incompleto" : etiquetaRango(filtros);
    }
    case "semestre":
      return filtros.semestre === 1 ? `S1 ${filtros.anio} · Enero – Junio` : `S2 ${filtros.anio} · Julio – Diciembre`;
    case "anio":
      return `Año ${filtros.anio}`;
  }
}

/** Selección por defecto al cambiar de tipo de periodo. */
export function periodoInicial(tipo: TipoPeriodo, hoy: Date = new Date()): FiltrosPeriodo {
  const anio = hoy.getFullYear();
  const mes = hoy.getMonth() + 1;

  switch (tipo) {
    case "todo":
      return { tipo: "todo" };
    case "rango":
      return { tipo: "rango", desde: `${anio}-01`, hasta: `${anio}-${dosDigitos(mes)}` };
    case "semestre":
      return { tipo: "semestre", anio, semestre: mes <= 6 ? 1 : 2 };
    case "anio":
      return { tipo: "anio", anio };
  }
}
