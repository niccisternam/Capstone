# Convenciones

## Código y nombres

- TypeScript estricto; evitar `any`. Si es inevitable, aislarlo y justificarlo.
- Componentes y tipos en PascalCase; funciones, variables y hooks en camelCase; carpetas/rutas en kebab-case.
- Imports internos mediante `@/*` cuando el alias esté configurado.
- Exports explícitos; evitar archivos barril profundos que oculten ciclos.
- Archivos pequeños con una responsabilidad clara. No abstraer antes de detectar repetición o una frontera real.

## Estructura de feature

Una feature puede contener `components`, `schemas`, `services`, `types`, `hooks` y `tests`; crear solo las carpetas que use. La página de App Router coordina y delega, no concentra reglas de dominio.

## Componentes

`src/components/ui` contiene piezas visuales genéricas; `layout`, estructura transversal; `feedback`, estados y mensajes reutilizables. Las variantes deben ser limitadas, accesibles y guiadas por mockups.

## Datos y errores

No hacer `fetch` disperso en componentes visuales. No usar strings de endpoint fuera de la capa API. No ignorar errores ni mostrar objetos crudos. Fechas, números y moneda se formatean con locale/requisitos confirmados, sin asumir zona horaria o moneda.

## Commits y documentación

Mantener cambios enfocados por módulo. Al cerrar, describir alcance, pruebas ejecutadas, decisiones, deuda conocida y endpoints Express conectados. Nunca incluir `.env.local`, tokens, datos personales ni archivos de usuario reales.
