import { db } from "./db";
import { factory } from "./factory";

export const attendanceRoutes = factory
  .createApp()
  .get("/status", async (c) => {
    const uid = c.var.user.id;
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
