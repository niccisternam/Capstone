-- Módulo 1: notebooks, documentos, procesamiento y revisión.

CREATE TYPE "estado_documento" AS ENUM (
    'PENDIENTE',
    'PROCESANDO',
    'PENDIENTE_REVISION',
    'ERROR',
    'CONFIRMADO'
);

CREATE TYPE "estado_extraccion" AS ENUM (
    'ENCONTRADO',
    'AUSENTE',
    'NO_APLICA',
    'ILEGIBLE',
    'INCIERTO'
);

CREATE TYPE "tipo_ajuste" AS ENUM ('DESCUENTO', 'RECARGO');
CREATE TYPE "modalidad_ajuste" AS ENUM ('PORCENTAJE', 'MONTO');
CREATE TYPE "estado_revision" AS ENUM ('PENDIENTE', 'EDITANDO', 'CONFIRMADA');
CREATE TYPE "condicion_tributaria" AS ENUM ('AFECTA', 'EXENTA', 'NO_AFECTA', 'MIXTA');

CREATE TABLE "notebook" (
    "id_notebook" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_empresa" UUID NOT NULL,
    "creado_por" UUID NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "icono" VARCHAR(80),
    "paleta_colores" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notebook_pkey" PRIMARY KEY ("id_notebook"),
    CONSTRAINT "ck_notebook_nombre" CHECK (NULLIF(BTRIM("nombre"), '') IS NOT NULL),
    CONSTRAINT "ck_notebook_paleta_objeto" CHECK ("paleta_colores" IS NULL OR jsonb_typeof("paleta_colores") = 'object'),
    CONSTRAINT "fk_notebook_empresa" FOREIGN KEY ("id_empresa") REFERENCES "empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "fk_notebook_creador" FOREIGN KEY ("creado_por") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "lote_procesamiento" (
    "id_lote" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_empresa" UUID NOT NULL,
    "id_notebook" UUID NOT NULL,
    "creado_por" UUID NOT NULL,
    "cantidad_documentos" INTEGER NOT NULL DEFAULT 0,
    "cantidad_procesados" INTEGER NOT NULL DEFAULT 0,
    "cantidad_errores" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "procesamiento_inicio" TIMESTAMPTZ(6),
    "procesamiento_fin" TIMESTAMPTZ(6),
    CONSTRAINT "lote_procesamiento_pkey" PRIMARY KEY ("id_lote"),
    CONSTRAINT "ck_lote_cantidad" CHECK ("cantidad_documentos" BETWEEN 0 AND 10),
    CONSTRAINT "ck_lote_procesados" CHECK ("cantidad_procesados" >= 0 AND "cantidad_procesados" <= "cantidad_documentos"),
    CONSTRAINT "ck_lote_errores" CHECK ("cantidad_errores" >= 0 AND "cantidad_errores" <= "cantidad_documentos"),
    CONSTRAINT "ck_lote_fechas" CHECK ("procesamiento_fin" IS NULL OR "procesamiento_inicio" IS NULL OR "procesamiento_fin" >= "procesamiento_inicio"),
    CONSTRAINT "fk_lote_empresa" FOREIGN KEY ("id_empresa") REFERENCES "empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "fk_lote_creador" FOREIGN KEY ("creado_por") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "documento" (
    "id_documento" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_empresa" UUID NOT NULL,
    "id_notebook" UUID NOT NULL,
    "id_lote" UUID NOT NULL,
    "cargado_por" UUID NOT NULL,
    "posicion_lote" INTEGER NOT NULL,
    "estado" "estado_documento" NOT NULL DEFAULT 'PENDIENTE',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmado_at" TIMESTAMPTZ(6),
    CONSTRAINT "documento_pkey" PRIMARY KEY ("id_documento"),
    CONSTRAINT "ck_documento_posicion" CHECK ("posicion_lote" BETWEEN 1 AND 10),
    CONSTRAINT "ck_documento_confirmacion" CHECK (("estado" = 'CONFIRMADO' AND "confirmado_at" IS NOT NULL) OR ("estado" <> 'CONFIRMADO' AND "confirmado_at" IS NULL)),
    CONSTRAINT "fk_documento_empresa" FOREIGN KEY ("id_empresa") REFERENCES "empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "fk_documento_cargador" FOREIGN KEY ("cargado_por") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "archivo_pdf" (
    "id_archivo" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_documento" UUID NOT NULL,
    "nombre_original" TEXT NOT NULL,
    "tipo_mime" VARCHAR(100) NOT NULL,
    "tamano_bytes" BIGINT NOT NULL,
    "hash_archivo" VARCHAR(128),
    "storage_key" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "archivo_pdf_pkey" PRIMARY KEY ("id_archivo"),
    CONSTRAINT "uq_archivo_documento" UNIQUE ("id_documento"),
    CONSTRAINT "uq_archivo_storage_key" UNIQUE ("storage_key"),
    CONSTRAINT "ck_archivo_pdf" CHECK (LOWER("tipo_mime") = 'application/pdf'),
    CONSTRAINT "ck_archivo_tamano" CHECK ("tamano_bytes" > 0 AND "tamano_bytes" <= 15728640),
    CONSTRAINT "fk_archivo_documento" FOREIGN KEY ("id_documento") REFERENCES "documento"("id_documento") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "intento_procesamiento" (
    "id_intento" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_documento" UUID NOT NULL,
    "numero_intento" INTEGER NOT NULL,
    "inicio_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fin_at" TIMESTAMPTZ(6),
    "validacion_pdf" JSONB,
    "error_codigo" VARCHAR(100),
    "error_mensaje" TEXT,
    "correlacion" VARCHAR(150),
    CONSTRAINT "intento_procesamiento_pkey" PRIMARY KEY ("id_intento"),
    CONSTRAINT "uq_intento_documento_numero" UNIQUE ("id_documento", "numero_intento"),
    CONSTRAINT "ck_intento_numero" CHECK ("numero_intento" > 0),
    CONSTRAINT "ck_intento_fechas" CHECK ("fin_at" IS NULL OR "fin_at" >= "inicio_at"),
    CONSTRAINT "fk_intento_documento" FOREIGN KEY ("id_documento") REFERENCES "documento"("id_documento") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "resultado_extraccion" (
    "id_resultado" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_documento" UUID NOT NULL,
    "id_intento" UUID NOT NULL,
    "tipo_documento" VARCHAR(100),
    "tipo_documento_estado" "estado_extraccion" NOT NULL,
    "folio" VARCHAR(30),
    "folio_estado" "estado_extraccion" NOT NULL,
    "fecha_emision" DATE,
    "fecha_emision_estado" "estado_extraccion" NOT NULL,
    "emisor_rut" VARCHAR(12),
    "emisor_rut_estado" "estado_extraccion" NOT NULL,
    "emisor_razon_social" VARCHAR(200),
    "emisor_razon_social_estado" "estado_extraccion" NOT NULL,
    "receptor_rut" VARCHAR(12),
    "receptor_rut_estado" "estado_extraccion" NOT NULL,
    "receptor_nombre" VARCHAR(200),
    "receptor_nombre_estado" "estado_extraccion" NOT NULL,
    "condicion_tributaria" "condicion_tributaria",
    "condicion_estado" "estado_extraccion" NOT NULL,
    "neto" NUMERIC(18,6),
    "neto_estado" "estado_extraccion" NOT NULL,
    "iva" NUMERIC(18,6),
    "iva_estado" "estado_extraccion" NOT NULL,
    "exento" NUMERIC(18,6),
    "exento_estado" "estado_extraccion" NOT NULL,
    "total" NUMERIC(18,6),
    "total_estado" "estado_extraccion" NOT NULL,
    "medio_pago" VARCHAR(40),
    "medio_pago_estado" "estado_extraccion" NOT NULL,
    "metadata" JSONB,
    "errores" JSONB,
    "advertencias" JSONB,
    CONSTRAINT "resultado_extraccion_pkey" PRIMARY KEY ("id_resultado"),
    CONSTRAINT "uq_resultado_intento" UNIQUE ("id_intento"),
    CONSTRAINT "fk_resultado_documento" FOREIGN KEY ("id_documento") REFERENCES "documento"("id_documento") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk_resultado_intento" FOREIGN KEY ("id_intento") REFERENCES "intento_procesamiento"("id_intento") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ck_resultado_metadata" CHECK ("metadata" IS NULL OR jsonb_typeof("metadata") = 'object'),
    CONSTRAINT "ck_resultado_errores" CHECK ("errores" IS NULL OR jsonb_typeof("errores") = 'array'),
    CONSTRAINT "ck_resultado_advertencias" CHECK ("advertencias" IS NULL OR jsonb_typeof("advertencias") = 'array')
);

CREATE TABLE "detalle_extraccion" (
    "id_detalle" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_resultado" UUID NOT NULL,
    "numero_linea" INTEGER NOT NULL,
    "descripcion" TEXT,
    "descripcion_estado" "estado_extraccion" NOT NULL,
    "cantidad" NUMERIC(18,6),
    "cantidad_estado" "estado_extraccion" NOT NULL,
    "unidad" VARCHAR(40),
    "unidad_estado" "estado_extraccion" NOT NULL,
    "precio_unitario" NUMERIC(18,6),
    "precio_unitario_estado" "estado_extraccion" NOT NULL,
    "descuento_porcentaje" NUMERIC(7,4),
    "descuento_porcentaje_estado" "estado_extraccion" NOT NULL,
    "descuento_monto" NUMERIC(18,6),
    "descuento_monto_estado" "estado_extraccion" NOT NULL,
    "recargo_porcentaje" NUMERIC(7,4),
    "recargo_porcentaje_estado" "estado_extraccion" NOT NULL,
    "recargo_monto" NUMERIC(18,6),
    "recargo_monto_estado" "estado_extraccion" NOT NULL,
    "total_linea" NUMERIC(18,6),
    "total_linea_estado" "estado_extraccion" NOT NULL,
    "metadata" JSONB,
    CONSTRAINT "detalle_extraccion_pkey" PRIMARY KEY ("id_detalle"),
    CONSTRAINT "uq_detalle_resultado_linea" UNIQUE ("id_resultado", "numero_linea"),
    CONSTRAINT "ck_detalle_numero_linea" CHECK ("numero_linea" > 0),
    CONSTRAINT "ck_detalle_descuento_pct" CHECK ("descuento_porcentaje" IS NULL OR "descuento_porcentaje" BETWEEN 0 AND 100),
    CONSTRAINT "ck_detalle_recargo_pct" CHECK ("recargo_porcentaje" IS NULL OR "recargo_porcentaje" BETWEEN 0 AND 100),
    CONSTRAINT "ck_detalle_metadata" CHECK ("metadata" IS NULL OR jsonb_typeof("metadata") = 'object'),
    CONSTRAINT "fk_detalle_resultado" FOREIGN KEY ("id_resultado") REFERENCES "resultado_extraccion"("id_resultado") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ajuste_global_extraccion" (
    "id_ajuste" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_resultado" UUID NOT NULL,
    "numero_ajuste" INTEGER NOT NULL,
    "tipo" "tipo_ajuste" NOT NULL,
    "modalidad" "modalidad_ajuste" NOT NULL,
    "valor" NUMERIC(18,6),
    "valor_estado" "estado_extraccion" NOT NULL,
    "descripcion" TEXT,
    "descripcion_estado" "estado_extraccion" NOT NULL,
    CONSTRAINT "ajuste_global_extraccion_pkey" PRIMARY KEY ("id_ajuste"),
    CONSTRAINT "uq_ajuste_resultado_numero" UNIQUE ("id_resultado", "numero_ajuste"),
    CONSTRAINT "ck_ajuste_numero" CHECK ("numero_ajuste" > 0),
    CONSTRAINT "fk_ajuste_resultado" FOREIGN KEY ("id_resultado") REFERENCES "resultado_extraccion"("id_resultado") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "revision_documento" (
    "id_revision" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_documento" UUID NOT NULL,
    "id_resultado" UUID NOT NULL,
    "revisado_por" UUID NOT NULL,
    "estado" "estado_revision" NOT NULL DEFAULT 'PENDIENTE',
    "estado_pago" VARCHAR(40),
    "observacion" TEXT,
    "tipo_documento" VARCHAR(100),
    "folio" VARCHAR(30),
    "fecha_emision" DATE,
    "emisor_rut" VARCHAR(12),
    "emisor_razon_social" VARCHAR(200),
    "receptor_rut" VARCHAR(12),
    "receptor_nombre" VARCHAR(200),
    "condicion_tributaria" "condicion_tributaria",
    "neto" NUMERIC(18,6),
    "iva" NUMERIC(18,6),
    "exento" NUMERIC(18,6),
    "total" NUMERIC(18,6),
    "medio_pago" VARCHAR(40),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmed_at" TIMESTAMPTZ(6),
    CONSTRAINT "revision_documento_pkey" PRIMARY KEY ("id_revision"),
    CONSTRAINT "ck_revision_confirmacion" CHECK (("estado" = 'CONFIRMADA' AND "confirmed_at" IS NOT NULL) OR ("estado" <> 'CONFIRMADA' AND "confirmed_at" IS NULL)),
    CONSTRAINT "fk_revision_documento" FOREIGN KEY ("id_documento") REFERENCES "documento"("id_documento") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk_revision_resultado" FOREIGN KEY ("id_resultado") REFERENCES "resultado_extraccion"("id_resultado") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "fk_revision_revisor" FOREIGN KEY ("revisado_por") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "detalle_revision" (
    "id_detalle_revision" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_revision" UUID NOT NULL,
    "id_detalle_extraccion" UUID,
    "numero_linea" INTEGER NOT NULL,
    "descripcion" TEXT,
    "cantidad" NUMERIC(18,6),
    "unidad" VARCHAR(40),
    "precio_unitario" NUMERIC(18,6),
    "descuento_porcentaje" NUMERIC(7,4),
    "descuento_monto" NUMERIC(18,6),
    "recargo_porcentaje" NUMERIC(7,4),
    "recargo_monto" NUMERIC(18,6),
    "total_linea" NUMERIC(18,6),
    CONSTRAINT "detalle_revision_pkey" PRIMARY KEY ("id_detalle_revision"),
    CONSTRAINT "uq_detalle_revision_linea" UNIQUE ("id_revision", "numero_linea"),
    CONSTRAINT "ck_revision_detalle_linea" CHECK ("numero_linea" > 0),
    CONSTRAINT "ck_revision_detalle_descuento_pct" CHECK ("descuento_porcentaje" IS NULL OR "descuento_porcentaje" BETWEEN 0 AND 100),
    CONSTRAINT "ck_revision_detalle_recargo_pct" CHECK ("recargo_porcentaje" IS NULL OR "recargo_porcentaje" BETWEEN 0 AND 100),
    CONSTRAINT "fk_detalle_revision" FOREIGN KEY ("id_revision") REFERENCES "revision_documento"("id_revision") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk_detalle_revision_extraccion" FOREIGN KEY ("id_detalle_extraccion") REFERENCES "detalle_extraccion"("id_detalle") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "ajuste_global_revision" (
    "id_ajuste_revision" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_revision" UUID NOT NULL,
    "numero_ajuste" INTEGER NOT NULL,
    "tipo" "tipo_ajuste" NOT NULL,
    "modalidad" "modalidad_ajuste" NOT NULL,
    "valor" NUMERIC(18,6),
    "descripcion" TEXT,
    CONSTRAINT "ajuste_global_revision_pkey" PRIMARY KEY ("id_ajuste_revision"),
    CONSTRAINT "uq_ajuste_revision_numero" UNIQUE ("id_revision", "numero_ajuste"),
    CONSTRAINT "ck_ajuste_revision_numero" CHECK ("numero_ajuste" > 0),
    CONSTRAINT "fk_ajuste_revision" FOREIGN KEY ("id_revision") REFERENCES "revision_documento"("id_revision") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "uq_notebook_empresa_nombre_lower" ON "notebook" ("id_empresa", LOWER("nombre"));
CREATE INDEX "idx_archivo_hash" ON "archivo_pdf" ("hash_archivo");
CREATE INDEX "idx_intento_documento_fecha" ON "intento_procesamiento" ("id_documento", "inicio_at" DESC);
CREATE INDEX "idx_resultado_documento" ON "resultado_extraccion" ("id_documento");
CREATE INDEX "idx_detalle_resultado" ON "detalle_extraccion" ("id_resultado");
CREATE INDEX "idx_ajuste_resultado" ON "ajuste_global_extraccion" ("id_resultado");
CREATE INDEX "idx_revision_documento_fecha" ON "revision_documento" ("id_documento", "created_at" DESC);
CREATE INDEX "idx_revision_revisor" ON "revision_documento" ("revisado_por");
CREATE INDEX "idx_detalle_revision" ON "detalle_revision" ("id_revision");
CREATE INDEX "idx_ajuste_revision" ON "ajuste_global_revision" ("id_revision");
CREATE UNIQUE INDEX "uq_revision_documento_confirmada" ON "revision_documento" ("id_documento") WHERE "estado" = 'CONFIRMADA';

ALTER TABLE "notebook"
    ADD CONSTRAINT "uq_notebook_empresa_id" UNIQUE ("id_empresa", "id_notebook");

ALTER TABLE "lote_procesamiento"
    ADD CONSTRAINT "uq_lote_empresa_id" UNIQUE ("id_empresa", "id_lote");

ALTER TABLE "lote_procesamiento"
    ADD CONSTRAINT "fk_lote_empresa_notebook" FOREIGN KEY ("id_empresa", "id_notebook") REFERENCES "notebook"("id_empresa", "id_notebook") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "documento"
    ADD CONSTRAINT "fk_documento_empresa_notebook" FOREIGN KEY ("id_empresa", "id_notebook") REFERENCES "notebook"("id_empresa", "id_notebook") ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT "fk_documento_empresa_lote" FOREIGN KEY ("id_empresa", "id_lote") REFERENCES "lote_procesamiento"("id_empresa", "id_lote") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE OR REPLACE FUNCTION actualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_notebook_updated_at
BEFORE UPDATE ON "notebook"
FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
