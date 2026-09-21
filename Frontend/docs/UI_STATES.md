# Estados de interfaz

Cada experiencia de datos debe decidir y probar explícitamente los estados aplicables:

- **Inicial/loading:** skeleton o indicador con contexto; evitar bloquear toda la página si solo carga una sección.
- **Vacío:** explicar qué falta y ofrecer una acción posible, sin confundirlo con un error.
- **Error recuperable:** mensaje seguro, preservación de contexto y reintento cuando sea idempotente.
- **Error de autenticación/autorización:** seguir el contrato de `401`/`403`; no fingir permisos.
- **Éxito:** confirmación proporcional, actualización visible y prevención de dobles envíos.
- **Procesamiento:** estado persistente para lotes/documentos; no prometer tiempos no definidos.
- **Parcial:** si el contrato permite resultados parciales, identificarlos con claridad.

## Formularios

Controles deshabilitados solo cuando sea necesario, foco al primer error o resumen accesible, mensajes vinculados al campo y feedback de envío. Evitar perder valores ante un error, excepto secretos cuando conservarlos aumente el riesgo.

## Listas y detalle

Filtros y paginación deben reflejarse en URL cuando resulte útil. Distinguir “sin registros” de “sin resultados para estos filtros”. Para acciones destructivas futuras, confirmar alcance y mostrar consecuencias según requisitos aprobados.
