
import { PrismaClient } from '@prisma/client';

/**
 * @type {PrismaClient}
 */
let prisma: PrismaClient; 

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
  prisma.$connect();
} else {
  // Use global variable for the database connection in development
  if (!global.__db) {
    global.__db = new PrismaClient();
    global.__db.$connect();
  }
  prisma = global.__db;
}

export { prisma };
