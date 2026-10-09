# ADR 0003 — Código de autenticación artificial en desarrollo

## Estado

Reemplazada por ADR 0004.

## Contexto

El equipo necesita probar registro, login y administración antes de integrar un proveedor de correo.

## Decisión

Usar un código fijo de seis dígitos solo cuando el entorno no sea producción. El código nunca se almacena en texto plano en PostgreSQL: cada desafío guarda un HMAC distinto. La autorización administrativa se obtiene mediante el mismo login y JWT real; no se crea un bypass por cabecera.

También se permite una contraseña temporal conocida únicamente en desarrollo para probar el primer acceso de usuarios aprobados.

## Consecuencias

El flujo completo pudo probarse con un cliente de APIs. Esta decisión dejó de aplicarse al integrar códigos aleatorios y correo SMTP según ADR 0004.
