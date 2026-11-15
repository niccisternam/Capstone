# ADR 0012 — Dashboard sin pipeline ETL ni Data Warehouse

## Estado

Aceptada — 15-11-2026

## Contexto

La Planilla de Requerimientos, el ERS y los casos de uso CU-AN-004 y CU-DET-006 describen un flujo en el que los resultados de cada consulta pasan por un pipeline ETL, se cargan en un Data Warehouse y desde ahí alimentan el dashboard (R.79–R.85, R.95, R.96, R.123–R.127).

El volumen de datos del sistema (documentos confirmados por notebook de una pyme) no justifica mantener un almacén analítico separado ni un pipeline de carga. Además, la validación y limpieza de los datos ya ocurre antes de que lleguen al análisis: la revisión humana del Módulo 1 (*human-in-the-loop*) corrige los campos extraídos por la IA, y solo las revisiones `CONFIRMADA` se usan para analizar.

## Decisión

- No se implementa un pipeline ETL ni un Data Warehouse.
- El dashboard (`src/modules/dashboard`, base `/api/v1/dashboard`) calcula sus métricas en cada consulta, directamente sobre la base operacional: `documento` (`CONFIRMADO`) unido a `revision_documento` (`CONFIRMADA`), `detalle_revision` y `ajuste_global_revision`.
- Las métricas forman un catálogo cerrado (`METRICAS` en `dashboard.metrics.ts`): `resumen_montos`, `compras_por_periodo`, `compras_por_proveedor`, `compras_por_producto`, `pagos_pendientes` y `descuentos_recargos`. Ni la IA ni el frontend pueden pedir SQL libre al dashboard.
- La IA (Gemini) solo planifica widgets: elige métrica, dirección y visualización (`bar`, `line`, `pie`, `card`, `table`) a partir de una pregunta.
- Toda consulta del dashboard filtra por la empresa y el notebook autorizados por Express.
- El chat (Módulo 4) responde directamente desde las vistas `v_chat_*` (ADR 0008) y no envía resultados a ningún flujo analítico.

## Trazabilidad con la Planilla de Requerimientos

| Requisito | Estado | Cómo queda |
|-----------|--------|------------|
| R.79 Recepción de resultados de consultas | Cumplido sin ETL | Las métricas se consultan sobre la base operacional, filtradas por notebook y empresa. |
| R.80 Validación y limpieza de datos | Cumplido por otra vía | La validación la hace la revisión humana del Módulo 1; solo entran revisiones `CONFIRMADA`. |
| R.81 Bitácora de excepciones del ETL | Descartado | No hay transformación posterior; los documentos sin confirmar no llegan al análisis. |
| R.82 Carga al Data Warehouse | Descartado | No hay Data Warehouse. |
| R.83 Dashboard alimentado desde el DW | Reemplazado | El dashboard se alimenta del catálogo de métricas sobre la base operacional. |
| R.84 Selección de visualización | Cumplido | La IA elige la visualización del widget. |
| R.85 Actualización tras el ETL | Cumplido sin ETL | Las métricas se calculan al consultar, por lo que siempre reflejan los documentos confirmados. |
| R.86 Tarjetas KPI | Cumplido | Visualización `card` y métrica `resumen_montos`. |
| R.87, R.88 Gráficos e interactividad | Cumplido en frontend | `DashboardPanel` muestra montos y periodos al pasar sobre cada elemento. |
| R.95 Envío de resultados al flujo analítico | Descartado | El chat no alimenta el dashboard; los widgets se crean desde el dashboard. |
| R.96 Respuesta posterior al dashboard | Descartado | El chat responde sin esperar una actualización del dashboard. |
| R.123 Precisión numérica | Cumplido | Montos `NUMERIC(18,6)`, sumados en SQL y serializados como texto. |
| R.124 Robustez del pipeline ETL | No aplica | No hay pipeline. |
| R.125 Carga de paneles en menos de 1 s | Parcial | Los rangos temporales se eliminaron (ADR 0011). El tiempo de carga no se ha medido. |
| R.126 Actualización en 3 s tras el ETL | No aplica | No hay ETL; las métricas se calculan al consultar. |
| R.127 Integridad entre consulta y visualización | Cumplido | Cada métrica filtra por empresa y notebook; no se mezclan datos de otros notebooks o empresas. |

## Consecuencias

- Se elimina una capa completa (pipeline, almacén, bitácora y sincronización) y el riesgo de que el dashboard muestre datos desactualizados.
- El rendimiento depende de las consultas sobre la base operacional y de los índices `idx_documento_notebook_estado` e `idx_revision_documento_fecha`. Si el volumen crece mucho, la primera mejora sería usar vistas materializadas, no un Data Warehouse.
- Los documentos externos al repositorio (ERS, DAS, Caso de Uso Extendido y Planilla de Requerimientos) deben actualizarse para reflejar esta decisión.
