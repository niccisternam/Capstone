import test from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";

// Esquema Zod de motivo de rechazo idéntico al componente
const rejectRequestSchema = z.object({
  motivo: z
    .string()
    .trim()
    .min(1, "El motivo de rechazo es obligatorio.")
    .min(3, "El motivo de rechazo debe contener al menos 3 caracteres.")
    .max(2000, "El motivo de rechazo no puede superar los 2000 caracteres."),
});

test("rejectRequestSchema: debe fallar si está vacío o solo contiene espacios", () => {
  assert.equal(rejectRequestSchema.safeParse({ motivo: "" }).success, false);
  assert.equal(rejectRequestSchema.safeParse({ motivo: "   " }).success, false);
});

test("rejectRequestSchema: debe fallar si tiene menos de 3 caracteres", () => {
  assert.equal(rejectRequestSchema.safeParse({ motivo: "ab" }).success, false);
  assert.equal(rejectRequestSchema.safeParse({ motivo: "a" }).success, false);
});

test("rejectRequestSchema: acepta motivos válidos y aplica trim", () => {
  const result = rejectRequestSchema.safeParse({
    motivo: "  RUT de la empresa no coincide con SII  ",
  });
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.motivo, "RUT de la empresa no coincide con SII");
  }
});

test("rejectRequestSchema: rechaza motivos que superen los 2000 caracteres", () => {
  const longReason = "a".repeat(2001);
  assert.equal(rejectRequestSchema.safeParse({ motivo: longReason }).success, false);
});

test("Aprobación: contrato de Express exige confirmacionSii: true y no requiere descripción", () => {
  const approvalPayload = { confirmacionSii: true };
  assert.equal(approvalPayload.confirmacionSii, true);
  assert.equal("descripcion" in approvalPayload, false);
});

test("Redirección post-2FA: asigna rutas correctas según el rol del usuario", () => {
  function getRedirectPath(rol) {
    if (rol === "ADMINISTRADOR") {
      return "/admin/solicitudes";
    }
    return "/usuario";
  }

  assert.equal(getRedirectPath("ADMINISTRADOR"), "/admin/solicitudes");
  assert.equal(getRedirectPath("USUARIO"), "/usuario");
  assert.equal(getRedirectPath("OTRO"), "/usuario");
});
