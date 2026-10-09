# Plan modular en cascada

## Definition of Done común

Para todos los módulos: alcance y criterios aprobados; UI y estados aplicables implementados; contrato Express verificado y registrado; sin acceso directo a FastAPI; accesibilidad y responsive revisados; lint, typecheck y pruebas relevantes aprobados; diff revisado; documentación actualizada; sin secretos ni alcance de módulos futuros.

## 1. Scaffold técnico, layout base y navegación

- **Objetivo:** inicializar el stack, convenciones ejecutables y cascarón navegable.
- **Dependencias:** versiones compatibles y mockup/requisitos generales disponibles.
- **Alcance:** Next.js App Router, TypeScript estricto, Tailwind, Zod, alias, lint/typecheck/tests, layouts y navegación base sin negocio ficticio.
- **Aceptación:** el proyecto inicia; rutas placeholder acordadas renderizan; límites público/protegido/admin quedan preparados sin simular seguridad.
- **Pruebas:** build o compilación, lint, typecheck, smoke de layouts/navegación y accesibilidad básica.
- **DoD:** DoD común más scripts reproducibles y decisiones de scaffold documentadas.

## 2. Solicitud de cuenta

- **Objetivo:** permitir enviar una solicitud de alta conforme al contrato.
- **Dependencias:** módulo 1; campos, consentimiento, estados y endpoint Express confirmados.
- **Alcance:** formulario, Zod, envío, éxito y errores; no incluye aprobación administrativa salvo requisito expreso.
- **Aceptación:** datos válidos se envían una vez; errores de campo/servidor son claros; no se filtran detalles sensibles.
- **Pruebas:** validaciones, teclado, doble envío, éxito, conflicto, red y respuesta inválida.
- **DoD:** DoD común más endpoint y payload documentados.

## 3. Login

- **Objetivo:** autenticar y dirigir según el estado real de la cuenta.
- **Dependencias:** módulos 1–2; contrato de sesión, credenciales y estados de cuenta confirmado.
- **Alcance:** formulario, sesión, errores y redirección; sin inventar persistencia de JWT.
- **Aceptación:** login válido establece la sesión según Express; fallos son seguros; rutas protegidas no exponen contenido.
- **Pruebas:** éxito, credenciales inválidas, cuenta no habilitada según contrato, expiración y navegación protegida.
- **DoD:** DoD común más estrategia de sesión registrada en `AUTH.md`.

## 4. Primer acceso, contraseña temporal y 2FA

- **Objetivo:** completar los desafíos obligatorios del primer acceso.
- **Dependencias:** módulo 3; máquina de estados y contratos de contraseña/2FA confirmados.
- **Alcance:** cambio obligatorio, enrolamiento/verificación 2FA y transiciones que Express indique.
- **Aceptación:** no se puede saltar un paso exigido; estados y reintentos reflejan al backend; secretos no quedan persistidos/logueados.
- **Pruebas:** cada transición, OTP inválido/expirado, refresh, navegación atrás y bloqueo según contrato.
- **DoD:** DoD común más diagrama/flujo real actualizado en `AUTH.md`.

## 5. Recuperación de contraseña

- **Objetivo:** recuperar acceso sin revelar información indebida.
- **Dependencias:** módulos 3–4; endpoints, tokens, expiración y mensajes confirmados.
- **Alcance:** solicitud, enlace/código y nueva contraseña según contrato.
- **Aceptación:** mensajes seguros; tokens inválidos/expirados se manejan; sesión posterior sigue la política real.
- **Pruebas:** cuenta conocida/desconocida, token válido/inválido/expirado, validación y red.
- **DoD:** DoD común más decisiones de privacidad y contratos registrados.

## 6. Notebooks

- **Objetivo:** listar, consultar y operar notebooks autorizados.
- **Dependencias:** autenticación cerrada; modelo, permisos, filtros y endpoints confirmados.
- **Alcance:** lista/detalle y acciones expresamente requeridas; no asumir creación/edición/borrado.
- **Aceptación:** solo se muestran datos permitidos; loading/vacío/error/filtros funcionan; autorización depende de Express.
- **Pruebas:** estados de lista/detalle, paginación/filtros si existen, `401`, `403`, `404` y errores.
- **DoD:** DoD común más permisos y endpoints documentados.

## 7. Carga de documentos

- **Objetivo:** cargar documentos a destinos autorizados con feedback fiable.
- **Dependencias:** módulo 6; límites, formatos, destino, multipart/presigned flow y endpoint confirmados.
- **Alcance:** selección, validación confirmada, carga, progreso si es soportado, cancelación/reintento seguro.
- **Aceptación:** archivos inválidos se explican; no hay cargas duplicadas accidentales; éxito identifica el resultado real.
- **Pruebas:** tipo/tamaño/cantidad, red interrumpida, error parcial, doble envío y accesibilidad del selector.
- **DoD:** DoD común más límites y flujo de carga registrados.

## 8. Lotes y estados de procesamiento

- **Objetivo:** visualizar lotes y evolución del procesamiento.
- **Dependencias:** módulo 7; catálogo de estados, transiciones y mecanismo de actualización confirmados.
- **Alcance:** lista/detalle, estados y refresco/polling/eventos solo si el contrato los soporta.
- **Aceptación:** estados se presentan sin inventar progreso; actualización se detiene correctamente; errores permiten recuperación.
- **Pruebas:** cada estado real, transición, timeout, lote parcial, desmontaje y permisos.
- **DoD:** DoD común más catálogo y política de actualización documentados.

## 9. Revisión humana de PDF y datos extraídos

- **Objetivo:** comparar el documento con datos extraídos y registrar revisión humana.
- **Dependencias:** módulo 8; acceso seguro al PDF, esquema extraído, acciones y concurrencia confirmados.
- **Alcance:** visor, campos, correcciones/confirmación según contrato, estados de guardado y conflicto.
- **Aceptación:** asociación visual inequívoca; cambios no se pierden silenciosamente; permisos y conflictos se respetan.
- **Pruebas:** carga/fallo de PDF, datos incompletos, validación, guardado, conflicto, teclado y distintos tamaños.
- **DoD:** DoD común más decisiones de visor, auditoría y endpoints registradas.

## 10. Gestión documental

- **Objetivo:** localizar y gestionar documentos procesados según permisos.
- **Dependencias:** módulo 9; metadatos, acciones, retención y permisos confirmados.
- **Alcance:** listado, búsqueda/filtros, detalle y solo acciones respaldadas por contrato.
- **Aceptación:** resultados y filtros son coherentes; acciones sensibles muestran alcance; descargas/accesos están autorizados.
- **Pruebas:** vacío, filtros, paginación, permisos, descarga/fallo y acciones confirmadas.
- **DoD:** DoD común más matriz de acciones/permisos documentada.

## 11. Cuota y consumo de IA

- **Objetivo:** mostrar cuota y consumo de forma comprensible y verificable.
- **Dependencias:** módulos de documentos cerrados; unidades, ventanas, límites y endpoints confirmados.
- **Alcance:** resumen, detalle/periodo y estados de límite; no calcular reglas que pertenecen al backend.
- **Aceptación:** unidades y fechas son claras; el frontend representa valores de Express sin reinterpretarlos incorrectamente.
- **Pruebas:** cero, parcial, límite, sin datos, zona/periodo confirmado y error.
- **DoD:** DoD común más definiciones de métricas documentadas.

## 12. Chatbot e historial

- **Objetivo:** conversar con historial y contexto autorizado.
- **Dependencias:** módulos 6 y 11; contratos de mensajes, streaming si existe, historial, permisos y notebooks confirmados.
- **Alcance:** conversaciones, mensajes, estados y selección de uno o varios notebooks autorizados únicamente si el contrato lo soporta.
- **Aceptación:** el contexto elegido es visible; no se envían notebooks no autorizados; streaming/cancelación/errores siguen el contrato; cuota se refleja.
- **Pruebas:** envío, historial, vacío, error, reintento seguro, permisos, uno/varios notebooks si aplica y accesibilidad.
- **DoD:** DoD común más formato de mensajes, contexto y política de historial documentados.

## 13. Dashboard y KPIs

- **Objetivo:** resumir información accionable con métricas definidas por el backend.
- **Dependencias:** módulos fuente cerrados; fórmulas, periodos, permisos y endpoints confirmados.
- **Alcance:** tarjetas/gráficos/tablas necesarios, filtros y navegación a detalle; no calcular KPIs tributarios inventados.
- **Aceptación:** cada métrica tiene definición y periodo; estados sin datos/error son honestos; visualizaciones son accesibles.
- **Pruebas:** datos normales/cero/parciales, filtros, permisos, responsive y alternativa textual de gráficos.
- **DoD:** DoD común más diccionario de KPIs y fuentes documentado.

## 14. Accesibilidad, responsive, testing, hardening y cierre

- **Objetivo:** validar integralmente el producto y preparar la entrega.
- **Dependencias:** módulos 1–13 cerrados.
- **Alcance:** auditoría WCAG acordada, matrices responsive/navegadores, E2E críticos, rendimiento, seguridad de cliente, observabilidad y documentación final.
- **Aceptación:** recorridos críticos pasan; no hay defectos bloqueantes; foco/teclado/contraste/lectores y breakpoints cumplen el objetivo acordado.
- **Pruebas:** suite completa, E2E, accesibilidad automatizada/manual, responsive, rendimiento y regresión de auth/permisos.
- **DoD:** DoD común más informe final, deuda aceptada, instrucciones operativas y aprobación de cierre.
