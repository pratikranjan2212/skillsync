import { PrismaClient } from "@prisma/client";
import { env } from "@/lib/config/env";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: env.isDevelopment ? ["warn", "error"] : ["error"],
  });

if (env.isDevelopment) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
