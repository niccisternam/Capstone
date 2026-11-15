import { METRICAS } from "./dashboard.metrics.js";
import { z } from "zod";

export const metricaSchema = z.enum(METRICAS);
export const visualizacionSchema = z.enum(["bar", "line", "pie", "card", "table"]);
export const direccionSchema = z.enum(["COMPRA", "VENTA", "TODAS"]);

export const filtrosSchema = z.object({
  direccion: direccionSchema.default("COMPRA"),
}).strict();

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
  filtros: filtrosSchema.default({ direccion: "COMPRA" }),
});

export const sugerenciaSchema = z.object({ pregunta: z.string().trim().min(1).max(1000) });
