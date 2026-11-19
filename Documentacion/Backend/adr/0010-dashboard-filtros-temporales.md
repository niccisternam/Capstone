# ADR 0010 — Filtros temporales en el dashboard

## Estado

Aceptada — 19-11-2026. Reemplaza a ADR 0009.

## Contexto

ADR 0009 excluyó los filtros de fecha para evitar que un rango ocultara documentos confirmados de notebooks con varios periodos. Sin embargo, el dashboard necesita consultas acotadas para revisar un rango de meses, un semestre o un año completo sin perder la vista completa del notebook.

El panel del dashboard no persiste widgets por notebook en la interfaz: consulta las métricas directamente. Por eso el filtro temporal se resuelve como una consulta global al notebook seleccionado.

## Decisión

- La consulta `POST /api/v1/dashboard/notebooks/:idNotebook/query` acepta `filtros.desde` y `filtros.hasta` opcionales en formato `YYYY-MM`, ambos inclusivos.
- Si se envían ambos, `desde` no puede ser posterior a `hasta`.
- El rango se aplica sobre `revision_documento.fecha_emision` de la revisión CONFIRMADA, con límites `>= YYYY-MM-01` y `< primer día del mes siguiente a hasta`.
- Las seis métricas usan el mismo rango. Los documentos sin fecha de emisión quedan fuera únicamente cuando hay un periodo activo.
- Sin `desde` ni `hasta`, las métricas siguen representando todo el notebook, como antes.
- Los widgets guardados mantienen solo `direccion`; las fechas heredadas en su JSON se siguen ignorando.
- La planificación de widgets con IA no genera periodos.
- El frontend ofrece un filtro global por rango de meses, semestre o año completo. El filtro vive en el estado del panel y no se persiste entre recargas.
- No hay migración de base de datos ni cambios en el modelo relacional.

## Consecuencias

- Las métricas aceptan un rango de meses sin cambiar su catálogo ni sus fórmulas.
- Una selección de semestre o año se traduce en el frontend a un rango de meses, de modo que el backend mantiene un único concepto temporal.
- El gráfico mensual muestra todos los meses del periodo seleccionado, incluidos los que no tienen compras.
- Si en el futuro se necesitan filtros persistidos por widget o por notebook, deberán acordarse como una capacidad adicional.
