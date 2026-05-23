import { PrismaNeon } from '@prisma/adapter-neon';

import { PrismaClient } from '../../prisma/generated/prisma/client';

declare global {
  // allow global `var` declarations

  var prisma: PrismaClient | undefined;
}

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

export const prismaClient =
  global.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prismaClient;
