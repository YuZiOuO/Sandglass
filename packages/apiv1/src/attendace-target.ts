import { zValidator } from "@hono/zod-validator";
import { factory } from "./shared";
import { AttendanceTargetCreateInputObjectZodSchema } from "@sandglass/schema/generated/schemas";
import { db } from "./db";

export const attendaceTargetRoutes = factory
  .createApp()
  .put(
    "/",
    zValidator(
      "json",
      AttendanceTargetCreateInputObjectZodSchema.omit({ uid: true }),
    ),
    async (c) => {
      const uid = c.var.uid;
      const data = c.req.valid("json");

      const res = await db.attendanceTarget.upsert({
        where: { uid: uid },
        update: { timeMs: data.timeMs },
        create: {
          uid: uid,
          timeMs: data.timeMs,
        },
      });
      return c.json(res);
    },
  )
  .get("/", async (c) => {
    const uid = c.var.uid;
    const result = await db.attendanceTarget.findUnique({
      where: { uid: uid },
    });
    return c.json(result);
  });
