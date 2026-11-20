-- Se elimina la configuración de widgets del dashboard (funcionalidad descartada).
-- Los índices, claves foráneas, checks y el trigger de la tabla se eliminan con ella.
-- La función actualizar_updated_at() se conserva porque la usan otras tablas.

DROP TABLE IF EXISTS "dashboard_widget";
