# Códigos de verificación y recuperación de contraseña

## Alcance

- Login con segundo paso por código enviado al correo registrado.
- Recuperación de contraseña sin revelar si el correo existe.
- Reenvío controlado de códigos.
- Gmail SMTP encapsulado mediante Nodemailer.
- Reutilización de JWT, sesiones, hash de contraseñas y `token_seguridad` existentes.
- Renovación de acceso mediante cookie HttpOnly y cierre explícito de sesión.

FastAPI y el frontend no generan, almacenan ni validan códigos.

## Reglas

- Código numérico de seis dígitos generado con `crypto.randomInt()`.
- Vigencia de 5 minutos.
- Máximo de 3 intentos incorrectos.
- Uso único.
- Espera mínima de 60 segundos entre envíos para el mismo usuario y propósito.
- Máximo de 3 envíos dentro de 15 minutos.
- Un nuevo código invalida los anteriores del mismo usuario y propósito.
- PostgreSQL almacena solamente el HMAC del código.
- Login y recuperación usan propósitos independientes.
- Los códigos y secretos SMTP no aparecen en respuestas ni logs.

## Configuración SMTP

```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=capstonepicdt@gmail.com
SMTP_PASS=<CONTRASEÑA_DE_APLICACION_DE_GOOGLE>
MAIL_FROM="Sistema Capstone <capstonepicdt@gmail.com>"
AUTH_TEST_ADMIN_EMAIL=capstonepicdt@gmail.com
```

`SMTP_PASS` debe ser una contraseña de aplicación, nunca la contraseña normal de Gmail. `.env` está ignorado por Git. Si falta configuración, el backend inicia pero los intentos de envío de login responden `EMAIL_DELIVERY_FAILED`.

`AUTH_TEST_ADMIN_EMAIL` define un buzón real para el administrador de desarrollo. Ejecutar nuevamente `npm run seed:test-admin` después de configurarlo.

## Endpoints

### `POST /api/v1/auth/login`

Valida correo y contraseña. Si no se requiere cambiar una contraseña temporal, crea un código `CODIGO_INICIO_SESION`, lo envía y responde `CODIGO_REQUERIDO` con `challengeId` y `expiresAt`. Nunca devuelve el código.

### `POST /api/v1/auth/login-code/resend`

```json
{ "challengeId": "UUID_DEL_DESAFIO_ANTERIOR" }
```

Aplica 60 segundos de espera y el límite de 3 envíos/15 minutos. La respuesta contiene un nuevo `challengeId`; el anterior queda invalidado.

### `POST /api/v1/auth/verify-code`

```json
{
  "challengeId": "UUID_DEL_DESAFIO",
  "codigo": "482731",
  "recordarSesion": false
}
```

Un código correcto se marca como usado y recién entonces se crean la sesión, el access token y el refresh token.

`recordarSesion: true` crea una cookie persistente durante 30 días. Con `false`, la cookie desaparece al cerrar el navegador y la sesión vence tras 30 minutos sin renovación. El refresh token no se incluye en el JSON.

### `POST /api/v1/auth/refresh`

No recibe body ni Bearer token. Lee la cookie `capstone_refresh_token`, rota el refresh token y devuelve un access token nuevo. La petición debe enviarse con credenciales habilitadas desde el frontend.

### `POST /api/v1/auth/logout`

Revoca la sesión asociada a la cookie, elimina la cookie y responde HTTP `204`. Es idempotente cuando no existe una cookie.

### `POST /api/v1/auth/forgot-password`

```json
{ "correo": "persona@ejemplo.cl" }
```

Siempre responde HTTP `202` con el mismo mensaje, exista o no la cuenta, se haya alcanzado el límite o falle SMTP. Si corresponde, genera un token criptográficamente seguro, guarda su hash SHA-256 en `token_seguridad` con propósito `RECUPERACION_PASSWORD` y envía un enlace por correo al usuario (`{APP_ORIGIN}/recuperar-password#token={TOKEN_TEMPORAL}`). Para reenviar se repite este endpoint respetando las reglas de espera (60s) y límite de envíos (3 por 15 minutos).

### `POST /api/v1/auth/verify-recovery-code` *(Obsoleto / Retirado)*

Retirado en favor del enlace directo de recuperación. Responde HTTP 410 `ENDPOINT_DEPRECATED`.

### `POST /api/v1/auth/reset-password`

Requiere `Authorization: Bearer <token>`, donde `<token>` es el token temporal extraído del fragmento `#token=` del enlace recibido por correo.

```json
{
  "nuevaPassword": "NuevaSegura123!",
  "confirmarPassword": "NuevaSegura123!"
}
```

Valida:
- Token presente, vigente, no utilizado, no revocado y con hash coincidente.
- Usuario existente y no marcado como `INACTIVO`.
- Reglas de complejidad de contraseña (12-200 caracteres, mayúscula, minúscula, número, símbolo).
- Confirmación idéntica.

Al completar:
- Guarda la contraseña con hash `scrypt`.
- Consume el token de forma atómica (impidiendo reutilización o carreras concurrentes).
- Revoca los demás tokens de recuperación del usuario.
- Revoca todas las sesiones activas (`sesion_usuario`).
- Limpia intentos fallidos y bloqueos temporales.
- No crea sesión nueva ni reactiva cuentas inactivas.

## Fallos SMTP

- El servicio registra únicamente tipo/código/comando técnico; no registra destinatario, código, contraseña SMTP ni contenido.
- El código creado se revoca si el envío falla.
- Login responde HTTP `503` con `EMAIL_DELIVERY_FAILED`.
- Recuperación conserva HTTP `202` y el mensaje genérico para no revelar cuentas.

## Persistencia

Se reutiliza `token_seguridad`:

- `id_usuario`: propietario.
- `tipo`: propósito.
- `token_hash`: HMAC.
- `cantidad_intentos`: fallos de validación.
- `created_at` y `expires_at`: ventana de validez y control de envíos.
- `used_at`: uso correcto.
- `revoked_at`: invalidación o consumo de la autorización de recuperación.

No fue necesario modificar Prisma ni crear una migración.

La tabla `sesion_usuario` ya incluía el hash del refresh token, `recordar_sesion`, última actividad, expiración y revocación. El refresh token original nunca se guarda en PostgreSQL y ahora se entrega únicamente en una cookie HttpOnly. Cada renovación rota el token; reutilizar el anterior falla.

## Pruebas

Los tests usan un servicio de correo en memoria. Cubren generación, hash, login 2FA, expiración, uso único, tres intentos, propósito, usuario, invalidación, reenvíos, correo inexistente, SMTP, recuperación, cookie persistente y de navegador, rotación, expiración por inactividad y logout.
