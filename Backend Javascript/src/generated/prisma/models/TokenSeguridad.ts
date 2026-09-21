
import type * as runtime from "@prisma/client/runtime/client"
import type * as $Enums from "../enums.js"
import type * as Prisma from "../internal/prismaNamespace.js"

export type TokenSeguridadModel = runtime.Types.Result.DefaultSelection<Prisma.$TokenSeguridadPayload>

export type AggregateTokenSeguridad = {
  _count: TokenSeguridadCountAggregateOutputType | null
  _avg: TokenSeguridadAvgAggregateOutputType | null
  _sum: TokenSeguridadSumAggregateOutputType | null
  _min: TokenSeguridadMinAggregateOutputType | null
  _max: TokenSeguridadMaxAggregateOutputType | null
}

export type TokenSeguridadAvgAggregateOutputType = {
  cantidadIntentos: number | null
}

export type TokenSeguridadSumAggregateOutputType = {
  cantidadIntentos: number | null
}

export type TokenSeguridadMinAggregateOutputType = {
  idToken: string | null
  idUsuario: string | null
  tipo: $Enums.TipoTokenSeguridad | null
  tokenHash: string | null
  cantidadIntentos: number | null
  createdAt: Date | null
  expiresAt: Date | null
  usedAt: Date | null
  revokedAt: Date | null
}

export type TokenSeguridadMaxAggregateOutputType = {
  idToken: string | null
  idUsuario: string | null
  tipo: $Enums.TipoTokenSeguridad | null
  tokenHash: string | null
  cantidadIntentos: number | null
  createdAt: Date | null
  expiresAt: Date | null
  usedAt: Date | null
  revokedAt: Date | null
}

export type TokenSeguridadCountAggregateOutputType = {
  idToken: number
  idUsuario: number
  tipo: number
  tokenHash: number
  cantidadIntentos: number
  createdAt: number
  expiresAt: number
  usedAt: number
  revokedAt: number
  _all: number
}

export type TokenSeguridadAvgAggregateInputType = {
  cantidadIntentos?: true
}

export type TokenSeguridadSumAggregateInputType = {
  cantidadIntentos?: true
}

export type TokenSeguridadMinAggregateInputType = {
  idToken?: true
  idUsuario?: true
  tipo?: true
  tokenHash?: true
  cantidadIntentos?: true
  createdAt?: true
  expiresAt?: true
  usedAt?: true
  revokedAt?: true
}

export type TokenSeguridadMaxAggregateInputType = {
  idToken?: true
  idUsuario?: true
  tipo?: true
  tokenHash?: true
  cantidadIntentos?: true
  createdAt?: true
  expiresAt?: true
  usedAt?: true
  revokedAt?: true
}

export type TokenSeguridadCountAggregateInputType = {
  idToken?: true
  idUsuario?: true
  tipo?: true
  tokenHash?: true
  cantidadIntentos?: true
  createdAt?: true
  expiresAt?: true
  usedAt?: true
  revokedAt?: true
  _all?: true
}

export type TokenSeguridadAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  where?: Prisma.TokenSeguridadWhereInput

  orderBy?: Prisma.TokenSeguridadOrderByWithRelationInput | Prisma.TokenSeguridadOrderByWithRelationInput[]

  cursor?: Prisma.TokenSeguridadWhereUniqueInput

  take?: number

  skip?: number

  _count?: true | TokenSeguridadCountAggregateInputType

  _avg?: TokenSeguridadAvgAggregateInputType

  _sum?: TokenSeguridadSumAggregateInputType

  _min?: TokenSeguridadMinAggregateInputType

  _max?: TokenSeguridadMaxAggregateInputType
}

export type GetTokenSeguridadAggregateType<T extends TokenSeguridadAggregateArgs> = {
      [P in keyof T & keyof AggregateTokenSeguridad]: P extends '_count' | 'count'
    ? T[P] extends true
      ? number
      : Prisma.GetScalarType<T[P], AggregateTokenSeguridad[P]>
    : Prisma.GetScalarType<T[P], AggregateTokenSeguridad[P]>
}

export type TokenSeguridadGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.TokenSeguridadWhereInput
  orderBy?: Prisma.TokenSeguridadOrderByWithAggregationInput | Prisma.TokenSeguridadOrderByWithAggregationInput[]
  by: Prisma.TokenSeguridadScalarFieldEnum[] | Prisma.TokenSeguridadScalarFieldEnum
  having?: Prisma.TokenSeguridadScalarWhereWithAggregatesInput
  take?: number
  skip?: number
  _count?: TokenSeguridadCountAggregateInputType | true
  _avg?: TokenSeguridadAvgAggregateInputType
  _sum?: TokenSeguridadSumAggregateInputType
  _min?: TokenSeguridadMinAggregateInputType
  _max?: TokenSeguridadMaxAggregateInputType
}

export type TokenSeguridadGroupByOutputType = {
  idToken: string
  idUsuario: string
  tipo: $Enums.TipoTokenSeguridad
  tokenHash: string
  cantidadIntentos: number
  createdAt: Date
  expiresAt: Date
  usedAt: Date | null
  revokedAt: Date | null
  _count: TokenSeguridadCountAggregateOutputType | null
  _avg: TokenSeguridadAvgAggregateOutputType | null
  _sum: TokenSeguridadSumAggregateOutputType | null
  _min: TokenSeguridadMinAggregateOutputType | null
  _max: TokenSeguridadMaxAggregateOutputType | null
}

export type GetTokenSeguridadGroupByPayload<T extends TokenSeguridadGroupByArgs> = Prisma.PrismaPromise<
  Array<
    Prisma.PickEnumerable<TokenSeguridadGroupByOutputType, T['by']> &
      {
        [P in ((keyof T) & (keyof TokenSeguridadGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : Prisma.GetScalarType<T[P], TokenSeguridadGroupByOutputType[P]>
          : Prisma.GetScalarType<T[P], TokenSeguridadGroupByOutputType[P]>
      }
    >
  >

export type TokenSeguridadWhereInput = {
  AND?: Prisma.TokenSeguridadWhereInput | Prisma.TokenSeguridadWhereInput[]
  OR?: Prisma.TokenSeguridadWhereInput[]
  NOT?: Prisma.TokenSeguridadWhereInput | Prisma.TokenSeguridadWhereInput[]
  idToken?: Prisma.UuidFilter<"TokenSeguridad"> | string
  idUsuario?: Prisma.UuidFilter<"TokenSeguridad"> | string
  tipo?: Prisma.EnumTipoTokenSeguridadFilter<"TokenSeguridad"> | $Enums.TipoTokenSeguridad
  tokenHash?: Prisma.StringFilter<"TokenSeguridad"> | string
  cantidadIntentos?: Prisma.IntFilter<"TokenSeguridad"> | number
  createdAt?: Prisma.DateTimeFilter<"TokenSeguridad"> | Date | string
  expiresAt?: Prisma.DateTimeFilter<"TokenSeguridad"> | Date | string
  usedAt?: Prisma.DateTimeNullableFilter<"TokenSeguridad"> | Date | string | null
  revokedAt?: Prisma.DateTimeNullableFilter<"TokenSeguridad"> | Date | string | null
  usuario?: Prisma.XOR<Prisma.UsuarioScalarRelationFilter, Prisma.UsuarioWhereInput>
}

export type TokenSeguridadOrderByWithRelationInput = {
  idToken?: Prisma.SortOrder
  idUsuario?: Prisma.SortOrder
  tipo?: Prisma.SortOrder
  tokenHash?: Prisma.SortOrder
  cantidadIntentos?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  expiresAt?: Prisma.SortOrder
  usedAt?: Prisma.SortOrderInput | Prisma.SortOrder
  revokedAt?: Prisma.SortOrderInput | Prisma.SortOrder
  usuario?: Prisma.UsuarioOrderByWithRelationInput
}

export type TokenSeguridadWhereUniqueInput = Prisma.AtLeast<{
  idToken?: string
  tokenHash?: string
  AND?: Prisma.TokenSeguridadWhereInput | Prisma.TokenSeguridadWhereInput[]
  OR?: Prisma.TokenSeguridadWhereInput[]
  NOT?: Prisma.TokenSeguridadWhereInput | Prisma.TokenSeguridadWhereInput[]
  idUsuario?: Prisma.UuidFilter<"TokenSeguridad"> | string
  tipo?: Prisma.EnumTipoTokenSeguridadFilter<"TokenSeguridad"> | $Enums.TipoTokenSeguridad
  cantidadIntentos?: Prisma.IntFilter<"TokenSeguridad"> | number
  createdAt?: Prisma.DateTimeFilter<"TokenSeguridad"> | Date | string
  expiresAt?: Prisma.DateTimeFilter<"TokenSeguridad"> | Date | string
  usedAt?: Prisma.DateTimeNullableFilter<"TokenSeguridad"> | Date | string | null
  revokedAt?: Prisma.DateTimeNullableFilter<"TokenSeguridad"> | Date | string | null
  usuario?: Prisma.XOR<Prisma.UsuarioScalarRelationFilter, Prisma.UsuarioWhereInput>
}, "idToken" | "tokenHash">

export type TokenSeguridadOrderByWithAggregationInput = {
  idToken?: Prisma.SortOrder
  idUsuario?: Prisma.SortOrder
  tipo?: Prisma.SortOrder
  tokenHash?: Prisma.SortOrder
  cantidadIntentos?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  expiresAt?: Prisma.SortOrder
  usedAt?: Prisma.SortOrderInput | Prisma.SortOrder
  revokedAt?: Prisma.SortOrderInput | Prisma.SortOrder
  _count?: Prisma.TokenSeguridadCountOrderByAggregateInput
  _avg?: Prisma.TokenSeguridadAvgOrderByAggregateInput
  _max?: Prisma.TokenSeguridadMaxOrderByAggregateInput
  _min?: Prisma.TokenSeguridadMinOrderByAggregateInput
  _sum?: Prisma.TokenSeguridadSumOrderByAggregateInput
}

export type TokenSeguridadScalarWhereWithAggregatesInput = {
  AND?: Prisma.TokenSeguridadScalarWhereWithAggregatesInput | Prisma.TokenSeguridadScalarWhereWithAggregatesInput[]
  OR?: Prisma.TokenSeguridadScalarWhereWithAggregatesInput[]
  NOT?: Prisma.TokenSeguridadScalarWhereWithAggregatesInput | Prisma.TokenSeguridadScalarWhereWithAggregatesInput[]
  idToken?: Prisma.UuidWithAggregatesFilter<"TokenSeguridad"> | string
  idUsuario?: Prisma.UuidWithAggregatesFilter<"TokenSeguridad"> | string
  tipo?: Prisma.EnumTipoTokenSeguridadWithAggregatesFilter<"TokenSeguridad"> | $Enums.TipoTokenSeguridad
  tokenHash?: Prisma.StringWithAggregatesFilter<"TokenSeguridad"> | string
  cantidadIntentos?: Prisma.IntWithAggregatesFilter<"TokenSeguridad"> | number
  createdAt?: Prisma.DateTimeWithAggregatesFilter<"TokenSeguridad"> | Date | string
  expiresAt?: Prisma.DateTimeWithAggregatesFilter<"TokenSeguridad"> | Date | string
  usedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"TokenSeguridad"> | Date | string | null
  revokedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"TokenSeguridad"> | Date | string | null
}

export type TokenSeguridadCreateInput = {
  idToken?: string
  tipo: $Enums.TipoTokenSeguridad
  tokenHash: string
  cantidadIntentos?: number
  createdAt?: Date | string
  expiresAt: Date | string
  usedAt?: Date | string | null
  revokedAt?: Date | string | null
  usuario: Prisma.UsuarioCreateNestedOneWithoutTokensSeguridadInput
}

export type TokenSeguridadUncheckedCreateInput = {
  idToken?: string
  idUsuario: string
  tipo: $Enums.TipoTokenSeguridad
  tokenHash: string
  cantidadIntentos?: number
  createdAt?: Date | string
  expiresAt: Date | string
  usedAt?: Date | string | null
  revokedAt?: Date | string | null
}

export type TokenSeguridadUpdateInput = {
  idToken?: Prisma.StringFieldUpdateOperationsInput | string
  tipo?: Prisma.EnumTipoTokenSeguridadFieldUpdateOperationsInput | $Enums.TipoTokenSeguridad
  tokenHash?: Prisma.StringFieldUpdateOperationsInput | string
  cantidadIntentos?: Prisma.IntFieldUpdateOperationsInput | number
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  usedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  usuario?: Prisma.UsuarioUpdateOneRequiredWithoutTokensSeguridadNestedInput
}

export type TokenSeguridadUncheckedUpdateInput = {
  idToken?: Prisma.StringFieldUpdateOperationsInput | string
  idUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  tipo?: Prisma.EnumTipoTokenSeguridadFieldUpdateOperationsInput | $Enums.TipoTokenSeguridad
  tokenHash?: Prisma.StringFieldUpdateOperationsInput | string
  cantidadIntentos?: Prisma.IntFieldUpdateOperationsInput | number
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  usedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
}

export type TokenSeguridadCreateManyInput = {
  idToken?: string
  idUsuario: string
  tipo: $Enums.TipoTokenSeguridad
  tokenHash: string
  cantidadIntentos?: number
  createdAt?: Date | string
  expiresAt: Date | string
  usedAt?: Date | string | null
  revokedAt?: Date | string | null
}

export type TokenSeguridadUpdateManyMutationInput = {
  idToken?: Prisma.StringFieldUpdateOperationsInput | string
  tipo?: Prisma.EnumTipoTokenSeguridadFieldUpdateOperationsInput | $Enums.TipoTokenSeguridad
  tokenHash?: Prisma.StringFieldUpdateOperationsInput | string
  cantidadIntentos?: Prisma.IntFieldUpdateOperationsInput | number
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  usedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
}

export type TokenSeguridadUncheckedUpdateManyInput = {
  idToken?: Prisma.StringFieldUpdateOperationsInput | string
  idUsuario?: Prisma.StringFieldUpdateOperationsInput | string
  tipo?: Prisma.EnumTipoTokenSeguridadFieldUpdateOperationsInput | $Enums.TipoTokenSeguridad
  tokenHash?: Prisma.StringFieldUpdateOperationsInput | string
  cantidadIntentos?: Prisma.IntFieldUpdateOperationsInput | number
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  usedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
}

export type TokenSeguridadListRelationFilter = {
  every?: Prisma.TokenSeguridadWhereInput
  some?: Prisma.TokenSeguridadWhereInput
  none?: Prisma.TokenSeguridadWhereInput
}

export type TokenSeguridadOrderByRelationAggregateInput = {
  _count?: Prisma.SortOrder
}

export type TokenSeguridadCountOrderByAggregateInput = {
  idToken?: Prisma.SortOrder
  idUsuario?: Prisma.SortOrder
  tipo?: Prisma.SortOrder
  tokenHash?: Prisma.SortOrder
  cantidadIntentos?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  expiresAt?: Prisma.SortOrder
  usedAt?: Prisma.SortOrder
  revokedAt?: Prisma.SortOrder
}

export type TokenSeguridadAvgOrderByAggregateInput = {
  cantidadIntentos?: Prisma.SortOrder
}

export type TokenSeguridadMaxOrderByAggregateInput = {
  idToken?: Prisma.SortOrder
  idUsuario?: Prisma.SortOrder
  tipo?: Prisma.SortOrder
  tokenHash?: Prisma.SortOrder
  cantidadIntentos?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  expiresAt?: Prisma.SortOrder
  usedAt?: Prisma.SortOrder
  revokedAt?: Prisma.SortOrder
}

export type TokenSeguridadMinOrderByAggregateInput = {
  idToken?: Prisma.SortOrder
  idUsuario?: Prisma.SortOrder
  tipo?: Prisma.SortOrder
  tokenHash?: Prisma.SortOrder
  cantidadIntentos?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  expiresAt?: Prisma.SortOrder
  usedAt?: Prisma.SortOrder
  revokedAt?: Prisma.SortOrder
}

export type TokenSeguridadSumOrderByAggregateInput = {
  cantidadIntentos?: Prisma.SortOrder
}

export type TokenSeguridadCreateNestedManyWithoutUsuarioInput = {
  create?: Prisma.XOR<Prisma.TokenSeguridadCreateWithoutUsuarioInput, Prisma.TokenSeguridadUncheckedCreateWithoutUsuarioInput> | Prisma.TokenSeguridadCreateWithoutUsuarioInput[] | Prisma.TokenSeguridadUncheckedCreateWithoutUsuarioInput[]
  connectOrCreate?: Prisma.TokenSeguridadCreateOrConnectWithoutUsuarioInput | Prisma.TokenSeguridadCreateOrConnectWithoutUsuarioInput[]
  createMany?: Prisma.TokenSeguridadCreateManyUsuarioInputEnvelope
  connect?: Prisma.TokenSeguridadWhereUniqueInput | Prisma.TokenSeguridadWhereUniqueInput[]
}

export type TokenSeguridadUncheckedCreateNestedManyWithoutUsuarioInput = {
  create?: Prisma.XOR<Prisma.TokenSeguridadCreateWithoutUsuarioInput, Prisma.TokenSeguridadUncheckedCreateWithoutUsuarioInput> | Prisma.TokenSeguridadCreateWithoutUsuarioInput[] | Prisma.TokenSeguridadUncheckedCreateWithoutUsuarioInput[]
  connectOrCreate?: Prisma.TokenSeguridadCreateOrConnectWithoutUsuarioInput | Prisma.TokenSeguridadCreateOrConnectWithoutUsuarioInput[]
  createMany?: Prisma.TokenSeguridadCreateManyUsuarioInputEnvelope
  connect?: Prisma.TokenSeguridadWhereUniqueInput | Prisma.TokenSeguridadWhereUniqueInput[]
}

export type TokenSeguridadUpdateManyWithoutUsuarioNestedInput = {
  create?: Prisma.XOR<Prisma.TokenSeguridadCreateWithoutUsuarioInput, Prisma.TokenSeguridadUncheckedCreateWithoutUsuarioInput> | Prisma.TokenSeguridadCreateWithoutUsuarioInput[] | Prisma.TokenSeguridadUncheckedCreateWithoutUsuarioInput[]
  connectOrCreate?: Prisma.TokenSeguridadCreateOrConnectWithoutUsuarioInput | Prisma.TokenSeguridadCreateOrConnectWithoutUsuarioInput[]
  upsert?: Prisma.TokenSeguridadUpsertWithWhereUniqueWithoutUsuarioInput | Prisma.TokenSeguridadUpsertWithWhereUniqueWithoutUsuarioInput[]
  createMany?: Prisma.TokenSeguridadCreateManyUsuarioInputEnvelope
  set?: Prisma.TokenSeguridadWhereUniqueInput | Prisma.TokenSeguridadWhereUniqueInput[]
  disconnect?: Prisma.TokenSeguridadWhereUniqueInput | Prisma.TokenSeguridadWhereUniqueInput[]
  delete?: Prisma.TokenSeguridadWhereUniqueInput | Prisma.TokenSeguridadWhereUniqueInput[]
  connect?: Prisma.TokenSeguridadWhereUniqueInput | Prisma.TokenSeguridadWhereUniqueInput[]
  update?: Prisma.TokenSeguridadUpdateWithWhereUniqueWithoutUsuarioInput | Prisma.TokenSeguridadUpdateWithWhereUniqueWithoutUsuarioInput[]
  updateMany?: Prisma.TokenSeguridadUpdateManyWithWhereWithoutUsuarioInput | Prisma.TokenSeguridadUpdateManyWithWhereWithoutUsuarioInput[]
  deleteMany?: Prisma.TokenSeguridadScalarWhereInput | Prisma.TokenSeguridadScalarWhereInput[]
}

export type TokenSeguridadUncheckedUpdateManyWithoutUsuarioNestedInput = {
  create?: Prisma.XOR<Prisma.TokenSeguridadCreateWithoutUsuarioInput, Prisma.TokenSeguridadUncheckedCreateWithoutUsuarioInput> | Prisma.TokenSeguridadCreateWithoutUsuarioInput[] | Prisma.TokenSeguridadUncheckedCreateWithoutUsuarioInput[]
  connectOrCreate?: Prisma.TokenSeguridadCreateOrConnectWithoutUsuarioInput | Prisma.TokenSeguridadCreateOrConnectWithoutUsuarioInput[]
  upsert?: Prisma.TokenSeguridadUpsertWithWhereUniqueWithoutUsuarioInput | Prisma.TokenSeguridadUpsertWithWhereUniqueWithoutUsuarioInput[]
  createMany?: Prisma.TokenSeguridadCreateManyUsuarioInputEnvelope
  set?: Prisma.TokenSeguridadWhereUniqueInput | Prisma.TokenSeguridadWhereUniqueInput[]
  disconnect?: Prisma.TokenSeguridadWhereUniqueInput | Prisma.TokenSeguridadWhereUniqueInput[]
  delete?: Prisma.TokenSeguridadWhereUniqueInput | Prisma.TokenSeguridadWhereUniqueInput[]
  connect?: Prisma.TokenSeguridadWhereUniqueInput | Prisma.TokenSeguridadWhereUniqueInput[]
  update?: Prisma.TokenSeguridadUpdateWithWhereUniqueWithoutUsuarioInput | Prisma.TokenSeguridadUpdateWithWhereUniqueWithoutUsuarioInput[]
  updateMany?: Prisma.TokenSeguridadUpdateManyWithWhereWithoutUsuarioInput | Prisma.TokenSeguridadUpdateManyWithWhereWithoutUsuarioInput[]
  deleteMany?: Prisma.TokenSeguridadScalarWhereInput | Prisma.TokenSeguridadScalarWhereInput[]
}

export type EnumTipoTokenSeguridadFieldUpdateOperationsInput = {
  set?: $Enums.TipoTokenSeguridad
}

export type TokenSeguridadCreateWithoutUsuarioInput = {
  idToken?: string
  tipo: $Enums.TipoTokenSeguridad
  tokenHash: string
  cantidadIntentos?: number
  createdAt?: Date | string
  expiresAt: Date | string
  usedAt?: Date | string | null
  revokedAt?: Date | string | null
}

export type TokenSeguridadUncheckedCreateWithoutUsuarioInput = {
  idToken?: string
  tipo: $Enums.TipoTokenSeguridad
  tokenHash: string
  cantidadIntentos?: number
  createdAt?: Date | string
  expiresAt: Date | string
  usedAt?: Date | string | null
  revokedAt?: Date | string | null
}

export type TokenSeguridadCreateOrConnectWithoutUsuarioInput = {
  where: Prisma.TokenSeguridadWhereUniqueInput
  create: Prisma.XOR<Prisma.TokenSeguridadCreateWithoutUsuarioInput, Prisma.TokenSeguridadUncheckedCreateWithoutUsuarioInput>
}

export type TokenSeguridadCreateManyUsuarioInputEnvelope = {
  data: Prisma.TokenSeguridadCreateManyUsuarioInput | Prisma.TokenSeguridadCreateManyUsuarioInput[]
  skipDuplicates?: boolean
}

export type TokenSeguridadUpsertWithWhereUniqueWithoutUsuarioInput = {
  where: Prisma.TokenSeguridadWhereUniqueInput
  update: Prisma.XOR<Prisma.TokenSeguridadUpdateWithoutUsuarioInput, Prisma.TokenSeguridadUncheckedUpdateWithoutUsuarioInput>
  create: Prisma.XOR<Prisma.TokenSeguridadCreateWithoutUsuarioInput, Prisma.TokenSeguridadUncheckedCreateWithoutUsuarioInput>
}

export type TokenSeguridadUpdateWithWhereUniqueWithoutUsuarioInput = {
  where: Prisma.TokenSeguridadWhereUniqueInput
  data: Prisma.XOR<Prisma.TokenSeguridadUpdateWithoutUsuarioInput, Prisma.TokenSeguridadUncheckedUpdateWithoutUsuarioInput>
}

export type TokenSeguridadUpdateManyWithWhereWithoutUsuarioInput = {
  where: Prisma.TokenSeguridadScalarWhereInput
  data: Prisma.XOR<Prisma.TokenSeguridadUpdateManyMutationInput, Prisma.TokenSeguridadUncheckedUpdateManyWithoutUsuarioInput>
}

export type TokenSeguridadScalarWhereInput = {
  AND?: Prisma.TokenSeguridadScalarWhereInput | Prisma.TokenSeguridadScalarWhereInput[]
  OR?: Prisma.TokenSeguridadScalarWhereInput[]
  NOT?: Prisma.TokenSeguridadScalarWhereInput | Prisma.TokenSeguridadScalarWhereInput[]
  idToken?: Prisma.UuidFilter<"TokenSeguridad"> | string
  idUsuario?: Prisma.UuidFilter<"TokenSeguridad"> | string
  tipo?: Prisma.EnumTipoTokenSeguridadFilter<"TokenSeguridad"> | $Enums.TipoTokenSeguridad
  tokenHash?: Prisma.StringFilter<"TokenSeguridad"> | string
  cantidadIntentos?: Prisma.IntFilter<"TokenSeguridad"> | number
  createdAt?: Prisma.DateTimeFilter<"TokenSeguridad"> | Date | string
  expiresAt?: Prisma.DateTimeFilter<"TokenSeguridad"> | Date | string
  usedAt?: Prisma.DateTimeNullableFilter<"TokenSeguridad"> | Date | string | null
  revokedAt?: Prisma.DateTimeNullableFilter<"TokenSeguridad"> | Date | string | null
}

export type TokenSeguridadCreateManyUsuarioInput = {
  idToken?: string
  tipo: $Enums.TipoTokenSeguridad
  tokenHash: string
  cantidadIntentos?: number
  createdAt?: Date | string
  expiresAt: Date | string
  usedAt?: Date | string | null
  revokedAt?: Date | string | null
}

export type TokenSeguridadUpdateWithoutUsuarioInput = {
  idToken?: Prisma.StringFieldUpdateOperationsInput | string
  tipo?: Prisma.EnumTipoTokenSeguridadFieldUpdateOperationsInput | $Enums.TipoTokenSeguridad
  tokenHash?: Prisma.StringFieldUpdateOperationsInput | string
  cantidadIntentos?: Prisma.IntFieldUpdateOperationsInput | number
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  usedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
}

export type TokenSeguridadUncheckedUpdateWithoutUsuarioInput = {
  idToken?: Prisma.StringFieldUpdateOperationsInput | string
  tipo?: Prisma.EnumTipoTokenSeguridadFieldUpdateOperationsInput | $Enums.TipoTokenSeguridad
  tokenHash?: Prisma.StringFieldUpdateOperationsInput | string
  cantidadIntentos?: Prisma.IntFieldUpdateOperationsInput | number
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  usedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
}

export type TokenSeguridadUncheckedUpdateManyWithoutUsuarioInput = {
  idToken?: Prisma.StringFieldUpdateOperationsInput | string
  tipo?: Prisma.EnumTipoTokenSeguridadFieldUpdateOperationsInput | $Enums.TipoTokenSeguridad
  tokenHash?: Prisma.StringFieldUpdateOperationsInput | string
  cantidadIntentos?: Prisma.IntFieldUpdateOperationsInput | number
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  usedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null
}

export type TokenSeguridadSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  idToken?: boolean
  idUsuario?: boolean
  tipo?: boolean
  tokenHash?: boolean
  cantidadIntentos?: boolean
  createdAt?: boolean
  expiresAt?: boolean
  usedAt?: boolean
  revokedAt?: boolean
  usuario?: boolean | Prisma.UsuarioDefaultArgs<ExtArgs>
}, ExtArgs["result"]["tokenSeguridad"]>

export type TokenSeguridadSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  idToken?: boolean
  idUsuario?: boolean
  tipo?: boolean
  tokenHash?: boolean
  cantidadIntentos?: boolean
  createdAt?: boolean
  expiresAt?: boolean
  usedAt?: boolean
  revokedAt?: boolean
  usuario?: boolean | Prisma.UsuarioDefaultArgs<ExtArgs>
}, ExtArgs["result"]["tokenSeguridad"]>

export type TokenSeguridadSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  idToken?: boolean
  idUsuario?: boolean
  tipo?: boolean
  tokenHash?: boolean
  cantidadIntentos?: boolean
  createdAt?: boolean
  expiresAt?: boolean
  usedAt?: boolean
  revokedAt?: boolean
  usuario?: boolean | Prisma.UsuarioDefaultArgs<ExtArgs>
}, ExtArgs["result"]["tokenSeguridad"]>

export type TokenSeguridadSelectScalar = {
  idToken?: boolean
  idUsuario?: boolean
  tipo?: boolean
  tokenHash?: boolean
  cantidadIntentos?: boolean
  createdAt?: boolean
  expiresAt?: boolean
  usedAt?: boolean
  revokedAt?: boolean
}

export type TokenSeguridadOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"idToken" | "idUsuario" | "tipo" | "tokenHash" | "cantidadIntentos" | "createdAt" | "expiresAt" | "usedAt" | "revokedAt", ExtArgs["result"]["tokenSeguridad"]>
export type TokenSeguridadInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  usuario?: boolean | Prisma.UsuarioDefaultArgs<ExtArgs>
}
export type TokenSeguridadIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  usuario?: boolean | Prisma.UsuarioDefaultArgs<ExtArgs>
}
export type TokenSeguridadIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  usuario?: boolean | Prisma.UsuarioDefaultArgs<ExtArgs>
}

export type $TokenSeguridadPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  name: "TokenSeguridad"
  objects: {
    usuario: Prisma.$UsuarioPayload<ExtArgs>
  }
  scalars: runtime.Types.Extensions.GetPayloadResult<{
    idToken: string
    idUsuario: string
    tipo: $Enums.TipoTokenSeguridad
    tokenHash: string
    cantidadIntentos: number
    createdAt: Date
    expiresAt: Date
    usedAt: Date | null
    revokedAt: Date | null
  }, ExtArgs["result"]["tokenSeguridad"]>
  composites: {}
}

export type TokenSeguridadGetPayload<S extends boolean | null | undefined | TokenSeguridadDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TokenSeguridadPayload, S>

export type TokenSeguridadCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> =
  Omit<TokenSeguridadFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TokenSeguridadCountAggregateInputType | true
  }

export interface TokenSeguridadDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TokenSeguridad'], meta: { name: 'TokenSeguridad' } }

  findUnique<T extends TokenSeguridadFindUniqueArgs>(args: Prisma.SelectSubset<T, TokenSeguridadFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TokenSeguridadClient<runtime.Types.Result.GetResult<Prisma.$TokenSeguridadPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  findUniqueOrThrow<T extends TokenSeguridadFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TokenSeguridadFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TokenSeguridadClient<runtime.Types.Result.GetResult<Prisma.$TokenSeguridadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  findFirst<T extends TokenSeguridadFindFirstArgs>(args?: Prisma.SelectSubset<T, TokenSeguridadFindFirstArgs<ExtArgs>>): Prisma.Prisma__TokenSeguridadClient<runtime.Types.Result.GetResult<Prisma.$TokenSeguridadPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  findFirstOrThrow<T extends TokenSeguridadFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TokenSeguridadFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TokenSeguridadClient<runtime.Types.Result.GetResult<Prisma.$TokenSeguridadPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  findMany<T extends TokenSeguridadFindManyArgs>(args?: Prisma.SelectSubset<T, TokenSeguridadFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TokenSeguridadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

  create<T extends TokenSeguridadCreateArgs>(args: Prisma.SelectSubset<T, TokenSeguridadCreateArgs<ExtArgs>>): Prisma.Prisma__TokenSeguridadClient<runtime.Types.Result.GetResult<Prisma.$TokenSeguridadPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  createMany<T extends TokenSeguridadCreateManyArgs>(args?: Prisma.SelectSubset<T, TokenSeguridadCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  createManyAndReturn<T extends TokenSeguridadCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TokenSeguridadCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TokenSeguridadPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

  delete<T extends TokenSeguridadDeleteArgs>(args: Prisma.SelectSubset<T, TokenSeguridadDeleteArgs<ExtArgs>>): Prisma.Prisma__TokenSeguridadClient<runtime.Types.Result.GetResult<Prisma.$TokenSeguridadPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  update<T extends TokenSeguridadUpdateArgs>(args: Prisma.SelectSubset<T, TokenSeguridadUpdateArgs<ExtArgs>>): Prisma.Prisma__TokenSeguridadClient<runtime.Types.Result.GetResult<Prisma.$TokenSeguridadPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  deleteMany<T extends TokenSeguridadDeleteManyArgs>(args?: Prisma.SelectSubset<T, TokenSeguridadDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  updateMany<T extends TokenSeguridadUpdateManyArgs>(args: Prisma.SelectSubset<T, TokenSeguridadUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  updateManyAndReturn<T extends TokenSeguridadUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TokenSeguridadUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TokenSeguridadPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

  upsert<T extends TokenSeguridadUpsertArgs>(args: Prisma.SelectSubset<T, TokenSeguridadUpsertArgs<ExtArgs>>): Prisma.Prisma__TokenSeguridadClient<runtime.Types.Result.GetResult<Prisma.$TokenSeguridadPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  count<T extends TokenSeguridadCountArgs>(
    args?: Prisma.Subset<T, TokenSeguridadCountArgs>,
  ): Prisma.PrismaPromise<
    T extends runtime.Types.Utils.Record<'select', any>
      ? T['select'] extends true
        ? number
        : Prisma.GetScalarType<T['select'], TokenSeguridadCountAggregateOutputType>
      : number
  >

  aggregate<T extends TokenSeguridadAggregateArgs>(args: Prisma.Subset<T, TokenSeguridadAggregateArgs>): Prisma.PrismaPromise<GetTokenSeguridadAggregateType<T>>

  groupBy<
    T extends TokenSeguridadGroupByArgs,
    HasSelectOrTake extends Prisma.Or<
      Prisma.Extends<'skip', Prisma.Keys<T>>,
      Prisma.Extends<'take', Prisma.Keys<T>>
    >,
    OrderByArg extends Prisma.True extends HasSelectOrTake
      ? { orderBy: TokenSeguridadGroupByArgs['orderBy'] }
      : { orderBy?: TokenSeguridadGroupByArgs['orderBy'] },
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
  >(args: Prisma.SubsetIntersection<T, TokenSeguridadGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTokenSeguridadGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>

readonly fields: TokenSeguridadFieldRefs;
}

export interface Prisma__TokenSeguridadClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
  readonly [Symbol.toStringTag]: "PrismaPromise"
  usuario<T extends Prisma.UsuarioDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UsuarioDefaultArgs<ExtArgs>>): Prisma.Prisma__UsuarioClient<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>

  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>

  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>

  finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>
}

export interface TokenSeguridadFieldRefs {
  readonly idToken: Prisma.FieldRef<"TokenSeguridad", 'String'>
  readonly idUsuario: Prisma.FieldRef<"TokenSeguridad", 'String'>
  readonly tipo: Prisma.FieldRef<"TokenSeguridad", 'TipoTokenSeguridad'>
  readonly tokenHash: Prisma.FieldRef<"TokenSeguridad", 'String'>
  readonly cantidadIntentos: Prisma.FieldRef<"TokenSeguridad", 'Int'>
  readonly createdAt: Prisma.FieldRef<"TokenSeguridad", 'DateTime'>
  readonly expiresAt: Prisma.FieldRef<"TokenSeguridad", 'DateTime'>
  readonly usedAt: Prisma.FieldRef<"TokenSeguridad", 'DateTime'>
  readonly revokedAt: Prisma.FieldRef<"TokenSeguridad", 'DateTime'>
}

export type TokenSeguridadFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.TokenSeguridadSelect<ExtArgs> | null

  omit?: Prisma.TokenSeguridadOmit<ExtArgs> | null

  include?: Prisma.TokenSeguridadInclude<ExtArgs> | null

  where: Prisma.TokenSeguridadWhereUniqueInput
}

export type TokenSeguridadFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.TokenSeguridadSelect<ExtArgs> | null

  omit?: Prisma.TokenSeguridadOmit<ExtArgs> | null

  include?: Prisma.TokenSeguridadInclude<ExtArgs> | null

  where: Prisma.TokenSeguridadWhereUniqueInput
}

export type TokenSeguridadFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

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

export type TokenSeguridadFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

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

export type TokenSeguridadFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

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

export type TokenSeguridadCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.TokenSeguridadSelect<ExtArgs> | null

  omit?: Prisma.TokenSeguridadOmit<ExtArgs> | null

  include?: Prisma.TokenSeguridadInclude<ExtArgs> | null

  data: Prisma.XOR<Prisma.TokenSeguridadCreateInput, Prisma.TokenSeguridadUncheckedCreateInput>
}

export type TokenSeguridadCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  data: Prisma.TokenSeguridadCreateManyInput | Prisma.TokenSeguridadCreateManyInput[]
  skipDuplicates?: boolean
}

export type TokenSeguridadCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.TokenSeguridadSelectCreateManyAndReturn<ExtArgs> | null

  omit?: Prisma.TokenSeguridadOmit<ExtArgs> | null

  data: Prisma.TokenSeguridadCreateManyInput | Prisma.TokenSeguridadCreateManyInput[]
  skipDuplicates?: boolean

  include?: Prisma.TokenSeguridadIncludeCreateManyAndReturn<ExtArgs> | null
}

export type TokenSeguridadUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.TokenSeguridadSelect<ExtArgs> | null

  omit?: Prisma.TokenSeguridadOmit<ExtArgs> | null

  include?: Prisma.TokenSeguridadInclude<ExtArgs> | null

  data: Prisma.XOR<Prisma.TokenSeguridadUpdateInput, Prisma.TokenSeguridadUncheckedUpdateInput>

  where: Prisma.TokenSeguridadWhereUniqueInput
}

export type TokenSeguridadUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  data: Prisma.XOR<Prisma.TokenSeguridadUpdateManyMutationInput, Prisma.TokenSeguridadUncheckedUpdateManyInput>

  where?: Prisma.TokenSeguridadWhereInput

  limit?: number
}

export type TokenSeguridadUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.TokenSeguridadSelectUpdateManyAndReturn<ExtArgs> | null

  omit?: Prisma.TokenSeguridadOmit<ExtArgs> | null

  data: Prisma.XOR<Prisma.TokenSeguridadUpdateManyMutationInput, Prisma.TokenSeguridadUncheckedUpdateManyInput>

  where?: Prisma.TokenSeguridadWhereInput

  limit?: number

  include?: Prisma.TokenSeguridadIncludeUpdateManyAndReturn<ExtArgs> | null
}

export type TokenSeguridadUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.TokenSeguridadSelect<ExtArgs> | null

  omit?: Prisma.TokenSeguridadOmit<ExtArgs> | null

  include?: Prisma.TokenSeguridadInclude<ExtArgs> | null

  where: Prisma.TokenSeguridadWhereUniqueInput

  create: Prisma.XOR<Prisma.TokenSeguridadCreateInput, Prisma.TokenSeguridadUncheckedCreateInput>

  update: Prisma.XOR<Prisma.TokenSeguridadUpdateInput, Prisma.TokenSeguridadUncheckedUpdateInput>
}

export type TokenSeguridadDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.TokenSeguridadSelect<ExtArgs> | null

  omit?: Prisma.TokenSeguridadOmit<ExtArgs> | null

  include?: Prisma.TokenSeguridadInclude<ExtArgs> | null

  where: Prisma.TokenSeguridadWhereUniqueInput
}

export type TokenSeguridadDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  where?: Prisma.TokenSeguridadWhereInput

  limit?: number
}

export type TokenSeguridadDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {

  select?: Prisma.TokenSeguridadSelect<ExtArgs> | null

  omit?: Prisma.TokenSeguridadOmit<ExtArgs> | null

  include?: Prisma.TokenSeguridadInclude<ExtArgs> | null
}
