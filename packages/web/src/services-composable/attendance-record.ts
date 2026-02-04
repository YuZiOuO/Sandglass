import { useMutation, useQuery } from '@tanstack/vue-query'
import { authClient, client } from './common'
import type { InferRequestType } from 'hono'

export function useAttendaceRecordTodayQuery() {
  return useQuery({
    queryKey: ['attendance', 'today'],
    queryFn: async () => {
      const cli = await authClient()
      const res = await cli.attendanceRecord.today.$get({})
      const data = await res.json()
      return data
    },
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
  })
}
