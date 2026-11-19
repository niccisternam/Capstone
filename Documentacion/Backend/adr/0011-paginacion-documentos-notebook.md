# 0011 — Paginación y búsqueda de documentos del notebook

## Contexto

`GET /module1/notebooks/:idNotebook` devolvía todos los documentos del notebook con su última extracción y revisión. Con notebooks de 1000 documentos la pantalla tardaba varios segundos en cargar y el buscador solo filtraba los documentos ya descargados.

## Decisión

- El endpoint devuelve como máximo 50 documentos por página.
- Acepta `pagina`, `buscar`, `estado`, `estadoPago` y `proveedor`.
- La búsqueda y los filtros se resuelven en la base de datos antes de paginar, para encontrar documentos de cualquier página.
- La respuesta agrega `total`, `pagina`, `hayMas`, `totalDocumentos` y `lotesPendientes`.
- `lotesPendientes` mantiene visible la cola de lotes aún no procesados sin incluir sus documentos en la página.
- El dashboard no consume este endpoint y conserva sus consultas agregadas.

## Consecuencias

- El notebook ya no descarga documentos que no se muestran.
- Las opciones de los filtros de proveedor y estado de pago se construyen con la página visible; la búsqueda de texto sigue cubriendo todo el notebook.
- La paginación usa orden estable por `createdAt` e `idDocumento` para no duplicar ni omitir filas entre páginas.
