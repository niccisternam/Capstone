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

-- PostgreSQL rules that Prisma Schema cannot represent completely.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE UNIQUE INDEX uq_usuario_correo_lower
    ON usuario (LOWER(correo));

CREATE INDEX idx_usuario_bloqueado_hasta
    ON usuario (bloqueado_hasta)
    WHERE bloqueado_hasta IS NOT NULL;

CREATE UNIQUE INDEX uq_solicitud_pendiente_rut
    ON solicitud_cuenta (rut_usuario)
    WHERE estado = 'PENDIENTE';

CREATE UNIQUE INDEX uq_solicitud_pendiente_correo
    ON solicitud_cuenta (LOWER(correo))
    WHERE estado = 'PENDIENTE';

CREATE UNIQUE INDEX uq_solicitud_pendiente_empresa
    ON solicitud_cuenta (rut_empresa)
    WHERE estado = 'PENDIENTE';

CREATE INDEX idx_sesion_activa
    ON sesion_usuario (id_usuario, expires_at)
    WHERE revoked_at IS NULL;

CREATE INDEX idx_token_activo
    ON token_seguridad (id_usuario, tipo, expires_at)
    WHERE used_at IS NULL AND revoked_at IS NULL;

CREATE INDEX idx_evento_login_fallido
    ON evento_seguridad (created_at DESC)
    WHERE tipo_evento IN ('LOGIN_FALLIDO', 'CODIGO_INVALIDO');

ALTER TABLE usuario
    ADD CONSTRAINT ck_usuario_correo CHECK (correo LIKE '%_@_%.__%'),
    ADD CONSTRAINT ck_usuario_intentos CHECK (intentos_fallidos >= 0);

ALTER TABLE solicitud_cuenta
    ADD CONSTRAINT ck_solicitud_correo CHECK (correo LIKE '%_@_%.__%'),
    ADD CONSTRAINT ck_solicitud_revision CHECK (
        (estado = 'PENDIENTE' AND revisada_por IS NULL AND fecha_revision IS NULL)
        OR
        (estado IN ('APROBADA', 'RECHAZADA') AND revisada_por IS NOT NULL AND fecha_revision IS NOT NULL)
    ),
    ADD CONSTRAINT ck_solicitud_motivo_rechazo CHECK (
        (estado = 'RECHAZADA' AND NULLIF(BTRIM(motivo_rechazo), '') IS NOT NULL)
        OR
        (estado <> 'RECHAZADA' AND motivo_rechazo IS NULL)
    );

ALTER TABLE sesion_usuario
    ADD CONSTRAINT ck_sesion_expiracion CHECK (expires_at > created_at),
    ADD CONSTRAINT ck_sesion_revocacion CHECK (revoked_at IS NULL OR revoked_at >= created_at);

ALTER TABLE token_seguridad
    ADD CONSTRAINT ck_token_intentos CHECK (cantidad_intentos >= 0),
    ADD CONSTRAINT ck_token_expiracion CHECK (expires_at > created_at),
    ADD CONSTRAINT ck_token_recuperacion_15_minutos CHECK (
        tipo <> 'RECUPERACION_PASSWORD'
        OR expires_at <= created_at + INTERVAL '15 minutes'
    ),
    ADD CONSTRAINT ck_token_uso CHECK (used_at IS NULL OR used_at >= created_at),
    ADD CONSTRAINT ck_token_revocacion CHECK (revoked_at IS NULL OR revoked_at >= created_at);

CREATE OR REPLACE FUNCTION actualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_empresa_updated_at
BEFORE UPDATE ON empresa
FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trg_usuario_updated_at
BEFORE UPDATE ON usuario
FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trg_solicitud_updated_at
BEFORE UPDATE ON solicitud_cuenta
FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
