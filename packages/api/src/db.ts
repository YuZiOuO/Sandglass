import { PrismaClient } from "@sandglass/schema/generated/prisma/client";
import { env } from "bun";

export const db = new PrismaClient({
  accelerateUrl: env.DATABASE_URL as string,
});

export * as schema from "@sandglass/schema/generated/schemas/index";
