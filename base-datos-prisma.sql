-- Esquema PostgreSQL generado desde Backend Javascript/prisma/schema.prisma
-- (prisma migrate diff --from-empty). Importable en dbdiagram.io.

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "rol_usuario" AS ENUM ('USUARIO', 'ADMINISTRADOR');

-- CreateEnum
CREATE TYPE "estado_usuario" AS ENUM ('PENDIENTE', 'ACTIVO', 'BLOQUEADO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "estado_solicitud" AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "tipo_token_seguridad" AS ENUM ('CODIGO_INICIO_SESION', 'RECUPERACION_PASSWORD', 'VERIFICACION_CORREO');

-- CreateEnum
CREATE TYPE "tipo_evento_seguridad" AS ENUM ('LOGIN_EXITOSO', 'LOGIN_FALLIDO', 'CODIGO_INVALIDO', 'CUENTA_BLOQUEADA', 'CAMBIO_PASSWORD', 'RECUPERACION_SOLICITADA', 'SESION_CERRADA');

-- CreateEnum
CREATE TYPE "estado_documento" AS ENUM ('PENDIENTE', 'PROCESANDO', 'PENDIENTE_REVISION', 'ERROR', 'CONFIRMADO');

-- CreateEnum
CREATE TYPE "estado_extraccion" AS ENUM ('ENCONTRADO', 'AUSENTE', 'NO_APLICA', 'ILEGIBLE', 'INCIERTO');

-- CreateEnum
CREATE TYPE "tipo_ajuste" AS ENUM ('DESCUENTO', 'RECARGO');

-- CreateEnum
CREATE TYPE "modalidad_ajuste" AS ENUM ('PORCENTAJE', 'MONTO');

-- CreateEnum
CREATE TYPE "estado_revision" AS ENUM ('PENDIENTE', 'EDITANDO', 'CONFIRMADA');

-- CreateEnum
CREATE TYPE "direccion_documento" AS ENUM ('COMPRA', 'VENTA');

-- CreateEnum
CREATE TYPE "rol_mensaje_chat" AS ENUM ('USUARIO', 'ASISTENTE');

-- CreateEnum
CREATE TYPE "condicion_tributaria" AS ENUM ('AFECTA', 'EXENTA', 'NO_AFECTA', 'MIXTA');

-- CreateTable
CREATE TABLE "empresa" (
    "id_empresa" UUID NOT NULL DEFAULT gen_random_uuid(),
    "rut_empresa" VARCHAR(12) NOT NULL,
    "razon_social" VARCHAR(200) NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "empresa_pkey" PRIMARY KEY ("id_empresa")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_empresa" UUID NOT NULL,
    "rut_usuario" VARCHAR(12) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "correo" VARCHAR(320) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "rol" "rol_usuario" NOT NULL DEFAULT 'USUARIO',
    "estado" "estado_usuario" NOT NULL DEFAULT 'PENDIENTE',
    "debe_cambiar_password" BOOLEAN NOT NULL DEFAULT true,
    "intentos_fallidos" INTEGER NOT NULL DEFAULT 0,
    "bloqueado_hasta" TIMESTAMPTZ(6),
    "password_changed_at" TIMESTAMPTZ(6),
    "correo_verificado_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "solicitud_cuenta" (
    "id_solicitud" UUID NOT NULL DEFAULT gen_random_uuid(),
    "rut_empresa" VARCHAR(12) NOT NULL,
    "razon_social" VARCHAR(200),
    "rut_usuario" VARCHAR(12) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "correo" VARCHAR(320) NOT NULL,
    "descripcion" TEXT,
    "estado" "estado_solicitud" NOT NULL DEFAULT 'PENDIENTE',
    "revisada_por" UUID,
    "fecha_revision" TIMESTAMPTZ(6),
    "motivo_rechazo" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solicitud_cuenta_pkey" PRIMARY KEY ("id_solicitud")
);

-- CreateTable
CREATE TABLE "sesion_usuario" (
    "id_sesion" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_usuario" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "recordar_sesion" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultima_actividad_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "revoked_at" TIMESTAMPTZ(6),

    CONSTRAINT "sesion_usuario_pkey" PRIMARY KEY ("id_sesion")
);

-- CreateTable
CREATE TABLE "token_seguridad" (
    "id_token" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_usuario" UUID NOT NULL,
    "tipo" "tipo_token_seguridad" NOT NULL,
    "token_hash" TEXT NOT NULL,
    "cantidad_intentos" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "used_at" TIMESTAMPTZ(6),
    "revoked_at" TIMESTAMPTZ(6),

    CONSTRAINT "token_seguridad_pkey" PRIMARY KEY ("id_token")
);

-- CreateTable
CREATE TABLE "evento_seguridad" (
    "id_evento" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_usuario" UUID,
    "tipo_evento" "tipo_evento_seguridad" NOT NULL,
    "identificador" VARCHAR(320),
    "exitoso" BOOLEAN NOT NULL DEFAULT false,
    "motivo_fallo" TEXT,
    "direccion_ip_hash" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evento_seguridad_pkey" PRIMARY KEY ("id_evento")
);

-- CreateTable
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

    CONSTRAINT "notebook_pkey" PRIMARY KEY ("id_notebook")
);

-- CreateTable
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

    CONSTRAINT "lote_procesamiento_pkey" PRIMARY KEY ("id_lote")
);

-- CreateTable
CREATE TABLE "documento" (
    "id_documento" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_empresa" UUID NOT NULL,
    "id_notebook" UUID NOT NULL,
    "id_lote" UUID NOT NULL,
    "cargado_por" UUID NOT NULL,
    "posicion_lote" INTEGER NOT NULL,
    "estado" "estado_documento" NOT NULL DEFAULT 'PENDIENTE',
    "direccion" "direccion_documento" NOT NULL DEFAULT 'COMPRA',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmado_at" TIMESTAMPTZ(6),

    CONSTRAINT "documento_pkey" PRIMARY KEY ("id_documento")
);

-- CreateTable
CREATE TABLE "archivo_pdf" (
    "id_archivo" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_documento" UUID NOT NULL,
    "nombre_original" TEXT NOT NULL,
    "tipo_mime" VARCHAR(100) NOT NULL,
    "tamano_bytes" BIGINT NOT NULL,
    "hash_archivo" VARCHAR(128),
    "storage_key" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "archivo_pdf_pkey" PRIMARY KEY ("id_archivo")
);

-- CreateTable
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

    CONSTRAINT "intento_procesamiento_pkey" PRIMARY KEY ("id_intento")
);

-- CreateTable
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
    "neto" DECIMAL(18,6),
    "neto_estado" "estado_extraccion" NOT NULL,
    "iva" DECIMAL(18,6),
    "iva_estado" "estado_extraccion" NOT NULL,
    "exento" DECIMAL(18,6),
    "exento_estado" "estado_extraccion" NOT NULL,
    "total" DECIMAL(18,6),
    "total_estado" "estado_extraccion" NOT NULL,
    "medio_pago" VARCHAR(40),
    "medio_pago_estado" "estado_extraccion" NOT NULL,
    "metadata" JSONB,
    "errores" JSONB,
    "advertencias" JSONB,

    CONSTRAINT "resultado_extraccion_pkey" PRIMARY KEY ("id_resultado")
);

-- CreateTable
CREATE TABLE "detalle_extraccion" (
    "id_detalle" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_resultado" UUID NOT NULL,
    "numero_linea" INTEGER NOT NULL,
    "descripcion" TEXT,
    "descripcion_estado" "estado_extraccion" NOT NULL,
    "cantidad" DECIMAL(18,6),
    "cantidad_estado" "estado_extraccion" NOT NULL,
    "unidad" VARCHAR(40),
    "unidad_estado" "estado_extraccion" NOT NULL,
    "precio_unitario" DECIMAL(18,6),
    "precio_unitario_estado" "estado_extraccion" NOT NULL,
    "descuento_porcentaje" DECIMAL(7,4),
    "descuento_porcentaje_estado" "estado_extraccion" NOT NULL,
    "descuento_monto" DECIMAL(18,6),
    "descuento_monto_estado" "estado_extraccion" NOT NULL,
    "recargo_porcentaje" DECIMAL(7,4),
    "recargo_porcentaje_estado" "estado_extraccion" NOT NULL,
    "recargo_monto" DECIMAL(18,6),
    "recargo_monto_estado" "estado_extraccion" NOT NULL,
    "total_linea" DECIMAL(18,6),
    "total_linea_estado" "estado_extraccion" NOT NULL,
    "metadata" JSONB,

    CONSTRAINT "detalle_extraccion_pkey" PRIMARY KEY ("id_detalle")
);

-- CreateTable
CREATE TABLE "ajuste_global_extraccion" (
    "id_ajuste" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_resultado" UUID NOT NULL,
    "numero_ajuste" INTEGER NOT NULL,
    "tipo" "tipo_ajuste" NOT NULL,
    "modalidad" "modalidad_ajuste" NOT NULL,
    "valor" DECIMAL(18,6),
    "valor_estado" "estado_extraccion" NOT NULL,
    "descripcion" TEXT,
    "descripcion_estado" "estado_extraccion" NOT NULL,

    CONSTRAINT "ajuste_global_extraccion_pkey" PRIMARY KEY ("id_ajuste")
);

-- CreateTable
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
    "neto" DECIMAL(18,6),
    "iva" DECIMAL(18,6),
    "exento" DECIMAL(18,6),
    "total" DECIMAL(18,6),
    "medio_pago" VARCHAR(40),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmed_at" TIMESTAMPTZ(6),

    CONSTRAINT "revision_documento_pkey" PRIMARY KEY ("id_revision")
);

-- CreateTable
CREATE TABLE "detalle_revision" (
    "id_detalle_revision" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_revision" UUID NOT NULL,
    "id_detalle_extraccion" UUID,
    "numero_linea" INTEGER NOT NULL,
    "descripcion" TEXT,
    "cantidad" DECIMAL(18,6),
    "unidad" VARCHAR(40),
    "precio_unitario" DECIMAL(18,6),
    "descuento_porcentaje" DECIMAL(7,4),
    "descuento_monto" DECIMAL(18,6),
    "recargo_porcentaje" DECIMAL(7,4),
    "recargo_monto" DECIMAL(18,6),
    "total_linea" DECIMAL(18,6),

    CONSTRAINT "detalle_revision_pkey" PRIMARY KEY ("id_detalle_revision")
);

-- CreateTable
CREATE TABLE "ajuste_global_revision" (
    "id_ajuste_revision" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_revision" UUID NOT NULL,
    "numero_ajuste" INTEGER NOT NULL,
    "tipo" "tipo_ajuste" NOT NULL,
    "modalidad" "modalidad_ajuste" NOT NULL,
    "valor" DECIMAL(18,6),
    "descripcion" TEXT,

    CONSTRAINT "ajuste_global_revision_pkey" PRIMARY KEY ("id_ajuste_revision")
);

-- CreateTable
CREATE TABLE "conversacion_chat" (
    "id_conversacion" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_empresa" UUID NOT NULL,
    "id_notebook" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "titulo" VARCHAR(120) NOT NULL DEFAULT 'Nueva conversación',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversacion_chat_pkey" PRIMARY KEY ("id_conversacion")
);

-- CreateTable
CREATE TABLE "mensaje_chat" (
    "id_mensaje" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_conversacion" UUID NOT NULL,
    "rol" "rol_mensaje_chat" NOT NULL,
    "contenido" TEXT NOT NULL,
    "sql_generado" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensaje_chat_pkey" PRIMARY KEY ("id_mensaje")
);

-- CreateIndex
CREATE UNIQUE INDEX "uq_empresa_rut" ON "empresa"("rut_empresa");

-- CreateIndex
CREATE UNIQUE INDEX "uq_usuario_empresa" ON "usuario"("id_empresa");

-- CreateIndex
CREATE UNIQUE INDEX "uq_usuario_rut" ON "usuario"("rut_usuario");

-- CreateIndex
CREATE INDEX "idx_usuario_estado" ON "usuario"("estado");

-- CreateIndex
CREATE INDEX "idx_solicitud_estado_fecha" ON "solicitud_cuenta"("estado", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "uq_sesion_token_hash" ON "sesion_usuario"("token_hash");

-- CreateIndex
CREATE INDEX "idx_sesion_usuario" ON "sesion_usuario"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "uq_token_hash" ON "token_seguridad"("token_hash");

-- CreateIndex
CREATE INDEX "idx_token_usuario_tipo" ON "token_seguridad"("id_usuario", "tipo");

-- CreateIndex
CREATE INDEX "idx_evento_usuario_fecha" ON "evento_seguridad"("id_usuario", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_evento_identificador_fecha" ON "evento_seguridad"("identificador", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_notebook_empresa" ON "notebook"("id_empresa");

-- CreateIndex
CREATE INDEX "idx_notebook_creador" ON "notebook"("creado_por");

-- CreateIndex
CREATE UNIQUE INDEX "uq_notebook_empresa_id" ON "notebook"("id_empresa", "id_notebook");

-- CreateIndex
CREATE INDEX "idx_lote_empresa_fecha" ON "lote_procesamiento"("id_empresa", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_lote_notebook_fecha" ON "lote_procesamiento"("id_notebook", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "uq_lote_empresa_id" ON "lote_procesamiento"("id_empresa", "id_lote");

-- CreateIndex
CREATE INDEX "idx_documento_empresa_estado" ON "documento"("id_empresa", "estado");

-- CreateIndex
CREATE INDEX "idx_documento_notebook_estado" ON "documento"("id_notebook", "estado");

-- CreateIndex
CREATE INDEX "idx_documento_lote_estado" ON "documento"("id_lote", "estado");

-- CreateIndex
CREATE UNIQUE INDEX "uq_documento_lote_posicion" ON "documento"("id_lote", "posicion_lote");

-- CreateIndex
CREATE UNIQUE INDEX "uq_archivo_documento" ON "archivo_pdf"("id_documento");

-- CreateIndex
CREATE INDEX "idx_archivo_hash" ON "archivo_pdf"("hash_archivo");

-- CreateIndex
CREATE UNIQUE INDEX "uq_archivo_storage_key" ON "archivo_pdf"("storage_key");

-- CreateIndex
CREATE INDEX "idx_intento_documento_fecha" ON "intento_procesamiento"("id_documento", "inicio_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "uq_intento_documento_numero" ON "intento_procesamiento"("id_documento", "numero_intento");

-- CreateIndex
CREATE UNIQUE INDEX "uq_resultado_intento" ON "resultado_extraccion"("id_intento");

-- CreateIndex
CREATE INDEX "idx_resultado_documento" ON "resultado_extraccion"("id_documento");

-- CreateIndex
CREATE INDEX "idx_detalle_resultado" ON "detalle_extraccion"("id_resultado");

-- CreateIndex
CREATE UNIQUE INDEX "uq_detalle_resultado_linea" ON "detalle_extraccion"("id_resultado", "numero_linea");

-- CreateIndex
CREATE INDEX "idx_ajuste_resultado" ON "ajuste_global_extraccion"("id_resultado");

-- CreateIndex
CREATE UNIQUE INDEX "uq_ajuste_resultado_numero" ON "ajuste_global_extraccion"("id_resultado", "numero_ajuste");

-- CreateIndex
CREATE INDEX "idx_revision_documento_fecha" ON "revision_documento"("id_documento", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_revision_revisor" ON "revision_documento"("revisado_por");

-- CreateIndex
CREATE INDEX "idx_detalle_revision" ON "detalle_revision"("id_revision");

-- CreateIndex
CREATE UNIQUE INDEX "uq_detalle_revision_linea" ON "detalle_revision"("id_revision", "numero_linea");

-- CreateIndex
CREATE INDEX "idx_ajuste_revision" ON "ajuste_global_revision"("id_revision");

-- CreateIndex
CREATE UNIQUE INDEX "uq_ajuste_revision_numero" ON "ajuste_global_revision"("id_revision", "numero_ajuste");

-- CreateIndex
CREATE INDEX "idx_conversacion_chat_usuario_fecha" ON "conversacion_chat"("id_empresa", "id_notebook", "id_usuario", "updated_at" DESC);

-- CreateIndex
CREATE INDEX "idx_mensaje_chat_conversacion_fecha" ON "mensaje_chat"("id_conversacion", "created_at");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "fk_usuario_empresa" FOREIGN KEY ("id_empresa") REFERENCES "empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitud_cuenta" ADD CONSTRAINT "fk_solicitud_revisor" FOREIGN KEY ("revisada_por") REFERENCES "usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesion_usuario" ADD CONSTRAINT "fk_sesion_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token_seguridad" ADD CONSTRAINT "fk_token_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento_seguridad" ADD CONSTRAINT "fk_evento_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notebook" ADD CONSTRAINT "fk_notebook_empresa" FOREIGN KEY ("id_empresa") REFERENCES "empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notebook" ADD CONSTRAINT "fk_notebook_creador" FOREIGN KEY ("creado_por") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lote_procesamiento" ADD CONSTRAINT "fk_lote_empresa" FOREIGN KEY ("id_empresa") REFERENCES "empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lote_procesamiento" ADD CONSTRAINT "fk_lote_empresa_notebook" FOREIGN KEY ("id_empresa", "id_notebook") REFERENCES "notebook"("id_empresa", "id_notebook") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lote_procesamiento" ADD CONSTRAINT "fk_lote_creador" FOREIGN KEY ("creado_por") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento" ADD CONSTRAINT "fk_documento_empresa" FOREIGN KEY ("id_empresa") REFERENCES "empresa"("id_empresa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento" ADD CONSTRAINT "fk_documento_empresa_notebook" FOREIGN KEY ("id_empresa", "id_notebook") REFERENCES "notebook"("id_empresa", "id_notebook") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento" ADD CONSTRAINT "fk_documento_empresa_lote" FOREIGN KEY ("id_empresa", "id_lote") REFERENCES "lote_procesamiento"("id_empresa", "id_lote") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento" ADD CONSTRAINT "fk_documento_cargador" FOREIGN KEY ("cargado_por") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archivo_pdf" ADD CONSTRAINT "fk_archivo_documento" FOREIGN KEY ("id_documento") REFERENCES "documento"("id_documento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intento_procesamiento" ADD CONSTRAINT "fk_intento_documento" FOREIGN KEY ("id_documento") REFERENCES "documento"("id_documento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultado_extraccion" ADD CONSTRAINT "fk_resultado_documento" FOREIGN KEY ("id_documento") REFERENCES "documento"("id_documento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultado_extraccion" ADD CONSTRAINT "fk_resultado_intento" FOREIGN KEY ("id_intento") REFERENCES "intento_procesamiento"("id_intento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_extraccion" ADD CONSTRAINT "fk_detalle_resultado" FOREIGN KEY ("id_resultado") REFERENCES "resultado_extraccion"("id_resultado") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ajuste_global_extraccion" ADD CONSTRAINT "fk_ajuste_resultado" FOREIGN KEY ("id_resultado") REFERENCES "resultado_extraccion"("id_resultado") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revision_documento" ADD CONSTRAINT "fk_revision_documento" FOREIGN KEY ("id_documento") REFERENCES "documento"("id_documento") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revision_documento" ADD CONSTRAINT "fk_revision_resultado" FOREIGN KEY ("id_resultado") REFERENCES "resultado_extraccion"("id_resultado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revision_documento" ADD CONSTRAINT "fk_revision_revisor" FOREIGN KEY ("revisado_por") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_revision" ADD CONSTRAINT "fk_detalle_revision" FOREIGN KEY ("id_revision") REFERENCES "revision_documento"("id_revision") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_revision" ADD CONSTRAINT "fk_detalle_revision_extraccion" FOREIGN KEY ("id_detalle_extraccion") REFERENCES "detalle_extraccion"("id_detalle") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ajuste_global_revision" ADD CONSTRAINT "fk_ajuste_revision" FOREIGN KEY ("id_revision") REFERENCES "revision_documento"("id_revision") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversacion_chat" ADD CONSTRAINT "fk_conversacion_chat_empresa_notebook" FOREIGN KEY ("id_empresa", "id_notebook") REFERENCES "notebook"("id_empresa", "id_notebook") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversacion_chat" ADD CONSTRAINT "fk_conversacion_chat_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensaje_chat" ADD CONSTRAINT "fk_mensaje_chat_conversacion" FOREIGN KEY ("id_conversacion") REFERENCES "conversacion_chat"("id_conversacion") ON DELETE CASCADE ON UPDATE CASCADE;

