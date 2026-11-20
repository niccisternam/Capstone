import { METRICAS } from "./dashboard.metrics.js";
import { z } from "zod";

export const metricaSchema = z.enum(METRICAS);
export const direccionSchema = z.enum(["COMPRA", "VENTA", "TODAS"]);
export const mesSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Se esperaba un mes en formato YYYY-MM");

export const filtrosConsultaSchema = z.object({
  direccion: direccionSchema.default("COMPRA"),
  desde: mesSchema.optional(),
  hasta: mesSchema.optional(),
}).strict().refine(
  (filtros) => !filtros.desde || !filtros.hasta || filtros.desde <= filtros.hasta,
  { message: "El mes inicial no puede ser posterior al mes final", path: ["desde"] },
);

export const consultaSchema = z.object({
  metrica: metricaSchema,
  filtros: filtrosConsultaSchema.default({ direccion: "COMPRA" }),
});
