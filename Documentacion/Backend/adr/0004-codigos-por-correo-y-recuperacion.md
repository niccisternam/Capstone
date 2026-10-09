# ADR 0004 — Códigos por correo y recuperación de contraseña

## Estado

Aceptada.

## Contexto

El código artificial de ADR 0003 permitió validar el primer incremento, pero no ofrece entrega individual ni seguridad suficiente para el MVP. La tabla `token_seguridad` ya representa usuario, propósito, hash, intentos, creación, expiración, uso y revocación.

## Decisión

- Generar códigos numéricos de seis dígitos con `crypto.randomInt()`.
- Almacenar únicamente un HMAC que incluye identificador, propósito y código.
- Enviar por Gmail SMTP mediante un servicio Nodemailer aislado y configurado exclusivamente por variables de entorno.
- Reutilizar `CODIGO_INICIO_SESION` y `RECUPERACION_PASSWORD`; no aceptar propósitos enviados por clientes.
- Aplicar 5 minutos de vigencia, 3 intentos, 60 segundos entre envíos y 3 envíos por ventana de 15 minutos.
- Invalidar códigos anteriores del mismo usuario y propósito al crear uno nuevo.
- Completar el login con el JWT y la sesión existentes solo después del código correcto.
- Al verificar recuperación, emitir un JWT temporal de alcance `reset_password` vinculado al código utilizado. Este token es de un solo uso y no crea sesión.
- Ante un fallo SMTP de login, responder un error controlado. En recuperación, conservar la respuesta genérica para evitar enumeración de cuentas, registrar el fallo e invalidar el código.

## Consecuencias

No se requiere migración: el modelo existente es suficiente. La aplicación necesita credenciales SMTP válidas para entregar códigos. Los tests usan un doble del servicio de correo y nunca contactan Gmail.
