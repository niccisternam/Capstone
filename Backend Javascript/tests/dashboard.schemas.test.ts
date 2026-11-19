import { describe, expect, it } from "vitest";
import { consultaSchema, filtrosSchema, widgetInputSchema } from "../src/modules/dashboard/dashboard.schemas.js";

describe("dashboard: contrato de filtros", () => {
  it("acepta consulta por notebook, dirección y rango de meses", () => {
    expect(consultaSchema.safeParse({
      metrica: "resumen_montos",
      filtros: { direccion: "COMPRA", desde: "2026-01", hasta: "2026-06" },
    }).success).toBe(true);

    expect(consultaSchema.safeParse({
      metrica: "resumen_montos",
      filtros: { direccion: "COMPRA" },
    }).success).toBe(true);
  });

  it("rechaza meses con formato inválido", () => {
    for (const mes of ["2026-13", "2026-00", "2026-1", "13-2026", "2026/01", "enero"]) {
      expect(consultaSchema.safeParse({
        metrica: "resumen_montos",
        filtros: { direccion: "COMPRA", desde: mes },
      }).success).toBe(false);
    }
  });

  it("rechaza un rango invertido", () => {
    expect(consultaSchema.safeParse({
      metrica: "resumen_montos",
      filtros: { direccion: "COMPRA", desde: "2026-07", hasta: "2026-03" },
    }).success).toBe(false);
  });

  it("no permite guardar filtros de fecha en nuevos widgets", () => {
    expect(widgetInputSchema.safeParse({
      titulo: "Compras",
      metrica: "resumen_montos",
      filtros: { desde: "2026-01", direccion: "COMPRA" },
      visualizacion: "card",
    }).success).toBe(false);
  });

  it("limpia fechas heredadas de widgets ya guardados", () => {
    expect(filtrosSchema.strip().parse({
      desde: "2026-01",
      hasta: "2026-06",
      direccion: "COMPRA",
    })).toEqual({ direccion: "COMPRA" });
  });
});
