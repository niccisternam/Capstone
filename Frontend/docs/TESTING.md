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
