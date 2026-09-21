import { app } from './app.js';
import { prisma } from './config/database.js';
import { env } from './config/env.js';

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
