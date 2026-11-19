export type RangoMeses = {
  /** Mes inicial inclusivo en formato YYYY-MM. */
  desde?: string;
  /** Mes final inclusivo en formato YYYY-MM. */
  hasta?: string;
};

export type LimitesEmision = {
  desdeFecha: string | null;
  hastaExclusivo: string | null;
};

/** Primer día del mes siguiente, en formato YYYY-MM-DD. */
export function primerDiaMesSiguiente(mes: string): string {
  const [anio = 1970, numeroMes = 1] = mes.split("-").map(Number);
  return new Date(Date.UTC(anio, numeroMes, 1)).toISOString().slice(0, 10);
}

/**
 * Convierte meses inclusivos (YYYY-MM) en límites de fecha para filtrar
 * `fecha_emision`: [primer día del mes inicial, primer día del mes siguiente al final).
 */
export function limitesEmision(rango: RangoMeses): LimitesEmision | null {
  const { desde, hasta } = rango;
  if (!desde && !hasta) return null;
  return {
    desdeFecha: desde ? `${desde}-01` : null,
    hastaExclusivo: hasta ? primerDiaMesSiguiente(hasta) : null,
  };
}
