import { db } from "./db";
import { factory } from "./shared";

export const attendanceRoutes = factory
  .createApp()
  .get("/status", async (c) => {
    const uid = c.var.uid;
    const res = await db.attendanceRecord.findFirst({
      where: {
        uid: uid,
      },
      orderBy: {
        time: "desc",
      },
    });

    return c.json(res?.type ?? 'OUT')
  });
