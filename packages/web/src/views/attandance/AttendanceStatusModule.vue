<template>
  <NTime :time="current_time.getTime()" format="PPPP"> </NTime>
  <div></div>
  <NTime :time="current_time.getTime()" format="HH:mm:ss"> </NTime>

<NProgress
    v-if="attendanceTarget.isFetched && leaveRecordToday.data.value?.timeMs"
    :percentage="
      (useWorkTimeOfToday(attendanceRecordToday.data.value, current_time) /
        leaveRecordToday.data.value.timeMs) *
      100
    "
    :processing="attendanceRecordToday.data.value?.at(-1)?.type == 'IN'"
  />
    <div>
    今日已记录毫秒数: {{ useWorkTimeOfToday(attendanceRecordToday.data.value, current_time) }}
  </div>

  <NButton @click="() => attendanceTarget.refetch()" :loading="attendanceTarget.isFetching.value"
    >每日目标</NButton
  >
  <div>{{ attendanceTarget.data.value }}</div>

    <NButton @click="() => leaveRecordToday.refetch()" :loading="leaveRecordToday.isFetching.value"
    >今日请假</NButton
  >
  <div>
    {{ leaveRecordToday.data.value }}
  </div>

</template>

<script setup lang="ts">
import { useAttendaceRecordQuery } from '@/services-composable/attendance-record';
import { useAttendanceTargetQuery, useLeaveRecordTodayQuery } from '@/services-composable/attendance-target';
import { useNow } from '@vueuse/core';
import { NTime,NButton,NProgress } from 'naive-ui';
import { computeWorkTimeOfToday } from './hooks';
import type { InferResponseType } from 'hono/client';
import type { client } from '@/services-composable/common';

export type AttendanceRecord = InferResponseType<typeof client.attendanceRecord.$get>[number]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useWorkTimeOfToday = (records: AttendanceRecord[] | undefined, _ticks: Date) => {
  if (!records) {
    return 0
  }
  return computeWorkTimeOfToday(records)
}

const current_time = useNow()
const attendanceRecordToday = useAttendaceRecordQuery('today')

const leaveRecordToday = useLeaveRecordTodayQuery()
const attendanceTarget = useAttendanceTargetQuery()
</script>
