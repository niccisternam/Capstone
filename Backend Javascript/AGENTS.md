# AGENTS.md — Backend Javascript

## Propósito

Este repositorio contiene el backend principal en Express + TypeScript del sistema tributario Capstone. Express es dueño de la API operativa, autenticación, autorización, persistencia y estados de negocio. FastAPI se consume como servicio especializado para procesamiento documental, IA, ETL y analítica.

## Reglas de trabajo para Codex

1. Trabajar un módulo por vez, siguiendo `docs/IMPLEMENTATION_PLAN.md`.
2. Antes de editar, leer el módulo, sus decisiones y sus criterios de aceptación.
3. No implementar módulos futuros “por adelantado”. Si una dependencia es imprescindible, crear solo el contrato mínimo.
4. No cambiar contratos públicos, estados, nombres de tablas o variables de entorno sin actualizar la documentación y registrar una decisión en `docs/adr/`.
5. Cada cambio debe incluir pruebas, manejo de errores, validación de entrada y actualización del README si cambia la forma de ejecutar el sistema.
6. No guardar secretos ni datos reales en el repositorio.
7. Mantener la separación: `routes` recibe solicitudes, `controllers` coordina, `services` aplica casos de uso, `repositories` accede a datos y `schemas` valida.
8. Cumplir primero el ERS vigente: PDF de máximo 15 MB, lotes de 1–10, moneda CLP, campos tributarios obligatorios, aislamiento por empresa, auditoría y consultas analíticas de solo lectura.
9. No marcar `/readiness` como verificación de base de datos hasta que el módulo de persistencia implemente una comprobación real.

## Comandos esperados

```text
npm install
npm run dev
npm run build
npm test
npm run lint
npm run typecheck
```

## Definition of Done

Ver `docs/DEFINITION_OF_DONE.md`. Ningún módulo se considera terminado solo porque compila.
