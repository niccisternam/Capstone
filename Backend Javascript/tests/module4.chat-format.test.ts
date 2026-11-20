import { describe, expect, it } from "vitest";
import { respuestaLocal } from "../src/modules/module4/chat.format.js";

describe("Chat - formato de respuestas locales", () => {
  it("muestra un conteo con alias 'total_documentos' como entero, no como moneda", () => {
    expect(respuestaLocal([{ total_documentos: "499" }])).toBe("Total documentos: 499");
  });

  it("sigue mostrando montos con alias monetario como pesos", () => {
    expect(respuestaLocal([{ total_pendiente: "1234567" }])).toBe("Total pendiente: $1.234.567");
  });
});
