
import * as process from 'node:process'
import * as path from 'node:path'

import * as runtime from "@prisma/client/runtime/client"
import * as $Enums from "./enums.js"
import * as $Class from "./internal/class.js"
import * as Prisma from "./internal/prismaNamespace.js"

export * as $Enums from './enums.js'
export * from "./enums.js"

export const PrismaClient = $Class.getPrismaClientClass()
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>
export { Prisma }

export type Empresa = Prisma.EmpresaModel

export type Usuario = Prisma.UsuarioModel

export type SolicitudCuenta = Prisma.SolicitudCuentaModel

export type SesionUsuario = Prisma.SesionUsuarioModel

export type TokenSeguridad = Prisma.TokenSeguridadModel

export type EventoSeguridad = Prisma.EventoSeguridadModel
