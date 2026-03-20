import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@sandglass/schema/generated/prisma/client";
import { env } from "./env";

const connectionString = env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });

const createPrismaClient = () => {
  if (env.DB_TRACE) {
    const client = new PrismaClient({
      adapter,
      log: [
        { emit: "event", level: "query" },
        { emit: "stdout", level: "info" },
        { emit: "stdout", level: "warn" },
        { emit: "stdout", level: "error" },
      ],
    });

    client.$on("query", (e) => {
      console.log(`[Query] ${e.query} (${Math.round(e.duration)}ms)`);
    });

    return client;
  }

  return new PrismaClient({
    adapter,
    log: ["info", "warn", "error"],
  });
};

export const db = createPrismaClient();

export * as schema from "@sandglass/schema/generated/schemas/index";
