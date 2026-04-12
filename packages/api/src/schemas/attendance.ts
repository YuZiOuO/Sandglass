import { z } from "zod";

const attendanceTypeSchema = z.enum(["IN", "OUT", "PAUSE"]);

// These schemas describe the HTTP boundary, not the full Prisma write models.
// That keeps auth-owned fields like uid and relation fields out of route inputs.
export const attendanceTargetUpdateBodySchema = z.object({
  timeMs: z.int(),
});

export const leaveRecordCreateBodySchema = z.object({
  date: z.coerce.date(),
  timeMs: z.int(),
  summary: z.string().optional().nullable(),
});

export const attendanceRecordIdBodySchema = z.object({
  id: z.uuid(),
});

export const attendanceRecordCreateBodySchema = z.object({
  time: z.coerce.date(),
  summary: z.string().optional().nullable(),
  type: attendanceTypeSchema,
  projectId: z.uuid().optional().nullable(),
});

export const attendanceRecordQuerySchema = z.discriminatedUnion("preset", [
  z
    .object({
      from: z.coerce.date().optional(),
      to: z.coerce.date().optional(),
      projectId: z.uuid().optional(),
      preset: z.undefined().optional(),
    })
    .refine((data) => {
      if (data.from && data.to) {
        return data.from < data.to;
      }

      return !data.from && !data.to;
    }),
  z.object({
    projectId: z.uuid().optional(),
    preset: z.enum(["today", "withIn7days", "withIn30days", "latest"]),
    from: z.undefined().optional(),
    to: z.undefined().optional(),
  }),
]);

export type AttendanceRecordType = z.infer<typeof attendanceTypeSchema>;
