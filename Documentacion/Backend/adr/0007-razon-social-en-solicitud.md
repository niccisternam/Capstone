# ADR 0007 — Razón social capturada en la solicitud

## Estado

Aceptado.

## Contexto

`empresa` ya almacenaba `razon_social`, pero el solicitante no informaba el nombre de la empresa. El administrador debía escribirlo durante la aprobación, duplicando información que corresponde al formulario público.

## Decisión

- `POST /api/v1/account-requests` exige `razonSocial` entre 2 y 200 caracteres.
- `solicitud_cuenta` almacena el valor en la columna `razon_social`.
- Al aprobar, el backend copia la razón social de la solicitud a `empresa`.
- `approve` solo necesita `confirmacionSii: true` para solicitudes nuevas.
- La columna permanece nullable únicamente para conservar solicitudes anteriores a esta migración. Esas solicitudes pueden recibir `razonSocial` como compatibilidad durante la aprobación.

## Consecuencias

El frontend público debe agregar el campo “Razón social” y el panel administrativo debe mostrarlo. No debe solicitar nuevamente el nombre de empresa al aprobar una solicitud nueva.
