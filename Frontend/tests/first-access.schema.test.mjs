import test from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";

const newPasswordSchema = z
  .string()
  .min(12, "La contraseña debe tener al menos 12 caracteres.")
  .max(200, "La contraseña no puede superar los 200 caracteres.")
  .regex(/[a-z]/, "Debe incluir al menos una letra minúscula.")
  .regex(/[A-Z]/, "Debe incluir al menos una letra mayúscula.")
  .regex(/\d/, "Debe incluir al menos un número.")
  .regex(/[^A-Za-z0-9]/, "Debe incluir al menos un símbolo o carácter especial.");

const changeTemporaryPasswordFormSchema = z
  .object({
    nuevaPassword: newPasswordSchema,
    confirmarPassword: z.string().min(1, "Debe confirmar su nueva contraseña."),
  })
  .refine((data) => data.nuevaPassword === data.confirmarPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmarPassword"],
  });

test("newPasswordSchema: debe fallar si tiene menos de 12 caracteres", () => {
  assert.equal(newPasswordSchema.safeParse("Clave1!").success, false);
});

test("newPasswordSchema: debe fallar si falta mayúscula, minúscula, número o símbolo", () => {
  // Sin mayúscula
  assert.equal(newPasswordSchema.safeParse("password1234!").success, false);
  // Sin minúscula
  assert.equal(newPasswordSchema.safeParse("PASSWORD1234!").success, false);
  // Sin número
  assert.equal(newPasswordSchema.safeParse("PasswordSinNum!").success, false);
  // Sin símbolo
  assert.equal(newPasswordSchema.safeParse("PasswordCon1234").success, false);
});

test("newPasswordSchema: acepta contraseña robusta de 12 o más caracteres", () => {
  const result = newPasswordSchema.safeParse("Capstone2026!#Segura");
  assert.equal(result.success, true);
});

test("changeTemporaryPasswordFormSchema: falla si las contraseñas no coinciden", () => {
  const result = changeTemporaryPasswordFormSchema.safeParse({
    nuevaPassword: "Capstone2026!#Segura",
    confirmarPassword: "Capstone2026!#Distinta",
  });
  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(result.error.issues[0].message, "Las contraseñas no coinciden.");
  }
});

test("changeTemporaryPasswordFormSchema: pasa con contraseñas coincidentes y robustas", () => {
  const result = changeTemporaryPasswordFormSchema.safeParse({
    nuevaPassword: "Capstone2026!#Segura",
    confirmarPassword: "Capstone2026!#Segura",
  });
  assert.equal(result.success, true);
});
