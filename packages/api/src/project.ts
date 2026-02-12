import { zValidator } from "@hono/zod-validator";
import { db } from "./db";
import { factory } from "./shared";
import z from "zod";
import { ProjectCreateInputObjectZodSchema } from "@sandglass/schema/generated/schemas";

export const projectRoutes = factory
  .createApp()
  .get("/my", async (c) => {
    const uid = c.var.user?.id;
    const res = await db.project.findMany({ where: { uid: uid } });
    return c.json(res);
  })
  .get("/", zValidator("json", z.object({ id: z.uuid() })), async (c) => {
    const uid = c.var.user.id;
    const data = c.req.valid("json");

    const res = await db.project.findUnique({
      where: { id: data.id, uid: uid },
    });
    return c.json(res);
  })
  .delete("/", zValidator("json", z.object({ id: z.uuid() })), async (c) => {
    const uid = c.var.user.id;
    const data = c.req.valid("json");

    const res = await db.project.delete({ where: { id: data.id, uid: uid } });
    return c.json(res);
  })
  .post(
    "/",
    zValidator(
      "json",
      ProjectCreateInputObjectZodSchema.omit({ id: true, uid: true }),
    ),
    async (c) => {
      const uid = c.var.user.id;
      const data = c.req.valid("json");

      const res = await db.project.create({ data: { ...data, uid: uid } });
      return c.json(res);
    },
  );
