# Plan de implementación en cascada

Cada módulo se cierra completamente antes de comenzar el siguiente.

1. **Fundación técnica y persistencia** — configuración final, conexión DB, migraciones, logger, errores, health/readiness, auditoría base y pruebas base.
2. **Registro y solicitudes de cuenta** — formulario, estados, aprobación/rechazo, creación de empresa con un único usuario cliente y creación inicial del usuario. La excepción de orden se documenta en ADR 0002.
3. **Autenticación y seguridad** — login, JWT/refresh, cierre de sesión, 2FA por correo, recuperación de contraseña y políticas de contraseñas.
4. **Usuarios, roles y empresas** — CRUD, permisos, aislamiento por empresa y administración posterior.
5. **Notebooks** — CRUD, nombre único por empresa, permisos y estados.
6. **Documentos y carga** — validación de archivos, lotes de 1–10, metadata, hash, almacenamiento y estados.
7. **Procesamiento FastAPI** — cliente interno, timeouts, reintentos controlados, correlación y actualización de estados.
8. **Revisión y confirmación** — correcciones manuales, historial, confirmación y trazabilidad.
9. **Chatbot y consultas analíticas** — contratos con FastAPI, permisos, límites, auditoría y consumo de tokens.
10. **Operación y endurecimiento** — documentación OpenAPI, observabilidad, rate limiting, backups, despliegue y revisión final.

## Entregables obligatorios por módulo

Antes de cerrar cada módulo deben quedar documentados: objetivo, alcance y exclusiones; requisitos ERS relacionados; actores y permisos; endpoints y ejemplos de respuesta; entidades y migraciones; estados y transiciones; variables de entorno; errores; pruebas unitarias e integración; riesgos y ADRs. La implementación debe respetar los límites de 15 MB por PDF, 1–10 documentos por lote, CLP y aislamiento por empresa cuando sean aplicables.

## Dependencias de negocio

Autenticación define el usuario y la sesión. Usuarios/roles y empresas definen el contexto de autorización. Notebooks depende de empresa y usuario. Documentos depende de notebook y empresa. Procesamiento depende de documentos. Revisión depende de resultados preliminares. Chatbot y analítica dependen de documentos confirmados y de consultas autorizadas.

## Criterio de avance

No avanzar al siguiente módulo hasta cumplir la Definition of Done, ejecutar pruebas y dejar documentadas las decisiones y contratos del módulo actual.
