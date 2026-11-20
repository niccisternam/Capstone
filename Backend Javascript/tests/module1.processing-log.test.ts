import { afterEach, describe, expect, it, vi } from "vitest";
import { AppError } from "../src/shared/errors/app-error.js";
import { extractionResponseSchema } from "../src/modules/module1/module1.schemas.js";
import {
  camposInvalidos,
  describeProcessingError,
  logProcessingFailure,
} from "../src/modules/module1/processing-log.js";

afterEach(() => vi.restoreAllMocks());

function prismaError(code: string, meta: Record<string, unknown>, message: string) {
  const error = new Error(message) as Error & { code: string; meta: Record<string, unknown> };
  error.name = "PrismaClientKnownRequestError";
  error.code = code;
  error.meta = meta;
  return error;
}

describe("camposInvalidos", () => {
  it("resume rutas y tipos de los problemas de validación sin incluir valores", () => {
    const parsed = extractionResponseSchema.safeParse({
      documento: { totales: { neto: { valor: "2.511.281", estado: "ENCONTRADO" } } },
      errores: [],
      advertencias: [],
    });
    expect(parsed.success).toBe(false);
    const resumen = camposInvalidos(parsed.error!.issues);

    expect(resumen.issueCount).toBe(parsed.error!.issues.length);
    expect(resumen.campos).toContainEqual({ ruta: "documento.totales.neto.valor", tipo: "invalid_format" });
    expect(JSON.stringify(resumen)).not.toContain("2.511.281");
  });

  it("limita la cantidad de campos listados", () => {
    const issues = Array.from({ length: 50 }, (_, i) => ({ path: ["documento", `campo${i}`], code: "invalid_type" }));
    const resumen = camposInvalidos(issues);
    expect(resumen.issueCount).toBe(50);
    expect(resumen.campos).toHaveLength(20);
  });
});

describe("describeProcessingError", () => {
  it("describe un AppError con su código y detalles", () => {
    const detalles = { issueCount: 1, campos: [{ ruta: "documento.totales.total.valor", tipo: "invalid_format" }] };
    expect(describeProcessingError(new AppError(502, "AI_INVALID_RESPONSE", "mensaje", detalles))).toEqual({
      origen: "app",
      codigo: "AI_INVALID_RESPONSE",
      detalles,
    });
  });

  it("describe un error de Prisma con código y metadatos, sin el mensaje que puede repetir los datos", () => {
    const error = prismaError(
      "P2000",
      { column_name: "receptor_rut" },
      'Invalid `prisma.resultadoExtraccion.create()` invocation: receptorRut: "no identificado" is too long',
    );
    const causa = describeProcessingError(error);

    expect(causa).toEqual({
      origen: "base_de_datos",
      tipo: "PrismaClientKnownRequestError",
      prismaCodigo: "P2000",
      meta: { column_name: "receptor_rut" },
    });
    expect(JSON.stringify(causa)).not.toContain("no identificado");
  });

  it("acota el mensaje de un error desconocido", () => {
    const causa = describeProcessingError(new TypeError("x".repeat(500)));
    expect(causa).toMatchObject({ origen: "desconocido", tipo: "TypeError" });
    expect((causa.mensaje as string).length).toBe(200);
  });
});

describe("logProcessingFailure", () => {
  it("escribe una línea JSON con el documento, el intento y la causa", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    logProcessingFailure({
      idDocumento: "doc-1",
      idIntento: "int-1",
      numeroIntento: 2,
      codigo: "DOCUMENT_PROCESSING_FAILED",
      error: prismaError("P2000", { column_name: "receptor_rut" }, "detalle"),
    });

    expect(spy).toHaveBeenCalledOnce();
    expect(JSON.parse(spy.mock.calls[0]![0] as string)).toEqual({
      level: "error",
      event: "document_processing_failed",
      idDocumento: "doc-1",
      idIntento: "int-1",
      numeroIntento: 2,
      codigo: "DOCUMENT_PROCESSING_FAILED",
      causa: {
        origen: "base_de_datos",
        tipo: "PrismaClientKnownRequestError",
        prismaCodigo: "P2000",
        meta: { column_name: "receptor_rut" },
      },
    });
  });
});
