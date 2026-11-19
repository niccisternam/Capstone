import test from "node:test";
import assert from "node:assert/strict";
import { loadTsModule } from "./helpers/ts-module-loader.mjs";

const { parsearMensaje, contieneTabla } = await loadTsModule(
  "src/features/module4/chatTable.ts",
);

const tablaProductos = [
  "| Producto | Cantidad comprada | Total gastado |",
  "| :--- | :--- | :--- |",
  "| Resma papel carta | 1.330 | $16.720.000 |",
  "| Tóner impresora | 344 | $8.600.000 |",
  "| Soporte informático | 270 | $8.910.000 |",
].join("\n");

test("convierte la tabla que devuelve la IA en encabezados y filas", () => {
  const bloques = parsearMensaje(tablaProductos);

  assert.equal(bloques.length, 1);
  assert.equal(bloques[0].tipo, "tabla");
  assert.deepEqual(bloques[0].tabla.encabezados, ["Producto", "Cantidad comprada", "Total gastado"]);
  assert.equal(bloques[0].tabla.filas.length, 3);
  assert.deepEqual(bloques[0].tabla.filas[0], ["Resma papel carta", "1.330", "$16.720.000"]);
  assert.equal(contieneTabla(tablaProductos), true);
});

test("conserva el texto que acompaña a la tabla", () => {
  const bloques = parsearMensaje(`Estos son los productos más comprados:\n\n${tablaProductos}\n\n¿Necesitas otro detalle?`);

  assert.equal(bloques.length, 3);
  assert.deepEqual(bloques[0], { tipo: "texto", contenido: "Estos son los productos más comprados:" });
  assert.equal(bloques[1].tipo, "tabla");
  assert.deepEqual(bloques[2], { tipo: "texto", contenido: "¿Necesitas otro detalle?" });
});

test("deja intacta una respuesta normal sin tabla", () => {
  const texto = "El total gastado es de $76.493.200.";
  const bloques = parsearMensaje(texto);

  assert.deepEqual(bloques, [{ tipo: "texto", contenido: texto }]);
  assert.equal(contieneTabla(texto), false);
});

test("no confunde una frase con pipes con una tabla", () => {
  const texto = "Producto | Cantidad\nResma | 10";
  const bloques = parsearMensaje(texto);

  assert.equal(bloques.length, 1);
  assert.equal(bloques[0].tipo, "texto");
  assert.equal(contieneTabla(texto), false);
});

test("completa filas incompletas y respeta pipes escapados", () => {
  const bloques = parsearMensaje("| Producto | Detalle |\n| --- | --- |\n| Resma \\| carta | 330 |");

  assert.equal(bloques[0].tipo, "tabla");
  assert.deepEqual(bloques[0].tabla.filas[0], ["Resma | carta", "330"]);
});
