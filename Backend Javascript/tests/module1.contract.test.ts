import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { MockExtractor } from "../src/modules/module1/gemini.extractor.js";
import { extractionResponseSchema, reviewSchema } from "../src/modules/module1/module1.schemas.js";
import { validatePdfAndExtract } from "../src/modules/module1/module1.service.js";

const found = <T>(valor: T) => ({ valor, estado: "ENCONTRADO" as const });
const absent = () => ({ valor: null, estado: "AUSENTE" as const });

function response() {
  return {
    documento: {
      tipoDocumento: found("BOLETA"),
      folio: found("8815"),
      fechaEmision: found("2026-03-16"),
      emisor: { rut: found("78444555-2"), razonSocial: found("Farmacia Salud SpA") },
      receptor: { rut: absent(), nombre: absent() },
      condicionTributaria: found("AFECTA"),
      detalles: { estado: "ENCONTRADO" as const, valor: [{
        descripcion: found("Producto de prueba"), cantidad: found("2"), unidad: found("UND"),
        precioUnitario: found("3500"), descuentoPorcentaje: absent(), descuentoMonto: absent(),
        recargoPorcentaje: absent(), recargoMonto: absent(), totalLinea: found("7000"),
      }] },
      ajustesGlobales: { estado: "AUSENTE" as const, valor: null },
      totales: { neto: found("26000"), iva: found("4940"), exento: absent(), total: found("30940") },
      medioPago: found("EFECTIVO"),
    },
    errores: [],
    advertencias: [],
  };
}

describe("Módulo 1 - contrato de extracción", () => {
  it("acepta campos ausentes sin convertirlos en errores", () => {
    const result = extractionResponseSchema.safeParse(response());
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.documento.receptor.rut.estado).toBe("AUSENTE");
      expect(result.data.documento.detalles.valor).toHaveLength(1);
    }
  });

  it("rechaza porcentajes fuera del rango contractual", () => {
    const invalid = response();
    invalid.documento.detalles.valor[0].descuentoPorcentaje = found("101");
    const result = extractionResponseSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("usa un extractor mock sin realizar llamadas externas", async () => {
    let calls = 0;
    let received: Buffer | undefined;
    const extractor = new MockExtractor(async (pdf) => {
      calls += 1;
      received = pdf;
      return response();
    });
    const pdf = Buffer.from("%PDF-mock-original");
    const result = await extractor.extract(pdf);
    expect(calls).toBe(1);
    expect(received).toBe(pdf);
    expect(result.documento.tipoDocumento.valor).toBe("BOLETA");
  });

  it("envía el PDF original al extractor después de validar la capa de texto", async () => {
    let received: Buffer | undefined;
    const pdf = await readFile(path.resolve(process.cwd(), "..", "Documentacion", "General", "module1-test-documents", "01_factura_completa.pdf"));
    const extractor = new MockExtractor(async (input) => {
      received = input;
      return response();
    });
    await validatePdfAndExtract(pdf, extractor);
    expect(received).toBe(pdf);
  });

  it("rechaza una respuesta estructurada inválida antes de persistirla", async () => {
    const pdf = await readFile(path.resolve(process.cwd(), "..", "Documentacion", "General", "module1-test-documents", "01_factura_completa.pdf"));
    const extractor = new MockExtractor(async () => ({ documento: {}, errores: [], advertencias: [] } as never));
    await expect(validatePdfAndExtract(pdf, extractor)).rejects.toMatchObject({ code: "AI_INVALID_RESPONSE" });
  });

  it("valida correcciones de encabezado, detalles y ajustes globales", () => {
    const result = reviewSchema.safeParse({
      estadoPago: "PAGADO",
      observacion: "Corrección manual",
      datos: {
        tipoDocumento: "FACTURA",
        folio: "1042",
        fechaEmision: "2026-03-14",
        emisor: { rut: "76543210-K", razonSocial: "Comercial Andes SpA" },
        receptor: { rut: null, nombre: null },
        condicionTributaria: "AFECTA",
        detalles: [{ descripcion: "Servicio corregido", totalLinea: "1000" }],
        ajustesGlobales: [{ tipo: "DESCUENTO", modalidad: "MONTO", valor: "100", descripcion: "Volumen" }],
        totales: { neto: "900", iva: "171", exento: null, total: "1071" },
        medioPago: "TRANSFERENCIA",
      },
    });
    expect(result.success).toBe(true);
  });
});

describe("Módulo 1 - errores de Gemini", () => {
  it("distingue una API key inválida (400) de una solicitud mal formada", async () => {
    const { normalizeGeminiError } = await import("../src/modules/module1/gemini.extractor.js");
    const invalidKey = Object.assign(new Error("[400 Bad Request] API key not valid. Please pass a valid API key. [{\"reason\":\"API_KEY_INVALID\"}]"), { status: 400 });
    expect(normalizeGeminiError(invalidKey).code).toBe("AI_AUTHENTICATION");
    expect(normalizeGeminiError(Object.assign(new Error("[400 Bad Request] Invalid schema"), { status: 400 })).code).toBe("AI_BAD_REQUEST");
  });
});
