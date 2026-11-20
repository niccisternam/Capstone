import type { Direccion } from "@/api/dashboard.api";

export const DIRECCIONES: ReadonlyArray<{ valor: Direccion; etiqueta: string }> = [
  { valor: "COMPRA", etiqueta: "Compras" },
  { valor: "VENTA", etiqueta: "Ventas" },
  { valor: "TODAS", etiqueta: "Ambas" },
];

export type TextosDireccion = {
  /** Título del gráfico mensual. */
  mensual: string;
  /** Título del ranking de contrapartes. */
  contrapartes: string;
  /** Título del indicador de totales. */
  total: string;
  /** Título del indicador de productos. */
  productos: string;
};

export const TEXTOS_DIRECCION: Record<Direccion, TextosDireccion> = {
  COMPRA: {
    mensual: "Compras por mes",
    contrapartes: "Principales proveedores",
    total: "Total de compras",
    productos: "Productos y servicios",
  },
  VENTA: {
    mensual: "Ventas por mes",
    contrapartes: "Principales clientes",
    total: "Total de ventas",
    productos: "Productos y servicios",
  },
  TODAS: {
    mensual: "Compras y ventas por mes",
    contrapartes: "Principales proveedores y clientes",
    total: "Total de compras y ventas",
    productos: "Productos y servicios",
  },
};
