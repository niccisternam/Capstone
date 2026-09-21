-- Existing requests are retained, so the column remains nullable for legacy rows.
-- The API requires it for every new account request.
ALTER TABLE "solicitud_cuenta"
ADD COLUMN IF NOT EXISTS "razon_social" VARCHAR(200);
