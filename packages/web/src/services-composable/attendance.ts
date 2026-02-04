import { useQuery } from '@tanstack/vue-query'
import { authClient } from './common'

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

export function useLeaveRecordTodayQuery() {
  return useQuery({
    queryKey: ['attendance', 'leave', 'today'],
    queryFn: async () => {
      const cli = await authClient()
      const res = await cli.attendanceTarget.leave.today.$get()
      const data = await res.json()
      return data
    },
  })
}

export function useAttendanceTargetQuery() {
  return useQuery({
    queryKey: ['attendance', 'target'],
    queryFn: async () => {
      const cli = await authClient()
      const res = await cli.attendanceTarget.$get()
      const data = await res.json()
      return data
    },
  })
}
