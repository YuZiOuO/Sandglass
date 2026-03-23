import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@sandglass/schema/generated/prisma/client";
import { env } from "./env";

const connectionString = env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  min: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, // increase timeout for high latency networks
});

const adapter = new PrismaPg(pool);

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

async function bootstrap() {
  try {
    const res = await db.$queryRaw`SELECT 1`;
    console.log("[INFO] 🐘 Database Connected.");
  } catch (err) {
    console.error("[Fatal] ❌ Failed to initialize Database connection: ", err);
  }
}
bootstrap();
