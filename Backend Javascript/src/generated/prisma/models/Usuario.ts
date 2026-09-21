import type * as runtime from "@prisma/client/runtime/client"
import type * as $Enums from "../enums.js"
import type * as Prisma from "../internal/prismaNamespace.js"

export type UsuarioModel = runtime.Types.Result.DefaultSelection<Prisma.$UsuarioPayload>

export type AggregateUsuario = {
  _count: UsuarioCountAggregateOutputType | null
  _avg: UsuarioAvgAggregateOutputType | null
  _sum: UsuarioSumAggregateOutputType | null
  _min: UsuarioMinAggregateOutputType | null
  _max: UsuarioMaxAggregateOutputType | null
}

export type UsuarioAvgAggregateOutputType = {
  intentosFallidos: number | null
}

export type UsuarioSumAggregateOutputType = {
  intentosFallidos: number | null
}

export type UsuarioMinAggregateOutputType = {
  idUsuario: string | null
  idEmpresa: string | null
  rutUsuario: string | null
  nombre: string | null
  apellido: string | null
  correo: string | null
  passwordHash: string | null
  rol: $Enums.RolUsuario | null
  estado: $Enums.EstadoUsuario | null
  debeCambiarPassword: boolean | null
  intentosFallidos: number | null
  bloqueadoHasta: Date | null
  passwordChangedAt: Date | null
  correoVerificadoAt: Date | null
  createdAt: Date | null
  updatedAt: Date | null
}

export type UsuarioMaxAggregateOutputType = {
  idUsuario: string | null
  idEmpresa: string | null
  rutUsuario: string | null
  nombre: string | null
  apellido: string | null
  correo: string | null
  passwordHash: string | null
  rol: $Enums.RolUsuario | null
  estado: $Enums.EstadoUsuario | null
  debeCambiarPassword: boolean | null
  intentosFallidos: number | null
  bloqueadoHasta: Date | null
  passwordChangedAt: Date | null
  correoVerificadoAt: Date | null
  createdAt: Date | null
  updatedAt: Date | null
}

export type UsuarioCountAggregateOutputType = {
  idUsuario: number
  idEmpresa: number
  rutUsuario: number
  nombre: number
  apellido: number
  correo: number
  passwordHash: number
  rol: number
  estado: number
  debeCambiarPassword: number
  intentosFallidos: number
  bloqueadoHasta: number
  passwordChangedAt: number
  correoVerificadoAt: number
  createdAt: number
  updatedAt: number
  _all: number
}


export type UsuarioAvgAggregateInputType = {
  intentosFallidos?: true
}

export type UsuarioSumAggregateInputType = {
  intentosFallidos?: true
}

export type UsuarioMinAggregateInputType = {
  idUsuario?: true
  idEmpresa?: true
  rutUsuario?: true
  nombre?: true
  apellido?: true
  correo?: true
  passwordHash?: true
  rol?: true
  estado?: true
  debeCambiarPassword?: true
  intentosFallidos?: true
  bloqueadoHasta?: true
  passwordChangedAt?: true
  correoVerificadoAt?: true
  createdAt?: true
  updatedAt?: true
}

export type UsuarioMaxAggregateInputType = {
  idUsuario?: true
  idEmpresa?: true
  rutUsuario?: true
  nombre?: true
  apellido?: true
  correo?: true
  passwordHash?: true
  rol?: true
  estado?: true
  debeCambiarPassword?: true
  intentosFallidos?: true
  bloqueadoHasta?: true
  passwordChangedAt?: true
  correoVerificadoAt?: true
  createdAt?: true
  updatedAt?: true
}

export type UsuarioCountAggregateInputType = {
  idUsuario?: true
  idEmpresa?: true
  rutUsuario?: true
  nombre?: true
  apellido?: true
  correo?: true
  passwordHash?: true
  rol?: true
  estado?: true
  debeCambiarPassword?: true
  intentosFallidos?: true
  bloqueadoHasta?: true
  passwordChangedAt?: true
  correoVerificadoAt?: true
  createdAt?: true
  updatedAt?: true
  _all?: true
}

export type UsuarioAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.UsuarioWhereInput
  orderBy?: Prisma.UsuarioOrderByWithRelationInput | Prisma.UsuarioOrderByWithRelationInput[]
  cursor?: Prisma.UsuarioWhereUniqueInput
  take?: number
  skip?: number
  _count?: true | UsuarioCountAggregateInputType
  _avg?: UsuarioAvgAggregateInputType
  _sum?: UsuarioSumAggregateInputType
  _min?: UsuarioMinAggregateInputType
  _max?: UsuarioMaxAggregateInputType
}

export type GetUsuarioAggregateType<T extends UsuarioAggregateArgs> = {
      [P in keyof T & keyof AggregateUsuario]: P extends '_count' | 'count'
    ? T[P] extends true
      ? number
      : Prisma.GetScalarType<T[P], AggregateUsuario[P]>
    : Prisma.GetScalarType<T[P], AggregateUsuario[P]>
}




export type UsuarioGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.UsuarioWhereInput
  orderBy?: Prisma.UsuarioOrderByWithAggregationInput | Prisma.UsuarioOrderByWithAggregationInput[]
  by: Prisma.UsuarioScalarFieldEnum[] | Prisma.UsuarioScalarFieldEnum
  having?: Prisma.UsuarioScalarWhereWithAggregatesInput
  take?: number
  skip?: number
  _count?: UsuarioCountAggregateInputType | true
  _avg?: UsuarioAvgAggregateInputType
  _sum?: UsuarioSumAggregateInputType
  _min?: UsuarioMinAggregateInputType
  _max?: UsuarioMaxAggregateInputType
}

export type UsuarioGroupByOutputType = {
  idUsuario: string
  idEmpresa: string
  rutUsuario: string
  nombre: string
  apellido: string
  correo: string
  passwordHash: string
  rol: $Enums.RolUsuario
  estado: $Enums.EstadoUsuario
  debeCambiarPassword: boolean
  intentosFallidos: number
  bloqueadoHasta: Date | null
  passwordChangedAt: Date | null
  correoVerificadoAt: Date | null
  createdAt: Date
  updatedAt: Date
  _count: UsuarioCountAggregateOutputType | null
  _avg: UsuarioAvgAggregateOutputType | null
  _sum: UsuarioSumAggregateOutputType | null
  _min: UsuarioMinAggregateOutputType | null
  _max: UsuarioMaxAggregateOutputType | null
}

export type GetUsuarioGroupByPayload<T extends UsuarioGroupByArgs> = Prisma.PrismaPromise<
  Array<
    Prisma.PickEnumerable<UsuarioGroupByOutputType, T['by']> &
      {
        [P in ((keyof T) & (keyof UsuarioGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : Prisma.GetScalarType<T[P], UsuarioGroupByOutputType[P]>
          : Prisma.GetScalarType<T[P], UsuarioGroupByOutputType[P]>
      }
    >
  >



export type UsuarioWhereInput = {
  AND?: Prisma.UsuarioWhereInput | Prisma.UsuarioWhereInput[]
  OR?: Prisma.UsuarioWhereInput[]
  NOT?: Prisma.UsuarioWhereInput | Prisma.UsuarioWhereInput[]
  idUsuario?: Prisma.UuidFilter<"Usuario"> | string
  idEmpresa?: Prisma.UuidFilter<"Usuario"> | string
  rutUsuario?: Prisma.StringFilter<"Usuario"> | string
  nombre?: Prisma.StringFilter<"Usuario"> | string
  apellido?: Prisma.StringFilter<"Usuario"> | string
  correo?: Prisma.StringFilter<"Usuario"> | string
  passwordHash?: Prisma.StringFilter<"Usuario"> | string
  rol?: Prisma.EnumRolUsuarioFilter<"Usuario"> | $Enums.RolUsuario
  estado?: Prisma.EnumEstadoUsuarioFilter<"Usuario"> | $Enums.EstadoUsuario
  debeCambiarPassword?: Prisma.BoolFilter<"Usuario"> | boolean
  intentosFallidos?: Prisma.IntFilter<"Usuario"> | number
  bloqueadoHasta?: Prisma.DateTimeNullableFilter<"Usuario"> | Date | string | null
  passwordChangedAt?: Prisma.DateTimeNullableFilter<"Usuario"> | Date | string | null
  correoVerificadoAt?: Prisma.DateTimeNullableFilter<"Usuario"> | Date | string | null
  createdAt?: Prisma.DateTimeFilter<"Usuario"> | Date | string
  updatedAt?: Prisma.DateTimeFilter<"Usuario"> | Date | string
  empresa?: Prisma.XOR<Prisma.EmpresaScalarRelationFilter, Prisma.EmpresaWhereInput>
  solicitudesRevisadas?: Prisma.SolicitudCuentaListRelationFilter
  sesiones?: Prisma.SesionUsuarioListRelationFilter
  tokensSeguridad?: Prisma.TokenSeguridadListRelationFilter
  eventosSeguridad?: Prisma.EventoSeguridadListRelationFilter
}

export type UsuarioOrderByWithRelationInput = {
  idUsuario?: Prisma.SortOrder
  idEmpresa?: Prisma.SortOrder
  rutUsuario?: Prisma.SortOrder
  nombre?: Prisma.SortOrder
  apellido?: Prisma.SortOrder
  correo?: Prisma.SortOrder
  passwordHash?: Prisma.SortOrder
  rol?: Prisma.SortOrder
  estado?: Prisma.SortOrder
  debeCambiarPassword?: Prisma.SortOrder
  intentosFallidos?: Prisma.SortOrder
  bloqueadoHasta?: Prisma.SortOrderInput | Prisma.SortOrder
  passwordChangedAt?: Prisma.SortOrderInput | Prisma.SortOrder
  correoVerificadoAt?: Prisma.SortOrderInput | Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  updatedAt?: Prisma.SortOrder
  empresa?: Prisma.EmpresaOrderByWithRelationInput
  solicitudesRevisadas?: Prisma.SolicitudCuentaOrderByRelationAggregateInput
  sesiones?: Prisma.SesionUsuarioOrderByRelationAggregateInput
  tokensSeguridad?: Prisma.TokenSeguridadOrderByRelationAggregateInput
  eventosSeguridad?: Prisma.EventoSeguridadOrderByRelationAggregateInput
}

export type UsuarioWhereUniqueInput = Prisma.AtLeast<{
  idUsuario?: string
  idEmpresa?: string
  rutUsuario?: string
  AND?: Prisma.UsuarioWhereInput | Prisma.UsuarioWhereInput[]
  OR?: Prisma.UsuarioWhereInput[]
  NOT?: Prisma.UsuarioWhereInput | Prisma.UsuarioWhereInput[]
  nombre?: Prisma.StringFilter<"Usuario"> | string
  apellido?: Prisma.StringFilter<"Usuario"> | string
  correo?: Prisma.StringFilter<"Usuario"> | string
  passwordHash?: Prisma.StringFilter<"Usuario"> | string
  rol?: Prisma.EnumRolUsuarioFilter<"Usuario"> | $Enums.RolUsuario
  estado?: Prisma.EnumEstadoUsuarioFilter<"Usuario"> | $Enums.EstadoUsuario
  debeCambiarPassword?: Prisma.BoolFilter<"Usuario"> | boolean
  intentosFallidos?: Prisma.IntFilter<"Usuario"> | number
  bloqueadoHasta?: Prisma.DateTimeNullableFilter<"Usuario"> | Date | string | null
  passwordChangedAt?: Prisma.DateTimeNullableFilter<"Usuario"> | Date | string | null
  correoVerificadoAt?: Prisma.DateTimeNullableFilter<"Usuario"> | Date | string | null
  createdAt?: Prisma.DateTimeFilter<"Usuario"> | Date | string
  updatedAt?: Prisma.DateTimeFilter<"Usuario"> | Date | string
  empresa?: Prisma.XOR<Prisma.EmpresaScalarRelationFilter, Prisma.EmpresaWhereInput>
  solicitudesRevisadas?: Prisma.SolicitudCuentaListRelationFilter
  sesiones?: Prisma.SesionUsuarioListRelationFilter
  tokensSeguridad?: Prisma.TokenSeguridadListRelationFilter
  eventosSeguridad?: Prisma.EventoSeguridadListRelationFilter
}, "idUsuario" | "idEmpresa" | "rutUsuario">

export type UsuarioOrderByWithAggregationInput = {
  idUsuario?: Prisma.SortOrder
  idEmpresa?: Prisma.SortOrder
  rutUsuario?: Prisma.SortOrder
  nombre?: Prisma.SortOrder
  apellido?: Prisma.SortOrder
  correo?: Prisma.SortOrder
  passwordHash?: Prisma.SortOrder
  rol?: Prisma.SortOrder
  estado?: Prisma.SortOrder
  debeCambiarPassword?: Prisma.SortOrder
  intentosFallidos?: Prisma.SortOrder
  bloqueadoHasta?: Prisma.SortOrderInput | Prisma.SortOrder
  passwordChangedAt?: Prisma.SortOrderInput | Prisma.SortOrder
  correoVerificadoAt?: Prisma.SortOrderInput | Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  updatedAt?: Prisma.SortOrder
  _count?: Prisma.UsuarioCountOrderByAggregateInput
  _avg?: Prisma.UsuarioAvgOrderByAggregateInput
  _max?: Prisma.UsuarioMaxOrderByAggregateInput
  _min?: Prisma.UsuarioMinOrderByAggregateInput
  _sum?: Prisma.UsuarioSumOrderByAggregateInput
}

export type UsuarioScalarWhereWithAggregatesInput = {
  AND?: Prisma.UsuarioScalarWhereWithAggregatesInput | Prisma.UsuarioScalarWhereWithAggregatesInput[]
  OR?: Prisma.UsuarioScalarWhereWithAggregatesInput[]
  NOT?: Prisma.UsuarioScalarWhereWithAggregatesInput | Prisma.UsuarioScalarWhereWithAggregatesInput[]
  idUsuario?: Prisma.UuidWithAggregatesFilter<"Usuario"> | string
  idEmpresa?: Prisma.UuidWithAggregatesFilter<"Usuario"> | string
  rutUsuario?: Prisma.StringWithAggregatesFilter<"Usuario"> | string
  nombre?: Prisma.StringWithAggregatesFilter<"Usuario"> | string
  apellido?: Prisma.StringWithAggregatesFilter<"Usuario"> | string
  correo?: Prisma.StringWithAggregatesFilter<"Usuario"> | string
  passwordHash?: Prisma.StringWithAggregatesFilter<"Usuario"> | string
  rol?: Prisma.EnumRolUsuarioWithAggregatesFilter<"Usuario"> | $Enums.RolUsuario
  estado?: Prisma.EnumEstadoUsuarioWithAggregatesFilter<"Usuario"> | $Enums.EstadoUsuario
  debeCambiarPassword?: Prisma.BoolWithAggregatesFilter<"Usuario"> | boolean
  intentosFallidos?: Prisma.IntWithAggregatesFilter<"Usuario"> | number
  bloqueadoHasta?: Prisma.DateTimeNullableWithAggregatesFilter<"Usuario"> | Date | string | null
  passwordChangedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Usuario"> | Date | string | null
  correoVerificadoAt?: Prisma.DateTimeNullableWithAggregatesFilter<"Usuario"> | Date | string | null
  createdAt?: Prisma.DateTimeWithAggregatesFilter<"Usuario"> | Date | string
  updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Usuario"> | Date | string
}

export type UsuarioCreateInput = {
  idUsuario?: string
  rutUsuario: string
  nombre: string
  apellido: string
  correo: string
  passwordHash: string
  rol?: $Enums.RolUsuario
  estado?: $Enums.EstadoUsuario
  debeCambiarPassword?: boolean
  intentosFallidos?: number
  bloqueadoHasta?: Date | string | null
  passwordChangedAt?: Date | string | null
  correoVerificadoAt?: Date | string | null
  createdAt?: Date | string
  updatedAt?: Date | string
  empresa: Prisma.EmpresaCreateNestedOneWithoutUsuarioInput
  solicitudesRevisadas?: Prisma.SolicitudCuentaCreateNestedManyWithoutRevisorInput
  sesiones?: Prisma.SesionUsuarioCreateNestedManyWithoutUsuarioInput
  tokensSeguridad?: Prisma.TokenSeguridadCreateNestedManyWithoutUsuarioInput
  eventosSeguridad?: Prisma.EventoSeguridadCreateNestedManyWithoutUsuarioInput
}

export type UsuarioUncheckedCreateInput = {
  idUsuario?: string
  idEmpresa: string
  rutUsuario: string
  nombre: string
  apellido: string
  correo: string
  passwordHash: string
  rol?: $Enums.RolUsuario
  estado?: $Enums.EstadoUsuario
  debeCambiarPassword?: boolean
  intentosFallidos?: number
  bloqueadoHasta?: Date | string | null
  passwordChangedAt?: Date | string | null
  correoVerificadoAt?: Date | string | null
  createdAt?: Date | string
  updatedAt?: Date | string
  solicitudesRevisadas?: Prisma.SolicitudCuentaUncheckedCreateNestedManyWithoutRevisorInput
  sesiones?: Prisma.SesionUsuarioUncheckedCreateNestedManyWithoutUsuarioInput
  tokensSeguridad?: Prisma.TokenSeguridadUncheckedCreateNestedManyWithoutUsuarioInput
  eventosSeguridad?: Prisma.EventoSeguridadUncheckedCreateNestedManyWithoutUsuarioInput
}

export type UsuarioUpdateInput = {
  idUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  rutUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  nombre?: Prisma.StringFieldUpdateOperationsInput | string
  apellido?: Prisma.StringFieldUpdateOperationsInput | string
  correo?: Prisma.StringFieldUpdateOperationsInput | string
  passwordHash?: Prisma.StringFieldUpdateOperationsInput | string
  rol?: Prisma.EnumRolUsuarioFieldUpdateOperationsInput | $Enums.RolUsuario
  estado?: Prisma.EnumEstadoUsuarioFieldUpdateOperationsInput | $Enums.EstadoUsuario
  debeCambiarPassword?: Prisma.BoolFieldUpdateOperationsInput | boolean
  intentosFallidos?: Prisma.IntFieldUpdateOperationsInput | number
  bloqueadoHasta?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  passwordChangedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  correoVerificadoAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  empresa?: Prisma.EmpresaUpdateOneRequiredWithoutUsuarioNestedInput
  solicitudesRevisadas?: Prisma.SolicitudCuentaUpdateManyWithoutRevisorNestedInput
  sesiones?: Prisma.SesionUsuarioUpdateManyWithoutUsuarioNestedInput
  tokensSeguridad?: Prisma.TokenSeguridadUpdateManyWithoutUsuarioNestedInput
  eventosSeguridad?: Prisma.EventoSeguridadUpdateManyWithoutUsuarioNestedInput
}

export type UsuarioUncheckedUpdateInput = {
  idUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  idEmpresa?: Prisma.StringFieldUpdateOperationsInput | string
  rutUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  nombre?: Prisma.StringFieldUpdateOperationsInput | string
  apellido?: Prisma.StringFieldUpdateOperationsInput | string
  correo?: Prisma.StringFieldUpdateOperationsInput | string
  passwordHash?: Prisma.StringFieldUpdateOperationsInput | string
  rol?: Prisma.EnumRolUsuarioFieldUpdateOperationsInput | $Enums.RolUsuario
  estado?: Prisma.EnumEstadoUsuarioFieldUpdateOperationsInput | $Enums.EstadoUsuario
  debeCambiarPassword?: Prisma.BoolFieldUpdateOperationsInput | boolean
  intentosFallidos?: Prisma.IntFieldUpdateOperationsInput | number
  bloqueadoHasta?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  passwordChangedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  correoVerificadoAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  solicitudesRevisadas?: Prisma.SolicitudCuentaUncheckedUpdateManyWithoutRevisorNestedInput
  sesiones?: Prisma.SesionUsuarioUncheckedUpdateManyWithoutUsuarioNestedInput
  tokensSeguridad?: Prisma.TokenSeguridadUncheckedUpdateManyWithoutUsuarioNestedInput
  eventosSeguridad?: Prisma.EventoSeguridadUncheckedUpdateManyWithoutUsuarioNestedInput
}

export type UsuarioCreateManyInput = {
  idUsuario?: string
  idEmpresa: string
  rutUsuario: string
  nombre: string
  apellido: string
  correo: string
  passwordHash: string
  rol?: $Enums.RolUsuario
  estado?: $Enums.EstadoUsuario
  debeCambiarPassword?: boolean
  intentosFallidos?: number
  bloqueadoHasta?: Date | string | null
  passwordChangedAt?: Date | string | null
  correoVerificadoAt?: Date | string | null
  createdAt?: Date | string
  updatedAt?: Date | string
}

export type UsuarioUpdateManyMutationInput = {
  idUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  rutUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  nombre?: Prisma.StringFieldUpdateOperationsInput | string
  apellido?: Prisma.StringFieldUpdateOperationsInput | string
  correo?: Prisma.StringFieldUpdateOperationsInput | string
  passwordHash?: Prisma.StringFieldUpdateOperationsInput | string
  rol?: Prisma.EnumRolUsuarioFieldUpdateOperationsInput | $Enums.RolUsuario
  estado?: Prisma.EnumEstadoUsuarioFieldUpdateOperationsInput | $Enums.EstadoUsuario
  debeCambiarPassword?: Prisma.BoolFieldUpdateOperationsInput | boolean
  intentosFallidos?: Prisma.IntFieldUpdateOperationsInput | number
  bloqueadoHasta?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  passwordChangedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  correoVerificadoAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type UsuarioUncheckedUpdateManyInput = {
  idUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  idEmpresa?: Prisma.StringFieldUpdateOperationsInput | string
  rutUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  nombre?: Prisma.StringFieldUpdateOperationsInput | string
  apellido?: Prisma.StringFieldUpdateOperationsInput | string
  correo?: Prisma.StringFieldUpdateOperationsInput | string
  passwordHash?: Prisma.StringFieldUpdateOperationsInput | string
  rol?: Prisma.EnumRolUsuarioFieldUpdateOperationsInput | $Enums.RolUsuario
  estado?: Prisma.EnumEstadoUsuarioFieldUpdateOperationsInput | $Enums.EstadoUsuario
  debeCambiarPassword?: Prisma.BoolFieldUpdateOperationsInput | boolean
  intentosFallidos?: Prisma.IntFieldUpdateOperationsInput | number
  bloqueadoHasta?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  passwordChangedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  correoVerificadoAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type UsuarioNullableScalarRelationFilter = {
  is?: Prisma.UsuarioWhereInput | null
  isNot?: Prisma.UsuarioWhereInput | null
}

export type UsuarioCountOrderByAggregateInput = {
  idUsuario?: Prisma.SortOrder
  idEmpresa?: Prisma.SortOrder
  rutUsuario?: Prisma.SortOrder
  nombre?: Prisma.SortOrder
  apellido?: Prisma.SortOrder
  correo?: Prisma.SortOrder
  passwordHash?: Prisma.SortOrder
  rol?: Prisma.SortOrder
  estado?: Prisma.SortOrder
  debeCambiarPassword?: Prisma.SortOrder
  intentosFallidos?: Prisma.SortOrder
  bloqueadoHasta?: Prisma.SortOrder
  passwordChangedAt?: Prisma.SortOrder
  correoVerificadoAt?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  updatedAt?: Prisma.SortOrder
}

export type UsuarioAvgOrderByAggregateInput = {
  intentosFallidos?: Prisma.SortOrder
}

export type UsuarioMaxOrderByAggregateInput = {
  idUsuario?: Prisma.SortOrder
  idEmpresa?: Prisma.SortOrder
  rutUsuario?: Prisma.SortOrder
  nombre?: Prisma.SortOrder
  apellido?: Prisma.SortOrder
  correo?: Prisma.SortOrder
  passwordHash?: Prisma.SortOrder
  rol?: Prisma.SortOrder
  estado?: Prisma.SortOrder
  debeCambiarPassword?: Prisma.SortOrder
  intentosFallidos?: Prisma.SortOrder
  bloqueadoHasta?: Prisma.SortOrder
  passwordChangedAt?: Prisma.SortOrder
  correoVerificadoAt?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  updatedAt?: Prisma.SortOrder
}

export type UsuarioMinOrderByAggregateInput = {
  idUsuario?: Prisma.SortOrder
  idEmpresa?: Prisma.SortOrder
  rutUsuario?: Prisma.SortOrder
  nombre?: Prisma.SortOrder
  apellido?: Prisma.SortOrder
  correo?: Prisma.SortOrder
  passwordHash?: Prisma.SortOrder
  rol?: Prisma.SortOrder
  estado?: Prisma.SortOrder
  debeCambiarPassword?: Prisma.SortOrder
  intentosFallidos?: Prisma.SortOrder
  bloqueadoHasta?: Prisma.SortOrder
  passwordChangedAt?: Prisma.SortOrder
  correoVerificadoAt?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  updatedAt?: Prisma.SortOrder
}

export type UsuarioSumOrderByAggregateInput = {
  intentosFallidos?: Prisma.SortOrder
}

export type UsuarioScalarRelationFilter = {
  is?: Prisma.UsuarioWhereInput
  isNot?: Prisma.UsuarioWhereInput
}

export type UsuarioCreateNestedOneWithoutEmpresaInput = {
  create?: Prisma.XOR<Prisma.UsuarioCreateWithoutEmpresaInput, Prisma.UsuarioUncheckedCreateWithoutEmpresaInput>
  connectOrCreate?: Prisma.UsuarioCreateOrConnectWithoutEmpresaInput
  connect?: Prisma.UsuarioWhereUniqueInput
}

export type UsuarioUncheckedCreateNestedOneWithoutEmpresaInput = {
  create?: Prisma.XOR<Prisma.UsuarioCreateWithoutEmpresaInput, Prisma.UsuarioUncheckedCreateWithoutEmpresaInput>
  connectOrCreate?: Prisma.UsuarioCreateOrConnectWithoutEmpresaInput
  connect?: Prisma.UsuarioWhereUniqueInput
}

export type UsuarioUpdateOneWithoutEmpresaNestedInput = {
  create?: Prisma.XOR<Prisma.UsuarioCreateWithoutEmpresaInput, Prisma.UsuarioUncheckedCreateWithoutEmpresaInput>
  connectOrCreate?: Prisma.UsuarioCreateOrConnectWithoutEmpresaInput
  upsert?: Prisma.UsuarioUpsertWithoutEmpresaInput
  disconnect?: Prisma.UsuarioWhereInput | boolean
  delete?: Prisma.UsuarioWhereInput | boolean
  connect?: Prisma.UsuarioWhereUniqueInput
  update?: Prisma.XOR<Prisma.XOR<Prisma.UsuarioUpdateToOneWithWhereWithoutEmpresaInput, Prisma.UsuarioUpdateWithoutEmpresaInput>, Prisma.UsuarioUncheckedUpdateWithoutEmpresaInput>
}

export type UsuarioUncheckedUpdateOneWithoutEmpresaNestedInput = {
  create?: Prisma.XOR<Prisma.UsuarioCreateWithoutEmpresaInput, Prisma.UsuarioUncheckedCreateWithoutEmpresaInput>
  connectOrCreate?: Prisma.UsuarioCreateOrConnectWithoutEmpresaInput
  upsert?: Prisma.UsuarioUpsertWithoutEmpresaInput
  disconnect?: Prisma.UsuarioWhereInput | boolean
  delete?: Prisma.UsuarioWhereInput | boolean
  connect?: Prisma.UsuarioWhereUniqueInput
  update?: Prisma.XOR<Prisma.XOR<Prisma.UsuarioUpdateToOneWithWhereWithoutEmpresaInput, Prisma.UsuarioUpdateWithoutEmpresaInput>, Prisma.UsuarioUncheckedUpdateWithoutEmpresaInput>
}

export type EnumRolUsuarioFieldUpdateOperationsInput = {
  set?: $Enums.RolUsuario
}

export type EnumEstadoUsuarioFieldUpdateOperationsInput = {
  set?: $Enums.EstadoUsuario
}

export type IntFieldUpdateOperationsInput = {
  set?: number
  increment?: number
  decrement?: number
  multiply?: number
  divide?: number
}

export type NullableDateTimeFieldUpdateOperationsInput = {
  set?: Date | string | null
}

export type UsuarioCreateNestedOneWithoutSolicitudesRevisadasInput = {
  create?: Prisma.XOR<Prisma.UsuarioCreateWithoutSolicitudesRevisadasInput, Prisma.UsuarioUncheckedCreateWithoutSolicitudesRevisadasInput>
  connectOrCreate?: Prisma.UsuarioCreateOrConnectWithoutSolicitudesRevisadasInput
  connect?: Prisma.UsuarioWhereUniqueInput
}

export type UsuarioUpdateOneWithoutSolicitudesRevisadasNestedInput = {
  create?: Prisma.XOR<Prisma.UsuarioCreateWithoutSolicitudesRevisadasInput, Prisma.UsuarioUncheckedCreateWithoutSolicitudesRevisadasInput>
  connectOrCreate?: Prisma.UsuarioCreateOrConnectWithoutSolicitudesRevisadasInput
  upsert?: Prisma.UsuarioUpsertWithoutSolicitudesRevisadasInput
  disconnect?: Prisma.UsuarioWhereInput | boolean
  delete?: Prisma.UsuarioWhereInput | boolean
  connect?: Prisma.UsuarioWhereUniqueInput
  update?: Prisma.XOR<Prisma.XOR<Prisma.UsuarioUpdateToOneWithWhereWithoutSolicitudesRevisadasInput, Prisma.UsuarioUpdateWithoutSolicitudesRevisadasInput>, Prisma.UsuarioUncheckedUpdateWithoutSolicitudesRevisadasInput>
}

export type UsuarioCreateNestedOneWithoutSesionesInput = {
  create?: Prisma.XOR<Prisma.UsuarioCreateWithoutSesionesInput, Prisma.UsuarioUncheckedCreateWithoutSesionesInput>
  connectOrCreate?: Prisma.UsuarioCreateOrConnectWithoutSesionesInput
  connect?: Prisma.UsuarioWhereUniqueInput
}

export type UsuarioUpdateOneRequiredWithoutSesionesNestedInput = {
  create?: Prisma.XOR<Prisma.UsuarioCreateWithoutSesionesInput, Prisma.UsuarioUncheckedCreateWithoutSesionesInput>
  connectOrCreate?: Prisma.UsuarioCreateOrConnectWithoutSesionesInput
  upsert?: Prisma.UsuarioUpsertWithoutSesionesInput
  connect?: Prisma.UsuarioWhereUniqueInput
  update?: Prisma.XOR<Prisma.XOR<Prisma.UsuarioUpdateToOneWithWhereWithoutSesionesInput, Prisma.UsuarioUpdateWithoutSesionesInput>, Prisma.UsuarioUncheckedUpdateWithoutSesionesInput>
}

export type UsuarioCreateNestedOneWithoutTokensSeguridadInput = {
  create?: Prisma.XOR<Prisma.UsuarioCreateWithoutTokensSeguridadInput, Prisma.UsuarioUncheckedCreateWithoutTokensSeguridadInput>
  connectOrCreate?: Prisma.UsuarioCreateOrConnectWithoutTokensSeguridadInput
  connect?: Prisma.UsuarioWhereUniqueInput
}

export type UsuarioUpdateOneRequiredWithoutTokensSeguridadNestedInput = {
  create?: Prisma.XOR<Prisma.UsuarioCreateWithoutTokensSeguridadInput, Prisma.UsuarioUncheckedCreateWithoutTokensSeguridadInput>
  connectOrCreate?: Prisma.UsuarioCreateOrConnectWithoutTokensSeguridadInput
  upsert?: Prisma.UsuarioUpsertWithoutTokensSeguridadInput
  connect?: Prisma.UsuarioWhereUniqueInput
  update?: Prisma.XOR<Prisma.XOR<Prisma.UsuarioUpdateToOneWithWhereWithoutTokensSeguridadInput, Prisma.UsuarioUpdateWithoutTokensSeguridadInput>, Prisma.UsuarioUncheckedUpdateWithoutTokensSeguridadInput>
}

export type UsuarioCreateNestedOneWithoutEventosSeguridadInput = {
  create?: Prisma.XOR<Prisma.UsuarioCreateWithoutEventosSeguridadInput, Prisma.UsuarioUncheckedCreateWithoutEventosSeguridadInput>
  connectOrCreate?: Prisma.UsuarioCreateOrConnectWithoutEventosSeguridadInput
  connect?: Prisma.UsuarioWhereUniqueInput
}

export type UsuarioUpdateOneWithoutEventosSeguridadNestedInput = {
  create?: Prisma.XOR<Prisma.UsuarioCreateWithoutEventosSeguridadInput, Prisma.UsuarioUncheckedCreateWithoutEventosSeguridadInput>
  connectOrCreate?: Prisma.UsuarioCreateOrConnectWithoutEventosSeguridadInput
  upsert?: Prisma.UsuarioUpsertWithoutEventosSeguridadInput
  disconnect?: Prisma.UsuarioWhereInput | boolean
  delete?: Prisma.UsuarioWhereInput | boolean
  connect?: Prisma.UsuarioWhereUniqueInput
  update?: Prisma.XOR<Prisma.XOR<Prisma.UsuarioUpdateToOneWithWhereWithoutEventosSeguridadInput, Prisma.UsuarioUpdateWithoutEventosSeguridadInput>, Prisma.UsuarioUncheckedUpdateWithoutEventosSeguridadInput>
}

export type UsuarioCreateWithoutEmpresaInput = {
  idUsuario?: string
  rutUsuario: string
  nombre: string
  apellido: string
  correo: string
  passwordHash: string
  rol?: $Enums.RolUsuario
  estado?: $Enums.EstadoUsuario
  debeCambiarPassword?: boolean
  intentosFallidos?: number
  bloqueadoHasta?: Date | string | null
  passwordChangedAt?: Date | string | null
  correoVerificadoAt?: Date | string | null
  createdAt?: Date | string
  updatedAt?: Date | string
  solicitudesRevisadas?: Prisma.SolicitudCuentaCreateNestedManyWithoutRevisorInput
  sesiones?: Prisma.SesionUsuarioCreateNestedManyWithoutUsuarioInput
  tokensSeguridad?: Prisma.TokenSeguridadCreateNestedManyWithoutUsuarioInput
  eventosSeguridad?: Prisma.EventoSeguridadCreateNestedManyWithoutUsuarioInput
}

export type UsuarioUncheckedCreateWithoutEmpresaInput = {
  idUsuario?: string
  rutUsuario: string
  nombre: string
  apellido: string
  correo: string
  passwordHash: string
  rol?: $Enums.RolUsuario
  estado?: $Enums.EstadoUsuario
  debeCambiarPassword?: boolean
  intentosFallidos?: number
  bloqueadoHasta?: Date | string | null
  passwordChangedAt?: Date | string | null
  correoVerificadoAt?: Date | string | null
  createdAt?: Date | string
  updatedAt?: Date | string
  solicitudesRevisadas?: Prisma.SolicitudCuentaUncheckedCreateNestedManyWithoutRevisorInput
  sesiones?: Prisma.SesionUsuarioUncheckedCreateNestedManyWithoutUsuarioInput
  tokensSeguridad?: Prisma.TokenSeguridadUncheckedCreateNestedManyWithoutUsuarioInput
  eventosSeguridad?: Prisma.EventoSeguridadUncheckedCreateNestedManyWithoutUsuarioInput
}

export type UsuarioCreateOrConnectWithoutEmpresaInput = {
  where: Prisma.UsuarioWhereUniqueInput
  create: Prisma.XOR<Prisma.UsuarioCreateWithoutEmpresaInput, Prisma.UsuarioUncheckedCreateWithoutEmpresaInput>
}

export type UsuarioUpsertWithoutEmpresaInput = {
  update: Prisma.XOR<Prisma.UsuarioUpdateWithoutEmpresaInput, Prisma.UsuarioUncheckedUpdateWithoutEmpresaInput>
  create: Prisma.XOR<Prisma.UsuarioCreateWithoutEmpresaInput, Prisma.UsuarioUncheckedCreateWithoutEmpresaInput>
  where?: Prisma.UsuarioWhereInput
}

export type UsuarioUpdateToOneWithWhereWithoutEmpresaInput = {
  where?: Prisma.UsuarioWhereInput
  data: Prisma.XOR<Prisma.UsuarioUpdateWithoutEmpresaInput, Prisma.UsuarioUncheckedUpdateWithoutEmpresaInput>
}

export type UsuarioUpdateWithoutEmpresaInput = {
  idUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  rutUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  nombre?: Prisma.StringFieldUpdateOperationsInput | string
  apellido?: Prisma.StringFieldUpdateOperationsInput | string
  correo?: Prisma.StringFieldUpdateOperationsInput | string
  passwordHash?: Prisma.StringFieldUpdateOperationsInput | string
  rol?: Prisma.EnumRolUsuarioFieldUpdateOperationsInput | $Enums.RolUsuario
  estado?: Prisma.EnumEstadoUsuarioFieldUpdateOperationsInput | $Enums.EstadoUsuario
  debeCambiarPassword?: Prisma.BoolFieldUpdateOperationsInput | boolean
  intentosFallidos?: Prisma.IntFieldUpdateOperationsInput | number
  bloqueadoHasta?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  passwordChangedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  correoVerificadoAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  solicitudesRevisadas?: Prisma.SolicitudCuentaUpdateManyWithoutRevisorNestedInput
  sesiones?: Prisma.SesionUsuarioUpdateManyWithoutUsuarioNestedInput
  tokensSeguridad?: Prisma.TokenSeguridadUpdateManyWithoutUsuarioNestedInput
  eventosSeguridad?: Prisma.EventoSeguridadUpdateManyWithoutUsuarioNestedInput
}

export type UsuarioUncheckedUpdateWithoutEmpresaInput = {
  idUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  rutUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  nombre?: Prisma.StringFieldUpdateOperationsInput | string
  apellido?: Prisma.StringFieldUpdateOperationsInput | string
  correo?: Prisma.StringFieldUpdateOperationsInput | string
  passwordHash?: Prisma.StringFieldUpdateOperationsInput | string
  rol?: Prisma.EnumRolUsuarioFieldUpdateOperationsInput | $Enums.RolUsuario
  estado?: Prisma.EnumEstadoUsuarioFieldUpdateOperationsInput | $Enums.EstadoUsuario
  debeCambiarPassword?: Prisma.BoolFieldUpdateOperationsInput | boolean
  intentosFallidos?: Prisma.IntFieldUpdateOperationsInput | number
  bloqueadoHasta?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  passwordChangedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  correoVerificadoAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  solicitudesRevisadas?: Prisma.SolicitudCuentaUncheckedUpdateManyWithoutRevisorNestedInput
  sesiones?: Prisma.SesionUsuarioUncheckedUpdateManyWithoutUsuarioNestedInput
  tokensSeguridad?: Prisma.TokenSeguridadUncheckedUpdateManyWithoutUsuarioNestedInput
  eventosSeguridad?: Prisma.EventoSeguridadUncheckedUpdateManyWithoutUsuarioNestedInput
}

export type UsuarioCreateWithoutSolicitudesRevisadasInput = {
  idUsuario?: string
  rutUsuario: string
  nombre: string
  apellido: string
  correo: string
  passwordHash: string
  rol?: $Enums.RolUsuario
  estado?: $Enums.EstadoUsuario
  debeCambiarPassword?: boolean
  intentosFallidos?: number
  bloqueadoHasta?: Date | string | null
  passwordChangedAt?: Date | string | null
  correoVerificadoAt?: Date | string | null
  createdAt?: Date | string
  updatedAt?: Date | string
  empresa: Prisma.EmpresaCreateNestedOneWithoutUsuarioInput
  sesiones?: Prisma.SesionUsuarioCreateNestedManyWithoutUsuarioInput
  tokensSeguridad?: Prisma.TokenSeguridadCreateNestedManyWithoutUsuarioInput
  eventosSeguridad?: Prisma.EventoSeguridadCreateNestedManyWithoutUsuarioInput
}

export type UsuarioUncheckedCreateWithoutSolicitudesRevisadasInput = {
  idUsuario?: string
  idEmpresa: string
  rutUsuario: string
  nombre: string
  apellido: string
  correo: string
  passwordHash: string
  rol?: $Enums.RolUsuario
  estado?: $Enums.EstadoUsuario
  debeCambiarPassword?: boolean
  intentosFallidos?: number
  bloqueadoHasta?: Date | string | null
  passwordChangedAt?: Date | string | null
  correoVerificadoAt?: Date | string | null
  createdAt?: Date | string
  updatedAt?: Date | string
  sesiones?: Prisma.SesionUsuarioUncheckedCreateNestedManyWithoutUsuarioInput
  tokensSeguridad?: Prisma.TokenSeguridadUncheckedCreateNestedManyWithoutUsuarioInput
  eventosSeguridad?: Prisma.EventoSeguridadUncheckedCreateNestedManyWithoutUsuarioInput
}

export type UsuarioCreateOrConnectWithoutSolicitudesRevisadasInput = {
  where: Prisma.UsuarioWhereUniqueInput
  create: Prisma.XOR<Prisma.UsuarioCreateWithoutSolicitudesRevisadasInput, Prisma.UsuarioUncheckedCreateWithoutSolicitudesRevisadasInput>
}

export type UsuarioUpsertWithoutSolicitudesRevisadasInput = {
  update: Prisma.XOR<Prisma.UsuarioUpdateWithoutSolicitudesRevisadasInput, Prisma.UsuarioUncheckedUpdateWithoutSolicitudesRevisadasInput>
  create: Prisma.XOR<Prisma.UsuarioCreateWithoutSolicitudesRevisadasInput, Prisma.UsuarioUncheckedCreateWithoutSolicitudesRevisadasInput>
  where?: Prisma.UsuarioWhereInput
}

export type UsuarioUpdateToOneWithWhereWithoutSolicitudesRevisadasInput = {
  where?: Prisma.UsuarioWhereInput
  data: Prisma.XOR<Prisma.UsuarioUpdateWithoutSolicitudesRevisadasInput, Prisma.UsuarioUncheckedUpdateWithoutSolicitudesRevisadasInput>
}

export type UsuarioUpdateWithoutSolicitudesRevisadasInput = {
  idUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  rutUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  nombre?: Prisma.StringFieldUpdateOperationsInput | string
  apellido?: Prisma.StringFieldUpdateOperationsInput | string
  correo?: Prisma.StringFieldUpdateOperationsInput | string
  passwordHash?: Prisma.StringFieldUpdateOperationsInput | string
  rol?: Prisma.EnumRolUsuarioFieldUpdateOperationsInput | $Enums.RolUsuario
  estado?: Prisma.EnumEstadoUsuarioFieldUpdateOperationsInput | $Enums.EstadoUsuario
  debeCambiarPassword?: Prisma.BoolFieldUpdateOperationsInput | boolean
  intentosFallidos?: Prisma.IntFieldUpdateOperationsInput | number
  bloqueadoHasta?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  passwordChangedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  correoVerificadoAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  empresa?: Prisma.EmpresaUpdateOneRequiredWithoutUsuarioNestedInput
  sesiones?: Prisma.SesionUsuarioUpdateManyWithoutUsuarioNestedInput
  tokensSeguridad?: Prisma.TokenSeguridadUpdateManyWithoutUsuarioNestedInput
  eventosSeguridad?: Prisma.EventoSeguridadUpdateManyWithoutUsuarioNestedInput
}

export type UsuarioUncheckedUpdateWithoutSolicitudesRevisadasInput = {
  idUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  idEmpresa?: Prisma.StringFieldUpdateOperationsInput | string
  rutUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  nombre?: Prisma.StringFieldUpdateOperationsInput | string
  apellido?: Prisma.StringFieldUpdateOperationsInput | string
  correo?: Prisma.StringFieldUpdateOperationsInput | string
  passwordHash?: Prisma.StringFieldUpdateOperationsInput | string
  rol?: Prisma.EnumRolUsuarioFieldUpdateOperationsInput | $Enums.RolUsuario
  estado?: Prisma.EnumEstadoUsuarioFieldUpdateOperationsInput | $Enums.EstadoUsuario
  debeCambiarPassword?: Prisma.BoolFieldUpdateOperationsInput | boolean
  intentosFallidos?: Prisma.IntFieldUpdateOperationsInput | number
  bloqueadoHasta?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  passwordChangedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  correoVerificadoAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  sesiones?: Prisma.SesionUsuarioUncheckedUpdateManyWithoutUsuarioNestedInput
  tokensSeguridad?: Prisma.TokenSeguridadUncheckedUpdateManyWithoutUsuarioNestedInput
  eventosSeguridad?: Prisma.EventoSeguridadUncheckedUpdateManyWithoutUsuarioNestedInput
}

export type UsuarioCreateWithoutSesionesInput = {
  idUsuario?: string
  rutUsuario: string
  nombre: string
  apellido: string
  correo: string
  passwordHash: string
  rol?: $Enums.RolUsuario
  estado?: $Enums.EstadoUsuario
  debeCambiarPassword?: boolean
  intentosFallidos?: number
  bloqueadoHasta?: Date | string | null
  passwordChangedAt?: Date | string | null
  correoVerificadoAt?: Date | string | null
  createdAt?: Date | string
  updatedAt?: Date | string
  empresa: Prisma.EmpresaCreateNestedOneWithoutUsuarioInput
  solicitudesRevisadas?: Prisma.SolicitudCuentaCreateNestedManyWithoutRevisorInput
  tokensSeguridad?: Prisma.TokenSeguridadCreateNestedManyWithoutUsuarioInput
  eventosSeguridad?: Prisma.EventoSeguridadCreateNestedManyWithoutUsuarioInput
}

export type UsuarioUncheckedCreateWithoutSesionesInput = {
  idUsuario?: string
  idEmpresa: string
  rutUsuario: string
  nombre: string
  apellido: string
  correo: string
  passwordHash: string
  rol?: $Enums.RolUsuario
  estado?: $Enums.EstadoUsuario
  debeCambiarPassword?: boolean
  intentosFallidos?: number
  bloqueadoHasta?: Date | string | null
  passwordChangedAt?: Date | string | null
  correoVerificadoAt?: Date | string | null
  createdAt?: Date | string
  updatedAt?: Date | string
  solicitudesRevisadas?: Prisma.SolicitudCuentaUncheckedCreateNestedManyWithoutRevisorInput
  tokensSeguridad?: Prisma.TokenSeguridadUncheckedCreateNestedManyWithoutUsuarioInput
  eventosSeguridad?: Prisma.EventoSeguridadUncheckedCreateNestedManyWithoutUsuarioInput
}

export type UsuarioCreateOrConnectWithoutSesionesInput = {
  where: Prisma.UsuarioWhereUniqueInput
  create: Prisma.XOR<Prisma.UsuarioCreateWithoutSesionesInput, Prisma.UsuarioUncheckedCreateWithoutSesionesInput>
}

export type UsuarioUpsertWithoutSesionesInput = {
  update: Prisma.XOR<Prisma.UsuarioUpdateWithoutSesionesInput, Prisma.UsuarioUncheckedUpdateWithoutSesionesInput>
  create: Prisma.XOR<Prisma.UsuarioCreateWithoutSesionesInput, Prisma.UsuarioUncheckedCreateWithoutSesionesInput>
  where?: Prisma.UsuarioWhereInput
}

export type UsuarioUpdateToOneWithWhereWithoutSesionesInput = {
  where?: Prisma.UsuarioWhereInput
  data: Prisma.XOR<Prisma.UsuarioUpdateWithoutSesionesInput, Prisma.UsuarioUncheckedUpdateWithoutSesionesInput>
}

export type UsuarioUpdateWithoutSesionesInput = {
  idUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  rutUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  nombre?: Prisma.StringFieldUpdateOperationsInput | string
  apellido?: Prisma.StringFieldUpdateOperationsInput | string
  correo?: Prisma.StringFieldUpdateOperationsInput | string
  passwordHash?: Prisma.StringFieldUpdateOperationsInput | string
  rol?: Prisma.EnumRolUsuarioFieldUpdateOperationsInput | $Enums.RolUsuario
  estado?: Prisma.EnumEstadoUsuarioFieldUpdateOperationsInput | $Enums.EstadoUsuario
  debeCambiarPassword?: Prisma.BoolFieldUpdateOperationsInput | boolean
  intentosFallidos?: Prisma.IntFieldUpdateOperationsInput | number
  bloqueadoHasta?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  passwordChangedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  correoVerificadoAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  empresa?: Prisma.EmpresaUpdateOneRequiredWithoutUsuarioNestedInput
  solicitudesRevisadas?: Prisma.SolicitudCuentaUpdateManyWithoutRevisorNestedInput
  tokensSeguridad?: Prisma.TokenSeguridadUpdateManyWithoutUsuarioNestedInput
  eventosSeguridad?: Prisma.EventoSeguridadUpdateManyWithoutUsuarioNestedInput
}

export type UsuarioUncheckedUpdateWithoutSesionesInput = {
  idUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  idEmpresa?: Prisma.StringFieldUpdateOperationsInput | string
  rutUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  nombre?: Prisma.StringFieldUpdateOperationsInput | string
  apellido?: Prisma.StringFieldUpdateOperationsInput | string
  correo?: Prisma.StringFieldUpdateOperationsInput | string
  passwordHash?: Prisma.StringFieldUpdateOperationsInput | string
  rol?: Prisma.EnumRolUsuarioFieldUpdateOperationsInput | $Enums.RolUsuario
  estado?: Prisma.EnumEstadoUsuarioFieldUpdateOperationsInput | $Enums.EstadoUsuario
  debeCambiarPassword?: Prisma.BoolFieldUpdateOperationsInput | boolean
  intentosFallidos?: Prisma.IntFieldUpdateOperationsInput | number
  bloqueadoHasta?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  passwordChangedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  correoVerificadoAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  solicitudesRevisadas?: Prisma.SolicitudCuentaUncheckedUpdateManyWithoutRevisorNestedInput
  tokensSeguridad?: Prisma.TokenSeguridadUncheckedUpdateManyWithoutUsuarioNestedInput
  eventosSeguridad?: Prisma.EventoSeguridadUncheckedUpdateManyWithoutUsuarioNestedInput
}

export type UsuarioCreateWithoutTokensSeguridadInput = {
  idUsuario?: string
  rutUsuario: string
  nombre: string
  apellido: string
  correo: string
  passwordHash: string
  rol?: $Enums.RolUsuario
  estado?: $Enums.EstadoUsuario
  debeCambiarPassword?: boolean
  intentosFallidos?: number
  bloqueadoHasta?: Date | string | null
  passwordChangedAt?: Date | string | null
  correoVerificadoAt?: Date | string | null
  createdAt?: Date | string
  updatedAt?: Date | string
  empresa: Prisma.EmpresaCreateNestedOneWithoutUsuarioInput
  solicitudesRevisadas?: Prisma.SolicitudCuentaCreateNestedManyWithoutRevisorInput
  sesiones?: Prisma.SesionUsuarioCreateNestedManyWithoutUsuarioInput
  eventosSeguridad?: Prisma.EventoSeguridadCreateNestedManyWithoutUsuarioInput
}

export type UsuarioUncheckedCreateWithoutTokensSeguridadInput = {
  idUsuario?: string
  idEmpresa: string
  rutUsuario: string
  nombre: string
  apellido: string
  correo: string
  passwordHash: string
  rol?: $Enums.RolUsuario
  estado?: $Enums.EstadoUsuario
  debeCambiarPassword?: boolean
  intentosFallidos?: number
  bloqueadoHasta?: Date | string | null
  passwordChangedAt?: Date | string | null
  correoVerificadoAt?: Date | string | null
  createdAt?: Date | string
  updatedAt?: Date | string
  solicitudesRevisadas?: Prisma.SolicitudCuentaUncheckedCreateNestedManyWithoutRevisorInput
  sesiones?: Prisma.SesionUsuarioUncheckedCreateNestedManyWithoutUsuarioInput
  eventosSeguridad?: Prisma.EventoSeguridadUncheckedCreateNestedManyWithoutUsuarioInput
}

export type UsuarioCreateOrConnectWithoutTokensSeguridadInput = {
  where: Prisma.UsuarioWhereUniqueInput
  create: Prisma.XOR<Prisma.UsuarioCreateWithoutTokensSeguridadInput, Prisma.UsuarioUncheckedCreateWithoutTokensSeguridadInput>
}

export type UsuarioUpsertWithoutTokensSeguridadInput = {
  update: Prisma.XOR<Prisma.UsuarioUpdateWithoutTokensSeguridadInput, Prisma.UsuarioUncheckedUpdateWithoutTokensSeguridadInput>
  create: Prisma.XOR<Prisma.UsuarioCreateWithoutTokensSeguridadInput, Prisma.UsuarioUncheckedCreateWithoutTokensSeguridadInput>
  where?: Prisma.UsuarioWhereInput
}

export type UsuarioUpdateToOneWithWhereWithoutTokensSeguridadInput = {
  where?: Prisma.UsuarioWhereInput
  data: Prisma.XOR<Prisma.UsuarioUpdateWithoutTokensSeguridadInput, Prisma.UsuarioUncheckedUpdateWithoutTokensSeguridadInput>
}

export type UsuarioUpdateWithoutTokensSeguridadInput = {
  idUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  rutUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  nombre?: Prisma.StringFieldUpdateOperationsInput | string
  apellido?: Prisma.StringFieldUpdateOperationsInput | string
  correo?: Prisma.StringFieldUpdateOperationsInput | string
  passwordHash?: Prisma.StringFieldUpdateOperationsInput | string
  rol?: Prisma.EnumRolUsuarioFieldUpdateOperationsInput | $Enums.RolUsuario
  estado?: Prisma.EnumEstadoUsuarioFieldUpdateOperationsInput | $Enums.EstadoUsuario
  debeCambiarPassword?: Prisma.BoolFieldUpdateOperationsInput | boolean
  intentosFallidos?: Prisma.IntFieldUpdateOperationsInput | number
  bloqueadoHasta?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  passwordChangedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  correoVerificadoAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  empresa?: Prisma.EmpresaUpdateOneRequiredWithoutUsuarioNestedInput
  solicitudesRevisadas?: Prisma.SolicitudCuentaUpdateManyWithoutRevisorNestedInput
  sesiones?: Prisma.SesionUsuarioUpdateManyWithoutUsuarioNestedInput
  eventosSeguridad?: Prisma.EventoSeguridadUpdateManyWithoutUsuarioNestedInput
}

export type UsuarioUncheckedUpdateWithoutTokensSeguridadInput = {
  idUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  idEmpresa?: Prisma.StringFieldUpdateOperationsInput | string
  rutUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  nombre?: Prisma.StringFieldUpdateOperationsInput | string
  apellido?: Prisma.StringFieldUpdateOperationsInput | string
  correo?: Prisma.StringFieldUpdateOperationsInput | string
  passwordHash?: Prisma.StringFieldUpdateOperationsInput | string
  rol?: Prisma.EnumRolUsuarioFieldUpdateOperationsInput | $Enums.RolUsuario
  estado?: Prisma.EnumEstadoUsuarioFieldUpdateOperationsInput | $Enums.EstadoUsuario
  debeCambiarPassword?: Prisma.BoolFieldUpdateOperationsInput | boolean
  intentosFallidos?: Prisma.IntFieldUpdateOperationsInput | number
  bloqueadoHasta?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  passwordChangedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  correoVerificadoAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  solicitudesRevisadas?: Prisma.SolicitudCuentaUncheckedUpdateManyWithoutRevisorNestedInput
  sesiones?: Prisma.SesionUsuarioUncheckedUpdateManyWithoutUsuarioNestedInput
  eventosSeguridad?: Prisma.EventoSeguridadUncheckedUpdateManyWithoutUsuarioNestedInput
}

export type UsuarioCreateWithoutEventosSeguridadInput = {
  idUsuario?: string
  rutUsuario: string
  nombre: string
  apellido: string
  correo: string
  passwordHash: string
  rol?: $Enums.RolUsuario
  estado?: $Enums.EstadoUsuario
  debeCambiarPassword?: boolean
  intentosFallidos?: number
  bloqueadoHasta?: Date | string | null
  passwordChangedAt?: Date | string | null
  correoVerificadoAt?: Date | string | null
  createdAt?: Date | string
  updatedAt?: Date | string
  empresa: Prisma.EmpresaCreateNestedOneWithoutUsuarioInput
  solicitudesRevisadas?: Prisma.SolicitudCuentaCreateNestedManyWithoutRevisorInput
  sesiones?: Prisma.SesionUsuarioCreateNestedManyWithoutUsuarioInput
  tokensSeguridad?: Prisma.TokenSeguridadCreateNestedManyWithoutUsuarioInput
}

export type UsuarioUncheckedCreateWithoutEventosSeguridadInput = {
  idUsuario?: string
  idEmpresa: string
  rutUsuario: string
  nombre: string
  apellido: string
  correo: string
  passwordHash: string
  rol?: $Enums.RolUsuario
  estado?: $Enums.EstadoUsuario
  debeCambiarPassword?: boolean
  intentosFallidos?: number
  bloqueadoHasta?: Date | string | null
  passwordChangedAt?: Date | string | null
  correoVerificadoAt?: Date | string | null
  createdAt?: Date | string
  updatedAt?: Date | string
  solicitudesRevisadas?: Prisma.SolicitudCuentaUncheckedCreateNestedManyWithoutRevisorInput
  sesiones?: Prisma.SesionUsuarioUncheckedCreateNestedManyWithoutUsuarioInput
  tokensSeguridad?: Prisma.TokenSeguridadUncheckedCreateNestedManyWithoutUsuarioInput
}

export type UsuarioCreateOrConnectWithoutEventosSeguridadInput = {
  where: Prisma.UsuarioWhereUniqueInput
  create: Prisma.XOR<Prisma.UsuarioCreateWithoutEventosSeguridadInput, Prisma.UsuarioUncheckedCreateWithoutEventosSeguridadInput>
}

export type UsuarioUpsertWithoutEventosSeguridadInput = {
  update: Prisma.XOR<Prisma.UsuarioUpdateWithoutEventosSeguridadInput, Prisma.UsuarioUncheckedUpdateWithoutEventosSeguridadInput>
  create: Prisma.XOR<Prisma.UsuarioCreateWithoutEventosSeguridadInput, Prisma.UsuarioUncheckedCreateWithoutEventosSeguridadInput>
  where?: Prisma.UsuarioWhereInput
}

export type UsuarioUpdateToOneWithWhereWithoutEventosSeguridadInput = {
  where?: Prisma.UsuarioWhereInput
  data: Prisma.XOR<Prisma.UsuarioUpdateWithoutEventosSeguridadInput, Prisma.UsuarioUncheckedUpdateWithoutEventosSeguridadInput>
}

export type UsuarioUpdateWithoutEventosSeguridadInput = {
  idUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  rutUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  nombre?: Prisma.StringFieldUpdateOperationsInput | string
  apellido?: Prisma.StringFieldUpdateOperationsInput | string
  correo?: Prisma.StringFieldUpdateOperationsInput | string
  passwordHash?: Prisma.StringFieldUpdateOperationsInput | string
  rol?: Prisma.EnumRolUsuarioFieldUpdateOperationsInput | $Enums.RolUsuario
  estado?: Prisma.EnumEstadoUsuarioFieldUpdateOperationsInput | $Enums.EstadoUsuario
  debeCambiarPassword?: Prisma.BoolFieldUpdateOperationsInput | boolean
  intentosFallidos?: Prisma.IntFieldUpdateOperationsInput | number
  bloqueadoHasta?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  passwordChangedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  correoVerificadoAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  empresa?: Prisma.EmpresaUpdateOneRequiredWithoutUsuarioNestedInput
  solicitudesRevisadas?: Prisma.SolicitudCuentaUpdateManyWithoutRevisorNestedInput
  sesiones?: Prisma.SesionUsuarioUpdateManyWithoutUsuarioNestedInput
  tokensSeguridad?: Prisma.TokenSeguridadUpdateManyWithoutUsuarioNestedInput
}

export type UsuarioUncheckedUpdateWithoutEventosSeguridadInput = {
  idUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  idEmpresa?: Prisma.StringFieldUpdateOperationsInput | string
  rutUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  nombre?: Prisma.StringFieldUpdateOperationsInput | string
  apellido?: Prisma.StringFieldUpdateOperationsInput | string
  correo?: Prisma.StringFieldUpdateOperationsInput | string
  passwordHash?: Prisma.StringFieldUpdateOperationsInput | string
  rol?: Prisma.EnumRolUsuarioFieldUpdateOperationsInput | $Enums.RolUsuario
  estado?: Prisma.EnumEstadoUsuarioFieldUpdateOperationsInput | $Enums.EstadoUsuario
  debeCambiarPassword?: Prisma.BoolFieldUpdateOperationsInput | boolean
  intentosFallidos?: Prisma.IntFieldUpdateOperationsInput | number
  bloqueadoHasta?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  passwordChangedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  correoVerificadoAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  solicitudesRevisadas?: Prisma.SolicitudCuentaUncheckedUpdateManyWithoutRevisorNestedInput
  sesiones?: Prisma.SesionUsuarioUncheckedUpdateManyWithoutUsuarioNestedInput
  tokensSeguridad?: Prisma.TokenSeguridadUncheckedUpdateManyWithoutUsuarioNestedInput
}


export type UsuarioCountOutputType = {
  solicitudesRevisadas: number
  sesiones: number
  tokensSeguridad: number
  eventosSeguridad: number
}

export type UsuarioCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  solicitudesRevisadas?: boolean | UsuarioCountOutputTypeCountSolicitudesRevisadasArgs
  sesiones?: boolean | UsuarioCountOutputTypeCountSesionesArgs
  tokensSeguridad?: boolean | UsuarioCountOutputTypeCountTokensSeguridadArgs
  eventosSeguridad?: boolean | UsuarioCountOutputTypeCountEventosSeguridadArgs
}

export type UsuarioCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.UsuarioCountOutputTypeSelect<ExtArgs> | null
}

export type UsuarioCountOutputTypeCountSolicitudesRevisadasArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.SolicitudCuentaWhereInput
}

export type UsuarioCountOutputTypeCountSesionesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.SesionUsuarioWhereInput
}

export type UsuarioCountOutputTypeCountTokensSeguridadArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.TokenSeguridadWhereInput
}

export type UsuarioCountOutputTypeCountEventosSeguridadArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.EventoSeguridadWhereInput
}


export type UsuarioSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  idUsuario?: boolean
  idEmpresa?: boolean
  rutUsuario?: boolean
  nombre?: boolean
  apellido?: boolean
  correo?: boolean
  passwordHash?: boolean
  rol?: boolean
  estado?: boolean
  debeCambiarPassword?: boolean
  intentosFallidos?: boolean
  bloqueadoHasta?: boolean
  passwordChangedAt?: boolean
  correoVerificadoAt?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  empresa?: boolean | Prisma.EmpresaDefaultArgs<ExtArgs>
  solicitudesRevisadas?: boolean | Prisma.Usuario$solicitudesRevisadasArgs<ExtArgs>
  sesiones?: boolean | Prisma.Usuario$sesionesArgs<ExtArgs>
  tokensSeguridad?: boolean | Prisma.Usuario$tokensSeguridadArgs<ExtArgs>
  eventosSeguridad?: boolean | Prisma.Usuario$eventosSeguridadArgs<ExtArgs>
  _count?: boolean | Prisma.UsuarioCountOutputTypeDefaultArgs<ExtArgs>
}, ExtArgs["result"]["usuario"]>

export type UsuarioSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  idUsuario?: boolean
  idEmpresa?: boolean
  rutUsuario?: boolean
  nombre?: boolean
  apellido?: boolean
  correo?: boolean
  passwordHash?: boolean
  rol?: boolean
  estado?: boolean
  debeCambiarPassword?: boolean
  intentosFallidos?: boolean
  bloqueadoHasta?: boolean
  passwordChangedAt?: boolean
  correoVerificadoAt?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  empresa?: boolean | Prisma.EmpresaDefaultArgs<ExtArgs>
}, ExtArgs["result"]["usuario"]>

export type UsuarioSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  idUsuario?: boolean
  idEmpresa?: boolean
  rutUsuario?: boolean
  nombre?: boolean
  apellido?: boolean
  correo?: boolean
  passwordHash?: boolean
  rol?: boolean
  estado?: boolean
  debeCambiarPassword?: boolean
  intentosFallidos?: boolean
  bloqueadoHasta?: boolean
  passwordChangedAt?: boolean
  correoVerificadoAt?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  empresa?: boolean | Prisma.EmpresaDefaultArgs<ExtArgs>
}, ExtArgs["result"]["usuario"]>

export type UsuarioSelectScalar = {
  idUsuario?: boolean
  idEmpresa?: boolean
  rutUsuario?: boolean
  nombre?: boolean
  apellido?: boolean
  correo?: boolean
  passwordHash?: boolean
  rol?: boolean
  estado?: boolean
  debeCambiarPassword?: boolean
  intentosFallidos?: boolean
  bloqueadoHasta?: boolean
  passwordChangedAt?: boolean
  correoVerificadoAt?: boolean
  createdAt?: boolean
  updatedAt?: boolean
}

export type UsuarioOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"idUsuario" | "idEmpresa" | "rutUsuario" | "nombre" | "apellido" | "correo" | "passwordHash" | "rol" | "estado" | "debeCambiarPassword" | "intentosFallidos" | "bloqueadoHasta" | "passwordChangedAt" | "correoVerificadoAt" | "createdAt" | "updatedAt", ExtArgs["result"]["usuario"]>
export type UsuarioInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  empresa?: boolean | Prisma.EmpresaDefaultArgs<ExtArgs>
  solicitudesRevisadas?: boolean | Prisma.Usuario$solicitudesRevisadasArgs<ExtArgs>
  sesiones?: boolean | Prisma.Usuario$sesionesArgs<ExtArgs>
  tokensSeguridad?: boolean | Prisma.Usuario$tokensSeguridadArgs<ExtArgs>
  eventosSeguridad?: boolean | Prisma.Usuario$eventosSeguridadArgs<ExtArgs>
  _count?: boolean | Prisma.UsuarioCountOutputTypeDefaultArgs<ExtArgs>
}
export type UsuarioIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  empresa?: boolean | Prisma.EmpresaDefaultArgs<ExtArgs>
}
export type UsuarioIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  empresa?: boolean | Prisma.EmpresaDefaultArgs<ExtArgs>
}

export type $UsuarioPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  name: "Usuario"
  objects: {
    empresa: Prisma.$EmpresaPayload<ExtArgs>
    solicitudesRevisadas: Prisma.$SolicitudCuentaPayload<ExtArgs>[]
    sesiones: Prisma.$SesionUsuarioPayload<ExtArgs>[]
    tokensSeguridad: Prisma.$TokenSeguridadPayload<ExtArgs>[]
    eventosSeguridad: Prisma.$EventoSeguridadPayload<ExtArgs>[]
  }
  scalars: runtime.Types.Extensions.GetPayloadResult<{
    idUsuario: string
    idEmpresa: string
    rutUsuario: string
    nombre: string
    apellido: string
    correo: string
    passwordHash: string
    rol: $Enums.RolUsuario
    estado: $Enums.EstadoUsuario
    debeCambiarPassword: boolean
    intentosFallidos: number
    bloqueadoHasta: Date | null
    passwordChangedAt: Date | null
    correoVerificadoAt: Date | null
    createdAt: Date
    updatedAt: Date
  }, ExtArgs["result"]["usuario"]>
  composites: {}
}

export type UsuarioGetPayload<S extends boolean | null | undefined | UsuarioDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UsuarioPayload, S>

export type UsuarioCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> =
  Omit<UsuarioFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UsuarioCountAggregateInputType | true
  }

export interface UsuarioDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Usuario'], meta: { name: 'Usuario' } }
  findUnique<T extends UsuarioFindUniqueArgs>(args: Prisma.SelectSubset<T, UsuarioFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UsuarioClient<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
  findUniqueOrThrow<T extends UsuarioFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UsuarioFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UsuarioClient<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>
  findFirst<T extends UsuarioFindFirstArgs>(args?: Prisma.SelectSubset<T, UsuarioFindFirstArgs<ExtArgs>>): Prisma.Prisma__UsuarioClient<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
  findFirstOrThrow<T extends UsuarioFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UsuarioFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UsuarioClient<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>
  findMany<T extends UsuarioFindManyArgs>(args?: Prisma.SelectSubset<T, UsuarioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>
  create<T extends UsuarioCreateArgs>(args: Prisma.SelectSubset<T, UsuarioCreateArgs<ExtArgs>>): Prisma.Prisma__UsuarioClient<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>
  createMany<T extends UsuarioCreateManyArgs>(args?: Prisma.SelectSubset<T, UsuarioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>
  createManyAndReturn<T extends UsuarioCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UsuarioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>
  delete<T extends UsuarioDeleteArgs>(args: Prisma.SelectSubset<T, UsuarioDeleteArgs<ExtArgs>>): Prisma.Prisma__UsuarioClient<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>
  update<T extends UsuarioUpdateArgs>(args: Prisma.SelectSubset<T, UsuarioUpdateArgs<ExtArgs>>): Prisma.Prisma__UsuarioClient<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>
  deleteMany<T extends UsuarioDeleteManyArgs>(args?: Prisma.SelectSubset<T, UsuarioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>
  updateMany<T extends UsuarioUpdateManyArgs>(args: Prisma.SelectSubset<T, UsuarioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>
  updateManyAndReturn<T extends UsuarioUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UsuarioUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>
  upsert<T extends UsuarioUpsertArgs>(args: Prisma.SelectSubset<T, UsuarioUpsertArgs<ExtArgs>>): Prisma.Prisma__UsuarioClient<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>
  count<T extends UsuarioCountArgs>(
    args?: Prisma.Subset<T, UsuarioCountArgs>,
  ): Prisma.PrismaPromise<
    T extends runtime.Types.Utils.Record<'select', any>
      ? T['select'] extends true
        ? number
        : Prisma.GetScalarType<T['select'], UsuarioCountAggregateOutputType>
      : number
  >
  aggregate<T extends UsuarioAggregateArgs>(args: Prisma.Subset<T, UsuarioAggregateArgs>): Prisma.PrismaPromise<GetUsuarioAggregateType<T>>
  groupBy<
    T extends UsuarioGroupByArgs,
    HasSelectOrTake extends Prisma.Or<
      Prisma.Extends<'skip', Prisma.Keys<T>>,
      Prisma.Extends<'take', Prisma.Keys<T>>
    >,
    OrderByArg extends Prisma.True extends HasSelectOrTake
      ? { orderBy: UsuarioGroupByArgs['orderBy'] }
      : { orderBy?: UsuarioGroupByArgs['orderBy'] },
    OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>,
    ByFields extends Prisma.MaybeTupleToUnion<T['by']>,
    ByValid extends Prisma.Has<ByFields, OrderFields>,
    HavingFields extends Prisma.GetHavingFields<T['having']>,
    HavingValid extends Prisma.Has<ByFields, HavingFields>,
    ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False,
    InputErrors extends ByEmpty extends Prisma.True
    ? `Error: "by" must not be empty.`
    : HavingValid extends Prisma.False
    ? {
        [P in HavingFields]: P extends ByFields
          ? never
          : P extends string
          ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
          : [
              Error,
              'Field ',
              P,
              ` in "having" needs to be provided in "by"`,
            ]
      }[HavingFields]
    : 'take' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "take", you also need to provide "orderBy"'
    : 'skip' extends Prisma.Keys<T>
    ? 'orderBy' extends Prisma.Keys<T>
      ? ByValid extends Prisma.True
        ? {}
        : {
            [P in OrderFields]: P extends ByFields
              ? never
              : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
          }[OrderFields]
      : 'Error: If you provide "skip", you also need to provide "orderBy"'
    : ByValid extends Prisma.True
    ? {}
    : {
        [P in OrderFields]: P extends ByFields
          ? never
          : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
      }[OrderFields]
  >(args: Prisma.SubsetIntersection<T, UsuarioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsuarioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  readonly fields: UsuarioFieldRefs;
}

export interface Prisma__UsuarioClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
  readonly [Symbol.toStringTag]: "PrismaPromise"
  empresa<T extends Prisma.EmpresaDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.EmpresaDefaultArgs<ExtArgs>>): Prisma.Prisma__EmpresaClient<runtime.Types.Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
  solicitudesRevisadas<T extends Prisma.Usuario$solicitudesRevisadasArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Usuario$solicitudesRevisadasArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SolicitudCuentaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
  sesiones<T extends Prisma.Usuario$sesionesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Usuario$sesionesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SesionUsuarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
  tokensSeguridad<T extends Prisma.Usuario$tokensSeguridadArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Usuario$tokensSeguridadArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TokenSeguridadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
  eventosSeguridad<T extends Prisma.Usuario$eventosSeguridadArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Usuario$eventosSeguridadArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventoSeguridadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>
  finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>
}

export interface UsuarioFieldRefs {
  readonly idUsuario: Prisma.FieldRef<"Usuario", 'String'>
  readonly idEmpresa: Prisma.FieldRef<"Usuario", 'String'>
  readonly rutUsuario: Prisma.FieldRef<"Usuario", 'String'>
  readonly nombre: Prisma.FieldRef<"Usuario", 'String'>
  readonly apellido: Prisma.FieldRef<"Usuario", 'String'>
  readonly correo: Prisma.FieldRef<"Usuario", 'String'>
  readonly passwordHash: Prisma.FieldRef<"Usuario", 'String'>
  readonly rol: Prisma.FieldRef<"Usuario", 'RolUsuario'>
  readonly estado: Prisma.FieldRef<"Usuario", 'EstadoUsuario'>
  readonly debeCambiarPassword: Prisma.FieldRef<"Usuario", 'Boolean'>
  readonly intentosFallidos: Prisma.FieldRef<"Usuario", 'Int'>
  readonly bloqueadoHasta: Prisma.FieldRef<"Usuario", 'DateTime'>
  readonly passwordChangedAt: Prisma.FieldRef<"Usuario", 'DateTime'>
  readonly correoVerificadoAt: Prisma.FieldRef<"Usuario", 'DateTime'>
  readonly createdAt: Prisma.FieldRef<"Usuario", 'DateTime'>
  readonly updatedAt: Prisma.FieldRef<"Usuario", 'DateTime'>
}
    

export type UsuarioFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.UsuarioSelect<ExtArgs> | null
  omit?: Prisma.UsuarioOmit<ExtArgs> | null
  include?: Prisma.UsuarioInclude<ExtArgs> | null
  where: Prisma.UsuarioWhereUniqueInput
}

export type UsuarioFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.UsuarioSelect<ExtArgs> | null
  omit?: Prisma.UsuarioOmit<ExtArgs> | null
  include?: Prisma.UsuarioInclude<ExtArgs> | null
  where: Prisma.UsuarioWhereUniqueInput
}

export type UsuarioFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.UsuarioSelect<ExtArgs> | null
  omit?: Prisma.UsuarioOmit<ExtArgs> | null
  include?: Prisma.UsuarioInclude<ExtArgs> | null
  where?: Prisma.UsuarioWhereInput
  orderBy?: Prisma.UsuarioOrderByWithRelationInput | Prisma.UsuarioOrderByWithRelationInput[]
  cursor?: Prisma.UsuarioWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.UsuarioScalarFieldEnum | Prisma.UsuarioScalarFieldEnum[]
}

export type UsuarioFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.UsuarioSelect<ExtArgs> | null
  omit?: Prisma.UsuarioOmit<ExtArgs> | null
  include?: Prisma.UsuarioInclude<ExtArgs> | null
  where?: Prisma.UsuarioWhereInput
  orderBy?: Prisma.UsuarioOrderByWithRelationInput | Prisma.UsuarioOrderByWithRelationInput[]
  cursor?: Prisma.UsuarioWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.UsuarioScalarFieldEnum | Prisma.UsuarioScalarFieldEnum[]
}

export type UsuarioFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.UsuarioSelect<ExtArgs> | null
  omit?: Prisma.UsuarioOmit<ExtArgs> | null
  include?: Prisma.UsuarioInclude<ExtArgs> | null
  where?: Prisma.UsuarioWhereInput
  orderBy?: Prisma.UsuarioOrderByWithRelationInput | Prisma.UsuarioOrderByWithRelationInput[]
  cursor?: Prisma.UsuarioWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.UsuarioScalarFieldEnum | Prisma.UsuarioScalarFieldEnum[]
}

export type UsuarioCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.UsuarioSelect<ExtArgs> | null
  omit?: Prisma.UsuarioOmit<ExtArgs> | null
  include?: Prisma.UsuarioInclude<ExtArgs> | null
  data: Prisma.XOR<Prisma.UsuarioCreateInput, Prisma.UsuarioUncheckedCreateInput>
}

export type UsuarioCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  data: Prisma.UsuarioCreateManyInput | Prisma.UsuarioCreateManyInput[]
  skipDuplicates?: boolean
}

export type UsuarioCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.UsuarioSelectCreateManyAndReturn<ExtArgs> | null
  omit?: Prisma.UsuarioOmit<ExtArgs> | null
  data: Prisma.UsuarioCreateManyInput | Prisma.UsuarioCreateManyInput[]
  skipDuplicates?: boolean
  include?: Prisma.UsuarioIncludeCreateManyAndReturn<ExtArgs> | null
}

export type UsuarioUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.UsuarioSelect<ExtArgs> | null
  omit?: Prisma.UsuarioOmit<ExtArgs> | null
  include?: Prisma.UsuarioInclude<ExtArgs> | null
  data: Prisma.XOR<Prisma.UsuarioUpdateInput, Prisma.UsuarioUncheckedUpdateInput>
  where: Prisma.UsuarioWhereUniqueInput
}

export type UsuarioUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  data: Prisma.XOR<Prisma.UsuarioUpdateManyMutationInput, Prisma.UsuarioUncheckedUpdateManyInput>
  where?: Prisma.UsuarioWhereInput
  limit?: number
}

export type UsuarioUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.UsuarioSelectUpdateManyAndReturn<ExtArgs> | null
  omit?: Prisma.UsuarioOmit<ExtArgs> | null
  data: Prisma.XOR<Prisma.UsuarioUpdateManyMutationInput, Prisma.UsuarioUncheckedUpdateManyInput>
  where?: Prisma.UsuarioWhereInput
  limit?: number
  include?: Prisma.UsuarioIncludeUpdateManyAndReturn<ExtArgs> | null
}

export type UsuarioUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.UsuarioSelect<ExtArgs> | null
  omit?: Prisma.UsuarioOmit<ExtArgs> | null
  include?: Prisma.UsuarioInclude<ExtArgs> | null
  where: Prisma.UsuarioWhereUniqueInput
  create: Prisma.XOR<Prisma.UsuarioCreateInput, Prisma.UsuarioUncheckedCreateInput>
  update: Prisma.XOR<Prisma.UsuarioUpdateInput, Prisma.UsuarioUncheckedUpdateInput>
}

export type UsuarioDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.UsuarioSelect<ExtArgs> | null
  omit?: Prisma.UsuarioOmit<ExtArgs> | null
  include?: Prisma.UsuarioInclude<ExtArgs> | null
  where: Prisma.UsuarioWhereUniqueInput
}

export type UsuarioDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.UsuarioWhereInput
  limit?: number
}

export type Usuario$solicitudesRevisadasArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.SolicitudCuentaSelect<ExtArgs> | null
  omit?: Prisma.SolicitudCuentaOmit<ExtArgs> | null
  include?: Prisma.SolicitudCuentaInclude<ExtArgs> | null
  where?: Prisma.SolicitudCuentaWhereInput
  orderBy?: Prisma.SolicitudCuentaOrderByWithRelationInput | Prisma.SolicitudCuentaOrderByWithRelationInput[]
  cursor?: Prisma.SolicitudCuentaWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.SolicitudCuentaScalarFieldEnum | Prisma.SolicitudCuentaScalarFieldEnum[]
}

export type Usuario$sesionesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.SesionUsuarioSelect<ExtArgs> | null
  omit?: Prisma.SesionUsuarioOmit<ExtArgs> | null
  include?: Prisma.SesionUsuarioInclude<ExtArgs> | null
  where?: Prisma.SesionUsuarioWhereInput
  orderBy?: Prisma.SesionUsuarioOrderByWithRelationInput | Prisma.SesionUsuarioOrderByWithRelationInput[]
  cursor?: Prisma.SesionUsuarioWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.SesionUsuarioScalarFieldEnum | Prisma.SesionUsuarioScalarFieldEnum[]
}

export type Usuario$tokensSeguridadArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.TokenSeguridadSelect<ExtArgs> | null
  omit?: Prisma.TokenSeguridadOmit<ExtArgs> | null
  include?: Prisma.TokenSeguridadInclude<ExtArgs> | null
  where?: Prisma.TokenSeguridadWhereInput
  orderBy?: Prisma.TokenSeguridadOrderByWithRelationInput | Prisma.TokenSeguridadOrderByWithRelationInput[]
  cursor?: Prisma.TokenSeguridadWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.TokenSeguridadScalarFieldEnum | Prisma.TokenSeguridadScalarFieldEnum[]
}

export type Usuario$eventosSeguridadArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.EventoSeguridadSelect<ExtArgs> | null
  omit?: Prisma.EventoSeguridadOmit<ExtArgs> | null
  include?: Prisma.EventoSeguridadInclude<ExtArgs> | null
  where?: Prisma.EventoSeguridadWhereInput
  orderBy?: Prisma.EventoSeguridadOrderByWithRelationInput | Prisma.EventoSeguridadOrderByWithRelationInput[]
  cursor?: Prisma.EventoSeguridadWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.EventoSeguridadScalarFieldEnum | Prisma.EventoSeguridadScalarFieldEnum[]
}

export type UsuarioDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.UsuarioSelect<ExtArgs> | null
  omit?: Prisma.UsuarioOmit<ExtArgs> | null
  include?: Prisma.UsuarioInclude<ExtArgs> | null
}
