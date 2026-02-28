import { useMutation, useQuery } from '@tanstack/vue-query'
import { cli, globalQueryClient, processHonoResponse, type FixUnknownDate } from './common'
import type { InferRequestType, InferResponseType } from 'hono'
import { toValue, type MaybeRefOrGetter } from 'vue'

export type AttendanceRecordQueryType = NonNullable<
  InferRequestType<typeof cli.attendanceRecord.$get>['query']['preset']
>
export function useAttendanceRecordQuery(
  type: MaybeRefOrGetter<AttendanceRecordQueryType | undefined>,
  projectId?: MaybeRefOrGetter<string | undefined>,
) {
  return useQuery({
    queryKey: ['attendance', type, projectId],
    queryFn: async () => {
      const res = await cli.attendanceRecord.$get({
        query: { preset: toValue(type)!, projectId: toValue(projectId)! },
      })
      return await processHonoResponse(res)
    },
    enabled: !!toValue(type),
  })
}

export function useAttendanceLatestStatus() {
  return useQuery({
    queryKey: ['attendance', 'status'],
    queryFn: async () => {
      const res = await cli.attendance.status.$get()
      return await processHonoResponse(res)
    },
  })
}

export type AttendanceRecordCreateDTO = FixUnknownDate<
  InferRequestType<typeof cli.attendanceRecord.$post>['json'],
  'time'
>
export function useAttendanceRecordCreateMutate() {
  return useMutation({
    mutationKey: ['attendance'],
    mutationFn: async (dto: AttendanceRecordCreateDTO) => {
      const res = await cli.attendanceRecord.$post({ json: dto })
      return await processHonoResponse(res)
    },
    onSuccess: async () => {
      await globalQueryClient.invalidateQueries({ queryKey: ['attendance'] })
    },
  })
}

export type AttendanceRecord = InferResponseType<typeof cli.attendanceRecord.$get>[number]
export type AttendanceRecordType = InferResponseType<
  typeof cli.attendanceRecord.$get
>[number]['type']

export function useAttendanceRecordDeleteMutate() {
  return useMutation({
    mutationKey: ['attendance', 'delete'],
    mutationFn: async (id: string) => {
      const deletedRecord = await cli.attendanceRecord.$delete({
        json: {
          id: id,
        },
      })
      return await processHonoResponse(deletedRecord)
    },
    onSuccess: async () => {
      await globalQueryClient.invalidateQueries({ queryKey: ['attendance'] })
    },
  })
}
