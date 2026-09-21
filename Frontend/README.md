# Frontend de pruebas — Capstone tributario

Frontend técnico para probar progresivamente los contratos y funcionalidades del backend Express. No es todavía el frontend final de producción.

## Tecnologías

- React 19 con TypeScript.
- NextJS
- CSS propio, sin framework visual.
- Zod para validación de formularios.
- Fetch API para integración HTTP.
- Testing Library preparados para pruebas.

El navegador consume únicamente Express (`/api/v1`). FastAPI no se expone directamente.

## Instalación y ejecución

Requisitos: Node.js 20.19+, npm y el backend Express ejecutándose normalmente en `http://localhost:3000`.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Comandos de calidad:

```powershell
npm run lint       # reglas de código
npm run typecheck  # TypeScript
npm test          
npm run build      # compilación de producción
npm run check      # lint + tipos + pruebas
```

## Páginas y funcionalidades

- `#login`: inicio de sesión con correo, contraseña y “Mantener sesión iniciada”.
- Primer ingreso: cambio de contraseña temporal usando exclusivamente `passwordChangeToken`.
- Verificación 2FA: seis casillas numéricas, `challengeId`, recordar sesión y reenvío de código.
- Recuperación: solicitud, verificación y restablecimiento con `passwordRecoveryToken`.
- `#account`: solicitud pública de cuenta.
- `#admin`: gestión protegida de solicitudes: filtro, búsqueda, tabla, detalle, aprobación y rechazo.
- Cierre de sesión mediante `/auth/logout`.

El panel administrativo solo se muestra cuando existe un `accessToken` válido.

## Validaciones Zod

Los mensajes se muestran debajo del campo cuando el usuario escribe un valor inválido; los campos vacíos no muestran advertencias iniciales.

- Correo: obligatorio y formato válido.
- Contraseñas: mínimo 8 caracteres, mayúscula, minúscula, número y símbolo.
- Confirmación de contraseña: se valida junto con la contraseña enviada al backend.
- RUT de empresa y usuario: caracteres válidos, formato automático `12.345.678-9` y máximo 13 caracteres.
- Nombre y apellido: mínimo 2 caracteres y solo letras/espacios.
- Descripción: mínimo 5 caracteres.

La validación vuelve a ejecutarse antes de cada envío para impedir datos inválidos.

## Autenticación y sesiones

- El `accessToken` se mantiene en memoria mediante el cliente HTTP y el estado global de `App`.
- Nunca se generan JWT en el frontend.
- Nunca se almacena ni se lee `refreshToken`; la cookie HttpOnly la administra el navegador.
- Todas las peticiones usan `credentials: "include"`.
- Al iniciar la aplicación se intenta `/auth/refresh` antes de mostrar las rutas protegidas.
- Un `401` dispara un único refresh compartido y repite una sola vez la petición original.
- Logout limpia el token local aunque la petición de red falle.
- Los tokens especiales (`passwordChangeToken` y `passwordRecoveryToken`) solo se envían en sus operaciones específicas.

## Integración API

La capa `src/api/` centraliza las llamadas a Express:

- `auth.api.ts`: login, cambio temporal, 2FA, reenvío, recuperación, reset.
- `accountRequests.api.ts`: creación pública y operaciones administrativas con Bearer.
- `client.ts`: headers, cookies, refresh y reintento controlado.

Los filtros administrativos se traducen exactamente a `PENDIENTE`, `APROBADA` y `RECHAZADA`.

## Estructura principal

```text
src/
  api/          cliente HTTP y contratos del backend
  components/   componentes reutilizables
  pages/        Login, solicitud de cuenta y administración
  validation.ts esquemas Zod compartidos
  App.tsx       navegación y protección de rutas
  styles.css    estilos de las pantallas de prueba
```

La documentación ampliada está en `docs/`, incluyendo arquitectura, autenticación, estados UI, testing, convenciones y plan de implementación.

## Aspectos importantes aplicados en el backend Express

Este frontend está diseñado para respetar las decisiones ya implementadas en `Backend Javascript`:

- Express + TypeScript con rutas versionadas bajo `/api/v1`.
- Persistencia PostgreSQL mediante Prisma/Supabase y migraciones reproducibles.
- Solicitudes de cuenta con estado inicial `PENDIENTE`, prevención de duplicados y revisión administrativa.
- Operaciones de listado, detalle, aprobación y rechazo protegidas por JWT y rol `ADMINISTRADOR`.
- Aprobación transaccional: creación de empresa y usuario, contraseña temporal aleatoria almacenada como hash y correo de notificación.
- Contraseñas protegidas con scrypt; códigos de verificación generados con `crypto.randomInt`, almacenados mediante HMAC, de seis dígitos, cinco minutos de vigencia, máximo tres intentos y uso único.
- Login con bloqueo tras cinco contraseñas incorrectas durante quince minutos y segundo factor por correo SMTP/Nodemailer.
- Separación estricta de propósitos entre códigos de login y recuperación.
- `passwordChangeToken` solo cambia la contraseña temporal; `passwordRecoveryToken` solo restablece una contraseña; ninguno se usa para rutas administrativas.
- El `accessToken` se crea únicamente después de verificar el código y se envía como Bearer en rutas protegidas.
- El refresh token se guarda exclusivamente como cookie HttpOnly, con rotación, revocación y opción `recordarSesion` de hasta 30 días.
- `/auth/refresh` renueva la sesión y `/auth/logout` revoca la sesión y elimina la cookie.
- Recuperación de contraseña con respuestas genéricas para evitar enumerar correos y sin iniciar sesión automáticamente.
- Validación matemática y normalización de RUT en backend; el formateo visual del frontend no reemplaza esa validación.
- Endpoints de salud `/health` y disponibilidad `/readiness` para comprobar el estado del servicio y PostgreSQL.
- No se envían códigos, contraseñas, secretos SMTP ni tokens completos a logs; los encabezados sensibles se redactan.

### Contrato de integración

El frontend envía JSON con `Content-Type: application/json`, incluye `credentials: "include"` para que el navegador gestione la cookie HttpOnly y nunca intenta leerla desde JavaScript. Las rutas administrativas siempre reciben `Authorization: Bearer <accessToken>`. FastAPI queda detrás de Express y no es un destino del navegador.

## Cómo se llegó a este resultado

Este proyecto se construyó como una primera validación técnica, siguiendo el contrato real del backend en lugar de duplicar reglas de negocio en el navegador.

1. **Se revisó el contrato backend antes de crear pantallas.** Se identificaron rutas, cuerpos JSON, estados (`PENDIENTE`, `CODIGO_REQUERIDO`, `CAMBIO_PASSWORD_REQUERIDO`, `AUTENTICADO`), códigos de error y qué token autoriza cada operación.
2. **Se eligió una sola herramienta de frontend.** React + TypeScript + Next.js
3. **Se aisló la comunicación HTTP.** `src/api/client.ts` centraliza headers, `credentials`, Bearer, refresh y reintentos; las páginas no construyen URLs ni tokens manualmente.
4. **Se separaron los contratos por dominio.** `auth.api.ts` contiene login, 2FA, cambio temporal y recuperación; `accountRequests.api.ts` contiene solicitud pública y operaciones administrativas.
5. **Se implementó la sesión en memoria.** El `accessToken` se actualiza después de `verify-code` y después de `refresh`; la cookie de refresh nunca se lee desde JavaScript ni se copia a almacenamiento local.
6. **Se protegió la navegación administrativa.** La aplicación intenta restaurar sesión antes de mostrar rutas privadas y redirige al login cuando no hay token.
7. **Se validó antes de enviar.** Zod proporciona mensajes inmediatos para correo, contraseñas, RUT, nombres y descripción; el backend sigue siendo la autoridad final.
8. **Se probaron los contratos básicos.** Cada cambio se verifica con lint, TypeScript, tests y build mediante `npm run check`.

### Flujo correcto de autenticación

```text
Login
  ├─ CAMBIO_PASSWORD_REQUERIDO
  │    └─ change-temporary-password(passwordChangeToken)
  │         └─ challengeId
  └─ CODIGO_REQUERIDO
       └─ verify-code(challengeId, codigo, recordarSesion)
            └─ accessToken en memoria + cookie HttpOnly instalada por Express
                 └─ rutas protegidas con Authorization: Bearer accessToken
```

Al recargar, el frontend llama primero a `/auth/refresh`. Si el access token expira, el cliente comparte una única operación de refresh y repite una sola vez la petición original. Nunca se decide la validez de un JWT decodificándolo en el frontend.

## Qué se omitió deliberadamente y debe resolverse en el frontend real

Este repositorio prioriza probar integración, no entregar el producto final. Para la versión real todavía se debe:

- Adoptar el sistema de diseño oficial (tipografías, colores, espaciado, componentes accesibles, responsive y estados visuales definitivos).
- Sustituir la navegación hash por un router formal con rutas, layouts y guards (`/login`, `/verificar-codigo`, `/primer-ingreso`, `/recuperar-clave`, `/administracion/solicitudes`).
- Crear un `AuthProvider`/store global persistente en memoria, con usuario, permisos, estado de restauración y eventos de expiración.
- Implementar formularios reutilizables con React Hook Form + Zod, foco accesible, navegación por teclado y mensajes asociados mediante `aria-describedby`.
- Completar paginación real, ordenamiento, filtros server-side, debounce de búsqueda, carga incremental y manejo de estados vacíos.
- Reemplazar la tabla de prueba por componentes de detalle, modales de confirmación, feedback de aprobación/rechazo y actualización optimista controlada.
- Añadir tests unitarios, de componentes, integración MSW y pruebas end-to-end de los flujos completos.
- Añadir observabilidad del frontend sin registrar contraseñas, códigos ni tokens.
- Configurar proxy/CORS, variables por entorno, HTTPS, CSP y despliegue; no usar `localhost` hardcodeado en producción.
- Implementar los módulos de negocio pendientes (notebooks, documentos, lotes, revisión humana, cuotas IA, chatbot e indicadores) solo después de cerrar sus contratos.

## Cómo reutilizar este trabajo para el frontend real

1. Copiar la capa `src/api` y conservar sus reglas de tokens/cookies.
2. Reemplazar las páginas de prueba por layouts y componentes del sistema de diseño.
3. Introducir router y `AuthProvider` por encima de todas las rutas.
4. Mantener los nombres y cuerpos definidos por Express; si cambia el backend, actualizar primero los tipos y adaptadores.
5. Migrar cada módulo del plan en cascada, cerrando criterios de aceptación y Definition of Done antes de iniciar el siguiente.
6. Ejecutar pruebas contra mocks y luego contra el backend real, incluyendo refresh, logout, permisos y errores.

La regla principal para el frontend real es conservar la separación de responsabilidades: el navegador presenta, valida la experiencia y administra el estado temporal; Express autentica, autoriza, valida negocio, persiste y emite todos los tokens.
