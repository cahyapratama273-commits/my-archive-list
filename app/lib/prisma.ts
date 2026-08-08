import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";


const globalForPrisma = global as unknown as { prisma: PrismaClient };

// In Prisma 7, we MUST use a Driver Adapter
// The @prisma/adapter-mariadb works for both MariaDB and MySQL
const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaMariaDb(connectionString as string);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
