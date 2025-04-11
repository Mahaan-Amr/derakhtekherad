import { PrismaClient } from '@prisma/client';

// Create a global prisma instance to avoid multiple instances in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Fix enableTracing issue by providing only supported options
export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
} 