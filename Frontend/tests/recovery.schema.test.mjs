import test from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";

const recoverySchema = z.object({
  correo: z
    .string()
    .transform((val) => val.trim())
    .pipe(
      z
        .string()
        .min(1, "El correo electrónico es obligatorio.")
        .max(320, "El correo electrónico no puede superar los 320 caracteres.")
        .email("Debe tener formato de correo válido.")
        .transform((val) => val.toLowerCase())
    ),
});

test("recoverySchema: debe fallar si está vacío o solo contiene espacios", () => {
  assert.equal(recoverySchema.safeParse({ correo: "" }).success, false);
  assert.equal(recoverySchema.safeParse({ correo: "   " }).success, false);
});

test("recoverySchema: debe fallar si no es un correo válido", () => {
  const result = recoverySchema.safeParse({ correo: "correo-invalido" });
  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(result.error.issues[0].message, "Debe tener formato de correo válido.");
  }
});

test("recoverySchema: debe fallar si supera los 320 caracteres", () => {
  const largo = "a".repeat(315) + "@test.com";
  assert.ok(largo.length > 320);
  const result = recoverySchema.safeParse({ correo: largo });
  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(result.error.issues[0].message, "El correo electrónico no puede superar los 320 caracteres.");
  }
});

test("recoverySchema: normaliza correo con trim y minúsculas", () => {
  const result = recoverySchema.safeParse({ correo: "  Carlos.Soto@Panaderia.CL  " });
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.correo, "carlos.soto@panaderia.cl");
  }
});
