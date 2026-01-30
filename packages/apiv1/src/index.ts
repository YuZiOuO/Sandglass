import { PrismaClient } from "@sandglass/schema/generated/prisma/client";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
