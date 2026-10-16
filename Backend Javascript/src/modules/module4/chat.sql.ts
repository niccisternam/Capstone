import type { PrismaClient } from "../../generated/prisma/client.js";
import { AppError } from "../../shared/errors/app-error.js";
import type { Module1Identity } from "../module1/module1.types.js";

export const MAX_FILAS = 200;

// Sin ";", comentarios, comillas dobles, "$" ni "\" no hay segunda sentencia, nombres disfrazados
// ni literales ambiguos, así que toda llamada a función queda visible como `nombre(`. El catálogo
// (pg_*, information_schema) no tiene datos de negocio, pero expondría la estructura de la base.
const PROHIBIDO = /;|--|\/\*|"|\$|\\|\bpg_|\binformation_schema\b/i;

// Lista cerrada: funciones como query_to_xml o ts_stat ejecutan SQL armado en un texto y podrían
// cambiar app.id_empresa con set_config; cualquier nombre no listado se rechaza.
const PERMITIDAS = new Set([
  "sum", "count", "avg", "min", "max", "round", "coalesce", "nullif", "lower", "upper", "trim", "date_trunc", "extract",
  "to_char", "abs", "greatest", "least", "now", "current_date", "string_agg", "rank", "row_number", "dense_rank",
  "select", "from", "where", "and", "or", "not", "in", "exists", "as", "on", "using", "join", "over", "filter", "by",
  "then", "else", "when", "case", "any", "all", "values", "numeric", "date", "interval", "cast", "partition",
]);

export function validarConsultaChat(sql: string): string {
  const consulta = sql.trim();
  const sinLiterales = consulta.replace(/'(?:[^']|'')*'/g, "''");
  const funciones = [...sinLiterales.matchAll(/([a-z_][a-z0-9_]*)\s*\(/gi)].map((match) => match[1]!.toLowerCase());
  if (!/^(select|with)\b/i.test(consulta) || PROHIBIDO.test(consulta) || consulta.length > 4000 || funciones.some((nombre) => !PERMITIDAS.has(nombre))) {
    throw new AppError(422, "CHAT_QUERY_REJECTED", "No pude convertir tu pregunta en una consulta segura. Intenta reformularla.");
  }
  return consulta;
}

/**
 * Ejecuta la consulta de la IA en una transacción de solo lectura, con el rol chat_lector
 * (solo puede leer v_chat_documentos y v_chat_detalles) y con la empresa y el notebook fijados
 * por el backend; las vistas filtran por esos valores, así que la IA no controla el aislamiento.
 */
export async function ejecutarConsultaChat(prisma: PrismaClient, identity: Module1Identity, idNotebook: string, sql: string) {
  const consulta = validarConsultaChat(sql);
  try {
    const filas = await prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe("SET TRANSACTION READ ONLY");
      await tx.$queryRaw`SELECT set_config('app.id_empresa', ${identity.idEmpresa}, true), set_config('app.id_notebook', ${idNotebook}, true), set_config('statement_timeout', '5000', true)`;
      await tx.$executeRawUnsafe("SET LOCAL ROLE chat_lector");
      // Envolver en un subselect obliga a una única sentencia SELECT y acota las filas.
      return tx.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM (${consulta}) AS consulta LIMIT ${MAX_FILAS}`);
    }, { timeout: 10_000 });
    return JSON.parse(JSON.stringify(filas, (_key, value: unknown) => typeof value === "bigint" ? value.toString() : value)) as Record<string, unknown>[];
  } catch (error) {
    if (error instanceof AppError) throw error;
    // Sin este registro, un rol chat_lector mal configurado se vería solo como "reformula la pregunta".
    console.error(JSON.stringify({ level: "error", event: "chat_query_failed", errorType: error instanceof Error ? error.name : "Error", message: error instanceof Error ? error.message : String(error) }));
    throw new AppError(422, "CHAT_QUERY_FAILED", "No pude obtener los datos para responder esa pregunta. Intenta reformularla.");
  }
}
