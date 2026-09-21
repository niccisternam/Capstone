# Backend Javascript — Sistema Tributario

Backend principal del proyecto Capstone, construido con Express y TypeScript.

## Alcance actual

Además del scaffold, está implementado el contrato backend para solicitar una cuenta y para que un administrador la apruebe o rechace. El detalle del módulo y sus límites está en `docs/modules/REGISTRO_CUENTA.md`.

La revisión completa del primer módulo, incluyendo registro, administración, login, pruebas, hallazgos y pendientes, está en `README_AUTENTICACION.md`. Los códigos por correo y la recuperación están documentados en `docs/modules/AUTENTICACION_LOGIN.md`.

## Requisitos

- Node.js LTS
- npm
- PostgreSQL para los módulos que requieran persistencia
- FastAPI disponible cuando se active la integración de IA/procesamiento

## Inicio

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

Verificación: `GET http://localhost:3000/health`.

Verificación de disponibilidad: `GET http://localhost:3000/readiness`. Responde `200` cuando PostgreSQL está disponible y `503` cuando falla la conexión.

Después de instalar dependencias, las comprobaciones mínimas son:

```powershell
npm run typecheck
npm run build
npm test
npm run lint
npm run test:db
```

`npm run test:db` ejecuta una prueba real contra la base configurada, usa registros marcados como prueba y los elimina al terminar.

## Prisma y Supabase

El esquema canónico está en `prisma/schema.prisma` y las migraciones reproducibles en `prisma/migrations`. `DATABASE_URL` se usa durante la ejecución del backend y `DIRECT_URL` para comandos de migración.

```powershell
npm run prisma:generate
npm run prisma:migrate:deploy
```

## Arquitectura

La arquitectura y los límites de responsabilidad están en `docs/ARCHITECTURE.md`. El orden de implementación está en `docs/IMPLEMENTATION_PLAN.md`.

## Estado

| Elemento                    | Estado                                                        |
| --------------------------- | ------------------------------------------------------------- |
| Scaffold TypeScript/Express | Listo                                                         |
| Health check                | Listo                                                         |
| Registro de solicitudes     | Implementado con repositorio Prisma                           |
| Prisma/Supabase             | Conectado; migración inicial aplicada                         |
| Correo de aprobación        | Contrato implementado; proveedor pendiente                    |
| Login y autenticación       | Códigos SMTP y recuperación listos; refresh/logout pendientes |
| Módulos de negocio          | Pendiente, secuencial                                         |

## Reglas funcionales principales

- Solo se procesan archivos PDF de hasta 15 MB.
- Cada lote contiene entre 1 y 10 documentos.
- Los documentos se organizan por empresa y notebook.
- Los datos extraídos por IA son preliminares hasta la revisión y confirmación humana.
- Las consultas del chatbot son únicamente de lectura y se validan antes de ejecutarse.
- Los montos se manejan en pesos chilenos (CLP).

## Estado del scaffold

El endpoint `/readiness` comprueba PostgreSQL y responde `503` si la base no está disponible. Los endpoints administrativos están protegidos mediante JWT y exigen un usuario activo con rol `ADMINISTRADOR`.
