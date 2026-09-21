# Autenticación, sesión y autorización

## Regla central

La implementación seguirá exactamente el contrato de Express. No se decidirá anticipadamente si usa cookies HttpOnly, bearer JWT, refresh tokens, sesión de servidor u otro mecanismo. Nunca almacenar tokens en localStorage por conveniencia ni crear flujos incompatibles con el backend.

## Flujos que deberán confirmarse

- solicitud y aprobación de cuenta;
- login y forma de establecer sesión;
- contraseña temporal y condición de primer acceso;
- enrolamiento/verificación/recuperación de 2FA;
- recuperación y restablecimiento de contraseña;
- expiración, renovación y cierre de sesión;
- roles/permisos y respuestas ante `401`/`403`.

Las pantallas pueden orientar al usuario, pero Express es la autoridad de autenticación y autorización. Los guards de interfaz mejoran navegación; no son controles de seguridad.

## Protección de rutas

La estrategia concreta (middleware, layout servidor, consulta de sesión o combinación) se elige solo después de verificar cookies, headers y runtime compatibles. Evitar parpadeos de contenido protegido y redirecciones en bucle. Mantener rutas de administración dentro del área protegida y verificar permisos con datos emitidos por Express.

## Seguridad de interfaz

No registrar contraseñas, OTP, tokens ni respuestas sensibles. Usar autocompletado apropiado, mensajes que no filtren existencia de cuentas cuando el backend lo exija y controles accesibles para mostrar/ocultar contraseña. No inventar códigos de respaldo, expiraciones ni límites de intentos.
