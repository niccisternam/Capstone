import { METRICAS } from "./dashboard.metrics.js";
import { z } from "zod";

export const metricaSchema = z.enum(METRICAS);
export const visualizacionSchema = z.enum(["bar", "line", "pie", "card", "table"]);
export const direccionSchema = z.enum(["COMPRA", "VENTA", "TODAS"]);
export const mesSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Se esperaba un mes en formato YYYY-MM");

// Los widgets guardados mantienen solo la dirección; las fechas heredadas se ignoran.
export const filtrosSchema = z.object({
  direccion: direccionSchema.default("COMPRA"),
}).strict();

export const filtrosConsultaSchema = z.object({
  direccion: direccionSchema.default("COMPRA"),
  desde: mesSchema.optional(),
  hasta: mesSchema.optional(),
}).strict().refine(
  (filtros) => !filtros.desde || !filtros.hasta || filtros.desde <= filtros.hasta,
  { message: "El mes inicial no puede ser posterior al mes final", path: ["desde"] },
);

export const widgetInputSchema = z.object({
  titulo: z.string().trim().min(1).max(150),
  metrica: metricaSchema,
  filtros: filtrosSchema.default({ direccion: "COMPRA" }),
  visualizacion: visualizacionSchema.default("bar"),
  orden: z.number().int().min(0).default(0),
});

export const widgetUpdateSchema = widgetInputSchema.partial();

export const consultaSchema = z.object({
  metrica: metricaSchema,
  filtros: filtrosConsultaSchema.default({ direccion: "COMPRA" }),
});

export const sugerenciaSchema = z.object({ pregunta: z.string().trim().min(1).max(1000) });
