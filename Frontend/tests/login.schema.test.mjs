import test from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";

// Copia o prueba directa de las mismas reglas de validación Zod
const emailInputSchema = z
  .string()
  .transform((val) => val.trim())
  .pipe(
    z
      .string()
      .min(1, "El correo electrónico es obligatorio.")
      .max(100, "El correo electrónico no puede superar los 100 caracteres.")
      .email("Debe tener formato de correo válido.")
      .transform((val) => val.toLowerCase())
  );

const passwordInputSchema = z
  .string()
  .min(1, "La contraseña es obligatoria.");

const loginSchema = z.object({
  correo: emailInputSchema,
  password: passwordInputSchema,
  recordarSesion: z.boolean().default(false),
});

test("correo: debe fallar si está vacío o solo contiene espacios", () => {
  assert.equal(emailInputSchema.safeParse("").success, false);
  assert.equal(emailInputSchema.safeParse("   ").success, false);
});

test("correo: debe fallar si no tiene formato de correo válido", () => {
  const result = emailInputSchema.safeParse("correo-invalido");
  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(result.error.issues[0].message, "Debe tener formato de correo válido.");
  }
});

test("correo: debe fallar si supera los 100 caracteres", () => {
  const largo = "a".repeat(95) + "@test.com";
  assert.ok(largo.length > 100);
  const result = emailInputSchema.safeParse(largo);
  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(result.error.issues[0].message, "El correo electrónico no puede superar los 100 caracteres.");
  }
});

test("correo: debe aplicar trim y convertir a minúsculas", () => {
  const result = emailInputSchema.safeParse("   Usuario.Prueba@Dominio.COM   ");
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data, "usuario.prueba@dominio.com");
  }
});

test("contraseña: debe ser obligatoria", () => {
  assert.equal(passwordInputSchema.safeParse("").success, false);
});

test("contraseña: debe preservar mayúsculas, minúsculas, espacios y símbolos sin alteraciones", () => {
  const rawPass = "  P@ssw0rd!_123  ";
  const result = passwordInputSchema.safeParse(rawPass);
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data, rawPass);
  }
});

test("loginSchema: parsea datos válidos y aplica valor por defecto a recordarSesion", () => {
  const parsed = loginSchema.parse({
    correo: "  TEST@EMPRESA.CL  ",
    password: "ClaveSecreta#2024",
  });
  assert.equal(parsed.correo, "test@empresa.cl");
  assert.equal(parsed.password, "ClaveSecreta#2024");
  assert.equal(parsed.recordarSesion, false);
});
