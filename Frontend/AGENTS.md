# AGENTS.md — Frontend Capstone

Este archivo rige todo el trabajo dentro de este repositorio. Codex debe leerlo completo antes de cada tarea, incluso si ya trabajó aquí anteriormente.

## Fuentes de verdad y alcance

1. Antes de modificar código, leer este archivo y los documentos de `docs/` relevantes al módulo activo.
2. Usar como fuentes de verdad, en este orden: contratos reales del backend Express, requisitos aprobados, mockups aprobados y documentación de este repositorio.
3. No inventar endpoints, campos, estados, roles, permisos, reglas tributarias, reglas de negocio ni contratos. Si falta información, dejar la integración pendiente y documentar el bloqueo.
4. El frontend consume exclusivamente Express como API pública. Nunca debe llamar, importar, enlazar ni exponer FastAPI directamente. FastAPI permanece detrás de Express.
5. No modificar el backend ni otros repositorios desde tareas de este frontend.
6. Trabajar un único módulo de la secuencia de `docs/MODULES.md` a la vez. No adelantarse a módulos futuros ni añadir alcance no solicitado.
7. Respetar los mockups y la documentación disponibles. Ante una discrepancia, detener la implementación afectada y registrar la decisión necesaria.

## Reglas de implementación

- Stack objetivo: Next.js con App Router, React, TypeScript estricto, Tailwind CSS y Zod.
- Elegir Server Components por defecto. Añadir `'use client'` únicamente cuando haya interactividad, estado/efectos del navegador o una API exclusiva del cliente. Documentar decisiones no obvias.
- Mantener las solicitudes al backend en una capa API tipada y centralizada; las vistas no construyen URLs ni repiten lógica HTTP.
- Validar con Zod formularios, parámetros y payloads en límites donde corresponda. La validación cliente mejora la experiencia, pero no sustituye la del backend.
- No usar estado global salvo necesidad real y documentada. Preferir estado del servidor, URL, estado local y composición de componentes.
- No guardar secretos en código, variables `NEXT_PUBLIC_*`, localStorage ni logs. La sesión, JWT y 2FA deben seguir el contrato real de Express.
- Implementar de forma explícita los estados loading, vacío, error, éxito y sin autorización que correspondan.
- Mantener accesibilidad semántica, navegación por teclado, foco visible y mensajes de error asociados a controles.
- Tailwind debe servir a una interfaz consistente con pocos tokens básicos; no crear todavía un design system complejo.
- Componentes compartidos solo cuando exista reutilización real. La lógica específica permanece en `src/features/<dominio>`.

## Flujo obligatorio por tarea o módulo

1. Confirmar el módulo activo, sus dependencias y sus criterios de aceptación en `docs/MODULES.md`.
2. Consultar como mínimo `ARCHITECTURE.md`, `API_INTEGRATION.md` y los documentos temáticos que apliquen.
3. Verificar el contrato Express antes de conectar cada operación. No deducir rutas por nombres de pantallas.
4. Implementar solo el alcance acordado y agregar/actualizar pruebas.
5. Ejecutar `lint`, `typecheck` y `tests` antes de cerrar el módulo, usando los scripts reales que existan en `package.json`.
6. Revisar el diff completo, corregir cambios accidentales y comprobar que no haya secretos ni llamadas a FastAPI.
7. Actualizar la documentación del módulo y registrar los endpoints Express efectivamente conectados en `docs/API_INTEGRATION.md`.
8. Cerrar el módulo únicamente cuando esté implementado, probado, revisado y cumpla su Definition of Done. Solo entonces puede comenzar el siguiente.

## Regla para el scaffold actual

El proyecto cuenta con un scaffold mínimo ejecutable. `npm run dev` instala dependencias automáticamente solo cuando no existe la instalación local. Codex no debe ejecutar instalaciones ni actualizar versiones salvo solicitud expresa. Conservar la documentación y revisar cualquier cambio al scaffold antes de aceptarlo.
