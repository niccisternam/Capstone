import test from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";

function formatRutInput(value) {
  const cleaned = value.replace(/[^0-9kK]/g, "").toUpperCase().slice(0, 9);
  if (cleaned.length <= 1) return cleaned;
  return `${cleaned.slice(0, -1)}-${cleaned.slice(-1)}`;
}

function normalizeRut(value) {
  const cleaned = value.replace(/\./g, "").replace(/\s/g, "").toUpperCase();
  const withoutDash = cleaned.replace(/-/g, "");
  if (withoutDash.length < 2) return cleaned;
  return `${withoutDash.slice(0, -1)}-${withoutDash.slice(-1)}`;
}

function isValidChileanRut(value) {
  const normalized = normalizeRut(value);
  const match = /^(\d{7,8})-([0-9K])$/.exec(normalized);
  if (!match) return false;

  const body = match[1];
  const providedDigit = match[2];
  if (!body || !providedDigit) return false;

  let sum = 0;
  let multiplier = 2;
  for (let index = body.length - 1; index >= 0; index -= 1) {
    sum += Number(body[index]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const result = 11 - (sum % 11);
  const expectedDigit = result === 11 ? "0" : result === 10 ? "K" : String(result);
  return providedDigit === expectedDigit;
}

const rutEmpresaSchema = z
  .string()
  .trim()
  .min(1, "El RUT de la empresa es obligatorio")
  .refine(isValidChileanRut, "El RUT de la empresa no es válido");

const razonSocialSchema = z
  .string()
  .trim()
  .min(1, "La razón social es obligatoria")
  .min(2, "La razón social debe tener al menos 2 caracteres")
  .max(200, "La razón social no puede superar los 200 caracteres");

const rutUsuarioSchema = z
  .string()
  .trim()
  .min(1, "El RUT del solicitante es obligatorio")
  .refine(isValidChileanRut, "El RUT del solicitante no es válido");

const nombreSchema = z
  .string()
  .trim()
  .min(1, "El nombre es obligatorio")
  .min(2, "El nombre debe tener al menos 2 caracteres")
  .max(100, "El nombre no puede superar los 100 caracteres");

const apellidoSchema = z
  .string()
  .trim()
  .min(1, "El apellido es obligatorio")
  .min(2, "El apellido debe tener al menos 2 caracteres")
  .max(100, "El apellido no puede superar los 100 caracteres");

const correoSchema = z
  .string()
  .trim()
  .min(1, "El correo electrónico es obligatorio")
  .email("Debe tener formato de correo válido")
  .max(320, "El correo no puede superar los 320 caracteres")
  .transform((val) => val.toLowerCase());

const descripcionSchema = z
  .string()
  .trim()
  .max(2000, "La descripción no puede superar los 2000 caracteres")
  .optional()
  .transform((val) => (val && val.length > 0 ? val : undefined));

const createAccountRequestFormSchema = z.object({
  rutEmpresa: rutEmpresaSchema,
  razonSocial: razonSocialSchema,
  rutUsuario: rutUsuarioSchema,
  nombre: nombreSchema,
  apellido: apellidoSchema,
  correo: correoSchema,
  descripcion: descripcionSchema,
});

function validateAccountRequestField(field, value) {
  switch (field) {
    case "rutEmpresa": {
      const res = rutEmpresaSchema.safeParse(value);
      return res.success ? null : res.error.issues[0]?.message ?? "RUT de empresa inválido";
    }
    case "razonSocial": {
      const res = razonSocialSchema.safeParse(value);
      return res.success ? null : res.error.issues[0]?.message ?? "Razón social inválida";
    }
    case "rutUsuario": {
      const res = rutUsuarioSchema.safeParse(value);
      return res.success ? null : res.error.issues[0]?.message ?? "RUT de solicitante inválido";
    }
    case "nombre": {
      const res = nombreSchema.safeParse(value);
      return res.success ? null : res.error.issues[0]?.message ?? "Nombre inválido";
    }
    case "apellido": {
      const res = apellidoSchema.safeParse(value);
      return res.success ? null : res.error.issues[0]?.message ?? "Apellido inválido";
    }
    case "correo": {
      const res = correoSchema.safeParse(value);
      return res.success ? null : res.error.issues[0]?.message ?? "Correo inválido";
    }
    case "descripcion": {
      const res = descripcionSchema.safeParse(value);
      return res.success ? null : res.error.issues[0]?.message ?? "Descripción inválida";
    }
    default:
      return null;
  }
}

// Pruebas de autoformato de RUT
test("formatRutInput: agrega automáticamente el guion antes del dígito verificador", () => {
  assert.equal(formatRutInput("761234560"), "76123456-0");
  assert.equal(formatRutInput("123456785"), "12345678-5");
});

test("formatRutInput: limpia caracteres inválidos, espacios y puntos al escribir o pegar", () => {
  assert.equal(formatRutInput("76.123.456-0"), "76123456-0");
  assert.equal(formatRutInput(" 12.345.678 - 5 "), "12345678-5");
  assert.equal(formatRutInput("12345678k"), "12345678-K");
});

test("formatRutInput: conserva caracteres individuales y trunca a máximo 9 dígitos", () => {
  assert.equal(formatRutInput("7"), "7");
  assert.equal(formatRutInput(""), "");
  assert.equal(formatRutInput("76123456099999"), "76123456-0");
});

// Pruebas del algoritmo oficial de validación de RUT
test("isValidChileanRut: valida correctamente RUTs de empresa y persona chilenos", () => {
  assert.equal(isValidChileanRut("76123456-0"), true);
  assert.equal(isValidChileanRut("12345678-5"), true);
  assert.equal(isValidChileanRut("11111111-1"), true);
});

test("isValidChileanRut: rechaza RUTs con dígito verificador incorrecto o formato inválido", () => {
  assert.equal(isValidChileanRut("76123456-9"), false);
  assert.equal(isValidChileanRut("12345678-0"), false);
  assert.equal(isValidChileanRut("invalido"), false);
  assert.equal(isValidChileanRut("123"), false);
});

test("createAccountRequestFormSchema: valida con éxito el ejemplo del usuario", () => {
  const exampleInput = {
    rutEmpresa: "76123456-0",
    razonSocial: "Panadería Ejemplo SpA",
    rutUsuario: "12345678-5",
    nombre: "Ana",
    apellido: "Pérez",
    correo: "ana@ejemplo.cl",
    descripcion: "Descripción opcional",
  };

  const result = createAccountRequestFormSchema.safeParse(exampleInput);
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.correo, "ana@ejemplo.cl");
    assert.equal(result.data.rutEmpresa, "76123456-0");
    assert.equal(result.data.razonSocial, "Panadería Ejemplo SpA");
  }
});

test("createAccountRequestFormSchema: normaliza correo a minúsculas y admite descripción vacía", () => {
  const inputWithUpperEmail = {
    rutEmpresa: "76123456-0",
    razonSocial: "Panadería Ejemplo SpA",
    rutUsuario: "12345678-5",
    nombre: "Ana",
    apellido: "Pérez",
    correo: "ANA@EJEMPLO.CL",
    descripcion: "",
  };

  const result = createAccountRequestFormSchema.safeParse(inputWithUpperEmail);
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.correo, "ana@ejemplo.cl");
    assert.equal(result.data.descripcion, undefined);
  }
});

test("validateAccountRequestField: reporta errores en tiempo real para cada campo", () => {
  assert.notEqual(validateAccountRequestField("rutEmpresa", "123"), null);
  assert.equal(validateAccountRequestField("rutEmpresa", "76123456-0"), null);

  assert.notEqual(validateAccountRequestField("razonSocial", "A"), null);
  assert.equal(validateAccountRequestField("razonSocial", "Panadería SpA"), null);

  assert.notEqual(validateAccountRequestField("rutUsuario", "12345678-9"), null);
  assert.equal(validateAccountRequestField("rutUsuario", "12345678-5"), null);

  assert.notEqual(validateAccountRequestField("nombre", "X"), null);
  assert.equal(validateAccountRequestField("nombre", "Carlos"), null);

  assert.notEqual(validateAccountRequestField("apellido", ""), null);
  assert.equal(validateAccountRequestField("apellido", "González"), null);

  assert.notEqual(validateAccountRequestField("correo", "correo-invalido"), null);
  assert.equal(validateAccountRequestField("correo", "test@dominio.cl"), null);
});
