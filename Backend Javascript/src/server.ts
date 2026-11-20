import { app } from './app.js';
import { prisma } from './config/database.js';
import { env } from './config/env.js';
import { cleanupDeletingFiles } from './modules/module1/file-deletion.js';

async function limpiarArchivosEnBorrado() {
  // Antes de escuchar: restaura o elimina los PDF `.deleting` que dejó un borrado interrumpido.
  try {
    const limpieza = await cleanupDeletingFiles(prisma, env.DOCUMENT_STORAGE_PATH);
    if (limpieza.restaurados || limpieza.eliminados) {
      console.log(JSON.stringify({ level: 'info', event: 'deleting_files_cleanup', ...limpieza }));
    }
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', event: 'deleting_files_cleanup_failed', motivo: String(error) }));
  }
}

async function start() {
  await limpiarArchivosEnBorrado();

  const server = app.listen(env.PORT, () => {
    console.log(`Backend escuchando en http://localhost:${env.PORT}`);
  });

  async function shutdown() {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

void start();
