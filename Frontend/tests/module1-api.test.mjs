import test, { beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { loadTsModule } from "./helpers/ts-module-loader.mjs";

const client = await loadTsModule("src/api/client.ts");
const api = await loadTsModule("src/api/module1.api.ts");
const errors = await loadTsModule("src/api/api-error.ts");

const { ApiError } = errors;

const IDS = {
  notebook: "0a000000-0000-4000-8000-000000000001",
  lote: "0b000000-0000-4000-8000-000000000001",
  documento: "0c000000-0000-4000-8000-000000000001",
  resultado: "0d000000-0000-4000-8000-000000000001",
  detalle: "0e000000-0000-4000-8000-000000000001",
  ajuste: "0f000000-0000-4000-8000-000000000001",
  revision: "10000000-0000-4000-8000-000000000001",
  archivo: "11000000-0000-4000-8000-000000000001",
  empresa: "12000000-0000-4000-8000-000000000001",
  usuario: "13000000-0000-4000-8000-000000000001",
  detalleRevision: "14000000-0000-4000-8000-000000000001",
  ajusteRevision: "15000000-0000-4000-8000-000000000001",
};

const TS = "2026-03-01T10:00:00.000Z";

function notebookFixture(overrides = {}) {
  return {
    idNotebook: IDS.notebook,
    idEmpresa: IDS.empresa,
    creadoPorId: IDS.usuario,
    nombre: "Gastos marzo",
    descripcion: "Documentos del mes",
    icono: "folder",
    paletaColores: { principal: "#2563eb" },
    createdAt: TS,
    updatedAt: TS,
    ...overrides,
  };
}

function documentoFixture(overrides = {}) {
  return {
    idDocumento: IDS.documento,
    idEmpresa: IDS.empresa,
    idNotebook: IDS.notebook,
    idLote: IDS.lote,
    cargadoPorId: IDS.usuario,
    posicionLote: 1,
    estado: "PENDIENTE",
    createdAt: TS,
    confirmadoAt: null,
    ...overrides,
  };
}

function loteFixture(overrides = {}) {
  return {
    idLote: IDS.lote,
    idEmpresa: IDS.empresa,
    idNotebook: IDS.notebook,
    creadoPorId: IDS.usuario,
    cantidadDocumentos: 1,
    cantidadProcesados: 0,
    cantidadErrores: 0,
    createdAt: TS,
    procesamientoInicio: null,
    procesamientoFin: null,
    documentos: [documentoFixture()],
    ...overrides,
  };
}

function detalleExtraccionFixture() {
  return {
    idDetalle: IDS.detalle,
    idResultado: IDS.resultado,
    numeroLinea: 1,
    descripcion: "Servicio",
    descripcionEstado: "ENCONTRADO",
    cantidad: "1",
    cantidadEstado: "ENCONTRADO",
    unidad: "UND",
    unidadEstado: "ENCONTRADO",
    precioUnitario: "1000",
    precioUnitarioEstado: "ENCONTRADO",
    descuentoPorcentaje: null,
    descuentoPorcentajeEstado: "AUSENTE",
    descuentoMonto: null,
    descuentoMontoEstado: "AUSENTE",
    recargoPorcentaje: null,
    recargoPorcentajeEstado: "AUSENTE",
    recargoMonto: null,
    recargoMontoEstado: "AUSENTE",
    totalLinea: "1000",
    totalLineaEstado: "ENCONTRADO",
    metadata: { confianza: 0.9 },
  };
}

function resultadoFixture() {
  return {
    idResultado: IDS.resultado,
    idDocumento: IDS.documento,
    idIntento: "16000000-0000-4000-8000-000000000001",
    tipoDocumento: "FACTURA",
    tipoDocumentoEstado: "ENCONTRADO",
    folio: "1042",
    folioEstado: "ENCONTRADO",
    fechaEmision: "2026-03-14T00:00:00.000Z",
    fechaEmisionEstado: "ENCONTRADO",
    emisorRut: "76543210-K",
    emisorRutEstado: "ENCONTRADO",
    emisorRazonSocial: "Comercial Andes SpA",
    emisorRazonSocialEstado: "ENCONTRADO",
    receptorRut: null,
    receptorRutEstado: "AUSENTE",
    receptorNombre: null,
    receptorNombreEstado: "AUSENTE",
    condicionTributaria: "AFECTA",
    condicionEstado: "ENCONTRADO",
    neto: "1000",
    netoEstado: "ENCONTRADO",
    iva: "190",
    ivaEstado: "ENCONTRADO",
    exento: null,
    exentoEstado: "NO_APLICA",
    total: "1190",
    totalEstado: "ENCONTRADO",
    medioPago: "TRANSFERENCIA",
    medioPagoEstado: "ENCONTRADO",
    metadata: { documento: { folio: "1042" } },
    errores: [],
    advertencias: [],
    detalles: [detalleExtraccionFixture()],
    ajustesGlobales: [
      {
        idAjuste: IDS.ajuste,
        idResultado: IDS.resultado,
        numeroAjuste: 1,
        tipo: "DESCUENTO",
        modalidad: "PORCENTAJE",
        valor: "5",
        valorEstado: "ENCONTRADO",
        descripcion: "Descuento comercial",
        descripcionEstado: "ENCONTRADO",
      },
    ],
  };
}

function revisionFixture(overrides = {}) {
  return {
    idRevision: IDS.revision,
    idDocumento: IDS.documento,
    idResultado: IDS.resultado,
    revisadoPorId: IDS.usuario,
    estado: "EDITANDO",
    estadoPago: "PENDIENTE",
    observacion: "Revisar folio",
    tipoDocumento: "FACTURA",
    folio: "1042",
    fechaEmision: "2026-03-14T00:00:00.000Z",
    emisorRut: "76543210-K",
    emisorRazonSocial: "Comercial Andes SpA",
    receptorRut: null,
    receptorNombre: null,
    condicionTributaria: "AFECTA",
    neto: "1000",
    iva: "190",
    exento: null,
    total: "1190",
    medioPago: "TRANSFERENCIA",
    createdAt: TS,
    confirmedAt: null,
    ...overrides,
  };
}

function documentoDetalleFixture(overrides = {}) {
  return {
    ...documentoFixture(),
    archivo: {
      idArchivo: IDS.archivo,
      idDocumento: IDS.documento,
      nombreOriginal: "factura.pdf",
      tipoMime: "application/pdf",
      storageKey: "empresa/secreto.pdf",
      hashArchivo: "abc123",
      createdAt: TS,
    },
    resultados: [resultadoFixture()],
    revisiones: [],
    ...overrides,
  };
}

function reviewInput() {
  return {
    estadoPago: "PENDIENTE",
    observacion: "Revisar folio",
    datos: {
      tipoDocumento: "FACTURA",
      folio: "1042",
      fechaEmision: "2026-03-14",
      emisor: { rut: "76543210-K", razonSocial: "Comercial Andes SpA" },
      receptor: { rut: null, nombre: null },
      condicionTributaria: "AFECTA",
      detalles: [
        {
          descripcion: "Servicio corregido",
          cantidad: "1",
          unidad: "UND",
          precioUnitario: "1000",
          descuentoPorcentaje: null,
          descuentoMonto: null,
          recargoPorcentaje: null,
          recargoMonto: null,
          totalLinea: "1000",
        },
      ],
      ajustesGlobales: [],
      totales: { neto: "1000", iva: "190", exento: null, total: "1190" },
      medioPago: "TRANSFERENCIA",
    },
  };
}

function json(status, body) {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function pdfBytes(size = 64) {
  const bytes = new Uint8Array(size);
  bytes.set([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34]);
  return bytes;
}

function pdfFile(name = "factura.pdf", size = 64) {
  return new File([pdfBytes(size)], name, { type: "application/pdf" });
}

let originalFetch;
let calls;

function mockFetch(handler) {
  globalThis.fetch = async (url, init = {}) => {
    const call = {
      url: String(url),
      path: String(url).split("/api/v1")[1],
      method: init.method ?? "GET",
      init,
      headers: new Headers(init.headers),
    };
    calls.push(call);
    return handler(call);
  };
}

function apiError(promise) {
  return promise.then(
    () => assert.fail("Se esperaba un ApiError"),
    (error) => {
      assert.ok(error instanceof ApiError, `Se esperaba ApiError y llegó ${error?.name}: ${error?.message}`);
      return error;
    },
  );
}

beforeEach(() => {
  originalFetch = globalThis.fetch;
  calls = [];
  client.setAccessToken("token-actual");
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  client.setAccessToken(null);
});

test("listNotebooks envía Bearer y credentials include, y expone totalDocumentos", async () => {
  mockFetch(() => json(200, { notebooks: [{ ...notebookFixture(), _count: { documentos: 3 } }] }));

  const notebooks = await api.listNotebooks();

  assert.equal(notebooks.length, 1);
  assert.equal(notebooks[0].totalDocumentos, 3);
  assert.equal("_count" in notebooks[0], false);
  assert.equal("idEmpresa" in notebooks[0], false);
  assert.equal(calls[0].path, "/module1/notebooks");
  assert.equal(calls[0].init.credentials, "include");
  assert.equal(calls[0].headers.get("authorization"), "Bearer token-actual");
});

test("createNotebook valida nombre antes de enviar y no hace petición", async () => {
  mockFetch(() => json(201, { notebook: notebookFixture() }));

  const error = await apiError(api.createNotebook({ nombre: "   " }));

  assert.equal(error.status, 400);
  assert.equal(error.code, "VALIDATION_ERROR");
  assert.equal(error.kind, "VALIDATION");
  assert.equal(calls.length, 0);
});

test("createNotebook recorta el nombre y envía JSON", async () => {
  mockFetch(() => json(201, { notebook: notebookFixture() }));

  const notebook = await api.createNotebook({ nombre: "  Gastos marzo  ", descripcion: "Documentos del mes" });

  assert.equal(notebook.nombre, "Gastos marzo");
  assert.equal(calls[0].method, "POST");
  assert.equal(calls[0].headers.get("content-type"), "application/json");
  assert.equal(JSON.parse(calls[0].init.body).nombre, "Gastos marzo");
});

test("createNotebook normaliza 409 NOTEBOOK_NAME_TAKEN sin exponer el mensaje del servidor", async () => {
  mockFetch(() => json(409, { error: { code: "NOTEBOOK_NAME_TAKEN", message: "detalle interno", details: { x: 1 } } }));

  const error = await apiError(api.createNotebook({ nombre: "Gastos marzo" }));

  assert.equal(error.kind, "CONFLICT");
  assert.equal(error.code, "NOTEBOOK_NAME_TAKEN");
  assert.equal(error.message, "Ya existe un notebook con ese nombre.");
  assert.equal(error.details, undefined);
});

test("getNotebook rechaza identificadores inválidos sin hacer petición", async () => {
  mockFetch(() => json(200, { notebook: notebookFixture() }));

  const error = await apiError(api.getNotebook("no-es-uuid"));

  assert.equal(error.code, "INVALID_IDENTIFIER");
  assert.equal(calls.length, 0);
});

test("getNotebook devuelve documentos y mapea 404 a NOT_FOUND", async () => {
  mockFetch((call) => {
    if (call.path.endsWith(IDS.notebook)) {
      return json(200, { notebook: { ...notebookFixture(), documentos: [documentoFixture()] } });
    }
    return json(404, { error: { code: "NOTEBOOK_NOT_FOUND", message: "x" } });
  });

  const notebook = await api.getNotebook(IDS.notebook);
  assert.equal(notebook.documentos[0].estado, "PENDIENTE");

  const error = await apiError(api.getNotebook("0a000000-0000-4000-8000-000000000099"));
  assert.equal(error.kind, "NOT_FOUND");
  assert.equal(error.message, "No encontramos el notebook solicitado.");
});

test("uploadDocuments envía FormData con campo documents repetido y sin Content-Type", async () => {
  mockFetch(() => json(201, { lote: loteFixture({ cantidadDocumentos: 2 }) }));

  const lote = await api.uploadDocuments(IDS.notebook, [pdfFile("a.pdf"), pdfFile("b.pdf")]);

  assert.equal(lote.idLote, IDS.lote);
  assert.equal(calls[0].method, "POST");
  assert.equal(calls[0].path, `/module1/notebooks/${IDS.notebook}/documents`);
  assert.equal(calls[0].headers.get("content-type"), null);
  assert.ok(calls[0].init.body instanceof FormData);
  const names = calls[0].init.body.getAll("documents").map((file) => file.name);
  assert.deepEqual(names, ["a.pdf", "b.pdf"]);
});

test("uploadDocuments valida cantidad, tipo, tamaño y firma antes de enviar", async () => {
  mockFetch(() => json(201, { lote: loteFixture() }));

  const png = new File([pdfBytes()], "foto.png", { type: "image/png" });
  const sinFirma = new File([new Uint8Array(64)], "sin-firma.pdf", { type: "application/pdf" });
  const demasiadoGrande = pdfFile("grande.pdf", 15 * 1024 * 1024 + 1);
  const vacio = new File([], "vacio.pdf", { type: "application/pdf" });
  const once = Array.from({ length: 11 }, (_, i) => pdfFile(`doc-${i}.pdf`));

  const sinArchivos = await apiError(api.uploadDocuments(IDS.notebook, []));
  assert.equal(sinArchivos.code, "INVALID_BATCH_SIZE");

  const demasiados = await apiError(api.uploadDocuments(IDS.notebook, once));
  assert.equal(demasiados.code, "INVALID_BATCH_SIZE");

  const invalidos = await apiError(api.uploadDocuments(IDS.notebook, [png, sinFirma, demasiadoGrande, vacio]));
  assert.equal(invalidos.code, "INVALID_PDF_FILE");
  assert.deepEqual(invalidos.details.archivos, [
    { nombre: "foto.png", motivo: "TIPO_NO_PERMITIDO" },
    { nombre: "sin-firma.pdf", motivo: "FIRMA_NO_VALIDA" },
    { nombre: "grande.pdf", motivo: "TAMANO_NO_PERMITIDO" },
    { nombre: "vacio.pdf", motivo: "TAMANO_NO_PERMITIDO" },
  ]);
  assert.equal(calls.length, 0);
});

test("uploadDocuments normaliza INVALID_PDF_FILE devuelto por el servidor", async () => {
  mockFetch(() => json(400, { error: { code: "INVALID_PDF_FILE", message: "x" } }));

  const error = await apiError(api.uploadDocuments(IDS.notebook, [pdfFile()]));

  assert.equal(error.kind, "VALIDATION");
  assert.equal(error.code, "INVALID_PDF_FILE");
});

test("uploadDocuments reintenta tras refresh conservando el FormData", async () => {
  mockFetch((call) => {
    if (call.path === "/auth/refresh") return json(200, { accessToken: "token-nuevo", usuario: {} });
    if (call.headers.get("authorization") === "Bearer token-actual") {
      return json(401, { error: { code: "INVALID_AUTH_TOKEN", message: "x" } });
    }
    return json(201, { lote: loteFixture() });
  });

  const lote = await api.uploadDocuments(IDS.notebook, [pdfFile()]);

  assert.equal(lote.idLote, IDS.lote);
  const last = calls.at(-1);
  assert.equal(last.headers.get("authorization"), "Bearer token-nuevo");
  assert.ok(last.init.body instanceof FormData);
  assert.equal(last.headers.get("content-type"), null);
});

test("processBatch hace POST, devuelve documentos del lote y respeta la cancelación", async () => {
  mockFetch(() => json(200, { lote: loteFixture({ cantidadProcesados: 1 }) }));

  const lote = await api.processBatch(IDS.lote);
  assert.equal(lote.cantidadProcesados, 1);
  assert.equal(calls[0].method, "POST");
  assert.equal(calls[0].path, `/module1/batches/${IDS.lote}/process`);

  const controller = new AbortController();
  controller.abort();
  mockFetch((call) => {
    if (call.init.signal?.aborted) throw new DOMException("Aborted", "AbortError");
    return json(200, { lote: loteFixture() });
  });

  await assert.rejects(api.processBatch(IDS.lote, { signal: controller.signal }), (error) => {
    assert.equal(error.name, "AbortError");
    assert.equal(error instanceof ApiError, false);
    return true;
  });
});

test("getBatch consulta el lote y normaliza 404 BATCH_NOT_FOUND", async () => {
  mockFetch((call) => {
    if (call.path === `/module1/batches/${IDS.lote}`) return json(200, { lote: loteFixture() });
    return json(404, { error: { code: "BATCH_NOT_FOUND", message: "x" } });
  });

  const lote = await api.getBatch(IDS.lote);
  assert.equal(lote.documentos[0].idDocumento, IDS.documento);

  const error = await apiError(api.getBatch("0b000000-0000-4000-8000-000000000099"));
  assert.equal(error.code, "BATCH_NOT_FOUND");
  assert.equal(error.kind, "NOT_FOUND");
});

test("getDocument parsea resultados y no expone campos internos de archivo", async () => {
  mockFetch(() => json(200, { documento: documentoDetalleFixture() }));

  const documento = await api.getDocument(IDS.documento);

  assert.equal(documento.archivo.nombreOriginal, "factura.pdf");
  assert.equal("storageKey" in documento.archivo, false);
  assert.equal("hashArchivo" in documento.archivo, false);
  assert.equal(documento.resultados[0].detalles[0].totalLinea, "1000");
  assert.equal(documento.resultados[0].ajustesGlobales[0].tipo, "DESCUENTO");
  assert.equal(documento.revisiones.length, 0);
});

test("getDocument con estado desconocido devuelve INVALID_RESPONSE", async () => {
  mockFetch(() => json(200, { documento: documentoDetalleFixture({ estado: "EN_COLA" }) }));

  const error = await apiError(api.getDocument(IDS.documento));

  assert.equal(error.kind, "INVALID_RESPONSE");
  assert.equal(error.code, "INVALID_RESPONSE");
  assert.equal(error.status, 200);
});

test("getDocumentPdf devuelve Blob application/pdf con Accept de PDF", async () => {
  mockFetch(() => new Response(pdfBytes(), { status: 200, headers: { "content-type": "application/pdf" } }));

  const blob = await api.getDocumentPdf(IDS.documento);

  assert.ok(blob instanceof Blob);
  assert.equal(blob.type, "application/pdf");
  assert.equal(calls[0].method, "GET");
  assert.equal(calls[0].path, `/module1/documents/${IDS.documento}/pdf`);
  assert.equal(calls[0].headers.get("accept"), "application/pdf");
  assert.equal(calls[0].headers.get("authorization"), "Bearer token-actual");
});

test("getDocumentPdf normaliza PDF_NOT_FOUND y rechaza respuestas que no son PDF", async () => {
  mockFetch(() => json(404, { error: { code: "PDF_NOT_FOUND", message: "x" } }));
  const error = await apiError(api.getDocumentPdf(IDS.documento));
  assert.equal(error.code, "PDF_NOT_FOUND");

  mockFetch(() => new Response("<html></html>", { status: 200, headers: { "content-type": "text/html" } }));
  const invalid = await apiError(api.getDocumentPdf(IDS.documento));
  assert.equal(invalid.kind, "INVALID_RESPONSE");
});

test("saveReview envía estadoPago, observacion y datos; null borra y omitidos conservan", async () => {
  mockFetch(() => json(200, { revision: revisionFixture() }));
  const input = reviewInput();
  input.datos.medioPago = null;
  delete input.datos.emisor;

  const revision = await api.saveReview(IDS.documento, input);

  assert.equal(revision.estado, "EDITANDO");
  assert.equal(calls[0].method, "PATCH");
  assert.equal(calls[0].headers.get("content-type"), "application/json");
  const body = JSON.parse(calls[0].init.body);
  assert.equal(body.estadoPago, "PENDIENTE");
  assert.equal(body.observacion, "Revisar folio");
  assert.equal(body.datos.medioPago, null);
  assert.equal("emisor" in body.datos, false);
  assert.equal(body.datos.detalles[0].descripcion, "Servicio corregido");
});

test("saveReview exige estadoPago y valida montos antes de enviar", async () => {
  mockFetch(() => json(200, { revision: revisionFixture() }));

  const sinEstado = reviewInput();
  delete sinEstado.estadoPago;
  const sinEstadoError = await apiError(api.saveReview(IDS.documento, sinEstado));
  assert.equal(sinEstadoError.code, "VALIDATION_ERROR");

  const montoInvalido = reviewInput();
  montoInvalido.datos.totales.total = "1.190,00";
  const montoError = await apiError(api.saveReview(IDS.documento, montoInvalido));
  assert.equal(montoError.code, "VALIDATION_ERROR");
  assert.ok(montoError.details.fieldErrors);

  assert.equal(calls.length, 0);
});

test("saveReview normaliza DOCUMENT_NOT_IN_REVIEW como conflicto", async () => {
  mockFetch(() => json(409, { error: { code: "DOCUMENT_NOT_IN_REVIEW", message: "x" } }));

  const error = await apiError(api.saveReview(IDS.documento, reviewInput()));

  assert.equal(error.kind, "CONFLICT");
  assert.equal(error.message, "El documento ya no está pendiente de revisión. Actualiza la vista.");
});

test("confirmDocument hace POST sin body y normaliza REVIEW_NOT_FOUND", async () => {
  mockFetch(() => json(200, { documento: documentoFixture({ estado: "CONFIRMADO", confirmadoAt: TS }) }));

  const documento = await api.confirmDocument(IDS.documento);
  assert.equal(documento.estado, "CONFIRMADO");
  assert.equal(calls[0].method, "POST");
  assert.equal(calls[0].init.body, undefined);

  mockFetch(() => json(409, { error: { code: "REVIEW_NOT_FOUND", message: "x" } }));
  const error = await apiError(api.confirmDocument(IDS.documento));
  assert.equal(error.code, "REVIEW_NOT_FOUND");
  assert.equal(error.kind, "CONFLICT");
});

test("retryDocument devuelve el documento si el reintento progresa", async () => {
  mockFetch(() => json(200, { documento: documentoFixture({ estado: "PENDIENTE_REVISION" }) }));

  const result = await api.retryDocument(IDS.documento);

  assert.equal("error" in result, false);
  assert.equal(result.estado, "PENDIENTE_REVISION");
});

test("retryDocument reconoce el fallo del reintento que llega con HTTP 200", async () => {
  mockFetch(() => json(200, {
    documento: { idDocumento: IDS.documento, estado: "ERROR", error: { code: "AI_UNAVAILABLE", message: "x" } },
  }));

  const result = await api.retryDocument(IDS.documento);

  assert.equal("error" in result, true);
  assert.equal(result.estado, "ERROR");
  assert.equal(result.error.code, "AI_UNAVAILABLE");
});

test("retryDocument normaliza DOCUMENT_NOT_RETRYABLE", async () => {
  mockFetch(() => json(409, { error: { code: "DOCUMENT_NOT_RETRYABLE", message: "x" } }));

  const error = await apiError(api.retryDocument(IDS.documento));

  assert.equal(error.code, "DOCUMENT_NOT_RETRYABLE");
  assert.equal(error.kind, "CONFLICT");
});

test("deleteDocument devuelve eliminado y normaliza DOCUMENT_NOT_DELETABLE", async () => {
  mockFetch((call) => {
    if (call.method === "DELETE") return json(200, { idDocumento: IDS.documento, eliminado: true });
    return json(409, { error: { code: "DOCUMENT_NOT_DELETABLE", message: "x" } });
  });

  const result = await api.deleteDocument(IDS.documento);
  assert.deepEqual(result, { idDocumento: IDS.documento, eliminado: true });
  assert.equal(calls[0].method, "DELETE");

  mockFetch(() => json(409, { error: { code: "DOCUMENT_NOT_DELETABLE", message: "x" } }));
  const error = await apiError(api.deleteDocument(IDS.documento));
  assert.equal(error.code, "DOCUMENT_NOT_DELETABLE");
});

test("errores de red se normalizan a NETWORK sin filtrar el error original", async () => {
  mockFetch(() => {
    throw new TypeError("fetch failed");
  });

  const error = await apiError(api.listNotebooks());

  assert.equal(error.kind, "NETWORK");
  assert.equal(error.status, 0);
  assert.equal(error.code, "NETWORK_ERROR");
  assert.equal(error.message.includes("fetch failed"), false);
});

test("503 sin envelope se normaliza a UNAVAILABLE con mensaje seguro", async () => {
  mockFetch(() => new Response("Service Unavailable", { status: 503, headers: { "content-type": "text/plain" } }));

  const error = await apiError(api.listNotebooks());

  assert.equal(error.kind, "UNAVAILABLE");
  assert.equal(error.code, "UNKNOWN_ERROR");
  assert.equal(error.message, "El servicio no está disponible temporalmente. Inténtalo más tarde.");
});

test("500 INTERNAL_ERROR se normaliza a UNEXPECTED", async () => {
  mockFetch(() => json(500, { error: { code: "INTERNAL_ERROR", message: "Error interno del servidor" } }));

  const error = await apiError(api.listNotebooks());

  assert.equal(error.kind, "UNEXPECTED");
  assert.equal(error.code, "INTERNAL_ERROR");
});

test("los detalles internos de errores de IA no se exponen a la UI", async () => {
  mockFetch(() => json(502, {
    error: { code: "AI_INVALID_RESPONSE", message: "respuesta cruda", details: { fieldErrors: { secreto: [] } } },
  }));

  const error = await apiError(api.getDocument(IDS.documento));

  assert.equal(error.kind, "UNAVAILABLE");
  assert.equal(error.details, undefined);
  assert.equal(error.message.includes("respuesta cruda"), false);
});

test("401 con refresh exitoso reintenta una sola vez con el token nuevo", async () => {
  mockFetch((call) => {
    if (call.path === "/auth/refresh") return json(200, { accessToken: "token-nuevo", usuario: {} });
    if (call.headers.get("authorization") === "Bearer token-actual") {
      return json(401, { error: { code: "INVALID_AUTH_TOKEN", message: "x" } });
    }
    return json(200, { notebooks: [] });
  });

  const notebooks = await api.listNotebooks();

  assert.deepEqual(notebooks, []);
  assert.deepEqual(calls.map((call) => call.path), ["/module1/notebooks", "/auth/refresh", "/module1/notebooks"]);
  assert.equal(client.getAccessToken(), "token-nuevo");
});

test("401 con refresh fallido devuelve UNAUTHENTICATED y limpia el token", async () => {
  mockFetch(() => json(401, { error: { code: "AUTHENTICATION_REQUIRED", message: "x" } }));

  const error = await apiError(api.listNotebooks());

  assert.equal(error.kind, "UNAUTHENTICATED");
  assert.equal(error.message, "Tu sesión ya no es válida. Inicia sesión nuevamente.");
  assert.equal(client.getAccessToken(), null);
});

test("403 USER_NOT_ACTIVE se normaliza a FORBIDDEN", async () => {
  mockFetch(() => json(403, { error: { code: "USER_NOT_ACTIVE", message: "x" } }));

  const error = await apiError(api.listNotebooks());

  assert.equal(error.kind, "FORBIDDEN");
  assert.equal(error.message, "Tu usuario no está habilitado para usar esta función.");
});
