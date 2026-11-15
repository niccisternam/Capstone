-- Dashboard: configuración de widgets por notebook. Los datos no se guardan:
-- se recalculan al consultar los documentos confirmados.

CREATE TABLE "dashboard_widget" (
    "id_widget" UUID NOT NULL DEFAULT gen_random_uuid(),
    "id_empresa" UUID NOT NULL,
    "id_notebook" UUID NOT NULL,
    "creado_por" UUID NOT NULL,
    "titulo" VARCHAR(150) NOT NULL,
    "metrica" VARCHAR(40) NOT NULL,
    "filtros" JSONB NOT NULL DEFAULT '{}'::jsonb,
    "visualizacion" VARCHAR(20) NOT NULL DEFAULT 'bar',
    "orden" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "dashboard_widget_pkey" PRIMARY KEY ("id_widget"),
    CONSTRAINT "ck_widget_titulo" CHECK (NULLIF(BTRIM("titulo"), '') IS NOT NULL),
    CONSTRAINT "ck_widget_filtros_objeto" CHECK (jsonb_typeof("filtros") = 'object'),
    CONSTRAINT "fk_widget_empresa" FOREIGN KEY ("id_empresa") REFERENCES "empresa"("id_empresa") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk_widget_empresa_notebook" FOREIGN KEY ("id_empresa", "id_notebook") REFERENCES "notebook"("id_empresa", "id_notebook") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk_widget_creador" FOREIGN KEY ("creado_por") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "idx_widget_empresa_notebook" ON "dashboard_widget" ("id_empresa", "id_notebook", "orden");

CREATE TRIGGER trg_widget_updated_at
BEFORE UPDATE ON "dashboard_widget"
FOR EACH ROW EXECUTE FUNCTION actualizar_updated_at();
