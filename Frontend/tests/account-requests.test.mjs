import test from "node:test";
import assert from "node:assert/strict";

function filterAccountRequests(solicitudes, filtroEstado, busqueda) {
  return solicitudes.filter((item) => {
    if (filtroEstado !== "TODOS" && item.estado !== filtroEstado) {
      return false;
    }
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

function paginateRequests(items, pagina, porPagina) {
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

const mockSolicitudes = [
  {
    idSolicitud: "sol-1",
    rutEmpresa: "76.123.456-7",
    razonSocial: "Panadería Los Robles",
    rutUsuario: "12.345.678-9",
    nombre: "Carlos",
    apellido: "Soto Mora",
    correo: "carlos.soto@panaderia.cl",
    estado: "PENDIENTE",
    createdAt: "2026-09-03T10:14:00Z",
  },
  {
    idSolicitud: "sol-2",
    rutEmpresa: "77.987.654-3",
    razonSocial: "Minimarket El Paso SpA",
    rutUsuario: "15.432.109-8",
    nombre: "Andrea",
    apellido: "Morales V.",
    correo: "contacto@minimarket.cl",
    estado: "PENDIENTE",
    createdAt: "2026-09-03T09:30:00Z",
  },
  {
    idSolicitud: "sol-3",
    rutEmpresa: "78.111.222-3",
    razonSocial: "Boutique Bella",
    rutUsuario: "14.222.333-4",
    nombre: "Marcela",
    apellido: "Henríquez",
    correo: "marcela@boutique.cl",
    estado: "APROBADA",
    createdAt: "2026-09-01T15:20:00Z",
  },
  {
    idSolicitud: "sol-4",
    rutEmpresa: "79.333.444-5",
    razonSocial: "Constructora Sur",
    rutUsuario: "16.555.666-7",
    nombre: "Esteban",
    apellido: "Valdés",
    correo: "evaldes@construcciones.cl",
    estado: "RECHAZADA",
    createdAt: "2026-09-01T11:10:00Z",
  },
];

test("filterAccountRequests: con filtro 'TODOS' devuelve todas las solicitudes", () => {
  const result = filterAccountRequests(mockSolicitudes, "TODOS", "");
  assert.equal(result.length, 4);
});

test("filterAccountRequests: filtra correctamente por APROBADA y RECHAZADA", () => {
  const aprobadas = filterAccountRequests(mockSolicitudes, "APROBADA", "");
  assert.equal(aprobadas.length, 1);
  assert.equal(aprobadas[0].razonSocial, "Boutique Bella");

  const rechazadas = filterAccountRequests(mockSolicitudes, "RECHAZADA", "");
  assert.equal(rechazadas.length, 1);
  assert.equal(rechazadas[0].razonSocial, "Constructora Sur");
});

test("filterAccountRequests: busca por texto en RUT, nombre o razón social", () => {
  const porRut = filterAccountRequests(mockSolicitudes, "TODOS", "76.123");
  assert.equal(porRut.length, 1);
  assert.equal(porRut[0].nombre, "Carlos");

  const porNombre = filterAccountRequests(mockSolicitudes, "TODOS", "Andrea");
  assert.equal(porNombre.length, 1);

  const porRazonSocial = filterAccountRequests(mockSolicitudes, "TODOS", "Constructora");
  assert.equal(porRazonSocial.length, 1);
});

test("paginateRequests: calcula correctamente páginas y partición", () => {
  const pag1 = paginateRequests(mockSolicitudes, 1, 2);
  assert.equal(pag1.totalPaginas, 2);
  assert.equal(pag1.items.length, 2);
  assert.equal(pag1.items[0].idSolicitud, "sol-1");

  const pag2 = paginateRequests(mockSolicitudes, 2, 2);
  assert.equal(pag2.items.length, 2);
  assert.equal(pag2.items[0].idSolicitud, "sol-3");
});
