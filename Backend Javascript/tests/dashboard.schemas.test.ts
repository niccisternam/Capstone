import { describe, expect, it } from "vitest";
import { consultaSchema, filtrosSchema, widgetInputSchema } from "../src/modules/dashboard/dashboard.schemas.js";

describe("dashboard: contrato sin filtros de fecha", () => {
  it("acepta consulta por notebook/dirección y rechaza desde/hasta", () => {
    expect(consultaSchema.safeParse({
      metrica: "resumen_montos",
      filtros: { direccion: "COMPRA" },
    }).success).toBe(true);

    expect(consultaSchema.safeParse({
      metrica: "resumen_montos",
      filtros: { desde: "2026-01-01", hasta: "2026-12-31", direccion: "COMPRA" },
    }).success).toBe(false);
  });

  it("no permite guardar filtros de fecha en nuevos widgets", () => {
    expect(widgetInputSchema.safeParse({
      titulo: "Compras",
      metrica: "resumen_montos",
      filtros: { desde: "2026-01-01", direccion: "COMPRA" },
      visualizacion: "card",
    }).success).toBe(false);
  });

  it("limpia fechas heredadas de widgets ya guardados", () => {
    expect(filtrosSchema.strip().parse({
      desde: "2026-01-01",
      hasta: "2026-12-31",
      direccion: "COMPRA",
    })).toEqual({ direccion: "COMPRA" });
  });
});
