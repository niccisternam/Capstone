
import * as runtime from "@prisma/client/runtime/client"
import type * as Prisma from "../models.js"
import { type PrismaClient } from "./class.js"

export type * from '../models.js'

export type DMMF = typeof runtime.DMMF

export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>

export const PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError

export const PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError

export const PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError

export const PrismaClientInitializationError = runtime.PrismaClientInitializationError
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError

export const PrismaClientValidationError = runtime.PrismaClientValidationError
export type PrismaClientValidationError = runtime.PrismaClientValidationError

export const sql = runtime.sqltag
export const empty = runtime.empty
export const join = runtime.join
export const raw = runtime.raw
export const Sql = runtime.Sql
export type Sql = runtime.Sql

export const Decimal = runtime.Decimal
export type Decimal = runtime.Decimal

export type DecimalJsLike = runtime.DecimalJsLike

export type Extension = runtime.Types.Extensions.UserArgs
export const getExtensionContext = runtime.Extensions.getExtensionContext
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>

export type PrismaVersion = {
  client: string
  engine: string
}

export const prismaVersion: PrismaVersion = {
  client: "7.10.0",
  engine: "0edf323efd1d98336f3f0a68684b56f689b900d3"
}

export type Bytes = runtime.Bytes
export type JsonObject = runtime.JsonObject
export type JsonArray = runtime.JsonArray
export type JsonValue = runtime.JsonValue
export type InputJsonObject = runtime.InputJsonObject
export type InputJsonArray = runtime.InputJsonArray
export type InputJsonValue = runtime.InputJsonValue


export const NullTypes = {
  DbNull: runtime.NullTypes.DbNull as (new (secret: never) => typeof runtime.DbNull),
  JsonNull: runtime.NullTypes.JsonNull as (new (secret: never) => typeof runtime.JsonNull),
  AnyNull: runtime.NullTypes.AnyNull as (new (secret: never) => typeof runtime.AnyNull),
}

export const DbNull = runtime.DbNull

export const JsonNull = runtime.JsonNull

export const AnyNull = runtime.AnyNull


type SelectAndInclude = {
  select: any
  include: any
}

type SelectAndOmit = {
  select: any
  omit: any
}

type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

export type Enumerable<T> = T | Array<T>;

export type Subset<T, U> = {
  [key in keyof T]: key extends keyof U ? T[key] : never;
};

export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> =
  [PrismaClientOptions] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;

export type SelectSubset<T, U> = {
  [key in keyof T]: key extends keyof U ? T[key] : never
} &
  (T extends SelectAndInclude
    ? 'Please either choose `select` or `include`.'
    : T extends SelectAndOmit
      ? 'Please either choose `select` or `omit`.'
      : {})

export type SubsetIntersection<T, U, K> = {
  [key in keyof T]: key extends keyof U ? T[key] : never
} &
  K

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

export type XOR<T, U> =
  T extends object ?
  U extends object ?
    ((Without<T, U> & U) | (Without<U, T> & T)) & object
  : U : T


type IsObject<T extends any> = T extends Array<any>
? False
: T extends Date
? False
: T extends Uint8Array
? False
: T extends BigInt
? False
: T extends object
? True
: False


export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

type __Either<O extends object, K extends Key> = Omit<O, K> &
  {
    [P in K]: Prisma__Pick<O, P & keyof O>
  }[K]

type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

type _Either<
  O extends object,
  K extends Key,
  strict extends Boolean
> = {
  1: EitherStrict<O, K>
  0: EitherLoose<O, K>
}[strict]

export type Either<
  O extends object,
  K extends Key,
  strict extends Boolean = 1
> = O extends unknown ? _Either<O, K, strict> : never

export type Union = any

export type PatchUndefined<O extends object, O1 extends object> = {
  [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
} & {}

export type IntersectOf<U extends Union> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never

export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};

type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;

type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];

export type ComputeRaw<A extends any> = A extends Function ? A : {
  [K in keyof A]: A[K];
} & {};

export type OptionalFlat<O> = {
  [K in keyof O]?: O[K];
} & {};

type _Record<K extends keyof any, T> = {
  [P in K]: T;
};

type NoExpand<T> = T extends unknown ? T : never;

export type AtLeast<O extends object, K extends string> = NoExpand<
  O extends unknown
  ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
    | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
  : never>;

type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

export type Strict<U extends object> = ComputeRaw<_Strict<U>>;

export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

export type Boolean = True | False

export type True = 1

export type False = 0

export type Not<B extends Boolean> = {
  0: 1
  1: 0
}[B]

export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
  ? 0
  : A1 extends A2
  ? 1
  : 0

export type Has<U extends Union, U1 extends Union> = Not<
  Extends<Exclude<U1, U>, U1>
>

export type Or<B1 extends Boolean, B2 extends Boolean> = {
  0: {
    0: 0
    1: 1
  }
  1: {
    0: 1
    1: 1
  }
}[B1][B2]

export type Keys<U extends Union> = U extends unknown ? keyof U : never

export type GetScalarType<T, O> = O extends object ? {
  [P in keyof T]: P extends keyof O
    ? O[P]
    : never
} : never

type FieldPaths<
  T,
  U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
> = IsObject<T> extends True ? U : T

export type GetHavingFields<T> = {
  [K in keyof T]: Or<
    Or<Extends<'OR', K>, Extends<'AND', K>>,
    Extends<'NOT', K>
  > extends True
    ? T[K] extends infer TK
      ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
      : never
    : {} extends FieldPaths<T[K]>
    ? never
    : K
}[keyof T]

type _TupleToUnion<T> = T extends (infer E)[] ? E : never
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


export const ModelName = {
  Empresa: 'Empresa',
  Usuario: 'Usuario',
  SolicitudCuenta: 'SolicitudCuenta',
  SesionUsuario: 'SesionUsuario',
  TokenSeguridad: 'TokenSeguridad',
  EventoSeguridad: 'EventoSeguridad'
} as const

export type ModelName = (typeof ModelName)[keyof typeof ModelName]



export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{extArgs: runtime.Types.Extensions.InternalArgs }, runtime.Types.Utils.Record<string, any>> {
  returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>
}

export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
  globalOmitOptions: {
    omit: GlobalOmitOptions
  }
  meta: {
    modelProps: "empresa" | "usuario" | "solicitudCuenta" | "sesionUsuario" | "tokenSeguridad" | "eventoSeguridad"
    txIsolationLevel: TransactionIsolationLevel
  }
  model: {
    Empresa: {
      payload: Prisma.$EmpresaPayload<ExtArgs>
      fields: Prisma.EmpresaFieldRefs
      operations: {
        findUnique: {
          args: Prisma.EmpresaFindUniqueArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$EmpresaPayload> | null
        }
        findUniqueOrThrow: {
          args: Prisma.EmpresaFindUniqueOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$EmpresaPayload>
        }
        findFirst: {
          args: Prisma.EmpresaFindFirstArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$EmpresaPayload> | null
        }
        findFirstOrThrow: {
          args: Prisma.EmpresaFindFirstOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$EmpresaPayload>
        }
        findMany: {
          args: Prisma.EmpresaFindManyArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$EmpresaPayload>[]
        }
        create: {
          args: Prisma.EmpresaCreateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$EmpresaPayload>
        }
        createMany: {
          args: Prisma.EmpresaCreateManyArgs<ExtArgs>
          result: BatchPayload
        }
        createManyAndReturn: {
          args: Prisma.EmpresaCreateManyAndReturnArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$EmpresaPayload>[]
        }
        delete: {
          args: Prisma.EmpresaDeleteArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$EmpresaPayload>
        }
        update: {
          args: Prisma.EmpresaUpdateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$EmpresaPayload>
        }
        deleteMany: {
          args: Prisma.EmpresaDeleteManyArgs<ExtArgs>
          result: BatchPayload
        }
        updateMany: {
          args: Prisma.EmpresaUpdateManyArgs<ExtArgs>
          result: BatchPayload
        }
        updateManyAndReturn: {
          args: Prisma.EmpresaUpdateManyAndReturnArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$EmpresaPayload>[]
        }
        upsert: {
          args: Prisma.EmpresaUpsertArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$EmpresaPayload>
        }
        aggregate: {
          args: Prisma.EmpresaAggregateArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.AggregateEmpresa>
        }
        groupBy: {
          args: Prisma.EmpresaGroupByArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.EmpresaGroupByOutputType>[]
        }
        count: {
          args: Prisma.EmpresaCountArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.EmpresaCountAggregateOutputType> | number
        }
      }
    }
    Usuario: {
      payload: Prisma.$UsuarioPayload<ExtArgs>
      fields: Prisma.UsuarioFieldRefs
      operations: {
        findUnique: {
          args: Prisma.UsuarioFindUniqueArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UsuarioPayload> | null
        }
        findUniqueOrThrow: {
          args: Prisma.UsuarioFindUniqueOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UsuarioPayload>
        }
        findFirst: {
          args: Prisma.UsuarioFindFirstArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UsuarioPayload> | null
        }
        findFirstOrThrow: {
          args: Prisma.UsuarioFindFirstOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UsuarioPayload>
        }
        findMany: {
          args: Prisma.UsuarioFindManyArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
        }
        create: {
          args: Prisma.UsuarioCreateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UsuarioPayload>
        }
        createMany: {
          args: Prisma.UsuarioCreateManyArgs<ExtArgs>
          result: BatchPayload
        }
        createManyAndReturn: {
          args: Prisma.UsuarioCreateManyAndReturnArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
        }
        delete: {
          args: Prisma.UsuarioDeleteArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UsuarioPayload>
        }
        update: {
          args: Prisma.UsuarioUpdateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UsuarioPayload>
        }
        deleteMany: {
          args: Prisma.UsuarioDeleteManyArgs<ExtArgs>
          result: BatchPayload
        }
        updateMany: {
          args: Prisma.UsuarioUpdateManyArgs<ExtArgs>
          result: BatchPayload
        }
        updateManyAndReturn: {
          args: Prisma.UsuarioUpdateManyAndReturnArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UsuarioPayload>[]
        }
        upsert: {
          args: Prisma.UsuarioUpsertArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$UsuarioPayload>
        }
        aggregate: {
          args: Prisma.UsuarioAggregateArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.AggregateUsuario>
        }
        groupBy: {
          args: Prisma.UsuarioGroupByArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.UsuarioGroupByOutputType>[]
        }
        count: {
          args: Prisma.UsuarioCountArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.UsuarioCountAggregateOutputType> | number
        }
      }
    }
    SolicitudCuenta: {
      payload: Prisma.$SolicitudCuentaPayload<ExtArgs>
      fields: Prisma.SolicitudCuentaFieldRefs
      operations: {
        findUnique: {
          args: Prisma.SolicitudCuentaFindUniqueArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$SolicitudCuentaPayload> | null
        }
        findUniqueOrThrow: {
          args: Prisma.SolicitudCuentaFindUniqueOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$SolicitudCuentaPayload>
        }
        findFirst: {
          args: Prisma.SolicitudCuentaFindFirstArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$SolicitudCuentaPayload> | null
        }
        findFirstOrThrow: {
          args: Prisma.SolicitudCuentaFindFirstOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$SolicitudCuentaPayload>
        }
        findMany: {
          args: Prisma.SolicitudCuentaFindManyArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$SolicitudCuentaPayload>[]
        }
        create: {
          args: Prisma.SolicitudCuentaCreateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$SolicitudCuentaPayload>
        }
        createMany: {
          args: Prisma.SolicitudCuentaCreateManyArgs<ExtArgs>
          result: BatchPayload
        }
        createManyAndReturn: {
          args: Prisma.SolicitudCuentaCreateManyAndReturnArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$SolicitudCuentaPayload>[]
        }
        delete: {
          args: Prisma.SolicitudCuentaDeleteArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$SolicitudCuentaPayload>
        }
        update: {
          args: Prisma.SolicitudCuentaUpdateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$SolicitudCuentaPayload>
        }
        deleteMany: {
          args: Prisma.SolicitudCuentaDeleteManyArgs<ExtArgs>
          result: BatchPayload
        }
        updateMany: {
          args: Prisma.SolicitudCuentaUpdateManyArgs<ExtArgs>
          result: BatchPayload
        }
        updateManyAndReturn: {
          args: Prisma.SolicitudCuentaUpdateManyAndReturnArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$SolicitudCuentaPayload>[]
        }
        upsert: {
          args: Prisma.SolicitudCuentaUpsertArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$SolicitudCuentaPayload>
        }
        aggregate: {
          args: Prisma.SolicitudCuentaAggregateArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.AggregateSolicitudCuenta>
        }
        groupBy: {
          args: Prisma.SolicitudCuentaGroupByArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.SolicitudCuentaGroupByOutputType>[]
        }
        count: {
          args: Prisma.SolicitudCuentaCountArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.SolicitudCuentaCountAggregateOutputType> | number
        }
      }
    }
    SesionUsuario: {
      payload: Prisma.$SesionUsuarioPayload<ExtArgs>
      fields: Prisma.SesionUsuarioFieldRefs
      operations: {
        findUnique: {
          args: Prisma.SesionUsuarioFindUniqueArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$SesionUsuarioPayload> | null
        }
        findUniqueOrThrow: {
          args: Prisma.SesionUsuarioFindUniqueOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$SesionUsuarioPayload>
        }
        findFirst: {
          args: Prisma.SesionUsuarioFindFirstArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$SesionUsuarioPayload> | null
        }
        findFirstOrThrow: {
          args: Prisma.SesionUsuarioFindFirstOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$SesionUsuarioPayload>
        }
        findMany: {
          args: Prisma.SesionUsuarioFindManyArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$SesionUsuarioPayload>[]
        }
        create: {
          args: Prisma.SesionUsuarioCreateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$SesionUsuarioPayload>
        }
        createMany: {
          args: Prisma.SesionUsuarioCreateManyArgs<ExtArgs>
          result: BatchPayload
        }
        createManyAndReturn: {
          args: Prisma.SesionUsuarioCreateManyAndReturnArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$SesionUsuarioPayload>[]
        }
        delete: {
          args: Prisma.SesionUsuarioDeleteArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$SesionUsuarioPayload>
        }
        update: {
          args: Prisma.SesionUsuarioUpdateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$SesionUsuarioPayload>
        }
        deleteMany: {
          args: Prisma.SesionUsuarioDeleteManyArgs<ExtArgs>
          result: BatchPayload
        }
        updateMany: {
          args: Prisma.SesionUsuarioUpdateManyArgs<ExtArgs>
          result: BatchPayload
        }
        updateManyAndReturn: {
          args: Prisma.SesionUsuarioUpdateManyAndReturnArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$SesionUsuarioPayload>[]
        }
        upsert: {
          args: Prisma.SesionUsuarioUpsertArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$SesionUsuarioPayload>
        }
        aggregate: {
          args: Prisma.SesionUsuarioAggregateArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.AggregateSesionUsuario>
        }
        groupBy: {
          args: Prisma.SesionUsuarioGroupByArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.SesionUsuarioGroupByOutputType>[]
        }
        count: {
          args: Prisma.SesionUsuarioCountArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.SesionUsuarioCountAggregateOutputType> | number
        }
      }
    }
    TokenSeguridad: {
      payload: Prisma.$TokenSeguridadPayload<ExtArgs>
      fields: Prisma.TokenSeguridadFieldRefs
      operations: {
        findUnique: {
          args: Prisma.TokenSeguridadFindUniqueArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenSeguridadPayload> | null
        }
        findUniqueOrThrow: {
          args: Prisma.TokenSeguridadFindUniqueOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenSeguridadPayload>
        }
        findFirst: {
          args: Prisma.TokenSeguridadFindFirstArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenSeguridadPayload> | null
        }
        findFirstOrThrow: {
          args: Prisma.TokenSeguridadFindFirstOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenSeguridadPayload>
        }
        findMany: {
          args: Prisma.TokenSeguridadFindManyArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenSeguridadPayload>[]
        }
        create: {
          args: Prisma.TokenSeguridadCreateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenSeguridadPayload>
        }
        createMany: {
          args: Prisma.TokenSeguridadCreateManyArgs<ExtArgs>
          result: BatchPayload
        }
        createManyAndReturn: {
          args: Prisma.TokenSeguridadCreateManyAndReturnArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenSeguridadPayload>[]
        }
        delete: {
          args: Prisma.TokenSeguridadDeleteArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenSeguridadPayload>
        }
        update: {
          args: Prisma.TokenSeguridadUpdateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenSeguridadPayload>
        }
        deleteMany: {
          args: Prisma.TokenSeguridadDeleteManyArgs<ExtArgs>
          result: BatchPayload
        }
        updateMany: {
          args: Prisma.TokenSeguridadUpdateManyArgs<ExtArgs>
          result: BatchPayload
        }
        updateManyAndReturn: {
          args: Prisma.TokenSeguridadUpdateManyAndReturnArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenSeguridadPayload>[]
        }
        upsert: {
          args: Prisma.TokenSeguridadUpsertArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$TokenSeguridadPayload>
        }
        aggregate: {
          args: Prisma.TokenSeguridadAggregateArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.AggregateTokenSeguridad>
        }
        groupBy: {
          args: Prisma.TokenSeguridadGroupByArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.TokenSeguridadGroupByOutputType>[]
        }
        count: {
          args: Prisma.TokenSeguridadCountArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.TokenSeguridadCountAggregateOutputType> | number
        }
      }
    }
    EventoSeguridad: {
      payload: Prisma.$EventoSeguridadPayload<ExtArgs>
      fields: Prisma.EventoSeguridadFieldRefs
      operations: {
        findUnique: {
          args: Prisma.EventoSeguridadFindUniqueArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$EventoSeguridadPayload> | null
        }
        findUniqueOrThrow: {
          args: Prisma.EventoSeguridadFindUniqueOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$EventoSeguridadPayload>
        }
        findFirst: {
          args: Prisma.EventoSeguridadFindFirstArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$EventoSeguridadPayload> | null
        }
        findFirstOrThrow: {
          args: Prisma.EventoSeguridadFindFirstOrThrowArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$EventoSeguridadPayload>
        }
        findMany: {
          args: Prisma.EventoSeguridadFindManyArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$EventoSeguridadPayload>[]
        }
        create: {
          args: Prisma.EventoSeguridadCreateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$EventoSeguridadPayload>
        }
        createMany: {
          args: Prisma.EventoSeguridadCreateManyArgs<ExtArgs>
          result: BatchPayload
        }
        createManyAndReturn: {
          args: Prisma.EventoSeguridadCreateManyAndReturnArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$EventoSeguridadPayload>[]
        }
        delete: {
          args: Prisma.EventoSeguridadDeleteArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$EventoSeguridadPayload>
        }
        update: {
          args: Prisma.EventoSeguridadUpdateArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$EventoSeguridadPayload>
        }
        deleteMany: {
          args: Prisma.EventoSeguridadDeleteManyArgs<ExtArgs>
          result: BatchPayload
        }
        updateMany: {
          args: Prisma.EventoSeguridadUpdateManyArgs<ExtArgs>
          result: BatchPayload
        }
        updateManyAndReturn: {
          args: Prisma.EventoSeguridadUpdateManyAndReturnArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$EventoSeguridadPayload>[]
        }
        upsert: {
          args: Prisma.EventoSeguridadUpsertArgs<ExtArgs>
          result: runtime.Types.Utils.PayloadToResult<Prisma.$EventoSeguridadPayload>
        }
        aggregate: {
          args: Prisma.EventoSeguridadAggregateArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.AggregateEventoSeguridad>
        }
        groupBy: {
          args: Prisma.EventoSeguridadGroupByArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.EventoSeguridadGroupByOutputType>[]
        }
        count: {
          args: Prisma.EventoSeguridadCountArgs<ExtArgs>
          result: runtime.Types.Utils.Optional<Prisma.EventoSeguridadCountAggregateOutputType> | number
        }
      }
    }
  }
} & {
  other: {
    payload: any
    operations: {
      $executeRaw: {
        args: [query: TemplateStringsArray | Sql, ...values: any[]],
        result: any
      }
      $executeRawUnsafe: {
        args: [query: string, ...values: any[]],
        result: any
      }
      $queryRaw: {
        args: [query: TemplateStringsArray | Sql, ...values: any[]],
        result: any
      }
      $queryRawUnsafe: {
        args: [query: string, ...values: any[]],
        result: any
      }
    }
  }
}

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



export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>

export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>

export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>

export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>

export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>

export type EnumRolUsuarioFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RolUsuario'>

export type ListEnumRolUsuarioFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RolUsuario[]'>

export type EnumEstadoUsuarioFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EstadoUsuario'>

export type ListEnumEstadoUsuarioFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EstadoUsuario[]'>

export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>

export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>

export type EnumEstadoSolicitudFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EstadoSolicitud'>

export type ListEnumEstadoSolicitudFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EstadoSolicitud[]'>

export type EnumTipoTokenSeguridadFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoTokenSeguridad'>

export type ListEnumTipoTokenSeguridadFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoTokenSeguridad[]'>

export type EnumTipoEventoSeguridadFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoEventoSeguridad'>

export type ListEnumTipoEventoSeguridadFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoEventoSeguridad[]'>

export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>

export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>

export type BatchPayload = {
  count: number
}

export const defineExtension = runtime.Extensions.defineExtension as unknown as runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>
export type DefaultPrismaClient = PrismaClient
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
export interface PrismaClientBaseOptions {
  errorFormat?: ErrorFormat
  log?: (LogLevel | LogDefinition)[]
  transactionOptions?: {
    maxWait?: number
    timeout?: number
    isolationLevel?: TransactionIsolationLevel
  }
  omit?: GlobalOmitConfig
  comments?: runtime.SqlCommenterPlugin[]
  queryPlanCacheMaxSize?: number
}

export interface PrismaClientOptionsWithAccelerateUrl extends PrismaClientBaseOptions {
  accelerateUrl: string
  adapter?: never
}

export interface PrismaClientOptionsWithAdapter extends PrismaClientBaseOptions {
  adapter: runtime.SqlDriverAdapterFactory
  accelerateUrl?: never
}

export type PrismaClientOptions = PrismaClientOptionsWithAccelerateUrl | PrismaClientOptionsWithAdapter
export type GlobalOmitConfig = {
  empresa?: Prisma.EmpresaOmit
  usuario?: Prisma.UsuarioOmit
  solicitudCuenta?: Prisma.SolicitudCuentaOmit
  sesionUsuario?: Prisma.SesionUsuarioOmit
  tokenSeguridad?: Prisma.TokenSeguridadOmit
  eventoSeguridad?: Prisma.EventoSeguridadOmit
}

export type LogLevel = 'info' | 'query' | 'warn' | 'error'
export type LogDefinition = {
  level: LogLevel
  emit: 'stdout' | 'event'
}

export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

export type GetLogType<T> = CheckIsLogLevel<
  T extends LogDefinition ? T['level'] : T
>;

export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
  ? GetLogType<T[number]>
  : never;

export type QueryEvent = {
  timestamp: Date
  query: string
  params: string
  duration: number
  target: string
}

export type LogEvent = {
  timestamp: Date
  message: string
  target: string
}

export type PrismaAction =
  | 'findUnique'
  | 'findUniqueOrThrow'
  | 'findMany'
  | 'findFirst'
  | 'findFirstOrThrow'
  | 'create'
  | 'createMany'
  | 'createManyAndReturn'
  | 'update'
  | 'updateMany'
  | 'updateManyAndReturn'
  | 'upsert'
  | 'delete'
  | 'deleteMany'
  | 'executeRaw'
  | 'queryRaw'
  | 'aggregate'
  | 'count'
  | 'runCommandRaw'
  | 'findRaw'
  | 'groupBy'

export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>

