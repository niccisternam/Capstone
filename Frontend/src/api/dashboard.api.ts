import { z } from "zod";
import { getAccessToken, request } from "./client";
import { call, parseIdentifier } from "./module1.api";

export const metricas = [
  "resumen_montos",
  "compras_por_periodo",
  "compras_por_proveedor",
  "compras_por_producto",
  "pagos_pendientes",
  "descuentos_recargos",
] as const;

export const metricaSchema = z.enum(metricas);
export type Metrica = z.infer<typeof metricaSchema>;
export type DatoWidget = Record<string, unknown>;

export interface ResultadoMetrica {
  metrica: Metrica;
  datos: DatoWidget[];
  actualizadoEn: string;
}

/** Compras, ventas o ambas. Mismo catálogo que `direccionSchema` del backend. */
export type Direccion = "COMPRA" | "VENTA" | "TODAS";

export type FiltrosConsulta = {
  direccion?: Direccion;
  /** Mes inicial inclusivo en formato YYYY-MM. */
  desde?: string;
  /** Mes final inclusivo en formato YYYY-MM. */
  hasta?: string;
};

const mesSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);

const resultadoSchema = z.object({
  metrica: metricaSchema,
  filtros: z.object({
    direccion: z.enum(["COMPRA", "VENTA", "TODAS"]),
    desde: mesSchema.optional(),
    hasta: mesSchema.optional(),
  }),
  datos: z.array(z.record(z.string(), z.unknown())),
  actualizadoEn: z.string(),
});

export async function consultarMetrica(
  idNotebook: string,
  metrica: Metrica,
  filtros: FiltrosConsulta = { direccion: "COMPRA" },
): Promise<ResultadoMetrica> {
  const id = parseIdentifier(idNotebook);
  const path = `/dashboard/notebooks/${encodeURIComponent(id)}/query`;
  return call(
    () => request<unknown>(
      path,
      { method: "POST", body: JSON.stringify({ metrica, filtros: { direccion: "COMPRA", ...filtros } }) },
      getAccessToken(),
    ),
    resultadoSchema,
  );
}
