import test from "node:test";
import assert from "node:assert/strict";
import { loadTsModule } from "./helpers/ts-module-loader.mjs";

const schemas = await loadTsModule("src/api/module1.schemas.ts");

test("toFechaEmisionInput conserva solo AAAA-MM-DD de la fecha UTC a medianoche", () => {
  assert.equal(schemas.toFechaEmisionInput("2026-03-14T00:00:00.000Z"), "2026-03-14");
  assert.equal(schemas.toFechaEmisionInput(null), null);
});

test("notebookInputSchema recorta el nombre y limita longitudes", () => {
  const ok = schemas.notebookInputSchema.parse({ nombre: "  Ventas  ", icono: " folder " });
  assert.equal(ok.nombre, "Ventas");
  assert.equal(ok.icono, "folder");

  assert.equal(schemas.notebookInputSchema.safeParse({ nombre: "a".repeat(151) }).success, false);
  assert.equal(schemas.notebookInputSchema.safeParse({ nombre: "a", icono: "i".repeat(81) }).success, false);
  assert.equal(schemas.notebookInputSchema.safeParse({ nombre: "a", descripcion: "d".repeat(5001) }).success, false);
});

test("revisionInputSchema exige estadoPago de hasta 40 caracteres", () => {
  const base = { observacion: "", datos: {} };

  assert.equal(schemas.revisionInputSchema.safeParse(base).success, false);
  assert.equal(schemas.revisionInputSchema.safeParse({ ...base, estadoPago: "   " }).success, false);
  assert.equal(schemas.revisionInputSchema.safeParse({ ...base, estadoPago: "x".repeat(41) }).success, false);
  assert.equal(schemas.revisionInputSchema.safeParse({ ...base, estadoPago: "x".repeat(40) }).success, true);
});

test("revisionInputSchema acepta observacion vacía y rechaza fechaEmision con hora", () => {
  const datos = { fechaEmision: "2026-03-14" };
  assert.equal(
    schemas.revisionInputSchema.safeParse({ estadoPago: "PENDIENTE", observacion: "", datos }).success,
    true,
  );

  const conHora = schemas.revisionInputSchema.safeParse({
    estadoPago: "PENDIENTE",
    observacion: "",
    datos: { fechaEmision: "2026-03-14T00:00:00.000Z" },
  });
  assert.equal(conHora.success, false);
});

test("revisionInputSchema valida montos como decimales y acepta null para borrar", () => {
  const withTotal = (total) => ({
    estadoPago: "PENDIENTE",
    observacion: "",
    datos: { totales: { total } },
  });

  assert.equal(schemas.revisionInputSchema.safeParse(withTotal("1190")).success, true);
  assert.equal(schemas.revisionInputSchema.safeParse(withTotal("-5.25")).success, true);
  assert.equal(schemas.revisionInputSchema.safeParse(withTotal(null)).success, true);
  assert.equal(schemas.revisionInputSchema.safeParse(withTotal("1.190,00")).success, false);
});

test("revisionInputSchema valida tipo y modalidad de ajustes globales", () => {
  const withAjuste = (ajuste) => ({
    estadoPago: "PENDIENTE",
    observacion: "",
    datos: { ajustesGlobales: [ajuste] },
  });

  assert.equal(
    schemas.revisionInputSchema.safeParse(withAjuste({ tipo: "DESCUENTO", modalidad: "PORCENTAJE", valor: "5" })).success,
    true,
  );
  assert.equal(
    schemas.revisionInputSchema.safeParse(withAjuste({ tipo: "OTRO", modalidad: "PORCENTAJE", valor: "5" })).success,
    false,
  );
  assert.equal(
    schemas.revisionInputSchema.safeParse(withAjuste({ tipo: "RECARGO", modalidad: "CUOTA", valor: "5" })).success,
    false,
  );
});

test("revisionInputSchema valida condición tributaria con los valores del backend", () => {
  const withCondicion = (condicionTributaria) => ({
    estadoPago: "PENDIENTE",
    observacion: "",
    datos: { condicionTributaria },
  });

  assert.equal(schemas.revisionInputSchema.safeParse(withCondicion("NO_AFECTA")).success, true);
  assert.equal(schemas.revisionInputSchema.safeParse(withCondicion(null)).success, true);
  assert.equal(schemas.revisionInputSchema.safeParse(withCondicion("AFECTO")).success, false);
});
