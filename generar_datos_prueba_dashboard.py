#!/usr/bin/env python3
"""Genera INSERTs PostgreSQL de prueba para el dashboard; no se conecta a la DB."""

from datetime import date, datetime, timedelta, timezone
from decimal import Decimal
from pathlib import Path
import json
import uuid


ID_USUARIO = "82bbfd47-ed8c-45f8-96f9-cb887be532c5"
ID_EMPRESA = "122569bb-eb95-4be0-8988-3b92a994f731"
CANTIDAD_DOCUMENTOS = 500  # Cambia este valor para generar más o menos documentos.
DOCUMENTOS_POR_LOTE = 10

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "datos_prueba_dashboard.txt"


class JsonValue:
    def __init__(self, value):
        self.value = value


def sql_value(value):
    if value is None:
        return "NULL"
    if isinstance(value, JsonValue):
        encoded = json.dumps(value.value, ensure_ascii=False, separators=(",", ":"))
        return "'" + encoded.replace("'", "''") + "'::jsonb"
    if isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    if isinstance(value, (int, Decimal)):
        return str(value)
    return "'" + str(value).replace("'", "''") + "'"


def insert(table, row):
    columns = ", ".join(f'"{column}"' for column in row)
    values = ", ".join(sql_value(value) for value in row.values())
    return f'INSERT INTO "{table}" ({columns}) VALUES ({values});'


def fecha_emision(run_at, months_ago, day):
    month_index = run_at.year * 12 + run_at.month - 1 - months_ago
    year, zero_based_month = divmod(month_index, 12)
    return date(year, zero_based_month + 1, min(day, 28)).isoformat()


def main():
    if not isinstance(CANTIDAD_DOCUMENTOS, int) or CANTIDAD_DOCUMENTOS < 1:
        raise ValueError("CANTIDAD_DOCUMENTOS debe ser un entero mayor que cero.")

    run_at = datetime.now(timezone.utc).replace(microsecond=0)
    suffix = uuid.uuid4().hex[:8]
    notebook_name = f"Pruebas Dashboard {run_at:%Y%m%dT%H%M%SZ}-{suffix}"

    notebook_id = str(uuid.uuid4())
    batch_count = (CANTIDAD_DOCUMENTOS + DOCUMENTOS_POR_LOTE - 1) // DOCUMENTOS_POR_LOTE
    batch_ids = [str(uuid.uuid4()) for _ in range(batch_count)]
    document_ids = [str(uuid.uuid4()) for _ in range(CANTIDAD_DOCUMENTOS)]
    attempt_ids = [str(uuid.uuid4()) for _ in range(CANTIDAD_DOCUMENTOS)]
    result_ids = [str(uuid.uuid4()) for _ in range(CANTIDAD_DOCUMENTOS)]
    revision_ids = [str(uuid.uuid4()) for _ in range(CANTIDAD_DOCUMENTOS)]

    # Proveedor, RUT, producto, cantidad, precio, descuento línea,
    # recargo línea, ajuste global (tipo, valor), neto, IVA, total, estado de pago.
    templates = [
        ("Comercial Andina SpA", "76123456-7", "Resma papel carta",
         10, 10000, 5000, 0, None, 0, 95000, 18050, 113050, "PAGADO"),
        ("Servicios del Sur Ltda.", "77987654-3", "Soporte informático",
         3, 30000, 0, 9000, None, 0, 99000, 18810, 117810, "PENDIENTE"),
        ("Comercial Andina SpA", "76123456-7", "Resma papel carta",
         5, 20000, 5000, 0, None, 0, 95000, 18050, 113050, "PAGADO"),
        ("Asesorías del Pacífico SpA", "76543210-8", "Consultoría contable",
         1, 200000, 0, 0, "RECARGO", 5000, 205000, 38950, 243950, "PAGADO"),
        ("Importadora Austral Ltda.", "76876543-2", "Monitor 24 pulgadas",
         2, 75000, 0, 0, None, 0, 150000, 28500, 178500, "PENDIENTE"),
        ("Tecno Chile SpA", "77111222-5", "Tóner impresora",
         4, 25000, 0, 0, "DESCUENTO", 10000, 90000, 17100, 107100, "PENDIENTE"),
    ]

    statements = [insert("notebook", {
        "id_notebook": notebook_id,
        "id_empresa": ID_EMPRESA,
        "creado_por": ID_USUARIO,
        "nombre": notebook_name,
        "descripcion": f"Notebook con {CANTIDAD_DOCUMENTOS} documentos sintéticos para probar el dashboard.",
        "icono": "chart",
        "paleta_colores": JsonValue({"primary": "#2563eb", "secondary": "#14b8a6"}),
    })]

    for batch_index, batch_id in enumerate(batch_ids):
        documents_in_batch = min(
            DOCUMENTOS_POR_LOTE,
            CANTIDAD_DOCUMENTOS - batch_index * DOCUMENTOS_POR_LOTE,
        )
        statements.append(insert("lote_procesamiento", {
            "id_lote": batch_id,
            "id_empresa": ID_EMPRESA,
            "id_notebook": notebook_id,
            "creado_por": ID_USUARIO,
            "cantidad_documentos": documents_in_batch,
            "cantidad_procesados": documents_in_batch,
            "cantidad_errores": 0,
            "created_at": run_at.isoformat(),
            "procesamiento_inicio": run_at.isoformat(),
            "procesamiento_fin": (run_at + timedelta(seconds=30)).isoformat(),
        }))

    for index in range(CANTIDAD_DOCUMENTOS):
        template = templates[index % len(templates)]
        (
            vendor, vendor_rut, product, quantity, unit_price, line_discount,
            line_surcharge, global_adjustment_type, global_adjustment_value,
            net, vat, total, payment_status,
        ) = template
        scale = 1 + (index // len(templates)) % 4
        quantity *= scale
        line_discount *= scale
        line_surcharge *= scale
        global_adjustment_value *= scale
        net *= scale
        vat *= scale
        total *= scale
        issued_on = fecha_emision(run_at, index % 12, 1 + (index * 7) % 28)
        folio = str(100000 + index)
        document_id = document_ids[index]
        attempt_id = attempt_ids[index]
        result_id = result_ids[index]
        revision_id = revision_ids[index]
        batch_id = batch_ids[index // DOCUMENTOS_POR_LOTE]
        issued_at = f"{issued_on}T12:00:00+00:00"
        confirmed_at = f"{issued_on}T13:00:00+00:00"

        statements.append(insert("documento", {
            "id_documento": document_id,
            "id_empresa": ID_EMPRESA,
            "id_notebook": notebook_id,
            "id_lote": batch_id,
            "cargado_por": ID_USUARIO,
            "posicion_lote": index % DOCUMENTOS_POR_LOTE + 1,
            "estado": "CONFIRMADO",
            "direccion": "COMPRA",
            "created_at": issued_at,
            "confirmado_at": confirmed_at,
        }))

        statements.append(insert("intento_procesamiento", {
            "id_intento": attempt_id,
            "id_documento": document_id,
            "numero_intento": 1,
            "inicio_at": issued_at,
            "fin_at": confirmed_at,
            "validacion_pdf": JsonValue({"contieneTexto": True, "paginas": 1}),
        }))

        extraction_values = {
            "id_resultado": result_id,
            "id_documento": document_id,
            "id_intento": attempt_id,
            "tipo_documento": "Factura",
            "tipo_documento_estado": "ENCONTRADO",
            "folio": folio,
            "folio_estado": "ENCONTRADO",
            "fecha_emision": issued_on,
            "fecha_emision_estado": "ENCONTRADO",
            "emisor_rut": vendor_rut,
            "emisor_rut_estado": "ENCONTRADO",
            "emisor_razon_social": vendor,
            "emisor_razon_social_estado": "ENCONTRADO",
            "receptor_rut": "21732802-0",
            "receptor_rut_estado": "ENCONTRADO",
            "receptor_nombre": "Marcelo Vásquez",
            "receptor_nombre_estado": "ENCONTRADO",
            "condicion_tributaria": "AFECTA",
            "condicion_estado": "ENCONTRADO",
            "neto": Decimal(net),
            "neto_estado": "ENCONTRADO",
            "iva": Decimal(vat),
            "iva_estado": "ENCONTRADO",
            "exento": Decimal(0),
            "exento_estado": "ENCONTRADO",
            "total": Decimal(total),
            "total_estado": "ENCONTRADO",
            "medio_pago": "Transferencia",
            "medio_pago_estado": "ENCONTRADO",
        }
        statements.append(insert("resultado_extraccion", extraction_values))

        statements.append(insert("revision_documento", {
            "id_revision": revision_id,
            "id_documento": document_id,
            "id_resultado": result_id,
            "revisado_por": ID_USUARIO,
            "estado": "CONFIRMADA",
            "estado_pago": payment_status,
            "tipo_documento": "Factura",
            "folio": folio,
            "fecha_emision": issued_on,
            "emisor_rut": vendor_rut,
            "emisor_razon_social": vendor,
            "receptor_rut": "21732802-0",
            "receptor_nombre": "Marcelo Vásquez",
            "condicion_tributaria": "AFECTA",
            "neto": Decimal(net),
            "iva": Decimal(vat),
            "exento": Decimal(0),
            "total": Decimal(total),
            "medio_pago": "Transferencia",
            "created_at": confirmed_at,
            "confirmed_at": confirmed_at,
        }))

        detail_total = quantity * unit_price - line_discount + line_surcharge
        statements.append(insert("detalle_revision", {
            "id_revision": revision_id,
            "numero_linea": 1,
            "descripcion": product,
            "cantidad": Decimal(quantity),
            "unidad": "UNIDAD",
            "precio_unitario": Decimal(unit_price),
            "descuento_monto": Decimal(line_discount) if line_discount else None,
            "recargo_monto": Decimal(line_surcharge) if line_surcharge else None,
            "total_linea": Decimal(detail_total),
        }))

        if global_adjustment_type:
            statements.append(insert("ajuste_global_revision", {
                "id_revision": revision_id,
                "numero_ajuste": 1,
                "tipo": global_adjustment_type,
                "modalidad": "MONTO",
                "valor": Decimal(global_adjustment_value),
                "descripcion": (
                    "Recargo global de servicio"
                    if global_adjustment_type == "RECARGO"
                    else "Descuento comercial global"
                ),
            }))

    OUTPUT.write_text("\n".join(statements) + "\n", encoding="utf-8")
    print(f"Archivo generado: {OUTPUT}")
    print(f"Notebook: {notebook_name}")
    print(f"Documentos generados: {CANTIDAD_DOCUMENTOS}")
    print(f"Lotes generados: {batch_count}")
    print(f"INSERTs generados: {len(statements)}")


if __name__ == "__main__":
    main()
