import { useMutation, useQuery } from '@tanstack/vue-query'
import type { InferRequestType } from 'hono'
import {
  cli,
  globalQueryClient,
  processHonoResponse,
  useAuthStatus,
  type FixUnknownDate,
} from './common'
import { attendanceKeys } from './attendance-record'

const targetKeys = {
  namespace: [...attendanceKeys.namesapce, 'target'] as const,
  leave: () => [...targetKeys.namespace, 'leave'] as const,
}

export function useAttendanceTargetQuery() {
  return useQuery({
    queryKey: targetKeys.namespace,
    queryFn: async () => {
      const res = await cli.attendanceTarget.$get()
      return await processHonoResponse(res)
    },
    enabled: () => useAuthStatus().value,
  })
}

export function useLeaveRecordTodayQuery() {
  return useQuery({
    queryKey: targetKeys.leave(),
    queryFn: async () => {
      const res = await cli.attendanceTarget.leave.today.$get()
      return await processHonoResponse(res)
    },
    enabled: () => useAuthStatus().value,
  })
}

export type AttendanceTargetUpdateDTO = InferRequestType<typeof cli.attendanceTarget.$put>
export function useAttendanceTargetUpdateMutate() {
  return useMutation({
    mutationFn: async (dto: AttendanceTargetUpdateDTO) => {
      const res = await cli.attendanceTarget.$put(dto)
      return await processHonoResponse(res)
    },
    onSuccess: async () => globalQueryClient.invalidateQueries({ queryKey: targetKeys.namespace }),
  })
}

export type LeaveRecordCreateDTO = FixUnknownDate<
  InferRequestType<typeof cli.attendanceTarget.leave.$put>['json'],
  'date'
>
export function useLeaveRecordCreateMutate() {
  return useMutation({
    mutationFn: async (dto: LeaveRecordCreateDTO) => {
      const res = await cli.attendanceTarget.leave.$put({ json: dto })
      return await processHonoResponse(res)
    },
    onSuccess: async () => globalQueryClient.invalidateQueries({ queryKey: targetKeys.leave() }),
  })
}
