import test from "node:test";
import assert from "node:assert/strict";
import { loadTsModule } from "./helpers/ts-module-loader.mjs";

const { initialReviewForm, latestRevision } = await loadTsModule(
  "src/features/module1/components/documentReviewForm.ts",
);

const ID = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;

const resultado = {
  idResultado: ID(10),
  tipoDocumento: "FACTURA",
  folio: "1042",
  fechaEmision: "2026-03-14T00:00:00.000Z",
  emisorRut: "76.543.210-K",
  emisorRazonSocial: "Comercial Andes SpA",
  receptorRut: "77.888.999-0",
  receptorNombre: "Constructora Metiche SpA",
  condicionTributaria: "AFECTA",
  neto: "827800",
  iva: "157282",
  exento: null,
  total: "985082",
  medioPago: "Transferencia electrónica",
  detalles: [{ idDetalle: ID(20), numeroLinea: 1, descripcion: "Andamio", cantidad: "2", totalLinea: "360000" }],
  ajustesGlobales: [],
};

function revision(n, cambios) {
  return {
    idRevision: ID(n),
    idDocumento: ID(1),
    idResultado: ID(10),
    estado: "CONFIRMADA",
    estadoPago: "PAGADO",
    observacion: "Pagado por transferencia",
    tipoDocumento: "FACTURA",
    folio: "1042",
    fechaEmision: "2026-03-15T00:00:00.000Z",
    emisorRut: "76.543.210-K",
    emisorRazonSocial: "Comercial Andes SpA",
    receptorRut: "77.888.999-0",
    receptorNombre: "Constructora Metiche SpA",
    condicionTributaria: "AFECTA",
    neto: "827800",
    iva: "157282",
    exento: null,
    total: "985000",
    medioPago: "Transferencia electrónica",
    createdAt: "2026-03-20T10:00:00.000Z",
    confirmedAt: "2026-03-20T10:00:00.000Z",
    detalles: [{ idDetalle: ID(30), idDetalleExtraccion: ID(20), numeroLinea: 1, descripcion: "Andamio corregido", cantidad: "3", totalLinea: "540000" }],
    ajustesGlobales: [],
    ...cambios,
  };
}

const documento = (revisiones) => ({ idDocumento: ID(1), estado: "CONFIRMADO", resultados: [resultado], revisiones });

test("sin revisiones, el formulario parte de la extracción con estado PENDIENTE y sin observación", () => {
  const form = initialReviewForm(documento([]));
  assert.equal(form.estadoPago, "PENDIENTE");
  assert.equal(form.observacion, "");
  assert.equal(form.total, "985082");
  assert.equal(form.fechaEmision, "2026-03-14");
  assert.equal(form.detalles[0].descripcion, "Andamio");
});

test("al reabrir un documento confirmado como PAGADO, el formulario conserva PAGADO", () => {
  const form = initialReviewForm(documento([revision(40)]));
  assert.equal(form.estadoPago, "PAGADO");
});

test("al reabrir, se cargan la observación y las correcciones de la revisión, no la extracción", () => {
  const form = initialReviewForm(documento([revision(40)]));
  assert.equal(form.observacion, "Pagado por transferencia");
  assert.equal(form.total, "985000");
  assert.equal(form.fechaEmision, "2026-03-15");
  assert.equal(form.detalles[0].descripcion, "Andamio corregido");
  assert.equal(form.detalles[0].cantidad, "3");
});

test("se usa la revisión más reciente aunque la respuesta venga desordenada", () => {
  const antigua = revision(41, { estadoPago: "PENDIENTE", createdAt: "2026-03-18T10:00:00.000Z" });
  const reciente = revision(42, { estadoPago: "PAGADO", createdAt: "2026-03-21T10:00:00.000Z" });
  assert.equal(latestRevision({ revisiones: [antigua, reciente] }).idRevision, ID(42));
  assert.equal(initialReviewForm(documento([antigua, reciente])).estadoPago, "PAGADO");
});

test("una revisión guardada sin confirmar también se usa como punto de partida", () => {
  const borrador = revision(43, { estado: "PENDIENTE", confirmedAt: null, estadoPago: "PAGADO", createdAt: "2026-03-22T10:00:00.000Z" });
  const form = initialReviewForm(documento([revision(40), borrador]));
  assert.equal(form.estadoPago, "PAGADO");
});

test("un estado de pago nulo o fuera del catálogo en la revisión cae a PENDIENTE", () => {
  assert.equal(initialReviewForm(documento([revision(44, { estadoPago: null })])).estadoPago, "PENDIENTE");
  assert.equal(initialReviewForm(documento([revision(45, { estadoPago: "OTRO" })])).estadoPago, "PENDIENTE");
});
