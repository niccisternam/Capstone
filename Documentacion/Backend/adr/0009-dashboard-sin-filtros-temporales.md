# ADR 0009 — Dashboard sin filtros temporales

## Estado

Reemplazada por ADR 0010 — 13-11-2026

## Contexto

Un notebook es un espacio de organización libre: puede contener documentos de un mes o acumular varios periodos. El modelo no define un rango temporal para el notebook. Los filtros de fecha del dashboard podían excluir documentos confirmados de notebooks antiguos o hacer redundante la interfaz para notebooks mensuales.

## Decisión

- Las métricas del dashboard consideran todos los documentos confirmados del notebook y la empresa autorizados por Express.
- `fecha_emision` se mantiene para agrupar la tendencia mensual; no limita el conjunto de documentos analizado.
- El contrato de filtros conserva `direccion`, pero no acepta `desde` ni `hasta`.
- La planificación de widgets con IA tampoco genera periodos.
- Las fechas heredadas en configuraciones JSON de widgets se ignoran al leerlas.

## Consecuencias

- Las consultas directas a las métricas siempre representan el notebook completo.
- No se requiere una migración SQL: no cambia el modelo relacional; se elimina una opción del contrato y de las consultas.
- Si se necesitan informes de periodos seleccionables en el futuro, deberán acordarse como una capacidad distinta, no inferirse del rango de fechas del notebook.
