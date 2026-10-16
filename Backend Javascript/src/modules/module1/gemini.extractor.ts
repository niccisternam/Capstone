import { GoogleGenerativeAI, SchemaType, type Schema } from "@google/generative-ai";
import { AppError } from "../../shared/errors/app-error.js";
import { extractionResponseSchema } from "./module1.schemas.js";
import type { DocumentExtractor, ExtractionResponse } from "./module1.types.js";

const EXTRACTION_PROMPT = `Eres un extractor de documentos tributarios. Devuelve únicamente JSON válido con la estructura solicitada.
No inventes valores: usa estado AUSENTE, NO_APLICA, ILEGIBLE o INCIERTO cuando corresponda.
Los montos y cantidades deben ser cadenas decimales con punto. Las fechas deben usar AAAA-MM-DD.
Cuando un campo numérico no exista, usa valor null y estado AUSENTE o NO_APLICA. No uses "", "N/A" ni "null" como texto.
Cada campo debe contener valor, estado y opcionalmente confianza y evidencia.
La respuesta debe tener documento, errores y advertencias.

El PDF original se adjunta como archivo. Interpreta directamente su contenido visual y textual, sin inventar valores.
`;

// La API de Gemini necesita recibir el contrato además de la instrucción textual.
// Zod permanece como validación final para verificar los campos y valores de negocio.
const extractionFieldSchema = (): Schema => ({
  type: SchemaType.OBJECT,
  properties: {
    valor: { type: SchemaType.STRING },
    estado: { type: SchemaType.STRING, format: "enum", enum: ["ENCONTRADO", "AUSENTE", "NO_APLICA", "ILEGIBLE", "INCIERTO"] },
    confianza: { type: SchemaType.NUMBER },
    evidencia: {
      type: SchemaType.OBJECT,
      properties: {
        pagina: { type: SchemaType.INTEGER },
        zona: { type: SchemaType.STRING },
        textoDetectado: { type: SchemaType.STRING },
      },
    },
  },
  required: ["valor", "estado"],
});

const extractionCollectionSchema = (items: Schema): Schema => ({
  type: SchemaType.OBJECT,
  properties: {
    estado: { type: SchemaType.STRING, format: "enum", enum: ["ENCONTRADO", "AUSENTE", "NO_APLICA", "ILEGIBLE", "INCIERTO"] },
    valor: { type: SchemaType.ARRAY, items },
    confianza: { type: SchemaType.NUMBER },
  },
  required: ["estado", "valor"],
});

const detailResponseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    descripcion: extractionFieldSchema(), cantidad: extractionFieldSchema(), unidad: extractionFieldSchema(),
    precioUnitario: extractionFieldSchema(), descuentoPorcentaje: extractionFieldSchema(), descuentoMonto: extractionFieldSchema(),
    recargoPorcentaje: extractionFieldSchema(), recargoMonto: extractionFieldSchema(), totalLinea: extractionFieldSchema(),
  },
  required: ["descripcion", "cantidad", "unidad", "precioUnitario", "descuentoPorcentaje", "descuentoMonto", "recargoPorcentaje", "recargoMonto", "totalLinea"],
};

const adjustmentResponseSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: { tipo: { type: SchemaType.STRING }, modalidad: { type: SchemaType.STRING }, valor: extractionFieldSchema(), descripcion: extractionFieldSchema() },
  required: ["tipo", "modalidad", "valor", "descripcion"],
};

const EXTRACTION_RESPONSE_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    documento: {
      type: SchemaType.OBJECT,
      properties: {
        tipoDocumento: extractionFieldSchema(), folio: extractionFieldSchema(), fechaEmision: extractionFieldSchema(),
        emisor: { type: SchemaType.OBJECT, properties: { rut: extractionFieldSchema(), razonSocial: extractionFieldSchema() }, required: ["rut", "razonSocial"] },
        receptor: { type: SchemaType.OBJECT, properties: { rut: extractionFieldSchema(), nombre: extractionFieldSchema() }, required: ["rut", "nombre"] },
        condicionTributaria: extractionFieldSchema(),
        detalles: extractionCollectionSchema(detailResponseSchema),
        ajustesGlobales: extractionCollectionSchema(adjustmentResponseSchema),
        totales: { type: SchemaType.OBJECT, properties: { neto: extractionFieldSchema(), iva: extractionFieldSchema(), exento: extractionFieldSchema(), total: extractionFieldSchema() }, required: ["neto", "iva", "exento", "total"] },
        medioPago: extractionFieldSchema(),
      },
      required: ["tipoDocumento", "folio", "fechaEmision", "emisor", "receptor", "condicionTributaria", "detalles", "ajustesGlobales", "totales", "medioPago"],
      description: "Datos extraídos del documento tributario, con el formato indicado en el prompt.",
    },
    errores: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          codigo: { type: SchemaType.STRING },
          mensaje: { type: SchemaType.STRING },
          campo: { type: SchemaType.STRING },
        },
      },
    },
    advertencias: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          codigo: { type: SchemaType.STRING },
          mensaje: { type: SchemaType.STRING },
          campo: { type: SchemaType.STRING },
        },
      },
    },
  },
  required: ["documento", "errores", "advertencias"],
};

export function parseJson(text: string): unknown {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  try {
    return JSON.parse(cleaned);
  } catch {
    throw new AppError(502, "AI_INVALID_JSON", "El servicio de IA devolvió una respuesta no válida");
  }
}

function normalizeMissingValues(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeMissingValues);
  if (!value || typeof value !== "object") return value;

  const record = value as Record<string, unknown>;
  const normalized = Object.fromEntries(Object.entries(record).map(([key, child]) => [key, normalizeMissingValues(child)]));
  const marker = normalized.valor;
  const state = normalized.estado;
  const isMissingState = state === "AUSENTE" || state === "NO_APLICA";
  const isMissingMarker = marker === "" || marker === "N/A" || marker === "NA" || marker === "null" || marker === "NULL";
  if (isMissingState && isMissingMarker) normalized.valor = null;
  return normalized;
}

function friendlyValidationIssue(path: PropertyKey[]): string {
  const field = path.join(".");
  if (field.includes("condicionTributaria")) return "No pudimos identificar la condición tributaria";
  if (field.includes("fechaEmision")) return "La fecha de emisión no pudo interpretarse correctamente";
  if (field.includes("detalles")) return "Una línea de detalle contiene información que no pudimos interpretar";
  if (field.includes("ajustesGlobales")) return "Un descuento o recargo global contiene información que no pudimos interpretar";
  if (field.includes("totales")) return "Uno de los totales del documento no pudo interpretarse correctamente";
  if (field.includes("emisor")) return "La información del emisor no pudo interpretarse correctamente";
  if (field.includes("receptor")) return "La información del receptor no pudo interpretarse correctamente";
  if (field.includes("medioPago")) return "El medio de pago no pudo interpretarse correctamente";
  return "No pudimos interpretar completamente los datos extraídos del documento";
}

function summarizeValidationIssues(issues: Array<{ path: PropertyKey[]; message: string }>): string {
  const fields = [...new Set(issues.slice(0, 5).map((issue) => friendlyValidationIssue(issue.path)))];
  const remaining = issues.length - fields.length;
  return `No pudimos interpretar completamente el documento. ${fields.join(". ")}.${remaining > 0 ? ` También hay ${remaining} dato(s) que requieren revisión.` : ""} Puedes volver a intentarlo o revisar el documento manualmente.`;
}

function geminiErrorStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") return undefined;
  const candidate = error as { status?: unknown; statusCode?: unknown; response?: { status?: unknown } };
  for (const value of [candidate.status, candidate.statusCode, candidate.response?.status]) {
    const status = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
    if (Number.isInteger(status) && status >= 400 && status <= 599) return status;
  }
  const message = error instanceof Error ? error.message : String(error);
  const match = message.match(/\b(400|403|404|429|500|502|503)\b/);
  return match ? Number(match[1]) : undefined;
}

export function normalizeGeminiError(error: unknown): AppError {
  const status = geminiErrorStatus(error);
  // Gemini responde una clave inválida con 400, no 403; sin esto el mensaje culpa al modelo.
  if (/API_KEY_INVALID|API key not valid/i.test(error instanceof Error ? error.message : String(error))) return new AppError(502, "AI_AUTHENTICATION", "El servicio de análisis rechazó la API configurada. Revisa la clave y sus permisos.");
  if (status === 400) return new AppError(502, "AI_BAD_REQUEST", "El servicio de análisis rechazó la solicitud. Revisa el modelo o el formato configurado.");
  if (status === 403) return new AppError(502, "AI_AUTHENTICATION", "El servicio de análisis rechazó la API configurada. Revisa la clave y sus permisos.");
  if (status === 404) return new AppError(502, "AI_MODEL_NOT_FOUND", "El modelo de análisis configurado no está disponible.");
  if (status === 429) return new AppError(503, "AI_RATE_LIMITED", "Se alcanzó temporalmente el límite del servicio de análisis. Espera antes de volver a intentarlo.");
  return new AppError(503, "AI_UNAVAILABLE", "El servicio de análisis no está disponible temporalmente.");
}

export class GeminiExtractor implements DocumentExtractor {
  private readonly client: GoogleGenerativeAI;

  constructor(private readonly apiKey: string, private readonly modelName: string) {
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async extract(pdf: Buffer): Promise<ExtractionResponse> {
    try {
      const model = this.client.getGenerativeModel({
        model: this.modelName,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: EXTRACTION_RESPONSE_SCHEMA,
          temperature: 0,
        },
      });
      const response = await model.generateContent([
        EXTRACTION_PROMPT,
        { inlineData: { mimeType: "application/pdf", data: pdf.toString("base64") } },
      ]);
      const parsed = extractionResponseSchema.safeParse(normalizeMissingValues(parseJson(response.response.text())));
      if (!parsed.success) {
        throw new AppError(502, "AI_INVALID_RESPONSE", summarizeValidationIssues(parsed.error.issues), { issueCount: parsed.error.issues.length });
      }
      return parsed.data as ExtractionResponse;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw normalizeGeminiError(error);
    }
  }
}

export class MockExtractor implements DocumentExtractor {
  constructor(private readonly handler: DocumentExtractor["extract"] = async () => {
    throw new Error("MockExtractor sin respuesta configurada");
  }) {}

  extract(pdf: Buffer): Promise<ExtractionResponse> {
    return this.handler(pdf);
  }
}

export class UnavailableExtractor implements DocumentExtractor {
  async extract(pdf: Buffer): Promise<ExtractionResponse> {
    void pdf;
    throw new AppError(503, "AI_NOT_CONFIGURED", "El servicio de extracción IA no está configurado");
  }
}
