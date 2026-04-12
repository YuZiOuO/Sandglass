import { z } from "zod";

// HTTP input schemas stay local to the API layer so route contracts can evolve
// without inheriting Prisma create-input details and relation fields.
export const projectIdQuerySchema = z.object({
  id: z.uuid(),
});

export const projectCreateBodySchema = z.object({
  name: z.string(),
  calendarId: z.string(),
  tasklistId: z.string(),
  repoOwner: z.string(),
  repoName: z.string(),
});

export const resourceProjectIdQuerySchema = z.object({
  projectId: z.uuid(),
});

export const resourceCreateBodySchema = z.object({
  title: z.string(),
  url: z.string(),
});

export const resourceIdQuerySchema = z.object({
  resourceId: z.uuid(),
});
