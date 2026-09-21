import test from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";

const resetPasswordFieldsSchema = z
  .object({
    nuevaPassword: z
      .string()
      .min(12, "La contraseña debe tener al menos 12 caracteres.")
      .max(200, "La contraseña no puede superar los 200 caracteres.")
      .regex(/[a-z]/, "Debe incluir al menos una letra minúscula.")
      .regex(/[A-Z]/, "Debe incluir al menos una letra mayúscula.")
      .regex(/\d/, "Debe incluir al menos un número.")
      .regex(/[^A-Za-z0-9]/, "Debe incluir al menos un símbolo o carácter especial."),
    confirmarPassword: z.string().min(1, "Debe confirmar su nueva contraseña."),
  })
  .refine((data) => data.nuevaPassword === data.confirmarPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmarPassword"],
  });

test("resetPasswordFieldsSchema: debe fallar si tiene menos de 12 o más de 200 caracteres", () => {
  assert.equal(
    resetPasswordFieldsSchema.safeParse({
      nuevaPassword: "Pass1!",
      confirmarPassword: "Pass1!",
    }).success,
    false
  );

  const masDe200 = "P@ss1" + "a".repeat(200);
  assert.equal(
    resetPasswordFieldsSchema.safeParse({
      nuevaPassword: masDe200,
      confirmarPassword: masDe200,
    }).success,
    false
  );
});

test("resetPasswordFieldsSchema: debe fallar si falta mayúscula, minúscula, número o símbolo", () => {
  assert.equal(
    resetPasswordFieldsSchema.safeParse({
      nuevaPassword: "password1234!",
      confirmarPassword: "password1234!",
    }).success,
    false
  );
  assert.equal(
    resetPasswordFieldsSchema.safeParse({
      nuevaPassword: "PASSWORD1234!",
      confirmarPassword: "PASSWORD1234!",
    }).success,
    false
  );
  assert.equal(
    resetPasswordFieldsSchema.safeParse({
      nuevaPassword: "PasswordSinNumero!",
      confirmarPassword: "PasswordSinNumero!",
    }).success,
    false
  );
  assert.equal(
    resetPasswordFieldsSchema.safeParse({
      nuevaPassword: "PasswordSinSimbolo123",
      confirmarPassword: "PasswordSinSimbolo123",
    }).success,
    false
  );
});

test("resetPasswordFieldsSchema: no debe aplicar trim a las contraseñas", () => {
  const passConEspacios = "  P@ssw0rd123456  ";
  const result = resetPasswordFieldsSchema.safeParse({
    nuevaPassword: passConEspacios,
    confirmarPassword: passConEspacios,
  });
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.nuevaPassword, passConEspacios);
  }
});

test("resetPasswordFieldsSchema: debe fallar si no coinciden", () => {
  const result = resetPasswordFieldsSchema.safeParse({
    nuevaPassword: "P@ssword123456",
    confirmarPassword: "P@ssword999999",
  });
  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(result.error.issues[0].message, "Las contraseñas no coinciden.");
  }
});
