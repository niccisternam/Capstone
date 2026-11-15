# ADR 0009 — Conversaciones privadas del chat por notebook

## Estado

Aceptada — 13-11-2026

## Contexto

El chat del módulo 4 guardaba todos los mensajes de un usuario en un notebook como un único historial. Se necesita conservar varios hilos independientes dentro del mismo notebook y mantener su privacidad.

## Decisión

- Crear `conversacion_chat` relacionada con empresa, notebook y usuario.
- Relacionar cada `mensaje_chat` con una conversación; los mensajes conservan su rol, contenido y SQL generado.
- Listar, leer, enviar y eliminar conversaciones bajo comprobación de empresa y usuario en Express.
- Al enviar el primer mensaje, usarlo como título (máximo 80 caracteres) si la conversación aún tiene el título predeterminado.
- La migración agrupa el historial existente por empresa, notebook y usuario en una conversación titulada “Conversación anterior”.
- El frontend mantiene el borrador nuevo local hasta el primer envío, selecciona la conversación más reciente y ofrece un panel lateral retráctil.
- Limitar a 50 conversaciones por usuario/notebook; al intentar superar el límite, responder `409 CHAT_CONVERSATION_LIMIT`. La creación por API reutiliza un borrador vacío del mismo usuario/notebook.
- Limitar el historial visible a 50 mensajes por página y las conversaciones a 20 por página. Los mensajes anteriores se consultan con cursor `idMensaje`.
- Limitar el envío a 20 preguntas por minuto por usuario, con respuesta `429 CHAT_RATE_LIMITED` y `Retry-After`.

## Contrato Express

Base: `/api/v1/module4`. Todos los endpoints requieren Bearer y limitan el acceso a la empresa y usuario autenticados.

| Método y endpoint | Respuesta |
|---|---|
| `GET /notebooks/:idNotebook/conversaciones?pagina=1` | `200 { conversaciones: [...], total, pagina, hayMas }` |
| `POST /notebooks/:idNotebook/conversaciones` | `201 { conversacion }` |
| `GET /conversaciones/:idConversacion/mensajes?cursor=:idMensaje` | `200 { mensajes: [...], hayMas }` |
| `POST /conversaciones/:idConversacion/mensajes` | `201 { mensajes: [pregunta, respuesta], conversacion }` |
| `DELETE /conversaciones/:idConversacion` | `200 { idConversacion, eliminado: true }` |

`conversacion` incluye `idConversacion`, `titulo`, `createdAt` y `updatedAt`. Los mensajes incluyen `idMensaje`, `rol`, `contenido` y `createdAt`. La pregunta acepta texto recortado de 1 a 1000 caracteres; el título opcional, de 1 a 120.
Los errores relevantes son `NOTEBOOK_NOT_FOUND` y `CONVERSATION_NOT_FOUND` (404), y validación Zod para identificadores o payloads inválidos.

## Consecuencias

- El contexto enviado a la IA queda limitado a los mensajes de una sola conversación.
- La paginación acota payloads y DOM; el límite por usuario/notebook evita crecimiento indefinido desde la UI.
- Eliminar una conversación elimina sus mensajes mediante `ON DELETE CASCADE`.
- La migración elimina las columnas de empresa, notebook y usuario de `mensaje_chat` después del backfill; esas columnas se conservan en `conversacion_chat`.
- Los endpoints anteriores `/notebooks/:idNotebook/chat` se reemplazan por endpoints explícitos de conversaciones y mensajes.
- La autorización de acceso cruzado y el envío/titulado se cubren en `tests/module4.chat-conversations.test.ts`; los contratos frontend en `Frontend/tests/chat-api.test.mjs`.
- El rate limit es por proceso y acotado a 10.000 usuarios activos en memoria; en despliegues con varias instancias se necesita almacenamiento compartido para aplicar una cuota global.
