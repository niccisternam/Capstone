# Flujo recomendado para trabajar con Codex

## Prompt por módulo

Usar una solicitud autocontenida:

```text
Trabaja únicamente en el módulo <nombre>.
Lee AGENTS.md, docs/ARCHITECTURE.md, docs/IMPLEMENTATION_PLAN.md y docs/DEFINITION_OF_DONE.md.
Objetivo: <objetivo concreto>.
No implementes módulos posteriores.
Entrega: cambios, pruebas, documentación actualizada y resumen de archivos modificados.
Antes de terminar ejecuta build, tests y lint.
```

## Secuencia de revisión

1. Analizar el estado actual y declarar supuestos.
2. Proponer o confirmar el contrato del módulo.
3. Implementar en capas pequeñas.
4. Probar casos felices, validaciones, autorización y errores.
5. Ejecutar verificaciones.
6. Revisar diff y actualizar documentación.

## Restricciones

No pedir a Codex que implemente “todo el backend” en una sola solicitud. No mezclar refactors generales con un módulo funcional. No aceptar cambios que oculten errores, desactiven validaciones o salten la autorización.
