import test from "node:test";
import assert from "node:assert/strict";
import { loadTsModule } from "./helpers/ts-module-loader.mjs";

const client = await loadTsModule("src/api/client.ts");
const api = await loadTsModule("src/api/dashboard.api.ts");
const idNotebook = "0a000000-0000-4000-8000-000000000001";

test("consultarMetrica llama a Express con el notebook, la métrica y el token", async () => {
  const originalFetch = globalThis.fetch;
  client.setAccessToken("token-dashboard");
  let llamada;
  globalThis.fetch = async (url, init) => {
    llamada = { url: String(url), init };
    return new Response(JSON.stringify({
      metrica: "resumen_montos",
      filtros: { direccion: "COMPRA" },
      datos: [{ neto: "1000", iva: "190", exento: "0", total: "1190", documentos: 1 }],
      actualizadoEn: "2026-11-13T12:00:00.000Z",
    }), { status: 200, headers: { "content-type": "application/json" } });
  };

  try {
    const result = await api.consultarMetrica(idNotebook, "resumen_montos");
    assert.equal(result.datos[0].total, "1190");
    assert.equal(llamada.url, "http://localhost:3000/api/v1/dashboard/notebooks/" + idNotebook + "/query");
    assert.equal(llamada.init.method, "POST");
    assert.equal(new Headers(llamada.init.headers).get("authorization"), "Bearer token-dashboard");
    assert.deepEqual(JSON.parse(llamada.init.body), {
      metrica: "resumen_montos",
      filtros: { direccion: "COMPRA" },
    });
  } finally {
    globalThis.fetch = originalFetch;
    client.setAccessToken(null);
  }
});

test("consultarMetrica envía el rango de meses al dashboard", async () => {
  const originalFetch = globalThis.fetch;
  client.setAccessToken("token-dashboard");
  let llamada;
  globalThis.fetch = async (url, init) => {
    llamada = { url: String(url), init };
    return new Response(JSON.stringify({
      metrica: "compras_por_periodo",
      filtros: { direccion: "COMPRA", desde: "2026-01", hasta: "2026-06" },
      datos: [{ periodo: "2026-01", total: "1000", documentos: 1 }],
      actualizadoEn: "2026-11-13T12:00:00.000Z",
    }), { status: 200, headers: { "content-type": "application/json" } });
  };

  try {
    const result = await api.consultarMetrica(idNotebook, "compras_por_periodo", {
      desde: "2026-01",
      hasta: "2026-06",
    });
    assert.equal(result.datos[0].periodo, "2026-01");
    assert.deepEqual(JSON.parse(llamada.init.body), {
      metrica: "compras_por_periodo",
      filtros: { direccion: "COMPRA", desde: "2026-01", hasta: "2026-06" },
    });
  } finally {
    globalThis.fetch = originalFetch;
    client.setAccessToken(null);
  }
});

test("consultarMetrica rechaza un id de notebook inválido sin llamar a Express", async () => {
  const originalFetch = globalThis.fetch;
  let llamadas = 0;
  globalThis.fetch = async () => {
    llamadas += 1;
    return new Response("{}", { status: 200 });
  };

  try {
    await assert.rejects(api.consultarMetrica("no-es-uuid", "resumen_montos"), { code: "INVALID_IDENTIFIER" });
    assert.equal(llamadas, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("consultarMetrica envía la dirección elegida (VENTA y TODAS) en lugar de COMPRA fijo", async () => {
  const originalFetch = globalThis.fetch;
  client.setAccessToken("token-dashboard");
  const cuerpos = [];
  globalThis.fetch = async (_url, init) => {
    cuerpos.push(JSON.parse(init.body));
    return new Response(JSON.stringify({
      metrica: "compras_por_periodo",
      filtros: { direccion: "VENTA" },
      datos: [],
      actualizadoEn: "2026-11-13T12:00:00.000Z",
    }), { status: 200, headers: { "content-type": "application/json" } });
  };

  try {
    await api.consultarMetrica(idNotebook, "compras_por_periodo", { direccion: "VENTA" });
    await api.consultarMetrica(idNotebook, "compras_por_periodo", { direccion: "TODAS" });
    assert.deepEqual(cuerpos, [
      { metrica: "compras_por_periodo", filtros: { direccion: "VENTA" } },
      { metrica: "compras_por_periodo", filtros: { direccion: "TODAS" } },
    ]);
  } finally {
    globalThis.fetch = originalFetch;
    client.setAccessToken(null);
  }
});
