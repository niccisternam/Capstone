import { PDFParse } from "pdf-parse";
import { AppError } from "../../shared/errors/app-error.js";

export interface PdfTextValidationResult {
  pages: number;
  textCharacters: number;
}

/**
 * Performs only the technical text-layer check required before Gemini.
 * The extracted text is deliberately not returned to the caller.
 */
export async function validatePdfTextLayer(buffer: Buffer): Promise<PdfTextValidationResult> {
  if (buffer.length < 4 || buffer.subarray(0, 4).toString("ascii") !== "%PDF") {
    throw new AppError(400, "INVALID_PDF", "El archivo no es un PDF válido");
  }
  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    const text = result.text.replace(/--\s*\d+\s+of\s+\d+\s*--/g, "").trim();
    if (!text) {
      throw new AppError(422, "PDF_WITHOUT_TEXT", "El PDF no contiene texto procesable");
    }
    return { pages: result.total, textCharacters: text.length };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(422, "PDF_TEXT_EXTRACTION_FAILED", "No fue posible extraer texto del PDF");
  } finally {
    await parser.destroy();
  }
}
