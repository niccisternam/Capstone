
import type * as runtime from "@prisma/client/runtime/client"
import type * as $Enums from "../enums.js"
import type * as Prisma from "../internal/prismaNamespace.js"

export type EmpresaModel = runtime.Types.Result.DefaultSelection<Prisma.$EmpresaPayload>

export type AggregateEmpresa = {
  _count: EmpresaCountAggregateOutputType | null
  _min: EmpresaMinAggregateOutputType | null
  _max: EmpresaMaxAggregateOutputType | null
}

export type EmpresaMinAggregateOutputType = {
  idEmpresa: string | null
  rutEmpresa: string | null
  razonSocial: string | null
  estado: boolean | null
  createdAt: Date | null
  updatedAt: Date | null
}

export type EmpresaMaxAggregateOutputType = {
  idEmpresa: string | null
  rutEmpresa: string | null
  razonSocial: string | null
  estado: boolean | null
  createdAt: Date | null
  updatedAt: Date | null
}

export type EmpresaCountAggregateOutputType = {
  idEmpresa: number
  rutEmpresa: number
  razonSocial: number
  estado: number
  createdAt: number
  updatedAt: number
  _all: number
}


export type EmpresaMinAggregateInputType = {
  idEmpresa?: true
  rutEmpresa?: true
  razonSocial?: true
  estado?: true
  createdAt?: true
  updatedAt?: true
}

export type EmpresaMaxAggregateInputType = {
  idEmpresa?: true
  rutEmpresa?: true
  razonSocial?: true
  estado?: true
  createdAt?: true
  updatedAt?: true
}

export type EmpresaCountAggregateInputType = {
  idEmpresa?: true
  rutEmpresa?: true
  razonSocial?: true
  estado?: true
  createdAt?: true
  updatedAt?: true
  _all?: true
}

export type EmpresaAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.EmpresaWhereInput
  orderBy?: Prisma.EmpresaOrderByWithRelationInput | Prisma.EmpresaOrderByWithRelationInput[]
  cursor?: Prisma.EmpresaWhereUniqueInput
  take?: number
  skip?: number
  _count?: true | EmpresaCountAggregateInputType
  _min?: EmpresaMinAggregateInputType
  _max?: EmpresaMaxAggregateInputType
}

export type GetEmpresaAggregateType<T extends EmpresaAggregateArgs> = {
      [P in keyof T & keyof AggregateEmpresa]: P extends '_count' | 'count'
    ? T[P] extends true
      ? number
      : Prisma.GetScalarType<T[P], AggregateEmpresa[P]>
    : Prisma.GetScalarType<T[P], AggregateEmpresa[P]>
}




export type EmpresaGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.EmpresaWhereInput
  orderBy?: Prisma.EmpresaOrderByWithAggregationInput | Prisma.EmpresaOrderByWithAggregationInput[]
  by: Prisma.EmpresaScalarFieldEnum[] | Prisma.EmpresaScalarFieldEnum
  having?: Prisma.EmpresaScalarWhereWithAggregatesInput
  take?: number
  skip?: number
  _count?: EmpresaCountAggregateInputType | true
  _min?: EmpresaMinAggregateInputType
  _max?: EmpresaMaxAggregateInputType
}

export type EmpresaGroupByOutputType = {
  idEmpresa: string
  rutEmpresa: string
  razonSocial: string
  estado: boolean
  createdAt: Date
  updatedAt: Date
  _count: EmpresaCountAggregateOutputType | null
  _min: EmpresaMinAggregateOutputType | null
  _max: EmpresaMaxAggregateOutputType | null
}

export type GetEmpresaGroupByPayload<T extends EmpresaGroupByArgs> = Prisma.PrismaPromise<
  Array<
    Prisma.PickEnumerable<EmpresaGroupByOutputType, T['by']> &
      {
        [P in ((keyof T) & (keyof EmpresaGroupByOutputType))]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : Prisma.GetScalarType<T[P], EmpresaGroupByOutputType[P]>
          : Prisma.GetScalarType<T[P], EmpresaGroupByOutputType[P]>
      }
    >
  >



export type EmpresaWhereInput = {
  AND?: Prisma.EmpresaWhereInput | Prisma.EmpresaWhereInput[]
  OR?: Prisma.EmpresaWhereInput[]
  NOT?: Prisma.EmpresaWhereInput | Prisma.EmpresaWhereInput[]
  idEmpresa?: Prisma.UuidFilter<"Empresa"> | string
  rutEmpresa?: Prisma.StringFilter<"Empresa"> | string
  razonSocial?: Prisma.StringFilter<"Empresa"> | string
  estado?: Prisma.BoolFilter<"Empresa"> | boolean
  createdAt?: Prisma.DateTimeFilter<"Empresa"> | Date | string
  updatedAt?: Prisma.DateTimeFilter<"Empresa"> | Date | string
  usuario?: Prisma.XOR<Prisma.UsuarioNullableScalarRelationFilter, Prisma.UsuarioWhereInput> | null
}

export type EmpresaOrderByWithRelationInput = {
  idEmpresa?: Prisma.SortOrder
  rutEmpresa?: Prisma.SortOrder
  razonSocial?: Prisma.SortOrder
  estado?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  updatedAt?: Prisma.SortOrder
  usuario?: Prisma.UsuarioOrderByWithRelationInput
}

export type EmpresaWhereUniqueInput = Prisma.AtLeast<{
  idEmpresa?: string
  rutEmpresa?: string
  AND?: Prisma.EmpresaWhereInput | Prisma.EmpresaWhereInput[]
  OR?: Prisma.EmpresaWhereInput[]
  NOT?: Prisma.EmpresaWhereInput | Prisma.EmpresaWhereInput[]
  razonSocial?: Prisma.StringFilter<"Empresa"> | string
  estado?: Prisma.BoolFilter<"Empresa"> | boolean
  createdAt?: Prisma.DateTimeFilter<"Empresa"> | Date | string
  updatedAt?: Prisma.DateTimeFilter<"Empresa"> | Date | string
  usuario?: Prisma.XOR<Prisma.UsuarioNullableScalarRelationFilter, Prisma.UsuarioWhereInput> | null
}, "idEmpresa" | "rutEmpresa">

export type EmpresaOrderByWithAggregationInput = {
  idEmpresa?: Prisma.SortOrder
  rutEmpresa?: Prisma.SortOrder
  razonSocial?: Prisma.SortOrder
  estado?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  updatedAt?: Prisma.SortOrder
  _count?: Prisma.EmpresaCountOrderByAggregateInput
  _max?: Prisma.EmpresaMaxOrderByAggregateInput
  _min?: Prisma.EmpresaMinOrderByAggregateInput
}

export type EmpresaScalarWhereWithAggregatesInput = {
  AND?: Prisma.EmpresaScalarWhereWithAggregatesInput | Prisma.EmpresaScalarWhereWithAggregatesInput[]
  OR?: Prisma.EmpresaScalarWhereWithAggregatesInput[]
  NOT?: Prisma.EmpresaScalarWhereWithAggregatesInput | Prisma.EmpresaScalarWhereWithAggregatesInput[]
  idEmpresa?: Prisma.UuidWithAggregatesFilter<"Empresa"> | string
  rutEmpresa?: Prisma.StringWithAggregatesFilter<"Empresa"> | string
  razonSocial?: Prisma.StringWithAggregatesFilter<"Empresa"> | string
  estado?: Prisma.BoolWithAggregatesFilter<"Empresa"> | boolean
  createdAt?: Prisma.DateTimeWithAggregatesFilter<"Empresa"> | Date | string
  updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Empresa"> | Date | string
}

export type EmpresaCreateInput = {
  idEmpresa?: string
  rutEmpresa: string
  razonSocial: string
  estado?: boolean
  createdAt?: Date | string
  updatedAt?: Date | string
  usuario?: Prisma.UsuarioCreateNestedOneWithoutEmpresaInput
}

export type EmpresaUncheckedCreateInput = {
  idEmpresa?: string
  rutEmpresa: string
  razonSocial: string
  estado?: boolean
  createdAt?: Date | string
  updatedAt?: Date | string
  usuario?: Prisma.UsuarioUncheckedCreateNestedOneWithoutEmpresaInput
}

export type EmpresaUpdateInput = {
  idEmpresa?: Prisma.StringFieldUpdateOperationsInput | string
  rutEmpresa?: Prisma.StringFieldUpdateOperationsInput | string
  razonSocial?: Prisma.StringFieldUpdateOperationsInput | string
  estado?: Prisma.BoolFieldUpdateOperationsInput | boolean
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  usuario?: Prisma.UsuarioUpdateOneWithoutEmpresaNestedInput
}

export type EmpresaUncheckedUpdateInput = {
  idEmpresa?: Prisma.StringFieldUpdateOperationsInput | string
  rutEmpresa?: Prisma.StringFieldUpdateOperationsInput | string
  razonSocial?: Prisma.StringFieldUpdateOperationsInput | string
  estado?: Prisma.BoolFieldUpdateOperationsInput | boolean
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  usuario?: Prisma.UsuarioUncheckedUpdateOneWithoutEmpresaNestedInput
}

export type EmpresaCreateManyInput = {
  idEmpresa?: string
  rutEmpresa: string
  razonSocial: string
  estado?: boolean
  createdAt?: Date | string
  updatedAt?: Date | string
}

export type EmpresaUpdateManyMutationInput = {
  idEmpresa?: Prisma.StringFieldUpdateOperationsInput | string
  rutEmpresa?: Prisma.StringFieldUpdateOperationsInput | string
  razonSocial?: Prisma.StringFieldUpdateOperationsInput | string
  estado?: Prisma.BoolFieldUpdateOperationsInput | boolean
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type EmpresaUncheckedUpdateManyInput = {
  idEmpresa?: Prisma.StringFieldUpdateOperationsInput | string
  rutEmpresa?: Prisma.StringFieldUpdateOperationsInput | string
  razonSocial?: Prisma.StringFieldUpdateOperationsInput | string
  estado?: Prisma.BoolFieldUpdateOperationsInput | boolean
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type EmpresaCountOrderByAggregateInput = {
  idEmpresa?: Prisma.SortOrder
  rutEmpresa?: Prisma.SortOrder
  razonSocial?: Prisma.SortOrder
  estado?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  updatedAt?: Prisma.SortOrder
}

export type EmpresaMaxOrderByAggregateInput = {
  idEmpresa?: Prisma.SortOrder
  rutEmpresa?: Prisma.SortOrder
  razonSocial?: Prisma.SortOrder
  estado?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  updatedAt?: Prisma.SortOrder
}

export type EmpresaMinOrderByAggregateInput = {
  idEmpresa?: Prisma.SortOrder
  rutEmpresa?: Prisma.SortOrder
  razonSocial?: Prisma.SortOrder
  estado?: Prisma.SortOrder
  createdAt?: Prisma.SortOrder
  updatedAt?: Prisma.SortOrder
}

export type EmpresaScalarRelationFilter = {
  is?: Prisma.EmpresaWhereInput
  isNot?: Prisma.EmpresaWhereInput
}

export type StringFieldUpdateOperationsInput = {
  set?: string
}

export type BoolFieldUpdateOperationsInput = {
  set?: boolean
}

export type DateTimeFieldUpdateOperationsInput = {
  set?: Date | string
}

export type EmpresaCreateNestedOneWithoutUsuarioInput = {
  create?: Prisma.XOR<Prisma.EmpresaCreateWithoutUsuarioInput, Prisma.EmpresaUncheckedCreateWithoutUsuarioInput>
  connectOrCreate?: Prisma.EmpresaCreateOrConnectWithoutUsuarioInput
  connect?: Prisma.EmpresaWhereUniqueInput
}

export type EmpresaUpdateOneRequiredWithoutUsuarioNestedInput = {
  create?: Prisma.XOR<Prisma.EmpresaCreateWithoutUsuarioInput, Prisma.EmpresaUncheckedCreateWithoutUsuarioInput>
  connectOrCreate?: Prisma.EmpresaCreateOrConnectWithoutUsuarioInput
  upsert?: Prisma.EmpresaUpsertWithoutUsuarioInput
  connect?: Prisma.EmpresaWhereUniqueInput
  update?: Prisma.XOR<Prisma.XOR<Prisma.EmpresaUpdateToOneWithWhereWithoutUsuarioInput, Prisma.EmpresaUpdateWithoutUsuarioInput>, Prisma.EmpresaUncheckedUpdateWithoutUsuarioInput>
}

export type EmpresaCreateWithoutUsuarioInput = {
  idEmpresa?: string
  rutEmpresa: string
  razonSocial: string
  estado?: boolean
  createdAt?: Date | string
  updatedAt?: Date | string
}

export type EmpresaUncheckedCreateWithoutUsuarioInput = {
  idEmpresa?: string
  rutEmpresa: string
  razonSocial: string
  estado?: boolean
  createdAt?: Date | string
  updatedAt?: Date | string
}

export type EmpresaCreateOrConnectWithoutUsuarioInput = {
  where: Prisma.EmpresaWhereUniqueInput
  create: Prisma.XOR<Prisma.EmpresaCreateWithoutUsuarioInput, Prisma.EmpresaUncheckedCreateWithoutUsuarioInput>
}

export type EmpresaUpsertWithoutUsuarioInput = {
  update: Prisma.XOR<Prisma.EmpresaUpdateWithoutUsuarioInput, Prisma.EmpresaUncheckedUpdateWithoutUsuarioInput>
  create: Prisma.XOR<Prisma.EmpresaCreateWithoutUsuarioInput, Prisma.EmpresaUncheckedCreateWithoutUsuarioInput>
  where?: Prisma.EmpresaWhereInput
}

export type EmpresaUpdateToOneWithWhereWithoutUsuarioInput = {
  where?: Prisma.EmpresaWhereInput
  data: Prisma.XOR<Prisma.EmpresaUpdateWithoutUsuarioInput, Prisma.EmpresaUncheckedUpdateWithoutUsuarioInput>
}

export type EmpresaUpdateWithoutUsuarioInput = {
  idEmpresa?: Prisma.StringFieldUpdateOperationsInput | string
  rutEmpresa?: Prisma.StringFieldUpdateOperationsInput | string
  razonSocial?: Prisma.StringFieldUpdateOperationsInput | string
  estado?: Prisma.BoolFieldUpdateOperationsInput | boolean
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}

export type EmpresaUncheckedUpdateWithoutUsuarioInput = {
  idEmpresa?: Prisma.StringFieldUpdateOperationsInput | string
  rutEmpresa?: Prisma.StringFieldUpdateOperationsInput | string
  razonSocial?: Prisma.StringFieldUpdateOperationsInput | string
  estado?: Prisma.BoolFieldUpdateOperationsInput | boolean
  createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
  updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string
}



export type EmpresaSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  idEmpresa?: boolean
  rutEmpresa?: boolean
  razonSocial?: boolean
  estado?: boolean
  createdAt?: boolean
  updatedAt?: boolean
  usuario?: boolean | Prisma.Empresa$usuarioArgs<ExtArgs>
}, ExtArgs["result"]["empresa"]>

export type EmpresaSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  idEmpresa?: boolean
  rutEmpresa?: boolean
  razonSocial?: boolean
  estado?: boolean
  createdAt?: boolean
  updatedAt?: boolean
}, ExtArgs["result"]["empresa"]>

export type EmpresaSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
  idEmpresa?: boolean
  rutEmpresa?: boolean
  razonSocial?: boolean
  estado?: boolean
  createdAt?: boolean
  updatedAt?: boolean
}, ExtArgs["result"]["empresa"]>

export type EmpresaSelectScalar = {
  idEmpresa?: boolean
  rutEmpresa?: boolean
  razonSocial?: boolean
  estado?: boolean
  createdAt?: boolean
  updatedAt?: boolean
}

export type EmpresaOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"idEmpresa" | "rutEmpresa" | "razonSocial" | "estado" | "createdAt" | "updatedAt", ExtArgs["result"]["empresa"]>
export type EmpresaInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  usuario?: boolean | Prisma.Empresa$usuarioArgs<ExtArgs>
}
export type EmpresaIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {}
export type EmpresaIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {}

export type $EmpresaPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  name: "Empresa"
  objects: {
    usuario: Prisma.$UsuarioPayload<ExtArgs> | null
  }
  scalars: runtime.Types.Extensions.GetPayloadResult<{
    idEmpresa: string
    rutEmpresa: string
    razonSocial: string
    estado: boolean
    createdAt: Date
    updatedAt: Date
  }, ExtArgs["result"]["empresa"]>
  composites: {}
}

export type EmpresaGetPayload<S extends boolean | null | undefined | EmpresaDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EmpresaPayload, S>

export type EmpresaCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> =
  Omit<EmpresaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EmpresaCountAggregateInputType | true
  }

export interface EmpresaDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Empresa'], meta: { name: 'Empresa' } }
  findUnique<T extends EmpresaFindUniqueArgs>(args: Prisma.SelectSubset<T, EmpresaFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EmpresaClient<runtime.Types.Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  findUniqueOrThrow<T extends EmpresaFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EmpresaFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EmpresaClient<runtime.Types.Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  findFirst<T extends EmpresaFindFirstArgs>(args?: Prisma.SelectSubset<T, EmpresaFindFirstArgs<ExtArgs>>): Prisma.Prisma__EmpresaClient<runtime.Types.Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

  findFirstOrThrow<T extends EmpresaFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EmpresaFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EmpresaClient<runtime.Types.Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  findMany<T extends EmpresaFindManyArgs>(args?: Prisma.SelectSubset<T, EmpresaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

  create<T extends EmpresaCreateArgs>(args: Prisma.SelectSubset<T, EmpresaCreateArgs<ExtArgs>>): Prisma.Prisma__EmpresaClient<runtime.Types.Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  createMany<T extends EmpresaCreateManyArgs>(args?: Prisma.SelectSubset<T, EmpresaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  createManyAndReturn<T extends EmpresaCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, EmpresaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

  delete<T extends EmpresaDeleteArgs>(args: Prisma.SelectSubset<T, EmpresaDeleteArgs<ExtArgs>>): Prisma.Prisma__EmpresaClient<runtime.Types.Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  update<T extends EmpresaUpdateArgs>(args: Prisma.SelectSubset<T, EmpresaUpdateArgs<ExtArgs>>): Prisma.Prisma__EmpresaClient<runtime.Types.Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  deleteMany<T extends EmpresaDeleteManyArgs>(args?: Prisma.SelectSubset<T, EmpresaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  updateMany<T extends EmpresaUpdateManyArgs>(args: Prisma.SelectSubset<T, EmpresaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>

  updateManyAndReturn<T extends EmpresaUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, EmpresaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

  upsert<T extends EmpresaUpsertArgs>(args: Prisma.SelectSubset<T, EmpresaUpsertArgs<ExtArgs>>): Prisma.Prisma__EmpresaClient<runtime.Types.Result.GetResult<Prisma.$EmpresaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

  count<T extends EmpresaCountArgs>(
    args?: Prisma.Subset<T, EmpresaCountArgs>,
  ): Prisma.PrismaPromise<
    T extends runtime.Types.Utils.Record<'select', any>
      ? T['select'] extends true
        ? number
        : Prisma.GetScalarType<T['select'], EmpresaCountAggregateOutputType>
      : number
  >

  aggregate<T extends EmpresaAggregateArgs>(args: Prisma.Subset<T, EmpresaAggregateArgs>): Prisma.PrismaPromise<GetEmpresaAggregateType<T>>

  groupBy<
    T extends EmpresaGroupByArgs,
    HasSelectOrTake extends Prisma.Or<
      Prisma.Extends<'skip', Prisma.Keys<T>>,
      Prisma.Extends<'take', Prisma.Keys<T>>
    >,
    OrderByArg extends Prisma.True extends HasSelectOrTake
      ? { orderBy: EmpresaGroupByArgs['orderBy'] }
      : { orderBy?: EmpresaGroupByArgs['orderBy'] },
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
  >(args: Prisma.SubsetIntersection<T, EmpresaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmpresaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
readonly fields: EmpresaFieldRefs;
}

export interface Prisma__EmpresaClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
  readonly [Symbol.toStringTag]: "PrismaPromise"
  usuario<T extends Prisma.Empresa$usuarioArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Empresa$usuarioArgs<ExtArgs>>): Prisma.Prisma__UsuarioClient<runtime.Types.Result.GetResult<Prisma.$UsuarioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
  then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>
  catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>
  finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>
}

export interface EmpresaFieldRefs {
  readonly idEmpresa: Prisma.FieldRef<"Empresa", 'String'>
  readonly rutEmpresa: Prisma.FieldRef<"Empresa", 'String'>
  readonly razonSocial: Prisma.FieldRef<"Empresa", 'String'>
  readonly estado: Prisma.FieldRef<"Empresa", 'Boolean'>
  readonly createdAt: Prisma.FieldRef<"Empresa", 'DateTime'>
  readonly updatedAt: Prisma.FieldRef<"Empresa", 'DateTime'>
}

export type EmpresaFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.EmpresaSelect<ExtArgs> | null
  omit?: Prisma.EmpresaOmit<ExtArgs> | null
  include?: Prisma.EmpresaInclude<ExtArgs> | null
  where: Prisma.EmpresaWhereUniqueInput
}

export type EmpresaFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.EmpresaSelect<ExtArgs> | null
  omit?: Prisma.EmpresaOmit<ExtArgs> | null
  include?: Prisma.EmpresaInclude<ExtArgs> | null
  where: Prisma.EmpresaWhereUniqueInput
}

export type EmpresaFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.EmpresaSelect<ExtArgs> | null
  omit?: Prisma.EmpresaOmit<ExtArgs> | null
  include?: Prisma.EmpresaInclude<ExtArgs> | null
  where?: Prisma.EmpresaWhereInput
  orderBy?: Prisma.EmpresaOrderByWithRelationInput | Prisma.EmpresaOrderByWithRelationInput[]
  cursor?: Prisma.EmpresaWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.EmpresaScalarFieldEnum | Prisma.EmpresaScalarFieldEnum[]
}

export type EmpresaFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.EmpresaSelect<ExtArgs> | null
  omit?: Prisma.EmpresaOmit<ExtArgs> | null
  include?: Prisma.EmpresaInclude<ExtArgs> | null
  where?: Prisma.EmpresaWhereInput
  orderBy?: Prisma.EmpresaOrderByWithRelationInput | Prisma.EmpresaOrderByWithRelationInput[]
  cursor?: Prisma.EmpresaWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.EmpresaScalarFieldEnum | Prisma.EmpresaScalarFieldEnum[]
}

export type EmpresaFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.EmpresaSelect<ExtArgs> | null
  omit?: Prisma.EmpresaOmit<ExtArgs> | null
  include?: Prisma.EmpresaInclude<ExtArgs> | null
  where?: Prisma.EmpresaWhereInput
  orderBy?: Prisma.EmpresaOrderByWithRelationInput | Prisma.EmpresaOrderByWithRelationInput[]
  cursor?: Prisma.EmpresaWhereUniqueInput
  take?: number
  skip?: number
  distinct?: Prisma.EmpresaScalarFieldEnum | Prisma.EmpresaScalarFieldEnum[]
}

export type EmpresaCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.EmpresaSelect<ExtArgs> | null
  omit?: Prisma.EmpresaOmit<ExtArgs> | null
  include?: Prisma.EmpresaInclude<ExtArgs> | null
  data: Prisma.XOR<Prisma.EmpresaCreateInput, Prisma.EmpresaUncheckedCreateInput>
}

export type EmpresaCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  data: Prisma.EmpresaCreateManyInput | Prisma.EmpresaCreateManyInput[]
  skipDuplicates?: boolean
}

export type EmpresaCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.EmpresaSelectCreateManyAndReturn<ExtArgs> | null
  omit?: Prisma.EmpresaOmit<ExtArgs> | null
  data: Prisma.EmpresaCreateManyInput | Prisma.EmpresaCreateManyInput[]
  skipDuplicates?: boolean
}

export type EmpresaUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.EmpresaSelect<ExtArgs> | null
  omit?: Prisma.EmpresaOmit<ExtArgs> | null
  include?: Prisma.EmpresaInclude<ExtArgs> | null
  data: Prisma.XOR<Prisma.EmpresaUpdateInput, Prisma.EmpresaUncheckedUpdateInput>
  where: Prisma.EmpresaWhereUniqueInput
}

export type EmpresaUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  data: Prisma.XOR<Prisma.EmpresaUpdateManyMutationInput, Prisma.EmpresaUncheckedUpdateManyInput>
  where?: Prisma.EmpresaWhereInput
  limit?: number
}

export type EmpresaUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.EmpresaSelectUpdateManyAndReturn<ExtArgs> | null
  omit?: Prisma.EmpresaOmit<ExtArgs> | null
  data: Prisma.XOR<Prisma.EmpresaUpdateManyMutationInput, Prisma.EmpresaUncheckedUpdateManyInput>
  where?: Prisma.EmpresaWhereInput
  limit?: number
}

export type EmpresaUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.EmpresaSelect<ExtArgs> | null
  omit?: Prisma.EmpresaOmit<ExtArgs> | null
  include?: Prisma.EmpresaInclude<ExtArgs> | null
  where: Prisma.EmpresaWhereUniqueInput
  create: Prisma.XOR<Prisma.EmpresaCreateInput, Prisma.EmpresaUncheckedCreateInput>
  update: Prisma.XOR<Prisma.EmpresaUpdateInput, Prisma.EmpresaUncheckedUpdateInput>
}

export type EmpresaDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.EmpresaSelect<ExtArgs> | null
  omit?: Prisma.EmpresaOmit<ExtArgs> | null
  include?: Prisma.EmpresaInclude<ExtArgs> | null
  where: Prisma.EmpresaWhereUniqueInput
}

export type EmpresaDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  where?: Prisma.EmpresaWhereInput
  limit?: number
}

export type Empresa$usuarioArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.UsuarioSelect<ExtArgs> | null
  omit?: Prisma.UsuarioOmit<ExtArgs> | null
  include?: Prisma.UsuarioInclude<ExtArgs> | null
  where?: Prisma.UsuarioWhereInput
}

export type EmpresaDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
  select?: Prisma.EmpresaSelect<ExtArgs> | null
  omit?: Prisma.EmpresaOmit<ExtArgs> | null
  include?: Prisma.EmpresaInclude<ExtArgs> | null
}
