import { access, readdir, rename, unlink } from "node:fs/promises";
import path from "node:path";
import type { PrismaClient } from "../../generated/prisma/client.js";

// Borrado en dos fases para que la base y el disco no se desincronicen:
// 1) el PDF pasa a `<archivo>.deleting`; 2) se borra el registro;
// 3) se elimina el `.deleting`. Si el registro no se puede borrar, el PDF vuelve a su nombre.
// Si solo falla la eliminación final, el registro ya está borrado y se registra un aviso.

export const DELETING_SUFFIX = ".deleting";

export type StagedFile = { original: string; staged: string };

function logWarning(event: string, details: Record<string, string>) {
  console.warn(JSON.stringify({ level: "warn", event, ...details }));
}

function isNotFound(error: unknown): boolean {
  return (error as NodeJS.ErrnoException | undefined)?.code === "ENOENT";
}

/** Fase 1: renombra el PDF a `.deleting`. Devuelve null si el archivo ya no existe. */
export async function stageFileForDeletion(filePath: string): Promise<StagedFile | null> {
  const staged = `${filePath}${DELETING_SUFFIX}`;
  try {
    await rename(filePath, staged);
    return { original: filePath, staged };
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

/** Devuelve el PDF a su nombre original. Si falla, el `.deleting` queda para la limpieza del arranque. */
export async function restoreStagedFile(file: StagedFile): Promise<void> {
  await rename(file.staged, file.original).catch((error: unknown) => {
    logWarning("pdf_restore_failed", { archivo: file.staged, motivo: String(error) });
  });
}

/** Fase 3: elimina el `.deleting`. Un fallo no revierte el borrado ya confirmado; solo se registra. */
export async function discardStagedFile(file: StagedFile): Promise<void> {
  await unlink(file.staged).catch((error: unknown) => {
    if (isNotFound(error)) return;
    logWarning("pdf_unlink_failed", { archivo: file.staged, motivo: String(error) });
  });
}

/**
 * Borra registros y archivos en dos fases. `deleteRecords` debe borrar los registros
 * (idealmente en una transacción). Si falla, los archivos se restauran y el error se relanza.
 */
export async function deleteFilesWithRecords(
  filePaths: string[],
  deleteRecords: () => Promise<unknown>,
): Promise<void> {
  const staged: StagedFile[] = [];
  try {
    for (const filePath of filePaths) {
      const file = await stageFileForDeletion(filePath);
      if (file) staged.push(file);
    }
    await deleteRecords();
  } catch (error) {
    await Promise.all(staged.map(restoreStagedFile));
    throw error;
  }
  await Promise.all(staged.map(discardStagedFile));
}

/**
 * Arranque: revisa los `.deleting` del almacenamiento.
 * - Con registro asociado: el borrado de base falló o se interrumpió, así que el PDF vuelve a su nombre.
 * - Sin registro: se elimina el archivo sobrante.
 */
export async function cleanupDeletingFiles(prisma: PrismaClient, storagePath: string): Promise<{ restaurados: number; eliminados: number }> {
  const root = path.resolve(storagePath);
  const entries = await readdir(root, { recursive: true }).catch((error: unknown) => {
    if (isNotFound(error)) return [] as string[];
    throw error;
  });
  const result = { restaurados: 0, eliminados: 0 };

  for (const entry of entries.filter((name) => name.endsWith(DELETING_SUFFIX))) {
    const storageKey = entry.slice(0, -DELETING_SUFFIX.length).split(path.sep).join("/");
    const staged = path.join(root, entry);
    const original = path.join(root, storageKey);
    const record = await prisma.archivoPDF.findUnique({ where: { storageKey }, select: { idArchivo: true } });

    if (record) {
      const originalExists = await access(original).then(() => true, () => false);
      if (originalExists) {
        await unlink(staged).catch(() => undefined);
      } else {
        await rename(staged, original);
      }
      result.restaurados += 1;
    } else {
      await unlink(staged).catch(() => undefined);
      result.eliminados += 1;
    }
  }
  return result;
}
