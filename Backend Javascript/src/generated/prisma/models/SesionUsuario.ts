import type * as runtime from "@prisma/client/runtime/client"
import type * as $Enums from "../enums.js"
import type * as Prisma from "../internal/prismaNamespace.js"

export type SesionUsuarioModel = runtime.Types.Result.DefaultSelection<Prisma.$SesionUsuarioPayload>

export type AggregateSesionUsuario = {
  _count: SesionUsuarioCountAggregateOutputType | null
  _min: SesionUsuarioMinAggregateOutputType | null
  _max: SesionUsuarioMaxAggregateOutputType | null
}

export type SesionUsuarioMinAggregateOutputType = {
  idSesion: string | null
  idUsuario: string | null
  tokenHash: string | null
  recordarSesion: boolean | null
  createdAt: Date | null
  ultimaActividadAt: Date | null
  expiresAt: Date | null
  revokedAt: Date | null
}

export type SesionUsuarioMaxAggregateOutputType = {
  idSesion: string | null
  idUsuario: string | null
  tokenHash: string | null
  recordarSesion: boolean | null
  createdAt: Date | null
  ultimaActividadAt: Date | null
  expiresAt: Date | null
  revokedAt: Date | null
}

export type SesionUsuarioCountAggregateOutputType = {
  idSesion: number
  idUsuario: number
  tokenHash: number
  recordarSesion: number
  createdAt: number
  ultimaActividadAt: number
  expiresAt: number
  revokedAt: number
  _all: number
}


export type SesionUsuarioMinAggregateInputType = {
  idSesion?: true
  idUsuario?: true
  tokenHash?: true
  recordarSesion?: true
  createdAt?: true
  ultimaActividadAt?: true
  expiresAt?: true
  revokedAt?: true
}

export type SesionUsuarioMaxAggregateInputType = {
  idSesion?: true
  idUsuario?: true
  tokenHash?: true
  recordarSesion?: true
  createdAt?: true
  ultimaActividadAt?: true
  expiresAt?: true
  revokedAt?: true
}

export type SesionUsuarioCountAggregateInputType = {
  idSesion?: true
  idUsuario?: true
  tokenHash?: true
  recordarSesion?: true
  createdAt?: true
  ultimaActividadAt?: true
  expiresAt?: true
  revokedAt?: true
  _all?: true
}

export type SesionUsuarioAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.SesionUsuarioWhereInput
  orderBy?: Prisma.SesionUsuarioOrderByWithRelationInput | Prisma.SesionUsuarioOrderByWithRelationInput[]
  cursor?: Prisma.SesionUsuarioWhereUniqueInput
  take?: number
  skip?: number
  _count?: true | SesionUsuarioCountAggregateInputType
  _min?: SesionUsuarioMinAggregateInputType
  _max?: SesionUsuarioMaxAggregateInputType
}

export type GetSesionUsuarioAggregateType<T extends SesionUsuarioAggregateArgs> = {
      [P in keyof T & keyof AggregateSesionUsuario]: P extends '_count' | 'count'
    ? T[P] extends true
      ? number
      : Prisma.GetScalarType<T[P], AggregateSesionUsuario[P]>
    : Prisma.GetScalarType<T[P], AggregateSesionUsuario[P]>
}




export type SesionUsuarioGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.SesionUsuarioWhereInput
  orderBy?: Prisma.SesionUsuarioOrderByWithAggregationInput | Prisma.SesionUsuarioOrderByWithAggregationInput[]
  by: Prisma.SesionUsuarioScalarFieldEnum[] | Prisma.SesionUsuarioScalarFieldEnum
  having?: Prisma.SesionUsuarioScalarWhereWithAggregatesInput
  take?: number
  skip?: number
  _count?: SesionUsuarioCountAggregateInputType | true
  _min?: SesionUsuarioMinAggregateInputType
  _max?: SesionUsuarioMaxAggregateInputType
}

export type SesionUsuarioGroupByOutputType = {
  idSesion: string
  idUsuario: string
  tokenHash: string
  recordarSesion: boolean
  createdAt: Date
  ultimaActividadAt: Date
  expiresAt: Date
  revokedAt: Date | null
  _count: SesionUsuarioCountAggregateOutputType | null
  _min: SesionUsuarioMinAggregateOutputType | null
  _max: SesionUsuarioMaxAggregateOutputType | null
}

export type GetSesionUsuarioGroupByPayload<T extends SesionUsuarioGroupByArgs> = Prisma.PrismaPromise<
  Array<
    Prisma.PickEnumerable<SesionUsuarioGroupByOutputType, T['by']> &
      {
        [P in ((keyof T) & (keyof SesionUsuarioGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : Prisma.GetScalarType<T[P], SesionUsuarioGroupByOutputType[P]>
          : Prisma.GetScalarType<T[P], SesionUsuarioGroupByOutputType[P]>
      }
    >
  >



export type SesionUsuarioWhereInput = {
  AND?: Prisma.SesionUsuarioWhereInput | Prisma.SesionUsuarioWhereInput[]
  OR?: Prisma.SesionUsuarioWhereInput[]
  NOT?: Prisma.SesionUsuarioWhereInput | Prisma.SesionUsuarioWhereInput[]
  idSesion?: Prisma.UuidFilter<"SesionUsuario"> | string
  idUsuario?: Prisma.UuidFilter<"SesionUsuario"> | string
  tokenHash?: Prisma.StringFilter<"SesionUsuario"> | string
  recordarSesion?: Prisma.BoolFilter<"SesionUsuario"> | boolean
  createdAt?: Prisma.DateTimeFilter<"SesionUsuario"> | Date | string
  ultimaActividadAt?: Prisma.DateTimeFilter<"SesionUsuario"> | Date | string
  expiresAt?: Prisma.DateTimeFilter<"SesionUsuario"> | Date | string
  revokedAt?: Prisma.DateTimeNullableFilter<"SesionUsuario"> | Date | string | null
  usuario?: Prisma.XOR<Prisma.UsuarioScalarRelationFilter, Prisma.UsuarioWhereInput>
}

export type SesionUsuarioOrderByWithRelationInput = {
  idSesion?: Prisma.SortOrder
  idUsuario?: Prisma.SortOrder
  tokenHash?: Prisma.SortOrder
  recordarSesion?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  ultimaActividadAt?: Prisma.SortOrder
  expiresAt?: Prisma.SortOrder
  revokedAt?: Prisma.SortOrderInput | Prisma.SortOrder
  usuario?: Prisma.UsuarioOrderByWithRelationInput
}

export type SesionUsuarioWhereUniqueInput = Prisma.AtLeast<{
  idSesion?: string
  tokenHash?: string
  AND?: Prisma.SesionUsuarioWhereInput | Prisma.SesionUsuarioWhereInput[]
  OR?: Prisma.SesionUsuarioWhereInput[]
  NOT?: Prisma.SesionUsuarioWhereInput | Prisma.SesionUsuarioWhereInput[]
  idUsuario?: Prisma.UuidFilter<"SesionUsuario"> | string
  recordarSesion?: Prisma.BoolFilter<"SesionUsuario"> | boolean
  createdAt?: Prisma.DateTimeFilter<"SesionUsuario"> | Date | string
  ultimaActividadAt?: Prisma.DateTimeFilter<"SesionUsuario"> | Date | string
  expiresAt?: Prisma.DateTimeFilter<"SesionUsuario"> | Date | string
  revokedAt?: Prisma.DateTimeNullableFilter<"SesionUsuario"> | Date | string | null
  usuario?: Prisma.XOR<Prisma.UsuarioScalarRelationFilter, Prisma.UsuarioWhereInput>
}, "idSesion" | "tokenHash">

export type SesionUsuarioOrderByWithAggregationInput = {
  idSesion?: Prisma.SortOrder
  idUsuario?: Prisma.SortOrder
  tokenHash?: Prisma.SortOrder
  recordarSesion?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  ultimaActividadAt?: Prisma.SortOrder
  expiresAt?: Prisma.SortOrder
  revokedAt?: Prisma.SortOrderInput | Prisma.SortOrder
  _count?: Prisma.SesionUsuarioCountOrderByAggregateInput
  _max?: Prisma.SesionUsuarioMaxOrderByAggregateInput
  _min?: Prisma.SesionUsuarioMinOrderByAggregateInput
}

export type SesionUsuarioScalarWhereWithAggregatesInput = {
  AND?: Prisma.SesionUsuarioScalarWhereWithAggregatesInput | Prisma.SesionUsuarioScalarWhereWithAggregatesInput[]
  OR?: Prisma.SesionUsuarioScalarWhereWithAggregatesInput[]
  NOT?: Prisma.SesionUsuarioScalarWhereWithAggregatesInput | Prisma.SesionUsuarioScalarWhereWithAggregatesInput[]
  idSesion?: Prisma.UuidWithAggregatesFilter<"SesionUsuario"> | string
  idUsuario?: Prisma.UuidWithAggregatesFilter<"SesionUsuario"> | string
  tokenHash?: Prisma.StringWithAggregatesFilter<"SesionUsuario"> | string
  recordarSesion?: Prisma.BoolWithAggregatesFilter<"SesionUsuario"> | boolean
  createdAt?: Prisma.DateTimeWithAggregatesFilter<"SesionUsuario"> | Date | string
  ultimaActividadAt?: Prisma.DateTimeWithAggregatesFilter<"SesionUsuario"> | Date | string
  expiresAt?: Prisma.DateTimeWithAggregatesFilter<"SesionUsuario"> | Date | string
  revokedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"SesionUsuario"> | Date | string | null
}

export type SesionUsuarioCreateInput = {
  idSesion?: string
  tokenHash: string
  recordarSesion?: boolean
  createdAt?: Date | string
  ultimaActividadAt?: Date | string
  expiresAt: Date | string
  revokedAt?: Date | string | null
  usuario: Prisma.UsuarioCreateNestedOneWithoutSesionesInput
}

export type SesionUsuarioUncheckedCreateInput = {
  idSesion?: string
  idUsuario: string
  tokenHash: string
  recordarSesion?: boolean
  createdAt?: Date | string
  ultimaActividadAt?: Date | string
  expiresAt: Date | string
  revokedAt?: Date | string | null
}

export type SesionUsuarioUpdateInput = {
  idSesion?: Prisma.StringFieldUpdateOperationsInput | string
  tokenHash?: Prisma.StringFieldUpdateOperationsInput | string
  recordarSesion?: Prisma.BoolFieldUpdateOperationsInput | boolean
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  ultimaActividadAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  usuario?: Prisma.UsuarioUpdateOneRequiredWithoutSesionesNestedInput
}

export type SesionUsuarioUncheckedUpdateInput = {
  idSesion?: Prisma.StringFieldUpdateOperationsInput | string
  idUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  tokenHash?: Prisma.StringFieldUpdateOperationsInput | string
  recordarSesion?: Prisma.BoolFieldUpdateOperationsInput | boolean
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  ultimaActividadAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
}

export type SesionUsuarioCreateManyInput = {
  idSesion?: string
  idUsuario: string
  tokenHash: string
  recordarSesion?: boolean
  createdAt?: Date | string
  ultimaActividadAt?: Date | string
  expiresAt: Date | string
  revokedAt?: Date | string | null
}

export type SesionUsuarioUpdateManyMutationInput = {
  idSesion?: Prisma.StringFieldUpdateOperationsInput | string
  tokenHash?: Prisma.StringFieldUpdateOperationsInput | string
  recordarSesion?: Prisma.BoolFieldUpdateOperationsInput | boolean
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  ultimaActividadAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
}

export type SesionUsuarioUncheckedUpdateManyInput = {
  idSesion?: Prisma.StringFieldUpdateOperationsInput | string
  idUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  tokenHash?: Prisma.StringFieldUpdateOperationsInput | string
  recordarSesion?: Prisma.BoolFieldUpdateOperationsInput | boolean
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  ultimaActividadAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
}

export type SesionUsuarioListRelationFilter = {
  every?: Prisma.SesionUsuarioWhereInput
  some?: Prisma.SesionUsuarioWhereInput
  none?: Prisma.SesionUsuarioWhereInput
}

export type SesionUsuarioOrderByRelationAggregateInput = {
  _count?: Prisma.SortOrder
}

export type SesionUsuarioCountOrderByAggregateInput = {
  idSesion?: Prisma.SortOrder
  idUsuario?: Prisma.SortOrder
  tokenHash?: Prisma.SortOrder
  recordarSesion?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  ultimaActividadAt?: Prisma.SortOrder
  expiresAt?: Prisma.SortOrder
  revokedAt?: Prisma.SortOrder
}

export type SesionUsuarioMaxOrderByAggregateInput = {
  idSesion?: Prisma.SortOrder
  idUsuario?: Prisma.SortOrder
  tokenHash?: Prisma.SortOrder
  recordarSesion?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  ultimaActividadAt?: Prisma.SortOrder
  expiresAt?: Prisma.SortOrder
  revokedAt?: Prisma.SortOrder
}

export type SesionUsuarioMinOrderByAggregateInput = {
  idSesion?: Prisma.SortOrder
  idUsuario?: Prisma.SortOrder
  tokenHash?: Prisma.SortOrder
  recordarSesion?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  ultimaActividadAt?: Prisma.SortOrder
  expiresAt?: Prisma.SortOrder
  revokedAt?: Prisma.SortOrder
}

export type SesionUsuarioCreateNestedManyWithoutUsuarioInput = {
  create?: Prisma.XOR<Prisma.SesionUsuarioCreateWithoutUsuarioInput, Prisma.SesionUsuarioUncheckedCreateWithoutUsuarioInput> | Prisma.SesionUsuarioCreateWithoutUsuarioInput[] | Prisma.SesionUsuarioUncheckedCreateWithoutUsuarioInput[]
  connectOrCreate?: Prisma.SesionUsuarioCreateOrConnectWithoutUsuarioInput | Prisma.SesionUsuarioCreateOrConnectWithoutUsuarioInput[]
  createMany?: Prisma.SesionUsuarioCreateManyUsuarioInputEnvelope
  connect?: Prisma.SesionUsuarioWhereUniqueInput | Prisma.SesionUsuarioWhereUniqueInput[]
}

export type SesionUsuarioUncheckedCreateNestedManyWithoutUsuarioInput = {
  create?: Prisma.XOR<Prisma.SesionUsuarioCreateWithoutUsuarioInput, Prisma.SesionUsuarioUncheckedCreateWithoutUsuarioInput> | Prisma.SesionUsuarioCreateWithoutUsuarioInput[] | Prisma.SesionUsuarioUncheckedCreateWithoutUsuarioInput[]
  connectOrCreate?: Prisma.SesionUsuarioCreateOrConnectWithoutUsuarioInput | Prisma.SesionUsuarioCreateOrConnectWithoutUsuarioInput[]
  createMany?: Prisma.SesionUsuarioCreateManyUsuarioInputEnvelope
  connect?: Prisma.SesionUsuarioWhereUniqueInput | Prisma.SesionUsuarioWhereUniqueInput[]
}

export type SesionUsuarioUpdateManyWithoutUsuarioNestedInput = {
  create?: Prisma.XOR<Prisma.SesionUsuarioCreateWithoutUsuarioInput, Prisma.SesionUsuarioUncheckedCreateWithoutUsuarioInput> | Prisma.SesionUsuarioCreateWithoutUsuarioInput[] | Prisma.SesionUsuarioUncheckedCreateWithoutUsuarioInput[]
  connectOrCreate?: Prisma.SesionUsuarioCreateOrConnectWithoutUsuarioInput | Prisma.SesionUsuarioCreateOrConnectWithoutUsuarioInput[]
  upsert?: Prisma.SesionUsuarioUpsertWithWhereUniqueWithoutUsuarioInput | Prisma.SesionUsuarioUpsertWithWhereUniqueWithoutUsuarioInput[]
  createMany?: Prisma.SesionUsuarioCreateManyUsuarioInputEnvelope
  set?: Prisma.SesionUsuarioWhereUniqueInput | Prisma.SesionUsuarioWhereUniqueInput[]
  disconnect?: Prisma.SesionUsuarioWhereUniqueInput | Prisma.SesionUsuarioWhereUniqueInput[]
  delete?: Prisma.SesionUsuarioWhereUniqueInput | Prisma.SesionUsuarioWhereUniqueInput[]
  connect?: Prisma.SesionUsuarioWhereUniqueInput | Prisma.SesionUsuarioWhereUniqueInput[]
  update?: Prisma.SesionUsuarioUpdateWithWhereUniqueWithoutUsuarioInput | Prisma.SesionUsuarioUpdateWithWhereUniqueWithoutUsuarioInput[]
  updateMany?: Prisma.SesionUsuarioUpdateManyWithWhereWithoutUsuarioInput | Prisma.SesionUsuarioUpdateManyWithWhereWithoutUsuarioInput[]
  deleteMany?: Prisma.SesionUsuarioScalarWhereInput | Prisma.SesionUsuarioScalarWhereInput[]
}

export type SesionUsuarioUncheckedUpdateManyWithoutUsuarioNestedInput = {
  create?: Prisma.XOR<Prisma.SesionUsuarioCreateWithoutUsuarioInput, Prisma.SesionUsuarioUncheckedCreateWithoutUsuarioInput> | Prisma.SesionUsuarioCreateWithoutUsuarioInput[] | Prisma.SesionUsuarioUncheckedCreateWithoutUsuarioInput[]
  connectOrCreate?: Prisma.SesionUsuarioCreateOrConnectWithoutUsuarioInput | Prisma.SesionUsuarioCreateOrConnectWithoutUsuarioInput[]
  upsert?: Prisma.SesionUsuarioUpsertWithWhereUniqueWithoutUsuarioInput | Prisma.SesionUsuarioUpsertWithWhereUniqueWithoutUsuarioInput[]
  createMany?: Prisma.SesionUsuarioCreateManyUsuarioInputEnvelope
  set?: Prisma.SesionUsuarioWhereUniqueInput | Prisma.SesionUsuarioWhereUniqueInput[]
  disconnect?: Prisma.SesionUsuarioWhereUniqueInput | Prisma.SesionUsuarioWhereUniqueInput[]
  delete?: Prisma.SesionUsuarioWhereUniqueInput | Prisma.SesionUsuarioWhereUniqueInput[]
  connect?: Prisma.SesionUsuarioWhereUniqueInput | Prisma.SesionUsuarioWhereUniqueInput[]
  update?: Prisma.SesionUsuarioUpdateWithWhereUniqueWithoutUsuarioInput | Prisma.SesionUsuarioUpdateWithWhereUniqueWithoutUsuarioInput[]
  updateMany?: Prisma.SesionUsuarioUpdateManyWithWhereWithoutUsuarioInput | Prisma.SesionUsuarioUpdateManyWithWhereWithoutUsuarioInput[]
  deleteMany?: Prisma.SesionUsuarioScalarWhereInput | Prisma.SesionUsuarioScalarWhereInput[]
}

export type SesionUsuarioCreateWithoutUsuarioInput = {
  idSesion?: string
  tokenHash: string
  recordarSesion?: boolean
  createdAt?: Date | string
  ultimaActividadAt?: Date | string
  expiresAt: Date | string
  revokedAt?: Date | string | null
}

export type SesionUsuarioUncheckedCreateWithoutUsuarioInput = {
  idSesion?: string
  tokenHash: string
  recordarSesion?: boolean
  createdAt?: Date | string
  ultimaActividadAt?: Date | string
  expiresAt: Date | string
  revokedAt?: Date | string | null
}

export type SesionUsuarioCreateOrConnectWithoutUsuarioInput = {
  where: Prisma.SesionUsuarioWhereUniqueInput
  create: Prisma.XOR<Prisma.SesionUsuarioCreateWithoutUsuarioInput, Prisma.SesionUsuarioUncheckedCreateWithoutUsuarioInput>
}

export type SesionUsuarioCreateManyUsuarioInputEnvelope = {
  data: Prisma.SesionUsuarioCreateManyUsuarioInput | Prisma.SesionUsuarioCreateManyUsuarioInput[]
  skipDuplicates?: boolean
}

export type SesionUsuarioUpsertWithWhereUniqueWithoutUsuarioInput = {
  where: Prisma.SesionUsuarioWhereUniqueInput
  update: Prisma.XOR<Prisma.SesionUsuarioUpdateWithoutUsuarioInput, Prisma.SesionUsuarioUncheckedUpdateWithoutUsuarioInput>
  create: Prisma.XOR<Prisma.SesionUsuarioCreateWithoutUsuarioInput, Prisma.SesionUsuarioUncheckedCreateWithoutUsuarioInput>
}

export type SesionUsuarioUpdateWithWhereUniqueWithoutUsuarioInput = {
  where: Prisma.SesionUsuarioWhereUniqueInput
  data: Prisma.XOR<Prisma.SesionUsuarioUpdateWithoutUsuarioInput, Prisma.SesionUsuarioUncheckedUpdateWithoutUsuarioInput>
}

export type SesionUsuarioUpdateManyWithWhereWithoutUsuarioInput = {
  where: Prisma.SesionUsuarioScalarWhereInput
  data: Prisma.XOR<Prisma.SesionUsuarioUpdateManyMutationInput, Prisma.SesionUsuarioUncheckedUpdateManyWithoutUsuarioInput>
}

export type SesionUsuarioScalarWhereInput = {
  AND?: Prisma.SesionUsuarioScalarWhereInput | Prisma.SesionUsuarioScalarWhereInput[]
  OR?: Prisma.SesionUsuarioScalarWhereInput[]
  NOT?: Prisma.SesionUsuarioScalarWhereInput | Prisma.SesionUsuarioScalarWhereInput[]
  idSesion?: Prisma.UuidFilter<"SesionUsuario"> | string
  idUsuario?: Prisma.UuidFilter<"SesionUsuario"> | string
  tokenHash?: Prisma.StringFilter<"SesionUsuario"> | string
  recordarSesion?: Prisma.BoolFilter<"SesionUsuario"> | boolean
  createdAt?: Prisma.DateTimeFilter<"SesionUsuario"> | Date | string
  ultimaActividadAt?: Prisma.DateTimeFilter<"SesionUsuario"> | Date | string
  expiresAt?: Prisma.DateTimeFilter<"SesionUsuario"> | Date | string
  revokedAt?: Prisma.DateTimeNullableFilter<"SesionUsuario"> | Date | string | null
}

export type SesionUsuarioCreateManyUsuarioInput = {
  idSesion?: string
  tokenHash: string
  recordarSesion?: boolean
  createdAt?: Date | string
  ultimaActividadAt?: Date | string
  expiresAt: Date | string
  revokedAt?: Date | string | null
}

export type SesionUsuarioUpdateWithoutUsuarioInput = {
  idSesion?: Prisma.StringFieldUpdateOperationsInput | string
  tokenHash?: Prisma.StringFieldUpdateOperationsInput | string
  recordarSesion?: Prisma.BoolFieldUpdateOperationsInput | boolean
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  ultimaActividadAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
}

export type SesionUsuarioUncheckedUpdateWithoutUsuarioInput = {
  idSesion?: Prisma.StringFieldUpdateOperationsInput | string
  tokenHash?: Prisma.StringFieldUpdateOperationsInput | string
  recordarSesion?: Prisma.BoolFieldUpdateOperationsInput | boolean
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  ultimaActividadAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
}

export type SesionUsuarioUncheckedUpdateManyWithoutUsuarioInput = {
  idSesion?: Prisma.StringFieldUpdateOperationsInput | string
  tokenHash?: Prisma.StringFieldUpdateOperationsInput | string
  recordarSesion?: Prisma.BoolFieldUpdateOperationsInput | boolean
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  ultimaActividadAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
}



export type SesionUsuarioSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  idSesion?: boolean
  idUsuario?: boolean
  tokenHash?: boolean
  recordarSesion?: boolean
  createdAt?: boolean
  ultimaActividadAt?: boolean
  expiresAt?: boolean
  revokedAt?: boolean
  usuario?: boolean | Prisma.UsuarioDefaultArgs<ExtArgs>
}, ExtArgs["result"]["sesionUsuario"]>

export type SesionUsuarioSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  idSesion?: boolean
  idUsuario?: boolean
  tokenHash?: boolean
  recordarSesion?: boolean
  createdAt?: boolean
  ultimaActividadAt?: boolean
  expiresAt?: boolean
  revokedAt?: boolean
  usuario?: boolean | Prisma.UsuarioDefaultArgs<ExtArgs>
}, ExtArgs["result"]["sesionUsuario"]>

export type SesionUsuarioSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  idSesion?: boolean
  idUsuario?: boolean
  tokenHash?: boolean
  recordarSesion?: boolean
  createdAt?: boolean
  ultimaActividadAt?: boolean
  expiresAt?: boolean
  revokedAt?: boolean
  usuario?: boolean | Prisma.UsuarioDefaultArgs<ExtArgs>
}, ExtArgs["result"]["sesionUsuario"]>

export type SesionUsuarioSelectScalar = {
  idSesion?: boolean
  idUsuario?: boolean
  tokenHash?: boolean
  recordarSesion?: boolean
  createdAt?: boolean
  ultimaActividadAt?: boolean
  expiresAt?: boolean
  revokedAt?: boolean
}

export type SesionUsuarioOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"idSesion" | "idUsuario" | "tokenHash" | "recordarSesion" | "createdAt" | "ultimaActividadAt" | "expiresAt" | "revokedAt", ExtArgs["result"]["sesionUsuario"]>
export type SesionUsuarioInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  usuario?: boolean | Prisma.UsuarioDefaultArgs<ExtArgs>
}
export type SesionUsuarioIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  usuario?: boolean | Prisma.UsuarioDefaultArgs<ExtArgs>
}
export type SesionUsuarioIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  usuario?: boolean | Prisma.UsuarioDefaultArgs<ExtArgs>
}

export type $SesionUsuarioPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  name: "SesionUsuario"
  objects: {
    usuario: Prisma.$UsuarioPayload<ExtArgs>
  }
  scalars: runtime.Types.Extensions.GetPayloadResult<{
    idSesion: string
    idUsuario: string
    tokenHash: string
    recordarSesion: boolean
    createdAt: Date
    ultimaActividadAt: Date
    expiresAt: Date
    revokedAt: Date | null
  }, ExtArgs["result"]["sesionUsuario"]>
  composites: {}
}

export type SesionUsuarioGetPayload<S extends boolean | null | undefined | SesionUsuarioDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SesionUsuarioPayload, S>

export type SesionUsuarioCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> =
  Omit<SesionUsuarioFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SesionUsuarioCountAggregateInputType | true
  }

export interface SesionUsuarioDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SesionUsuario'], meta: { name: 'SesionUsuario' } }
  findUnique<T extends SesionUsuarioFindUniqueArgs>(args: Prisma.SelectSubset<T, SesionUsuarioFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SesionUsuarioClient<runtime.Types.Result.GetResult<Prisma.$SesionUsuarioPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
  findUniqueOrThrow<T extends SesionUsuarioFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SesionUsuarioFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SesionUsuarioClient<runtime.Types.Result.GetResult<Prisma.$SesionUsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>
  findFirst<T extends SesionUsuarioFindFirstArgs>(args?: Prisma.SelectSubset<T, SesionUsuarioFindFirstArgs<ExtArgs>>): Prisma.Prisma__SesionUsuarioClient<runtime.Types.Result.GetResult<Prisma.$SesionUsuarioPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
  findFirstOrThrow<T extends SesionUsuarioFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SesionUsuarioFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SesionUsuarioClient<runtime.Types.Result.GetResult<Prisma.$SesionUsuarioPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>
  findMany<T extends SesionUsuarioFindManyArgs>(args?: Prisma.SelectSubset<T, SesionUsuarioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SesionUsuarioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>
  create<T extends SesionUsuarioCreateArgs>(args: Prisma.SelectSubset<T, SesionUsuarioCreateArgs<ExtArgs>>): Prisma.Prisma__SesionUsuarioClient<runtime.Types.Result.GetResult<Prisma.$SesionUsuarioPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>
  createMany<T extends SesionUsuarioCreateManyArgs>(args?: Prisma.SelectSubset<T, SesionUsuarioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>
  createManyAndReturn<T extends SesionUsuarioCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SesionUsuarioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SesionUsuarioPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>
  delete<T extends SesionUsuarioDeleteArgs>(args: Prisma.SelectSubset<T, SesionUsuarioDeleteArgs<ExtArgs>>): Prisma.Prisma__SesionUsuarioClient<runtime.Types.Result.GetResult<Prisma.$SesionUsuarioPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>
  update<T extends SesionUsuarioUpdateArgs>(args: Prisma.SelectSubset<T, SesionUsuarioUpdateArgs<ExtArgs>>): Prisma.Prisma__SesionUsuarioClient<runtime.Types.Result.GetResult<Prisma.$SesionUsuarioPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>
  deleteMany<T extends SesionUsuarioDeleteManyArgs>(args?: Prisma.SelectSubset<T, SesionUsuarioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>
  updateMany<T extends SesionUsuarioUpdateManyArgs>(args: Prisma.SelectSubset<T, SesionUsuarioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>
  updateManyAndReturn<T extends SesionUsuarioUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SesionUsuarioUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SesionUsuarioPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>
  upsert<T extends SesionUsuarioUpsertArgs>(args: Prisma.SelectSubset<T, SesionUsuarioUpsertArgs<ExtArgs>>): Prisma.Prisma__SesionUsuarioClient<runtime.Types.Result.GetResult<Prisma.$SesionUsuarioPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>
  count<T extends SesionUsuarioCountArgs>(
    args?: Prisma.Subset<T, SesionUsuarioCountArgs>,
  ): Prisma.PrismaPromise<
    T extends runtime.Types.Utils.Record<'select', any>
      ? T['select'] extends true
        ? number
        : Prisma.GetScalarType<T['select'], SesionUsuarioCountAggregateOutputType>
      : number
  >
  aggregate<T extends SesionUsuarioAggregateArgs>(args: Prisma.Subset<T, SesionUsuarioAggregateArgs>): Prisma.PrismaPromise<GetSesionUsuarioAggregateType<T>>
  groupBy<
    T extends SesionUsuarioGroupByArgs,
    HasSelectOrTake extends Prisma.Or<
      Prisma.Extends<'skip', Prisma.Keys<T>>,
      Prisma.Extends<'take', Prisma.Keys<T>>
    >,
    OrderByArg extends Prisma.True extends HasSelectOrTake
      ? { orderBy: SesionUsuarioGroupByArgs['orderBy'] }
      : { orderBy?: SesionUsuarioGroupByArgs['orderBy'] },
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
  >(args: Prisma.SubsetIntersection<T, SesionUsuarioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSesionUsuarioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  readonly fields: SesionUsuarioFieldRefs;
}

export interface Prisma__SesionUsuarioClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
  readonly [Symbol.toStringTag]: "PrismaPromise"
  usuario<T extends Prisma.UsuarioDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UsuarioDefaultArgs<ExtArgs>>): Prisma.Prisma__UsuarioClient<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>
  finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>
}

export interface SesionUsuarioFieldRefs {
  readonly idSesion: Prisma.FieldRef<"SesionUsuario", 'String'>
  readonly idUsuario: Prisma.FieldRef<"SesionUsuario", 'String'>
  readonly tokenHash: Prisma.FieldRef<"SesionUsuario", 'String'>
  readonly recordarSesion: Prisma.FieldRef<"SesionUsuario", 'Boolean'>
  readonly createdAt: Prisma.FieldRef<"SesionUsuario", 'DateTime'>
  readonly ultimaActividadAt: Prisma.FieldRef<"SesionUsuario", 'DateTime'>
  readonly expiresAt: Prisma.FieldRef<"SesionUsuario", 'DateTime'>
  readonly revokedAt: Prisma.FieldRef<"SesionUsuario", 'DateTime'>
}
    

export type SesionUsuarioFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.SesionUsuarioSelect<ExtArgs> | null
  omit?: Prisma.SesionUsuarioOmit<ExtArgs> | null
  include?: Prisma.SesionUsuarioInclude<ExtArgs> | null
  where: Prisma.SesionUsuarioWhereUniqueInput
}

export type SesionUsuarioFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.SesionUsuarioSelect<ExtArgs> | null
  omit?: Prisma.SesionUsuarioOmit<ExtArgs> | null
  include?: Prisma.SesionUsuarioInclude<ExtArgs> | null
  where: Prisma.SesionUsuarioWhereUniqueInput
}

export type SesionUsuarioFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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

export type SesionUsuarioFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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

export type SesionUsuarioFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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

export type SesionUsuarioCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.SesionUsuarioSelect<ExtArgs> | null
  omit?: Prisma.SesionUsuarioOmit<ExtArgs> | null
  include?: Prisma.SesionUsuarioInclude<ExtArgs> | null
  data: Prisma.XOR<Prisma.SesionUsuarioCreateInput, Prisma.SesionUsuarioUncheckedCreateInput>
}

export type SesionUsuarioCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  data: Prisma.SesionUsuarioCreateManyInput | Prisma.SesionUsuarioCreateManyInput[]
  skipDuplicates?: boolean
}

export type SesionUsuarioCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.SesionUsuarioSelectCreateManyAndReturn<ExtArgs> | null
  omit?: Prisma.SesionUsuarioOmit<ExtArgs> | null
  data: Prisma.SesionUsuarioCreateManyInput | Prisma.SesionUsuarioCreateManyInput[]
  skipDuplicates?: boolean
  include?: Prisma.SesionUsuarioIncludeCreateManyAndReturn<ExtArgs> | null
}

export type SesionUsuarioUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.SesionUsuarioSelect<ExtArgs> | null
  omit?: Prisma.SesionUsuarioOmit<ExtArgs> | null
  include?: Prisma.SesionUsuarioInclude<ExtArgs> | null
  data: Prisma.XOR<Prisma.SesionUsuarioUpdateInput, Prisma.SesionUsuarioUncheckedUpdateInput>
  where: Prisma.SesionUsuarioWhereUniqueInput
}

export type SesionUsuarioUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  data: Prisma.XOR<Prisma.SesionUsuarioUpdateManyMutationInput, Prisma.SesionUsuarioUncheckedUpdateManyInput>
  where?: Prisma.SesionUsuarioWhereInput
  limit?: number
}

export type SesionUsuarioUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.SesionUsuarioSelectUpdateManyAndReturn<ExtArgs> | null
  omit?: Prisma.SesionUsuarioOmit<ExtArgs> | null
  data: Prisma.XOR<Prisma.SesionUsuarioUpdateManyMutationInput, Prisma.SesionUsuarioUncheckedUpdateManyInput>
  where?: Prisma.SesionUsuarioWhereInput
  limit?: number
  include?: Prisma.SesionUsuarioIncludeUpdateManyAndReturn<ExtArgs> | null
}

export type SesionUsuarioUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.SesionUsuarioSelect<ExtArgs> | null
  omit?: Prisma.SesionUsuarioOmit<ExtArgs> | null
  include?: Prisma.SesionUsuarioInclude<ExtArgs> | null
  where: Prisma.SesionUsuarioWhereUniqueInput
  create: Prisma.XOR<Prisma.SesionUsuarioCreateInput, Prisma.SesionUsuarioUncheckedCreateInput>
  update: Prisma.XOR<Prisma.SesionUsuarioUpdateInput, Prisma.SesionUsuarioUncheckedUpdateInput>
}

export type SesionUsuarioDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.SesionUsuarioSelect<ExtArgs> | null
  omit?: Prisma.SesionUsuarioOmit<ExtArgs> | null
  include?: Prisma.SesionUsuarioInclude<ExtArgs> | null
  where: Prisma.SesionUsuarioWhereUniqueInput
}

export type SesionUsuarioDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.SesionUsuarioWhereInput
  limit?: number
}

export type SesionUsuarioDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.SesionUsuarioSelect<ExtArgs> | null
  omit?: Prisma.SesionUsuarioOmit<ExtArgs> | null
  include?: Prisma.SesionUsuarioInclude<ExtArgs> | null
}
