import { useMutation, useQuery } from '@tanstack/vue-query'
import { cli, globalQueryClient } from './common'
import type { InferRequestType, InferResponseType } from 'hono'
import { toValue, type MaybeRefOrGetter } from 'vue'

export type AttendanceRecordQueryType = NonNullable<
  InferRequestType<typeof cli.attendanceRecord.$get>['query']['preset']
>
export function useAttendanceRecordQuery(
  type: MaybeRefOrGetter<AttendanceRecordQueryType | undefined>,
) {
  return useQuery({
    queryKey: ['attendance', type],
    queryFn: async () => {
      const res = await cli.attendanceRecord.$get({ query: { preset: toValue(type)! } })
      const data = await res.json()
      return data
    },
    enabled: !!toValue(type),
  })
}

export function useAttendanceLatestStatus() {
  return useQuery({
    queryKey: ['attendance', 'status'],
    queryFn: async () => {
      const res = await cli.attendance.status.$get()
      const data = await res.json()
      return data
    },
  })
}

export type AttendanceRecordCreateDTO = InferRequestType<typeof cli.attendanceRecord.$post>
export function useAttendanceRecordCreateMutate() {
  return useMutation({
    mutationKey: ['attendance'],
    mutationFn: async (dto: AttendanceRecordCreateDTO) => {
      await cli.attendanceRecord.$post(dto)
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
