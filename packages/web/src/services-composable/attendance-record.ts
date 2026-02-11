import { useMutation, useQuery } from '@tanstack/vue-query'
import { authClient, client } from './common'
import type { InferRequestType, InferResponseType } from 'hono'
import { globalQueryClient } from '.'

type AttendanceRecordQueryType = NonNullable<
  InferRequestType<typeof client.attendanceRecord.$get>['query']['preset']
>
export function useAttendanceRecordQuery(type: AttendanceRecordQueryType) {
  return useQuery({
    queryKey: ['attendance', type],
    queryFn: async () => {
      const cli = await authClient()
      const res = await cli.attendanceRecord.$get({ query: { preset: type } })
      const data = await res.json()
      return data
    },
  })
}

export function useAttendanceLatestStatus() {
  return useQuery({
    queryKey: ['attendance', 'status'],
    queryFn: async () => {
      const cli = await authClient()
      const res = await cli.attendance.status.$get()
      const data = await res.json()
      return data
    },
  })
}

export type AttendanceRecordCreateDTO = InferRequestType<typeof client.attendanceRecord.$post>
export function useAttendanceRecordCreateMutate() {
  return useMutation({
    mutationKey: ['attendance'],
    mutationFn: async (dto: AttendanceRecordCreateDTO) => {
      const cli = await authClient()
      await cli.attendanceRecord.$post(dto)
    },
    onSuccess: async () => {
      await globalQueryClient.invalidateQueries({ queryKey: ['attendance'] })
    },
  })
}

export type AttendanceRecord = InferResponseType<typeof client.attendanceRecord.$get>[number]
export type AttendanceRecordType = InferResponseType<
  typeof client.attendanceRecord.$get
>[number]['type']
