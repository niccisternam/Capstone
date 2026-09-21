# Registro y aprobación de cuenta

## Objetivo

Permitir que una persona solicite una cuenta vinculada a una empresa y que un administrador apruebe o rechace la solicitud después de verificar manualmente la empresa en el sitio del SII.

## Alcance actual

- Formulario público con RUT empresa, razón social, RUT usuario, nombre, apellido, correo y descripción.
- Normalización y validación de ambos RUT y del correo.
- Estado inicial `PENDIENTE`.
- Prevención de solicitudes pendientes duplicadas por RUT empresa, RUT usuario o correo.
- Listado y detalle protegidos para administradores.
- Rechazo con motivo obligatorio.
- Aprobación con confirmación explícita de revisión manual en SII. La empresa utiliza la razón social informada en la solicitud.
- Creación de una empresa nueva durante la aprobación.
- Regla uno a uno: una empresa solo puede tener un usuario cliente. Si el RUT empresarial ya existe, se rechaza una nueva solicitud.
- Creación del usuario con rol `USUARIO`, estado `PENDIENTE` y cambio de contraseña obligatorio.
- Generación criptográficamente aleatoria y hash de una contraseña temporal que cumple las reglas de autenticación.
- Envío SMTP de la aprobación con la contraseña temporal y obligación de cambiarla.
- Envío SMTP del rechazo con el motivo registrado por el administrador.

## Exclusiones

- Integración automática con SII.
- Login, JWT, sesiones, códigos de verificación, recuperación y cambio de contraseña.

## Endpoints

### `POST /api/v1/account-requests`

Público. Recibe `rutEmpresa`, `razonSocial`, `rutUsuario`, `nombre`, `apellido`, `correo` y `descripcion`. `razonSocial` es obligatorio, se recorta y debe tener entre 2 y 200 caracteres.

### `GET /api/v1/account-requests?estado=PENDIENTE`

Solo administrador. Lista solicitudes y permite filtrar por estado.

### `GET /api/v1/account-requests/:idSolicitud`

Solo administrador. Obtiene el detalle.

### `POST /api/v1/account-requests/:idSolicitud/approve`

Solo administrador. Recibe `confirmacionSii: true`. La comprobación en SII es manual. Se crea la empresa usando `razonSocial` de la solicitud, se crea su único usuario cliente y se aprueba la solicitud. Para solicitudes antiguas sin razón social todavía se admite enviarla al aprobar. Si la empresa ya está registrada, la operación responde con `COMPANY_ALREADY_REGISTERED`. La contraseña nunca forma parte de la respuesta HTTP.

### `POST /api/v1/account-requests/:idSolicitud/reject`

Solo administrador. Recibe un `motivo` no vacío.

## Estados

`PENDIENTE` puede pasar una sola vez a `APROBADA` o `RECHAZADA`. No existen transiciones de retorno dentro del MVP.

## Seguridad e integración

Los endpoints administrativos están integrados con el módulo de login: exigen un JWT válido, una cuenta activa y el rol `ADMINISTRADOR`. Las pruebas aisladas pueden inyectar ese contrato sin crear un mecanismo inseguro temporal. La persistencia utiliza Prisma con Supabase PostgreSQL y la aprobación crea empresa, usuario y cambio de estado dentro de una sola transacción.

La contraseña temporal se genera con `crypto.randomBytes()`, garantiza minúscula, mayúscula, número y símbolo, se persiste únicamente mediante hash `scrypt` y solo aparece en el correo de aprobación. El proveedor Nodemailer reutiliza `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` y `MAIL_FROM`. Los fallos SMTP no registran destinatarios, contraseñas ni contenido; la respuesta conserva el resultado de la revisión e indica `correoEnviado: false`.

## Persistencia

- Esquema: `prisma/schema.prisma`.
- Migración inicial: `prisma/migrations/20260911020000_initial/migration.sql`.
- Migración de razón social en solicitudes: `prisma/migrations/20260911210000_add_razon_social_to_account_request/migration.sql`.
- Repositorio de producción: `PrismaAccountRequestRepository`.
- `DATABASE_URL`: consultas normales mediante el pool de sesión.
- `DIRECT_URL`: comandos y migraciones de Prisma.
- `/readiness`: ejecuta una consulta real contra PostgreSQL.
- `npm run test:db`: prueba de integración real con limpieza automática.

## Requisitos cubiertos

R4 a R10, R18 y R76 del apartado de autenticación. La contraseña temporal nunca se persiste ni retorna en texto plano y las notificaciones reales se entregan mediante el SMTP configurado.
