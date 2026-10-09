import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { validatePdfTextLayer } from "../src/modules/module1/pdf-text.service.js";
import { validatePdfAndExtract } from "../src/modules/module1/module1.service.js";

describe("Módulo 1 - validación de PDF", () => {
  it("rechaza un archivo que no tiene firma PDF", async () => {
    await expect(validatePdfTextLayer(Buffer.from("not-a-pdf"))).rejects.toMatchObject({ code: "INVALID_PDF" });
  });

  it("detecta un PDF sin texto sin ejecutar OCR", async () => {
    const file = path.resolve(process.cwd(), "..", "Documentacion", "General", "module1-test-documents", "08_pdf_sin_texto.pdf");
    await expect(validatePdfTextLayer(await readFile(file))).rejects.toMatchObject({ code: "PDF_WITHOUT_TEXT" });
  });

  it("no invoca el extractor cuando el PDF no tiene capa textual utilizable", async () => {
    const file = path.resolve(process.cwd(), "..", "Documentacion", "General", "module1-test-documents", "08_pdf_sin_texto.pdf");
    let calls = 0;
    const extractor = { extract: async () => { calls += 1; throw new Error("no debe invocarse"); } };
    await expect(validatePdfAndExtract(await readFile(file), extractor)).rejects.toMatchObject({ code: "PDF_WITHOUT_TEXT" });
    expect(calls).toBe(0);
  });
});
