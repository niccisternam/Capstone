import { describe, expect, it } from "vitest";
import {
  normalizarMontoClp,
  normalizarMontosRespuesta,
  normalizeMissingValues,
} from "../src/modules/module1/gemini.extractor.js";
import { extractionResponseSchema, reviewSchema } from "../src/modules/module1/module1.schemas.js";
import { camposInvalidos } from "../src/modules/module1/processing-log.js";

const found = <T>(valor: T) => ({ valor, estado: "ENCONTRADO" as const });
const absent = () => ({ valor: null as string | null, estado: "AUSENTE" as const });

function response() {
  return {
    documento: {
      tipoDocumento: found("FACTURA ELECTRONICA"),
      folio: found("3858"),
      fechaEmision: found("2026-03-16"),
      emisor: { rut: found("76.660.000-K"), razonSocial: found("Tecnología Andina Ltda.") },
      receptor: { rut: found("62.106.848-2"), nombre: found("Alimentos Don Ernesto Ltda.") },
      condicionTributaria: found("AFECTA"),
      detalles: {
        estado: "ENCONTRADO" as const,
        valor: [{
          descripcion: found("Fertilizante NPK bolsa 25 kg"), cantidad: found("1.500"), unidad: found("SAC"),
          precioUnitario: found("22.000"), descuentoPorcentaje: absent(), descuentoMonto: found("1.100"),
          recargoPorcentaje: absent(), recargoMonto: absent(), totalLinea: found("$ 31.900"),
        }],
      },
      ajustesGlobales: {
        estado: "ENCONTRADO" as const,
        valor: [
          { tipo: "DESCUENTO", modalidad: "MONTO", valor: found("15.000"), descripcion: found("Descuento global") },
          { tipo: "RECARGO", modalidad: "PORCENTAJE", valor: found("3"), descripcion: found("Recargo global") },
        ],
      },
      totales: { neto: found("2.511.281"), iva: found("477.143"), exento: absent(), total: found("2.988.424") },
      medioPago: found("Transferencia electrónica"),
    },
    errores: [],
    advertencias: [],
  };
}

describe("normalizarMontoClp", () => {
  it.each([
    ["2.511.281", "2511281"],
    ["477.143", "477143"],
    ["$ 2.988.424", "2988424"],
    ["$31.900", "31900"],
    ["-15.000", "-15000"],
    ["1.234,5", "1234.5"],
    ["1234,50", "1234.50"],
    ["2511281", "2511281"],
    ["12.5", "12.5"],
  ])("convierte %s en %s", (entrada, esperado) => {
    expect(normalizarMontoClp(entrada)).toBe(esperado);
  });

  it("deja intactos los valores que no son montos", () => {
    expect(normalizarMontoClp(null)).toBeNull();
    expect(normalizarMontoClp("N/A")).toBe("N/A");
    expect(normalizarMontoClp("1.2.3")).toBe("1.2.3");
  });
});

describe("normalizarMontosRespuesta", () => {
  it("quita los puntos de miles solo en campos de dinero y la respuesta pasa la validación", () => {
    const normalizada = normalizarMontosRespuesta(response()) as ReturnType<typeof response>;
    const { totales, detalles, ajustesGlobales } = normalizada.documento;

    expect(totales.neto.valor).toBe("2511281");
    expect(totales.iva.valor).toBe("477143");
    expect(totales.total.valor).toBe("2988424");
    expect(detalles.valor[0]!.precioUnitario.valor).toBe("22000");
    expect(detalles.valor[0]!.descuentoMonto.valor).toBe("1100");
    expect(detalles.valor[0]!.totalLinea.valor).toBe("31900");
    expect(ajustesGlobales.valor[0]!.valor.valor).toBe("15000");
    expect(extractionResponseSchema.safeParse(normalizada).success).toBe(true);
  });

  it("no toca las cantidades ni los ajustes en porcentaje", () => {
    const normalizada = normalizarMontosRespuesta(response()) as ReturnType<typeof response>;
    expect(normalizada.documento.detalles.valor[0]!.cantidad.valor).toBe("1.500");
    expect(normalizada.documento.ajustesGlobales.valor[1]!.valor.valor).toBe("3");
  });

  it("sin normalizar, los montos con puntos de miles fallan con invalid_format", () => {
    const parsed = extractionResponseSchema.safeParse(response());
    expect(parsed.success).toBe(false);
    expect(camposInvalidos(parsed.error!.issues).campos).toContainEqual({
      ruta: "documento.totales.neto.valor",
      tipo: "invalid_format",
    });
  });

  it("tolera respuestas sin documento", () => {
    expect(normalizarMontosRespuesta(null)).toBeNull();
    expect(normalizarMontosRespuesta({})).toEqual({});
  });
});

describe("largos máximos de la extracción", () => {
  it("rechaza un RUT de más de 12 caracteres como error de validación (no de base de datos)", () => {
    const invalida = normalizarMontosRespuesta(response()) as ReturnType<typeof response>;
    invalida.documento.receptor.rut = found("no identificado");
    const parsed = extractionResponseSchema.safeParse(invalida);

    expect(parsed.success).toBe(false);
    expect(camposInvalidos(parsed.error!.issues).campos).toContainEqual({
      ruta: "documento.receptor.rut.valor",
      tipo: "too_big",
    });
  });

  it.each([
    ["folio", (r: ReturnType<typeof response>) => { r.documento.folio = found("1".repeat(31)); }],
    ["medioPago", (r: ReturnType<typeof response>) => { r.documento.medioPago = found("x".repeat(41)); }],
    ["unidad", (r: ReturnType<typeof response>) => { r.documento.detalles.valor[0]!.unidad = found("x".repeat(41)); }],
  ])("rechaza un %s más largo que su columna", (_campo, alterar) => {
    const invalida = normalizarMontosRespuesta(response()) as ReturnType<typeof response>;
    alterar(invalida);
    expect(extractionResponseSchema.safeParse(invalida).success).toBe(false);
  });

  it("acepta un RUT con puntos y guion (12 caracteres)", () => {
    const valida = normalizarMontosRespuesta(response()) as ReturnType<typeof response>;
    valida.documento.receptor.rut = found("76.543.210-K");
    expect(extractionResponseSchema.safeParse(valida).success).toBe(true);
  });
});

describe("marcadores de ausencia", () => {
  it("convierte S/N en null cuando el estado es AUSENTE", () => {
    const normalizado = normalizeMissingValues({ rut: { valor: "S/N", estado: "AUSENTE" } }) as { rut: { valor: unknown } };
    expect(normalizado.rut.valor).toBeNull();
  });

  it("no convierte S/N si el estado dice ENCONTRADO", () => {
    const normalizado = normalizeMissingValues({ rut: { valor: "S/N", estado: "ENCONTRADO" } }) as { rut: { valor: unknown } };
    expect(normalizado.rut.valor).toBe("S/N");
  });
});

describe("largos máximos de la revisión manual", () => {
  it("rechaza un RUT de más de 12 caracteres al guardar la revisión", () => {
    const result = reviewSchema.safeParse({
      estadoPago: "PENDIENTE",
      datos: { receptor: { rut: "1234567890123" } },
    });
    expect(result.success).toBe(false);
  });

  it("acepta una revisión con largos válidos", () => {
    const result = reviewSchema.safeParse({
      estadoPago: "PAGADO",
      datos: { folio: "3858", emisor: { rut: "76.660.000-K" }, medioPago: "Transferencia" },
    });
    expect(result.success).toBe(true);
  });
});
