# Módulo 1: funcionalidades adicionales al requerimiento inicial

Este documento registra funcionalidades implementadas o decisiones de producto del Módulo 1 que no aparecen explícitamente en el archivo de referencia `Planilla de Requerimientos.xlsm - Requerimiento Inicial.csv`.

El CSV continúa siendo la referencia base. Este archivo debe actualizarse cuando se agreguen nuevas capacidades que no estén cubiertas por los requerimientos funcionales o no funcionales existentes.

## Referencia del CSV

Los requerimientos del Módulo 1 se encuentran principalmente en:

- R.19–R.43: requerimientos funcionales.
- R.82–R.87: requerimientos no funcionales.

## Funcionalidades adicionales implementadas

### A. Gestión visual de notebooks

El sistema incluye un listado dedicado de notebooks con:

- visualización de notebooks existentes;
- estado de carga del listado;
- estado vacío con acción para crear un notebook;
- estado de error con reintento;
- navegación al detalle después de crear un notebook;
- prevención de nombres duplicados mediante el código `NOTEBOOK_NAME_TAKEN`.

El CSV contempla la creación de notebooks en R.36, pero no describe explícitamente el listado, sus estados de carga, el estado vacío ni el flujo de reintento.

### B. Lotes independientes por operación de carga

Cada operación de carga crea un lote independiente y se conserva visualmente junto con los lotes anteriores de la misma vista.

Esto evita que una nueva carga reemplace la anterior antes o después del procesamiento. El CSV define la carga múltiple y el procesamiento por lote, pero no especifica la convivencia visual de múltiples lotes en una misma pantalla.

### C. Selección acumulativa de archivos

Cuando el usuario vuelve a seleccionar archivos PDF antes de iniciar el procesamiento, la interfaz acumula las selecciones en lugar de reemplazar automáticamente los archivos anteriores.

La selección de archivos por sí sola no inicia el lote ni consume el servicio de IA. El procesamiento comienza únicamente mediante la acción explícita de iniciar procesamiento.

### D. Separación entre documentos existentes y lotes nuevos

La pantalla del notebook separa:

- documentos existentes procesados anteriormente;
- lotes creados durante la sesión actual;
- documentos que todavía están pendientes dentro de los lotes nuevos.

Los documentos que pertenecen a un lote visible no se duplican en la sección de documentos existentes.

### E. Mensajes de error por documento

Cuando un documento falla dentro de un lote, el error se muestra dentro del espacio del documento afectado y no solo como un mensaje general del lote.

El mensaje busca ser comprensible para el usuario y conserva el código seguro del backend para diferenciar, entre otros casos:

- PDF sin texto procesable;
- respuesta inválida de IA;
- límite temporal del servicio de IA;
- modelo no disponible;
- API key o permisos inválidos;
- solicitud rechazada por configuración.

### F. Diagnóstico seguro de errores de Gemini

El backend clasifica los errores del proveedor de IA por estado HTTP y no transforma automáticamente todos los fallos en “servicio ocupado”.

Se distinguen los códigos:

- `AI_BAD_REQUEST`;
- `AI_AUTHENTICATION`;
- `AI_MODEL_NOT_FOUND`;
- `AI_RATE_LIMITED`;
- `AI_UNAVAILABLE`.

Esta clasificación no expone la respuesta completa de Gemini ni el PDF en la interfaz.

### G. Confirmación de documentos reabrible

Los documentos en estado `CONFIRMADO` pueden volver a abrirse desde “Documentos existentes” mediante el botón `Editar documento`.

La edición crea una nueva revisión antes de volver a confirmar el documento. Esta reapertura posterior a la confirmación no está descrita explícitamente en R.38–R.42, aunque se relaciona con la corrección posterior de datos indicada para el Módulo 2 en R.49.

### H. Eliminación desde documentos existentes

La sección “Documentos existentes” puede mostrar una acción de eliminación para documentos que el backend permite borrar, incluyendo documentos confirmados, pendientes de confirmación o con error.

Los documentos que se encuentran actualmente en procesamiento permanecen protegidos contra eliminación.

### I. Estado de pago interno controlado

El estado de pago ingresado por el usuario se presenta como una selección controlada con los valores:

- `PENDIENTE`;
- `PAGADO`.

El campo se mantiene separado del `medioPago` extraído desde el documento. El CSV exige registrar el estado de pago en R.25, pero no define los valores permitidos ni la diferencia visual entre ambos conceptos.

### J. Visor PDF integrado ajustado

La pantalla de confirmación incluye el PDF original dentro de la misma vista y conserva controles de zoom y navegación, pero oculta el panel lateral de miniaturas para priorizar la página del documento.

También se mantiene la opción para abrir el PDF en una pestaña separada.

R.22 exige visualizar el PDF, pero no especifica la configuración visual del visor, la ocultación de miniaturas ni el ajuste inicial al ancho de página.

### K. Validación de firma real del PDF en frontend

Además de revisar el MIME type y el tamaño, el frontend valida que el archivo comience con la firma `%PDF` antes de enviarlo.

Esta validación complementa la validación equivalente del backend. El CSV exige cargar PDF, pero no detalla esta validación anticipada de firma en el navegador.

### L. Normalización de valores ausentes de extracción

Cuando Gemini devuelve marcadores textuales de ausencia como `""`, `"N/A"` o `"null"`, el backend los normaliza a `null` únicamente si el estado de extracción es `AUSENTE` o `NO_APLICA`.

Los valores inválidos con estado `ENCONTRADO` continúan siendo rechazados para evitar guardar información financiera incorrecta.

Esta regla técnica no está descrita en el CSV.

## Decisiones de flujo que deben conservarse

- Seleccionar archivos no inicia el procesamiento.
- El procesamiento se inicia mediante una acción explícita.
- No se muestra progreso porcentual inventado; mientras el lote trabaja se presenta carga indeterminada.
- Los datos de IA se consideran preliminares hasta la confirmación humana.
- El `medioPago` extraído no se mezcla con el `estadoPago` interno.
- Solo se permite reintentar documentos con estado `ERROR`.
- Los documentos `PROCESANDO` no se pueden eliminar.
- El acceso permanece protegido por la autenticación existente y el aislamiento por empresa.
- El frontend utiliza únicamente la API Express del backend.
- No se realizan llamadas directas desde el frontend a Gemini ni a FastAPI.

## Pendientes o aspectos que no deben confundirse con funcionalidades adicionales

Estos puntos pertenecen al CSV o son verificaciones de calidad, por lo que no deben registrarse como requerimientos nuevos:

- carga PDF y carga múltiple: R.19 y R.28;
- estados del documento: R.21 y R.30;
- visualización del PDF: R.22;
- edición de campos: R.23 y R.24;
- estado de pago y observaciones: R.25 y R.26;
- reintento: R.27;
- procesamiento secuencial: R.29;
- validación de texto PDF: R.31;
- extracción y validación estructurada: R.32 y R.33;
- continuidad del lote y resumen: R.34 y R.35;
- revisión secuencial, confirmación y avance: R.38–R.42;
- mensajes de error de procesamiento: R.43;
- tamaño y cantidad máxima: R.82 y R.87.

## Historial de actualización

| Fecha | Cambio |
|---|---|
| 2026-10-09 | Creación del documento y registro de funcionalidades adicionales ya implementadas. |

## Inventario funcional completo del Módulo 1

Esta sección documenta el comportamiento actualmente implementado en frontend y backend, incluyendo capacidades que forman parte del flujo completo del módulo.

### 1. Frontend: notebooks

- Listado de notebooks del usuario autenticado.
- Indicadores visuales para carga, error, reintento y estado vacío.
- Creación de notebooks desde un formulario modal.
- Edición de nombre, descripción, icono y paleta de colores.
- Selector visual de iconos predefinidos; no es necesario escribir manualmente el icono.
- Selector de color principal y secundario.
- Tarjetas con combinación visual de ambos colores mediante un fondo degradado suave.
- Visualización del icono con el color secundario de la paleta.
- Conteo de documentos por notebook.
- Navegación desde la tarjeta al detalle del notebook.
- Prevención y mensaje amigable para nombres duplicados.

### 2. Frontend: detalle y administración del notebook

- Menú de opciones mediante botón de tres puntos junto al nombre, descripción e icono del notebook.
- Cierre automático del menú al hacer clic fuera de sus opciones.
- Acción para editar la información del notebook.
- Acción para eliminar el notebook mediante SweetAlert2.
- La eliminación permite borrar notebooks que contienen documentos; el backend elimina sus documentos y archivos asociados de forma transaccional.
- Botones del sistema con estados hover visibles, elevación y cambio de color para mejorar la retroalimentación visual.

### 3. Frontend: carga y cola de documentos

- Carga de entre 1 y 10 archivos PDF por lote.
- Selección acumulativa de archivos antes de iniciar el procesamiento.
- Validación anticipada de tipo MIME, tamaño máximo de 15 MB y firma `%PDF`.
- Mensajes por archivo cuando la validación falla.
- La selección de archivos no inicia automáticamente el procesamiento.
- Tabla de archivos seleccionados antes de la carga definitiva, con nombre, tamaño y acción para eliminar individualmente un archivo agregado por error.
- La eliminación de un archivo seleccionado ocurre localmente y evita que ese archivo sea enviado al backend o incorporado al lote.
- Orden visual del detalle del notebook:
  1. Documentos existentes.
  2. Cargar documentos.
  3. Cola de documentos para procesar.
- Múltiples lotes visibles de forma independiente.
- Estado por documento: pendiente, procesando, procesado correctamente, error y confirmado.
- Actualización periódica de la cola mientras existen documentos procesándose.
- Identificación visual del documento que se está procesando y conservación de los demás en pendiente.
- Mensaje de error específico por documento.
- Error mostrado en un recuadro rojo destacado, con hover evidente y explicación legible.
- Reintento disponible únicamente para documentos con error.
- Eliminación individual de documentos de la cola con SweetAlert2.
- Botón para vaciar la cola, eliminando los documentos pendientes o con error después de confirmación.
- La cola no desaparece cuando se eliminan documentos con error si aún existen documentos procesados correctamente pendientes de revisión.
- Botón para revisar todos los documentos procesados correctamente.
- Los documentos con error no habilitan la revisión como si fueran documentos válidos.

### 4. Frontend: documentos existentes

- Tabla ordenada y alineada visualmente con toda la información justificada.
- Columnas de folio, proveedor/emisor, RUT emisor, fecha de emisión, estado del documento, estado de pago y acciones.
- Estado de documento `Pendiente de confirmación` cuando falta confirmar una revisión.
- Estado `Confirmado` después de completar la confirmación.
- Acción para editar documentos procesados o confirmados.
- Al abrir un documento confirmado para editarlo, se reabre como pendiente de confirmación.
- Si el usuario sale sin confirmar los cambios, el documento no se presenta como procesado correctamente; conserva el estado pendiente de confirmación.
- Acción para eliminar documentos existentes con SweetAlert2.
- Los documentos pueden eliminarse incluso si el notebook contiene otros documentos.
- El botón de edición permanece disponible después de procesar y confirmar un documento.

### 5. Frontend: revisión individual y revisión por lote

- Visualizador PDF integrado con zoom, navegación y apertura separada.
- El estado del documento acompaña visualmente al visor durante el scroll mediante un encabezado sticky.
- Revisión individual desde Documentos existentes.
- Landing page de revisión por lote cuando se procesan varios documentos.
- Todos los documentos del lote aparecen en una misma página, separados visualmente.
- Cada documento tiene su propio visor PDF, formulario y estado independiente.
- Tabla superior con nombre, estado y enlace de navegación a cada documento del lote.
- La tabla superior se muestra en la revisión posterior al procesamiento y no en la edición individual.
- La tabla actualiza inmediatamente el estado cuando se confirma un documento.
- Edición de campos extraídos: tipo, folio, fecha, emisor, receptor, condición tributaria, medio de pago, detalles, ajustes, totales y observaciones.
- Estado de pago interno controlado por selección (`PENDIENTE` o `PAGADO`).
- Separación entre el medio de pago extraído y el estado de pago interno.
- En revisión por lote no se muestran botones separados de “Guardar cambios” ni “Guardar y confirmar cambios”.
- El botón “Confirmar documento” guarda y confirma el documento en una sola acción.
- Después de confirmar, el botón queda deshabilitado y cambia a estado visual de documento confirmado.
- Si se modifica cualquier campo de un documento ya confirmado, el botón vuelve a habilitarse para guardar y reconfirmar.
- En edición individual se conserva la acción “Guardar cambios”.
- Cuando todos los documentos del lote quedan confirmados, aparece una acción final para guardar y volver al notebook.
- SweetAlert2 para las acciones destructivas del notebook y los documentos.

### 6. Backend: API HTTP del Módulo 1

Todas las rutas están protegidas por autenticación y validan que el usuario pertenezca a la empresa correspondiente.

| Método | Ruta | Función |
|---|---|---|
| `POST` | `/module1/notebooks` | Crear notebook. |
| `PATCH` | `/module1/notebooks/:idNotebook` | Editar nombre, descripción, icono y paleta. |
| `DELETE` | `/module1/notebooks/:idNotebook` | Eliminar notebook, documentos, lotes y archivos asociados. |
| `GET` | `/module1/notebooks` | Listar notebooks con conteo de documentos. |
| `GET` | `/module1/notebooks/:idNotebook` | Obtener detalle del notebook, lotes y documentos. |
| `POST` | `/module1/notebooks/:idNotebook/documents` | Cargar PDFs y crear un lote. |
| `POST` | `/module1/batches/:idLote/process` | Iniciar procesamiento secuencial del lote. |
| `GET` | `/module1/batches/:idLote` | Consultar estado y errores del lote. |
| `POST` | `/module1/documents/:idDocumento/retry` | Reintentar un documento con error. |
| `GET` | `/module1/documents/:idDocumento` | Obtener detalle, extracción y revisiones del documento. |
| `GET` | `/module1/documents/:idDocumento/pdf` | Entregar el PDF original al visor. |
| `PATCH` | `/module1/documents/:idDocumento/review` | Guardar una revisión en estado `EDITANDO`. |
| `POST` | `/module1/documents/:idDocumento/confirm` | Confirmar la revisión activa y marcar el documento como confirmado. |
| `POST` | `/module1/documents/:idDocumento/reopen` | Reabrir un documento confirmado para editarlo. |
| `DELETE` | `/module1/documents/:idDocumento` | Eliminar un documento y sus datos relacionados. |

### 7. Backend: procesamiento y extracción

- Validación de PDF en backend mediante MIME, tamaño y contenido.
- Validación de que el PDF tenga una capa de texto procesable.
- Procesamiento secuencial de los documentos del lote.
- Estados persistentes de documento y de intento de procesamiento.
- Persistencia de extracción estructurada de encabezado, participantes, detalles, ajustes, totales y medio de pago.
- Persistencia de errores y advertencias de extracción.
- Registro de evidencia, confianza y estado de cada campo extraído.
- Normalización de marcadores de ausencia como cadena vacía, `N/A` y `null` cuando corresponden a estados `AUSENTE` o `NO_APLICA`.
- Rechazo de valores inválidos en campos financieros o porcentajes.
- Clasificación segura de errores del proveedor de IA: solicitud inválida, autenticación, modelo inexistente, límite de tasa y disponibilidad.
- Las respuestas de IA solo se aceptan cuando cumplen completamente el esquema estructurado de extracción: tipo de documento, folio, fecha de emisión, emisor, receptor, condición tributaria, medio de pago, detalles, ajustes globales y totales.
- Si faltan campos obligatorios, existen tipos inválidos o la respuesta no puede interpretarse, el backend la rechaza, registra el detalle de validación en el intento de procesamiento y marca el documento como `ERROR`.
- La interfaz muestra un mensaje específico indicando que la respuesta de IA fue incompleta o inválida y permite reintentar el documento.
- No se exponen al frontend respuestas completas del proveedor de IA ni el contenido sensible del PDF dentro del mensaje de error.
- El procesamiento conserva errores individuales para que un documento fallido no oculte los documentos correctos del mismo lote.

### 8. Backend: revisiones y confirmación

- Cada guardado de revisión crea una revisión nueva en estado `EDITANDO`.
- La revisión conserva los datos extraídos cuando no se reemplazan y permite borrar valores usando `null`.
- La confirmación se ejecuta dentro de una transacción.
- Al confirmar se marca la revisión activa como `CONFIRMADA` y el documento como `CONFIRMADO`.
- Si se edita un documento ya confirmado, la revisión confirmada anterior pasa a estado pendiente antes de confirmar la nueva, evitando conflictos con la restricción única de revisión confirmada por documento.
- La reapertura elimina la marca de confirmación y deja el documento en `PENDIENTE_REVISION`.
- La confirmación y reapertura quedan aisladas por usuario, empresa y documento autorizado.

### 9. Contratos y seguridad

- El frontend valida las respuestas recibidas con esquemas Zod antes de usarlas.
- Los identificadores se validan como UUID antes de construir las solicitudes.
- Los formularios validan límites y formatos antes de enviar datos.
- El frontend se comunica únicamente con la API Express del backend.
- No existen llamadas directas desde el frontend hacia Gemini o FastAPI.
- El backend aplica autorización por usuario y empresa en cada operación.
- Las eliminaciones relacionadas se ejecutan de forma controlada y conservan la integridad de los datos.

### 10. Historial adicional

| Fecha | Cambio |
|---|---|
| 2026-10-09 | Se agregó el inventario completo de funcionalidades de frontend, API, procesamiento, revisión, confirmación y seguridad del Módulo 1. |
