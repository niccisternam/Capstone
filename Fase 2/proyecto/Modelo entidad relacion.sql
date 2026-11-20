// ===== ENUMS =====
Enum rol_usuario {
  USUARIO
  ADMINISTRADOR
}

Enum estado_usuario {
  PENDIENTE
  ACTIVO
  BLOQUEADO
  INACTIVO
}

Enum estado_solicitud {
  PENDIENTE
  APROBADA
  RECHAZADA
}

Enum tipo_token_seguridad {
  CODIGO_INICIO_SESION
  RECUPERACION_PASSWORD
  VERIFICACION_CORREO
}

Enum tipo_evento_seguridad {
  LOGIN_EXITOSO
  LOGIN_FALLIDO
  CODIGO_INVALIDO
  CUENTA_BLOQUEADA
  CAMBIO_PASSWORD
  RECUPERACION_SOLICITADA
  SESION_CERRADA
}

Enum estado_documento {
  PENDIENTE
  PROCESANDO
  PENDIENTE_REVISION
  ERROR
  CONFIRMADO
}

Enum estado_extraccion {
  ENCONTRADO
  AUSENTE
  NO_APLICA
  ILEGIBLE
  INCIERTO
}

Enum condicion_tributaria {
  AFECTA
  EXENTA
  NO_AFECTA
  MIXTA
}

Enum tipo_ajuste {
  DESCUENTO
  RECARGO
}

Enum modalidad_ajuste {
  PORCENTAJE
  MONTO
}

Enum estado_revision {
  PENDIENTE
  EDITANDO
  CONFIRMADA
}

// ===== TABLAS =====
Table empresa {
  id_empresa uuid [pk, default: `gen_random_uuid()`]
  rut_empresa varchar [not null]
  razon_social varchar [not null]
  estado boolean [not null, default: true]
  created_at timestamptz [not null, default: `CURRENT_TIMESTAMP`]
  updated_at timestamptz [not null, default: `CURRENT_TIMESTAMP`]
}

Table usuario {
  id_usuario uuid [pk, default: `gen_random_uuid()`]
  id_empresa uuid [not null]
  rut_usuario varchar [not null]
  nombre varchar [not null]
  apellido varchar [not null]
  correo varchar [not null]
  password_hash text [not null]
  rol rol_usuario [not null, default: 'USUARIO']
  estado estado_usuario [not null, default: 'PENDIENTE']
  debe_cambiar_password boolean [not null, default: true]
  intentos_fallidos integer [not null, default: 0]
  bloqueado_hasta timestamptz
  password_changed_at timestamptz
  correo_verificado_at timestamptz
  created_at timestamptz [not null, default: `CURRENT_TIMESTAMP`]
  updated_at timestamptz [not null, default: `CURRENT_TIMESTAMP`]
}

Table solicitud_cuenta {
  id_solicitud uuid [pk, default: `gen_random_uuid()`]
  rut_empresa varchar [not null]
  rut_usuario varchar [not null]
  nombre varchar [not null]
  apellido varchar [not null]
  correo varchar [not null]
  descripcion text
  estado estado_solicitud [not null, default: 'PENDIENTE']
  revisada_por uuid
  fecha_revision timestamptz
  motivo_rechazo text
  created_at timestamptz [not null, default: `CURRENT_TIMESTAMP`]
  updated_at timestamptz [not null, default: `CURRENT_TIMESTAMP`]
  razon_social varchar
}

Table sesion_usuario {
  id_sesion uuid [pk, default: `gen_random_uuid()`]
  id_usuario uuid [not null]
  token_hash text [not null]
  recordar_sesion boolean [not null, default: false]
  created_at timestamptz [not null, default: `CURRENT_TIMESTAMP`]
  ultima_actividad_at timestamptz [not null, default: `CURRENT_TIMESTAMP`]
  expires_at timestamptz [not null]
  revoked_at timestamptz
}

Table token_seguridad {
  id_token uuid [pk, default: `gen_random_uuid()`]
  id_usuario uuid [not null]
  tipo tipo_token_seguridad [not null]
  token_hash text [not null]
  cantidad_intentos integer [not null, default: 0]
  created_at timestamptz [not null, default: `CURRENT_TIMESTAMP`]
  expires_at timestamptz [not null]
  used_at timestamptz
  revoked_at timestamptz
}

Table evento_seguridad {
  id_evento uuid [pk, default: `gen_random_uuid()`]
  id_usuario uuid
  tipo_evento tipo_evento_seguridad [not null]
  identificador varchar
  exitoso boolean [not null, default: false]
  motivo_fallo text
  direccion_ip_hash text
  user_agent text
  created_at timestamptz [not null, default: `CURRENT_TIMESTAMP`]
}

Table notebook {
  id_notebook uuid [pk, default: `gen_random_uuid()`]
  id_empresa uuid [not null]
  creado_por uuid [not null]
  nombre varchar [not null]
  descripcion text
  icono varchar
  paleta_colores jsonb
  created_at timestamptz [not null, default: `CURRENT_TIMESTAMP`]
  updated_at timestamptz [not null, default: `CURRENT_TIMESTAMP`]

  indexes {
    (id_empresa, id_notebook) [unique]
  }
}

Table lote_procesamiento {
  id_lote uuid [pk, default: `gen_random_uuid()`]
  id_empresa uuid [not null]
  id_notebook uuid [not null]
  creado_por uuid [not null]
  cantidad_documentos integer [not null, default: 0]
  cantidad_procesados integer [not null, default: 0]
  cantidad_errores integer [not null, default: 0]
  created_at timestamptz [not null, default: `CURRENT_TIMESTAMP`]
  procesamiento_inicio timestamptz
  procesamiento_fin timestamptz

  indexes {
    (id_empresa, id_lote) [unique]
  }
}

Table documento {
  id_documento uuid [pk, default: `gen_random_uuid()`]
  id_empresa uuid [not null]
  id_notebook uuid [not null]
  id_lote uuid [not null]
  cargado_por uuid [not null]
  posicion_lote integer [not null]
  estado estado_documento [not null, default: 'PENDIENTE']
  created_at timestamptz [not null, default: `CURRENT_TIMESTAMP`]
  confirmado_at timestamptz
}

Table archivo_pdf {
  id_archivo uuid [pk, default: `gen_random_uuid()`]
  id_documento uuid [not null, unique]
  nombre_original text [not null]
  tipo_mime varchar [not null]
  tamano_bytes bigint [not null]
  hash_archivo varchar
  storage_key text [not null, unique]
  created_at timestamptz [not null, default: `CURRENT_TIMESTAMP`]
}

Table intento_procesamiento {
  id_intento uuid [pk, default: `gen_random_uuid()`]
  id_documento uuid [not null]
  numero_intento integer [not null]
  inicio_at timestamptz [not null, default: `CURRENT_TIMESTAMP`]
  fin_at timestamptz
  validacion_pdf jsonb
  error_codigo varchar
  error_mensaje text
  correlacion varchar

  indexes {
    (id_documento, numero_intento) [unique]
  }
}

Table resultado_extraccion {
  id_resultado uuid [pk, default: `gen_random_uuid()`]
  id_documento uuid [not null]
  id_intento uuid [not null, unique]
  tipo_documento varchar
  tipo_documento_estado estado_extraccion [not null]
  folio varchar
  folio_estado estado_extraccion [not null]
  fecha_emision date
  fecha_emision_estado estado_extraccion [not null]
  emisor_rut varchar
  emisor_rut_estado estado_extraccion [not null]
  emisor_razon_social varchar
  emisor_razon_social_estado estado_extraccion [not null]
  receptor_rut varchar
  receptor_rut_estado estado_extraccion [not null]
  receptor_nombre varchar
  receptor_nombre_estado estado_extraccion [not null]
  condicion_tributaria condicion_tributaria
  condicion_estado estado_extraccion [not null]
  neto numeric
  neto_estado estado_extraccion [not null]
  iva numeric
  iva_estado estado_extraccion [not null]
  exento numeric
  exento_estado estado_extraccion [not null]
  total numeric
  total_estado estado_extraccion [not null]
  medio_pago varchar
  medio_pago_estado estado_extraccion [not null]
  metadata jsonb
  errores jsonb
  advertencias jsonb
}

Table detalle_extraccion {
  id_detalle uuid [pk, default: `gen_random_uuid()`]
  id_resultado uuid [not null]
  numero_linea integer [not null]
  descripcion text
  descripcion_estado estado_extraccion [not null]
  cantidad numeric
  cantidad_estado estado_extraccion [not null]
  unidad varchar
  unidad_estado estado_extraccion [not null]
  precio_unitario numeric
  precio_unitario_estado estado_extraccion [not null]
  descuento_porcentaje numeric
  descuento_porcentaje_estado estado_extraccion [not null]
  descuento_monto numeric
  descuento_monto_estado estado_extraccion [not null]
  recargo_porcentaje numeric
  recargo_porcentaje_estado estado_extraccion [not null]
  recargo_monto numeric
  recargo_monto_estado estado_extraccion [not null]
  total_linea numeric
  total_linea_estado estado_extraccion [not null]
  metadata jsonb

  indexes {
    (id_resultado, numero_linea) [unique]
  }
}

Table ajuste_global_extraccion {
  id_ajuste uuid [pk, default: `gen_random_uuid()`]
  id_resultado uuid [not null]
  numero_ajuste integer [not null]
  tipo tipo_ajuste [not null]
  modalidad modalidad_ajuste [not null]
  valor numeric
  valor_estado estado_extraccion [not null]
  descripcion text
  descripcion_estado estado_extraccion [not null]

  indexes {
    (id_resultado, numero_ajuste) [unique]
  }
}

Table revision_documento {
  id_revision uuid [pk, default: `gen_random_uuid()`]
  id_documento uuid [not null]
  id_resultado uuid [not null]
  revisado_por uuid [not null]
  estado estado_revision [not null, default: 'PENDIENTE']
  estado_pago varchar
  observacion text
  tipo_documento varchar
  folio varchar
  fecha_emision date
  emisor_rut varchar
  emisor_razon_social varchar
  receptor_rut varchar
  receptor_nombre varchar
  condicion_tributaria condicion_tributaria
  neto numeric
  iva numeric
  exento numeric
  total numeric
  medio_pago varchar
  created_at timestamptz [not null, default: `CURRENT_TIMESTAMP`]
  confirmed_at timestamptz
}

Table detalle_revision {
  id_detalle_revision uuid [pk, default: `gen_random_uuid()`]
  id_revision uuid [not null]
  id_detalle_extraccion uuid
  numero_linea integer [not null]
  descripcion text
  cantidad numeric
  unidad varchar
  precio_unitario numeric
  descuento_porcentaje numeric
  descuento_monto numeric
  recargo_porcentaje numeric
  recargo_monto numeric
  total_linea numeric

  indexes {
    (id_revision, numero_linea) [unique]
  }
}

Table ajuste_global_revision {
  id_ajuste_revision uuid [pk, default: `gen_random_uuid()`]
  id_revision uuid [not null]
  numero_ajuste integer [not null]
  tipo tipo_ajuste [not null]
  modalidad modalidad_ajuste [not null]
  valor numeric
  descripcion text

  indexes {
    (id_revision, numero_ajuste) [unique]
  }
}

// ===== RELACIONES =====
Ref: usuario.id_empresa > empresa.id_empresa [update: cascade, delete: restrict]
Ref: solicitud_cuenta.revisada_por > usuario.id_usuario [update: cascade, delete: set null]
Ref: sesion_usuario.id_usuario > usuario.id_usuario [update: cascade, delete: cascade]
Ref: token_seguridad.id_usuario > usuario.id_usuario [update: cascade, delete: cascade]
Ref: evento_seguridad.id_usuario > usuario.id_usuario [update: cascade, delete: set null]
Ref: notebook.id_empresa > empresa.id_empresa [update: cascade, delete: restrict]
Ref: notebook.creado_por > usuario.id_usuario [update: cascade, delete: restrict]
Ref: lote_procesamiento.id_empresa > empresa.id_empresa [update: cascade, delete: restrict]
Ref: lote_procesamiento.creado_por > usuario.id_usuario [update: cascade, delete: restrict]
Ref: lote_procesamiento.(id_empresa, id_notebook) > notebook.(id_empresa, id_notebook) [update: cascade, delete: restrict]
Ref: documento.id_empresa > empresa.id_empresa [update: cascade, delete: restrict]
Ref: documento.cargado_por > usuario.id_usuario [update: cascade, delete: restrict]
Ref: documento.(id_empresa, id_lote) > lote_procesamiento.(id_empresa, id_lote) [update: cascade, delete: restrict]
Ref: documento.(id_empresa, id_notebook) > notebook.(id_empresa, id_notebook) [update: cascade, delete: restrict]
Ref: archivo_pdf.id_documento > documento.id_documento [update: cascade, delete: cascade]
Ref: intento_procesamiento.id_documento > documento.id_documento [update: cascade, delete: cascade]
Ref: resultado_extraccion.id_documento > documento.id_documento [update: cascade, delete: cascade]
Ref: resultado_extraccion.id_intento > intento_procesamiento.id_intento [update: cascade, delete: cascade]
Ref: detalle_extraccion.id_resultado > resultado_extraccion.id_resultado [update: cascade, delete: cascade]
Ref: ajuste_global_extraccion.id_resultado > resultado_extraccion.id_resultado [update: cascade, delete: cascade]
Ref: revision_documento.id_documento > documento.id_documento [update: cascade, delete: cascade]
Ref: revision_documento.id_resultado > resultado_extraccion.id_resultado [update: cascade, delete: restrict]
Ref: revision_documento.revisado_por > usuario.id_usuario [update: cascade, delete: restrict]
Ref: detalle_revision.id_revision > revision_documento.id_revision [update: cascade, delete: cascade]
Ref: detalle_revision.id_detalle_extraccion > detalle_extraccion.id_detalle [update: cascade, delete: set null]
Ref: ajuste_global_revision.id_revision > revision_documento.id_revision [update: cascade, delete: cascade]