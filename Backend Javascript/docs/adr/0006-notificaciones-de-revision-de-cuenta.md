# ADR 0006 — Notificaciones de revisión de cuenta

## Estado

Aceptado.

## Contexto

La aprobación y el rechazo utilizaban un contrato de correo no disponible. Además, durante desarrollo `app.ts` reemplazaba la contraseña aleatoria por una contraseña fija, por lo que una aprobación podía crear correctamente la cuenta sin entregar las credenciales al solicitante.

## Decisión

- Aprobación y rechazo reutilizan la configuración SMTP de los códigos de autenticación mediante Nodemailer.
- La aprobación envía el nombre, el resultado, la contraseña temporal y la obligación de cambiarla en el primer login.
- El rechazo envía el nombre, el resultado y el motivo registrado por el administrador.
- Las contraseñas temporales se generan siempre mediante `crypto.randomBytes()` y garantizan las mismas categorías exigidas al definir una contraseña definitiva.
- Se elimina la sustitución de contraseña fija en desarrollo.
- La contraseña temporal nunca se incluye en la respuesta HTTP, PostgreSQL ni logs.
- Si SMTP falla después de guardar la revisión, no se revierte la empresa o el rechazo: la respuesta conserva el resultado y entrega `correoEnviado: false`.

## Consecuencias

No se necesitan nuevas variables de entorno ni una migración. Las pruebas automatizadas capturan correos en memoria y no realizan envíos reales. La verificación manual requiere una dirección de solicitud real y credenciales SMTP válidas.
