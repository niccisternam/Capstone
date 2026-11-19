# 0012 — Endurecimiento de seguridad en autenticación

## Contexto

Una revisión de seguridad encontró que los endpoints públicos de autenticación y la solicitud de cuenta no tenían límite de peticiones por IP. Esto permitía bloquear a voluntad cualquier cuenta con un correo conocido (5 contraseñas erróneas) y enviar solicitudes de cuenta en masa. También encontró que un `challengeId` de inicio de sesión vencido podía reactivarse con `/auth/login-code/resend` sin volver a validar la contraseña.

## Decisión

- Límite en memoria por IP, en ventanas fijas (`src/shared/http/rate-limit.ts`):
  - `POST /auth/login`: 20 cada 15 minutos.
  - `POST /auth/verify-code`: 20 cada 15 minutos.
  - `POST /auth/login-code/resend` y `POST /auth/forgot-password`: 5 cada 15 minutos (comparten contador).
  - `POST /auth/change-temporary-password`, `GET /auth/reset-password/validate` y `POST /auth/reset-password`: 20 cada 15 minutos (comparten contador).
  - `POST /account-requests`: 5 por hora.
- Al superar el límite se responde `429` con código `RATE_LIMITED`, encabezado `Retry-After` y `details.retryAfterSeconds`.
- Nueva variable opcional `TRUST_PROXY` (número de proxies de confianza). Sin ella Express usa la IP de la conexión; detrás de un balanceador debe configurarse para limitar por la IP real del cliente.
- `/auth/login-code/resend` rechaza challenges vencidos, revocados o con intentos agotados (`400 LOGIN_CODE_INVALID_OR_EXPIRED`); el usuario debe volver a iniciar sesión.
- El login verifica un hash de relleno cuando el correo no existe, para que el tiempo de respuesta no revele qué correos están registrados.
- Los códigos 2FA se firman con una clave derivada de `JWT_SECRET` (HMAC con etiqueta propia) en vez de reutilizar la misma clave de los JWT.
- La cookie de refresh se marca `Secure` también cuando `APP_ORIGIN` usa HTTPS.
- Los logs HTTP redactan `cookie` y `set-cookie`, que contienen el refresh token.

## Consecuencias

- Los contadores viven en el proceso: se reinician al reiniciar el backend y no se comparten entre instancias. Con varias instancias hay que moverlos a un almacén compartido (por ejemplo Redis).
- Los límites se desactivan cuando `NODE_ENV=test` para no afectar las pruebas de integración; el limitador tiene su propia prueba.
- La respuesta `423 ACCOUNT_BLOCKED` se mantiene porque es parte de la experiencia de usuario, lo que sigue revelando que existe una cuenta bloqueada. El límite por IP reduce, pero no elimina, el bloqueo intencional de cuentas desde muchas IP.
- Al cambiar la clave de los códigos 2FA, los códigos emitidos antes del despliegue dejan de ser válidos (vencen en 5 minutos de todos modos).
