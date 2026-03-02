import { zValidator } from "@hono/zod-validator";
import { factory } from "./factory";
import {
  AttendanceLeaveRecordCreateInputObjectZodSchema,
  AttendanceTargetCreateInputObjectZodSchema,
} from "@sandglass/schema/generated/schemas";
import { db } from "./db";
import { z } from "zod";

export const attendanceTargetRoutes = factory
  .createApp()
  .put(
    "/",
    zValidator(
      "json",
      AttendanceTargetCreateInputObjectZodSchema.omit({ user: true }),
    ),
    async (c) => {
      const uid = c.var.user.id;
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
    const uid = c.var.user.id;
    const result = await db.attendanceTarget.findUnique({
      where: { uid: uid },
    });
    return c.json(result);
  })
  .put(
    "leave",
    zValidator(
      "json",
      AttendanceLeaveRecordCreateInputObjectZodSchema.omit({
        id: true,
        user: true,
      }),
    ),
    async (c) => {
      const uid = c.var.user.id;
      const data = c.req.valid("json");

      const res = await db.attendanceLeaveRecord.upsert({
        where: { uid_date: { date: data.date, uid: uid } },
        create: {
          uid: uid,
          ...data,
        },
        update: {
          ...data,
        },
      });

      return c.json(res);
    },
  )
  .delete(
    "leave",
    zValidator("json", z.object({ id: z.uuid() })),
    async (c) => {
      const uid = c.var.user.id;
      const data = c.req.valid("json");

      const res = await db.attendanceLeaveRecord.delete({
        where: { id: data.id, uid: uid },
      });

      return c.json(res);
    },
  )
  .get("leave/today", async (c) => {
    const uid = c.var.user.id;

    const q = await db.attendanceLeaveRecord.findUnique({
      where: { uid_date: { date: new Date(), uid: uid } },
    });

    return c.json(q);
  });
