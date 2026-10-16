# Guía: entorno para probar la aplicación

Cómo dejar funcionando la aplicación completa (Supabase + backend Express + frontend Next.js + Gemini) y probarla de punta a punta: cuentas, notebooks, extracción de PDF y chat financiero.

Tiempo estimado: 45–60 minutos la primera vez.

---

## 0. Requisitos

| Necesitas | Para qué | Dónde |
|---|---|---|
| Node.js **22.18+** (recomendado 24) | Backend, frontend y sus tests | `node -v` |
| Proyecto en Supabase | Base de datos PostgreSQL | supabase.com |
| Cuenta Gmail con verificación en 2 pasos | Enviar códigos de login y contraseñas temporales (SMTP) | myaccount.google.com |
| API key de Gemini | Extracción de PDF y chat | aistudio.google.com |

> **El correo SMTP es obligatorio.** Sin él no se puede iniciar sesión: el login siempre envía un código de 6 dígitos por correo, y la aprobación de cuentas envía la contraseña temporal por correo.

---

## 1. Supabase

### 1.1 Crear el proyecto
1. En supabase.com → **New project**.
2. Región: **South America (São Paulo)** (menor latencia desde Chile).
3. Define la **Database password** y guárdala: la necesitarás en las URLs. Si contiene caracteres especiales (`@ # / ? % :`), en la URL debes escribirlos codificados (`@` → `%40`, `#` → `%23`, `/` → `%2F`, `?` → `%3F`, `%` → `%25`, `:` → `%3A`). Lo más simple es usar solo letras y números.

### 1.2 Obtener la cadena de conexión
1. En el proyecto → botón **Connect** (arriba).
2. Pestaña **Connection string** → tipo **URI**.
3. Elige **Session pooler** (puerto **5432**). Funciona con IPv4; la "Direct connection" en el plan gratuito solo funciona por IPv6 y suele fallar desde redes domésticas o de la universidad.

Queda algo así:

```text
postgresql://postgres.<ref-del-proyecto>:<password>@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
```

Usa **la misma URL** para `DATABASE_URL` y `DIRECT_URL`. El backend agrega `sslmode=require` automáticamente.

---

## 2. Gmail (SMTP)

1. En tu cuenta Google → **Seguridad** → activa la **Verificación en 2 pasos** (si no lo está).
2. Busca **Contraseñas de aplicaciones** (myaccount.google.com/apppasswords) → crea una con nombre "Capstone".
3. Copia la clave de 16 letras **sin espacios**. Esa es `SMTP_PASS`, no tu contraseña de Gmail.

> Truco para probar con un solo buzón: Gmail entrega `tu.correo+admin@gmail.com` y `tu.correo+usuario@gmail.com` en tu misma bandeja, pero el sistema los trata como correos distintos. Los necesitarás porque **cada empresa tiene un solo usuario**: el administrador y el usuario de prueba deben tener correos diferentes.

---

## 3. Gemini

1. En aistudio.google.com → **Get API key** → **Create API key**.
2. Usa `GEMINI_MODEL=gemini-3.5-flash` (probado el 15-10-2026: ~4 s por pregunta del chat). Ojo: la lista de modelos de la API incluye algunos que **ya no están disponibles para cuentas nuevas** (por ejemplo `gemini-2.0-flash` y `gemini-2.5-flash` responden 404) y otros que a veces están saturados (`gemini-3.8-flash` respondió 503). Si el backend responde `AI_MODEL_NOT_FOUND`, prueba otro modelo "flash" vigente.

---

## 4. Backend (`Backend Javascript/`)

### 4.1 Archivo `.env`

```powershell
cd "Backend Javascript"
Copy-Item .env.example .env
```

Genera un secreto para JWT:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Edita `.env`:

```dotenv
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres.<ref>:<password>@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
DIRECT_URL=postgresql://postgres.<ref>:<password>@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
# Obligatoria aunque FastAPI no exista; cualquier URL válida sirve.
FASTAPI_BASE_URL=http://localhost:8000
JWT_SECRET=<el valor generado>
# Correo REAL del administrador de prueba: ahí llegará su código de login.
AUTH_TEST_ADMIN_EMAIL=tu.correo+admin@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=tu.correo@gmail.com
SMTP_PASS=<clave de aplicación de 16 letras>
MAIL_FROM="Sistema Capstone <tu.correo@gmail.com>"
# Debe coincidir con la URL del frontend (CORS).
APP_ORIGIN=http://localhost:5173
GEMINI_API_KEY=<tu API key>
GEMINI_MODEL=gemini-3.5-flash
GEMINI_LIVE_TESTS=false
DOCUMENT_STORAGE_PATH=./storage/documents
```

> `.env` está en `.gitignore`. Nunca subas claves al repositorio.

### 4.2 Instalar y crear las tablas

```powershell
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
```

`migrate:deploy` aplica las 4 migraciones: inicial, razón social, Módulo 1 y Módulo 4 (chat). Al terminar debe decir que se aplicaron todas.

### 4.3 Verificar el rol del chat

En Supabase → **SQL Editor** → ejecuta:

```sql
BEGIN; SET LOCAL ROLE chat_lector; SELECT count(*) FROM v_chat_documentos; ROLLBACK;
```

- Devuelve `0` → correcto (no se fijó empresa, así que la vista no muestra nada).
- `permission denied to set role "chat_lector"` → ejecuta `GRANT chat_lector TO postgres;` y repite la prueba.

### 4.4 Crear el administrador de prueba

```powershell
npm run seed:test-admin
```

Crea la empresa `77777777-7` y un administrador con el correo de `AUTH_TEST_ADMIN_EMAIL` y la contraseña **`AdminTemporal1!`**.

### 4.5 Levantar el backend

```powershell
npm run dev
```

Comprueba en el navegador:
- `http://localhost:3000/health` → `{"status":"ok", ...}`
- `http://localhost:3000/readiness` → `{"status":"ready", "database":"ok"}`. Si responde `503`, revisa la URL de la base (sección 8).

Deja esta terminal abierta.

---

## 5. Frontend (`Frontend/`)

En **otra terminal**:

```powershell
cd Frontend
Copy-Item .env.example .env.local
npm install
npm run dev
```

`.env.local` debe contener `NEXT_PUBLIC_API_URL=http://localhost:3000`. El frontend queda en **http://localhost:5173**.

---

## 6. Prueba de punta a punta

### 6.1 Administrador
1. Abre `http://localhost:5173/login` e ingresa con el correo de `AUTH_TEST_ADMIN_EMAIL` y `AdminTemporal1!`.
2. Revisa el correo: llega un código de 6 dígitos (vence en 5 minutos). Ingrésalo.
3. Entras a **/admin/solicitudes**. Cierra sesión.

### 6.2 Solicitar una cuenta de usuario
1. Ve a `/solicitud-cuenta` y completa el formulario. Datos de ejemplo con RUT válidos:
   - RUT empresa: `76.543.210-3`, razón social: `Panadería Don Pepe SpA`
   - RUT usuario: `15.678.234-3`
   - Correo: `tu.correo+usuario@gmail.com` (distinto al del administrador)
2. Envía la solicitud.

### 6.3 Aprobar la cuenta
1. Inicia sesión como administrador (con un nuevo código por correo).
2. En **Solicitudes**, abre la nueva solicitud → **Aprobar**.
3. Al correo del usuario llega una **contraseña temporal**.

### 6.4 Primer ingreso del usuario
1. Cierra sesión e ingresa con el correo del usuario y la contraseña temporal.
2. El sistema pide cambiarla (mínimo 8 caracteres, con mayúscula, minúscula, número y símbolo).
3. Ingresa el código que llega por correo → entras a **/usuario**.

### 6.5 Módulo 1: notebook y documentos
1. **Crear nuevo notebook** (nombre, descripción, ícono y color).
2. Entra al notebook → pestaña **Documentos** → carga PDFs de prueba desde `Documentacion/General/module1-test-documents/`. Para empezar: `01_factura_completa.pdf` y `02_boleta.pdf`.
3. **Iniciar procesamiento**. Cada documento debería pasar a "Procesado correctamente" en unos segundos.
   - `08_pdf_sin_texto.pdf` debe terminar en **Error**: es el comportamiento esperado.
4. **Revisar todos los documentos** → revisa los campos, define el estado de pago → **guardar y confirmar** cada documento.

> El chat solo ve documentos **CONFIRMADOS**. Si no confirmas ninguno, todas las preguntas responderán "no encontré documentos".

### 6.6 Módulo 4: chat financiero
1. En el notebook → pestaña **Preguntarle a la IA**.
2. Prueba:

| Pregunta | Resultado esperado |
|---|---|
| "¿Cuánto gastamos en total?" | Suma de `total` de los documentos confirmados, en CLP |
| "¿A qué proveedor le compramos más?" | Razón social del emisor con mayor monto |
| "Listar facturas pendientes de pago" | Documentos con estado de pago PENDIENTE |
| "¿Cuál es la capital de Francia?" | "Solo puedo responder consultas sobre los documentos registrados en este notebook." |
| Una pregunta sobre un producto que no existe | "No encontré documentos confirmados…" |

3. **Reiniciar conversación** borra el historial del notebook.
4. Opcional, en el SQL Editor: `SELECT rol, contenido, sql_generado FROM mensaje_chat ORDER BY created_at DESC LIMIT 10;` muestra el SQL que generó la IA para cada respuesta.

---

## 7. Tests automatizados (opcional)

```powershell
# Backend: unitarios (no usan la base ni Gemini)
cd "Backend Javascript"
npm test
# Backend: integración contra la base real (crea y borra registros de prueba)
npm run test:db

# Frontend
cd ..\Frontend
npm run check
```

---

## 8. Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---|---|---|
| El backend no arranca: error de Zod en `env.ts` | Falta una variable obligatoria (`DATABASE_URL`, `FASTAPI_BASE_URL`, `JWT_SECRET` de 16+ caracteres) | Completa `.env` |
| `PrismaConfigEnvError: DIRECT_URL` | Falta `DIRECT_URL` | Agrégala (misma URL que `DATABASE_URL`) |
| `P1001: Can't reach database server` | Usaste la "Direct connection" (IPv6) | Usa la URL del **Session pooler** |
| `/readiness` responde 503 o "password authentication failed" | Contraseña mal escrita o con caracteres sin codificar | Revisa la sección 1.1 |
| No llega el código de login | SMTP mal configurado | Revisa `SMTP_USER`/`SMTP_PASS` (clave de aplicación sin espacios) y la carpeta de spam; en la terminal del backend aparece `smtp_delivery_failed` |
| La aprobación dice que no se envió el correo | Igual que la anterior | Corrige SMTP; el usuario puede usar "Recuperar contraseña" |
| Error de CORS en la consola del navegador | `APP_ORIGIN` no coincide con la URL del frontend | Debe ser exactamente `http://localhost:5173` |
| Documento en Error con `AI_NOT_CONFIGURED` | Falta `GEMINI_API_KEY` | Agrégala y reinicia el backend |
| `AI_AUTHENTICATION` ("rechazó la API configurada") | `GEMINI_API_KEY` sigue con el valor de ejemplo `replace-with-gemini-api-key` o la clave es inválida | Pega la clave real de AI Studio y reinicia el backend |
| `AI_MODEL_NOT_FOUND` | El modelo configurado ya no está disponible | Cambia `GEMINI_MODEL` (sección 3) |
| `AI_RATE_LIMITED` | Límite de la cuota gratuita de Gemini (por minuto y por día) | Espera un minuto; procesa lotes más pequeños |
| `AI_UNAVAILABLE` | El modelo está saturado (503) | Reintenta en unos segundos o cambia `GEMINI_MODEL` |
| El chat siempre responde "No pude obtener los datos…" | El rol `chat_lector` no está bien configurado | Busca `chat_query_failed` en la terminal del backend y repite la sección 4.3 |
| El chat responde "No pude convertir tu pregunta en una consulta segura" | La IA usó una función que no está en la lista permitida | Reformula; si se repite, agrega la función a `PERMITIDAS` en `src/modules/module4/chat.sql.ts` |
| Cuenta bloqueada tras varios intentos | 5 contraseñas incorrectas bloquean la cuenta 15 minutos | Espera o vuelve a ejecutar `npm run seed:test-admin` (solo para el administrador) |
