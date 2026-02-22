import { useMutation, useQuery } from '@tanstack/vue-query'
import type { InferRequestType } from 'hono'
import { cli } from './common'

export function useAttendanceTargetQuery() {
  return useQuery({
    queryKey: ['attendance', 'target'],
    queryFn: async () => {
      const res = await cli.attendanceTarget.$get()
      const data = await res.json()
      return data
    },
  })
}

export function useLeaveRecordTodayQuery() {
  return useQuery({
    queryKey: ['attendance', 'leave', 'today'],
    queryFn: async () => {
      const res = await cli.attendanceTarget.leave.today.$get()
      const data = await res.json()
      return data
    },
  })
}

export type AttendanceTargetUpdateDTO = InferRequestType<typeof cli.attendanceTarget.$put>
export function useAttendanceTargetUpdateMutate() {
  return useMutation({
    mutationKey: ['attendance', 'target'],
    mutationFn: async (dto: AttendanceTargetUpdateDTO) => {
      await cli.attendanceTarget.$put(dto)
    },
  })
}

export type LeaveRecordCreateDTO = InferRequestType<typeof cli.attendanceTarget.leave.$put>
export function useLeaveRecordCreateMutate() {
  return useMutation({
    mutationKey: ['attendance'],
    mutationFn: async (dto: LeaveRecordCreateDTO) => {
      await cli.attendanceTarget.leave.$put(dto)
    },
  })
}
