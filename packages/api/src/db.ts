import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@sandglass/schema/generated/prisma/client";
import { env } from "./env";

const connectionString = env.DATABASE_URL;
const adapter = new PrismaPg({connectionString});
export const db = new PrismaClient({ adapter: adapter });

export * as schema from "@sandglass/schema/generated/schemas/index";
