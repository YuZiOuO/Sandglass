import { zValidator } from "@hono/zod-validator";
import type { Prisma } from "@sandglass/schema/generated/prisma/client";
import { db } from "./db";
import { factory } from "./factory";
import { HTTPException } from "hono/http-exception";
import {
  projectCreateBodySchema,
  projectIdQuerySchema,
  resourceCreateBodySchema,
  resourceIdQuerySchema,
  resourceProjectIdQuerySchema,
} from "./schemas/project";

export const projectRoutes = factory
  .createApp()
  .get("/my", async (c) => {
    const uid = c.var.user.id;
    const res = await db.project.findMany({ where: { uid: uid } });
    return c.json(res);
  })
  .get("/", zValidator("query", projectIdQuerySchema), async (c) => {
    const uid = c.var.user.id;
    const data = c.req.valid("query");

    const res = await db.project.findUnique({
      where: { id: data.id, uid: uid },
    });
    return c.json(res);
  })
  .delete("/", zValidator("query", projectIdQuerySchema), async (c) => {
    const uid = c.var.user.id;
    const data = c.req.valid("query");

    const res = await db.project.delete({ where: { id: data.id, uid: uid } });
    return c.json(res);
  })
  .post(
    "/",
    zValidator("json", projectCreateBodySchema),
    async (c) => {
      const uid = c.var.user.id;
      const body = c.req.valid("json");
      const data = {
        ...body,
        uid,
      } satisfies Prisma.ProjectUncheckedCreateInput;

      const res = await db.project.create({ data });
      return c.json(res);
    },
  );

export const ResourcesRoutes = factory
  .createApp()
  .get(
    "/",
    zValidator("query", resourceProjectIdQuerySchema),
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
    zValidator("query", resourceProjectIdQuerySchema),
    zValidator("json", resourceCreateBodySchema),
    async (c) => {
      const uid = c.var.user.id;
      const projectId = c.req.valid("query").projectId;

      // Validate if project is affliated to user
      const project = await db.project.findUnique({ where: { id: projectId } });
      if (!project || project.uid != uid) {
        throw new HTTPException(404);
      }

      const resource = c.req.valid("json");
      const data = {
        ...resource,
        project: {
          connect: {
            id: projectId,
          },
        },
      } satisfies Prisma.ResourcesCreateInput;

      const createdResource = await db.resources.create({
        data,
      });

      return c.json(createdResource);
    },
  )
  .delete(
    "/",
    zValidator("query", resourceIdQuerySchema),
    async (c) => {
      const uid = c.var.user.id;
      const resourceId = c.req.valid("query").resourceId;

      const deletedResource = await db.$transaction(async (tx) => {
        const resource = await tx.resources.findFirst({
          where: {
            id: resourceId,
            project: {
              uid: uid,
            },
          },
        });

        if (!resource) {
          throw new HTTPException(404);
        }

        const deletedResource = await tx.resources.delete({
          where: {
            id: resourceId,
          },
        });

        return deletedResource;
      });

      return c.json(deletedResource);
    },
  );
