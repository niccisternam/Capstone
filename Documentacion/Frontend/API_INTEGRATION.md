# Integración con Express

## Regla de frontera

Toda comunicación remota del frontend termina en Express. No se permiten URLs, clientes, tipos generados, proxies ni llamadas directas a FastAPI.

## Capa API

Centralizar en `src/services/api`:

- resolución segura de la URL base;
- construcción de requests y headers permitidos;
- política de credenciales según el contrato real;
- parseo/validación de respuestas cuando aporte seguridad;
- normalización de errores técnicos a un tipo manejable por UI;
- cancelación y timeouts si el caso lo requiere.

Las features exponen funciones con intención de dominio y no conocen paths sueltos. No asumir que un error siempre contiene JSON ni mostrar mensajes internos del servidor al usuario.

## Variables de entorno

`NEXT_PUBLIC_API_URL` es apropiada cuando el navegador llama directamente a Express; su valor es público. Todo nombre `NEXT_PUBLIC_*` queda incluido en el bundle cliente y jamás contiene secretos. Variables sin ese prefijo solo pueden leerse en código servidor, pero no deben usarse para eludir el contrato arquitectónico ni para exponer FastAPI.

La elección final entre llamadas desde el navegador, Server Components o Route Handlers depende del contrato real de sesión, CORS, cookies y despliegue. Un Route Handler de Next.js no debe convertirse en una segunda API de negocio.

## Errores

Definir, cuando se implemente la capa, una forma estable como `ApiError` con estado HTTP, código público opcional, mensaje seguro y detalles de validación permitidos. Tratar por separado: red/timeout, autenticación, autorización, validación, no encontrado, conflicto, límite/cuota y error inesperado.

## Registro de endpoints verificados

No completar filas por inferencia. Cada fila se agrega al conectar y probar un contrato real.

El contrato backend disponible del Módulo 1 está documentado en `Documentacion/Backend/MODULE1_SPEC.md` y `Documentacion/Frontend/MODULE1_FRONTEND_GUIDE.md`. Las funciones listadas a continuación están implementadas en la capa API frontend y conectadas al backend Express del proyecto; las pruebas automatizadas validan sus contratos con `fetch` mockeado.

| Módulo | Operación | Método y endpoint Express | Request validado | Respuesta validada | Auth | Prueba | Estado |
|---|---|---|---|---|---|---|---|
| Autenticación | Inicio de sesión | `POST /api/v1/auth/login` | `{ correo, password }` | `200` (`2FA_REQUERIDO` / `CAMBIO_PASSWORD_REQUERIDO`) | Pública | `login.schema.test.mjs` | Conectado |
| Autenticación | Verificación 2FA | `POST /api/v1/auth/verify-code` | `{ challengeId, codigo, recordarSesion }` | `200` (`accessToken`, `usuario`, Set-Cookie) | Pública | `two-factor.schema.test.mjs` | Conectado |
| Autenticación | Reenvío código 2FA | `POST /api/v1/auth/login-code/resend` | `{ challengeId }` | `200` (`challengeId`, `expiraEnSegundos`) | Pública | Manual / Unit | Conectado |
| Autenticación | Primer ingreso (cambio clave temporal) | `POST /api/v1/auth/change-temporary-password` | `{ nuevaPassword, confirmarPassword }` | `200` (`mensaje`, `challengeId`) | Bearer temporal | `first-access.schema.test.mjs` | Conectado |
| Autenticación | Solicitar enlace de recuperación | `POST /api/v1/auth/forgot-password` | `{ correo }` | `202` (`mensaje`) | Pública | `recovery.schema.test.mjs` | Conectado |
| Autenticación | Restablecer contraseña | `POST /api/v1/auth/reset-password` | `{ nuevaPassword, confirmarPassword }` | `200` (`mensaje`) | Bearer token (hash) | `reset-password.schema.test.mjs` | Conectado |
| Autenticación | Refrescar sesión | `POST /api/v1/auth/refresh` | Vía cookie `capstone_refresh_token` | `200` (`accessToken`, `usuario`) | Cookie HttpOnly | `client.ts` | Conectado |
| Autenticación | Cerrar sesión | `POST /api/v1/auth/logout` | Vía cookie `capstone_refresh_token` | `204 No Content` | Cookie HttpOnly | `client.ts` | Conectado |
| Solicitudes | Crear solicitud de cuenta | `POST /api/v1/account-requests` | `{ rutEmpresa, razonSocial, rutUsuario, nombre, apellido, correo, descripcion? }` | `201` (`{ solicitud }`) | Pública | `create-account-request.schema.test.mjs` | Conectado |
| Solicitudes | Listar solicitudes | `GET /api/v1/account-requests` | `?estado=PENDIENTE\|APROBADA\|RECHAZADA` | `200` (`{ solicitudes }`) | Bearer Admin | `account-requests.test.mjs` | Conectado |
| Solicitudes | Detalle de solicitud | `GET /api/v1/account-requests/:id` | Path param `idSolicitud` | `200` (`{ solicitud }`) | Bearer Admin | `accountRequests.api.ts` | Conectado |
| Solicitudes | Aprobar solicitud | `POST /api/v1/account-requests/:id/approve` | `{ razonSocial, confirmacionSii: true }` | `200` / `201` | Bearer Admin | `accountRequests.api.ts` | Conectado |
| Solicitudes | Rechazar solicitud | `POST /api/v1/account-requests/:id/reject` | `{ motivo }` | `200` | Bearer Admin | `accountRequests.api.ts` | Conectado |

## Módulo 1 — capa API frontend conectada a Express

Implementación en `src/api/module1.api.ts`, con esquemas en `src/api/module1.schemas.ts` y normalización de errores en `src/api/api-error.ts`. Usa `client.ts` con `requestFormData` (multipart sin `Content-Type`) y `requestPdf` (binario). Las pruebas usan `fetch` mockeado (`tests/module1-api.test.mjs`) y cubren los contratos de la capa API.

| Función | Método y endpoint Express | Request validado | Respuesta validada | Auth | Prueba | Estado |
|---|---|---|---|---|---|---|
| `listNotebooks` | `GET /api/v1/module1/notebooks` | — | `{ notebooks }` → `totalDocumentos` | Bearer | `module1-api.test.mjs` | Conectado |
| `createNotebook` | `POST /api/v1/module1/notebooks` | `notebookInputSchema` | `201 { notebook }` | Bearer | `module1-api.test.mjs` | Conectado |
| `updateNotebook` | `PATCH /api/v1/module1/notebooks/:idNotebook` | `notebookInputSchema` | `{ notebook }` | Bearer | `module1-api.test.mjs` | Conectado |
| `deleteNotebook` | `DELETE /api/v1/module1/notebooks/:idNotebook` | UUID | `{ idNotebook, eliminado: true }` | Bearer | `module1-api.test.mjs` | Conectado |
| `getNotebook` | `GET /api/v1/module1/notebooks/:idNotebook` | UUID | `{ notebook }` con `documentos` | Bearer | `module1-api.test.mjs` | Conectado |
| `uploadDocuments` | `POST /api/v1/module1/notebooks/:idNotebook/documents` | `multipart`, campo `documents`, 1–10 PDF ≤ 15 MB con firma `%PDF` | `201 { lote }` | Bearer | `module1-api.test.mjs` | Conectado |
| `processBatch` | `POST /api/v1/module1/batches/:idLote/process` | UUID, `AbortSignal` opcional | `{ lote }` con `documentos` | Bearer | `module1-api.test.mjs` | Conectado |
| `getBatch` | `GET /api/v1/module1/batches/:idLote` | UUID | `{ lote }` | Bearer | `module1-api.test.mjs` | Conectado |
| `getDocument` | `GET /api/v1/module1/documents/:idDocumento` | UUID | `{ documento }` con `archivo`, `resultados`, `revisiones` | Bearer | `module1-api.test.mjs` | Conectado |
| `getDocumentPdf` | `GET /api/v1/module1/documents/:idDocumento/pdf` | UUID | `Blob` `application/pdf` | Bearer | `module1-api.test.mjs` | Conectado |
| `saveReview` | `PATCH /api/v1/module1/documents/:idDocumento/review` | `revisionInputSchema` (`estadoPago`, `observacion`, `datos`) | `{ revision }` | Bearer | `module1-api.test.mjs` | Conectado |
| `confirmDocument` | `POST /api/v1/module1/documents/:idDocumento/confirm` | sin body | `{ documento }` | Bearer | `module1-api.test.mjs` | Conectado |
| `reopenDocument` | `POST /api/v1/module1/documents/:idDocumento/reopen` | UUID | `{ documento }` | Bearer | `module1-api.test.mjs` | Conectado |
| `retryDocument` | `POST /api/v1/module1/documents/:idDocumento/retry` | UUID | `{ documento }` o error de reintento | Bearer | `module1-api.test.mjs` | Conectado |
| `deleteDocument` | `DELETE /api/v1/module1/documents/:idDocumento` | UUID | `{ idDocumento, eliminado: true }` | Bearer | `module1-api.test.mjs` | Conectado |

Errores del módulo: `normalizeErrorBody` convierte el envelope `{ error: { code } }` en `ApiError` con `status`, `code` y `kind` (`NETWORK`, `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `VALIDATION`, `UNAVAILABLE`, `INVALID_RESPONSE`, `UNEXPECTED`). El mensaje visible sale de un catálogo del frontend; el texto del servidor no se muestra. Los `details` solo se conservan para `VALIDATION_ERROR`.

Códigos solo del cliente: `INVALID_IDENTIFIER` (UUID mal formado, sin petición), `NETWORK_ERROR` (fallo de red), `UNKNOWN_ERROR` (respuesta de error sin envelope) e `INVALID_RESPONSE` (respuesta 2xx que no cumple el esquema).
