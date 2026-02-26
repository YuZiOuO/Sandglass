import { zValidator } from "@hono/zod-validator";
import { db } from "./db";
import { factory } from "./shared";
import z from "zod";
import {
  ProjectCreateInputObjectZodSchema,
  ResourcesCreateInputObjectZodSchema,
} from "@sandglass/schema/generated/schemas";

export const projectRoutes = factory
  .createApp()
  .get("/my", async (c) => {
    const uid = c.var.user.id;
    const res = await db.project.findMany({ where: { uid: uid } });
    return c.json(res);
  })
  .get("/", zValidator("query", z.object({ id: z.uuid() })), async (c) => {
    const uid = c.var.user.id;
    const data = c.req.valid("query");

    const res = await db.project.findUnique({
      where: { id: data.id, uid: uid },
    });
    return c.json(res);
  })
  .delete("/", zValidator("query", z.object({ id: z.uuid() })), async (c) => {
    const uid = c.var.user.id;
    const data = c.req.valid("query");

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

export const ResourcesRoutes = factory
  .createApp()
  .get(
    "/",
    zValidator("query", z.object({ projectId: z.uuid() })),
    async (c) => {
      const uid = c.var.user.id;
      const projectId = c.req.valid("query").projectId;

      const project = await db.resources.findMany({
        where: {
          project: {
            uid: uid,
            id: projectId,
          },
        },
      });

      return c.json(project);
    },
  )
  .post(
    "/",
    zValidator("query", z.object({ projectId: z.uuid() })),
    zValidator(
      "json",
      ResourcesCreateInputObjectZodSchema.omit({ id: true, project: true }),
    ),
    async (c) => {
      const uid = c.var.user.id;
      const projectId = c.req.valid("query").projectId;

      // Validate if project is affliated to user
      const project = await db.project.findUnique({ where: { id: projectId } });
      if (!project || project.uid != uid) {
        return c.notFound();
      }

      const resource = c.req.valid("json");
      const createdResource = await db.resources.create({
        data: {
          ...resource,
          project: {
            connect: {
              id: projectId,
            },
          },
        },
      });

      return c.json(createdResource);
    },
  )
  .delete(
    "/",
    zValidator("query", z.object({ resourceId: z.uuid() })),
    async (c) => {
      const uid = c.var.user.id;
      const resourceId = c.req.valid("query").resourceId;

      const affectefRow = await db.resources.deleteMany({
        where: {
          id: resourceId,
          project: {
            uid: uid,
          },
        },
      });

      return c.json(affectefRow.count);
    },
  );
