-- Módulo 4: chat financiero (Text-to-SQL de solo lectura).

-- Dirección del documento respecto de la empresa. Hoy todo es COMPRA; deja abierta la puerta a VENTA.
CREATE TYPE "direccion_documento" AS ENUM ('COMPRA', 'VENTA');
ALTER TABLE "documento" ADD COLUMN "direccion" "direccion_documento" NOT NULL DEFAULT 'COMPRA';

CREATE TYPE "rol_mensaje_chat" AS ENUM ('USUARIO', 'ASISTENTE');

CREATE TABLE "mensaje_chat" (
    "id_mensaje" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_empresa" UUID NOT NULL,
    "id_notebook" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "rol" "rol_mensaje_chat" NOT NULL,
    "contenido" TEXT NOT NULL,
    "sql_generado" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "mensaje_chat_pkey" PRIMARY KEY ("id_mensaje"),
    CONSTRAINT "fk_mensaje_chat_empresa_notebook" FOREIGN KEY ("id_empresa", "id_notebook") REFERENCES "notebook"("id_empresa", "id_notebook") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk_mensaje_chat_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "idx_mensaje_chat_notebook_usuario_fecha" ON "mensaje_chat" ("id_notebook", "id_usuario", "created_at");

-- Vistas que ve la IA: solo documentos CONFIRMADOS con su revisión confirmada,
-- filtrados por la empresa y el notebook fijados por el backend en la transacción.
CREATE VIEW "v_chat_documentos" AS
SELECT
    d."id_documento", d."direccion", r."tipo_documento", r."folio", r."fecha_emision",
    r."emisor_rut", r."emisor_razon_social", r."receptor_rut", r."receptor_nombre",
    r."condicion_tributaria", r."neto", r."iva", r."exento", r."total",
    r."medio_pago", r."estado_pago", r."observacion"
FROM "documento" d
JOIN "revision_documento" r ON r."id_documento" = d."id_documento" AND r."estado" = 'CONFIRMADA'
WHERE d."estado" = 'CONFIRMADO'
  AND d."id_empresa" = NULLIF(current_setting('app.id_empresa', true), '')::uuid
  AND d."id_notebook" = NULLIF(current_setting('app.id_notebook', true), '')::uuid;

CREATE VIEW "v_chat_detalles" AS
SELECT
    v."id_documento", l."numero_linea", l."descripcion", l."cantidad", l."unidad",
    l."precio_unitario", l."total_linea"
FROM "v_chat_documentos" v
JOIN "revision_documento" r ON r."id_documento" = v."id_documento" AND r."estado" = 'CONFIRMADA'
JOIN "detalle_revision" l ON l."id_revision" = r."id_revision";

-- Rol sin login que solo puede leer las dos vistas; el backend lo asume con SET LOCAL ROLE.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'chat_lector') THEN
        CREATE ROLE chat_lector NOLOGIN;
    END IF;
END
$$;
GRANT chat_lector TO CURRENT_USER;
GRANT USAGE ON SCHEMA public TO chat_lector;
GRANT SELECT ON "v_chat_documentos", "v_chat_detalles" TO chat_lector;
