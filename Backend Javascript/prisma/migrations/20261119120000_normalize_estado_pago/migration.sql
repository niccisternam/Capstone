-- Catálogo cerrado de estado de pago: solo 'PENDIENTE' y 'PAGADO'.

-- 1) Normalizar los valores existentes: quitar espacios y pasar a mayúsculas.
UPDATE "revision_documento"
SET "estado_pago" = upper(btrim("estado_pago"))
WHERE "estado_pago" IS NOT NULL;

-- 2) Solo las revisiones confirmadas tienen estado de pago. Cualquier valor distinto
--    de 'PAGADO' (incluido el vacío) pasa a 'PENDIENTE'; las revisiones no confirmadas quedan en NULL.
UPDATE "revision_documento"
SET "estado_pago" = CASE
    WHEN "estado" <> 'CONFIRMADA' THEN NULL
    WHEN "estado_pago" = 'PAGADO' THEN 'PAGADO'
    ELSE 'PENDIENTE'
END;

-- 3) Restricción de base de datos: solo se aceptan los dos valores del catálogo.
ALTER TABLE "revision_documento"
    ADD CONSTRAINT "ck_revision_estado_pago"
    CHECK ("estado_pago" IS NULL OR "estado_pago" IN ('PENDIENTE', 'PAGADO'));
