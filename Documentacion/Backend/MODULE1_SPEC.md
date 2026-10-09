# Especificación del Módulo 1

## Objetivo del módulo

El Módulo 1 permite organizar documentos tributarios en notebooks, cargar archivos PDF, validarlos, procesarlos secuencialmente mediante un servicio de extracción IA, revisar los resultados, corregirlos y confirmarlos para su persistencia.

La extracción IA es solo una etapa del flujo. El módulo completo incluye:

```text
Notebook → carga → validación → procesamiento → extracción IA
→ revisión humana → corrección → confirmación → persistencia
```

## Requisitos del CSV

El Módulo 1 corresponde a los requisitos funcionales R19–R43 y a los no funcionales R82–R87.

### Requisitos funcionales

- Cargar documentos PDF dentro de un notebook.
- Eliminar documentos antes del procesamiento.
- Mostrar el estado de cada documento.
- Visualizar el PDF original.
- Mostrar los datos extraídos.
- Editar manualmente los datos.
- Registrar manualmente el estado de pago.
- Agregar notas u observaciones.
- Reintentar únicamente documentos con error.
- Cargar entre 1 y 10 documentos por operación.
- Procesar documentos secuencialmente y respetar su orden.
- Utilizar los estados `Pendiente`, `Procesando`, `Pendiente_Revision`, `Error` y `Confirmado`.
- Validar que el PDF contenga texto procesable.
- Extraer datos estructurados mediante IA.
- Validar la respuesta de IA.
- Continuar el lote cuando un documento falle.
- Mostrar un resumen del procesamiento.
- Crear notebooks con nombre, descripción, icono y paleta de colores.
- Asociar cada documento al notebook utilizado.
- Revisar los documentos procesados secuencialmente.
- Mostrar el PDF y los campos extraídos durante la revisión.
- Confirmar individualmente cada documento.
- Avanzar al siguiente documento pendiente.
- Exigir revisión y aprobación antes de confirmar.
- Mostrar mensajes comprensibles ante errores.

### Requisitos no funcionales

- Máximo 15 MB por PDF.
- Tiempo objetivo de extracción inferior a 20 segundos en condiciones normales.
- Precisión objetivo superior al 90% en campos clave y documentos legibles estandarizados.
- Retroalimentación visual inferior a 1 segundo.
- Almacenamiento seguro de los PDF confirmados.
- Lotes de entre 1 y 10 documentos.

## Flujo funcional aprobado

1. El usuario autenticado ingresa al módulo de notebooks.
2. Crea un notebook o selecciona uno existente.
3. Al crear un notebook se validan nombre, descripción, icono y colores.
4. El nombre debe ser único dentro de la empresa, ignorando mayúsculas y minúsculas.
5. El usuario decide si desea agregar documentos.
6. Carga entre 1 y 10 archivos PDF.
7. El sistema valida formato, tamaño y cantidad.
8. Cada documento queda asociado al notebook y a un lote.
9. Se valida si el PDF contiene texto procesable.
10. Los documentos se procesan uno por uno, respetando el orden del lote.
11. El texto procesable se envía al servicio abstracto de extracción IA.
12. La respuesta estructurada se valida antes de presentarla.
13. Los resultados válidos quedan pendientes de revisión.
14. Los errores se registran y no detienen los documentos restantes.
15. El usuario puede reintentar únicamente los documentos con error.
16. Si no desea reintentar un documento con error, puede eliminarlo según el flujo aprobado.
17. El usuario revisa el PDF y los datos extraídos.
18. Puede corregir cualquiera de los campos extraídos, incluidos encabezado, detalles, ajustes globales y totales, además de registrar estado de pago u observaciones.
19. Confirma individualmente el documento.
20. El sistema muestra el siguiente documento pendiente.
21. Los datos confirmados quedan persistidos para uso posterior.

## Modelo lógico aprobado

### Entidades principales

- `Usuario`: entidad existente de autenticación.
- `Empresa`: entidad existente utilizada como contexto actual de autorización.
- `Notebook`: espacio lógico de organización.
- `LoteProcesamiento`: agrupación ordenada de documentos cargados en una operación.
- `Documento`: documento tributario procesado.
- `RevisionDocumento`: revisión y confirmación humana.

### Entidades y registros dependientes

- `ArchivoPDF`: archivo original asociado al documento.
- `IntentoProcesamiento`: cada ejecución o reintento.
- `ResultadoExtraccion`: resultado estructurado de IA de un intento.
- `DetalleExtraccion`: líneas de productos o servicios extraídas.
- `AjusteGlobalExtraccion`: descuentos o recargos globales extraídos.
- `DetalleRevision`: valores de líneas corregidos o confirmados.
- `AjusteGlobalRevision`: ajustes globales corregidos o confirmados.

### Relaciones principales

```text
Empresa → Notebook → LoteProcesamiento → Documento
Documento → ArchivoPDF
Documento → IntentoProcesamiento → ResultadoExtraccion
ResultadoExtraccion → DetalleExtraccion
ResultadoExtraccion → AjusteGlobalExtraccion
Documento → RevisionDocumento
RevisionDocumento → DetalleRevision
RevisionDocumento → AjusteGlobalRevision
```

## Modelo físico implementado

El esquema Prisma y la migración contienen las siguientes tablas del Módulo 1:

- `notebook`
- `lote_procesamiento`
- `documento`
- `archivo_pdf`
- `intento_procesamiento`
- `resultado_extraccion`
- `detalle_extraccion`
- `ajuste_global_extraccion`
- `revision_documento`
- `detalle_revision`
- `ajuste_global_revision`

Características principales:

- PostgreSQL mediante Prisma 7.
- Identificadores UUID.
- Importes y cantidades con tipos decimales.
- Enums para estados y tipos controlados.
- Claves foráneas hacia `empresa` y `usuario` existentes.
- Aislamiento relacional por empresa entre notebooks, lotes y documentos.
- Límite de 15 MB y validación de tipo PDF.
- Unicidad de notebook por empresa sin distinguir mayúsculas/minúsculas.
- Posición única de cada documento dentro del lote.
- Intentos numerados por documento.
- Una revisión confirmada como máximo por documento.

La migración creada es:

```text
prisma/migrations/20261008000000_add_module1_document_processing/migration.sql
```

El esquema fue validado y el cliente Prisma fue generado. La migración se considera lista/aplicada según la confirmación del responsable del proyecto; no fue verificada desde este entorno.

## Contrato de extracción IA

El servicio debe producir una respuesta independiente del proveedor con esta información:

```text
DocumentoExtraido
├── tipoDocumento
├── folio
├── fechaEmision
├── emisor
│   ├── rut
│   └── razonSocial
├── receptor
│   ├── rut?
│   └── nombre?
├── condicionTributaria?
├── detalles[]
│   ├── descripcion
│   ├── cantidad?
│   ├── unidad?
│   ├── precioUnitario?
│   ├── descuentoPorcentaje?
│   ├── descuentoMonto?
│   ├── recargoPorcentaje?
│   ├── recargoMonto?
│   └── totalLinea
├── ajustesGlobales[]
│   ├── tipo
│   ├── modalidad
│   ├── valor
│   └── descripcion?
├── totales
│   ├── neto?
│   ├── iva?
│   ├── exento?
│   └── total
└── medioPago?
```

Cada campo extraíble puede tener:

```text
valor
estado
confianza y evidencia opcionales
```

Estados de extracción:

```text
ENCONTRADO
AUSENTE
NO_APLICA
ILEGIBLE
INCIERTO
```

Los montos, cantidades y porcentajes se representan conceptualmente como decimales de precisión exacta. Las fechas utilizan `AAAA-MM-DD` y los RUT se tratan como texto.

La respuesta no incluye correcciones manuales, estado de pago interno, observaciones ni confirmación del usuario.

## Estados y reglas

### Estados del documento

```text
PENDIENTE → PROCESANDO → PENDIENTE_REVISION → CONFIRMADO
                         └→ ERROR → PROCESANDO mediante reintento
```

Reglas:

- El documento inicia en `PENDIENTE`.
- Solo un documento en `ERROR` puede reintentarse.
- El reintento conserva el lote y la posición original.
- Un error no detiene el resto del lote.
- Un PDF sin texto procesable debe quedar en `ERROR`.
- Un resultado de IA no es definitivo hasta la revisión humana.
- Solo una revisión humana puede llevar el documento a `CONFIRMADO`.
- `medioPago` extraído no equivale a `estadoPago` interno.
- Descuentos y recargos por línea se separan de los ajustes globales.
- Las inconsistencias de totales deben advertirse y no rechazarse automáticamente sin revisión.

## Decisiones tomadas

- El módulo se enfoca inicialmente en una sola persona.
- No se implementa colaboración entre múltiples usuarios.
- No se implementa actualmente un flujo multiempresa, aunque se conserva `Empresa` por compatibilidad con autenticación y futura evolución.
- El nombre del notebook es único dentro de la empresa, sin distinguir mayúsculas y minúsculas.
- Los datos extraídos por IA son preliminares.
- La revisión humana es obligatoria.
- Los datos corregidos y confirmados se separan conceptualmente de la extracción preliminar.
- El contrato IA no depende de OpenAI, Gemini, Anthropic ni otro proveedor.
- No se replica todo el estándar SII; solo los campos necesarios para el alcance aprobado.
- Los campos ausentes no implican automáticamente un error.
- Los descuentos y recargos pueden ser por línea o globales.
- El estado de pago es ingresado durante la revisión, no extraído como equivalente al medio de pago.
- El backend Express será el dueño de persistencia, estados y autorización.

## Decisiones descartadas

- No se implementará el módulo posterior de consultas analíticas.
- No se implementará el chatbot ni el dashboard.
- No se implementará ETL.
- No se diseñará una entidad separada para cada estado, acción o etapa del flujo.
- No se agregará una entidad negocio/cliente independiente mientras ese modelo siga en evaluación.
- No se exigirá que todos los campos definidos por el estándar SII aparezcan en cada PDF.
- No se considerará que la ausencia del IVA implica automáticamente un documento inválido.
- No se mezclará el medio de pago extraído con el estado de pago interno.
- No se implementará OCR para PDF compuesto únicamente por imágenes.

## Alcance y estado de implementación

### Completado

* Modelo físico Prisma del Módulo 1.
* Archivo de migración de base de datos creado y reportado como listo/aplicado; verificación desde este entorno pendiente.
* Relaciones y restricciones.
* Validaciones del schema.
* Generación del cliente Prisma.

### Implementado en backend

* Gestión de notebooks.
* Carga multipart de documentos PDF.
* Lotes de 1 a 10 documentos.
* Validación de PDF y extracción de texto.
* Procesamiento secuencial.
* Integración aislada con Google Gemini y adaptador mock.
* Validación de la respuesta estructurada de Gemini.
* Reintentos.
* Revisión humana.
* Corrección manual de todos los campos extraídos, incluidos encabezado, detalles, ajustes globales y totales.
* Confirmación humana.
* Persistencia de datos confirmados.
* Manejo de errores y continuidad del lote.

La migración y el cliente Prisma están implementados; la aplicación contra una base de datos real debe verificarse en el entorno de despliegue. El frontend del Módulo 1 está implementado y consume estos contratos mediante Express.

### Fuera de alcance del Módulo 1

* OCR para documentos PDF compuestos exclusivamente por imágenes.
* Integraciones con SII/DTE o sistemas tributarios externos.
* Integraciones bancarias.
* Chatbot.
* ETL/Data Warehouse.
* Dashboards y analítica.
* Funcionalidades correspondientes a otros módulos.

## Documentos de prueba

Los documentos de prueba del Módulo 1 se encuentran en:

`Documentacion/General/module1-test-documents/`

Contienen 10 PDFs ficticios para probar:

* Procesamiento exitoso.
* Campos ausentes.
* Descuentos y recargos.
* Datos ambiguos.
* Inconsistencias.
* PDF sin texto procesable.
* Diseños y distribuciones diferentes.
* Revisión y corrección humana.

Consultar el `README.md` de dicha carpeta para conocer el propósito y el resultado esperado de cada documento.

## Proveedor de IA: Google Gemini

El proveedor de IA definido para el Módulo 1 es **Google Gemini**.

La implementación debe utilizar la API de Gemini para interpretar el PDF original y realizar la extracción estructurada de información tributaria.

La integración con Gemini debe mantenerse separada de la lógica de negocio, evitando distribuir llamadas directas a la API por múltiples servicios.

Consideraciones:

* Utilizar Google Gemini como proveedor de IA del Módulo 1.
* Obtener la API key y las credenciales mediante variables de entorno.
* No almacenar credenciales directamente en el código ni exponerlas al frontend.
* Validar la respuesta de Gemini contra el contrato de extracción aprobado antes de persistirla como resultado preliminar.
* Si la respuesta es inválida o no utilizable, registrar el error correspondiente y permitir que el lote continúe con los demás documentos.
* Distinguir los errores de comunicación con Gemini de los errores de validación de la respuesta.
* No implementar OCR para documentos PDF compuestos exclusivamente por imágenes.
* Ejecutar la extracción con Gemini únicamente después de validar localmente que el PDF contiene una capa de texto utilizable. El texto extraído localmente no se envía a Gemini; se envía el PDF original.


## Política de uso de Google Gemini durante el desarrollo

El uso de la API de Google Gemini debe estar estrictamente limitado para evitar consumo innecesario de cuota y costos.

### Reglas obligatorias

* **No realizar llamadas reales a Gemini durante la implementación, depuración, ejecución de pruebas automatizadas ni validaciones rutinarias.**
* No ejecutar pruebas de integración que invoquen Gemini de manera real por defecto.
* Utilizar un proveedor simulado (*mock*) para las pruebas automatizadas. El mock debe devolver respuestas controladas que reproduzcan casos exitosos, campos ausentes, respuestas inválidas, errores de comunicación y otros escenarios relevantes.
* No realizar llamadas a Gemini simplemente para comprobar que la API key funciona, validar el formato de una respuesta o verificar cambios en el código.
* No ejecutar pruebas que consuman cuota o puedan generar costos sin autorización explícita del usuario.
* Las pruebas que utilicen Gemini realmente deben ser independientes, estar identificadas claramente y permanecer deshabilitadas por defecto.
* La integración real debe poder activarse explícitamente mediante una configuración de entorno, por ejemplo `GEMINI_LIVE_TESTS=false` por defecto.
* No realizar reintentos automáticos ilimitados ante errores de la API.
* No imprimir ni exponer la API key en logs, respuestas HTTP o reportes de pruebas.

### Estrategia de pruebas

1. **Pruebas unitarias:** usar mocks, sin llamadas a Gemini.
2. **Pruebas de integración del backend:** simular las respuestas de Gemini, sin llamadas externas.
3. **Pruebas manuales con Gemini real:** únicamente cuando el usuario lo autorice expresamente, con una cantidad mínima de solicitudes.

### Criterio de aceptación

La suite de pruebas automatizadas debe poder ejecutarse completamente sin conectarse a Google Gemini y sin consumir cuota de la API.
