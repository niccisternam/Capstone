
import * as runtime from "@prisma/client/runtime/index-browser"

export type * from '../models.js'
export type * from './prismaNamespace.js'

export const Decimal = runtime.Decimal


export const NullTypes = {
  DbNull: runtime.NullTypes.DbNull as (new (secret: never) => typeof runtime.DbNull),
  JsonNull: runtime.NullTypes.JsonNull as (new (secret: never) => typeof runtime.JsonNull),
  AnyNull: runtime.NullTypes.AnyNull as (new (secret: never) => typeof runtime.AnyNull),
}
export const DbNull = runtime.DbNull

export const JsonNull = runtime.JsonNull

export const AnyNull = runtime.AnyNull


export const ModelName = {
  Empresa: 'Empresa',
  Usuario: 'Usuario',
  SolicitudCuenta: 'SolicitudCuenta',
  SesionUsuario: 'SesionUsuario',
  TokenSeguridad: 'TokenSeguridad',
  EventoSeguridad: 'EventoSeguridad'
} as const

export type ModelName = (typeof ModelName)[keyof typeof ModelName]

export const TransactionIsolationLevel = runtime.makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
} as const)

export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


export const EmpresaScalarFieldEnum = {
  idEmpresa: 'idEmpresa',
  rutEmpresa: 'rutEmpresa',
  razonSocial: 'razonSocial',
  estado: 'estado',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
} as const

export type EmpresaScalarFieldEnum = (typeof EmpresaScalarFieldEnum)[keyof typeof EmpresaScalarFieldEnum]


export const UsuarioScalarFieldEnum = {
  idUsuario: 'idUsuario',
  idEmpresa: 'idEmpresa',
  rutUsuario: 'rutUsuario',
  nombre: 'nombre',
  apellido: 'apellido',
  correo: 'correo',
  passwordHash: 'passwordHash',
  rol: 'rol',
  estado: 'estado',
  debeCambiarPassword: 'debeCambiarPassword',
  intentosFallidos: 'intentosFallidos',
  bloqueadoHasta: 'bloqueadoHasta',
  passwordChangedAt: 'passwordChangedAt',
  correoVerificadoAt: 'correoVerificadoAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
} as const

export type UsuarioScalarFieldEnum = (typeof UsuarioScalarFieldEnum)[keyof typeof UsuarioScalarFieldEnum]


export const SolicitudCuentaScalarFieldEnum = {
  idSolicitud: 'idSolicitud',
  rutEmpresa: 'rutEmpresa',
  razonSocial: 'razonSocial',
  rutUsuario: 'rutUsuario',
  nombre: 'nombre',
  apellido: 'apellido',
  correo: 'correo',
  descripcion: 'descripcion',
  estado: 'estado',
  revisadaPorId: 'revisadaPorId',
  fechaRevision: 'fechaRevision',
  motivoRechazo: 'motivoRechazo',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
} as const

export type SolicitudCuentaScalarFieldEnum = (typeof SolicitudCuentaScalarFieldEnum)[keyof typeof SolicitudCuentaScalarFieldEnum]


export const SesionUsuarioScalarFieldEnum = {
  idSesion: 'idSesion',
  idUsuario: 'idUsuario',
  tokenHash: 'tokenHash',
  recordarSesion: 'recordarSesion',
  createdAt: 'createdAt',
  ultimaActividadAt: 'ultimaActividadAt',
  expiresAt: 'expiresAt',
  revokedAt: 'revokedAt'
} as const

export type SesionUsuarioScalarFieldEnum = (typeof SesionUsuarioScalarFieldEnum)[keyof typeof SesionUsuarioScalarFieldEnum]


export const TokenSeguridadScalarFieldEnum = {
  idToken: 'idToken',
  idUsuario: 'idUsuario',
  tipo: 'tipo',
  tokenHash: 'tokenHash',
  cantidadIntentos: 'cantidadIntentos',
  createdAt: 'createdAt',
  expiresAt: 'expiresAt',
  usedAt: 'usedAt',
  revokedAt: 'revokedAt'
} as const

export type TokenSeguridadScalarFieldEnum = (typeof TokenSeguridadScalarFieldEnum)[keyof typeof TokenSeguridadScalarFieldEnum]


export const EventoSeguridadScalarFieldEnum = {
  idEvento: 'idEvento',
  idUsuario: 'idUsuario',
  tipoEvento: 'tipoEvento',
  identificador: 'identificador',
  exitoso: 'exitoso',
  motivoFallo: 'motivoFallo',
  direccionIpHash: 'direccionIpHash',
  userAgent: 'userAgent',
  createdAt: 'createdAt'
} as const

export type EventoSeguridadScalarFieldEnum = (typeof EventoSeguridadScalarFieldEnum)[keyof typeof EventoSeguridadScalarFieldEnum]


export const SortOrder = {
  asc: 'asc',
  desc: 'desc'
} as const

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


export const QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
} as const

export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


export const NullsOrder = {
  first: 'first',
  last: 'last'
} as const

export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]

