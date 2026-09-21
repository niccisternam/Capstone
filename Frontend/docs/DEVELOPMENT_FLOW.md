# Flujo de desarrollo en cascada

## Regla de avance

La secuencia de `MODULES.md` es obligatoria. Un módulo solo se cierra cuando está implementado, probado, revisado y documentado. No comenzar el siguiente con criterios pendientes del anterior, salvo una excepción aprobada y registrada explícitamente.

## Fases por módulo

1. **Entrada:** confirmar requisitos, mockups, contrato Express, permisos y dependencias cerradas.
2. **Diseño:** acordar rutas, componentes, estados, esquemas, accesibilidad y plan de pruebas.
3. **Implementación:** construir únicamente el alcance del módulo con límites Server/Client intencionales.
4. **Integración:** conectar solo endpoints Express verificados y registrar el contrato usado.
5. **Verificación:** ejecutar lint, typecheck, pruebas automáticas y comprobaciones manuales pertinentes.
6. **Revisión:** inspeccionar diff, seguridad, accesibilidad, responsive, estados y ausencia de llamadas a FastAPI.
7. **Cierre:** actualizar documentación, evidencias y Definition of Done; aprobar el paso al módulo siguiente.

## Evidencia de cierre

Registrar en la entrega del módulo: criterios cumplidos, comandos y resultados de pruebas, rutas afectadas, endpoints Express conectados, decisiones Server/Client no obvias, deuda aceptada y bloqueos resueltos. Si todavía no existe un script requerido, se define durante el módulo 1 antes de poder cerrarlo.

## Cambios de contrato

Si Express cambia, pausar la integración afectada, actualizar tipos/esquemas/mocks/documentación y repetir pruebas del módulo impactado. No adaptar silenciosamente la UI a una respuesta observada que contradiga el contrato aprobado.
