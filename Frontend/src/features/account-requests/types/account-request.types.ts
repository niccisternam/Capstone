import type { AccountRequestItem, RequestStatus } from "@/api/accountRequests.api";

export type StatusFilterOption = "TODOS" | RequestStatus;

export interface AccountRequestsFilterState {
  estado: StatusFilterOption;
  busqueda: string;
  pagina: number;
  porPagina: number;
}

export function filterAccountRequests(
  solicitudes: AccountRequestItem[],
  filtroEstado: StatusFilterOption,
  busqueda: string
): AccountRequestItem[] {
  return solicitudes.filter((item) => {
    // 1. Filtro por estado
    if (filtroEstado !== "TODOS" && item.estado !== filtroEstado) {
      return false;
    }

    // 2. Filtro por búsqueda de texto (RUT, Folio/ID, Razón Social, Nombre, Apellido, Correo)
    if (!busqueda || busqueda.trim().length === 0) {
      return true;
    }

    const term = busqueda.toLowerCase().trim();
    const matchesFolio = item.idSolicitud.toLowerCase().includes(term);
    const matchesRutEmpresa = item.rutEmpresa.toLowerCase().includes(term);
    const matchesRutUsuario = item.rutUsuario.toLowerCase().includes(term);
    const matchesRazonSocial = (item.razonSocial ?? "").toLowerCase().includes(term);
    const matchesNombre = `${item.nombre} ${item.apellido}`.toLowerCase().includes(term);
    const matchesCorreo = item.correo.toLowerCase().includes(term);

    return (
      matchesFolio ||
      matchesRutEmpresa ||
      matchesRutUsuario ||
      matchesRazonSocial ||
      matchesNombre ||
      matchesCorreo
    );
  });
}

export function paginateRequests(
  items: AccountRequestItem[],
  pagina: number,
  porPagina: number
): {
  items: AccountRequestItem[];
  totalPaginas: number;
  totalElementos: number;
} {
  const totalElementos = items.length;
  const totalPaginas = Math.max(1, Math.ceil(totalElementos / porPagina));
  const paginaActual = Math.min(Math.max(1, pagina), totalPaginas);
  const inicio = (paginaActual - 1) * porPagina;
  const fin = inicio + porPagina;

  return {
    items: items.slice(inicio, fin),
    totalPaginas,
    totalElementos,
  };
}
