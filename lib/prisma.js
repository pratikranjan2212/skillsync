import { PrismaClient } from "@prisma/client";
import { env } from "./config/env.js";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasourceUrl: env.databaseUrl && !env.databaseUrl.startsWith("dev-placeholder") ? env.databaseUrl : undefined,
    log: env.isDevelopment ? ["warn", "error"] : ["error"],
  });

if (env.isDevelopment) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
