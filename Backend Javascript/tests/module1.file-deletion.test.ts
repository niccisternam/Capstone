import { mkdtemp, mkdir, readdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { unlink } from "node:fs/promises";
import type { PrismaClient } from "../src/generated/prisma/client.js";
import {
  cleanupDeletingFiles,
  deleteFilesWithRecords,
} from "../src/modules/module1/file-deletion.js";

vi.mock("node:fs/promises", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs/promises")>();
  return { ...actual, unlink: vi.fn(actual.unlink) };
});

let root: string;
let pdf: string;

beforeEach(async () => {
  root = await mkdtemp(path.join(tmpdir(), "module1-deletion-"));
  await mkdir(path.join(root, "empresa"), { recursive: true });
  pdf = path.join(root, "empresa", "doc.pdf");
  await writeFile(pdf, "%PDF-1.4 contenido");
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
});

afterEach(async () => {
  vi.restoreAllMocks();
  await rm(root, { recursive: true, force: true });
});

const exists = (file: string) => readFile(file).then(() => true, () => false);

describe("borrado en dos fases", () => {
  it("si falla la base, el PDF se conserva en su nombre original", async () => {
    await expect(
      deleteFilesWithRecords([pdf], () => Promise.reject(new Error("db caída"))),
    ).rejects.toThrow("db caída");

    expect(await readFile(pdf, "utf8")).toBe("%PDF-1.4 contenido");
    expect(await exists(`${pdf}.deleting`)).toBe(false);
  });

  it("si todo funciona, el registro y el PDF desaparecen", async () => {
    const deleteRecords = vi.fn().mockResolvedValue(undefined);

    await deleteFilesWithRecords([pdf], deleteRecords);

    expect(deleteRecords).toHaveBeenCalledOnce();
    expect(await exists(pdf)).toBe(false);
    expect(await exists(`${pdf}.deleting`)).toBe(false);
  });

  it("si falla unlink, el registro no reaparece: se confirma el borrado y solo queda un aviso", async () => {
    const deleteRecords = vi.fn().mockResolvedValue(undefined);
    vi.mocked(unlink).mockRejectedValueOnce(Object.assign(new Error("EPERM"), { code: "EPERM" }));

    await expect(deleteFilesWithRecords([pdf], deleteRecords)).resolves.toBeUndefined();

    expect(deleteRecords).toHaveBeenCalledOnce();
    expect(await exists(pdf)).toBe(false);
    expect(await exists(`${pdf}.deleting`)).toBe(true);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("pdf_unlink_failed"));
  });

  it("un archivo que ya no existe no bloquea el borrado del registro", async () => {
    const deleteRecords = vi.fn().mockResolvedValue(undefined);

    await deleteFilesWithRecords([path.join(root, "no-existe.pdf")], deleteRecords);

    expect(deleteRecords).toHaveBeenCalledOnce();
  });
});

describe("limpieza al arrancar", () => {
  it("restaura un .deleting cuyo registro sigue existiendo", async () => {
    await rename(pdf, `${pdf}.deleting`);
    const prisma = {
      archivoPDF: {
        findUnique: vi.fn().mockResolvedValue({ idArchivo: "a1" }),
      },
    } as unknown as PrismaClient;

    const result = await cleanupDeletingFiles(prisma, root);

    expect(result).toEqual({ restaurados: 1, eliminados: 0 });
    expect(await readFile(pdf, "utf8")).toBe("%PDF-1.4 contenido");
    expect(await exists(`${pdf}.deleting`)).toBe(false);
  });

  it("elimina un .deleting sin registro asociado", async () => {
    await rename(pdf, `${pdf}.deleting`);
    const prisma = {
      archivoPDF: { findUnique: vi.fn().mockResolvedValue(null) },
    } as unknown as PrismaClient;

    const result = await cleanupDeletingFiles(prisma, root);

    expect(result).toEqual({ restaurados: 0, eliminados: 1 });
    expect(await readdir(path.join(root, "empresa"))).toEqual([]);
  });

  it("no hace nada si el almacenamiento no existe", async () => {
    const prisma = { archivoPDF: { findUnique: vi.fn() } } as unknown as PrismaClient;

    const result = await cleanupDeletingFiles(prisma, path.join(root, "ausente"));

    expect(result).toEqual({ restaurados: 0, eliminados: 0 });
  });
});

