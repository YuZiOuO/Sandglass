import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@sandglass/schema/generated/prisma/client";
import { env } from "./env";
import { createLogger } from "./log";
import { LOG_SCOPES } from "@sandglass/shared";

const log = createLogger(LOG_SCOPES.db);
const SLOW_QUERY_THRESHOLD_MS = 300;

const connectionString = env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  min: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, // increase timeout for high latency networks
});

pool.on("error", (err) => {
  log.error("db.pool.error", { err });
});

const adapter = new PrismaPg(pool);

const summarizeQuery = (query: string) => {
  const normalized = query.replace(/\s+/g, " ").trim();
  if (normalized.length <= 240) return normalized;
  return normalized.slice(0, 237) + "...";
};

const createPrismaClient = () => {
  const client = new PrismaClient({
    adapter,
    log: [
      { emit: "event", level: "query" },
      { emit: "event", level: "info" },
      { emit: "event", level: "warn" },
      { emit: "event", level: "error" },
    ],
  });

  client.$on("query", (event) => {
    if (event.duration < SLOW_QUERY_THRESHOLD_MS) {
      return;
    }

    log.warn("db.query.slow", {
      durationMs: Math.round(event.duration),
      query: summarizeQuery(event.query),
      target: event.target,
    });
  });

  client.$on("info", (event) => {
    log.info("db.info", { target: event.target, detail: event.message });
  });

  client.$on("warn", (event) => {
    log.warn("db.warn", { target: event.target, detail: event.message });
  });

  client.$on("error", (event) => {
    log.error("db.error", { target: event.target, detail: event.message });
  });

  return client;
};

export const db = createPrismaClient();

async function verifyDatabaseConnection() {
  try {
    await db.$queryRaw`SELECT 1`;
    log.info("db.connected");
  } catch (err) {
    log.error("db.connection.failed", { err });
    throw err;
  }
}
await verifyDatabaseConnection();
