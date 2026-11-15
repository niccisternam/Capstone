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

const resultadoSchema = z.object({
  metrica: metricaSchema,
  filtros: z.object({
    direccion: z.enum(["COMPRA", "VENTA", "TODAS"]),
  }),
  datos: z.array(z.record(z.string(), z.unknown())),
  actualizadoEn: z.string(),
});

export async function consultarMetrica(idNotebook: string, metrica: Metrica): Promise<ResultadoMetrica> {
  const id = parseIdentifier(idNotebook);
  const path = `/dashboard/notebooks/${encodeURIComponent(id)}/query`;
  return call(
    () => request<unknown>(
      path,
      { method: "POST", body: JSON.stringify({ metrica, filtros: { direccion: "COMPRA" } }) },
      getAccessToken(),
    ),
    resultadoSchema,
  );
}
