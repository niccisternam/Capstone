# Estrategia de pruebas

La herramienta concreta se fijará durante el scaffold técnico; no se agregan dependencias todavía. Como base se espera:

- pruebas unitarias para transformaciones, esquemas Zod y utilidades;
- pruebas de componentes para interacción, accesibilidad y estados;
- pruebas de integración de cada feature contra respuestas Express simuladas fieles al contrato;
- pruebas end-to-end para recorridos críticos una vez estabilizados;
- comprobaciones manuales de responsive, teclado, foco y lectores de pantalla en puntos clave.

No hacer pruebas que dependan directamente de FastAPI. Los mocks representan únicamente la frontera pública de Express y deben actualizarse al cambiar su contrato.

## Mínimos de cierre

Antes de cerrar un módulo: lint sin errores, typecheck sin errores, suite relevante aprobada, criterios de aceptación cubiertos y revisión del diff. Un test omitido o inestable se documenta como bloqueo, no se oculta.

## Casos transversales

Cubrir loading, vacío, éxito, validación, red/timeout, `401`, `403`, errores del servidor y reintentos seguros según aplique. En cargas y procesamiento, incluir progreso/espera, fallo y recuperación conforme al contrato.

## Pruebas de la capa API con TypeScript

Las pruebas de `tests/module1-*.test.mjs` importan módulos `.ts` reales con `tests/helpers/ts-module-loader.mjs`. El helper registra un resolver de `node:module` que añade `.ts` a los imports relativos y deja que Node haga el type stripping. No se añaden dependencias ni se cambian scripts. Requisito: Node.js 22.18+ o 24+. En módulos de la API, evitar `enum`, `namespace` y propiedades de parámetro en constructores, porque el type stripping nativo no los soporta.

`fetch` se reemplaza por un mock en cada prueba. No se conecta a Express real ni a FastAPI.
