import { zValidator } from "@hono/zod-validator";
import type { Prisma } from "@sandglass/schema/generated/prisma/client";
import { factory } from "./factory";
import { db } from "./db";
import {
  attendanceRecordIdBodySchema,
  attendanceTargetUpdateBodySchema,
  leaveRecordCreateBodySchema,
} from "./schemas/attendance";

export const attendanceTargetRoutes = factory
  .createApp()
  .put(
    "/",
    zValidator("json", attendanceTargetUpdateBodySchema),
    async (c) => {
      const uid = c.var.user.id;
      const body = c.req.valid("json");
      const update = {
        timeMs: body.timeMs,
      } satisfies Prisma.AttendanceTargetUncheckedUpdateInput;
      const create = {
        uid,
        timeMs: body.timeMs,
      } satisfies Prisma.AttendanceTargetUncheckedCreateInput;

      const res = await db.attendanceTarget.upsert({
        where: { uid: uid },
        update,
        create,
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
    zValidator("json", leaveRecordCreateBodySchema),
    async (c) => {
      const uid = c.var.user.id;
      const body = c.req.valid("json");
      const create = {
        uid,
        ...body,
      } satisfies Prisma.AttendanceLeaveRecordUncheckedCreateInput;
      const update = {
        ...body,
      } satisfies Prisma.AttendanceLeaveRecordUncheckedUpdateInput;

      const res = await db.attendanceLeaveRecord.upsert({
        where: { uid_date: { date: body.date, uid: uid } },
        create,
        update,
      });

      return c.json(res);
    },
  )
  .delete(
    "leave",
    zValidator("json", attendanceRecordIdBodySchema),
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
