import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { env } from './env.js';

function postgresRuntimeUrl(connectionString: string): string {
  const url = new URL(connectionString);
  url.searchParams.set('sslmode', 'require');
  url.searchParams.set('uselibpqcompat', 'true');
  return url.toString();
}

const adapter = new PrismaPg(postgresRuntimeUrl(env.DATABASE_URL));

export const prisma = new PrismaClient({ adapter });

export async function checkDatabaseConnection(): Promise<void> {
  await prisma.$queryRaw`SELECT 1`;
}
