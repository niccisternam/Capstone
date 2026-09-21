# Módulo de autenticación — Estado y comprobación

Este documento resume lo implementado en registro, administración de solicitudes, login con código por correo y recuperación de contraseña.

## Veredicto actual

El backend permite demostrar este flujo:

```text
Solicitud de cuenta
  → revisión manual del SII
  → aprobación y creación de empresa/usuario
  → cambio obligatorio de contraseña temporal
  → código LOGIN_2FA por correo
  → verificación
  → sesión y JWT
```

También permite recuperar una contraseña mediante un código independiente sin iniciar sesión automáticamente.

El alcance de códigos por correo, mantenimiento de sesión, renovación del access token, cierre explícito de sesión y notificaciones de aprobación o rechazo queda implementado.

## Funcionalidades implementadas

### Registro y administración

- Solicitud pública con RUT empresa, RUT usuario, nombre, apellido y correo.
- Normalización y validación matemática de ambos RUT.
- Estado inicial `PENDIENTE`.
- Prevención de solicitudes duplicadas.
- Listado, detalle, aprobación y rechazo protegidos para administrador.
- Confirmación de revisión manual en el SII.
- Motivo de rechazo obligatorio.
- Creación transaccional de empresa y su único usuario.
- Contraseña temporal aleatoria, almacenada mediante hash y enviada por correo al aprobar.
- Correo de rechazo con el motivo registrado por el administrador.

### Login y código por correo

- Validación de correo y contraseña sin revelar cuál dato falló.
- Bloqueo por cinco contraseñas incorrectas durante 15 minutos.
- Cambio obligatorio de la contraseña temporal.
- Código aleatorio de seis dígitos generado con `crypto.randomInt()`.
- Entrega mediante Gmail SMTP y Nodemailer.
- Vigencia de 5 minutos y máximo 3 intentos.
- Uso único e invalidación del código anterior al reenviar.
- Espera mínima de 60 segundos y máximo 3 envíos en 15 minutos por usuario y propósito.
- Creación de sesión, access token y refresh token solo después del código correcto.
- Refresh token guardado exclusivamente en una cookie HttpOnly.
- Opción `recordarSesion` con persistencia de 30 días.
- Cookie de navegador y límite de 30 minutos de inactividad cuando no se recuerda la sesión.
- Rotación del refresh token, renovación del access token y logout con revocación.

### Recuperación de contraseña

- Solicitud con respuesta genérica (HTTP 202) exista o no el correo, esté inactiva la cuenta, se alcancen límites o falle SMTP.
- Generación de token criptográfico aleatorio y envío de enlace `{APP_ORIGIN}/recuperar-password#token={TOKEN}`.
- Propósito `RECUPERACION_PASSWORD` separado de login.
- Almacenamiento exclusivamente mediante hash SHA-256 en `token_seguridad`.
- Consumo atómico del token directamente en `POST /api/v1/auth/reset-password` mediante `Authorization: Bearer <token>`.
- No crea sesión y revoca todas las sesiones activas anteriores.
- Nueva contraseña con hash scrypt y mismas reglas del cambio temporal.
- Invalidación de tokens de recuperación restantes al terminar.
- Una cuenta `INACTIVO` no se reactiva mediante recuperación.

## Reglas de códigos

| Regla        | Implementación                                    |
| ------------ | ------------------------------------------------- |
| Formato      | Exactamente 6 dígitos                             |
| Generación   | `crypto.randomInt(100000, 1000000)`               |
| Persistencia | Solo HMAC; nunca el código original               |
| Vigencia     | 5 minutos                                         |
| Intentos     | Máximo 3                                          |
| Uso          | Una sola vez                                      |
| Reenvío      | Espera de 60 segundos                             |
| Ventana      | Máximo 3 envíos en 15 minutos                     |
| Separación   | Login y recuperación tienen propósitos diferentes |
| Fallo SMTP   | Código revocado inmediatamente                    |

## Configuración requerida

Agregar manualmente a `.env`:

```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=capstonepicdt@gmail.com
SMTP_PASS=<CONTRASEÑA_DE_APLICACION_DE_GOOGLE>
MAIL_FROM="Sistema Capstone <capstonepicdt@gmail.com>"
AUTH_TEST_ADMIN_EMAIL=capstonepicdt@gmail.com
```

La contraseña debe ser una contraseña de aplicación de Google, no la contraseña normal. `.env` está excluido por `.gitignore`.

El antiguo `AUTH_TEST_CODE` ya no se utiliza y puede eliminarse del `.env`. Las cuentas recién aprobadas reciben una contraseña temporal aleatoria por correo; ya no existe una contraseña fija para este flujo.

`AUTH_TEST_ADMIN_EMAIL` permite que la cuenta creada por `npm run seed:test-admin` use un buzón real. Después de configurarla, hay que volver a ejecutar ese comando. Si se conserva `admin@capstone.test`, el administrador no podrá recibir su código.

## Endpoints

| Método | Ruta                                     | Autorización               | Resultado                            |
| ------ | ---------------------------------------- | -------------------------- | ------------------------------------ |
| `POST` | `/api/v1/account-requests`               | Pública                    | Crea solicitud                       |
| `GET`  | `/api/v1/account-requests`               | Access token administrador | Lista solicitudes                    |
| `GET`  | `/api/v1/account-requests/:id`           | Access token administrador | Obtiene detalle                      |
| `POST` | `/api/v1/account-requests/:id/approve`   | Access token administrador | Crea empresa y usuario               |
| `POST` | `/api/v1/account-requests/:id/reject`    | Access token administrador | Rechaza con motivo                   |
| `POST` | `/api/v1/auth/login`                     | Pública                    | Envía código o exige cambio temporal |
| `POST` | `/api/v1/auth/change-temporary-password` | `passwordChangeToken`      | Cambia contraseña y envía código     |
| `POST` | `/api/v1/auth/login-code/resend`         | `challengeId` en el body   | Reenvía login 2FA                    |
| `POST` | `/api/v1/auth/verify-code`               | `challengeId` en el body   | Crea sesión y tokens                 |
| `POST` | `/api/v1/auth/refresh`                   | Cookie HttpOnly            | Renueva el access token              |
| `POST` | `/api/v1/auth/logout`                    | Cookie HttpOnly            | Revoca y elimina la sesión           |
| `POST` | `/api/v1/auth/forgot-password`           | Pública                    | Genera token y envía enlace por correo |
| `POST` | `/api/v1/auth/verify-recovery-code`      | (Obsoleto)                 | Retirado (HTTP 410)                  |
| `POST` | `/api/v1/auth/reset-password`            | Bearer token del enlace    | Valida, consume y cambia contraseña  |

## Recorrido manual

### Login con código

1. Enviar correo y contraseña a `POST /api/v1/auth/login`.
2. Leer el código recibido por correo.
3. Conservar el `challengeId` de la respuesta.
4. Enviar `challengeId`, `codigo` y `recordarSesion` a `POST /api/v1/auth/verify-code`.
5. Usar el `accessToken` devuelto como `Authorization: Bearer <token>`.
6. El refresh token queda en una cookie HttpOnly y no aparece en el JSON.

El frontend debe usar `credentials: "include"` al verificar el código, renovar la sesión y cerrar sesión. Al cargar la aplicación debe llamar a `POST /api/v1/auth/refresh`; si responde `200`, usa el access token nuevo, y si responde `401`, muestra el login.

Si la cuenta fue recién aprobada, primero se recibe un `passwordChangeToken`. Este token se utiliza exclusivamente en `change-temporary-password`; no debe reemplazarse por el access token del administrador.

### Código incorrecto

Enviar un código distinto al recibido. Los dos primeros intentos responden error; el tercero invalida el desafío. Incluso el código correcto será rechazado después de ese momento.

### Código expirado

Esperar más de cinco minutos antes de verificar. La API responderá `LOGIN_CODE_INVALID_OR_EXPIRED`.

### Reenvío

- Login: enviar el `challengeId` anterior a `POST /api/v1/auth/login-code/resend`.
- Recuperación: repetir `POST /api/v1/auth/forgot-password` con el mismo correo.

Antes de 60 segundos no se genera un nuevo código o enlace. Después de tres envíos dentro de 15 minutos se bloquean temporalmente nuevos envíos.

### Recuperación por enlace

1. Enviar el correo a `POST /api/v1/auth/forgot-password`.
2. El usuario recibe un correo con enlace `{APP_ORIGIN}/recuperar-password#token={TOKEN_TEMPORAL}`.
3. El frontend extrae el token del hash `#token=`.
4. El frontend envía la nueva contraseña a `POST /api/v1/auth/reset-password` con `Authorization: Bearer <token>`.
5. El backend consume atómicamente el token, actualiza la contraseña y revoca las sesiones anteriores.
6. El usuario inicia sesión normalmente con su nueva contraseña.

La recuperación no devuelve sesión (no access token, no refresh cookie).

## Persistencia

Se reutiliza `token_seguridad`, que ya contenía todos los campos requeridos: usuario, propósito, hash, intentos, creación, expiración, uso y revocación. No se modificó Prisma ni se creó una migración.

## Seguridad

- Scrypt para contraseñas.
- HMAC para códigos.
- Comparación resistente a diferencias de tiempo mediante `timingSafeEqual`.
- Hash SHA-256 del refresh token.
- JWT con alcances separados.
- Código ausente de respuestas y logs.
- `SMTP_PASS` ausente del código fuente y logs.
- Encabezado `Authorization` redactado en logs.
- Refresh tokens persistidos únicamente como SHA-256 y rotados en cada uso.
- Cookie `HttpOnly`, `SameSite=Lax`, `Secure` en producción y limitada a `/api/v1/auth`.
- Cambio por recuperación revoca las sesiones existentes.
- Fallos SMTP técnicos registrados sin destinatario, código ni contenido.
- Respuesta de recuperación idéntica para correo existente, desconocido, limitado o con fallo SMTP.

## Pruebas automatizadas

Los tests no envían correos reales. Usan un servicio en memoria y verifican:

- generación de seis dígitos;
- almacenamiento como hash;
- login que requiere 2FA;
- sesión creada solo después del código correcto;
- código incorrecto, expirado, usado e invalidado;
- máximo de tres intentos;
- separación por propósito y usuario;
- invalidación al generar uno nuevo;
- espera y límite de reenvíos;
- correo inexistente sin enumeración;
- fallo SMTP e invalidación;
- recuperación correcta;
- recuperación sin creación de sesión;
- autorización de recuperación de un solo uso.

## Errores relevantes

| Código                             | Significado                                       |
| ---------------------------------- | ------------------------------------------------- |
| `INVALID_CREDENTIALS`              | Correo o contraseña incorrectos                   |
| `ACCOUNT_BLOCKED`                  | Cuenta bloqueada por intentos de contraseña       |
| `EMAIL_DELIVERY_FAILED`            | No pudo entregarse el código de login             |
| `CODE_RESEND_TOO_SOON`             | Aún no transcurren 60 segundos                    |
| `CODE_SEND_LIMIT_EXCEEDED`         | Se alcanzaron 3 envíos/15 minutos                 |
| `LOGIN_CODE_INVALID`               | Código de login incorrecto                        |
| `LOGIN_CODE_ATTEMPTS_EXCEEDED`     | Tercer intento incorrecto                         |
| `LOGIN_CODE_INVALID_OR_EXPIRED`    | Código de login no utilizable                     |
| `RECOVERY_CODE_INVALID_OR_EXPIRED` | Código de recuperación no utilizable              |
| `INVALID_RECOVERY_TOKEN`           | Autorización de recuperación inválida o consumida |

## Pendientes del módulo general

- OpenAPI completo del módulo.
- Prueba de integración SMTP manual con la contraseña de aplicación.
- Prueba automatizada real de persistencia del flujo de códigos contra Supabase.

## Evaluación

| Área                        | Estado                                                      |
| --------------------------- | ----------------------------------------------------------- |
| Registro y revisión         | Implementado y probado                                      |
| Login por contraseña        | Implementado y probado                                      |
| Código LOGIN_2FA por correo | Implementado; requiere credenciales SMTP para prueba manual |
| Recuperación de contraseña  | Implementada y probada con correo simulado                  |
| Persistencia de códigos     | Implementada reutilizando Prisma                            |
| Seguridad de códigos        | Implementada y probada                                      |
| SMTP real                   | Implementado; configuración y prueba manual pendientes      |
| Refresh y logout            | Implementados y probados                                    |

La funcionalidad solicitada de códigos está implementada a nivel de código y pruebas aisladas. No debe considerarse verificada con Gmail hasta configurar la contraseña de aplicación y completar la prueba manual.
