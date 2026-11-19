import test from "node:test";
import assert from "node:assert/strict";
import { loadTsModule } from "./helpers/ts-module-loader.mjs";

const { messageForApiCode, normalizeErrorBody } = await loadTsModule(
  "src/api/api-error.ts",
);

test("ACCOUNT_BLOCKED comunica el tiempo de espera y la recuperación", () => {
  const error = normalizeErrorBody(423, {
    error: { code: "ACCOUNT_BLOCKED", message: "mensaje del servidor" },
  });

  assert.equal(error.code, "ACCOUNT_BLOCKED");
  assert.match(messageForApiCode(error.code), /15 minutos/);
  assert.match(messageForApiCode(error.code), /restablecerla/);
  assert.doesNotMatch(messageForApiCode(error.code), /mensaje del servidor/);
});
