import { zValidator } from "@hono/zod-validator";
import { db, schema } from "./db";
import { factory } from "./shared";
import { z } from "zod";

/**
 * Get day boundaries (00:00:00) for the given date
 */
function getDayRange(whichDay: Date) {
  const startThisDay = new Date(whichDay);
  startThisDay.setHours(0, 0, 0, 0);
  const startOfTheNextDay = new Date(startThisDay);
  startOfTheNextDay.setDate(startOfTheNextDay.getDate() + 1);
  return { startOfThisDay: startThisDay, startOfTheNextDay: startOfTheNextDay };
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
  .delete("/", zValidator("json", z.object({ id: z.uuid() })), async (c) => {
    const uid = c.var.uid;
    const idObject = c.req.valid("json");

    const result = await db.attendanceRecord.delete({
      where: { id: idObject.id, uid: uid },
    });

    return c.json(result);
  })
  .get(
    "/",
    zValidator(
      "query",
      z.discriminatedUnion("preset", [
        z
          .object({
            from: z.coerce.date(),
            to: z.coerce.date(),
            preset: z.undefined().optional(),
          })
          .refine((data) => {
            return data.from < data.to;
          }),
        z.object({
          from: z.undefined().optional(),
          to: z.undefined().optional(),
          preset: z.enum(["today", "withIn7days","withIn30days"]),
        }),
      ]),
    ),
    async (c) => {
      const uid = c.var.uid;
      const data = c.req.valid("query");

      let from: Date;
      let to: Date;

      const MS_PER_DAY = 24 * 60 * 60 * 1000
      switch (data.preset) {
        case undefined:
          from = data.from;
          to = data.to;
          break;
        case "today":
          ({ startOfThisDay: from, startOfTheNextDay: to } = getDayRange(
            new Date(),
          ));
          break;
        case "withIn7days":
          to = getDayRange(new Date()).startOfTheNextDay;
          from = getDayRange(
            new Date(Date.now() - 7 * MS_PER_DAY),
          ).startOfThisDay;
          break;
        case "withIn30days":
          to = getDayRange(new Date()).startOfTheNextDay;
          from = getDayRange(
            new Date(Date.now() - 30 * MS_PER_DAY),
          ).startOfThisDay;
          break;
      }

      const res = await db.attendanceRecord.findMany({
        where: {
          time: {
            gte: from,
            lt: to,
          },
          uid: uid,
        },
        orderBy: { time: "asc" },
      });

      return c.json(res);
    },
  );
