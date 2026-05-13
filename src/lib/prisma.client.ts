import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `var` declarations

  var prisma: PrismaClient | undefined;
}

export const prismaClient =
  global.prisma ||
  new PrismaClient({
    // log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prismaClient;
