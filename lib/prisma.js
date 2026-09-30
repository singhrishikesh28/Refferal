import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';

const globalForPrisma = globalThis;

export function getPrisma() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured.');
  }
  if (!globalForPrisma.referralsPrisma) {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    globalForPrisma.referralsPrisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.referralsPrisma;
}
