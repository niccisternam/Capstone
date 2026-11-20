import test from "node:test";
import assert from "node:assert/strict";
import { loadTsModule } from "./helpers/ts-module-loader.mjs";

const { resumenProcesamiento, avisoProcesamiento, nombreDocumento } = await loadTsModule(
  "src/features/module1/components/processingSummary.ts",
);

function doc(posicion, estado, nombreArchivo = null) {
  return {
    idDocumento: `00000000-0000-4000-8000-00000000000${posicion}`,
    idNotebook: "00000000-0000-4000-8000-000000000100",
    idLote: "00000000-0000-4000-8000-000000000200",
    posicionLote: posicion,
    estado,
    nombreArchivo,
  };
}

test("resumenProcesamiento cuenta correctos (PENDIENTE_REVISION y CONFIRMADO) y errores", () => {
  const resumen = resumenProcesamiento([
    doc(1, "PENDIENTE_REVISION", "factura-1.pdf"),
    doc(2, "ERROR", "factura-2.pdf"),
    doc(3, "CONFIRMADO", "factura-3.pdf"),
    doc(4, "ERROR", null),
    doc(5, "PENDIENTE"),
  ]);

  assert.equal(resumen.correctos, 2);
  assert.equal(resumen.errores, 2);
  assert.deepEqual(
    resumen.documentosConError.map((documento) => documento.nombre),
    ["factura-2.pdf", "Documento 4"],
  );
});

test("resumenProcesamiento devuelve ceros y lista vacía sin documentos", () => {
  assert.deepEqual(resumenProcesamiento([]), { correctos: 0, errores: 0, documentosConError: [] });
});

test("nombreDocumento usa el nombre de archivo sin espacios o la posición en el lote", () => {
  assert.equal(nombreDocumento({ nombreArchivo: "  a.pdf  ", posicionLote: 1 }), "a.pdf");
  assert.equal(nombreDocumento({ nombreArchivo: "   ", posicionLote: 3 }), "Documento 3");
  assert.equal(nombreDocumento({ nombreArchivo: null, posicionLote: 2 }), "Documento 2");
});

test("avisoProcesamiento muestra aviso verde cuando no hay errores", () => {
  const aviso = avisoProcesamiento({ correctos: 3, errores: 0, documentosConError: [] });
  assert.equal(aviso.tono, "exito");
  assert.equal(aviso.titulo, "Procesamiento finalizado: 3 documentos procesados correctamente.");
});

test("avisoProcesamiento usa singular para un documento correcto", () => {
  const aviso = avisoProcesamiento({ correctos: 1, errores: 0, documentosConError: [] });
  assert.equal(aviso.titulo, "Procesamiento finalizado: 1 documento procesado correctamente.");
});

test("avisoProcesamiento muestra aviso ámbar con conteos y reintento cuando hay errores", () => {
  const aviso = avisoProcesamiento({
    correctos: 2,
    errores: 1,
    documentosConError: [{ idDocumento: "x", nombre: "factura-2.pdf" }],
  });
  assert.equal(aviso.tono, "alerta");
  assert.equal(aviso.titulo, "2 correctos, 1 con error.");
  assert.match(aviso.detalle, /reintentar/);
});

test("avisoProcesamiento no muestra nada cuando el lote no tiene documentos procesados ni fallidos", () => {
  assert.equal(avisoProcesamiento({ correctos: 0, errores: 0, documentosConError: [] }), null);
});

test("el resumen se recalcula al reintentar: un documento corregido pasa de error a correcto", () => {
  const antes = resumenProcesamiento([doc(1, "ERROR", "a.pdf"), doc(2, "PENDIENTE_REVISION", "b.pdf")]);
  const despues = resumenProcesamiento([doc(1, "PENDIENTE_REVISION", "a.pdf"), doc(2, "PENDIENTE_REVISION", "b.pdf")]);

  assert.equal(antes.errores, 1);
  assert.equal(despues.errores, 0);
  assert.equal(avisoProcesamiento(despues).tono, "exito");
});
