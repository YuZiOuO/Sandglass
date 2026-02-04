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

export type LeaveRecordCreateDTO = InferRequestType<typeof client.attendanceTarget.leave.$put>
export function useLeaveRecordCreateMutate() {
  return useMutation({
    mutationKey: ['attendance'],
    mutationFn: async (dto: LeaveRecordCreateDTO) => {
      const cli = await authClient()
      await cli.attendanceTarget.leave.$put(dto)
    },
  })
}

export type AttendanceTargetUpdateDTO = InferRequestType<typeof client.attendanceTarget.$put>
export function useAttendanceTargetUpdateMutate() {
  return useMutation({
    mutationKey: ['attendance', 'target'],
    mutationFn: async (dto: AttendanceTargetUpdateDTO) => {
      const cli = await authClient()
      await cli.attendanceTarget.$put(dto)
    },
  })
}
