import { zValidator } from "@hono/zod-validator";
import { db, schema } from "./db";
import { factory } from "./shared";

export const attendanceRecordRoutes = factory.createApp().post(
  "/",
  zValidator(
    "json",
    schema.AttendanceRecordCreateInputObjectZodSchema.omit({
      id: true,
      uid: true,
    }),
  ),
  async (c) => {
    const uid = c.var.uid;
    const data = c.req.valid("json");
    try {
      const dbres = await db.attendanceRecord.create({
        data: { ...data, uid: uid },
      });
    } catch (e) {
      console.log(e);
    }
    return c.json({ success: true, error: null }, 201);
  },
);
