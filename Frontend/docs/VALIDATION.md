# Validación

## Uso de Zod

Definir esquemas cerca de cada feature en `src/features/<dominio>/schemas`, y moverlos a `src/lib/validation` solo si son genuinamente transversales. Inferir tipos con `z.infer` para evitar duplicación.

Validar cuando corresponda:

- datos de formularios antes de enviar;
- parámetros de URL y filtros;
- payloads enviados a Express;
- respuestas externas en fronteras críticas o inestables;
- configuración pública necesaria al iniciar.

Los esquemas deben reflejar el contrato real. No añadir restricciones tributarias, formatos, longitudes o campos requeridos sin respaldo documental. La validación del cliente no reemplaza la validación ni autorización de Express.

## Mensajes

Presentar errores cerca del campo, asociarlos mediante atributos accesibles y conservar los datos no sensibles del formulario. Separar errores de campo, errores generales y fallos de red. Los mensajes internos o trazas del backend no se muestran directamente.

## Archivos

Para cargas, validar solo límites confirmados: tipo MIME, extensión, tamaño y cantidad. La validación cliente es orientativa; Express vuelve a validar todo.
