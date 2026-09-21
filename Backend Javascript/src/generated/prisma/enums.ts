
export const RolUsuario = {
  USUARIO: 'USUARIO',
  ADMINISTRADOR: 'ADMINISTRADOR'
} as const

export type RolUsuario = (typeof RolUsuario)[keyof typeof RolUsuario]


export const EstadoUsuario = {
  PENDIENTE: 'PENDIENTE',
  ACTIVO: 'ACTIVO',
  BLOQUEADO: 'BLOQUEADO',
  INACTIVO: 'INACTIVO'
} as const

export type EstadoUsuario = (typeof EstadoUsuario)[keyof typeof EstadoUsuario]


export const EstadoSolicitud = {
  PENDIENTE: 'PENDIENTE',
  APROBADA: 'APROBADA',
  RECHAZADA: 'RECHAZADA'
} as const

export type EstadoSolicitud = (typeof EstadoSolicitud)[keyof typeof EstadoSolicitud]


export const TipoTokenSeguridad = {
  CODIGO_INICIO_SESION: 'CODIGO_INICIO_SESION',
  RECUPERACION_PASSWORD: 'RECUPERACION_PASSWORD',
  VERIFICACION_CORREO: 'VERIFICACION_CORREO'
} as const

export type TipoTokenSeguridad = (typeof TipoTokenSeguridad)[keyof typeof TipoTokenSeguridad]


export const TipoEventoSeguridad = {
  LOGIN_EXITOSO: 'LOGIN_EXITOSO',
  LOGIN_FALLIDO: 'LOGIN_FALLIDO',
  CODIGO_INVALIDO: 'CODIGO_INVALIDO',
  CUENTA_BLOQUEADA: 'CUENTA_BLOQUEADA',
  CAMBIO_PASSWORD: 'CAMBIO_PASSWORD',
  RECUPERACION_SOLICITADA: 'RECUPERACION_SOLICITADA',
  SESION_CERRADA: 'SESION_CERRADA'
} as const

export type TipoEventoSeguridad = (typeof TipoEventoSeguridad)[keyof typeof TipoEventoSeguridad]
