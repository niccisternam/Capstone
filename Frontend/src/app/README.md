# App Router

Este directorio recibirá `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` y route groups durante el módulo correspondiente.

Estructura prevista (los paths finales dependen de requisitos y mockups):

```text
app/
├─ (public)/
├─ (auth)/
├─ (protected)/
│  └─ admin/
└─ globals.css
```

No crear rutas ni páginas finales antes de confirmar su contrato. Server Components son el valor por defecto; mantener los límites cliente cerca de la interacción.
