import test from "node:test";
import assert from "node:assert/strict";
import { loadTsModule } from "./helpers/ts-module-loader.mjs";

const schemas = await loadTsModule("src/api/module1.schemas.ts");

const revision = (estadoPago) => ({
  estadoPago,
  observacion: "",
  datos: {},
});

test("ESTADOS_PAGO contiene solo PENDIENTE y PAGADO", () => {
  assert.deepEqual([...schemas.ESTADOS_PAGO], ["PENDIENTE", "PAGADO"]);
});

test("revisionInputSchema rechaza estados de pago fuera del catálogo", () => {
  assert.equal(schemas.revisionInputSchema.safeParse(revision("OTRO")).success, false);
  assert.equal(schemas.revisionInputSchema.safeParse(revision("pagado")).success, false);
  assert.equal(schemas.revisionInputSchema.safeParse(revision("")).success, false);
});

test("revisionInputSchema acepta PENDIENTE y PAGADO", () => {
  assert.equal(schemas.revisionInputSchema.safeParse(revision("PENDIENTE")).success, true);
  assert.equal(schemas.revisionInputSchema.safeParse(revision("PAGADO")).success, true);
});
