<template>
  <n-grid :cols="2" x-gap="12">
    <n-gi>
      <div class="left">
        <NH3><NTime :time="current_time.getTime()" format="PPPP"> </NTime></NH3>
        <NH1 style="font-family: 'Segoe UI', 'PingFang SC', sans-serif;"><NTime :time="current_time.getTime()" format="HH:mm:ss"> </NTime></NH1>
        <NButton
          @click="() => attendanceTarget.refetch()"
          :loading="attendanceTarget.isFetching.value"
          >每日目标</NButton
        >
        <div>{{ attendanceTarget.data.value }}</div>
      </div>
    </n-gi>
    <n-gi>
      <div class="right">
        <NProgress
          type="circle"
          :status="percentage >= 1 ? 'success' : undefined"
          :percentage="percentage"
          :processing="attendanceRecordToday.data.value?.at(-1)?.type == 'IN'"
        />
        <div>
          今日已记录毫秒数: {{ useWorkTimeOfToday(attendanceRecordToday.data.value, current_time) }}
        </div>
      </div>
    </n-gi>
  </n-grid>

  <NButton @click="() => leaveRecordToday.refetch()" :loading="leaveRecordToday.isFetching.value"
    >今日请假</NButton
  >
  <div>
    {{ leaveRecordToday.data.value }}
  </div>
</template>

<script setup lang="ts">
import { useAttendaceRecordQuery, type AttendanceRecord } from '@/services-composable/attendance-record'
import {
  useAttendanceTargetQuery,
  useLeaveRecordTodayQuery,
} from '@/services-composable/attendance-target'
import { useNow } from '@vueuse/core'
import { NTime, NButton, NProgress, NGrid, NGi, NH2,NH3,NH1 } from 'naive-ui'
import { computeWorkTimeOfToday } from './hooks'
import { computed } from 'vue'



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

const percentage = computed(() => {
  if (!attendanceTarget.data.value || !attendanceRecordToday.data.value) {
    return 0
  }

  const raw =
    (useWorkTimeOfToday(attendanceRecordToday.data.value, current_time.value) /
      attendanceTarget.data.value.timeMs) *
    100

  return Math.round(raw * 10) / 10 // to .1 precision
})
</script>

<style>
.left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
