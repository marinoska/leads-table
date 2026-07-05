import { PrismaClient } from "../../generated/prisma";

// Cache the client on globalThis in dev so Next.js HMR doesn't spawn a new
// PrismaClient (and exhaust connections) on every hot reload.
// This is the recommended Prisma + Next.js pattern:
// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
