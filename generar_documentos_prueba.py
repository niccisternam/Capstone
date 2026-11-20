#!/usr/bin/env python3
"""Genera PDFs ficticios para probar la carga y extracción del Módulo 1.

Solo usa la biblioteca estándar (no requiere reportlab, fpdf ni Pillow).

Escenarios generados (cada uno con su resultado esperado en manifiesto.json):

  factura_afecta          Factura afecta completa y coherente.
  factura_exenta          Factura exenta: solo monto exento, sin IVA.
  boleta                  Boleta con IVA incluido y sin receptor identificado.
  descuentos_recargos     Descuentos y recargos por línea y globales.
  campos_ausentes         Factura sin receptor, condición, IVA ni medio de pago.
  totales_inconsistentes  El neto impreso no coincide con la suma de las líneas.
  rut_dv_invalido         RUT del emisor con dígito verificador incorrecto.
  multipagina             Factura con muchas líneas repartidas en varias páginas.
  venta                   Emisor = RUT de la empresa (solo con --rut-empresa).
  pdf_sin_texto           PDF válido compuesto solo por una imagen (sin capa de texto).

Archivos que el sistema debe rechazar al cargar (van a carga_rechazada/):

  archivo_no_pdf          Texto plano con extensión .pdf (sin firma %PDF).
  pdf_grande              PDF válido de más de 15 MB (solo con --incluir-grande).

Todos los datos son ficticios y cada página indica que el documento no tiene
validez tributaria.

Uso:
  python3 generar_documentos_prueba.py
  python3 generar_documentos_prueba.py --cantidad 3 --semilla 7 --rut-empresa 76.123.456-0
  python3 generar_documentos_prueba.py --escenarios factura_afecta boleta --salida /tmp/pdfs
"""

from __future__ import annotations

import argparse
import json
import os
import random
import shutil
import zlib
from dataclasses import dataclass, field
from datetime import date, timedelta
from decimal import ROUND_HALF_UP, Decimal
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SALIDA_POR_DEFECTO = ROOT / "documentos_prueba"
MAX_POR_LOTE = 10  # Límite de documentos por lote del sistema.
LIMITE_CARGA_BYTES = 15 * 1024 * 1024
IVA = Decimal("0.19")

ESCENARIOS_PDF = [
    "factura_afecta",
    "factura_exenta",
    "boleta",
    "descuentos_recargos",
    "campos_ausentes",
    "totales_inconsistentes",
    "rut_dv_invalido",
    "multipagina",
    "venta",
    "pdf_sin_texto",
]
ESCENARIOS_RECHAZO = ["archivo_no_pdf", "pdf_grande"]

# --------------------------------------------------------------------------------------
# Datos ficticios
# --------------------------------------------------------------------------------------

EMPRESAS = [
    ("Comercial Los Aromos SpA", "Av. Ficticia 1234, Santiago"),
    ("Distribuidora Cordillera Ltda.", "Calle Imaginaria 55, Rancagua"),
    ("Servicios Integrales Pehuén SpA", "Pasaje Inventado 900, Temuco"),
    ("Ferretería El Roble Ltda.", "Camino Ficticio 77, Talca"),
    ("Insumos Agrícolas Valle Verde SpA", "Ruta Imaginaria 21, La Serena"),
    ("Transportes Austral Sur SpA", "Av. del Puerto Ficticio 500, Puerto Montt"),
    ("Tecnología Andina Ltda.", "Calle de Prueba 1200, Concepción"),
    ("Librería y Papelería Faro SpA", "Av. de los Libros 310, Chillán"),
    ("Constructora Altos del Maule SpA", "Pasaje Ensayo 88, Curicó"),
    ("Alimentos Don Ernesto Ltda.", "Calle Muestra 45, Valparaíso"),
]

PRODUCTOS = [
    ("Cemento Portland saco 25 kg", "UND", 4_900),
    ("Arriendo de andamio certificado", "MES", 180_000),
    ("Servicio de mantención mensual", "MES", 350_000),
    ("Fertilizante NPK bolsa 25 kg", "SAC", 22_000),
    ("Manguera de riego rollo 50 m", "ROL", 38_000),
    ("Licencia software contable", "MES", 99_000),
    ("Soporte técnico remoto", "HORA", 18_000),
    ("Flete Santiago - Valdivia", "VIAJE", 180_000),
    ("Papel fotocopia resma carta", "UND", 4_500),
    ("Cuaderno universitario 100 hojas", "UND", 1_200),
    ("Tóner impresora láser", "UND", 45_000),
    ("Guantes de seguridad par", "PAR", 3_200),
    ("Pintura látex galón", "GL", 14_900),
    ("Instalación y configuración", "SERV", 150_000),
    ("Café en grano 1 kg", "KG", 12_500),
]

PRODUCTOS_EXENTOS = [
    ("Curso de capacitación en contabilidad", "SERV", 250_000),
    ("Asesoría educacional", "HORA", 35_000),
    ("Arriendo de inmueble sin amoblar", "MES", 450_000),
    ("Libro técnico de normativa", "UND", 28_000),
]

PRODUCTOS_BOLETA = [
    ("Paracetamol 500 mg x 16 comprimidos", "UND", 1_990),
    ("Bebida 1,5 L", "UND", 1_690),
    ("Pan amasado bolsa 1 kg", "KG", 2_490),
    ("Detergente líquido 3 L", "UND", 6_990),
    ("Alcohol gel 500 ml", "UND", 3_490),
    ("Pilas AA pack 4", "UND", 4_590),
    ("Cuaderno college 100 hojas", "UND", 1_290),
    ("Café instantáneo 170 g", "UND", 5_990),
    ("Ampolleta LED 9 W", "UND", 2_190),
]

MEDIOS_PAGO = ["Transferencia electrónica", "Efectivo", "Cheque", "Tarjeta de crédito", "Crédito 30 días"]


def dv_rut(numero: int) -> str:
    suma, factor = 0, 2
    for digito in reversed(str(numero)):
        suma += int(digito) * factor
        factor = 2 if factor == 7 else factor + 1
    resto = 11 - suma % 11
    return "0" if resto == 11 else "K" if resto == 10 else str(resto)


def formatear_rut(numero: int, dv: str) -> str:
    return f"{numero:,}".replace(",", ".") + f"-{dv}"


def rut_valido(rng: random.Random) -> str:
    numero = rng.randint(60_000_000, 79_999_999)
    return formatear_rut(numero, dv_rut(numero))


def rut_invalido(rng: random.Random) -> str:
    numero = rng.randint(60_000_000, 79_999_999)
    correcto = dv_rut(numero)
    incorrecto = rng.choice([d for d in "0123456789K" if d != correcto])
    return formatear_rut(numero, incorrecto)


def normalizar_rut(rut: str) -> str:
    limpio = rut.replace(".", "").replace(" ", "").upper()
    if "-" not in limpio:
        limpio = f"{limpio[:-1]}-{limpio[-1]}"
    numero, dv = limpio.split("-")
    if not numero.isdigit() or dv != dv_rut(int(numero)):
        raise argparse.ArgumentTypeError(f"RUT inválido: {rut}")
    return formatear_rut(int(numero), dv)


def clp(valor: int | Decimal) -> str:
    return f"{int(valor):,}".replace(",", ".")


def redondear(valor: Decimal) -> int:
    return int(valor.quantize(Decimal("1"), rounding=ROUND_HALF_UP))


# --------------------------------------------------------------------------------------
# Modelo del documento
# --------------------------------------------------------------------------------------


@dataclass
class Linea:
    descripcion: str
    unidad: str
    cantidad: int
    precio: int
    descuento_pct: int | None = None
    descuento_monto: int | None = None
    recargo_pct: int | None = None
    recargo_monto: int | None = None

    @property
    def total(self) -> int:
        bruto = Decimal(self.cantidad * self.precio)
        if self.descuento_pct:
            bruto -= bruto * Decimal(self.descuento_pct) / 100
        if self.descuento_monto:
            bruto -= self.descuento_monto
        if self.recargo_pct:
            bruto += Decimal(self.cantidad * self.precio) * Decimal(self.recargo_pct) / 100
        if self.recargo_monto:
            bruto += self.recargo_monto
        return redondear(bruto)

    def ajuste_texto(self) -> str:
        partes = []
        if self.descuento_pct:
            partes.append(f"-{self.descuento_pct}%")
        if self.descuento_monto:
            partes.append(f"-{clp(self.descuento_monto)}")
        if self.recargo_pct:
            partes.append(f"+{self.recargo_pct}%")
        if self.recargo_monto:
            partes.append(f"+{clp(self.recargo_monto)}")
        return " ".join(partes)


@dataclass
class AjusteGlobal:
    tipo: str  # DESCUENTO | RECARGO
    modalidad: str  # PORCENTAJE | MONTO
    valor: int
    descripcion: str

    def monto(self, base: int) -> int:
        importe = Decimal(base) * Decimal(self.valor) / 100 if self.modalidad == "PORCENTAJE" else Decimal(self.valor)
        return redondear(importe) * (-1 if self.tipo == "DESCUENTO" else 1)


@dataclass
class Documento:
    escenario: str
    tipo: str  # FACTURA | FACTURA_EXENTA | BOLETA
    folio: int
    fecha: date
    emisor: tuple[str, str, str]  # razón social, RUT, dirección
    receptor: tuple[str, str] | None  # nombre, RUT
    condicion: str | None
    medio_pago: str | None
    lineas: list[Linea]
    ajustes: list[AjusteGlobal] = field(default_factory=list)
    imprimir_iva: bool = True
    diferencia_neto: int = 0  # Se suma al neto impreso para provocar inconsistencias.
    notas: list[str] = field(default_factory=list)
    esperado_procesamiento: str = "PENDIENTE_REVISION"
    observaciones_prueba: list[str] = field(default_factory=list)

    # Totales -----------------------------------------------------------------------

    @property
    def suma_lineas(self) -> int:
        return sum(linea.total for linea in self.lineas)

    def totales(self) -> dict[str, int | None]:
        base = self.suma_lineas + sum(ajuste.monto(self.suma_lineas) for ajuste in self.ajustes)
        if self.tipo == "FACTURA_EXENTA":
            return {"neto": None, "iva": None, "exento": base, "total": base}
        if self.tipo == "BOLETA":
            # En la boleta los precios incluyen IVA; el neto no se imprime.
            iva = redondear(Decimal(base) - Decimal(base) / (1 + IVA))
            return {"neto": None, "iva": iva, "exento": None, "total": base}
        neto = base + self.diferencia_neto
        iva = redondear(Decimal(neto) * IVA) if self.imprimir_iva else None
        return {"neto": neto, "iva": iva, "exento": None, "total": neto + (iva or 0)}

    # Manifiesto --------------------------------------------------------------------

    def esperado(self) -> dict:
        totales = self.totales()
        return {
            "tipoDocumento": {"FACTURA": "FACTURA", "FACTURA_EXENTA": "FACTURA EXENTA", "BOLETA": "BOLETA"}[self.tipo],
            "folio": str(self.folio),
            "fechaEmision": self.fecha.isoformat(),
            "emisor": {"razonSocial": self.emisor[0], "rut": self.emisor[1]},
            "receptor": {"nombre": self.receptor[0], "rut": self.receptor[1]} if self.receptor else None,
            "condicionTributaria": self.condicion,
            "medioPago": self.medio_pago,
            "detalles": [
                {
                    "descripcion": linea.descripcion,
                    "cantidad": str(linea.cantidad),
                    "unidad": linea.unidad,
                    "precioUnitario": str(linea.precio),
                    "descuentoPorcentaje": str(linea.descuento_pct) if linea.descuento_pct else None,
                    "descuentoMonto": str(linea.descuento_monto) if linea.descuento_monto else None,
                    "recargoPorcentaje": str(linea.recargo_pct) if linea.recargo_pct else None,
                    "recargoMonto": str(linea.recargo_monto) if linea.recargo_monto else None,
                    "totalLinea": str(linea.total),
                }
                for linea in self.lineas
            ],
            "ajustesGlobales": [
                {"tipo": a.tipo, "modalidad": a.modalidad, "valor": str(a.valor), "descripcion": a.descripcion}
                for a in self.ajustes
            ],
            "totales": {clave: (str(valor) if valor is not None else None) for clave, valor in totales.items()},
            "sumaLineas": str(self.suma_lineas),
        }


# --------------------------------------------------------------------------------------
# Escritor PDF mínimo (Helvetica, WinAnsiEncoding, contenido comprimido)
# --------------------------------------------------------------------------------------

ANCHO_PAGINA, ALTO_PAGINA = 595, 842  # A4 en puntos
MARGEN = 40

# Anchos aproximados de Helvetica (unidades /1000) para alinear números a la derecha.
_ANCHOS = {**{c: 556 for c in "0123456789$"}, ".": 278, ",": 278, " ": 278, "-": 333, "+": 584, "%": 889}


def ancho_texto(texto: str, tamano: float) -> float:
    return sum(_ANCHOS.get(c, 556) for c in texto) * tamano / 1000


def _escapar(texto: str) -> str:
    codificado = texto.encode("cp1252", errors="replace").decode("latin-1")
    return codificado.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


class Pagina:
    def __init__(self) -> None:
        self.ops: list[str] = []

    def texto(self, x: float, y: float, contenido: str, tamano: float = 9, negrita: bool = False) -> None:
        fuente = "F2" if negrita else "F1"
        self.ops.append(f"BT /{fuente} {tamano} Tf {x:.2f} {y:.2f} Td ({_escapar(contenido)}) Tj ET")

    def texto_derecha(self, x_derecha: float, y: float, contenido: str, tamano: float = 9, negrita: bool = False) -> None:
        self.texto(x_derecha - ancho_texto(contenido, tamano), y, contenido, tamano, negrita)

    def linea(self, x1: float, y1: float, x2: float, y2: float, grosor: float = 0.6) -> None:
        self.ops.append(f"{grosor} w {x1:.2f} {y1:.2f} m {x2:.2f} {y2:.2f} l S")

    def rectangulo(self, x: float, y: float, ancho: float, alto: float, grosor: float = 1.0) -> None:
        self.ops.append(f"{grosor} w {x:.2f} {y:.2f} {ancho:.2f} {alto:.2f} re S")

    def imagen(self, nombre: str, x: float, y: float, ancho: float, alto: float) -> None:
        self.ops.append(f"q {ancho:.2f} 0 0 {alto:.2f} {x:.2f} {y:.2f} cm /{nombre} Do Q")

    def contenido(self) -> bytes:
        return "\n".join(self.ops).encode("latin-1")


def escribir_pdf(ruta: Path, paginas: list[Pagina], titulo: str, imagenes: dict[str, tuple[int, int, bytes, bool]] | None = None) -> None:
    """Escribe un PDF. `imagenes` mapea nombre -> (ancho, alto, datos RGB, comprimir)."""
    objetos: list[bytes] = []

    def agregar(cuerpo: bytes) -> int:
        objetos.append(cuerpo)
        return len(objetos)

    def stream(diccionario: str, datos: bytes, comprimir: bool = True) -> bytes:
        if comprimir:
            datos = zlib.compress(datos, 9)
            diccionario += " /Filter /FlateDecode"
        return f"<< {diccionario} /Length {len(datos)} >>\nstream\n".encode() + datos + b"\nendstream"

    catalogo = agregar(b"")  # se completa al final
    raiz_paginas = agregar(b"")
    fuente_normal = agregar(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>")
    fuente_negrita = agregar(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>")

    xobjects = []
    for nombre, (ancho, alto, datos, comprimir) in (imagenes or {}).items():
        numero = agregar(stream(
            f"/Type /XObject /Subtype /Image /Width {ancho} /Height {alto} /ColorSpace /DeviceRGB /BitsPerComponent 8",
            datos,
            comprimir,
        ))
        xobjects.append(f"/{nombre} {numero} 0 R")

    recursos = f"<< /Font << /F1 {fuente_normal} 0 R /F2 {fuente_negrita} 0 R >>"
    if xobjects:
        recursos += f" /XObject << {' '.join(xobjects)} >>"
    recursos += " >>"

    hijos = []
    for pagina in paginas:
        contenido = agregar(stream("", pagina.contenido()))
        hijos.append(agregar(
            f"<< /Type /Page /Parent {raiz_paginas} 0 R /MediaBox [0 0 {ANCHO_PAGINA} {ALTO_PAGINA}] "
            f"/Resources {recursos} /Contents {contenido} 0 R >>".encode()
        ))

    objetos[raiz_paginas - 1] = f"<< /Type /Pages /Kids [{' '.join(f'{h} 0 R' for h in hijos)}] /Count {len(hijos)} >>".encode()
    objetos[catalogo - 1] = f"<< /Type /Catalog /Pages {raiz_paginas} 0 R >>".encode()
    info = agregar(f"<< /Title ({_escapar(titulo)}) /Producer (generar_documentos_prueba.py) >>".encode())

    salida = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    offsets = []
    for numero, cuerpo in enumerate(objetos, start=1):
        offsets.append(len(salida))
        salida += f"{numero} 0 obj\n".encode() + cuerpo + b"\nendobj\n"
    inicio_xref = len(salida)
    salida += f"xref\n0 {len(objetos) + 1}\n0000000000 65535 f \n".encode()
    for offset in offsets:
        salida += f"{offset:010d} 00000 n \n".encode()
    salida += f"trailer\n<< /Size {len(objetos) + 1} /Root {catalogo} 0 R /Info {info} 0 R >>\nstartxref\n{inicio_xref}\n%%EOF\n".encode()
    ruta.write_bytes(bytes(salida))


# --------------------------------------------------------------------------------------
# Maquetación de los documentos
# --------------------------------------------------------------------------------------

AVISO = "DOCUMENTO DE PRUEBA - DATOS FICTICIOS - SIN VALIDEZ TRIBUTARIA"
TITULOS = {"FACTURA": "FACTURA ELECTRONICA", "FACTURA_EXENTA": "FACTURA NO AFECTA O EXENTA ELECTRONICA", "BOLETA": "BOLETA ELECTRONICA"}

# Columnas de la tabla de detalle (x de inicio; los montos se alinean a la derecha).
COL_CANT, COL_UNID, COL_DESC = MARGEN, MARGEN + 38, MARGEN + 80
COL_PRECIO, COL_AJUSTE, COL_TOTAL = 400, 470, ANCHO_PAGINA - MARGEN
LINEAS_POR_PAGINA = 28


def encabezado(pagina: Pagina, doc: Documento) -> float:
    razon, rut, direccion = doc.emisor
    pagina.texto(MARGEN, 790, razon.upper(), 13, negrita=True)
    pagina.texto(MARGEN, 774, direccion, 9)
    pagina.texto(MARGEN, 761, f"RUT: {rut}", 9)

    # Recuadro con tipo de documento y folio, como en los documentos electrónicos chilenos.
    x, ancho = 360, ANCHO_PAGINA - MARGEN - 360
    pagina.rectangulo(x, 735, ancho, 70, 1.5)
    pagina.texto_derecha(x + ancho - 10, 787, f"R.U.T.: {rut}", 10, negrita=True)
    titulo = TITULOS[doc.tipo]
    tamano = 9 if len(titulo) > 25 else 11
    pagina.texto(x + (ancho - ancho_texto(titulo, tamano) * 1.08) / 2, 768, titulo, tamano, negrita=True)
    pagina.texto(x + 60, 748, f"N° {doc.folio}", 11, negrita=True)

    y = 712
    pagina.texto(MARGEN, y, f"Fecha de emision: {doc.fecha:%d-%m-%Y}", 9)
    y -= 14
    if doc.receptor:
        pagina.texto(MARGEN, y, f"Señor(es): {doc.receptor[0]}", 9)
        pagina.texto(330, y, f"RUT: {doc.receptor[1]}", 9)
    elif doc.tipo == "BOLETA":
        pagina.texto(MARGEN, y, "Cliente: no identificado", 9)
    else:
        pagina.texto(MARGEN, y, "Señor(es): ______________________________", 9)
        pagina.texto(330, y, "RUT: ________________", 9)
    y -= 14
    if doc.condicion:
        pagina.texto(MARGEN, y, f"Condicion tributaria: {doc.condicion}", 9)
    if doc.medio_pago:
        pagina.texto(330, y, f"Forma de pago: {doc.medio_pago}", 9)
    return y - 24


def cabecera_tabla(pagina: Pagina, y: float) -> float:
    pagina.linea(MARGEN, y + 12, ANCHO_PAGINA - MARGEN, y + 12)
    for x, rotulo in [(COL_CANT, "Cant."), (COL_UNID, "Unid."), (COL_DESC, "Descripcion")]:
        pagina.texto(x, y, rotulo, 8, negrita=True)
    pagina.texto_derecha(COL_PRECIO, y, "P. Unitario", 8, negrita=True)
    pagina.texto_derecha(COL_AJUSTE + 20, y, "Desc./Rec.", 8, negrita=True)
    pagina.texto_derecha(COL_TOTAL, y, "Total linea", 8, negrita=True)
    pagina.linea(MARGEN, y - 5, ANCHO_PAGINA - MARGEN, y - 5)
    return y - 18


def fila(pagina: Pagina, y: float, linea: Linea) -> None:
    pagina.texto_derecha(COL_CANT + 25, y, str(linea.cantidad), 8.5)
    pagina.texto(COL_UNID, y, linea.unidad, 8.5)
    pagina.texto(COL_DESC, y, linea.descripcion[:52], 8.5)
    pagina.texto_derecha(COL_PRECIO, y, clp(linea.precio), 8.5)
    if linea.ajuste_texto():
        pagina.texto_derecha(COL_AJUSTE + 20, y, linea.ajuste_texto(), 8.5)
    pagina.texto_derecha(COL_TOTAL, y, clp(linea.total), 8.5)


def bloque_totales(pagina: Pagina, y: float, doc: Documento) -> float:
    totales = doc.totales()
    x_rotulo, x_valor = 380, COL_TOTAL
    pagina.linea(MARGEN, y + 10, ANCHO_PAGINA - MARGEN, y + 10)

    if doc.ajustes or doc.diferencia_neto:
        pagina.texto(x_rotulo - 120, y, f"Suma de lineas ({len(doc.lineas)} items):", 9)
        pagina.texto_derecha(x_valor, y, clp(doc.suma_lineas), 9)
        y -= 14
    for ajuste in doc.ajustes:
        monto = ajuste.monto(doc.suma_lineas)
        etiqueta = f"{ajuste.descripcion}{f' {ajuste.valor}%' if ajuste.modalidad == 'PORCENTAJE' else ''}:"
        pagina.texto(x_rotulo - 120, y, etiqueta, 9)
        pagina.texto_derecha(x_valor, y, ("- " if monto < 0 else "+ ") + clp(abs(monto)), 9)
        y -= 14

    filas = []
    if doc.tipo == "FACTURA_EXENTA":
        filas.append(("MONTO EXENTO $", totales["exento"]))
    elif doc.tipo == "FACTURA":
        filas.append(("MONTO NETO $", totales["neto"]))
        if totales["iva"] is not None:
            filas.append(("I.V.A. 19% $", totales["iva"]))
    filas.append(("TOTAL $", totales["total"]))
    for rotulo, valor in filas:
        pagina.texto(x_rotulo, y, rotulo, 10, negrita=True)
        pagina.texto_derecha(x_valor, y, clp(valor), 10, negrita=True)
        y -= 16
    if doc.tipo == "BOLETA":
        pagina.texto(x_rotulo - 120, y, f"El IVA incluido en esta boleta es de $ {clp(totales['iva'])}", 8.5)
        y -= 14
    return y


def pie(pagina: Pagina, numero: int, total: int) -> None:
    pagina.linea(MARGEN, 60, ANCHO_PAGINA - MARGEN, 60, 0.4)
    pagina.texto(MARGEN, 46, AVISO, 7.5, negrita=True)
    pagina.texto_derecha(ANCHO_PAGINA - MARGEN, 46, f"Pagina {numero} de {total}", 7.5)


def maquetar(doc: Documento) -> list[Pagina]:
    grupos = [doc.lineas[i:i + LINEAS_POR_PAGINA] for i in range(0, len(doc.lineas), LINEAS_POR_PAGINA)] or [[]]
    paginas = []
    for indice, grupo in enumerate(grupos):
        pagina = Pagina()
        y = encabezado(pagina, doc) if indice == 0 else 790
        if indice > 0:
            pagina.texto(MARGEN, 805, f"{doc.emisor[0]} - {TITULOS[doc.tipo]} N° {doc.folio} (continuacion)", 9, negrita=True)
        y = cabecera_tabla(pagina, y)
        for linea in grupo:
            fila(pagina, y, linea)
            y -= 14
        if indice == len(grupos) - 1:
            y = bloque_totales(pagina, y - 6, doc)
            for nota in doc.notas:
                y -= 6
                pagina.texto(MARGEN, y, nota, 8)
                y -= 8
        paginas.append(pagina)
    for numero, pagina in enumerate(paginas, start=1):
        pie(pagina, numero, len(paginas))
    return paginas


# --------------------------------------------------------------------------------------
# Escenarios
# --------------------------------------------------------------------------------------


class Generador:
    def __init__(self, rng: random.Random, rut_empresa: str | None) -> None:
        self.rng = rng
        self.rut_empresa = rut_empresa
        self.folio = rng.randint(1_000, 9_000)

    def _folio(self) -> int:
        self.folio += self.rng.randint(1, 37)
        return self.folio

    def _fecha(self) -> date:
        # Dentro de los últimos 12 meses, para probar los filtros temporales del dashboard.
        return date.today() - timedelta(days=self.rng.randint(1, 365))

    def _empresa(self, rut: str | None = None) -> tuple[str, str, str]:
        razon, direccion = self.rng.choice(EMPRESAS)
        return razon, rut or rut_valido(self.rng), direccion

    def _receptor(self) -> tuple[str, str]:
        return self.rng.choice(EMPRESAS)[0], rut_valido(self.rng)

    def _lineas(self, cantidad: int, catalogo=PRODUCTOS) -> list[Linea]:
        elegidos = self.rng.sample(catalogo, k=min(cantidad, len(catalogo)))
        while len(elegidos) < cantidad:
            elegidos.append(self.rng.choice(catalogo))
        return [Linea(desc, unidad, self._cantidad(precio), precio) for desc, unidad, precio in elegidos]

    def _cantidad(self, precio: int) -> int:
        # Cantidades plausibles según el precio: pocos servicios caros, más insumos baratos.
        if precio >= 100_000:
            return self.rng.randint(1, 3)
        if precio >= 20_000:
            return self.rng.randint(1, 10)
        return self.rng.randint(1, 40)

    def _factura(self, escenario: str, lineas: int | None = None, **extra) -> Documento:
        return Documento(
            escenario=escenario,
            tipo="FACTURA",
            folio=self._folio(),
            fecha=self._fecha(),
            emisor=self._empresa(),
            receptor=self._receptor(),
            condicion="AFECTA",
            medio_pago=self.rng.choice(MEDIOS_PAGO),
            lineas=self._lineas(lineas or self.rng.randint(2, 6)),
            **extra,
        )

    def crear(self, escenario: str) -> Documento:
        metodo = getattr(self, f"_esc_{escenario}")
        return metodo()

    def _esc_factura_afecta(self) -> Documento:
        return self._factura("factura_afecta", observaciones_prueba=["Flujo feliz: todos los campos presentes y los totales cuadran."])

    def _esc_factura_exenta(self) -> Documento:
        doc = self._factura("factura_exenta")
        doc.tipo, doc.condicion = "FACTURA_EXENTA", "EXENTA"
        doc.lineas = self._lineas(self.rng.randint(1, 3), PRODUCTOS_EXENTOS)
        doc.observaciones_prueba = ["Solo monto exento: neto e IVA deben quedar AUSENTE/NO_APLICA."]
        return doc

    def _esc_boleta(self) -> Documento:
        doc = self._factura("boleta")
        doc.tipo, doc.receptor, doc.medio_pago = "BOLETA", None, "Efectivo"
        doc.lineas = [
            Linea(desc, unidad, self.rng.randint(1, 4), precio)
            for desc, unidad, precio in self.rng.sample(PRODUCTOS_BOLETA, k=self.rng.randint(2, 5))
        ]
        doc.observaciones_prueba = [
            "Precios con IVA incluido; el neto no viene impreso.",
            "El receptor no está identificado: debe quedar AUSENTE/NO_APLICA, sin inventar un cliente.",
        ]
        return doc

    def _esc_descuentos_recargos(self) -> Documento:
        doc = self._factura("descuentos_recargos", lineas=5)
        doc.lineas[0].descuento_pct = 10
        doc.lineas[1].descuento_monto = redondear(Decimal(doc.lineas[1].cantidad * doc.lineas[1].precio) * Decimal("0.05"))
        doc.lineas[2].recargo_pct = 8
        doc.lineas[3].recargo_monto = 5_000
        doc.ajustes = [
            AjusteGlobal("DESCUENTO", "MONTO", 15_000, "Descuento global por volumen"),
            AjusteGlobal("RECARGO", "PORCENTAJE", 3, "Recargo global por despacho"),
        ]
        doc.observaciones_prueba = ["Descuentos y recargos por línea (% y monto) separados de los ajustes globales."]
        return doc

    def _esc_campos_ausentes(self) -> Documento:
        doc = self._factura("campos_ausentes")
        doc.receptor, doc.condicion, doc.medio_pago, doc.imprimir_iva = None, None, None, False
        doc.observaciones_prueba = [
            "Receptor, condición tributaria, IVA y medio de pago no impresos: deben quedar AUSENTE, no inventados.",
            "Ante el SII una factura afecta sin receptor ni IVA no sería válida; el sistema igual debe enviarla a revisión.",
        ]
        return doc

    def _esc_totales_inconsistentes(self) -> Documento:
        doc = self._factura("totales_inconsistentes", lineas=3)
        doc.diferencia_neto = self.rng.choice([5_000, 10_000, 12_500])
        doc.notas = [f"* Incluye cargos operativos no detallados en las lineas ({clp(doc.diferencia_neto)})."]
        doc.observaciones_prueba = [
            f"El neto impreso supera la suma de las líneas en {clp(doc.diferencia_neto)}.",
            "Los datos deben extraerse tal como están impresos; el sistema no debe corregirlos.",
        ]
        return doc

    def _esc_rut_dv_invalido(self) -> Documento:
        doc = self._factura("rut_dv_invalido")
        doc.emisor = (doc.emisor[0], rut_invalido(self.rng), doc.emisor[2])
        doc.observaciones_prueba = ["El RUT del emisor tiene dígito verificador incorrecto; hoy el sistema no lo valida."]
        return doc

    def _esc_multipagina(self) -> Documento:
        doc = self._factura("multipagina", lineas=self.rng.randint(35, 60))
        doc.observaciones_prueba = ["Detalle en varias páginas: deben extraerse todas las líneas y los totales de la última página."]
        return doc

    def _esc_venta(self) -> Documento:
        doc = self._factura("venta")
        doc.emisor = self._empresa(self.rut_empresa)
        doc.observaciones_prueba = ["El emisor es la empresa del usuario: al confirmar debe clasificarse como VENTA (R.147)."]
        return doc

    def _esc_pdf_sin_texto(self) -> Documento:
        doc = self._factura("pdf_sin_texto")
        doc.esperado_procesamiento = "ERROR"
        doc.observaciones_prueba = ["Solo contiene una imagen: debe quedar en ERROR (PDF_WITHOUT_TEXT) sin intentar OCR."]
        return doc


# --------------------------------------------------------------------------------------
# Imágenes (PDF sin texto y PDF grande)
# --------------------------------------------------------------------------------------


def imagen_documento(ancho: int, alto: int, rng: random.Random) -> bytes:
    """Raster RGB que imita la forma de una factura (bloques y filas) sin ningún texto."""
    fondo, tinta, gris = b"\xff\xff\xff", b"\x22\x22\x22", b"\xc8\xc8\xc8"
    filas = []
    bloques = [rng.randint(80, 300) for _ in range(12)]
    for y in range(alto):
        fila_px = bytearray(fondo * ancho)

        def pintar(x1: int, x2: int, color: bytes) -> None:
            fila_px[x1 * 3:x2 * 3] = color * (x2 - x1)

        if 40 <= y < 70:
            pintar(40, 420, tinta)  # "razón social"
        if 30 <= y < 130 and (y in (30, 31, 128, 129)):
            pintar(ancho - 360, ancho - 40, tinta)  # recuadro del folio
        if 30 <= y < 130:
            pintar(ancho - 360, ancho - 358, tinta)
            pintar(ancho - 42, ancho - 40, tinta)
        if 180 <= y < 200 or 220 <= y < 236:
            pintar(40, 600, gris)
        for i, largo in enumerate(bloques):
            base = 300 + i * 40
            if base <= y < base + 14:
                pintar(40, 40 + largo * 2, gris)
                pintar(ancho - 200, ancho - 40, gris)
        if alto - 240 <= y < alto - 220:
            pintar(ancho - 380, ancho - 40, tinta)  # "total"
        filas.append(bytes(fila_px))
    return b"".join(filas)


def escribir_pdf_sin_texto(ruta: Path, doc: Documento, rng: random.Random) -> None:
    ancho, alto = 1240, 1754
    pagina = Pagina()
    pagina.imagen("Im1", 0, 0, ANCHO_PAGINA, ALTO_PAGINA)
    escribir_pdf(ruta, [pagina], f"Documento escaneado {doc.folio}", {"Im1": (ancho, alto, imagen_documento(ancho, alto, rng), True)})


def escribir_pdf_grande(ruta: Path) -> None:
    # Ruido sin comprimir: ~16 MB, por encima del límite de 15 MB por archivo.
    lado = 2_340
    datos = os.urandom(lado * lado * 3)
    pagina = Pagina()
    pagina.imagen("Im1", 0, 0, ANCHO_PAGINA, ALTO_PAGINA)
    pagina.texto(MARGEN, 30, AVISO, 8, negrita=True)
    escribir_pdf(ruta, [pagina], "PDF de prueba sobre el limite de tamano", {"Im1": (lado, lado, datos, False)})


# --------------------------------------------------------------------------------------
# Programa principal
# --------------------------------------------------------------------------------------


def argumentos() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Genera PDFs ficticios para probar el Módulo 1.")
    parser.add_argument("--salida", type=Path, default=SALIDA_POR_DEFECTO, help="Carpeta de salida (se reemplaza su contenido).")
    parser.add_argument("--cantidad", type=int, default=1, help="Documentos por escenario (por defecto 1).")
    parser.add_argument("--semilla", type=int, default=None, help="Semilla para obtener siempre los mismos documentos.")
    parser.add_argument("--escenarios", nargs="+", choices=ESCENARIOS_PDF + ESCENARIOS_RECHAZO, help="Escenarios a generar (por defecto todos).")
    parser.add_argument("--rut-empresa", type=normalizar_rut, help="RUT de la empresa del usuario de prueba; habilita el escenario 'venta'.")
    parser.add_argument("--incluir-grande", action="store_true", help="Genera también un PDF de más de 15 MB.")
    args = parser.parse_args()
    if args.cantidad < 1:
        parser.error("--cantidad debe ser al menos 1")
    return args


def main() -> None:
    args = argumentos()
    semilla = args.semilla if args.semilla is not None else random.randrange(1_000_000)
    rng = random.Random(semilla)
    generador = Generador(rng, args.rut_empresa)

    escenarios = args.escenarios or ESCENARIOS_PDF + ESCENARIOS_RECHAZO
    omitidos = []
    if "venta" in escenarios and not args.rut_empresa:
        omitidos.append("venta (requiere --rut-empresa)")
        escenarios = [e for e in escenarios if e != "venta"]
    if "pdf_grande" in escenarios and not args.incluir_grande:
        if args.escenarios:
            omitidos.append("pdf_grande (requiere --incluir-grande)")
        escenarios = [e for e in escenarios if e != "pdf_grande"]

    if args.salida.exists():
        shutil.rmtree(args.salida)
    args.salida.mkdir(parents=True)

    manifiesto = {"semilla": semilla, "rutEmpresa": args.rut_empresa, "documentos": []}
    validos: list[tuple[Path, dict]] = []

    contador = 0
    for escenario in [e for e in escenarios if e in ESCENARIOS_PDF]:
        for _ in range(args.cantidad):
            contador += 1
            doc = generador.crear(escenario)
            nombre = f"{contador:03d}_{escenario}_{doc.folio}.pdf"
            ruta = args.salida / nombre
            if escenario == "pdf_sin_texto":
                escribir_pdf_sin_texto(ruta, doc, rng)
            else:
                escribir_pdf(ruta, maquetar(doc), f"{TITULOS[doc.tipo]} {doc.folio}")
            validos.append((ruta, {
                "archivo": None,
                "escenario": escenario,
                "esperado": {"carga": "ACEPTADA", "procesamiento": doc.esperado_procesamiento},
                "observaciones": doc.observaciones_prueba,
                "datos": None if escenario == "pdf_sin_texto" else doc.esperado(),
            }))

    # Lotes de hasta 10 documentos, el máximo que acepta el sistema por carga.
    for indice in range(0, len(validos), MAX_POR_LOTE):
        carpeta = args.salida / f"lote_{indice // MAX_POR_LOTE + 1:02d}"
        carpeta.mkdir()
        for ruta, entrada in validos[indice:indice + MAX_POR_LOTE]:
            destino = carpeta / ruta.name
            ruta.rename(destino)
            entrada["archivo"] = str(destino.relative_to(args.salida))
            manifiesto["documentos"].append(entrada)

    rechazos = [e for e in escenarios if e in ESCENARIOS_RECHAZO]
    if rechazos:
        carpeta = args.salida / "carga_rechazada"
        carpeta.mkdir()
        for escenario in rechazos:
            if escenario == "archivo_no_pdf":
                ruta = carpeta / "archivo_no_pdf.pdf"
                ruta.write_text("Este archivo es texto plano con extension .pdf; no tiene la firma %PDF.\n", encoding="utf-8")
                motivo = "Sin firma %PDF: el frontend lo bloquea y el backend responde INVALID_PDF_FILE."
            else:
                ruta = carpeta / "pdf_grande_16mb.pdf"
                escribir_pdf_grande(ruta)
                motivo = f"Pesa {ruta.stat().st_size / 1024 / 1024:.1f} MB, sobre el límite de 15 MB por archivo."
            manifiesto["documentos"].append({
                "archivo": str(ruta.relative_to(args.salida)),
                "escenario": escenario,
                "esperado": {"carga": "RECHAZADA", "procesamiento": None},
                "observaciones": [motivo, "Súbelo solo o junto a PDFs válidos: el lote completo debe rechazarse."],
                "datos": None,
            })

    (args.salida / "manifiesto.json").write_text(json.dumps(manifiesto, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Semilla: {semilla} (usa --semilla {semilla} para regenerar los mismos documentos)")
    print(f"Salida: {args.salida}")
    for entrada in manifiesto["documentos"]:
        esperado = entrada["esperado"]
        resultado = esperado["procesamiento"] or f"carga {esperado['carga'].lower()}"
        print(f"  {entrada['archivo']:<55} {resultado}")
    if omitidos:
        print("Omitidos: " + ", ".join(omitidos))
    print("Resultados esperados y datos de referencia en manifiesto.json")


if __name__ == "__main__":
    main()
