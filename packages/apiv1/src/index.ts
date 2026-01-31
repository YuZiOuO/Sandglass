import { zValidator } from "@hono/zod-validator";
import { PrismaClient } from "@sandglass/schema/generated/prisma/client";
import { AttendanceRecordCreateInputSchema } from "@sandglass/schema/generated/zod";
import { Hono } from "hono";

const app = new Hono();
const db = new PrismaClient({
  accelerateUrl: "localhost",
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const routes = app.post(
  "/attendanceRecord",
  zValidator("form", AttendanceRecordCreateInputSchema),
  (c) => {
    const data = c.req.valid("form");
    return c.json({}, 201);
  },
);

export default app;
export type AppType = typeof routes;
