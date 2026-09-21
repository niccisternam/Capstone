# ADR 0007 — Recuperación de contraseña mediante enlace por correo

## Estado

Aceptada.

## Contexto

El flujo original de recuperación de contraseña utilizaba un código numérico de seis dígitos (`RECUPERACION_PASSWORD`) verificado a través de un endpoint intermedio (`POST /api/v1/auth/verify-recovery-code`), el cual emitía un JWT temporal de alcance `reset_password`.

Para simplificar la interacción del usuario y robustecer la seguridad, se requiere sustituir el código de seis dígitos por un enlace directo enviado al correo, manteniendo inalterado el código de inicio de sesión 2FA (`CODIGO_INICIO_SESION` en `POST /api/v1/auth/verify-code`).

## Decisión

1. **Generación del token**: Generar un token aleatorio largo de 256 bits mediante una fuente criptográficamente segura (`crypto.randomBytes(32).toString('base64url')`).
2. **Almacenamiento por hash**: Persistir únicamente el hash SHA-256 del token en la tabla `token_seguridad` con propósito `RECUPERACION_PASSWORD`, garantizando que el token en claro nunca sea visible en la base de datos, respuestas HTTP ni logs.
3. **Construcción del enlace**: Construir la URL exclusivamente a partir de la variable de entorno `APP_ORIGIN` con el formato:
   `{APP_ORIGIN}/recuperar-password#token={TOKEN_TEMPORAL}`.
   El fragmento `#token=` garantiza que el token no sea transmitido automáticamente a servidores intermediarios o al servidor que aloja el frontend. No se aceptan URLs ni redirecciones provenientes del cliente.
4. **Respuesta genérica (Anti-Enumeración)**: `POST /api/v1/auth/forgot-password` responde invariablemente HTTP 202 con un mensaje genérico, incluso si el correo no existe, la cuenta está inactiva, se supera el límite de tasa o falla el transporte SMTP.
5. **Manejo de fallos SMTP**: Si el envío por correo falla, el token recién generado se revoca de forma inmediata en la base de datos y la respuesta HTTP se mantiene genérica (202).
6. **Consumo atómico y un solo uso**: `POST /api/v1/auth/reset-password` recibe el token mediante el encabezado `Authorization: Bearer <token>`. El consumo se ejecuta dentro de una transacción con comprobación atómica sobre `used_at IS NULL AND revoked_at IS NULL AND expires_at > now`, impidiendo la reutilización incluso ante solicitudes simultáneas concurrentes.
7. **Efectos colaterales del cambio**: Al completar el restablecimiento exitoso:
   - Se guarda la nueva contraseña con algoritmo `scrypt`.
   - Se revocan todos los demás tokens de recuperación activos del usuario.
   - Se revocan todas las sesiones activas (`sesion_usuario`).
   - Se reinician los intentos fallidos y bloqueos temporales (las cuentas `INACTIVO` no se reactivan).
   - No se genera una nueva sesión automáticamente.
8. **Compatibilidad**:
   - `POST /api/v1/auth/verify-recovery-code` se retira/marca como obsoleto (HTTP 410).
   - `POST /api/v1/auth/verify-code` permanece intacto para el login 2FA.

## Consecuencias

- Se reutiliza la tabla existente `token_seguridad` sin necesidad de alterar el esquema de base de datos ni crear migraciones.
- Se elimina la emisión del token JWT intermedio `reset_password` en favor del Bearer token opaco validado directamente contra el hash en base de datos.
- Las pruebas automatizadas verifican los 16 criterios de aceptación sin enviar correos reales hacia el exterior.
