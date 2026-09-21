import test from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";

function cleanNumericCode(raw) {
  return raw.replace(/\D/g, "").slice(0, 6);
}

const twoFactorCodeSchema = z
  .string()
  .min(1, "El código es obligatorio.")
  .length(6, "Debe contener exactamente 6 dígitos.")
  .regex(/^\d{6}$/, "Solo puede contener números del 0 al 9.");

test("cleanNumericCode: extrae solo dígitos y trunca a 6", () => {
  assert.equal(cleanNumericCode("123456"), "123456");
  assert.equal(cleanNumericCode("  01-23.45  "), "012345");
  assert.equal(cleanNumericCode("a1b2c3d4e5f6g7"), "123456");
  assert.equal(cleanNumericCode("000123"), "000123");
  assert.equal(cleanNumericCode("!@#$%^"), "");
});

test("twoFactorCodeSchema: conserva ceros iniciales como texto", () => {
  const result = twoFactorCodeSchema.safeParse("001234");
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data, "001234");
    assert.equal(typeof result.data, "string");
  }
});

test("twoFactorCodeSchema: debe fallar si está vacío", () => {
  const result = twoFactorCodeSchema.safeParse("");
  assert.equal(result.success, false);
});

test("twoFactorCodeSchema: debe fallar si tiene menos o más de 6 dígitos", () => {
  assert.equal(twoFactorCodeSchema.safeParse("12345").success, false);
  assert.equal(twoFactorCodeSchema.safeParse("1234567").success, false);
});

test("twoFactorCodeSchema: debe fallar si contiene letras, espacios o símbolos", () => {
  assert.equal(twoFactorCodeSchema.safeParse("12345a").success, false);
  assert.equal(twoFactorCodeSchema.safeParse("12 345").success, false);
  assert.equal(twoFactorCodeSchema.safeParse("12-345").success, false);
  assert.equal(twoFactorCodeSchema.safeParse("12.345").success, false);
});

function parseJwtPayload(token) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

test("parseJwtPayload: extrae correctamente rol ADMINISTRADOR para redirección", () => {
  // Payload simulado de JWT emitido por Express para admin
  const mockAdminPayload = Buffer.from(
    JSON.stringify({ rol: "ADMINISTRADOR", scope: "access", sub: "admin-uuid" })
  ).toString("base64url");
  const mockToken = `eyJhbGciOiJIUzI1NiJ9.${mockAdminPayload}.signature`;

  const parsed = parseJwtPayload(mockToken);
  assert.equal(parsed?.rol, "ADMINISTRADOR");
  assert.equal(parsed?.sub, "admin-uuid");
});

test("parseJwtPayload: extrae correctamente rol USUARIO para usuario común", () => {
  const mockUserPayload = Buffer.from(
    JSON.stringify({ rol: "USUARIO", scope: "access", sub: "user-uuid" })
  ).toString("base64url");
  const mockToken = `eyJhbGciOiJIUzI1NiJ9.${mockUserPayload}.signature`;

  const parsed = parseJwtPayload(mockToken);
  assert.equal(parsed?.rol, "USUARIO");
  assert.notEqual(parsed?.rol, "ADMINISTRADOR");
});

