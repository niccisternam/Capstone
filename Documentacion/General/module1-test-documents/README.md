# Módulo 1 — Documentos de prueba (fixtures)

Conjunto de **10 PDFs ficticios** para validar el backend del Módulo 1:
validación del PDF → extracción de texto → extracción estructurada → revisión
humana → corrección → confirmación → persistencia.

**Todos los datos son ficticios**: empresas, RUT, folios, nombres, direcciones,
emails y montos no corresponden a documentos tributarios reales ni a personas
reales. No son DTE válidos del SII y no deben usarse como tales.

Estos archivos **no modifican el backend, Prisma, ni agregan dependencias al
proyecto**. Son solo entradas de prueba. La extracción por IA **no está
implementada aquí** ni se asume ningún proveedor (ni Gemini ni otro): el
"resultado esperado" de cada archivo es una **referencia humana** de lo que
debería poder extraerse, no un contrato técnico.

## Cómo usarlos

1. Crea un notebook y carga los documentos en un lote de 1 a 10 (aquí hay 10).
2. Ejecuta el procesamiento secuencial.
3. Compara el estado y los datos extraídos con la tabla de cada documento abajo.
4. Prueba reintentos, revisión, corrección manual y confirmación.

Convenciones usadas en los PDFs:

- Fechas de emisión en formato `DD-MM-AAAA` o `DD/AAAA` según el caso.
- Importes en **CLP** con separador de miles `.` (ej. `827.800`).
- IVA = **19 %** salvo donde se indique lo contrario.
- `N°` aparece como `N` + símbolo de grado (estándar en documentación chilena).
- Los RUT tienen formato `XX.XXX.XXX-D` y el dígito verificador **no** es válido
  (es ficticio a propósito).

## Resumen del lote esperado

| # | Archivo | Resultado esperado |
|---|---|---|
| 1 | `01_factura_completa.pdf` | `PENDIENTE_REVISION` (flujo feliz completo) |
| 2 | `02_boleta.pdf` | `PENDIENTE_REVISION` (estructura distinta, receptor ausente) |
| 3 | `03_campos_ausentes.pdf` | `PENDIENTE_REVISION` con campos `AUSENTE` |
| 4 | `04_multiples_detalles_descuentos.pdf` | `PENDIENTE_REVISION` (array + ajuste global) |
| 5 | `05_recargos.pdf` | `PENDIENTE_REVISION` (recargos % y monto) |
| 6 | `06_datos_ambiguos.pdf` | `PENDIENTE_REVISION` con `INCIERTO`/`ILEGIBLE` (no inventar) |
| 7 | `07_datos_inconsistentes.pdf` | `PENDIENTE_REVISION` **+ advertencia** (no rechazar) |
| 8 | `08_pdf_sin_texto.pdf` | `ERROR` (PDF válido, sin texto procesable; **sin OCR**) |
| 9 | `09_layout_diferente.pdf` | `PENDIENTE_REVISION` (extracción independiente del layout) |
| 10 | `10_revision_humana.pdf` | `PENDIENTE_REVISION` → corrección manual → `CONFIRMADO` |

---

## 1. `01_factura_completa.pdf` — Factura completa y normal

Caso feliz: todos los campos principales presentes y totales coherentes.

| Campo | Valor |
|---|---|
| Tipo de documento | `FACTURA` |
| Folio | `1042` |
| Fecha de emisión | `2026-03-14` (impreso `14-03-2026`) |
| Emisor | Comercial Andes SpA — RUT `76.543.210-K` — Av. Ficticia 1234, Santiago |
| Receptor | Constructora Metiche SpA — RUT `77.888.999-0` |
| Condición tributaria | `AFECTA` |
| Medio de pago | Transferencia electrónica |

Detalles (tabla `Cant. | Unid. | Descripción | Precio unitario | Descuento | Total línea`):

| Cant | Unidad | Descripción | P. unit. | Descuento | Total línea |
|---:|---|---|---:|---:|---:|
| 2 | MES | Arriendo de andamio vertical certificado | 180.000 | — | 360.000 |
| 40 | UND | Cemento Portland saca 50 kg | 5.900 | 5 % | 224.200 |
| 6 | UND | Viga de acero laminado 10 m | 42.000 | monto 8.400 | 243.600 |

Ajustes globales: **ninguno** (los descuentos son por línea).

Totales: **Neto 827.800 · IVA (19 %) 157.282 · Total 985.082**

- **Campos ausentes:** ninguno.
- **Ambigüedades/inconsistencias:** ninguna.
- **Resultado esperado:** `PENDIENTE_REVISION`.
- **Qué comprobar:** flujo exitoso completo; `detalles[]` con 3 líneas; un
  descuento por línea en `%` (5 %) y otro en `monto` (8.400); `totales.neto/iva/total`;
  `condicionTributaria`; `medioPago`. Los totales cuadran exactamente.

---

## 2. `02_boleta.pdf` — Boleta con estructura diferente

Formato tipo comprobante de mostrador (etiquetas punteadas, líneas `2 x 3.500`,
bloque de "EFECTIVO RECIBIDO / CAMBIO"). Comprueba que la extracción no dependa
del layout de factura.

| Campo | Valor |
|---|---|
| Tipo de documento | `BOLETA` |
| Folio | `8815` |
| Fecha de emisión | `2026-03-16` (impreso `16/03/2026`, con hora `15:42:10`) |
| Emisor | Farmacia Andes Salud SpA — RUT `78.444.555-2` — Paseo Ficticio 45, Valparaíso |
| Receptor | **No individualizado**: `Cliente no identificado` / `RUT: S/N` → `AUSENTE`/`NO_APLICA` |
| Condición tributaria | `AFECTA` (implícita en "COMPROBANTE DE VENTA – CONTADO") |
| Medio de pago | Efectivo (impreso `EFECTIVO RECIBIDO` + `CAMBIO 0`) |

Detalles (cada ítem en formato `cant x p.unitario` → monto):

| Cant | Unidad implícita | Descripción | P. unit. | Total |
|---:|---|---|---:|---:|
| 2 | UND | Paracetamol 500 mg x24 comprimidos | 3.500 | 7.000 |
| 1 | UND | Vitamina C efervescente 30 comprimidos | 6.900 | 6.900 |
| 1 | UND | Termómetro digital clínico | 5.200 | 5.200 |
| 1 | UND | Alcohol gel 500 ml | 6.900 | 6.900 |

Ajustes globales: **ninguno**.

Totales: **Neto 26.000 · IVA (19 %) 4.940 · Total 30.940**

- **Campos ausentes:** receptor (nombre/RUT), y unidad como columna explícita.
- **Resultado esperado:** `PENDIENTE_REVISION`.
- **Qué comprobar:** que el parser reconozca tipo `BOLETA`; que extraiga
  `cantidad` y `precioUnitario` del formato `N x P`; que marque `receptor` como
  `AUSENTE`/`NO_APLICA` (no inventar un cliente); derivar `medioPago = EFECTIVO`
  desde "EFECTIVO RECIBIDO".

---

## 3. `03_campos_ausentes.pdf` — Documento con campos ausentes

Factura válida que deliberadamente **no** muestra ciertos datos. El backend debe
procesarla sin asumir que todos los campos existen.

| Campo | Valor |
|---|---|
| Tipo de documento | `FACTURA` |
| Folio | `307` |
| Fecha de emisión | `2026-03-18` (impreso `18-03-2026`) |
| Emisor | Servicios del Valle Ltda. — RUT `77.112.233-4` — Camino Ficticio s/n, Valle de la Niebla |
| Receptor | **Ausente** (`SERVICIO PRESTADO A:` y `RUT Cliente:` en blanco; nota "Cliente no registrado – venta de mostrador") |
| Condición tributaria | **Ausente** (no aparece `AFECTA`/`EXENTO`) |
| IVA | **Ausente** (no hay línea de IVA) |
| Medio de pago | **Ausente** |

Detalles (tabla `Cantidad | Unidad | Detalle del servicio / producto | Importe`):

| Cant | Unidad | Descripción | Importe |
|---:|---|---|---:|
| 1 | MES | Servicio mensual de mantención de áreas verdes | 350.000 |
| 12 | UND | Fertilizante orgánico bolsa 5 kg | 48.000 |

Ajustes globales: **ninguno**.

Totales impresos: **Subtotal/Neto 398.000 · Total 398.000** (sin desglose de IVA).

- **Resultado esperado:** `PENDIENTE_REVISION` **sin error técnico**.
- **Qué comprobar:** que ausencia de campos **no** provoque `ERROR`; que
  `receptor`, `condicionTributaria`, `iva` y `medioPago` queden como `AUSENTE`
  y **no se rellenen con suposiciones** (p. ej. no asumir IVA 19 % ni inventar
  receptor). `total` 398.000 extraíble tal como está impreso.

---

## 4. `04_multiples_detalles_descuentos.pdf` — Múltiples detalles y descuentos

6 líneas con código, cantidades, precios y descuentos por línea (mezcla de `%` y
`monto`), más **un ajuste global** en monto.

| Campo | Valor |
|---|---|
| Tipo de documento | `FACTURA` |
| Folio | `2201` |
| Fecha de emisión | `2026-03-20` (impreso `20-03-2026`) |
| Emisor | Insumos Pacífico SpA — RUT `78.998.877-1` — Ruta Ficticia 21, La Serena |
| Receptor | Agroindustrias Queulen SpA — RUT `72.333.111-5` |
| Condición tributaria | `AFECTA` |
| Referencia | Orden de compra cliente `OC-7719` |
| Medio de pago | Transferencia electrónica |

Detalles (`Código | Descripción | Cant. | Unid. | P. Unit. | Desc. línea | Total línea`):

| Código | Descripción | Cant | Unidad | P. unit. | Desc. línea | Total línea |
|---|---|---:|---|---:|---:|---:|
| SEM-MAI-10 | Semilla de maíz híbrido bolsa 10 kg | 10 | SAK | 45.000 | 10 % | 405.000 |
| FER-NPK-25 | Fertilizante NPK 18-18-18 bolsa 25 kg | 20 | SAK | 22.000 | monto 22.000 | 418.000 |
| MAN-50 | Manguera de riego rollo 50 m | 5 | ROL | 38.000 | — | 190.000 |
| ASP-STD | Aspersor de impacto estándar | 40 | UND | 6.500 | 5 % | 247.000 |
| FIL-MAL | Filtro de malla para riego | 3 | UND | 55.000 | — | 165.000 |
| TEE-PVC | Tee PVC presión 2 pulgadas | 100 | UND | 1.200 | — | 120.000 |

Suma de líneas (6 items): **1.545.000**

Ajustes globales: **1** → `DESCUENTO` / modalidad `MONTO` / valor **45.000** /
"Descuento global por volumen de compra".

Totales: **Neto 1.500.000 · IVA (19 %) 285.000 · Total 1.785.000**
(Neto = suma de líneas 1.545.000 − ajuste global 45.000.)

- **Resultado esperado:** `PENDIENTE_REVISION`.
- **Qué comprobar:** `detalles[]` con **6** elementos; que los descuentos por
  línea se capturen **separados** de los ajustes globales (dos líneas con `%`,
  una con `monto`); `ajustesGlobales[]` con 1 `DESCUENTE` en monto; coherencia
  `1.545.000 − 45.000 = 1.500.000` → IVA 285.000 → Total 1.785.000.

---

## 5. `05_recargos.pdf` — Documento con recargos

Prueba el tipo `RECARGO` en tres variantes: por línea en `%`, por línea en
`monto`, y global en `%`.

| Campo | Valor |
|---|---|
| Tipo de documento | `FACTURA` |
| Folio | `991` |
| Fecha de emisión | `2026-03-21` (impreso `21-03-2026`) |
| Emisor | Transporte Austral SpA — RUT `79.123.456-7` — Av. Ficticia del Sur 500, Puerto Montt |
| Receptor | Comercial Río Blanco Ltda. — RUT `76.222.333-8` |
| Condición tributaria | `AFECTA` |
| Medio de pago | Cheque |

Detalles (`Cant. | Unid. | Descripción | P. Unit. | Recargo línea | Total línea`):

| Cant | Unidad | Descripción | P. unit. | Recargo línea | Total línea |
|---:|---|---|---:|---:|---:|
| 1 | VIAJE | Flete Santiago – Valdivia | 180.000 | 10 % (18.000) | 198.000 |
| 1 | SERV | Seguro de carga nacional | 25.000 | — | 25.000 |
| 8 | HORA | Estiba y bodeguaje | 14.000 | monto 9.000 | 121.000 |

Subtotal servicios (incluye recargos por línea): **344.000**

Ajustes globales: **1** → `RECARGO` / modalidad `PORCENTAJE` / valor **5 %** /
"Recargo global por combustible (TCM)" = **17.200**.

Totales: **Neto 361.200 · IVA (19 %) 68.628 · Total 429.828**
(Neto = 344.000 + 17.200.)

- **Resultado esperado:** `PENDIENTE_REVISION`.
- **Qué comprobar:** recargos como `RECARGO` (no como descuento), con
  `recargoPorcentaje`/`recargoMonto` por línea y un `ajusteGlobal` `RECARGO` al
  5 %; que se sumen correctamente a la base imponible antes del IVA.

---

## 6. `06_datos_ambiguos.pdf` — Datos ambiguos / difíciles de interpretar

Documento deliberadamente confuso pero con texto real. Sirve para verificar que
el sistema use estados `INCIERTO`, `ILEGIBLE` o `AUSENTE` **en lugar de inventar**.

Qué hay en el PDF y por qué es ambiguo:

| Aspecto | Lo que aparece | Problema |
|---|---|---|
| Tipo | Título "RECIBO TRIBUTARIO AFECTO" y cabecera "CEE N° 3A-0071" | No dice `FACTURA`/`BOLETA` explícitamente → tipo `INCIERTO` |
| Folio | `3A-0071` (letras + guion) **y** además "ref. orden interna 55 / lote 2" | Dos candidatos a identificador → folio `INCIERTO` |
| Fecha | Solo "VIGENCIA: 04/2026 – emitido en el mes en curso" | Sin día exacto → `fechaEmision` `INCIERTO`/`AUSENTE` |
| Emisor | "COML. A. SpA" (razón abreviada) con **dos** RUT: `76.33?.441-?` y `76.333.441-K` (matriz vs sucursal) | Uno está **ilegible** (`?`) y hay ambigüedad de cuál es el emisor → `ILEGIBLE`/`INCIERTO` |
| Receptor | Etiquetado como "CONSIGNATARIO: CONSTR. M SpA", sin RUT | Receptor con nombre ambiguo, RUT `AUSENTE` |
| Condición | Título dice "AFECTO", pero el detalle dice "CARGO IMPUESTO INCL.**?**" | Condición `INCIERTO` |
| Detalle | "SERV. VARIOS – VER ANEXO EN OFICINA", cantidad `s/f`, un solo monto `320.000` | `cantidad`/`unidad`/`precioUnitario` `AUSENTE`; solo hay total de línea |
| Totales | "BASE 320.000" / "60.800" / "A PAGAR 380.800" | El `60.800` no está etiquetado como IVA → `iva` `INCIERTO` (aunque 320.000+60.800 = 380.800) |
| Medio de pago | "Cred. 30 días – sin derecho a reclamo" | Abreviatura ambigua ("¿crédito?" "¿acreditado?") → `INCIERTO` |

Totales **internamente coherentes**: 320.000 + 60.800 = 380.800.

- **Resultado esperado:** `PENDIENTE_REVISION` con **baja confianza** y varios
  campos marcados `INCIERTO`/`ILEGIBLE`/`AUSENTE`.
- **Qué comprobar:** que **no se inventen** folio, fecha exacta, RUT completo ni
  condición; que un valor ilegible se marque `ILEGIBLE` y no se "adivine"; que
  la ausencia de día en la fecha no se rellene arbitrariamente. Es el mejor caso
  para revisar que la validación de la respuesta de IA tolera incertidumbre.

---

## 7. `07_datos_inconsistentes.pdf` — Información inconsistente (advertencia)

Factura bien formada **pero** el neto impreso no coincide con la suma de las
líneas. No es un error técnico: debe generar una **advertencia** para revisión
humana, **no** rechazar el documento.

| Campo | Valor |
|---|---|
| Tipo de documento | `FACTURA` |
| Folio | `5150` |
| Fecha de emisión | `2026-03-23` (impreso `23-03-2026`) |
| Emisor | Constructora Llumaga SpA — RUT `77.246.810-9` — Pasaje Ficticio 88, Rancagua |
| Receptor | Comercial Andes SpA — RUT `76.543.210-K` |
| Condición tributaria | `AFECTA` |
| Medio de pago | Transferencia electrónica |

Detalles (`Cant. | Unid. | Descripción | P. Unit. | Total línea`):

| Cant | Unidad | Descripción | P. unit. | Total línea |
|---:|---|---|---:|---:|
| 10 | SVC | Retiro de escombros contenedor 12 m³ | 20.000 | 200.000 |
| 5 | DIA | Supervisión de obra en terreno | 30.000 | 150.000 |
| 2 | DIA | Alquiler de hormigonera industrial | 70.000 | 140.000 |

**Inconsistencia introducida:**

- Suma real de líneas = **490.000**
- Neto **impreso** = **500.000** → **diferencia de 10.000** (el documento añade
  una nota: *"Incluye cargo de movilización y gastos operativos no detallados en
  las líneas (10.000)"*, que explica el porqué pero no aparece como línea).
- IVA impreso 95.000 = 19 % de 500.000 (coherente con el neto impreso).
- Total impreso 595.000 = 500.000 + 95.000 (coherente con el neto impreso).

Es decir, los **totales internos cuadran entre sí**, pero **no cuadran con las
líneas** → inconsistencia de detalle vs. neto.

- **Resultado esperado:** `PENDIENTE_REVISION` **+ advertencia** de inconsistencia
  (`sumas de líneas ≠ neto`). **Nunca** `ERROR`.
- **Qué comprobar:** que la verificación de totales produzca una **warning**
  visible en revisión y no bloquee ni descarte el documento; que el sistema
  muestre ambos valores (490.000 de líneas vs 500.000 impreso) para que el
  humano decida.

---

## 8. `08_pdf_sin_texto.pdf` — PDF válido pero sin texto procesable

Un PDF **válido** que visualmente es una factura, pero cuyo contenido es una
**imagen JPEG a página completa** (texto rasterizado). **No tiene texto
seleccionable.** Está diseñado para disparar la rama:

```
PDF válido → extracción de texto → no existe texto procesable → ERROR
```

Contenido **visual** (lo que un humano ve, pero que **no** es extraíble):
Almacén Don Robinson SpA — RUT `76.900.100-2`; FACTURA N° `778`; fecha
`26-03-2026`; receptor Comercial Andes SpA `76.543.210-K`; condición `AFECTA`;
forma de pago Contado; 1 línea "Canasta familiar temporada", 6 UND, neto
180.000, IVA 19 % 34.200, **total 214.200**. (Este detalle es solo para que
**tú** sepas qué contiene; **el backend no debe poder leerlo** sin OCR.)

- **Resultado esperado:** `ERROR` en la etapa de validación de texto.
- **Qué comprobar:** que el pipeline **no** falle de forma inesperada sino que
  marque `ERROR` con mensaje comprensible; que **no se intente OCR**; que el
  resto del lote siga procesándose; que el documento pueda **reintentarse**
  (y siga dando `ERROR`, porque sin OCR no hay texto). El reintento debe ser
  posible según la regla "solo documentos en `ERROR` se reintentan".

---

## 9. `09_layout_diferente.pdf` — Formato muy diferente

Misma **clase** de información que una factura, pero con distribución visual
deliberadamente distinta: franja lateral **vertical rotada**, encabezado
alineado a la **derecha**, metadatos en **orden invertido**, tabla con las
**columnas en otro orden** y **totales en un recuadro a la izquierda**.

| Campo | Valor (dónde está en el PDF) |
|---|---|
| Tipo de documento | `FACTURA` (en la franja lateral vertical, N° `45017`) |
| Folio | `45017` |
| Fecha de emisión | `2026-03-25` (impreso `25/03/2026`, listado bajo "Fecha emisión") |
| Emisor | TecnoSur Servicios Ltda. — RUT `80.345.678-9` — Calle Ficticia 1200, Temuco (etiquetado también como "Proveedor") |
| Receptor | Comercial Andes SpA — RUT `76.543.210-K` (etiquetado como "**Cliente / Adquirente**") |
| Condición tributaria | `AFECTA` |
| Medio de pago | Tarjeta de crédito (aparece **primero**, antes de condición y fecha) |
| Vencimiento | `2026-04-25` (impreso `25-04-2026`) |

Detalles (orden de columnas: `Descripción | Unidad | Cantidad | Valor unitario | Monto`):

| Descripción | Unidad | Cant | Valor unit. | Monto |
|---|---|---:|---:|---:|
| Licencia ERP módulo contable | MES | 3 | 99.000 | 297.000 |
| Soporte remoto especializado | HORA | 12 | 18.000 | 216.000 |
| Instalación y migración de datos | SERV | 1 | 150.000 | 150.000 |

Ajustes globales: **ninguno**.

Totales (en recuadro a la **izquierda**): **NETO 663.000 · IVA 19 % 125.970 ·
TOTAL A PAGAR 788.970**. Además, abajo a la derecha: "Son: 788.970 pesos
chilenos".

- **Resultado esperado:** `PENDIENTE_REVISION` con todos los campos clave
  correctos **a pesar del layout**.
- **Qué comprobar:** robustez de la extracción frente a orden/columnas/posición
  no estándar: reconocer `FACTURA` en un banner vertical, mapear
  "Cliente / Adquirente" → `receptor` y "Proveedor" → `emisor`, leer totales
  desde un recuadro lateral e identificar `iva`/`neto`/`total` pese al orden
  alterado.

---

## 10. `10_revision_humana.pdf` — Diseñado para prueba de corrección humana

Documento **válido y claro**, pero con datos pensados para que durante la
revisión un humano **edite campos, agregue una observación y registre el estado
de pago manualmente** (el PDF deliberadamente **no** indica si está pagado).

| Campo | Valor |
|---|---|
| Tipo de documento | `FACTURA` |
| Folio | `6620` |
| Fecha de emisión | `2026-03-27` (impreso `27-03-2026`) |
| Emisor | Editorial Surex SpA — RUT `77.666.444-3` — Av. Ficticia de los Libros 310, Chillán |
| Receptor | Instituto Educativo Faro del Sur — RUT `59.101.202-5` |
| Condición tributaria | `AFECTA` |
| Medio de pago | Transferencia electrónica (≠ estado de pago) |
| Solicitante | "Sra. M. Rivas (Compras)" — persona ficticia |
| Referencia | OC-2026-118 |
| Estado de pago | **No indicado en el documento** (a registrar en revisión) |

Detalles (`Cant. | Unid. | Descripción | P. Unit. | Desc. | Total línea`):

| Cant | Unidad | Descripción | P. unit. | Desc. | Total línea |
|---:|---|---|---:|---:|---:|
| 100 | EJ | Libro de contabilidad 2026 formato oficio | 4.500 | — | 450.000 |
| 200 | UND | Cuaderno tapa dura 200 hojas cuadrulado | 1.200 | — | 240.000 |
| 50 | PQT | Paquete separadores plastificados 12 vías | 1.800 | 5 % | 85.500 |

Ajustes globales: **ninguno** (el descuento es por línea).

Totales: **Neto 775.500 · IVA (19 %) 147.345 · Total 922.845**

Datos pensados **para corregir/anotar en revisión** (el PDF es técnicamente
correcto; se editan por criterio del usuario, no por estar mal):

- "Entrega: 15 unidades de muestra a bodega del cliente (ver remito aparte)" →
  buen candidato para una **observación** o para ajustar cantidades.
- "Observaciones del emisor: precios sujetos a lista 2026; reclamos dentro de
  10 días" → texto que el usuario puede mover a notas.
- "Solicitante: Sra. M. Rivas" → campo editable (p. ej. renombrar/completar).
- Estado de pago ausente → **el revisor debe ingresarlo** (no extraído).

- **Resultado esperado:** `PENDIENTE_REVISION` con extracción clara → el usuario
  **modifica un campo**, agrega una **observación**, registra **estado de pago**
  y **confirma** → `CONFIRMADO` → persistencia.
- **Qué comprobar:** el flujo completo de revisión: editar detalle/total,
  agregar `observaciones`, establecer `estadoPago` **sin** confundirlo con
  `medioPago` extraído (Transferencia electrónica ≠ Pagado), confirmar y
  verificar que los datos **confirmados** (corregidos) se persisten y quedan
  separados de la extracción preliminar.

---

## Notas de verificación

Antes de entregar se comprobó, con `pypdf` (herramienta de terceros, ajena al
proyecto):

1. Existen exactamente **10 PDFs**.
2. Los **10 abren** correctamente (1 página cada uno).
3. `08_pdf_sin_texto.pdf` **no** tiene texto seleccionable (0 caracteres) y
   contiene **1 imagen** válida.
4. Los otros **9** tienen texto extraíble (> 200 caracteres sin espacios).
5. Todos están muy por debajo del límite de **15 MB** (los de texto ~2–3 KB; el
   de imagen ~140 KB).
6. Los valores citados en este README aparecen literalmente en el texto
   extraído de cada PDF.

> Recordatorio: son **fixtures**. No incorporan ni asumen ningún proveedor de
> IA. El "resultado esperado" es guía humana, no una salida exacta obligatoria.
