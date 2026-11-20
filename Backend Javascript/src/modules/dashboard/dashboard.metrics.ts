import type { PrismaClient } from "../../generated/prisma/client.js";
import { Prisma } from "../../generated/prisma/client.js";
import { limitesEmision } from "./dashboard.periodo.js";

// Catálogo cerrado: la IA y el frontend solo pueden pedir estas métricas.
export const METRICAS = [
  "resumen_montos",
  "compras_por_periodo",
  "compras_por_proveedor",
  "compras_por_producto",
  "pagos_pendientes",
  "descuentos_recargos",
] as const;

export type Metrica = (typeof METRICAS)[number];

export const DESCRIPCION_METRICAS: Record<Metrica, string> = {
  resumen_montos: "Totales confirmados del periodo: neto, IVA, exento, total y cantidad de documentos.",
  compras_por_periodo: "Total confirmado por mes de emisión (periodo YYYY-MM).",
  compras_por_proveedor: "Total confirmado por proveedor (RUT y razón social del emisor).",
  compras_por_producto: "Cantidad y total de las líneas confirmadas, agrupados por descripción.",
  pagos_pendientes: "Total confirmado cuyo estado de pago es PENDIENTE.",
  descuentos_recargos: "Descuentos y recargos confirmados, separados por línea y globales.",
};

export type Filtros = {
  direccion?: "COMPRA" | "VENTA" | "TODAS";
  /** Mes inicial inclusivo en formato YYYY-MM. */
  desde?: string;
  /** Mes final inclusivo en formato YYYY-MM. */
  hasta?: string;
};

function rangoEmision(filtros: Filtros) {
  const limites = limitesEmision(filtros);
  if (!limites) return Prisma.empty;

  const condiciones = [
    limites.desdeFecha ? Prisma.sql`r."fecha_emision" >= ${limites.desdeFecha}::date` : null,
    limites.hastaExclusivo ? Prisma.sql`r."fecha_emision" < ${limites.hastaExclusivo}::date` : null,
  ].filter((condicion): condicion is Prisma.Sql => condicion !== null);

  return Prisma.sql`AND ${Prisma.join(condiciones, " AND ")}`;
}

// Revisión CONFIRMADA es única por documento (índice parcial), así que no duplica filas.
function base(idEmpresa: string, idNotebook: string, filtros: Filtros, extra = Prisma.empty) {
  const direccion = filtros.direccion ?? "COMPRA";
  return Prisma.sql`
    FROM "documento" d
    JOIN "revision_documento" r ON r."id_documento" = d."id_documento" AND r."estado" = 'CONFIRMADA'
    ${extra}
    WHERE d."estado" = 'CONFIRMADO'
      AND d."id_empresa" = ${idEmpresa}::uuid
      AND d."id_notebook" = ${idNotebook}::uuid
      AND (${direccion} = 'TODAS' OR d."direccion"::text = ${direccion})
      ${rangoEmision(filtros)}
  `;
}

const detalleJoin = Prisma.sql`JOIN "detalle_revision" l ON l."id_revision" = r."id_revision"`;
const ajusteJoin = Prisma.sql`JOIN "ajuste_global_revision" a ON a."id_revision" = r."id_revision"`;

export async function ejecutarMetrica(
  prisma: PrismaClient,
  params: { idEmpresa: string; idNotebook: string; metrica: Metrica; filtros: Filtros },
): Promise<Record<string, unknown>[]> {
  const { idEmpresa, idNotebook, metrica, filtros } = params;
  switch (metrica) {
    case "resumen_montos":
      return prisma.$queryRaw<Record<string, unknown>[]>`
        SELECT COALESCE(SUM(r."neto"), 0)::text AS neto,
               COALESCE(SUM(r."iva"), 0)::text AS iva,
               COALESCE(SUM(r."exento"), 0)::text AS exento,
               COALESCE(SUM(r."total"), 0)::text AS total,
               COUNT(*)::int AS documentos
        ${base(idEmpresa, idNotebook, filtros)}
      `;
    case "compras_por_periodo":
      return prisma.$queryRaw<Record<string, unknown>[]>`
        SELECT to_char(date_trunc('month', r."fecha_emision"), 'YYYY-MM') AS periodo,
               COALESCE(SUM(r."total"), 0)::text AS total,
               COUNT(*)::int AS documentos
        ${base(idEmpresa, idNotebook, filtros)}
          AND r."fecha_emision" IS NOT NULL
        GROUP BY 1
        ORDER BY 1
      `;
    case "compras_por_proveedor":
      // En una compra la contraparte es el emisor (proveedor); en una venta, el receptor (cliente).
      return prisma.$queryRaw<Record<string, unknown>[]>`
        SELECT COALESCE(CASE WHEN d."direccion"::text = 'VENTA' THEN r."receptor_nombre" ELSE r."emisor_razon_social" END, 'Sin contraparte') AS proveedor,
               COALESCE(CASE WHEN d."direccion"::text = 'VENTA' THEN r."receptor_rut" ELSE r."emisor_rut" END, '') AS rut,
               COALESCE(SUM(r."total"), 0)::text AS total,
               COUNT(*)::int AS documentos
        ${base(idEmpresa, idNotebook, filtros)}
        GROUP BY 1, 2
        ORDER BY SUM(r."total") DESC NULLS LAST
        LIMIT 20
      `;
    case "compras_por_producto":
      return prisma.$queryRaw<Record<string, unknown>[]>`
        SELECT COALESCE(l."descripcion", 'Sin descripción') AS producto,
               COALESCE(SUM(l."cantidad"), 0)::text AS cantidad,
               COALESCE(SUM(l."total_linea"), 0)::text AS total,
               COUNT(*)::int AS lineas
        ${base(idEmpresa, idNotebook, filtros, detalleJoin)}
        GROUP BY 1
        ORDER BY SUM(l."total_linea") DESC NULLS LAST
        LIMIT 20
      `;
    case "pagos_pendientes":
      return prisma.$queryRaw<Record<string, unknown>[]>`
        SELECT COALESCE(SUM(r."total"), 0)::text AS pendiente,
               COUNT(*)::int AS documentos
        ${base(idEmpresa, idNotebook, filtros)}
          AND r."estado_pago" = 'PENDIENTE'
      `;
    case "descuentos_recargos":
      // Una línea puede traer el descuento/recargo como monto o como porcentaje.
      return prisma.$queryRaw<Record<string, unknown>[]>`
        SELECT origen, tipo, COALESCE(SUM(valor), 0)::text AS total, COUNT(*)::int AS registros
        FROM (
          SELECT 'LINEA' AS origen, 'DESCUENTO' AS tipo,
                 COALESCE(l."descuento_monto", l."precio_unitario" * l."cantidad" * l."descuento_porcentaje" / 100) AS valor
          ${base(idEmpresa, idNotebook, filtros, detalleJoin)}
          UNION ALL
          SELECT 'LINEA', 'RECARGO',
                 COALESCE(l."recargo_monto", l."precio_unitario" * l."cantidad" * l."recargo_porcentaje" / 100)
          ${base(idEmpresa, idNotebook, filtros, detalleJoin)}
          UNION ALL
          SELECT 'GLOBAL', a."tipo"::text, a."valor"
          ${base(idEmpresa, idNotebook, filtros, ajusteJoin)}
        ) movimientos
        WHERE valor IS NOT NULL
        GROUP BY origen, tipo
        ORDER BY origen, tipo
      `;
  }
}
