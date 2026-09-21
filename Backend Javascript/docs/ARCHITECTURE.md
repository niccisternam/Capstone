# Arquitectura técnica

## Principios

- Express es el backend principal y dueño de la base de datos operativa.
- FastAPI expone capacidades especializadas; no modifica directamente la base de datos de Express.
- Las fronteras se comunican mediante HTTP/JSON y contratos versionados.
- Cada módulo aplica separación por capas: `routes → controllers → services → repositories`.
- Los estados de documentos tienen una única fuente de verdad en Express.

## Estructura objetivo

```text
src/
  config/       configuración y variables de entorno
  shared/       errores, middleware, tipos y utilidades comunes
  modules/
    auth/
    users/
    companies/
    notebooks/
    documents/
    processing/
    chatbot/
    analytics/
  app.ts
  server.ts
```

## Responsabilidades

Express: autenticación, 2FA, recuperación, usuarios/roles, empresas, notebooks, carga y metadata de archivos, lotes, estados, permisos, auditoría y API para frontend.

FastAPI: lectura/procesamiento de PDF, extracción y clasificación con IA, ETL, generación de consultas analíticas y respuestas del chatbot.

## Contrato de errores

Las respuestas de error usarán `{ "error": { "code": "...", "message": "...", "details": {} } }`. No se deben exponer stack traces ni secretos en producción.

## Reglas derivadas del ERS

- Los documentos aceptados son PDF, con un máximo de 15 MB por archivo y de 1 a 10 archivos por lote.
- Los campos tributarios mínimos son RUT emisor, razón social, folio, fecha, monto neto, IVA y total.
- Todos los montos se almacenan y calculan en CLP con precisión decimal; no usar `number` para cálculos financieros.
- Todo dato operativo debe estar asociado a una empresa y cada consulta debe aplicar ese aislamiento.
- El chatbot solo puede ejecutar consultas de lectura; las tablas, columnas, empresa y notebook deben validarse antes de ejecutar SQL.
- La eliminación o edición de un documento y su PDF debe mantener consistencia transaccional.
- Los cambios relevantes deben generar auditoría sin almacenar secretos ni contenido sensible innecesario.

## Estructura de cada módulo

Cada módulo funcional debe contener, cuando corresponda, `routes`, `controllers`, `services`, `repositories`, `schemas`, `types` y `*.test.ts`. Las dependencias entre módulos se exponen mediante contratos mínimos documentados, no mediante acceso directo a implementaciones internas.
