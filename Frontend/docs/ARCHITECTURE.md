# Arquitectura

## Principios

La arquitectura busca límites claros sin capas ceremoniales. App Router compone rutas y layouts; las features contienen comportamiento de dominio; los componentes compartidos resuelven presentación transversal; y `src/services/api` es la frontera exclusiva con Express.

```text
UI / rutas Next.js
       ↓
features por dominio
       ↓
capa API tipada
       ↓
backend Express (única API pública)
       ↓
servicios internos, incluido FastAPI (invisibles al frontend)
```

## Rutas y layouts

Usar route groups para organización sin alterar URLs:

- `src/app/(public)`: contenido accesible sin sesión, si existe.
- `src/app/(auth)`: solicitud de cuenta, login, primer acceso y recuperación.
- `src/app/(protected)`: experiencia autenticada con layout y navegación comunes.
- `src/app/(protected)/admin`: administración protegida por permisos confirmados por Express.

Los nombres y paths finales se definen con mockups y requisitos. No crear guards basados solo en ocultar enlaces: Express debe autorizar cada operación. Los layouts comparten estructura visual; no deben acumular lógica de negocio.

## Server y Client Components

Los componentes son Server Components por defecto. Los datos pueden obtenerse en servidor cuando el contrato de sesión lo permita y no se expongan credenciales. Se usa Client Component solo para interacción, hooks, estado/efectos del navegador, carga de archivos u otras APIs del cliente. Mantener el límite cliente lo más bajo posible y pasar props serializables.

## Dependencias entre áreas

- `app` puede importar `features`, `components`, `services`, `lib` y `types`.
- `features` puede importar `components`, `services`, `lib` y `types`.
- `components` compartidos no importan features.
- `services/api` no importa componentes ni rutas.
- Evitar importaciones entre features; si surge una necesidad real, extraer una pieza compartida o documentar la dependencia.

## Estado

Preferencia: datos del servidor/caché de Next.js cuando sea apropiado, parámetros de URL para filtros compartibles, estado local para interacción y formularios. Añadir una biblioteca de estado global solo con un caso transversal demostrado y una decisión documentada.

## Tailwind

Empezar con estilos base, tipografía, espaciado, colores semánticos mínimos y componentes accesibles. Evitar una taxonomía extensa de tokens o variantes antes de conocer los mockups definitivos.
