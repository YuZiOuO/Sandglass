import { useMutation, useQuery } from '@tanstack/vue-query'
import { authClient, client } from './common'
import type { InferRequestType } from 'hono'

type AttendanceRecordQueryType = "today" | "withIn7days" | "withIn30days"
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
