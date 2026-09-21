
import type * as runtime from "@prisma/client/runtime/client"
import * as $Enums from "./enums.js"
import type * as Prisma from "./internal/prismaNamespace.js"


export type UuidFilter<$PrismaModel = never> = {
  equals?: string | Prisma.StringFieldRefInput<$PrismaModel>
  in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>
  notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>
  lt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  lte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  mode?: Prisma.QueryMode
  not?: Prisma.NestedUuidFilter<$PrismaModel> | string
}

export type StringFilter<$PrismaModel = never> = {
  equals?: string | Prisma.StringFieldRefInput<$PrismaModel>
  in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>
  notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>
  lt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  lte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  contains?: string | Prisma.StringFieldRefInput<$PrismaModel>
  startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  mode?: Prisma.QueryMode
  not?: Prisma.NestedStringFilter<$PrismaModel> | string
}

export type BoolFilter<$PrismaModel = never> = {
  equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>
  not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean
}

export type DateTimeFilter<$PrismaModel = never> = {
  equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>
  notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>
  lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string
}

export type UuidWithAggregatesFilter<$PrismaModel = never> = {
  equals?: string | Prisma.StringFieldRefInput<$PrismaModel>
  in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>
  notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>
  lt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  lte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  mode?: Prisma.QueryMode
  not?: Prisma.NestedUuidWithAggregatesFilter<$PrismaModel> | string
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedStringFilter<$PrismaModel>
  _max?: Prisma.NestedStringFilter<$PrismaModel>
}

export type StringWithAggregatesFilter<$PrismaModel = never> = {
  equals?: string | Prisma.StringFieldRefInput<$PrismaModel>
  in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>
  notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>
  lt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  lte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  contains?: string | Prisma.StringFieldRefInput<$PrismaModel>
  startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  mode?: Prisma.QueryMode
  not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedStringFilter<$PrismaModel>
  _max?: Prisma.NestedStringFilter<$PrismaModel>
}

export type BoolWithAggregatesFilter<$PrismaModel = never> = {
  equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>
  not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedBoolFilter<$PrismaModel>
  _max?: Prisma.NestedBoolFilter<$PrismaModel>
}

export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
  equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>
  notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>
  lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedDateTimeFilter<$PrismaModel>
  _max?: Prisma.NestedDateTimeFilter<$PrismaModel>
}

export type EnumRolUsuarioFilter<$PrismaModel = never> = {
  equals?: $Enums.RolUsuario | Prisma.EnumRolUsuarioFieldRefInput<$PrismaModel>
  in?: $Enums.RolUsuario[] | Prisma.ListEnumRolUsuarioFieldRefInput<$PrismaModel>
  notIn?: $Enums.RolUsuario[] | Prisma.ListEnumRolUsuarioFieldRefInput<$PrismaModel>
  not?: Prisma.NestedEnumRolUsuarioFilter<$PrismaModel> | $Enums.RolUsuario
}

export type EnumEstadoUsuarioFilter<$PrismaModel = never> = {
  equals?: $Enums.EstadoUsuario | Prisma.EnumEstadoUsuarioFieldRefInput<$PrismaModel>
  in?: $Enums.EstadoUsuario[] | Prisma.ListEnumEstadoUsuarioFieldRefInput<$PrismaModel>
  notIn?: $Enums.EstadoUsuario[] | Prisma.ListEnumEstadoUsuarioFieldRefInput<$PrismaModel>
  not?: Prisma.NestedEnumEstadoUsuarioFilter<$PrismaModel> | $Enums.EstadoUsuario
}

export type IntFilter<$PrismaModel = never> = {
  equals?: number | Prisma.IntFieldRefInput<$PrismaModel>
  in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>
  notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>
  lt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  lte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  not?: Prisma.NestedIntFilter<$PrismaModel> | number
}

export type DateTimeNullableFilter<$PrismaModel = never> = {
  equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null
  in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null
  notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null
  lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
}

export type SortOrderInput = {
  sort: Prisma.SortOrder
  nulls?: Prisma.NullsOrder
}

export type EnumRolUsuarioWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.RolUsuario | Prisma.EnumRolUsuarioFieldRefInput<$PrismaModel>
  in?: $Enums.RolUsuario[] | Prisma.ListEnumRolUsuarioFieldRefInput<$PrismaModel>
  notIn?: $Enums.RolUsuario[] | Prisma.ListEnumRolUsuarioFieldRefInput<$PrismaModel>
  not?: Prisma.NestedEnumRolUsuarioWithAggregatesFilter<$PrismaModel> | $Enums.RolUsuario
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumRolUsuarioFilter<$PrismaModel>
  _max?: Prisma.NestedEnumRolUsuarioFilter<$PrismaModel>
}

export type EnumEstadoUsuarioWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.EstadoUsuario | Prisma.EnumEstadoUsuarioFieldRefInput<$PrismaModel>
  in?: $Enums.EstadoUsuario[] | Prisma.ListEnumEstadoUsuarioFieldRefInput<$PrismaModel>
  notIn?: $Enums.EstadoUsuario[] | Prisma.ListEnumEstadoUsuarioFieldRefInput<$PrismaModel>
  not?: Prisma.NestedEnumEstadoUsuarioWithAggregatesFilter<$PrismaModel> | $Enums.EstadoUsuario
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumEstadoUsuarioFilter<$PrismaModel>
  _max?: Prisma.NestedEnumEstadoUsuarioFilter<$PrismaModel>
}

export type IntWithAggregatesFilter<$PrismaModel = never> = {
  equals?: number | Prisma.IntFieldRefInput<$PrismaModel>
  in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>
  notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>
  lt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  lte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _avg?: Prisma.NestedFloatFilter<$PrismaModel>
  _sum?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedIntFilter<$PrismaModel>
  _max?: Prisma.NestedIntFilter<$PrismaModel>
}

export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
  equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null
  in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null
  notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null
  lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
  _count?: Prisma.NestedIntNullableFilter<$PrismaModel>
  _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>
  _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>
}

export type StringNullableFilter<$PrismaModel = never> = {
  equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null
  in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null
  notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null
  lt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  lte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  contains?: string | Prisma.StringFieldRefInput<$PrismaModel>
  startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  mode?: Prisma.QueryMode
  not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null
}

export type EnumEstadoSolicitudFilter<$PrismaModel = never> = {
  equals?: $Enums.EstadoSolicitud | Prisma.EnumEstadoSolicitudFieldRefInput<$PrismaModel>
  in?: $Enums.EstadoSolicitud[] | Prisma.ListEnumEstadoSolicitudFieldRefInput<$PrismaModel>
  notIn?: $Enums.EstadoSolicitud[] | Prisma.ListEnumEstadoSolicitudFieldRefInput<$PrismaModel>
  not?: Prisma.NestedEnumEstadoSolicitudFilter<$PrismaModel> | $Enums.EstadoSolicitud
}

export type UuidNullableFilter<$PrismaModel = never> = {
  equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null
  in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null
  notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null
  lt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  lte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  mode?: Prisma.QueryMode
  not?: Prisma.NestedUuidNullableFilter<$PrismaModel> | string | null
}

export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
  equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null
  in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null
  notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null
  lt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  lte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  contains?: string | Prisma.StringFieldRefInput<$PrismaModel>
  startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  mode?: Prisma.QueryMode
  not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
  _count?: Prisma.NestedIntNullableFilter<$PrismaModel>
  _min?: Prisma.NestedStringNullableFilter<$PrismaModel>
  _max?: Prisma.NestedStringNullableFilter<$PrismaModel>
}

export type EnumEstadoSolicitudWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.EstadoSolicitud | Prisma.EnumEstadoSolicitudFieldRefInput<$PrismaModel>
  in?: $Enums.EstadoSolicitud[] | Prisma.ListEnumEstadoSolicitudFieldRefInput<$PrismaModel>
  notIn?: $Enums.EstadoSolicitud[] | Prisma.ListEnumEstadoSolicitudFieldRefInput<$PrismaModel>
  not?: Prisma.NestedEnumEstadoSolicitudWithAggregatesFilter<$PrismaModel> | $Enums.EstadoSolicitud
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumEstadoSolicitudFilter<$PrismaModel>
  _max?: Prisma.NestedEnumEstadoSolicitudFilter<$PrismaModel>
}

export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
  equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null
  in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null
  notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null
  lt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  lte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  mode?: Prisma.QueryMode
  not?: Prisma.NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
  _count?: Prisma.NestedIntNullableFilter<$PrismaModel>
  _min?: Prisma.NestedStringNullableFilter<$PrismaModel>
  _max?: Prisma.NestedStringNullableFilter<$PrismaModel>
}

export type EnumTipoTokenSeguridadFilter<$PrismaModel = never> = {
  equals?: $Enums.TipoTokenSeguridad | Prisma.EnumTipoTokenSeguridadFieldRefInput<$PrismaModel>
  in?: $Enums.TipoTokenSeguridad[] | Prisma.ListEnumTipoTokenSeguridadFieldRefInput<$PrismaModel>
  notIn?: $Enums.TipoTokenSeguridad[] | Prisma.ListEnumTipoTokenSeguridadFieldRefInput<$PrismaModel>
  not?: Prisma.NestedEnumTipoTokenSeguridadFilter<$PrismaModel> | $Enums.TipoTokenSeguridad
}

export type EnumTipoTokenSeguridadWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.TipoTokenSeguridad | Prisma.EnumTipoTokenSeguridadFieldRefInput<$PrismaModel>
  in?: $Enums.TipoTokenSeguridad[] | Prisma.ListEnumTipoTokenSeguridadFieldRefInput<$PrismaModel>
  notIn?: $Enums.TipoTokenSeguridad[] | Prisma.ListEnumTipoTokenSeguridadFieldRefInput<$PrismaModel>
  not?: Prisma.NestedEnumTipoTokenSeguridadWithAggregatesFilter<$PrismaModel> | $Enums.TipoTokenSeguridad
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumTipoTokenSeguridadFilter<$PrismaModel>
  _max?: Prisma.NestedEnumTipoTokenSeguridadFilter<$PrismaModel>
}

export type EnumTipoEventoSeguridadFilter<$PrismaModel = never> = {
  equals?: $Enums.TipoEventoSeguridad | Prisma.EnumTipoEventoSeguridadFieldRefInput<$PrismaModel>
  in?: $Enums.TipoEventoSeguridad[] | Prisma.ListEnumTipoEventoSeguridadFieldRefInput<$PrismaModel>
  notIn?: $Enums.TipoEventoSeguridad[] | Prisma.ListEnumTipoEventoSeguridadFieldRefInput<$PrismaModel>
  not?: Prisma.NestedEnumTipoEventoSeguridadFilter<$PrismaModel> | $Enums.TipoEventoSeguridad
}

export type EnumTipoEventoSeguridadWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.TipoEventoSeguridad | Prisma.EnumTipoEventoSeguridadFieldRefInput<$PrismaModel>
  in?: $Enums.TipoEventoSeguridad[] | Prisma.ListEnumTipoEventoSeguridadFieldRefInput<$PrismaModel>
  notIn?: $Enums.TipoEventoSeguridad[] | Prisma.ListEnumTipoEventoSeguridadFieldRefInput<$PrismaModel>
  not?: Prisma.NestedEnumTipoEventoSeguridadWithAggregatesFilter<$PrismaModel> | $Enums.TipoEventoSeguridad
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumTipoEventoSeguridadFilter<$PrismaModel>
  _max?: Prisma.NestedEnumTipoEventoSeguridadFilter<$PrismaModel>
}

export type NestedUuidFilter<$PrismaModel = never> = {
  equals?: string | Prisma.StringFieldRefInput<$PrismaModel>
  in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>
  notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>
  lt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  lte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  not?: Prisma.NestedUuidFilter<$PrismaModel> | string
}

export type NestedStringFilter<$PrismaModel = never> = {
  equals?: string | Prisma.StringFieldRefInput<$PrismaModel>
  in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>
  notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>
  lt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  lte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  contains?: string | Prisma.StringFieldRefInput<$PrismaModel>
  startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  not?: Prisma.NestedStringFilter<$PrismaModel> | string
}

export type NestedBoolFilter<$PrismaModel = never> = {
  equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>
  not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean
}

export type NestedDateTimeFilter<$PrismaModel = never> = {
  equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>
  notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>
  lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string
}

export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
  equals?: string | Prisma.StringFieldRefInput<$PrismaModel>
  in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>
  notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>
  lt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  lte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  not?: Prisma.NestedUuidWithAggregatesFilter<$PrismaModel> | string
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedStringFilter<$PrismaModel>
  _max?: Prisma.NestedStringFilter<$PrismaModel>
}

export type NestedIntFilter<$PrismaModel = never> = {
  equals?: number | Prisma.IntFieldRefInput<$PrismaModel>
  in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>
  notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>
  lt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  lte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  not?: Prisma.NestedIntFilter<$PrismaModel> | number
}

export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
  equals?: string | Prisma.StringFieldRefInput<$PrismaModel>
  in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>
  notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>
  lt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  lte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  contains?: string | Prisma.StringFieldRefInput<$PrismaModel>
  startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedStringFilter<$PrismaModel>
  _max?: Prisma.NestedStringFilter<$PrismaModel>
}

export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
  equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>
  not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedBoolFilter<$PrismaModel>
  _max?: Prisma.NestedBoolFilter<$PrismaModel>
}

export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
  equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>
  notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>
  lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedDateTimeFilter<$PrismaModel>
  _max?: Prisma.NestedDateTimeFilter<$PrismaModel>
}

export type NestedEnumRolUsuarioFilter<$PrismaModel = never> = {
  equals?: $Enums.RolUsuario | Prisma.EnumRolUsuarioFieldRefInput<$PrismaModel>
  in?: $Enums.RolUsuario[] | Prisma.ListEnumRolUsuarioFieldRefInput<$PrismaModel>
  notIn?: $Enums.RolUsuario[] | Prisma.ListEnumRolUsuarioFieldRefInput<$PrismaModel>
  not?: Prisma.NestedEnumRolUsuarioFilter<$PrismaModel> | $Enums.RolUsuario
}

export type NestedEnumEstadoUsuarioFilter<$PrismaModel = never> = {
  equals?: $Enums.EstadoUsuario | Prisma.EnumEstadoUsuarioFieldRefInput<$PrismaModel>
  in?: $Enums.EstadoUsuario[] | Prisma.ListEnumEstadoUsuarioFieldRefInput<$PrismaModel>
  notIn?: $Enums.EstadoUsuario[] | Prisma.ListEnumEstadoUsuarioFieldRefInput<$PrismaModel>
  not?: Prisma.NestedEnumEstadoUsuarioFilter<$PrismaModel> | $Enums.EstadoUsuario
}

export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
  equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null
  in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null
  notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null
  lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
}

export type NestedEnumRolUsuarioWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.RolUsuario | Prisma.EnumRolUsuarioFieldRefInput<$PrismaModel>
  in?: $Enums.RolUsuario[] | Prisma.ListEnumRolUsuarioFieldRefInput<$PrismaModel>
  notIn?: $Enums.RolUsuario[] | Prisma.ListEnumRolUsuarioFieldRefInput<$PrismaModel>
  not?: Prisma.NestedEnumRolUsuarioWithAggregatesFilter<$PrismaModel> | $Enums.RolUsuario
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumRolUsuarioFilter<$PrismaModel>
  _max?: Prisma.NestedEnumRolUsuarioFilter<$PrismaModel>
}

export type NestedEnumEstadoUsuarioWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.EstadoUsuario | Prisma.EnumEstadoUsuarioFieldRefInput<$PrismaModel>
  in?: $Enums.EstadoUsuario[] | Prisma.ListEnumEstadoUsuarioFieldRefInput<$PrismaModel>
  notIn?: $Enums.EstadoUsuario[] | Prisma.ListEnumEstadoUsuarioFieldRefInput<$PrismaModel>
  not?: Prisma.NestedEnumEstadoUsuarioWithAggregatesFilter<$PrismaModel> | $Enums.EstadoUsuario
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumEstadoUsuarioFilter<$PrismaModel>
  _max?: Prisma.NestedEnumEstadoUsuarioFilter<$PrismaModel>
}

export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
  equals?: number | Prisma.IntFieldRefInput<$PrismaModel>
  in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>
  notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>
  lt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  lte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _avg?: Prisma.NestedFloatFilter<$PrismaModel>
  _sum?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedIntFilter<$PrismaModel>
  _max?: Prisma.NestedIntFilter<$PrismaModel>
}

export type NestedFloatFilter<$PrismaModel = never> = {
  equals?: number | Prisma.FloatFieldRefInput<$PrismaModel>
  in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>
  notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>
  lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>
  lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>
  gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>
  gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>
  not?: Prisma.NestedFloatFilter<$PrismaModel> | number
}

export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
  equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null
  in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null
  notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null
  lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>
  not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
  _count?: Prisma.NestedIntNullableFilter<$PrismaModel>
  _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>
  _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>
}

export type NestedIntNullableFilter<$PrismaModel = never> = {
  equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null
  in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null
  notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null
  lt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  lte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gt?: number | Prisma.IntFieldRefInput<$PrismaModel>
  gte?: number | Prisma.IntFieldRefInput<$PrismaModel>
  not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null
}

export type NestedStringNullableFilter<$PrismaModel = never> = {
  equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null
  in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null
  notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null
  lt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  lte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  contains?: string | Prisma.StringFieldRefInput<$PrismaModel>
  startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null
}

export type NestedEnumEstadoSolicitudFilter<$PrismaModel = never> = {
  equals?: $Enums.EstadoSolicitud | Prisma.EnumEstadoSolicitudFieldRefInput<$PrismaModel>
  in?: $Enums.EstadoSolicitud[] | Prisma.ListEnumEstadoSolicitudFieldRefInput<$PrismaModel>
  notIn?: $Enums.EstadoSolicitud[] | Prisma.ListEnumEstadoSolicitudFieldRefInput<$PrismaModel>
  not?: Prisma.NestedEnumEstadoSolicitudFilter<$PrismaModel> | $Enums.EstadoSolicitud
}

export type NestedUuidNullableFilter<$PrismaModel = never> = {
  equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null
  in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null
  notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null
  lt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  lte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  not?: Prisma.NestedUuidNullableFilter<$PrismaModel> | string | null
}

export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
  equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null
  in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null
  notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null
  lt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  lte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  contains?: string | Prisma.StringFieldRefInput<$PrismaModel>
  startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>
  not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
  _count?: Prisma.NestedIntNullableFilter<$PrismaModel>
  _min?: Prisma.NestedStringNullableFilter<$PrismaModel>
  _max?: Prisma.NestedStringNullableFilter<$PrismaModel>
}

export type NestedEnumEstadoSolicitudWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.EstadoSolicitud | Prisma.EnumEstadoSolicitudFieldRefInput<$PrismaModel>
  in?: $Enums.EstadoSolicitud[] | Prisma.ListEnumEstadoSolicitudFieldRefInput<$PrismaModel>
  notIn?: $Enums.EstadoSolicitud[] | Prisma.ListEnumEstadoSolicitudFieldRefInput<$PrismaModel>
  not?: Prisma.NestedEnumEstadoSolicitudWithAggregatesFilter<$PrismaModel> | $Enums.EstadoSolicitud
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumEstadoSolicitudFilter<$PrismaModel>
  _max?: Prisma.NestedEnumEstadoSolicitudFilter<$PrismaModel>
}

export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
  equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null
  in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null
  notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null
  lt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  lte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gt?: string | Prisma.StringFieldRefInput<$PrismaModel>
  gte?: string | Prisma.StringFieldRefInput<$PrismaModel>
  not?: Prisma.NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
  _count?: Prisma.NestedIntNullableFilter<$PrismaModel>
  _min?: Prisma.NestedStringNullableFilter<$PrismaModel>
  _max?: Prisma.NestedStringNullableFilter<$PrismaModel>
}

export type NestedEnumTipoTokenSeguridadFilter<$PrismaModel = never> = {
  equals?: $Enums.TipoTokenSeguridad | Prisma.EnumTipoTokenSeguridadFieldRefInput<$PrismaModel>
  in?: $Enums.TipoTokenSeguridad[] | Prisma.ListEnumTipoTokenSeguridadFieldRefInput<$PrismaModel>
  notIn?: $Enums.TipoTokenSeguridad[] | Prisma.ListEnumTipoTokenSeguridadFieldRefInput<$PrismaModel>
  not?: Prisma.NestedEnumTipoTokenSeguridadFilter<$PrismaModel> | $Enums.TipoTokenSeguridad
}

export type NestedEnumTipoTokenSeguridadWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.TipoTokenSeguridad | Prisma.EnumTipoTokenSeguridadFieldRefInput<$PrismaModel>
  in?: $Enums.TipoTokenSeguridad[] | Prisma.ListEnumTipoTokenSeguridadFieldRefInput<$PrismaModel>
  notIn?: $Enums.TipoTokenSeguridad[] | Prisma.ListEnumTipoTokenSeguridadFieldRefInput<$PrismaModel>
  not?: Prisma.NestedEnumTipoTokenSeguridadWithAggregatesFilter<$PrismaModel> | $Enums.TipoTokenSeguridad
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumTipoTokenSeguridadFilter<$PrismaModel>
  _max?: Prisma.NestedEnumTipoTokenSeguridadFilter<$PrismaModel>
}

export type NestedEnumTipoEventoSeguridadFilter<$PrismaModel = never> = {
  equals?: $Enums.TipoEventoSeguridad | Prisma.EnumTipoEventoSeguridadFieldRefInput<$PrismaModel>
  in?: $Enums.TipoEventoSeguridad[] | Prisma.ListEnumTipoEventoSeguridadFieldRefInput<$PrismaModel>
  notIn?: $Enums.TipoEventoSeguridad[] | Prisma.ListEnumTipoEventoSeguridadFieldRefInput<$PrismaModel>
  not?: Prisma.NestedEnumTipoEventoSeguridadFilter<$PrismaModel> | $Enums.TipoEventoSeguridad
}

export type NestedEnumTipoEventoSeguridadWithAggregatesFilter<$PrismaModel = never> = {
  equals?: $Enums.TipoEventoSeguridad | Prisma.EnumTipoEventoSeguridadFieldRefInput<$PrismaModel>
  in?: $Enums.TipoEventoSeguridad[] | Prisma.ListEnumTipoEventoSeguridadFieldRefInput<$PrismaModel>
  notIn?: $Enums.TipoEventoSeguridad[] | Prisma.ListEnumTipoEventoSeguridadFieldRefInput<$PrismaModel>
  not?: Prisma.NestedEnumTipoEventoSeguridadWithAggregatesFilter<$PrismaModel> | $Enums.TipoEventoSeguridad
  _count?: Prisma.NestedIntFilter<$PrismaModel>
  _min?: Prisma.NestedEnumTipoEventoSeguridadFilter<$PrismaModel>
  _max?: Prisma.NestedEnumTipoEventoSeguridadFilter<$PrismaModel>
}


