# ADR 0005 — Cookie de refresh y recordar sesión

## Estado

Aceptado.

## Contexto

El login ya creaba una fila en `sesion_usuario` y un refresh token aleatorio, pero lo devolvía en el JSON y no existían endpoints para renovar o cerrar la sesión. Por ello, marcar `recordarSesion` solo cambiaba la fecha almacenada y no evitaba un nuevo login al vencer el access token.

## Decisión

- El refresh token se entrega mediante la cookie `capstone_refresh_token` con `HttpOnly`, `SameSite=Lax`, ruta `/api/v1/auth` y `Secure` en producción.
- El JSON de autenticación no expone el refresh token.
- Con `recordarSesion: true`, la cookie y la sesión tienen una vigencia absoluta predeterminada de 30 días.
- Con `recordarSesion: false`, la cookie no tiene fecha persistente, desaparece al cerrar el navegador y la sesión se invalida después de 30 minutos sin actividad.
- `POST /api/v1/auth/refresh` rota el refresh token y entrega un access token nuevo.
- `POST /api/v1/auth/logout` revoca la sesión y elimina la cookie.
- Recuperar la contraseña revoca todas las sesiones activas del usuario.
- Solo el hash SHA-256 del refresh token se almacena en PostgreSQL.

## Consecuencias

El frontend debe enviar `credentials: "include"`. El backend acepta credenciales CORS únicamente desde `APP_ORIGIN`. No se necesita una migración porque `sesion_usuario` ya contiene los campos requeridos.
