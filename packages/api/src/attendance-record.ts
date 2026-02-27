import { zValidator } from "@hono/zod-validator";
import { db, schema } from "./db";
import { factory } from "./factory";
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
   * Create a attendanceRecord.
   */
  .post(
    "/",
    zValidator(
      "json",
      schema.AttendanceRecordUncheckedCreateInputObjectZodSchema.omit({
        id: true,
        uid: true,
      }),
    ),
    async (c) => {
      
      const uid = c.var.user.id;
      const data = c.req.valid("json");
      const res = await db.attendanceRecord.create({
        data: {
          ...data,
          uid: uid,

          // validate project Id
          projectId: undefined,
          project: data.projectId
            ? { connect: { id: data.projectId } }
            : undefined,
        },
      });
      return c.json(res);
    },
  )
  .delete("/", zValidator("json", z.object({ id: z.uuid() })), async (c) => {
    const uid = c.var.user.id;
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
            projectId: z.uuid().optional(),
            preset: z.undefined().optional(),
          })
          .refine((data) => {
            return data.from < data.to;
          }),
        z.object({
          from: z.undefined().optional(),
          to: z.undefined().optional(),
          projectId: z.uuid().optional(),
          preset: z.enum(["today", "withIn7days", "withIn30days", "latest"]),
        }),
      ]),
    ),
    async (c) => {
      const uid = c.var.user.id;
      const data = c.req.valid("query");

      if (data.preset === "latest") {
        const res = await db.attendanceRecord.findFirst({
          where: {
            uid: uid,
            projectId: data.projectId,
          },
          orderBy: {
            time: "desc",
          },
        });
        return c.json(res ? [res] : []);
      }

      let from: Date;
      let to: Date;

      const MS_PER_DAY = 24 * 60 * 60 * 1000;
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
            gte: from!,
            lt: to!,
          },
          uid: uid,
        },
        orderBy: { time: "asc" },
      });

      return c.json(res);
    },
  );
