# ADR 0002 — Registro de cuenta antes del login

## Estado

Aceptada.

## Contexto

El plan original ubicaba autenticación completa antes de solicitudes de cuenta. El equipo decidió comenzar por el flujo de solicitud, revisión administrativa y creación de usuario, dejando el login para un desarrollo posterior.

## Decisión

Implementar primero el registro como un módulo aislado. Los endpoints administrativos dependen de un contrato mínimo de identidad administrativa y permanecen cerrados por defecto hasta integrar la autenticación real. No se aceptan cabeceras ni secretos temporales que permitan simular un administrador en producción.

La revisión en SII será exclusivamente manual durante el MVP. La aprobación exige una confirmación y la razón social revisada. Cada empresa puede tener un solo usuario cliente: al aprobar se crea una empresa nueva y, si el RUT empresarial ya existe, se rechaza la operación.

## Consecuencias

El flujo público puede desarrollarse y probarse sin adelantar JWT, sesiones o login. La operación real de aprobación requerirá posteriormente el módulo de autenticación, la conexión Prisma/Supabase y un proveedor de correo.
