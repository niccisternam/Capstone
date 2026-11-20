import test from "node:test";
import assert from "node:assert/strict";
import { loadTsModule } from "./helpers/ts-module-loader.mjs";

const { DIRECCIONES, TEXTOS_DIRECCION } = await loadTsModule("src/features/dashboard/direccion.ts");

test("DIRECCIONES ofrece Compras, Ventas y Ambas con sus valores de API", () => {
  assert.deepEqual(DIRECCIONES, [
    { valor: "COMPRA", etiqueta: "Compras" },
    { valor: "VENTA", etiqueta: "Ventas" },
    { valor: "TODAS", etiqueta: "Ambas" },
  ]);
});

test("los títulos cambian según la dirección: compras/proveedores, ventas/clientes", () => {
  assert.equal(TEXTOS_DIRECCION.COMPRA.mensual, "Compras por mes");
  assert.equal(TEXTOS_DIRECCION.COMPRA.contrapartes, "Principales proveedores");
  assert.equal(TEXTOS_DIRECCION.VENTA.mensual, "Ventas por mes");
  assert.equal(TEXTOS_DIRECCION.VENTA.contrapartes, "Principales clientes");
  assert.equal(TEXTOS_DIRECCION.VENTA.total, "Total de ventas");
});
