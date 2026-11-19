// Separa el texto del asistente en bloques de texto y tablas Markdown para que el chat
// pueda renderizar tablas reales en vez de mostrar los pipes como texto plano.

export type TablaChat = { encabezados: string[]; filas: string[][] };
export type BloqueChat = { tipo: "texto"; contenido: string } | { tipo: "tabla"; tabla: TablaChat };

const CELDA_SEPARADORA = /^:?-{3,}:?$/;

function celdas(linea: string): string[] {
  const limpia = linea.trim();
  const sinBordeInicial = limpia.startsWith("|") ? limpia.slice(1) : limpia;
  const sinBordeFinal = sinBordeInicial.endsWith("|") ? sinBordeInicial.slice(0, -1) : sinBordeInicial;
  return sinBordeFinal.split(/(?<!\\)\|/).map((celda) => celda.replace(/\\\|/g, "|").trim());
}

function esFilaDeTabla(linea: string): boolean {
  return linea.includes("|");
}

function esSeparador(linea: string): boolean {
  const partes = celdas(linea);
  return partes.length > 0 && partes.every((parte) => CELDA_SEPARADORA.test(parte));
}

/**
 * Devuelve los bloques del mensaje en orden. Si no hay tablas, devuelve el texto original
 * en un único bloque para no alterar la respuesta.
 */
export function parsearMensaje(texto: string): BloqueChat[] {
  const lineas = texto.split(/\r?\n/);
  const bloques: BloqueChat[] = [];
  let textoPendiente: string[] = [];

  const volcarTexto = () => {
    if (!textoPendiente.length) return;
    const contenido = textoPendiente.join("\n").replace(/^\n+|\n+$/g, "");
    if (contenido) bloques.push({ tipo: "texto", contenido });
    textoPendiente = [];
  };

  let indice = 0;
  while (indice < lineas.length) {
    const linea = lineas[indice] ?? "";
    const siguiente = lineas[indice + 1] ?? "";
    if (!esFilaDeTabla(linea) || !esSeparador(siguiente)) {
      textoPendiente.push(linea);
      indice += 1;
      continue;
    }

    const encabezados = celdas(linea);
    if (encabezados.every((celda) => !celda)) {
      textoPendiente.push(linea);
      indice += 1;
      continue;
    }

    volcarTexto();
    const filas: string[][] = [];
    indice += 2;
    while (indice < lineas.length && esFilaDeTabla(lineas[indice] ?? "")) {
      const valores = celdas(lineas[indice] ?? "");
      // Filas incompletas se rellenan para que la tabla mantenga sus columnas.
      filas.push(encabezados.map((_, posicion) => valores[posicion] ?? ""));
      indice += 1;
    }
    bloques.push({ tipo: "tabla", tabla: { encabezados, filas } });
  }

  volcarTexto();
  return bloques.length ? bloques : [{ tipo: "texto", contenido: texto }];
}

export function contieneTabla(texto: string): boolean {
  return parsearMensaje(texto).some((bloque) => bloque.tipo === "tabla");
}
