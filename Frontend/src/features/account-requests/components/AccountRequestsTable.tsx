"use client";

import React, { useState, useEffect, useMemo, useId } from "react";
import { useRouter } from "next/navigation";
import {
  listAccountRequests,
  type AccountRequestItem,
} from "@/api/accountRequests.api";
import {
  type StatusFilterOption,
  filterAccountRequests,
  paginateRequests,
} from "../types/account-request.types";

export function AccountRequestsTable() {
  const router = useRouter();
  const searchInputId = useId();

  // Estados de control de datos (inicia estrictamente vacío sin datos ficticios)
  const [solicitudes, setSolicitudes] = useState<AccountRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<boolean>(false);

  // Estados de filtros (el filtro de estado SIEMPRE inicia como "TODOS")
  const [filtroEstado, setFiltroEstado] = useState<StatusFilterOption>("TODOS");
  const [busqueda, setBusqueda] = useState<string>("");

  // Paginación
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const porPagina = 5;

  // Selección de filas
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Cargar solicitudes reales desde el backend Express con credenciales de Administrador
  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setIsLoading(true);
      setAuthError(false);

      try {
        const res = await listAccountRequests(filtroEstado);

        if (!isMounted) return;

        if (res.status === 200 && Array.isArray(res.data?.solicitudes)) {
          setSolicitudes(res.data.solicitudes);
        } else if (res.status === 403) {
          // Si el usuario no tiene rol de administrador, redirigir a /usuario
          router.replace("/usuario");
          return;
        } else if (res.status === 401) {
          // Si no está autenticado, redirigir al login
          router.replace("/login");
          return;
        } else {
          setSolicitudes([]);
          setAuthError(true);
        }
      } catch {
        if (isMounted) {
          setSolicitudes([]);
          setAuthError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [filtroEstado, router]);

  // Filtrado y paginación en memoria
  const filteredItems = useMemo(() => {
    return filterAccountRequests(solicitudes, filtroEstado, busqueda);
  }, [solicitudes, filtroEstado, busqueda]);

  const { items: paginatedItems, totalPaginas } = useMemo(() => {
    return paginateRequests(filteredItems, paginaActual, porPagina);
  }, [filteredItems, paginaActual, porPagina]);

  // Manejo de selección de filas
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = new Set(paginatedItems.map((item) => item.idSolicitud));
      setSelectedIds(allIds);
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectRow = (id: string) => {
    const updated = new Set(selectedIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedIds(updated);
  };

  // Formato de fecha y hora local DD/MM/AAAA HH:mm
  const formatDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const mins = String(date.getMinutes()).padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${mins}`;
    } catch {
      return isoString;
    }
  };

  // Badge de estado con estilo semántico
  const renderEstadoBadge = (estado: string) => {
    switch (estado) {
      case "APROBADA":
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
            Aprobada
          </span>
        );
      case "RECHAZADA":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">
            Rechazada
          </span>
        );
      case "PENDIENTE":
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
            Pendiente
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Alerta de error si falla la sincronización */}
      {authError && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 p-4 text-xs sm:text-sm text-red-700"
        >
          No fue posible sincronizar las solicitudes con el servidor. Verifique su conexión y permisos de administrador.
        </div>
      )}

      {/* Barra superior con Filtro de Estado a la derecha como en el mockup */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          Mostrando {filteredItems.length} solicitudes encontradas
        </div>

        {/* Filtro de estado: Aprobado, Rechazado y Todos (por defecto siempre Todos) */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <label htmlFor="filtro-estado-select" className="text-xs sm:text-sm font-semibold text-slate-700">
            Filtro de estado:
          </label>
          <select
            id="filtro-estado-select"
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value as StatusFilterOption);
              setPaginaActual(1);
            }}
            className="rounded-md border-2 border-slate-700 bg-slate-100 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-900 shadow-xs transition-colors focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          >
            <option value="TODOS">Todos</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="APROBADA">Aprobado</option>
            <option value="RECHAZADA">Rechazado</option>
          </select>
        </div>
      </div>

      {/* Tarjeta contenedora de la tabla */}
      <div className="rounded-lg border-2 border-slate-700 bg-slate-100/90 p-4 sm:p-6 shadow-sm">
        {/* Buscador dentro del contenedor como en el mockup */}
        <div className="mb-4 max-w-md">
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-3 text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </span>
            <input
              id={searchInputId}
              type="text"
              placeholder="Buscar por Nº Folio, RUT o Razón Social..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
              className="w-full rounded-full border border-slate-400 bg-white py-1.5 pl-9 pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-xs focus:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tabla responsive */}
        <div className="overflow-x-auto rounded-md border border-slate-400 bg-white shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700 border-collapse">
            <thead className="bg-slate-300 text-slate-900 font-bold border-b border-slate-400">
              <tr>
                <th scope="col" className="p-2.5 sm:p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    aria-label="Seleccionar todas las solicitudes de la página"
                    onChange={handleSelectAll}
                    checked={
                      paginatedItems.length > 0 &&
                      paginatedItems.every((item) => selectedIds.has(item.idSolicitud))
                    }
                    className="h-4 w-4 rounded border-slate-400 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th scope="col" className="p-2.5 sm:p-3 border-l border-slate-300">
                  Fecha / Hora
                </th>
                <th scope="col" className="p-2.5 sm:p-3 border-l border-slate-300">
                  Solicitante
                </th>
                <th scope="col" className="p-2.5 sm:p-3 border-l border-slate-300">
                  Correo Electrónico
                </th>
                <th scope="col" className="p-2.5 sm:p-3 border-l border-slate-300">
                  Empresa / Negocio
                </th>
                <th scope="col" className="p-2.5 sm:p-3 border-l border-slate-300">
                  Estado
                </th>
                {/* Botón / Columna de acción al lado derecho de Estado */}
                <th scope="col" className="p-2.5 sm:p-3 border-l border-slate-300 text-center">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Cargando solicitudes...
                  </td>
                </tr>
              ) : paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No se encontraron solicitudes con los criterios de búsqueda aplicados.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => (
                  <tr
                    key={item.idSolicitud}
                    className={`transition-colors hover:bg-slate-50 ${
                      selectedIds.has(item.idSolicitud) ? "bg-blue-50/60" : ""
                    }`}
                  >
                    <td className="p-2.5 sm:p-3 text-center">
                      <input
                        type="checkbox"
                        aria-label={`Seleccionar solicitud ${item.idSolicitud}`}
                        checked={selectedIds.has(item.idSolicitud)}
                        onChange={() => handleSelectRow(item.idSolicitud)}
                        className="h-4 w-4 rounded border-slate-400 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td
                      suppressHydrationWarning
                      className="p-2.5 sm:p-3 whitespace-nowrap font-medium text-slate-900 border-l border-slate-200"
                    >
                      {formatDateTime(item.createdAt)}
                    </td>
                    <td className="p-2.5 sm:p-3 whitespace-nowrap border-l border-slate-200">
                      {item.nombre} {item.apellido}
                    </td>
                    <td className="p-2.5 sm:p-3 whitespace-nowrap border-l border-slate-200">
                      <a
                        href={`mailto:${item.correo}`}
                        className="text-blue-600 hover:underline"
                      >
                        {item.correo}
                      </a>
                    </td>
                    <td className="p-2.5 sm:p-3 whitespace-nowrap border-l border-slate-200">
                      {item.razonSocial ?? item.rutEmpresa}
                    </td>
                    <td className="p-2.5 sm:p-3 whitespace-nowrap border-l border-slate-200">
                      {renderEstadoBadge(item.estado)}
                    </td>
                    {/* Botón al lado derecho de estado para pasar a otra página */}
                    <td className="p-2.5 sm:p-3 whitespace-nowrap border-l border-slate-200 text-center">
                      <button
                        type="button"
                        onClick={() => router.push(`/admin/solicitudes/${item.idSolicitud}`)}
                        className="inline-flex items-center gap-1 rounded border border-slate-400 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-2xs hover:bg-blue-600 hover:text-white hover:border-blue-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        <span>Revisar</span>
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginador inferior idéntico al mockup */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1 sm:gap-2">
          <button
            type="button"
            disabled={paginaActual <= 1}
            onClick={() => setPaginaActual((prev) => Math.max(1, prev - 1))}
            className="rounded border border-slate-400 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none"
          >
            &lt; Previous
          </button>

          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setPaginaActual(num)}
              className={`rounded border px-3 py-1 text-xs font-semibold transition-colors ${
                paginaActual === num
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-400 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              {num}
            </button>
          ))}

          <button
            type="button"
            disabled={paginaActual >= totalPaginas}
            onClick={() => setPaginaActual((prev) => Math.min(totalPaginas, prev + 1))}
            className="rounded border border-slate-400 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none"
          >
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
