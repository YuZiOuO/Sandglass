import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@sandglass/schema/generated/prisma/client";
// import { env } from "bun";

const connectionString = process.env.DATABASE_URL;

if(!connectionString){
    console.error("No DB URL found. Exiting...")
    process.exit(-1);
}

const adapter = new PrismaPg({connectionString});
export const db = new PrismaClient({ adapter: adapter });

export * as schema from "@sandglass/schema/generated/schemas/index";
