CREATE TABLE "conversacion_chat" (
    "id_conversacion" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_empresa" UUID NOT NULL,
    "id_notebook" UUID NOT NULL,
    "id_usuario" UUID NOT NULL,
    "titulo" VARCHAR(120) NOT NULL DEFAULT 'Nueva conversación',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "conversacion_chat_pkey" PRIMARY KEY ("id_conversacion"),
    CONSTRAINT "fk_conversacion_chat_empresa_notebook" FOREIGN KEY ("id_empresa", "id_notebook") REFERENCES "notebook"("id_empresa", "id_notebook") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk_conversacion_chat_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "idx_conversacion_chat_usuario_fecha" ON "conversacion_chat" ("id_empresa", "id_notebook", "id_usuario", "updated_at" DESC);
CREATE TRIGGER "trg_conversacion_chat_updated_at"
BEFORE UPDATE ON "conversacion_chat"
FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();

-- Conserva el historial existente agrupándolo en una conversación por usuario y notebook.
INSERT INTO "conversacion_chat" ("id_empresa", "id_notebook", "id_usuario", "titulo", "created_at", "updated_at")
SELECT "id_empresa", "id_notebook", "id_usuario", 'Conversación anterior', MIN("created_at"), MAX("created_at")
FROM "mensaje_chat"
GROUP BY "id_empresa", "id_notebook", "id_usuario";

ALTER TABLE "mensaje_chat" ADD COLUMN "id_conversacion" UUID;
UPDATE "mensaje_chat" AS m
SET "id_conversacion" = c."id_conversacion"
FROM "conversacion_chat" AS c
WHERE c."id_empresa" = m."id_empresa"
  AND c."id_notebook" = m."id_notebook"
  AND c."id_usuario" = m."id_usuario";

ALTER TABLE "mensaje_chat" ALTER COLUMN "id_conversacion" SET NOT NULL;
ALTER TABLE "mensaje_chat"
    ADD CONSTRAINT "fk_mensaje_chat_conversacion"
    FOREIGN KEY ("id_conversacion") REFERENCES "conversacion_chat"("id_conversacion")
    ON DELETE CASCADE ON UPDATE CASCADE;

DROP INDEX "idx_mensaje_chat_notebook_usuario_fecha";
ALTER TABLE "mensaje_chat"
    DROP CONSTRAINT "fk_mensaje_chat_empresa_notebook",
    DROP CONSTRAINT "fk_mensaje_chat_usuario",
    DROP COLUMN "id_empresa",
    DROP COLUMN "id_notebook",
    DROP COLUMN "id_usuario";

CREATE INDEX "idx_mensaje_chat_conversacion_fecha" ON "mensaje_chat" ("id_conversacion", "created_at");
