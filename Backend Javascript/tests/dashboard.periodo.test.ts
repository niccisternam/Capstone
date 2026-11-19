import { describe, expect, it } from "vitest";
import { limitesEmision, primerDiaMesSiguiente } from "../src/modules/dashboard/dashboard.periodo.js";

describe("dashboard: límites del rango de emisión", () => {
  it("convierte meses inclusivos en límites de fecha", () => {
    expect(limitesEmision({ desde: "2026-01", hasta: "2026-06" })).toEqual({
      desdeFecha: "2026-01-01",
      hastaExclusivo: "2026-07-01",
    });
  });

  it("calcula el mes siguiente, incluso al cruzar diciembre", () => {
    expect(primerDiaMesSiguiente("2026-01")).toBe("2026-02-01");
    expect(primerDiaMesSiguiente("2026-12")).toBe("2027-01-01");
  });

  it("acepta rangos abiertos y devuelve null sin filtro", () => {
    expect(limitesEmision({ desde: "2026-03" })).toEqual({ desdeFecha: "2026-03-01", hastaExclusivo: null });
    expect(limitesEmision({ hasta: "2026-03" })).toEqual({ desdeFecha: null, hastaExclusivo: "2026-04-01" });
    expect(limitesEmision({})).toBeNull();
  });
});
