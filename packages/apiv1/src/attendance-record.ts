import { zValidator } from "@hono/zod-validator";
import { db, schema } from "./db";
import { factory } from "./shared";

/**
 * Get day boundaries (00:00:00) for the given date
 */
function getDateRange(now: Date) {
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
  return { startOfToday, startOfTomorrow };
}

export const attendanceRecordRoutes = factory
  .createApp()
  /**
   * Create a attendaceRecord.
   */
  .post(
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
      await db.attendanceRecord.create({
        data: { ...data, uid: uid },
      });
      return c.json({ success: true, error: null }, 201);
    },
  )
  /**
   * Get Todays attendaces Record
   */
  .get("/today", async (c) => {
    const uid = c.var.uid;
    const { startOfToday, startOfTomorrow } = getDateRange(new Date());
    const result = await db.attendanceRecord.findMany({
      where: {
        AND: [
          { uid: uid },
          { time: { gte: startOfToday, lt: startOfTomorrow } },
        ],
      },
    });
    return c.json(result);
  });
