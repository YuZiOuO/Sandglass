import { useMutation, useQuery } from '@tanstack/vue-query'
import type { InferRequestType } from 'hono'
import { cli, processHonoResponse, type FixUnknownDate } from './common'

export function useAttendanceTargetQuery() {
  return useQuery({
    queryKey: ['attendance', 'target'],
    queryFn: async () => {
      const res = await cli.attendanceTarget.$get()
      return await processHonoResponse(res)
    },
  })
}

export function useLeaveRecordTodayQuery() {
  return useQuery({
    queryKey: ['attendance', 'leave', 'today'],
    queryFn: async () => {
      const res = await cli.attendanceTarget.leave.today.$get()
      return await processHonoResponse(res)
    },
  })
}

export type AttendanceTargetUpdateDTO = InferRequestType<typeof cli.attendanceTarget.$put>
export function useAttendanceTargetUpdateMutate() {
  return useMutation({
    mutationKey: ['attendance', 'target'],
    mutationFn: async (dto: AttendanceTargetUpdateDTO) => {
      const res = await cli.attendanceTarget.$put(dto)
      return await processHonoResponse(res)
    },
  })
}

export type LeaveRecordCreateDTO = FixUnknownDate<
  InferRequestType<typeof cli.attendanceTarget.leave.$put>['json'],
  'date'
>
export function useLeaveRecordCreateMutate() {
  return useMutation({
    mutationKey: ['attendance'],
    mutationFn: async (dto: LeaveRecordCreateDTO) => {
      const res = await cli.attendanceTarget.leave.$put({ json: dto })
      return await processHonoResponse(res)
    },
  })
}
