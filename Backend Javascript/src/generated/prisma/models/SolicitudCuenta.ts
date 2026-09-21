import type * as runtime from "@prisma/client/runtime/client"
import type * as $Enums from "../enums.js"
import type * as Prisma from "../internal/prismaNamespace.js"

export type SolicitudCuentaModel = runtime.Types.Result.DefaultSelection<Prisma.$SolicitudCuentaPayload>

export type AggregateSolicitudCuenta = {
  _count: SolicitudCuentaCountAggregateOutputType | null
  _min: SolicitudCuentaMinAggregateOutputType | null
  _max: SolicitudCuentaMaxAggregateOutputType | null
}

export type SolicitudCuentaMinAggregateOutputType = {
  idSolicitud: string | null
  rutEmpresa: string | null
  razonSocial: string | null
  rutUsuario: string | null
  nombre: string | null
  apellido: string | null
  correo: string | null
  descripcion: string | null
  estado: $Enums.EstadoSolicitud | null
  revisadaPorId: string | null
  fechaRevision: Date | null
  motivoRechazo: string | null
  createdAt: Date | null
  updatedAt: Date | null
}

export type SolicitudCuentaMaxAggregateOutputType = {
  idSolicitud: string | null
  rutEmpresa: string | null
  razonSocial: string | null
  rutUsuario: string | null
  nombre: string | null
  apellido: string | null
  correo: string | null
  descripcion: string | null
  estado: $Enums.EstadoSolicitud | null
  revisadaPorId: string | null
  fechaRevision: Date | null
  motivoRechazo: string | null
  createdAt: Date | null
  updatedAt: Date | null
}

export type SolicitudCuentaCountAggregateOutputType = {
  idSolicitud: number
  rutEmpresa: number
  razonSocial: number
  rutUsuario: number
  nombre: number
  apellido: number
  correo: number
  descripcion: number
  estado: number
  revisadaPorId: number
  fechaRevision: number
  motivoRechazo: number
  createdAt: number
  updatedAt: number
  _all: number
}


export type SolicitudCuentaMinAggregateInputType = {
  idSolicitud?: true
  rutEmpresa?: true
  razonSocial?: true
  rutUsuario?: true
  nombre?: true
  apellido?: true
  correo?: true
  descripcion?: true
  estado?: true
  revisadaPorId?: true
  fechaRevision?: true
  motivoRechazo?: true
  createdAt?: true
  updatedAt?: true
}

export type SolicitudCuentaMaxAggregateInputType = {
  idSolicitud?: true
  rutEmpresa?: true
  razonSocial?: true
  rutUsuario?: true
  nombre?: true
  apellido?: true
  correo?: true
  descripcion?: true
  estado?: true
  revisadaPorId?: true
  fechaRevision?: true
  motivoRechazo?: true
  createdAt?: true
  updatedAt?: true
}

export type SolicitudCuentaCountAggregateInputType = {
  idSolicitud?: true
  rutEmpresa?: true
  razonSocial?: true
  rutUsuario?: true
  nombre?: true
  apellido?: true
  correo?: true
  descripcion?: true
  estado?: true
  revisadaPorId?: true
  fechaRevision?: true
  motivoRechazo?: true
  createdAt?: true
  updatedAt?: true
  _all?: true
}

export type SolicitudCuentaAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.SolicitudCuentaWhereInput
  orderBy?: Prisma.SolicitudCuentaOrderByWithRelationInput | Prisma.SolicitudCuentaOrderByWithRelationInput[]
  cursor?: Prisma.SolicitudCuentaWhereUniqueInput
  take?: number
  skip?: number
  _count?: true | SolicitudCuentaCountAggregateInputType
  _min?: SolicitudCuentaMinAggregateInputType
  _max?: SolicitudCuentaMaxAggregateInputType
}

export type GetSolicitudCuentaAggregateType<T extends SolicitudCuentaAggregateArgs> = {
      [P in keyof T & keyof AggregateSolicitudCuenta]: P extends '_count' | 'count'
    ? T[P] extends true
      ? number
      : Prisma.GetScalarType<T[P], AggregateSolicitudCuenta[P]>
    : Prisma.GetScalarType<T[P], AggregateSolicitudCuenta[P]>
}




export type SolicitudCuentaGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.SolicitudCuentaWhereInput
  orderBy?: Prisma.SolicitudCuentaOrderByWithAggregationInput | Prisma.SolicitudCuentaOrderByWithAggregationInput[]
  by: Prisma.SolicitudCuentaScalarFieldEnum[] | Prisma.SolicitudCuentaScalarFieldEnum
  having?: Prisma.SolicitudCuentaScalarWhereWithAggregatesInput
  take?: number
  skip?: number
  _count?: SolicitudCuentaCountAggregateInputType | true
  _min?: SolicitudCuentaMinAggregateInputType
  _max?: SolicitudCuentaMaxAggregateInputType
}

export type SolicitudCuentaGroupByOutputType = {
  idSolicitud: string
  rutEmpresa: string
  razonSocial: string | null
  rutUsuario: string
  nombre: string
  apellido: string
  correo: string
  descripcion: string | null
  estado: $Enums.EstadoSolicitud
  revisadaPorId: string | null
  fechaRevision: Date | null
  motivoRechazo: string | null
  createdAt: Date
  updatedAt: Date
  _count: SolicitudCuentaCountAggregateOutputType | null
  _min: SolicitudCuentaMinAggregateOutputType | null
  _max: SolicitudCuentaMaxAggregateOutputType | null
}

export type GetSolicitudCuentaGroupByPayload<T extends SolicitudCuentaGroupByArgs> = Prisma.PrismaPromise<
  Array<
    Prisma.PickEnumerable<SolicitudCuentaGroupByOutputType, T['by']> &
      {
        [P in ((keyof T) & (keyof SolicitudCuentaGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : Prisma.GetScalarType<T[P], SolicitudCuentaGroupByOutputType[P]>
          : Prisma.GetScalarType<T[P], SolicitudCuentaGroupByOutputType[P]>
      }
    >
  >



export type SolicitudCuentaWhereInput = {
  AND?: Prisma.SolicitudCuentaWhereInput | Prisma.SolicitudCuentaWhereInput[]
  OR?: Prisma.SolicitudCuentaWhereInput[]
  NOT?: Prisma.SolicitudCuentaWhereInput | Prisma.SolicitudCuentaWhereInput[]
  idSolicitud?: Prisma.UuidFilter<"SolicitudCuenta"> | string
  rutEmpresa?: Prisma.StringFilter<"SolicitudCuenta"> | string
  razonSocial?: Prisma.StringNullableFilter<"SolicitudCuenta"> | string | null
  rutUsuario?: Prisma.StringFilter<"SolicitudCuenta"> | string
  nombre?: Prisma.StringFilter<"SolicitudCuenta"> | string
  apellido?: Prisma.StringFilter<"SolicitudCuenta"> | string
  correo?: Prisma.StringFilter<"SolicitudCuenta"> | string
  descripcion?: Prisma.StringNullableFilter<"SolicitudCuenta"> | string | null
  estado?: Prisma.EnumEstadoSolicitudFilter<"SolicitudCuenta"> | $Enums.EstadoSolicitud
  revisadaPorId?: Prisma.UuidNullableFilter<"SolicitudCuenta"> | string | null
  fechaRevision?: Prisma.DateTimeNullableFilter<"SolicitudCuenta"> | Date | string | null
  motivoRechazo?: Prisma.StringNullableFilter<"SolicitudCuenta"> | string | null
  createdAt?: Prisma.DateTimeFilter<"SolicitudCuenta"> | Date | string
  updatedAt?: Prisma.DateTimeFilter<"SolicitudCuenta"> | Date | string
  revisor?: Prisma.XOR<Prisma.UsuarioNullableScalarRelationFilter, Prisma.UsuarioWhereInput> | null
}

export type SolicitudCuentaOrderByWithRelationInput = {
  idSolicitud?: Prisma.SortOrder
  rutEmpresa?: Prisma.SortOrder
  razonSocial?: Prisma.SortOrderInput | Prisma.SortOrder
  rutUsuario?: Prisma.SortOrder
  nombre?: Prisma.SortOrder
  apellido?: Prisma.SortOrder
  correo?: Prisma.SortOrder
  descripcion?: Prisma.SortOrderInput | Prisma.SortOrder
  estado?: Prisma.SortOrder
  revisadaPorId?: Prisma.SortOrderInput | Prisma.SortOrder
  fechaRevision?: Prisma.SortOrderInput | Prisma.SortOrder
  motivoRechazo?: Prisma.SortOrderInput | Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  updatedAt?: Prisma.SortOrder
  revisor?: Prisma.UsuarioOrderByWithRelationInput
}

export type SolicitudCuentaWhereUniqueInput = Prisma.AtLeast<{
  idSolicitud?: string
  AND?: Prisma.SolicitudCuentaWhereInput | Prisma.SolicitudCuentaWhereInput[]
  OR?: Prisma.SolicitudCuentaWhereInput[]
  NOT?: Prisma.SolicitudCuentaWhereInput | Prisma.SolicitudCuentaWhereInput[]
  rutEmpresa?: Prisma.StringFilter<"SolicitudCuenta"> | string
  razonSocial?: Prisma.StringNullableFilter<"SolicitudCuenta"> | string | null
  rutUsuario?: Prisma.StringFilter<"SolicitudCuenta"> | string
  nombre?: Prisma.StringFilter<"SolicitudCuenta"> | string
  apellido?: Prisma.StringFilter<"SolicitudCuenta"> | string
  correo?: Prisma.StringFilter<"SolicitudCuenta"> | string
  descripcion?: Prisma.StringNullableFilter<"SolicitudCuenta"> | string | null
  estado?: Prisma.EnumEstadoSolicitudFilter<"SolicitudCuenta"> | $Enums.EstadoSolicitud
  revisadaPorId?: Prisma.UuidNullableFilter<"SolicitudCuenta"> | string | null
  fechaRevision?: Prisma.DateTimeNullableFilter<"SolicitudCuenta"> | Date | string | null
  motivoRechazo?: Prisma.StringNullableFilter<"SolicitudCuenta"> | string | null
  createdAt?: Prisma.DateTimeFilter<"SolicitudCuenta"> | Date | string
  updatedAt?: Prisma.DateTimeFilter<"SolicitudCuenta"> | Date | string
  revisor?: Prisma.XOR<Prisma.UsuarioNullableScalarRelationFilter, Prisma.UsuarioWhereInput> | null
}, "idSolicitud">

export type SolicitudCuentaOrderByWithAggregationInput = {
  idSolicitud?: Prisma.SortOrder
  rutEmpresa?: Prisma.SortOrder
  razonSocial?: Prisma.SortOrderInput | Prisma.SortOrder
  rutUsuario?: Prisma.SortOrder
  nombre?: Prisma.SortOrder
  apellido?: Prisma.SortOrder
  correo?: Prisma.SortOrder
  descripcion?: Prisma.SortOrderInput | Prisma.SortOrder
  estado?: Prisma.SortOrder
  revisadaPorId?: Prisma.SortOrderInput | Prisma.SortOrder
  fechaRevision?: Prisma.SortOrderInput | Prisma.SortOrder
  motivoRechazo?: Prisma.SortOrderInput | Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  updatedAt?: Prisma.SortOrder
  _count?: Prisma.SolicitudCuentaCountOrderByAggregateInput
  _max?: Prisma.SolicitudCuentaMaxOrderByAggregateInput
  _min?: Prisma.SolicitudCuentaMinOrderByAggregateInput
}

export type SolicitudCuentaScalarWhereWithAggregatesInput = {
  AND?: Prisma.SolicitudCuentaScalarWhereWithAggregatesInput | Prisma.SolicitudCuentaScalarWhereWithAggregatesInput[]
  OR?: Prisma.SolicitudCuentaScalarWhereWithAggregatesInput[]
  NOT?: Prisma.SolicitudCuentaScalarWhereWithAggregatesInput | Prisma.SolicitudCuentaScalarWhereWithAggregatesInput[]
  idSolicitud?: Prisma.UuidWithAggregatesFilter<"SolicitudCuenta"> | string
  rutEmpresa?: Prisma.StringWithAggregatesFilter<"SolicitudCuenta"> | string
  razonSocial?: Prisma.StringNullableWithAggregatesFilter<"SolicitudCuenta"> | string | null
  rutUsuario?: Prisma.StringWithAggregatesFilter<"SolicitudCuenta"> | string
  nombre?: Prisma.StringWithAggregatesFilter<"SolicitudCuenta"> | string
  apellido?: Prisma.StringWithAggregatesFilter<"SolicitudCuenta"> | string
  correo?: Prisma.StringWithAggregatesFilter<"SolicitudCuenta"> | string
  descripcion?: Prisma.StringNullableWithAggregatesFilter<"SolicitudCuenta"> | string | null
  estado?: Prisma.EnumEstadoSolicitudWithAggregatesFilter<"SolicitudCuenta"> | $Enums.EstadoSolicitud
  revisadaPorId?: Prisma.UuidNullableWithAggregatesFilter<"SolicitudCuenta"> | string | null
  fechaRevision?: Prisma.DateTimeNullableWithAggregatesFilter<"SolicitudCuenta"> | Date | string | null
  motivoRechazo?: Prisma.StringNullableWithAggregatesFilter<"SolicitudCuenta"> | string | null
  createdAt?: Prisma.DateTimeWithAggregatesFilter<"SolicitudCuenta"> | Date | string
  updatedAt?: Prisma.DateTimeWithAggregatesFilter<"SolicitudCuenta"> | Date | string
}

export type SolicitudCuentaCreateInput = {
  idSolicitud?: string
  rutEmpresa: string
  razonSocial?: string | null
  rutUsuario: string
  nombre: string
  apellido: string
  correo: string
  descripcion?: string | null
  estado?: $Enums.EstadoSolicitud
  fechaRevision?: Date | string | null
  motivoRechazo?: string | null
  createdAt?: Date | string
  updatedAt?: Date | string
  revisor?: Prisma.UsuarioCreateNestedOneWithoutSolicitudesRevisadasInput
}

export type SolicitudCuentaUncheckedCreateInput = {
  idSolicitud?: string
  rutEmpresa: string
  razonSocial?: string | null
  rutUsuario: string
  nombre: string
  apellido: string
  correo: string
  descripcion?: string | null
  estado?: $Enums.EstadoSolicitud
  revisadaPorId?: string | null
  fechaRevision?: Date | string | null
  motivoRechazo?: string | null
  createdAt?: Date | string
  updatedAt?: Date | string
}

export type SolicitudCuentaUpdateInput = {
  idSolicitud?: Prisma.StringFieldUpdateOperationsInput | string
  rutEmpresa?: Prisma.StringFieldUpdateOperationsInput | string
  razonSocial?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  rutUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  nombre?: Prisma.StringFieldUpdateOperationsInput | string
  apellido?: Prisma.StringFieldUpdateOperationsInput | string
  correo?: Prisma.StringFieldUpdateOperationsInput | string
  descripcion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  estado?: Prisma.EnumEstadoSolicitudFieldUpdateOperationsInput | $Enums.EstadoSolicitud
  fechaRevision?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  motivoRechazo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  revisor?: Prisma.UsuarioUpdateOneWithoutSolicitudesRevisadasNestedInput
}

export type SolicitudCuentaUncheckedUpdateInput = {
  idSolicitud?: Prisma.StringFieldUpdateOperationsInput | string
  rutEmpresa?: Prisma.StringFieldUpdateOperationsInput | string
  razonSocial?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  rutUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  nombre?: Prisma.StringFieldUpdateOperationsInput | string
  apellido?: Prisma.StringFieldUpdateOperationsInput | string
  correo?: Prisma.StringFieldUpdateOperationsInput | string
  descripcion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  estado?: Prisma.EnumEstadoSolicitudFieldUpdateOperationsInput | $Enums.EstadoSolicitud
  revisadaPorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  fechaRevision?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  motivoRechazo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type SolicitudCuentaCreateManyInput = {
  idSolicitud?: string
  rutEmpresa: string
  razonSocial?: string | null
  rutUsuario: string
  nombre: string
  apellido: string
  correo: string
  descripcion?: string | null
  estado?: $Enums.EstadoSolicitud
  revisadaPorId?: string | null
  fechaRevision?: Date | string | null
  motivoRechazo?: string | null
  createdAt?: Date | string
  updatedAt?: Date | string
}

export type SolicitudCuentaUpdateManyMutationInput = {
  idSolicitud?: Prisma.StringFieldUpdateOperationsInput | string
  rutEmpresa?: Prisma.StringFieldUpdateOperationsInput | string
  razonSocial?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  rutUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  nombre?: Prisma.StringFieldUpdateOperationsInput | string
  apellido?: Prisma.StringFieldUpdateOperationsInput | string
  correo?: Prisma.StringFieldUpdateOperationsInput | string
  descripcion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  estado?: Prisma.EnumEstadoSolicitudFieldUpdateOperationsInput | $Enums.EstadoSolicitud
  fechaRevision?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  motivoRechazo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type SolicitudCuentaUncheckedUpdateManyInput = {
  idSolicitud?: Prisma.StringFieldUpdateOperationsInput | string
  rutEmpresa?: Prisma.StringFieldUpdateOperationsInput | string
  razonSocial?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  rutUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  nombre?: Prisma.StringFieldUpdateOperationsInput | string
  apellido?: Prisma.StringFieldUpdateOperationsInput | string
  correo?: Prisma.StringFieldUpdateOperationsInput | string
  descripcion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  estado?: Prisma.EnumEstadoSolicitudFieldUpdateOperationsInput | $Enums.EstadoSolicitud
  revisadaPorId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  fechaRevision?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  motivoRechazo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type SolicitudCuentaListRelationFilter = {
  every?: Prisma.SolicitudCuentaWhereInput
  some?: Prisma.SolicitudCuentaWhereInput
  none?: Prisma.SolicitudCuentaWhereInput
}

export type SolicitudCuentaOrderByRelationAggregateInput = {
  _count?: Prisma.SortOrder
}

export type SolicitudCuentaCountOrderByAggregateInput = {
  idSolicitud?: Prisma.SortOrder
  rutEmpresa?: Prisma.SortOrder
  razonSocial?: Prisma.SortOrder
  rutUsuario?: Prisma.SortOrder
  nombre?: Prisma.SortOrder
  apellido?: Prisma.SortOrder
  correo?: Prisma.SortOrder
  descripcion?: Prisma.SortOrder
  estado?: Prisma.SortOrder
  revisadaPorId?: Prisma.SortOrder
  fechaRevision?: Prisma.SortOrder
  motivoRechazo?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  updatedAt?: Prisma.SortOrder
}

export type SolicitudCuentaMaxOrderByAggregateInput = {
  idSolicitud?: Prisma.SortOrder
  rutEmpresa?: Prisma.SortOrder
  razonSocial?: Prisma.SortOrder
  rutUsuario?: Prisma.SortOrder
  nombre?: Prisma.SortOrder
  apellido?: Prisma.SortOrder
  correo?: Prisma.SortOrder
  descripcion?: Prisma.SortOrder
  estado?: Prisma.SortOrder
  revisadaPorId?: Prisma.SortOrder
  fechaRevision?: Prisma.SortOrder
  motivoRechazo?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  updatedAt?: Prisma.SortOrder
}

export type SolicitudCuentaMinOrderByAggregateInput = {
  idSolicitud?: Prisma.SortOrder
  rutEmpresa?: Prisma.SortOrder
  razonSocial?: Prisma.SortOrder
  rutUsuario?: Prisma.SortOrder
  nombre?: Prisma.SortOrder
  apellido?: Prisma.SortOrder
  correo?: Prisma.SortOrder
  descripcion?: Prisma.SortOrder
  estado?: Prisma.SortOrder
  revisadaPorId?: Prisma.SortOrder
  fechaRevision?: Prisma.SortOrder
  motivoRechazo?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  updatedAt?: Prisma.SortOrder
}

export type SolicitudCuentaCreateNestedManyWithoutRevisorInput = {
  create?: Prisma.XOR<Prisma.SolicitudCuentaCreateWithoutRevisorInput, Prisma.SolicitudCuentaUncheckedCreateWithoutRevisorInput> | Prisma.SolicitudCuentaCreateWithoutRevisorInput[] | Prisma.SolicitudCuentaUncheckedCreateWithoutRevisorInput[]
  connectOrCreate?: Prisma.SolicitudCuentaCreateOrConnectWithoutRevisorInput | Prisma.SolicitudCuentaCreateOrConnectWithoutRevisorInput[]
  createMany?: Prisma.SolicitudCuentaCreateManyRevisorInputEnvelope
  connect?: Prisma.SolicitudCuentaWhereUniqueInput | Prisma.SolicitudCuentaWhereUniqueInput[]
}

export type SolicitudCuentaUncheckedCreateNestedManyWithoutRevisorInput = {
  create?: Prisma.XOR<Prisma.SolicitudCuentaCreateWithoutRevisorInput, Prisma.SolicitudCuentaUncheckedCreateWithoutRevisorInput> | Prisma.SolicitudCuentaCreateWithoutRevisorInput[] | Prisma.SolicitudCuentaUncheckedCreateWithoutRevisorInput[]
  connectOrCreate?: Prisma.SolicitudCuentaCreateOrConnectWithoutRevisorInput | Prisma.SolicitudCuentaCreateOrConnectWithoutRevisorInput[]
  createMany?: Prisma.SolicitudCuentaCreateManyRevisorInputEnvelope
  connect?: Prisma.SolicitudCuentaWhereUniqueInput | Prisma.SolicitudCuentaWhereUniqueInput[]
}

export type SolicitudCuentaUpdateManyWithoutRevisorNestedInput = {
  create?: Prisma.XOR<Prisma.SolicitudCuentaCreateWithoutRevisorInput, Prisma.SolicitudCuentaUncheckedCreateWithoutRevisorInput> | Prisma.SolicitudCuentaCreateWithoutRevisorInput[] | Prisma.SolicitudCuentaUncheckedCreateWithoutRevisorInput[]
  connectOrCreate?: Prisma.SolicitudCuentaCreateOrConnectWithoutRevisorInput | Prisma.SolicitudCuentaCreateOrConnectWithoutRevisorInput[]
  upsert?: Prisma.SolicitudCuentaUpsertWithWhereUniqueWithoutRevisorInput | Prisma.SolicitudCuentaUpsertWithWhereUniqueWithoutRevisorInput[]
  createMany?: Prisma.SolicitudCuentaCreateManyRevisorInputEnvelope
  set?: Prisma.SolicitudCuentaWhereUniqueInput | Prisma.SolicitudCuentaWhereUniqueInput[]
  disconnect?: Prisma.SolicitudCuentaWhereUniqueInput | Prisma.SolicitudCuentaWhereUniqueInput[]
  delete?: Prisma.SolicitudCuentaWhereUniqueInput | Prisma.SolicitudCuentaWhereUniqueInput[]
  connect?: Prisma.SolicitudCuentaWhereUniqueInput | Prisma.SolicitudCuentaWhereUniqueInput[]
  update?: Prisma.SolicitudCuentaUpdateWithWhereUniqueWithoutRevisorInput | Prisma.SolicitudCuentaUpdateWithWhereUniqueWithoutRevisorInput[]
  updateMany?: Prisma.SolicitudCuentaUpdateManyWithWhereWithoutRevisorInput | Prisma.SolicitudCuentaUpdateManyWithWhereWithoutRevisorInput[]
  deleteMany?: Prisma.SolicitudCuentaScalarWhereInput | Prisma.SolicitudCuentaScalarWhereInput[]
}

export type SolicitudCuentaUncheckedUpdateManyWithoutRevisorNestedInput = {
  create?: Prisma.XOR<Prisma.SolicitudCuentaCreateWithoutRevisorInput, Prisma.SolicitudCuentaUncheckedCreateWithoutRevisorInput> | Prisma.SolicitudCuentaCreateWithoutRevisorInput[] | Prisma.SolicitudCuentaUncheckedCreateWithoutRevisorInput[]
  connectOrCreate?: Prisma.SolicitudCuentaCreateOrConnectWithoutRevisorInput | Prisma.SolicitudCuentaCreateOrConnectWithoutRevisorInput[]
  upsert?: Prisma.SolicitudCuentaUpsertWithWhereUniqueWithoutRevisorInput | Prisma.SolicitudCuentaUpsertWithWhereUniqueWithoutRevisorInput[]
  createMany?: Prisma.SolicitudCuentaCreateManyRevisorInputEnvelope
  set?: Prisma.SolicitudCuentaWhereUniqueInput | Prisma.SolicitudCuentaWhereUniqueInput[]
  disconnect?: Prisma.SolicitudCuentaWhereUniqueInput | Prisma.SolicitudCuentaWhereUniqueInput[]
  delete?: Prisma.SolicitudCuentaWhereUniqueInput | Prisma.SolicitudCuentaWhereUniqueInput[]
  connect?: Prisma.SolicitudCuentaWhereUniqueInput | Prisma.SolicitudCuentaWhereUniqueInput[]
  update?: Prisma.SolicitudCuentaUpdateWithWhereUniqueWithoutRevisorInput | Prisma.SolicitudCuentaUpdateWithWhereUniqueWithoutRevisorInput[]
  updateMany?: Prisma.SolicitudCuentaUpdateManyWithWhereWithoutRevisorInput | Prisma.SolicitudCuentaUpdateManyWithWhereWithoutRevisorInput[]
  deleteMany?: Prisma.SolicitudCuentaScalarWhereInput | Prisma.SolicitudCuentaScalarWhereInput[]
}

export type NullableStringFieldUpdateOperationsInput = {
  set?: string | null
}

export type EnumEstadoSolicitudFieldUpdateOperationsInput = {
  set?: $Enums.EstadoSolicitud
}

export type SolicitudCuentaCreateWithoutRevisorInput = {
  idSolicitud?: string
  rutEmpresa: string
  razonSocial?: string | null
  rutUsuario: string
  nombre: string
  apellido: string
  correo: string
  descripcion?: string | null
  estado?: $Enums.EstadoSolicitud
  fechaRevision?: Date | string | null
  motivoRechazo?: string | null
  createdAt?: Date | string
  updatedAt?: Date | string
}

export type SolicitudCuentaUncheckedCreateWithoutRevisorInput = {
  idSolicitud?: string
  rutEmpresa: string
  razonSocial?: string | null
  rutUsuario: string
  nombre: string
  apellido: string
  correo: string
  descripcion?: string | null
  estado?: $Enums.EstadoSolicitud
  fechaRevision?: Date | string | null
  motivoRechazo?: string | null
  createdAt?: Date | string
  updatedAt?: Date | string
}

export type SolicitudCuentaCreateOrConnectWithoutRevisorInput = {
  where: Prisma.SolicitudCuentaWhereUniqueInput
  create: Prisma.XOR<Prisma.SolicitudCuentaCreateWithoutRevisorInput, Prisma.SolicitudCuentaUncheckedCreateWithoutRevisorInput>
}

export type SolicitudCuentaCreateManyRevisorInputEnvelope = {
  data: Prisma.SolicitudCuentaCreateManyRevisorInput | Prisma.SolicitudCuentaCreateManyRevisorInput[]
  skipDuplicates?: boolean
}

export type SolicitudCuentaUpsertWithWhereUniqueWithoutRevisorInput = {
  where: Prisma.SolicitudCuentaWhereUniqueInput
  update: Prisma.XOR<Prisma.SolicitudCuentaUpdateWithoutRevisorInput, Prisma.SolicitudCuentaUncheckedUpdateWithoutRevisorInput>
  create: Prisma.XOR<Prisma.SolicitudCuentaCreateWithoutRevisorInput, Prisma.SolicitudCuentaUncheckedCreateWithoutRevisorInput>
}

export type SolicitudCuentaUpdateWithWhereUniqueWithoutRevisorInput = {
  where: Prisma.SolicitudCuentaWhereUniqueInput
  data: Prisma.XOR<Prisma.SolicitudCuentaUpdateWithoutRevisorInput, Prisma.SolicitudCuentaUncheckedUpdateWithoutRevisorInput>
}

export type SolicitudCuentaUpdateManyWithWhereWithoutRevisorInput = {
  where: Prisma.SolicitudCuentaScalarWhereInput
  data: Prisma.XOR<Prisma.SolicitudCuentaUpdateManyMutationInput, Prisma.SolicitudCuentaUncheckedUpdateManyWithoutRevisorInput>
}

export type SolicitudCuentaScalarWhereInput = {
  AND?: Prisma.SolicitudCuentaScalarWhereInput | Prisma.SolicitudCuentaScalarWhereInput[]
  OR?: Prisma.SolicitudCuentaScalarWhereInput[]
  NOT?: Prisma.SolicitudCuentaScalarWhereInput | Prisma.SolicitudCuentaScalarWhereInput[]
  idSolicitud?: Prisma.UuidFilter<"SolicitudCuenta"> | string
  rutEmpresa?: Prisma.StringFilter<"SolicitudCuenta"> | string
  razonSocial?: Prisma.StringNullableFilter<"SolicitudCuenta"> | string | null
  rutUsuario?: Prisma.StringFilter<"SolicitudCuenta"> | string
  nombre?: Prisma.StringFilter<"SolicitudCuenta"> | string
  apellido?: Prisma.StringFilter<"SolicitudCuenta"> | string
  correo?: Prisma.StringFilter<"SolicitudCuenta"> | string
  descripcion?: Prisma.StringNullableFilter<"SolicitudCuenta"> | string | null
  estado?: Prisma.EnumEstadoSolicitudFilter<"SolicitudCuenta"> | $Enums.EstadoSolicitud
  revisadaPorId?: Prisma.UuidNullableFilter<"SolicitudCuenta"> | string | null
  fechaRevision?: Prisma.DateTimeNullableFilter<"SolicitudCuenta"> | Date | string | null
  motivoRechazo?: Prisma.StringNullableFilter<"SolicitudCuenta"> | string | null
  createdAt?: Prisma.DateTimeFilter<"SolicitudCuenta"> | Date | string
  updatedAt?: Prisma.DateTimeFilter<"SolicitudCuenta"> | Date | string
}

export type SolicitudCuentaCreateManyRevisorInput = {
  idSolicitud?: string
  rutEmpresa: string
  razonSocial?: string | null
  rutUsuario: string
  nombre: string
  apellido: string
  correo: string
  descripcion?: string | null
  estado?: $Enums.EstadoSolicitud
  fechaRevision?: Date | string | null
  motivoRechazo?: string | null
  createdAt?: Date | string
  updatedAt?: Date | string
}

export type SolicitudCuentaUpdateWithoutRevisorInput = {
  idSolicitud?: Prisma.StringFieldUpdateOperationsInput | string
  rutEmpresa?: Prisma.StringFieldUpdateOperationsInput | string
  razonSocial?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  rutUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  nombre?: Prisma.StringFieldUpdateOperationsInput | string
  apellido?: Prisma.StringFieldUpdateOperationsInput | string
  correo?: Prisma.StringFieldUpdateOperationsInput | string
  descripcion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  estado?: Prisma.EnumEstadoSolicitudFieldUpdateOperationsInput | $Enums.EstadoSolicitud
  fechaRevision?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  motivoRechazo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type SolicitudCuentaUncheckedUpdateWithoutRevisorInput = {
  idSolicitud?: Prisma.StringFieldUpdateOperationsInput | string
  rutEmpresa?: Prisma.StringFieldUpdateOperationsInput | string
  razonSocial?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  rutUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  nombre?: Prisma.StringFieldUpdateOperationsInput | string
  apellido?: Prisma.StringFieldUpdateOperationsInput | string
  correo?: Prisma.StringFieldUpdateOperationsInput | string
  descripcion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  estado?: Prisma.EnumEstadoSolicitudFieldUpdateOperationsInput | $Enums.EstadoSolicitud
  fechaRevision?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  motivoRechazo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type SolicitudCuentaUncheckedUpdateManyWithoutRevisorInput = {
  idSolicitud?: Prisma.StringFieldUpdateOperationsInput | string
  rutEmpresa?: Prisma.StringFieldUpdateOperationsInput | string
  razonSocial?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  rutUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  nombre?: Prisma.StringFieldUpdateOperationsInput | string
  apellido?: Prisma.StringFieldUpdateOperationsInput | string
  correo?: Prisma.StringFieldUpdateOperationsInput | string
  descripcion?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  estado?: Prisma.EnumEstadoSolicitudFieldUpdateOperationsInput | $Enums.EstadoSolicitud
  fechaRevision?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  motivoRechazo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}



export type SolicitudCuentaSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  idSolicitud?: boolean
  rutEmpresa?: boolean
  razonSocial?: boolean
  rutUsuario?: boolean
  nombre?: boolean
  apellido?: boolean
  correo?: boolean
  descripcion?: boolean
  estado?: boolean
  revisadaPorId?: boolean
  fechaRevision?: boolean
  motivoRechazo?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  revisor?: boolean | Prisma.SolicitudCuenta$revisorArgs<ExtArgs>
}, ExtArgs["result"]["solicitudCuenta"]>

export type SolicitudCuentaSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  idSolicitud?: boolean
  rutEmpresa?: boolean
  razonSocial?: boolean
  rutUsuario?: boolean
  nombre?: boolean
  apellido?: boolean
  correo?: boolean
  descripcion?: boolean
  estado?: boolean
  revisadaPorId?: boolean
  fechaRevision?: boolean
  motivoRechazo?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  revisor?: boolean | Prisma.SolicitudCuenta$revisorArgs<ExtArgs>
}, ExtArgs["result"]["solicitudCuenta"]>

export type SolicitudCuentaSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  idSolicitud?: boolean
  rutEmpresa?: boolean
  razonSocial?: boolean
  rutUsuario?: boolean
  nombre?: boolean
  apellido?: boolean
  correo?: boolean
  descripcion?: boolean
  estado?: boolean
  revisadaPorId?: boolean
  fechaRevision?: boolean
  motivoRechazo?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  revisor?: boolean | Prisma.SolicitudCuenta$revisorArgs<ExtArgs>
}, ExtArgs["result"]["solicitudCuenta"]>

export type SolicitudCuentaSelectScalar = {
  idSolicitud?: boolean
  rutEmpresa?: boolean
  razonSocial?: boolean
  rutUsuario?: boolean
  nombre?: boolean
  apellido?: boolean
  correo?: boolean
  descripcion?: boolean
  estado?: boolean
  revisadaPorId?: boolean
  fechaRevision?: boolean
  motivoRechazo?: boolean
  createdAt?: boolean
  updatedAt?: boolean
}

export type SolicitudCuentaOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"idSolicitud" | "rutEmpresa" | "razonSocial" | "rutUsuario" | "nombre" | "apellido" | "correo" | "descripcion" | "estado" | "revisadaPorId" | "fechaRevision" | "motivoRechazo" | "createdAt" | "updatedAt", ExtArgs["result"]["solicitudCuenta"]>
export type SolicitudCuentaInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  revisor?: boolean | Prisma.SolicitudCuenta$revisorArgs<ExtArgs>
}
export type SolicitudCuentaIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  revisor?: boolean | Prisma.SolicitudCuenta$revisorArgs<ExtArgs>
}
export type SolicitudCuentaIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  revisor?: boolean | Prisma.SolicitudCuenta$revisorArgs<ExtArgs>
}

export type $SolicitudCuentaPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  name: "SolicitudCuenta"
  objects: {
    revisor: Prisma.$UsuarioPayload<ExtArgs> | null
  }
  scalars: runtime.Types.Extensions.GetPayloadResult<{
    idSolicitud: string
    rutEmpresa: string
    razonSocial: string | null
    rutUsuario: string
    nombre: string
    apellido: string
    correo: string
    descripcion: string | null
    estado: $Enums.EstadoSolicitud
    revisadaPorId: string | null
    fechaRevision: Date | null
    motivoRechazo: string | null
    createdAt: Date
    updatedAt: Date
  }, ExtArgs["result"]["solicitudCuenta"]>
  composites: {}
}

export type SolicitudCuentaGetPayload<S extends boolean | null | undefined | SolicitudCuentaDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SolicitudCuentaPayload, S>

export type SolicitudCuentaCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> =
  Omit<SolicitudCuentaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SolicitudCuentaCountAggregateInputType | true
  }

export interface SolicitudCuentaDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SolicitudCuenta'], meta: { name: 'SolicitudCuenta' } }
  findUnique<T extends SolicitudCuentaFindUniqueArgs>(args: Prisma.SelectSubset<T, SolicitudCuentaFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SolicitudCuentaClient<runtime.Types.Result.GetResult<Prisma.$SolicitudCuentaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
  findUniqueOrThrow<T extends SolicitudCuentaFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SolicitudCuentaFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SolicitudCuentaClient<runtime.Types.Result.GetResult<Prisma.$SolicitudCuentaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>
  findFirst<T extends SolicitudCuentaFindFirstArgs>(args?: Prisma.SelectSubset<T, SolicitudCuentaFindFirstArgs<ExtArgs>>): Prisma.Prisma__SolicitudCuentaClient<runtime.Types.Result.GetResult<Prisma.$SolicitudCuentaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
  findFirstOrThrow<T extends SolicitudCuentaFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SolicitudCuentaFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SolicitudCuentaClient<runtime.Types.Result.GetResult<Prisma.$SolicitudCuentaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>
  findMany<T extends SolicitudCuentaFindManyArgs>(args?: Prisma.SelectSubset<T, SolicitudCuentaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SolicitudCuentaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>
  create<T extends SolicitudCuentaCreateArgs>(args: Prisma.SelectSubset<T, SolicitudCuentaCreateArgs<ExtArgs>>): Prisma.Prisma__SolicitudCuentaClient<runtime.Types.Result.GetResult<Prisma.$SolicitudCuentaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>
  createMany<T extends SolicitudCuentaCreateManyArgs>(args?: Prisma.SelectSubset<T, SolicitudCuentaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>
  createManyAndReturn<T extends SolicitudCuentaCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SolicitudCuentaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SolicitudCuentaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>
  delete<T extends SolicitudCuentaDeleteArgs>(args: Prisma.SelectSubset<T, SolicitudCuentaDeleteArgs<ExtArgs>>): Prisma.Prisma__SolicitudCuentaClient<runtime.Types.Result.GetResult<Prisma.$SolicitudCuentaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>
  update<T extends SolicitudCuentaUpdateArgs>(args: Prisma.SelectSubset<T, SolicitudCuentaUpdateArgs<ExtArgs>>): Prisma.Prisma__SolicitudCuentaClient<runtime.Types.Result.GetResult<Prisma.$SolicitudCuentaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>
  deleteMany<T extends SolicitudCuentaDeleteManyArgs>(args?: Prisma.SelectSubset<T, SolicitudCuentaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>
  updateMany<T extends SolicitudCuentaUpdateManyArgs>(args: Prisma.SelectSubset<T, SolicitudCuentaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>
  updateManyAndReturn<T extends SolicitudCuentaUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SolicitudCuentaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SolicitudCuentaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>
  upsert<T extends SolicitudCuentaUpsertArgs>(args: Prisma.SelectSubset<T, SolicitudCuentaUpsertArgs<ExtArgs>>): Prisma.Prisma__SolicitudCuentaClient<runtime.Types.Result.GetResult<Prisma.$SolicitudCuentaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>
  count<T extends SolicitudCuentaCountArgs>(
    args?: Prisma.Subset<T, SolicitudCuentaCountArgs>,
  ): Prisma.PrismaPromise<
    T extends runtime.Types.Utils.Record<'select', any>
      ? T['select'] extends true
        ? number
        : Prisma.GetScalarType<T['select'], SolicitudCuentaCountAggregateOutputType>
      : number
  >
  aggregate<T extends SolicitudCuentaAggregateArgs>(args: Prisma.Subset<T, SolicitudCuentaAggregateArgs>): Prisma.PrismaPromise<GetSolicitudCuentaAggregateType<T>>
  groupBy<
    T extends SolicitudCuentaGroupByArgs,
    HasSelectOrTake extends Prisma.Or<
      Prisma.Extends<'skip', Prisma.Keys<T>>,
      Prisma.Extends<'take', Prisma.Keys<T>>
    >,
    OrderByArg extends Prisma.True extends HasSelectOrTake
      ? { orderBy: SolicitudCuentaGroupByArgs['orderBy'] }
      : { orderBy?: SolicitudCuentaGroupByArgs['orderBy'] },
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
  >(args: Prisma.SubsetIntersection<T, SolicitudCuentaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSolicitudCuentaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  readonly fields: SolicitudCuentaFieldRefs;
}

export interface Prisma__SolicitudCuentaClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
  readonly [Symbol.toStringTag]: "PrismaPromise"
  revisor<T extends Prisma.SolicitudCuenta$revisorArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SolicitudCuenta$revisorArgs<ExtArgs>>): Prisma.Prisma__UsuarioClient<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>
  finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>
}

export interface SolicitudCuentaFieldRefs {
  readonly idSolicitud: Prisma.FieldRef<"SolicitudCuenta", 'String'>
  readonly rutEmpresa: Prisma.FieldRef<"SolicitudCuenta", 'String'>
  readonly razonSocial: Prisma.FieldRef<"SolicitudCuenta", 'String'>
  readonly rutUsuario: Prisma.FieldRef<"SolicitudCuenta", 'String'>
  readonly nombre: Prisma.FieldRef<"SolicitudCuenta", 'String'>
  readonly apellido: Prisma.FieldRef<"SolicitudCuenta", 'String'>
  readonly correo: Prisma.FieldRef<"SolicitudCuenta", 'String'>
  readonly descripcion: Prisma.FieldRef<"SolicitudCuenta", 'String'>
  readonly estado: Prisma.FieldRef<"SolicitudCuenta", 'EstadoSolicitud'>
  readonly revisadaPorId: Prisma.FieldRef<"SolicitudCuenta", 'String'>
  readonly fechaRevision: Prisma.FieldRef<"SolicitudCuenta", 'DateTime'>
  readonly motivoRechazo: Prisma.FieldRef<"SolicitudCuenta", 'String'>
  readonly createdAt: Prisma.FieldRef<"SolicitudCuenta", 'DateTime'>
  readonly updatedAt: Prisma.FieldRef<"SolicitudCuenta", 'DateTime'>
}
    

export type SolicitudCuentaFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.SolicitudCuentaSelect<ExtArgs> | null
  omit?: Prisma.SolicitudCuentaOmit<ExtArgs> | null
  include?: Prisma.SolicitudCuentaInclude<ExtArgs> | null
  where: Prisma.SolicitudCuentaWhereUniqueInput
}

export type SolicitudCuentaFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.SolicitudCuentaSelect<ExtArgs> | null
  omit?: Prisma.SolicitudCuentaOmit<ExtArgs> | null
  include?: Prisma.SolicitudCuentaInclude<ExtArgs> | null
  where: Prisma.SolicitudCuentaWhereUniqueInput
}

export type SolicitudCuentaFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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

export type SolicitudCuentaFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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

export type SolicitudCuentaFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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

export type SolicitudCuentaCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.UsuarioSelect<ExtArgs> | null
  omit?: Prisma.UsuarioOmit<ExtArgs> | null
  include?: Prisma.UsuarioInclude<ExtArgs> | null
  data: Prisma.XOR<Prisma.SolicitudCuentaCreateInput, Prisma.SolicitudCuentaUncheckedCreateInput>
}

export type SolicitudCuentaCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  data: Prisma.SolicitudCuentaCreateManyInput | Prisma.SolicitudCuentaCreateManyInput[]
  skipDuplicates?: boolean
}

export type SolicitudCuentaCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.SolicitudCuentaSelectCreateManyAndReturn<ExtArgs> | null
  omit?: Prisma.SolicitudCuentaOmit<ExtArgs> | null
  data: Prisma.SolicitudCuentaCreateManyInput | Prisma.SolicitudCuentaCreateManyInput[]
  skipDuplicates?: boolean
  include?: Prisma.SolicitudCuentaIncludeCreateManyAndReturn<ExtArgs> | null
}

export type SolicitudCuentaUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.SolicitudCuentaSelect<ExtArgs> | null
  omit?: Prisma.SolicitudCuentaOmit<ExtArgs> | null
  include?: Prisma.SolicitudCuentaInclude<ExtArgs> | null
  data: Prisma.XOR<Prisma.SolicitudCuentaUpdateInput, Prisma.SolicitudCuentaUncheckedUpdateInput>
  where: Prisma.SolicitudCuentaWhereUniqueInput
}

export type SolicitudCuentaUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  data: Prisma.XOR<Prisma.SolicitudCuentaUpdateManyMutationInput, Prisma.SolicitudCuentaUncheckedUpdateManyInput>
  where?: Prisma.SolicitudCuentaWhereInput
  limit?: number
}

export type SolicitudCuentaUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.SolicitudCuentaSelectUpdateManyAndReturn<ExtArgs> | null
  omit?: Prisma.SolicitudCuentaOmit<ExtArgs> | null
  data: Prisma.XOR<Prisma.SolicitudCuentaUpdateManyMutationInput, Prisma.SolicitudCuentaUncheckedUpdateManyInput>
  where?: Prisma.SolicitudCuentaWhereInput
  limit?: number
  include?: Prisma.SolicitudCuentaIncludeUpdateManyAndReturn<ExtArgs> | null
}

export type SolicitudCuentaUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.SolicitudCuentaSelect<ExtArgs> | null
  omit?: Prisma.SolicitudCuentaOmit<ExtArgs> | null
  include?: Prisma.SolicitudCuentaInclude<ExtArgs> | null
  where: Prisma.SolicitudCuentaWhereUniqueInput
  create: Prisma.XOR<Prisma.SolicitudCuentaCreateInput, Prisma.SolicitudCuentaUncheckedCreateInput>
  update: Prisma.XOR<Prisma.SolicitudCuentaUpdateInput, Prisma.SolicitudCuentaUncheckedUpdateInput>
}

export type SolicitudCuentaDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.SolicitudCuentaSelect<ExtArgs> | null
  omit?: Prisma.SolicitudCuentaOmit<ExtArgs> | null
  include?: Prisma.SolicitudCuentaInclude<ExtArgs> | null
  where: Prisma.SolicitudCuentaWhereUniqueInput
}

export type SolicitudCuentaDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.SolicitudCuentaWhereInput
  limit?: number
}

export type SolicitudCuenta$revisorArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.UsuarioSelect<ExtArgs> | null
  omit?: Prisma.UsuarioOmit<ExtArgs> | null
  include?: Prisma.UsuarioInclude<ExtArgs> | null
  where?: Prisma.UsuarioWhereInput
}

export type SolicitudCuentaDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.SolicitudCuentaSelect<ExtArgs> | null
  omit?: Prisma.SolicitudCuentaOmit<ExtArgs> | null
  include?: Prisma.SolicitudCuentaInclude<ExtArgs> | null
}
