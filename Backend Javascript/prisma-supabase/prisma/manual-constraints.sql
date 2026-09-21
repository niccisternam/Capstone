-- Agregar al final de la migracion inicial generada por Prisma.
-- Estas reglas existen en el SQL original, pero Prisma Schema no las representa
-- completamente sin SQL personalizado.

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
