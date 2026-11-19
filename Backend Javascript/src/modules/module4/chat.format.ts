// Respuestas inmediatas para consultas que devuelven una sola fila. Evitan la segunda
// llamada a Gemini (redacción), que es la mitad del tiempo de respuesta del chatbot y
// una de las dos oportunidades de caer en una cola lenta del proveedor de IA.

const MAX_COLUMNAS_LOCAL = 6;
const MAX_LARGO_LOCAL = 400;

const COLUMNA_MONETARIA = /(total|monto|neto|iva|exento|precio|gasto|compra|venta|ingreso|costo|saldo|pago|valor)/i;
const COLUMNA_NUMERICA = /(total|cantidad|monto|suma|precio|numero|count|promedio|neto|iva|exento|gasto|compra|venta|saldo|pago|valor|dias)/i;
const TEXTO_NUMERICO = /^-?\d+(?:\.\d+)?$/;
const FECHA_ISO = /^(\d{4})-(\d{2})-(\d{2})(?:[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)?$/;

const entero = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 2 });

function etiquetaColumna(columna: string): string {
  const texto = columna.replace(/_/g, " ").replace(/\s+/g, " ").trim();
  if (!texto) return "Valor";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function formatearMoneda(valor: number): string {
  return valor < 0 ? `-$${entero.format(Math.abs(valor))}` : `$${entero.format(valor)}`;
}

/**
 * pg devuelve numeric y bigint como texto, así que solo se interpretan como número
 * cuando el alias de la columna lo sugiere; un folio "2026" se conserva tal cual.
 */
function formatearValor(columna: string, valor: unknown): string {
  if (valor === null || valor === undefined) return "sin dato";
  const esMonetaria = COLUMNA_MONETARIA.test(columna);
  const esNumerica = esMonetaria || COLUMNA_NUMERICA.test(columna);

  if (typeof valor === "boolean") return valor ? "sí" : "no";

  if (typeof valor === "number") {
    if (!Number.isFinite(valor)) return String(valor);
    if (esMonetaria) return formatearMoneda(Math.round(valor));
    return Number.isInteger(valor) ? entero.format(valor) : decimal.format(valor);
  }

  if (typeof valor === "string") {
    const limpio = valor.trim();
    const fecha = FECHA_ISO.exec(limpio);
    if (fecha) return `${fecha[3]}/${fecha[2]}/${fecha[1]}`;
    if (esNumerica && TEXTO_NUMERICO.test(limpio)) {
      const numero = Number(limpio);
      if (Number.isFinite(numero)) {
        return esMonetaria ? formatearMoneda(Math.round(numero)) : decimal.format(numero);
      }
    }
    return limpio;
  }

  return String(valor);
}

/**
 * Devuelve true cuando la consulta devolvió una única fila sin ningún valor (por ejemplo
 * un SUM sin documentos): no hay nada que redactar ni que responder con formato.
 */
export function filaSinDatos(filas: Record<string, unknown>[]): boolean {
  const fila = filas[0];
  return filas.length === 1 && !!fila && Object.values(fila).every((valor) => valor === null || valor === undefined);
}

/**
 * Devuelve una respuesta ya redactada cuando la consulta entrega una única fila.
 * Si la fila es demasiado ancha o larga, devuelve null para que Gemini la redacte.
 */
export function respuestaLocal(filas: Record<string, unknown>[]): string | null {
  const fila = filas[0];
  if (filas.length !== 1 || !fila || filaSinDatos(filas)) return null;

  const columnas = Object.entries(fila);
  if (columnas.length === 0 || columnas.length > MAX_COLUMNAS_LOCAL) return null;

  const texto = columnas
    .map(([columna, valor]) => `${etiquetaColumna(columna)}: ${formatearValor(columna, valor)}`)
    .join(" · ");

  return texto.length > 0 && texto.length <= MAX_LARGO_LOCAL ? texto : null;
}
