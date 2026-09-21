
import type * as runtime from "@prisma/client/runtime/client"
import type * as $Enums from "../enums.js"
import type * as Prisma from "../internal/prismaNamespace.js"

export type EventoSeguridadModel = runtime.Types.Result.DefaultSelection<Prisma.$EventoSeguridadPayload>

export type AggregateEventoSeguridad = {
  _count: EventoSeguridadCountAggregateOutputType | null
  _min: EventoSeguridadMinAggregateOutputType | null
  _max: EventoSeguridadMaxAggregateOutputType | null
}

export type EventoSeguridadMinAggregateOutputType = {
  idEvento: string | null
  idUsuario: string | null
  tipoEvento: $Enums.TipoEventoSeguridad | null
  identificador: string | null
  exitoso: boolean | null
  motivoFallo: string | null
  direccionIpHash: string | null
  userAgent: string | null
  createdAt: Date | null
}

export type EventoSeguridadMaxAggregateOutputType = {
  idEvento: string | null
  idUsuario: string | null
  tipoEvento: $Enums.TipoEventoSeguridad | null
  identificador: string | null
  exitoso: boolean | null
  motivoFallo: string | null
  direccionIpHash: string | null
  userAgent: string | null
  createdAt: Date | null
}

export type EventoSeguridadCountAggregateOutputType = {
  idEvento: number
  idUsuario: number
  tipoEvento: number
  identificador: number
  exitoso: number
  motivoFallo: number
  direccionIpHash: number
  userAgent: number
  createdAt: number
  _all: number
}

export type EventoSeguridadMinAggregateInputType = {
  idEvento?: true
  idUsuario?: true
  tipoEvento?: true
  identificador?: true
  exitoso?: true
  motivoFallo?: true
  direccionIpHash?: true
  userAgent?: true
  createdAt?: true
}

export type EventoSeguridadMaxAggregateInputType = {
  idEvento?: true
  idUsuario?: true
  tipoEvento?: true
  identificador?: true
  exitoso?: true
  motivoFallo?: true
  direccionIpHash?: true
  userAgent?: true
  createdAt?: true
}

export type EventoSeguridadCountAggregateInputType = {
  idEvento?: true
  idUsuario?: true
  tipoEvento?: true
  identificador?: true
  exitoso?: true
  motivoFallo?: true
  direccionIpHash?: true
  userAgent?: true
  createdAt?: true
  _all?: true
}

export type EventoSeguridadAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  where?: Prisma.EventoSeguridadWhereInput

  orderBy?: Prisma.EventoSeguridadOrderByWithRelationInput | Prisma.EventoSeguridadOrderByWithRelationInput[]

  cursor?: Prisma.EventoSeguridadWhereUniqueInput

  take?: number

  skip?: number

  _count?: true | EventoSeguridadCountAggregateInputType

  _min?: EventoSeguridadMinAggregateInputType

  _max?: EventoSeguridadMaxAggregateInputType
}

export type GetEventoSeguridadAggregateType<T extends EventoSeguridadAggregateArgs> = {
      [P in keyof T & keyof AggregateEventoSeguridad]: P extends '_count' | 'count'
    ? T[P] extends true
      ? number
      : Prisma.GetScalarType<T[P], AggregateEventoSeguridad[P]>
    : Prisma.GetScalarType<T[P], AggregateEventoSeguridad[P]>
}

export type EventoSeguridadGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.EventoSeguridadWhereInput
  orderBy?: Prisma.EventoSeguridadOrderByWithAggregationInput | Prisma.EventoSeguridadOrderByWithAggregationInput[]
  by: Prisma.EventoSeguridadScalarFieldEnum[] | Prisma.EventoSeguridadScalarFieldEnum
  having?: Prisma.EventoSeguridadScalarWhereWithAggregatesInput
  take?: number
  skip?: number
  _count?: EventoSeguridadCountAggregateInputType | true
  _min?: EventoSeguridadMinAggregateInputType
  _max?: EventoSeguridadMaxAggregateInputType
}

export type EventoSeguridadGroupByOutputType = {
  idEvento: string
  idUsuario: string | null
  tipoEvento: $Enums.TipoEventoSeguridad
  identificador: string | null
  exitoso: boolean
  motivoFallo: string | null
  direccionIpHash: string | null
  userAgent: string | null
  createdAt: Date
  _count: EventoSeguridadCountAggregateOutputType | null
  _min: EventoSeguridadMinAggregateOutputType | null
  _max: EventoSeguridadMaxAggregateOutputType | null
}

export type GetEventoSeguridadGroupByPayload<T extends EventoSeguridadGroupByArgs> = Prisma.PrismaPromise<
  Array<
    Prisma.PickEnumerable<EventoSeguridadGroupByOutputType, T['by']> &
      {
        [P in ((keyof T) & (keyof EventoSeguridadGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : Prisma.GetScalarType<T[P], EventoSeguridadGroupByOutputType[P]>
          : Prisma.GetScalarType<T[P], EventoSeguridadGroupByOutputType[P]>
      }
    >
  >

export type EventoSeguridadWhereInput = {
  AND?: Prisma.EventoSeguridadWhereInput | Prisma.EventoSeguridadWhereInput[]
  OR?: Prisma.EventoSeguridadWhereInput[]
  NOT?: Prisma.EventoSeguridadWhereInput | Prisma.EventoSeguridadWhereInput[]
  idEvento?: Prisma.UuidFilter<"EventoSeguridad"> | string
  idUsuario?: Prisma.UuidNullableFilter<"EventoSeguridad"> | string | null
  tipoEvento?: Prisma.EnumTipoEventoSeguridadFilter<"EventoSeguridad"> | $Enums.TipoEventoSeguridad
  identificador?: Prisma.StringNullableFilter<"EventoSeguridad"> | string | null
  exitoso?: Prisma.BoolFilter<"EventoSeguridad"> | boolean
  motivoFallo?: Prisma.StringNullableFilter<"EventoSeguridad"> | string | null
  direccionIpHash?: Prisma.StringNullableFilter<"EventoSeguridad"> | string | null
  userAgent?: Prisma.StringNullableFilter<"EventoSeguridad"> | string | null
  createdAt?: Prisma.DateTimeFilter<"EventoSeguridad"> | Date | string
  usuario?: Prisma.XOR<Prisma.UsuarioNullableScalarRelationFilter, Prisma.UsuarioWhereInput> | null
}

export type EventoSeguridadOrderByWithRelationInput = {
  idEvento?: Prisma.SortOrder
  idUsuario?: Prisma.SortOrderInput | Prisma.SortOrder
  tipoEvento?: Prisma.SortOrder
  identificador?: Prisma.SortOrderInput | Prisma.SortOrder
  exitoso?: Prisma.SortOrder
  motivoFallo?: Prisma.SortOrderInput | Prisma.SortOrder
  direccionIpHash?: Prisma.SortOrderInput | Prisma.SortOrder
  userAgent?: Prisma.SortOrderInput | Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  usuario?: Prisma.UsuarioOrderByWithRelationInput
}

export type EventoSeguridadWhereUniqueInput = Prisma.AtLeast<{
  idEvento?: string
  AND?: Prisma.EventoSeguridadWhereInput | Prisma.EventoSeguridadWhereInput[]
  OR?: Prisma.EventoSeguridadWhereInput[]
  NOT?: Prisma.EventoSeguridadWhereInput | Prisma.EventoSeguridadWhereInput[]
  idUsuario?: Prisma.UuidNullableFilter<"EventoSeguridad"> | string | null
  tipoEvento?: Prisma.EnumTipoEventoSeguridadFilter<"EventoSeguridad"> | $Enums.TipoEventoSeguridad
  identificador?: Prisma.StringNullableFilter<"EventoSeguridad"> | string | null
  exitoso?: Prisma.BoolFilter<"EventoSeguridad"> | boolean
  motivoFallo?: Prisma.StringNullableFilter<"EventoSeguridad"> | string | null
  direccionIpHash?: Prisma.StringNullableFilter<"EventoSeguridad"> | string | null
  userAgent?: Prisma.StringNullableFilter<"EventoSeguridad"> | string | null
  createdAt?: Prisma.DateTimeFilter<"EventoSeguridad"> | Date | string
  usuario?: Prisma.XOR<Prisma.UsuarioNullableScalarRelationFilter, Prisma.UsuarioWhereInput> | null
}, "idEvento">

export type EventoSeguridadOrderByWithAggregationInput = {
  idEvento?: Prisma.SortOrder
  idUsuario?: Prisma.SortOrderInput | Prisma.SortOrder
  tipoEvento?: Prisma.SortOrder
  identificador?: Prisma.SortOrderInput | Prisma.SortOrder
  exitoso?: Prisma.SortOrder
  motivoFallo?: Prisma.SortOrderInput | Prisma.SortOrder
  direccionIpHash?: Prisma.SortOrderInput | Prisma.SortOrder
  userAgent?: Prisma.SortOrderInput | Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  _count?: Prisma.EventoSeguridadCountOrderByAggregateInput
  _max?: Prisma.EventoSeguridadMaxOrderByAggregateInput
  _min?: Prisma.EventoSeguridadMinOrderByAggregateInput
}

export type EventoSeguridadScalarWhereWithAggregatesInput = {
  AND?: Prisma.EventoSeguridadScalarWhereWithAggregatesInput | Prisma.EventoSeguridadScalarWhereWithAggregatesInput[]
  OR?: Prisma.EventoSeguridadScalarWhereWithAggregatesInput[]
  NOT?: Prisma.EventoSeguridadScalarWhereWithAggregatesInput | Prisma.EventoSeguridadScalarWhereWithAggregatesInput[]
  idEvento?: Prisma.UuidWithAggregatesFilter<"EventoSeguridad"> | string
  idUsuario?: Prisma.UuidNullableWithAggregatesFilter<"EventoSeguridad"> | string | null
  tipoEvento?: Prisma.EnumTipoEventoSeguridadWithAggregatesFilter<"EventoSeguridad"> | $Enums.TipoEventoSeguridad
  identificador?: Prisma.StringNullableWithAggregatesFilter<"EventoSeguridad"> | string | null
  exitoso?: Prisma.BoolWithAggregatesFilter<"EventoSeguridad"> | boolean
  motivoFallo?: Prisma.StringNullableWithAggregatesFilter<"EventoSeguridad"> | string | null
  direccionIpHash?: Prisma.StringNullableWithAggregatesFilter<"EventoSeguridad"> | string | null
  userAgent?: Prisma.StringNullableWithAggregatesFilter<"EventoSeguridad"> | string | null
  createdAt?: Prisma.DateTimeWithAggregatesFilter<"EventoSeguridad"> | Date | string
}

export type EventoSeguridadCreateInput = {
  idEvento?: string
  tipoEvento: $Enums.TipoEventoSeguridad
  identificador?: string | null
  exitoso?: boolean
  motivoFallo?: string | null
  direccionIpHash?: string | null
  userAgent?: string | null
  createdAt?: Date | string
  usuario?: Prisma.UsuarioCreateNestedOneWithoutEventosSeguridadInput
}

export type EventoSeguridadUncheckedCreateInput = {
  idEvento?: string
  idUsuario?: string | null
  tipoEvento: $Enums.TipoEventoSeguridad
  identificador?: string | null
  exitoso?: boolean
  motivoFallo?: string | null
  direccionIpHash?: string | null
  userAgent?: string | null
  createdAt?: Date | string
}

export type EventoSeguridadUpdateInput = {
  idEvento?: Prisma.StringFieldUpdateOperationsInput | string
  tipoEvento?: Prisma.EnumTipoEventoSeguridadFieldUpdateOperationsInput | $Enums.TipoEventoSeguridad
  identificador?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  exitoso?: Prisma.BoolFieldUpdateOperationsInput | boolean
  motivoFallo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  direccionIpHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  userAgent?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  usuario?: Prisma.UsuarioUpdateOneWithoutEventosSeguridadNestedInput
}

export type EventoSeguridadUncheckedUpdateInput = {
  idEvento?: Prisma.StringFieldUpdateOperationsInput | string
  idUsuario?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  tipoEvento?: Prisma.EnumTipoEventoSeguridadFieldUpdateOperationsInput | $Enums.TipoEventoSeguridad
  identificador?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  exitoso?: Prisma.BoolFieldUpdateOperationsInput | boolean
  motivoFallo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  direccionIpHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  userAgent?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type EventoSeguridadCreateManyInput = {
  idEvento?: string
  idUsuario?: string | null
  tipoEvento: $Enums.TipoEventoSeguridad
  identificador?: string | null
  exitoso?: boolean
  motivoFallo?: string | null
  direccionIpHash?: string | null
  userAgent?: string | null
  createdAt?: Date | string
}

export type EventoSeguridadUpdateManyMutationInput = {
  idEvento?: Prisma.StringFieldUpdateOperationsInput | string
  tipoEvento?: Prisma.EnumTipoEventoSeguridadFieldUpdateOperationsInput | $Enums.TipoEventoSeguridad
  identificador?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  exitoso?: Prisma.BoolFieldUpdateOperationsInput | boolean
  motivoFallo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  direccionIpHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  userAgent?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type EventoSeguridadUncheckedUpdateManyInput = {
  idEvento?: Prisma.StringFieldUpdateOperationsInput | string
  idUsuario?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  tipoEvento?: Prisma.EnumTipoEventoSeguridadFieldUpdateOperationsInput | $Enums.TipoEventoSeguridad
  identificador?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  exitoso?: Prisma.BoolFieldUpdateOperationsInput | boolean
  motivoFallo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  direccionIpHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  userAgent?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type EventoSeguridadListRelationFilter = {
  every?: Prisma.EventoSeguridadWhereInput
  some?: Prisma.EventoSeguridadWhereInput
  none?: Prisma.EventoSeguridadWhereInput
}

export type EventoSeguridadOrderByRelationAggregateInput = {
  _count?: Prisma.SortOrder
}

export type EventoSeguridadCountOrderByAggregateInput = {
  idEvento?: Prisma.SortOrder
  idUsuario?: Prisma.SortOrder
  tipoEvento?: Prisma.SortOrder
  identificador?: Prisma.SortOrder
  exitoso?: Prisma.SortOrder
  motivoFallo?: Prisma.SortOrder
  direccionIpHash?: Prisma.SortOrder
  userAgent?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
}

export type EventoSeguridadMaxOrderByAggregateInput = {
  idEvento?: Prisma.SortOrder
  idUsuario?: Prisma.SortOrder
  tipoEvento?: Prisma.SortOrder
  identificador?: Prisma.SortOrder
  exitoso?: Prisma.SortOrder
  motivoFallo?: Prisma.SortOrder
  direccionIpHash?: Prisma.SortOrder
  userAgent?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
}

export type EventoSeguridadMinOrderByAggregateInput = {
  idEvento?: Prisma.SortOrder
  idUsuario?: Prisma.SortOrder
  tipoEvento?: Prisma.SortOrder
  identificador?: Prisma.SortOrder
  exitoso?: Prisma.SortOrder
  motivoFallo?: Prisma.SortOrder
  direccionIpHash?: Prisma.SortOrder
  userAgent?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
}

export type EventoSeguridadCreateNestedManyWithoutUsuarioInput = {
  create?: Prisma.XOR<Prisma.EventoSeguridadCreateWithoutUsuarioInput, Prisma.EventoSeguridadUncheckedCreateWithoutUsuarioInput> | Prisma.EventoSeguridadCreateWithoutUsuarioInput[] | Prisma.EventoSeguridadUncheckedCreateWithoutUsuarioInput[]
  connectOrCreate?: Prisma.EventoSeguridadCreateOrConnectWithoutUsuarioInput | Prisma.EventoSeguridadCreateOrConnectWithoutUsuarioInput[]
  createMany?: Prisma.EventoSeguridadCreateManyUsuarioInputEnvelope
  connect?: Prisma.EventoSeguridadWhereUniqueInput | Prisma.EventoSeguridadWhereUniqueInput[]
}

export type EventoSeguridadUncheckedCreateNestedManyWithoutUsuarioInput = {
  create?: Prisma.XOR<Prisma.EventoSeguridadCreateWithoutUsuarioInput, Prisma.EventoSeguridadUncheckedCreateWithoutUsuarioInput> | Prisma.EventoSeguridadCreateWithoutUsuarioInput[] | Prisma.EventoSeguridadUncheckedCreateWithoutUsuarioInput[]
  connectOrCreate?: Prisma.EventoSeguridadCreateOrConnectWithoutUsuarioInput | Prisma.EventoSeguridadCreateOrConnectWithoutUsuarioInput[]
  createMany?: Prisma.EventoSeguridadCreateManyUsuarioInputEnvelope
  connect?: Prisma.EventoSeguridadWhereUniqueInput | Prisma.EventoSeguridadWhereUniqueInput[]
}

export type EventoSeguridadUpdateManyWithoutUsuarioNestedInput = {
  create?: Prisma.XOR<Prisma.EventoSeguridadCreateWithoutUsuarioInput, Prisma.EventoSeguridadUncheckedCreateWithoutUsuarioInput> | Prisma.EventoSeguridadCreateWithoutUsuarioInput[] | Prisma.EventoSeguridadUncheckedCreateWithoutUsuarioInput[]
  connectOrCreate?: Prisma.EventoSeguridadCreateOrConnectWithoutUsuarioInput | Prisma.EventoSeguridadCreateOrConnectWithoutUsuarioInput[]
  upsert?: Prisma.EventoSeguridadUpsertWithWhereUniqueWithoutUsuarioInput | Prisma.EventoSeguridadUpsertWithWhereUniqueWithoutUsuarioInput[]
  createMany?: Prisma.EventoSeguridadCreateManyUsuarioInputEnvelope
  set?: Prisma.EventoSeguridadWhereUniqueInput | Prisma.EventoSeguridadWhereUniqueInput[]
  disconnect?: Prisma.EventoSeguridadWhereUniqueInput | Prisma.EventoSeguridadWhereUniqueInput[]
  delete?: Prisma.EventoSeguridadWhereUniqueInput | Prisma.EventoSeguridadWhereUniqueInput[]
  connect?: Prisma.EventoSeguridadWhereUniqueInput | Prisma.EventoSeguridadWhereUniqueInput[]
  update?: Prisma.EventoSeguridadUpdateWithWhereUniqueWithoutUsuarioInput | Prisma.EventoSeguridadUpdateWithWhereUniqueWithoutUsuarioInput[]
  updateMany?: Prisma.EventoSeguridadUpdateManyWithWhereWithoutUsuarioInput | Prisma.EventoSeguridadUpdateManyWithWhereWithoutUsuarioInput[]
  deleteMany?: Prisma.EventoSeguridadScalarWhereInput | Prisma.EventoSeguridadScalarWhereInput[]
}

export type EventoSeguridadUncheckedUpdateManyWithoutUsuarioNestedInput = {
  create?: Prisma.XOR<Prisma.EventoSeguridadCreateWithoutUsuarioInput, Prisma.EventoSeguridadUncheckedCreateWithoutUsuarioInput> | Prisma.EventoSeguridadCreateWithoutUsuarioInput[] | Prisma.EventoSeguridadUncheckedCreateWithoutUsuarioInput[]
  connectOrCreate?: Prisma.EventoSeguridadCreateOrConnectWithoutUsuarioInput | Prisma.EventoSeguridadCreateOrConnectWithoutUsuarioInput[]
  upsert?: Prisma.EventoSeguridadUpsertWithWhereUniqueWithoutUsuarioInput | Prisma.EventoSeguridadUpsertWithWhereUniqueWithoutUsuarioInput[]
  createMany?: Prisma.EventoSeguridadCreateManyUsuarioInputEnvelope
  set?: Prisma.EventoSeguridadWhereUniqueInput | Prisma.EventoSeguridadWhereUniqueInput[]
  disconnect?: Prisma.EventoSeguridadWhereUniqueInput | Prisma.EventoSeguridadWhereUniqueInput[]
  delete?: Prisma.EventoSeguridadWhereUniqueInput | Prisma.EventoSeguridadWhereUniqueInput[]
  connect?: Prisma.EventoSeguridadWhereUniqueInput | Prisma.EventoSeguridadWhereUniqueInput[]
  update?: Prisma.EventoSeguridadUpdateWithWhereUniqueWithoutUsuarioInput | Prisma.EventoSeguridadUpdateWithWhereUniqueWithoutUsuarioInput[]
  updateMany?: Prisma.EventoSeguridadUpdateManyWithWhereWithoutUsuarioInput | Prisma.EventoSeguridadUpdateManyWithWhereWithoutUsuarioInput[]
  deleteMany?: Prisma.EventoSeguridadScalarWhereInput | Prisma.EventoSeguridadScalarWhereInput[]
}

export type EnumTipoEventoSeguridadFieldUpdateOperationsInput = {
  set?: $Enums.TipoEventoSeguridad
}

export type EventoSeguridadCreateWithoutUsuarioInput = {
  idEvento?: string
  tipoEvento: $Enums.TipoEventoSeguridad
  identificador?: string | null
  exitoso?: boolean
  motivoFallo?: string | null
  direccionIpHash?: string | null
  userAgent?: string | null
  createdAt?: Date | string
}

export type EventoSeguridadUncheckedCreateWithoutUsuarioInput = {
  idEvento?: string
  tipoEvento: $Enums.TipoEventoSeguridad
  identificador?: string | null
  exitoso?: boolean
  motivoFallo?: string | null
  direccionIpHash?: string | null
  userAgent?: string | null
  createdAt?: Date | string
}

export type EventoSeguridadCreateOrConnectWithoutUsuarioInput = {
  where: Prisma.EventoSeguridadWhereUniqueInput
  create: Prisma.XOR<Prisma.EventoSeguridadCreateWithoutUsuarioInput, Prisma.EventoSeguridadUncheckedCreateWithoutUsuarioInput>
}

export type EventoSeguridadCreateManyUsuarioInputEnvelope = {
  data: Prisma.EventoSeguridadCreateManyUsuarioInput | Prisma.EventoSeguridadCreateManyUsuarioInput[]
  skipDuplicates?: boolean
}

export type EventoSeguridadUpsertWithWhereUniqueWithoutUsuarioInput = {
  where: Prisma.EventoSeguridadWhereUniqueInput
  update: Prisma.XOR<Prisma.EventoSeguridadUpdateWithoutUsuarioInput, Prisma.EventoSeguridadUncheckedUpdateWithoutUsuarioInput>
  create: Prisma.XOR<Prisma.EventoSeguridadCreateWithoutUsuarioInput, Prisma.EventoSeguridadUncheckedCreateWithoutUsuarioInput>
}

export type EventoSeguridadUpdateWithWhereUniqueWithoutUsuarioInput = {
  where: Prisma.EventoSeguridadWhereUniqueInput
  data: Prisma.XOR<Prisma.EventoSeguridadUpdateWithoutUsuarioInput, Prisma.EventoSeguridadUncheckedUpdateWithoutUsuarioInput>
}

export type EventoSeguridadUpdateManyWithWhereWithoutUsuarioInput = {
  where: Prisma.EventoSeguridadScalarWhereInput
  data: Prisma.XOR<Prisma.EventoSeguridadUpdateManyMutationInput, Prisma.EventoSeguridadUncheckedUpdateManyWithoutUsuarioInput>
}

export type EventoSeguridadScalarWhereInput = {
  AND?: Prisma.EventoSeguridadScalarWhereInput | Prisma.EventoSeguridadScalarWhereInput[]
  OR?: Prisma.EventoSeguridadScalarWhereInput[]
  NOT?: Prisma.EventoSeguridadScalarWhereInput | Prisma.EventoSeguridadScalarWhereInput[]
  idEvento?: Prisma.UuidFilter<"EventoSeguridad"> | string
  idUsuario?: Prisma.UuidNullableFilter<"EventoSeguridad"> | string | null
  tipoEvento?: Prisma.EnumTipoEventoSeguridadFilter<"EventoSeguridad"> | $Enums.TipoEventoSeguridad
  identificador?: Prisma.StringNullableFilter<"EventoSeguridad"> | string | null
  exitoso?: Prisma.BoolFilter<"EventoSeguridad"> | boolean
  motivoFallo?: Prisma.StringNullableFilter<"EventoSeguridad"> | string | null
  direccionIpHash?: Prisma.StringNullableFilter<"EventoSeguridad"> | string | null
  userAgent?: Prisma.StringNullableFilter<"EventoSeguridad"> | string | null
  createdAt?: Prisma.DateTimeFilter<"EventoSeguridad"> | Date | string
}

export type EventoSeguridadCreateManyUsuarioInput = {
  idEvento?: string
  tipoEvento: $Enums.TipoEventoSeguridad
  identificador?: string | null
  exitoso?: boolean
  motivoFallo?: string | null
  direccionIpHash?: string | null
  userAgent?: string | null
  createdAt?: Date | string
}

export type EventoSeguridadUpdateWithoutUsuarioInput = {
  idEvento?: Prisma.StringFieldUpdateOperationsInput | string
  tipoEvento?: Prisma.EnumTipoEventoSeguridadFieldUpdateOperationsInput | $Enums.TipoEventoSeguridad
  identificador?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  exitoso?: Prisma.BoolFieldUpdateOperationsInput | boolean
  motivoFallo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  direccionIpHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  userAgent?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type EventoSeguridadUncheckedUpdateWithoutUsuarioInput = {
  idEvento?: Prisma.StringFieldUpdateOperationsInput | string
  tipoEvento?: Prisma.EnumTipoEventoSeguridadFieldUpdateOperationsInput | $Enums.TipoEventoSeguridad
  identificador?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  exitoso?: Prisma.BoolFieldUpdateOperationsInput | boolean
  motivoFallo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  direccionIpHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  userAgent?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type EventoSeguridadUncheckedUpdateManyWithoutUsuarioInput = {
  idEvento?: Prisma.StringFieldUpdateOperationsInput | string
  tipoEvento?: Prisma.EnumTipoEventoSeguridadFieldUpdateOperationsInput | $Enums.TipoEventoSeguridad
  identificador?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  exitoso?: Prisma.BoolFieldUpdateOperationsInput | boolean
  motivoFallo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  direccionIpHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  userAgent?: Prisma.NullableStringFieldUpdateOperationsInput | string | null
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type EventoSeguridadSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  idEvento?: boolean
  idUsuario?: boolean
  tipoEvento?: boolean
  identificador?: boolean
  exitoso?: boolean
  motivoFallo?: boolean
  direccionIpHash?: boolean
  userAgent?: boolean
  createdAt?: boolean
  usuario?: boolean | Prisma.EventoSeguridad$usuarioArgs<ExtArgs>
}, ExtArgs["result"]["eventoSeguridad"]>

export type EventoSeguridadSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  idEvento?: boolean
  idUsuario?: boolean
  tipoEvento?: boolean
  identificador?: boolean
  exitoso?: boolean
  motivoFallo?: boolean
  direccionIpHash?: boolean
  userAgent?: boolean
  createdAt?: boolean
  usuario?: boolean | Prisma.EventoSeguridad$usuarioArgs<ExtArgs>
}, ExtArgs["result"]["eventoSeguridad"]>

export type EventoSeguridadSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  idEvento?: boolean
  idUsuario?: boolean
  tipoEvento?: boolean
  identificador?: boolean
  exitoso?: boolean
  motivoFallo?: boolean
  direccionIpHash?: boolean
  userAgent?: boolean
  createdAt?: boolean
  usuario?: boolean | Prisma.EventoSeguridad$usuarioArgs<ExtArgs>
}, ExtArgs["result"]["eventoSeguridad"]>

export type EventoSeguridadSelectScalar = {
  idEvento?: boolean
  idUsuario?: boolean
  tipoEvento?: boolean
  identificador?: boolean
  exitoso?: boolean
  motivoFallo?: boolean
  direccionIpHash?: boolean
  userAgent?: boolean
  createdAt?: boolean
}

export type EventoSeguridadOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"idEvento" | "idUsuario" | "tipoEvento" | "identificador" | "exitoso" | "motivoFallo" | "direccionIpHash" | "userAgent" | "createdAt", ExtArgs["result"]["eventoSeguridad"]>
export type EventoSeguridadInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  usuario?: boolean | Prisma.EventoSeguridad$usuarioArgs<ExtArgs>
}
export type EventoSeguridadIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  usuario?: boolean | Prisma.EventoSeguridad$usuarioArgs<ExtArgs>
}
export type EventoSeguridadIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  usuario?: boolean | Prisma.EventoSeguridad$usuarioArgs<ExtArgs>
}

export type $EventoSeguridadPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  name: "EventoSeguridad"
  objects: {
    usuario: Prisma.$UsuarioPayload<ExtArgs> | null
  }
  scalars: runtime.Types.Extensions.GetPayloadResult<{
    idEvento: string
    idUsuario: string | null
    tipoEvento: $Enums.TipoEventoSeguridad
    identificador: string | null
    exitoso: boolean
    motivoFallo: string | null
    direccionIpHash: string | null
    userAgent: string | null
    createdAt: Date
  }, ExtArgs["result"]["eventoSeguridad"]>
  composites: {}
}

export type EventoSeguridadGetPayload<S extends boolean | null | undefined | EventoSeguridadDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EventoSeguridadPayload, S>

export type EventoSeguridadCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> =
  Omit<EventoSeguridadFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EventoSeguridadCountAggregateInputType | true
  }

export interface EventoSeguridadDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EventoSeguridad'], meta: { name: 'EventoSeguridad' } }

  findUnique<T extends EventoSeguridadFindUniqueArgs>(args: Prisma.SelectSubset<T, EventoSeguridadFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EventoSeguridadClient<runtime.Types.Result.GetResult<Prisma.$EventoSeguridadPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  findUniqueOrThrow<T extends EventoSeguridadFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EventoSeguridadFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EventoSeguridadClient<runtime.Types.Result.GetResult<Prisma.$EventoSeguridadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  findFirst<T extends EventoSeguridadFindFirstArgs>(args?: Prisma.SelectSubset<T, EventoSeguridadFindFirstArgs<ExtArgs>>): Prisma.Prisma__EventoSeguridadClient<runtime.Types.Result.GetResult<Prisma.$EventoSeguridadPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  findFirstOrThrow<T extends EventoSeguridadFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EventoSeguridadFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EventoSeguridadClient<runtime.Types.Result.GetResult<Prisma.$EventoSeguridadPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  findMany<T extends EventoSeguridadFindManyArgs>(args?: Prisma.SelectSubset<T, EventoSeguridadFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventoSeguridadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

  create<T extends EventoSeguridadCreateArgs>(args: Prisma.SelectSubset<T, EventoSeguridadCreateArgs<ExtArgs>>): Prisma.Prisma__EventoSeguridadClient<runtime.Types.Result.GetResult<Prisma.$EventoSeguridadPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  createMany<T extends EventoSeguridadCreateManyArgs>(args?: Prisma.SelectSubset<T, EventoSeguridadCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  createManyAndReturn<T extends EventoSeguridadCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, EventoSeguridadCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventoSeguridadPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

  delete<T extends EventoSeguridadDeleteArgs>(args: Prisma.SelectSubset<T, EventoSeguridadDeleteArgs<ExtArgs>>): Prisma.Prisma__EventoSeguridadClient<runtime.Types.Result.GetResult<Prisma.$EventoSeguridadPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  update<T extends EventoSeguridadUpdateArgs>(args: Prisma.SelectSubset<T, EventoSeguridadUpdateArgs<ExtArgs>>): Prisma.Prisma__EventoSeguridadClient<runtime.Types.Result.GetResult<Prisma.$EventoSeguridadPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  deleteMany<T extends EventoSeguridadDeleteManyArgs>(args?: Prisma.SelectSubset<T, EventoSeguridadDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  updateMany<T extends EventoSeguridadUpdateManyArgs>(args: Prisma.SelectSubset<T, EventoSeguridadUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  updateManyAndReturn<T extends EventoSeguridadUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, EventoSeguridadUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventoSeguridadPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

  upsert<T extends EventoSeguridadUpsertArgs>(args: Prisma.SelectSubset<T, EventoSeguridadUpsertArgs<ExtArgs>>): Prisma.Prisma__EventoSeguridadClient<runtime.Types.Result.GetResult<Prisma.$EventoSeguridadPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  count<T extends EventoSeguridadCountArgs>(
    args?: Prisma.Subset<T, EventoSeguridadCountArgs>,
  ): Prisma.PrismaPromise<
    T extends runtime.Types.Utils.Record<'select', any>
      ? T['select'] extends true
        ? number
        : Prisma.GetScalarType<T['select'], EventoSeguridadCountAggregateOutputType>
      : number
  >

  aggregate<T extends EventoSeguridadAggregateArgs>(args: Prisma.Subset<T, EventoSeguridadAggregateArgs>): Prisma.PrismaPromise<GetEventoSeguridadAggregateType<T>>

  groupBy<
    T extends EventoSeguridadGroupByArgs,
    HasSelectOrTake extends Prisma.Or<
      Prisma.Extends<'skip', Prisma.Keys<T>>,
      Prisma.Extends<'take', Prisma.Keys<T>>
    >,
    OrderByArg extends Prisma.True extends HasSelectOrTake
      ? { orderBy: EventoSeguridadGroupByArgs['orderBy'] }
      : { orderBy?: EventoSeguridadGroupByArgs['orderBy'] },
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
  >(args: Prisma.SubsetIntersection<T, EventoSeguridadGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventoSeguridadGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

readonly fields: EventoSeguridadFieldRefs;
}

export interface Prisma__EventoSeguridadClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
  readonly [Symbol.toStringTag]: "PrismaPromise"
  usuario<T extends Prisma.EventoSeguridad$usuarioArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.EventoSeguridad$usuarioArgs<ExtArgs>>): Prisma.Prisma__UsuarioClient<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>

  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>

  finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>
}

export interface EventoSeguridadFieldRefs {
  readonly idEvento: Prisma.FieldRef<"EventoSeguridad", 'String'>
  readonly idUsuario: Prisma.FieldRef<"EventoSeguridad", 'String'>
  readonly tipoEvento: Prisma.FieldRef<"EventoSeguridad", 'TipoEventoSeguridad'>
  readonly identificador: Prisma.FieldRef<"EventoSeguridad", 'String'>
  readonly exitoso: Prisma.FieldRef<"EventoSeguridad", 'Boolean'>
  readonly motivoFallo: Prisma.FieldRef<"EventoSeguridad", 'String'>
  readonly direccionIpHash: Prisma.FieldRef<"EventoSeguridad", 'String'>
  readonly userAgent: Prisma.FieldRef<"EventoSeguridad", 'String'>
  readonly createdAt: Prisma.FieldRef<"EventoSeguridad", 'DateTime'>
}

export type EventoSeguridadFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.EventoSeguridadSelect<ExtArgs> | null

  omit?: Prisma.EventoSeguridadOmit<ExtArgs> | null

  include?: Prisma.EventoSeguridadInclude<ExtArgs> | null

  where: Prisma.EventoSeguridadWhereUniqueInput
}

export type EventoSeguridadFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.EventoSeguridadSelect<ExtArgs> | null

  omit?: Prisma.EventoSeguridadOmit<ExtArgs> | null

  include?: Prisma.EventoSeguridadInclude<ExtArgs> | null

  where: Prisma.EventoSeguridadWhereUniqueInput
}

export type EventoSeguridadFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

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

export type EventoSeguridadFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

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

export type EventoSeguridadFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

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

export type EventoSeguridadCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.EventoSeguridadSelect<ExtArgs> | null

  omit?: Prisma.EventoSeguridadOmit<ExtArgs> | null

  include?: Prisma.EventoSeguridadInclude<ExtArgs> | null

  data: Prisma.XOR<Prisma.EventoSeguridadCreateInput, Prisma.EventoSeguridadUncheckedCreateInput>
}

export type EventoSeguridadCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  data: Prisma.EventoSeguridadCreateManyInput | Prisma.EventoSeguridadCreateManyInput[]
  skipDuplicates?: boolean
}

export type EventoSeguridadCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.EventoSeguridadSelectCreateManyAndReturn<ExtArgs> | null

  omit?: Prisma.EventoSeguridadOmit<ExtArgs> | null

  data: Prisma.EventoSeguridadCreateManyInput | Prisma.EventoSeguridadCreateManyInput[]
  skipDuplicates?: boolean

  include?: Prisma.EventoSeguridadIncludeCreateManyAndReturn<ExtArgs> | null
}

export type EventoSeguridadUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.EventoSeguridadSelect<ExtArgs> | null

  omit?: Prisma.EventoSeguridadOmit<ExtArgs> | null

  include?: Prisma.EventoSeguridadInclude<ExtArgs> | null

  data: Prisma.XOR<Prisma.EventoSeguridadUpdateInput, Prisma.EventoSeguridadUncheckedUpdateInput>

  where: Prisma.EventoSeguridadWhereUniqueInput
}

export type EventoSeguridadUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  data: Prisma.XOR<Prisma.EventoSeguridadUpdateManyMutationInput, Prisma.EventoSeguridadUncheckedUpdateManyInput>

  where?: Prisma.EventoSeguridadWhereInput

  limit?: number
}

export type EventoSeguridadUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.EventoSeguridadSelectUpdateManyAndReturn<ExtArgs> | null

  omit?: Prisma.EventoSeguridadOmit<ExtArgs> | null

  data: Prisma.XOR<Prisma.EventoSeguridadUpdateManyMutationInput, Prisma.EventoSeguridadUncheckedUpdateManyInput>

  where?: Prisma.EventoSeguridadWhereInput

  limit?: number

  include?: Prisma.EventoSeguridadIncludeUpdateManyAndReturn<ExtArgs> | null
}

export type EventoSeguridadUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.EventoSeguridadSelect<ExtArgs> | null

  omit?: Prisma.EventoSeguridadOmit<ExtArgs> | null

  include?: Prisma.EventoSeguridadInclude<ExtArgs> | null

  where: Prisma.EventoSeguridadWhereUniqueInput

  create: Prisma.XOR<Prisma.EventoSeguridadCreateInput, Prisma.EventoSeguridadUncheckedCreateInput>

  update: Prisma.XOR<Prisma.EventoSeguridadUpdateInput, Prisma.EventoSeguridadUncheckedUpdateInput>
}

export type EventoSeguridadDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.EventoSeguridadSelect<ExtArgs> | null

  omit?: Prisma.EventoSeguridadOmit<ExtArgs> | null

  include?: Prisma.EventoSeguridadInclude<ExtArgs> | null

  where: Prisma.EventoSeguridadWhereUniqueInput
}

export type EventoSeguridadDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  where?: Prisma.EventoSeguridadWhereInput

  limit?: number
}

export type EventoSeguridad$usuarioArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.UsuarioSelect<ExtArgs> | null

  omit?: Prisma.UsuarioOmit<ExtArgs> | null

  include?: Prisma.UsuarioInclude<ExtArgs> | null
  where?: Prisma.UsuarioWhereInput
}

export type EventoSeguridadDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.EventoSeguridadSelect<ExtArgs> | null

  omit?: Prisma.EventoSeguridadOmit<ExtArgs> | null

  include?: Prisma.EventoSeguridadInclude<ExtArgs> | null
}
