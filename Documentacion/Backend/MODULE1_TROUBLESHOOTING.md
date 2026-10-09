# Módulo 1: errores encontrados y contexto de integración

Documento de contexto para continuar el trabajo del Módulo 1 sin repetir pruebas innecesarias ni consumir solicitudes adicionales de Gemini.

## 1. Error de almacenamiento del PDF

### Síntoma

La carga podía responder con error interno y el archivo no quedaba disponible correctamente.

### Causa

El backend escribía el archivo antes de garantizar que existiera el directorio correspondiente a la clave de almacenamiento.

### Corrección

`module1.service.ts` crea el directorio padre con `mkdir(..., { recursive: true })` antes de escribir el PDF.

## 2. Validación de archivos en frontend y backend

### Síntoma

Un archivo que no era PDF podía aparecer en la selección con un error de tipo no permitido.

### Causa

La validación del navegador no es suficiente por sí sola. El backend también debe validar tipo, extensión, firma PDF, tamaño y cantidad.

### Estado actual

El frontend valida tipo PDF, firma, tamaño máximo de 15 MB y hasta 10 archivos. El backend vuelve a validar el contenido antes de almacenarlo.

## 3. Reemplazo de archivos seleccionados

### Síntoma

Al seleccionar archivos una segunda vez, la nueva selección reemplazaba la anterior.

### Causa

El estado de selección se sobrescribía en lugar de acumular archivos.

### Estado actual

`NotebookDocuments.tsx` acumula las selecciones y evita duplicados por nombre y tamaño. La carga permanece pendiente hasta que el usuario la envía; seleccionar archivos no inicia el procesamiento.

## 4. Documentos existentes mezclados con lotes nuevos

### Síntoma

Después de cargar documentos aparecía una sección de “Documentos existentes” con documentos que pertenecían al lote recién creado.

### Causa

La lista inicial y los documentos de los lotes visibles se mostraban sin filtrar sus identificadores.

### Estado actual

El frontend excluye de “Documentos existentes” los documentos que ya están en un lote visible y los que siguen en estado `PENDIENTE`.

## 5. Errores de procesamiento sin contexto por documento

### Síntoma

Si un archivo fallaba dentro de un lote, el usuario solo veía un mensaje general.

### Causa

El resultado del procesamiento no exponía al frontend el error asociado al documento.

### Estado actual

La respuesta del lote incluye, para documentos en `ERROR`, el código y mensaje seguro del último intento. El frontend muestra el error dentro del espacio del documento afectado.

## 6. Respuesta de Gemini sin `documento`

### Síntoma

`La respuesta de IA no cumple el contrato de extracción. Revisa: documento: Required.`

### Causa

Inicialmente solo se enviaba `responseMimeType: "application/json"`. Eso solicita JSON válido, pero no obliga a respetar la estructura del contrato.

Después se agregó un esquema raíz con `documento`, pero inicialmente se declaró `documento` con `properties: {}`. Gemini podía devolver un objeto `documento` vacío.

### Corrección

El extractor ahora envía `responseSchema` con los campos reales de `documento`, detalles, ajustes, totales, errores y advertencias. Zod continúa siendo la validación final del backend.

## 7. Valores inválidos en descuentos y recargos

### Síntoma

Errores como:

```text
documento.detalles.valor.0.descuentoPorcentaje.valor: Invalid
documento.detalles.valor.0.descuentoMonto.valor: Invalid
documento.detalles.valor.0.recargoPorcentaje.valor: Invalid
```

### Causa

Los campos de extracción permiten `null` cuando no existe un descuento o recargo, pero el esquema estructurado de Gemini declara esos valores como cadenas. El modelo podía devolver `""`, `"N/A"` o `"null"` como texto.

### Corrección

El prompt indica que debe usarse `null` con estado `AUSENTE` o `NO_APLICA`. Antes de validar con Zod, el extractor normaliza únicamente esos marcadores a `null` cuando el estado indica ausencia. Un valor inválido con estado `ENCONTRADO` continúa fallando y no se transforma silenciosamente.

## 8. Diagnóstico de Gemini y consumo de cuota

Cada procesamiento o reintento puede generar una nueva solicitud a Gemini. Para depurar con cuota limitada:

1. No reintentar repetidamente el mismo documento.
2. Revisar primero el código y mensaje guardados en el intento de procesamiento.
3. Confirmar que el backend reiniciado esté usando el `.env` real y no `.env.example`.
4. Verificar que el modelo configurado soporte PDF y salidas estructuradas.
5. No guardar ni imprimir el PDF completo ni la respuesta completa de Gemini en logs.

## 9. Mensaje incorrecto de “servicio temporalmente ocupado”

### Síntoma

El frontend mostraba que el servicio de análisis estaba temporalmente ocupado, aunque el log solo mostraba que el procesamiento terminó con `200`.

### Causa

El extractor convertía cualquier excepción no reconocida en `AI_UNAVAILABLE`. Eso ocultaba diferencias entre cuota agotada, modelo inexistente, permisos inválidos, solicitud rechazada y caída real del servicio.

### Corrección

El backend ahora clasifica los errores de Gemini:

- `400`: solicitud o esquema rechazado (`AI_BAD_REQUEST`);
- `403`: API key o permisos (`AI_AUTHENTICATION`);
- `404`: modelo no disponible (`AI_MODEL_NOT_FOUND`);
- `429`: límite o cuota temporal (`AI_RATE_LIMITED`);
- otros `5xx` o errores de red: indisponibilidad temporal (`AI_UNAVAILABLE`).

El procesamiento por lote puede continuar respondiendo `200` cuando un documento individual falla; el código específico queda asociado al documento y al intento de procesamiento. No se realizan reintentos automáticos para evitar consumo adicional de Gemini.

## 10. Frontend del Módulo 1

### Funcionalidades implementadas

- listado y creación de notebooks;
- protección mediante layout autenticado;
- carga multipart con el campo `documents`;
- acumulación de archivos seleccionados;
- lotes y estados `PENDIENTE`, `PROCESANDO`, `PENDIENTE_REVISION`, `ERROR` y `CONFIRMADO`;
- mensajes de error por documento;
- reintento solo para documentos `ERROR`;
- eliminación de documentos pendientes o con error desde la cola, y eliminación de documentos procesados o confirmados desde Documentos existentes;
- revisión humana completa;
- visualización del PDF original durante la revisión;
- diferenciación entre `medioPago` extraído y `estadoPago` ingresado por el usuario;
- confirmación humana y avance al siguiente documento pendiente.
- revisión por lote en una landing page con un visor PDF independiente por documento;
- reapertura de documentos confirmados mediante `POST /documents/:idDocumento/reopen`;
- edición y eliminación de notebooks con sus documentos asociados;
- eliminación local de archivos seleccionados antes de crear el lote;
- confirmación de documentos con botón bloqueado cuando no existen cambios y habilitado nuevamente al editar un campo.

### Puntos a verificar posteriormente

- confirmar visualmente el visor PDF en el navegador con un documento real;
- probar un documento sin descuentos para validar la normalización a `null`;
- probar un documento con descuentos reales para asegurar que los valores encontrados no se conviertan a `null`;
- verificar que el frontend muestre el mensaje detallado de `AI_INVALID_RESPONSE` por documento;
- evitar reintentos automáticos o múltiples reintentos manuales durante pruebas con cuota limitada;
- ejecutar pruebas end-to-end contra una base de datos de desarrollo autorizada.

## 11. Validaciones ejecutadas

### Frontend

- lint: correcto;
- typecheck: correcto;
- pruebas: 86 correctas en la última ejecución.

### Backend

- lint: correcto;
- typecheck: correcto.

Las pruebas del backend quedaron bloqueadas en Windows por `EPERM` de Vite al resolver rutas con `realpath`. Ese fallo ocurre durante la carga de suites y no llega a ejecutar los tests del Módulo 1.
