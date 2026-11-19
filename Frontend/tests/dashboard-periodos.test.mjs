import test from "node:test";
import assert from "node:assert/strict";
import { loadTsModule } from "./helpers/ts-module-loader.mjs";

const periodos = await loadTsModule("src/features/dashboard/periodos.ts");

test("resolverPeriodo convierte semestres y años en rangos inclusivos", () => {
  assert.deepEqual(periodos.resolverPeriodo({ tipo: "semestre", anio: 2026, semestre: 1 }), {
    desde: "2026-01",
    hasta: "2026-06",
  });
  assert.deepEqual(periodos.resolverPeriodo({ tipo: "semestre", anio: 2026, semestre: 2 }), {
    desde: "2026-07",
    hasta: "2026-12",
  });
  assert.deepEqual(periodos.resolverPeriodo({ tipo: "anio", anio: 2025 }), {
    desde: "2025-01",
    hasta: "2025-12",
  });
});

test("resolverPeriodo acepta rangos de meses y rechaza rangos invertidos", () => {
  assert.deepEqual(periodos.resolverPeriodo({ tipo: "rango", desde: "2025-11", hasta: "2026-02" }), {
    desde: "2025-11",
    hasta: "2026-02",
  });
  assert.equal(periodos.resolverPeriodo({ tipo: "rango", desde: "2026-06", hasta: "2026-01" }), null);
  assert.equal(periodos.resolverPeriodo({ tipo: "rango", desde: "2026-06", hasta: "" }), null);
  assert.equal(periodos.resolverPeriodo({ tipo: "todo" }), null);
});

test("mesesDelRango incluye todos los meses, incluso al cruzar el año", () => {
  assert.deepEqual(periodos.mesesDelRango({ desde: "2026-01", hasta: "2026-06" }), [
    "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06",
  ]);
  assert.deepEqual(periodos.mesesDelRango({ desde: "2025-11", hasta: "2026-02" }), [
    "2025-11", "2025-12", "2026-01", "2026-02",
  ]);
});

test("etiquetaPeriodo describe el filtro activo", () => {
  assert.equal(periodos.etiquetaPeriodo({ tipo: "todo" }), "Todo el historial");
  assert.equal(
    periodos.etiquetaPeriodo({ tipo: "semestre", anio: 2026, semestre: 1 }),
    "S1 2026 · Enero – Junio",
  );
  assert.equal(periodos.etiquetaPeriodo({ tipo: "anio", anio: 2026 }), "Año 2026");
  assert.equal(
    periodos.etiquetaPeriodo({ tipo: "rango", desde: "2026-01", hasta: "2026-03" }),
    "Enero 2026 – Marzo 2026",
  );
});

test("periodoInicial usa el año y semestre actuales", () => {
  const hoy = new Date(2026, 10, 19); // 19-11-2026
  assert.deepEqual(periodos.periodoInicial("rango", hoy), { tipo: "rango", desde: "2026-01", hasta: "2026-11" });
  assert.deepEqual(periodos.periodoInicial("semestre", hoy), { tipo: "semestre", anio: 2026, semestre: 2 });
  assert.deepEqual(periodos.periodoInicial("anio", hoy), { tipo: "anio", anio: 2026 });
  assert.deepEqual(periodos.periodoInicial("todo", hoy), { tipo: "todo" });
});
