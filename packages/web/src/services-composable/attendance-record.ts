import { useMutation, useQuery } from '@tanstack/vue-query'
import { authClient, client } from './common'
import type { InferRequestType, InferResponseType } from 'hono'
import { globalQueryClient } from '.'
import { computed } from 'vue'

type AttendanceRecordQueryType = NonNullable<
  InferRequestType<typeof client.attendanceRecord.$get>['query']['preset']
>
export function useAttendaceRecordQuery(type: AttendanceRecordQueryType) {
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
  return computed(() => {
    const attendanceRecordLatest = useAttendaceRecordQuery('latest')
    const data = attendanceRecordLatest.data.value?.at(0)
    return data?.type ?? 'OUT'
  })
}

export type AttendanceRecordCreateDTO = InferRequestType<typeof client.attendanceRecord.$post>
export function useAttendaceRecordCreateMutate() {
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
