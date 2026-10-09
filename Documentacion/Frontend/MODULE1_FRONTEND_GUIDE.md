# Guía de integración frontend — Módulo 1

## Fuentes de verdad y estado real

- `Documentacion/Backend/MODULE1_SPEC.md`: requisitos y reglas aprobadas.
- Este documento: flujo frontend y contrato backend observado.
- `Frontend/README.md`: tecnologías y sesión.
- `Documentacion/Frontend/ARCHITECTURE.md`: límites de arquitectura.
- `Documentacion/Frontend/API_INTEGRATION.md`: reglas de consumo de Express.

Estado real:

- El backend tiene rutas y servicios del Módulo 1 en `src/modules/module1`.
- El frontend tiene la capa API y las pantallas del Módulo 1 implementadas, con consumo de Express mediante `src/api/module1.api.ts`.
- Las pantallas cubren listado y edición de notebooks, carga, cola, procesamiento, documentos existentes, revisión individual y revisión por lote.
- Los mockups del Módulo 1 se encuentran en `Documentacion/Frontend/Mockups modulo 1/`.
- La migración del Módulo 1 se considera lista/aplicada según la confirmación del responsable del proyecto; no fue verificada desde este entorno.

## Flujo funcional para la interfaz

1. El usuario autenticado entra al área de notebooks.
2. Lista notebooks o crea uno nuevo.
3. El nombre se valida como único dentro de la empresa, sin distinguir mayúsculas/minúsculas.
4. Entra al notebook y consulta sus documentos.
5. Selecciona entre 1 y 10 PDF.
6. El frontend valida MIME y máximo de 15 MB por archivo.
7. Envía los archivos como `multipart/form-data`, usando el campo repetible `documents`.
8. El backend crea un lote y deja sus documentos en `PENDIENTE`; la carga no inicia automáticamente el procesamiento.
9. El usuario inicia el procesamiento del lote.
10. El backend procesa secuencialmente según `posicionLote`.
11. Los documentos válidos pasan a `PENDIENTE_REVISION`; los errores pasan a `ERROR` y no detienen el lote.
12. El usuario consulta el PDF, los datos preliminares, detalles, ajustes, totales y advertencias.
13. Puede corregir cualquiera de los campos extraídos por Gemini, registrar `estadoPago` interno y agregar `observacion`.
14. Guarda la revisión y confirma el documento.
15. El documento pasa a `CONFIRMADO` y se navega al siguiente pendiente.
16. Un documento `ERROR` puede reintentarse.
17. Los documentos `PENDIENTE` o `ERROR` pueden eliminarse desde la cola; los documentos existentes procesados o confirmados también pueden eliminarse desde su tabla.
18. Un archivo seleccionado en “Cargar documentos” puede quitarse localmente antes de enviarlo al backend.
19. Un notebook puede editarse y eliminarse, incluyendo sus documentos asociados.
20. Un documento confirmado puede reabrirse para editarlo; al modificar campos vuelve a requerir confirmación.
21. La revisión por lote muestra todos los documentos en una misma página, cada uno con su visor PDF y formulario independiente.

Estados válidos:

```text
PENDIENTE
PROCESANDO
PENDIENTE_REVISION
ERROR
CONFIRMADO
```

No mostrar porcentajes de progreso: el backend no los entrega.

## Contrato de API verificado en código

Base: `/api/v1/module1`. Todas las rutas requieren `Authorization: Bearer <accessToken>` y usuario `ACTIVO`.

### Notebooks

```text
POST /notebooks
GET /notebooks
GET /notebooks/:idNotebook
```

Body de creación validado:

```json
{
  "nombre": "Gastos marzo",
  "descripcion": "Documentos del mes",
  "icono": "folder",
  "paletaColores": { "principal": "#2563eb" }
}
```

Restricciones: `nombre` requerido y máximo 150; `descripcion` máximo 5000; `icono` máximo 80. El conflicto de nombre devuelve `409 NOTEBOOK_NAME_TAKEN`.

Las respuestas tienen envoltorios `{ "notebook": ... }` o `{ "notebooks": [...] }`. El detalle incluye documentos, pero no resultados completos ni PDF binario.

### Carga y lotes

```text
POST /notebooks/:idNotebook/documents
POST /batches/:idLote/process
GET  /batches/:idLote
```

La carga usa `multipart/form-data` y el campo repetible `documents`. No establecer manualmente `Content-Type`; el navegador debe crear el boundary.

La carga devuelve `{ "lote": ... }` con documentos inicialmente `PENDIENTE`. El procesamiento se inicia con una segunda solicitud.

La respuesta del procesamiento devuelve el lote y documentos ordenados por `posicionLote`.

### Documentos

```text
PATCH  /notebooks/:idNotebook
DELETE /notebooks/:idNotebook
POST   /documents/:idDocumento/retry
GET    /documents/:idDocumento
GET    /documents/:idDocumento/pdf
PATCH  /documents/:idDocumento/review
POST   /documents/:idDocumento/confirm
POST   /documents/:idDocumento/reopen
DELETE /documents/:idDocumento
```

`GET /documents/:idDocumento` incluye archivo, resultados de extracción con detalles y ajustes, y revisiones.

`GET /documents/:idDocumento/pdf` devuelve binario `application/pdf` con `Content-Disposition: inline`. `getDocumentPdf` valida y devuelve un `Blob` para el visor PDF.

La revisión actual valida:

```json
{
  "estadoPago": "PENDIENTE",
  "observacion": "Revisar folio",
  "datos": {
    "tipoDocumento": "FACTURA",
    "folio": "1042",
    "fechaEmision": "2026-03-14",
    "emisor": { "rut": "76543210-K", "razonSocial": "Comercial Andes SpA" },
    "receptor": { "rut": null, "nombre": null },
    "condicionTributaria": "AFECTA",
    "detalles": [
      {
        "descripcion": "Servicio corregido",
        "cantidad": "1",
        "unidad": "UND",
        "precioUnitario": "1000",
        "descuentoPorcentaje": null,
        "descuentoMonto": null,
        "recargoPorcentaje": null,
        "recargoMonto": null,
        "totalLinea": "1000"
      }
    ],
    "ajustesGlobales": [],
    "totales": { "neto": "1000", "iva": "190", "exento": null, "total": "1190" },
    "medioPago": "TRANSFERENCIA"
  }
}
```

El alcance funcional aprobado permite editar cualquiera de los campos extraídos: encabezado, emisor, receptor, condición tributaria, totales, medio de pago, líneas de detalle y ajustes globales. El backend ahora valida ese contenido y persiste los ajustes globales corregidos. Los campos omitidos conservan el valor extraído originalmente; enviar `null` permite borrar un valor.

La confirmación no recibe body y requiere una revisión `EDITANDO` del usuario autenticado.

La eliminación solo se acepta en `PENDIENTE` o `ERROR`.

## Errores relevantes

El formato es:

```json
{
  "error": { "code": "CODIGO", "message": "Mensaje seguro", "details": {} }
}
```

Códigos del módulo:

```text
AUTHENTICATION_REQUIRED
INVALID_AUTH_TOKEN
USER_NOT_ACTIVE
NOTEBOOK_NOT_FOUND
NOTEBOOK_NAME_TAKEN
INVALID_BATCH_SIZE
INVALID_PDF_FILE
BATCH_NOT_FOUND
DOCUMENT_NOT_FOUND
PDF_NOT_FOUND
PDF_WITHOUT_TEXT
PDF_TEXT_EXTRACTION_FAILED
AI_NOT_CONFIGURED
AI_UNAVAILABLE
AI_INVALID_JSON
AI_INVALID_RESPONSE
DOCUMENT_NOT_RETRYABLE
DOCUMENT_NOT_IN_REVIEW
EXTRACTION_NOT_FOUND
REVIEW_NOT_FOUND
DOCUMENT_NOT_DELETABLE
```

La UI debe diferenciar `401`, `403`, `404`, `409`, `422`, `502` y `503`.

## Autenticación y separación de datos

El frontend debe reutilizar `Frontend/src/api/client.ts`:

- `accessToken` en memoria.
- `credentials: "include"`.
- Cookie refresh administrada por el navegador.
- Bearer token en rutas protegidas.
- Refresh controlado ante `401`.

Express aplica la autorización y filtra por `idEmpresa`. El frontend no debe decidir permisos leyendo únicamente el JWT ni enviar `idEmpresa` como criterio de autorización.

## Extracción IA vigente

El backend realiza una validación técnica local de capa textual usando `pdf-parse`, pero no envía el texto obtenido al proveedor.

```text
PDF original
→ validación local de capa textual
→ Gemini recibe el PDF original como application/pdf
→ respuesta estructurada
→ validación Zod
→ resultado preliminar
→ revisión humana
```

No se implementa OCR. Gemini produce:

- tipo de documento, folio y fecha;
- emisor y receptor;
- condición tributaria;
- detalles repetibles;
- descuentos/recargos por línea y globales;
- neto, IVA, exento y total;
- medio de pago.

Cada campo puede estar en `ENCONTRADO`, `AUSENTE`, `NO_APLICA`, `ILEGIBLE` o `INCIERTO`. Los resultados son preliminares hasta confirmar.

No se realizaron llamadas reales a Gemini para verificar esta integración.

## Estética y reutilización

El frontend real usa Next.js App Router, React, TypeScript, Tailwind CSS y Zod. Aunque el README antiguo menciona CSS propio, `globals.css` importa Tailwind y las páginas usan clases utilitarias.

Patrones visuales actuales:

- fondo claro `#f8fafc`;
- superficies blancas;
- texto oscuro `#0f172a`;
- bordes `slate`, frecuentemente de 2 px;
- tarjetas `rounded-2xl` con `shadow-sm`;
- botones principales `bg-blue-600`;
- botones secundarios blancos con borde;
- badges semánticos compactos;
- Arial/Helvetica;
- contenedores centrados con `max-w-*`;
- responsive mediante clases `sm:`;
- SVG inline para iconos;
- estados de carga y alertas visibles.

Debe reutilizarse:

- `src/app/(protected)/usuario/layout.tsx`;
- `LogoutButton`;
- patrones de formularios de `src/features/auth/components`;
- esquemas Zod existentes;
- `src/api/client.ts`;
- estilos de tarjetas, botones, badges y mensajes existentes.

Las pantallas actuales del Módulo 1 están implementadas en `Frontend/src/features/module1` y `Frontend/src/app/(protected)/usuario`. Los mockups históricos se conservan en `Documentacion/Frontend/Mockups modulo 1/`; pueden orientar ajustes visuales, pero la implementación vigente y los contratos Express son la fuente operativa.

## Reglas para el futuro agente frontend

1. Trabajar dentro del frontend existente.
2. No crear una aplicación paralela.
3. Mantener la estética y los patrones visuales existentes.
4. Centralizar las llamadas en una feature/API del Módulo 1.
5. Consumir únicamente Express; nunca FastAPI o Gemini desde el navegador.
6. No duplicar reglas de negocio ni inventar endpoints.
7. Usar mocks solo de forma separada y explícita.
8. Representar loading, vacío, error, no autorizado, conflicto y éxito.
9. No presentar IA como información confirmada antes de la revisión.
10. No modificar backend, Prisma ni migraciones sin autorización.
11. Implementar en este orden: notebooks, carga/lotes, documentos, revisión/confirmación, reintentos, eliminación y errores.
12. Informar bloqueos si el backend devuelve un campo no contemplado por el contrato de revisión.

## Dudas y discrepancias

- `PATCH /review` valida campos de encabezado, detalles, ajustes globales y totales; la respuesta queda pendiente de verificación contra una base de datos disponible.
- El visor PDF requiere una función binaria que no existe todavía en el cliente HTTP actual.
- La migración se reporta como lista/aplicada, pero no fue verificada desde este entorno.
- Las pantallas del Módulo 1 ya están implementadas; los mockups históricos se conservan en `Documentacion/Frontend/Mockups modulo 1/`.
- El sistema está enfocado actualmente en una persona, aunque conserva `Empresa` como contexto de aislamiento y compatibilidad futura.

## Capa API frontend implementada

Ubicación: `src/api/module1.api.ts` (funciones), `src/api/module1.schemas.ts` (esquemas Zod y tipos derivados), `src/api/api-error.ts` (`ApiError`). Se usa `src/api/` porque es el patrón real de `auth.api.ts` y `accountRequests.api.ts`; `src/services/api/` queda pendiente de decisión.

- Carga: `requestFormData` no establece `Content-Type`; el navegador genera el boundary. El campo es `documents`, repetido.
- PDF: `requestPdf` usa `Accept: application/pdf` y devuelve `Blob`. `getDocumentPdf` rechaza respuestas que no sean `application/pdf`.
- Sesión: Bearer desde memoria, `credentials: "include"` y refresh único ante `401`, igual que antes. `request()` conserva su comportamiento.
- Validación previa: UUID de parámetros, nombre de notebook, reglas de PDF (tipo, 1 byte a 15 MB, firma `%PDF`, 1–10 archivos) y payload de revisión. Un fallo no genera petición de red.
- Revisión: `estadoPago` y `observacion` siempre se envían. Los campos omitidos conservan el valor extraído; `null` borra; un array de `detalles` o `ajustesGlobales` reemplaza la lista completa.
- Procesamiento: `processBatch` acepta `AbortSignal`. No tiene timeout automático: un corte del cliente no detiene el procesamiento del servidor.

## Bloqueos detectados al implementar la capa

- **B-SERIALIZE (bloqueante para `getDocument`):** `GET /documents/:id` incluye `archivo.tamanoBytes`, que es `BigInt`. El backend no define `BigInt.prototype.toJSON`, así que `res.json` falla y la respuesta es `500 INTERNAL_ERROR`. El frontend omite ese campo del esquema, pero la respuesta sigue fallando hasta que el backend lo serialice. No se modificó el backend.
- **Fallo de reintento con HTTP 200:** `POST /retry` devuelve `{ documento: { idDocumento, estado: "ERROR", error } }` si el reintento falla. La UI distingue ambos casos por la presencia de `error`.
- **Carga todo o nada:** un archivo inválido rechaza el lote completo y la respuesta no indica cuál. El frontend valida antes y envía el nombre del archivo en `details` del error de cliente.
- **Errores de multer:** más de 10 archivos, más de 15 MB o un campo distinto de `documents` producen `500 INTERNAL_ERROR`, porque `errorHandler` no maneja `MulterError`.
- **Motivo de error no expuesto:** `GET /documents/:id` no incluye `intentos`, así que `errorCodigo` y `errorMensaje` no llegan a la UI.
- **Procesamiento síncrono:** `POST /batches/:id/process` responde solo al terminar el lote. No hay progreso, ni 409 si el lote ya fue procesado, ni protección contra dobles llamadas simultáneas.
- **`estadoPago` sin catálogo:** el backend acepta texto libre de hasta 40 caracteres. El frontend exige texto no vacío hasta que exista el catálogo.
- **Respuesta de revisión incompleta:** `PATCH /review` devuelve solo la revisión, sin `detalles` ni `ajustesGlobales`. Cada guardado crea una revisión nueva. `confirm` toma la última revisión `EDITANDO` del usuario.
- **Formato de fecha:** `fechaEmision` llega como ISO UTC a medianoche; la revisión espera `AAAA-MM-DD`. Se usa `toFechaEmisionInput`.
- **Campos internos:** `GET /documents/:id` devuelve `archivo.storageKey` y `hashArchivo`. Los esquemas del frontend no los incluyen. `metadata` de resultados contiene `identidad` (IDs de usuario y empresa); conviene acotarlo en el backend.
- **Códigos no documentados:** `VALIDATION_ERROR`, `INTERNAL_ERROR`, `INVALID_PDF` y `DOCUMENT_PROCESSING_FAILED` no aparecen en la lista de códigos de esta guía.
- **Pruebas:** la carga de módulos TypeScript en `node --test` usa el type stripping nativo de Node. Requiere Node.js 22.18+ o 24+. Node muestra un aviso `MODULE_TYPELESS_PACKAGE_JSON`; no se cambió `package.json`.
