# ADR 0008 — Chat financiero (Módulo 4) en Express

## Estado
Aceptada — 14-10-2026

## Contexto
La arquitectura original asignaba la IA y el chatbot a un servicio FastAPI. En la práctica, la extracción del Módulo 1 se implementó en Express con Gemini y FastAPI no existe. El chat debe ser de solo lectura y estar aislado por empresa y notebook (R.94, R.128, R.129).

## Decisión
- El chat se implementa en Express (`src/modules/module4`), reutilizando la autenticación, Prisma y el cliente Gemini del Módulo 1.
- La IA genera SQL solo sobre las vistas `v_chat_documentos` y `v_chat_detalles`, que exponen únicamente documentos CONFIRMADOS con su revisión confirmada.
- Aislamiento en capas: validación del texto SQL; transacción `READ ONLY`; rol `chat_lector` con `SELECT` solo sobre las vistas; empresa y notebook fijados por el backend con `set_config`, y las vistas filtran por esos valores; `statement_timeout` de 5 s y un máximo de 200 filas.
- `documento.direccion` (`COMPRA` | `VENTA`, por defecto `COMPRA`) se calcula al confirmar comparando el RUT emisor con el RUT de la empresa. Deja abierta la incorporación futura de documentos de venta.
- El historial se guarda en `mensaje_chat` por usuario, empresa y notebook.

## Fuera de alcance por ahora
Consumo y cuota de tokens (R.100, R.101, R.103) e integración con el ETL/Data Warehouse del Módulo 3 (R.95, R.96).

## Consecuencias
La migración requiere permiso para crear roles (`CREATE ROLE`). Si en el futuro se crea FastAPI, el contrato HTTP de `/api/v1/module4` se mantiene.
