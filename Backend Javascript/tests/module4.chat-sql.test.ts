import { describe, expect, it } from "vitest";
import { validarConsultaChat } from "../src/modules/module4/chat.sql.js";

describe("Módulo 4 - validación del SQL generado por IA", () => {
  it.each([
    "SELECT SUM(total) AS total_gastado FROM v_chat_documentos WHERE direccion = 'COMPRA'",
    "  with p AS (SELECT emisor_razon_social, total FROM v_chat_documentos) SELECT * FROM p",
    "SELECT d.folio FROM v_chat_detalles l JOIN v_chat_documentos d USING (id_documento) WHERE l.descripcion ILIKE '%carne%'",
    "SELECT date_trunc('month', fecha_emision) AS mes, ROUND(SUM(total)) AS total FROM v_chat_documentos WHERE estado_pago IN ('PENDIENTE') GROUP BY 1",
    "SELECT COUNT(*) AS cantidad FROM v_chat_documentos WHERE observacion ILIKE '%query_to_xml(%' AND folio = 'O''Higgins'",
  ])("acepta consultas de lectura: %s", (sql) => {
    expect(validarConsultaChat(sql)).toBe(sql.trim());
  });

  it.each([
    "DELETE FROM documento",
    "UPDATE documento SET estado = 'ERROR'",
    "SELECT 1; DROP TABLE documento",
    "SELECT 1 -- comentario",
    "SELECT 1 /* oculto */",
    "SELECT set_config('app.id_notebook', 'otro', true), * FROM v_chat_documentos",
    "SELECT SET_CONFIG('role', 'postgres', true)",
    "SELECT * FROM \"usuario\"",
    "SELECT * FROM pg_catalog.pg_tables",
    "SELECT pg_sleep(30)",
    "SELECT * FROM information_schema.tables",
    "SELECT query_to_xml('select set_' || 'config(''app.id_empresa'', ''x'', true)', true, false, '')",
    "SELECT ts_stat('select 1')",
    "SELECT public.dblink('host=x', 'select 1')",
    "SELECT * FROM v_chat_documentos WHERE folio = E'\\''",
    "SELECT $$x$$ AS texto",
    "",
  ])("rechaza consultas peligrosas: %s", (sql) => {
    expect(() => validarConsultaChat(sql)).toThrow(expect.objectContaining({ code: "CHAT_QUERY_REJECTED" }));
  });
});
