<template>
  <NTime :time="current_time.getTime()" format="PPP  ·  eeee  ·  " />
  <NDivider style="margin: 1%" />
  <NFlex :wrap="false" :align="'center'" v-if="attendanceStatus.data.value">
    <NTag :type="attendanceStatus2TagType[attendanceStatus.data.value]" :bordered="false">
      {{ attendanceStatus2TagString[attendanceStatus.data.value] }}
    </NTag>
    <NProgress
      :status="percentage >= 1 ? 'success' : undefined"
      :percentage="percentage"
      :processing="attendanceStatus.data.value === 'IN'"
      indicator-placement="inside"
      style="margin: 1%; padding: 1%"
    />
  </NFlex>
  <NSkeleton :size="'large'" v-else />
  <NDivider style="margin: 1%" />
  <NGrid :cols="4">
    <NGi>
      <NStatistic label="今日累计" value="7.5">
        <template #suffix>h</template>
      </NStatistic>
    </NGi>
    <NGi>
      <NStatistic label="距离达标" value="0.5">
        <template #suffix>h</template>
      </NStatistic>
    </NGi>
    <NGi>
      <NStatistic label="本周累计" value="0.5">
        <template #suffix>h</template>
      </NStatistic>
    </NGi>
    <NGi>
      <NStatistic label="本月累计" value="0.5">
        <template #suffix>h</template>
      </NStatistic>
    </NGi>
  </NGrid>
</template>

<script setup lang="ts">
import {
  useAttendanceRecordQuery,
  useAttendanceLatestStatus,
  type AttendanceRecord,
} from '@/services-composable/attendance-record'
import { useAttendanceTargetQuery } from '@/services-composable/attendance-target'
import { useNow } from '@vueuse/core'
import {
  NTime,
  NProgress,
  NDivider,
  NStatistic,
  NGrid,
  NGi,
  NFlex,
  NTag,
  NSkeleton,
} from 'naive-ui'
import { computeWorkTimeOfToday } from './hooks'
import { computed } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useWorkTimeOfToday = (records: AttendanceRecord[] | undefined, _ticks: Date) => {
  if (!records) {
    return 0
  }
  return computeWorkTimeOfToday(records)
}
const attendanceStatus = useAttendanceLatestStatus()
const attendanceStatus2TagString: Record<AttendanceRecord['type'], string> = {
  IN: '工作中',
  OUT: '空闲中',
  PAUSE: '休息中',
} as const
const attendanceStatus2TagType = {
  IN: 'success',
  OUT: 'info',
  PAUSE: 'warning',
} as const

const current_time = useNow()
const attendanceRecordToday = useAttendanceRecordQuery('today')

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
