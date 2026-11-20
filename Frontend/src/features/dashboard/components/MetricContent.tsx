import type { DatoWidget, Direccion, Metrica } from "@/api/dashboard.api";
import { TEXTOS_DIRECCION } from "../direccion";
import type { RangoMeses } from "../periodos";
import { Panel } from "./Panel";
import { TendenciaMensual } from "./MonthlyChart";
import { Ranking } from "./Ranking";
import { Ajustes, PagosPendientes, ResumenMontos } from "./SummaryCards";

export function MetricContent({
  metrica,
  datos,
  rango,
  direccion,
}: {
  metrica: Metrica;
  datos: DatoWidget[];
  rango: RangoMeses | null;
  direccion: Direccion;
}) {
  const [fila] = datos;
  const textos = TEXTOS_DIRECCION[direccion];

  switch (metrica) {
    case "resumen_montos":
      return fila ? (
        <ResumenMontos fila={fila} titulo={textos.total} />
      ) : (
        <Panel titulo={textos.total} descripcion="Documentos confirmados">
          <p className="py-6 text-sm text-slate-500">Sin documentos confirmados.</p>
        </Panel>
      );
    case "compras_por_periodo":
      return (
        <Panel titulo={textos.mensual} descripcion="Evolución según fecha de emisión" className="border-blue-200 bg-[#f7f9fe] lg:col-span-12">
          <TendenciaMensual filas={datos} rango={rango} />
        </Panel>
      );
    case "compras_por_proveedor":
      return (
        <Panel titulo={textos.contrapartes} descripcion="Ordenados por total" className="border-teal-200 bg-[#f5fbf9] lg:col-span-6">
          <Ranking filas={datos} etiqueta="proveedor" valor="total" color="teal" />
        </Panel>
      );
    case "compras_por_producto":
      return (
        <Panel titulo={textos.productos} descripcion="Líneas con mayor total" className="border-indigo-200 bg-[#f7f8ff] lg:col-span-6">
          <Ranking filas={datos} etiqueta="producto" valor="total" color="indigo" />
        </Panel>
      );
    case "pagos_pendientes":
      return (
        <Panel titulo="Pagos pendientes" descripcion="Compromisos marcados como pendientes" className="border-amber-300 bg-[#fffdf7] lg:col-span-4">
          <PagosPendientes fila={fila ?? { pendiente: "0", documentos: 0 }} />
        </Panel>
      );
    case "descuentos_recargos":
      return (
        <Panel titulo="Descuentos y recargos" descripcion="Montos registrados por tipo y origen" className="border-slate-300 bg-[#f8fafc] lg:col-span-12">
          <Ajustes filas={datos} />
        </Panel>
      );
  }
}
