<template>
  <NTime :time="current_time.getTime()" format="PPPP"> </NTime>
  <div></div>
  <NTime :time="current_time.getTime()" format="HH:mm:ss"> </NTime>
  <NButton
    @click="
      async () => {
        attendanceRecordCreateRef.json.type = 'IN'
        attendanceRecordCreate.mutate(attendanceRecordCreateRef)
      }
    "
    >打上班卡</NButton
  >
  <NButton
    @click="
      async () => {
        attendanceRecordCreateRef.json.type = 'PAUSE'
        attendanceRecordCreate.mutate(attendanceRecordCreateRef)
      }
    "
    >暂停</NButton
  >
  <NButton
    @click="
      async () => {
        attendanceRecordCreateRef.json.type = 'OUT'
        attendanceRecordCreate.mutate(attendanceRecordCreateRef)
      }
    "
    >打下班卡</NButton
  >
  <NInput v-model:value="attendanceRecordCreateRef.json.summary" placeholder="事由"></NInput>
  <NButton
    @click="async () => attendanceRecordToday.refetch()"
    :loading="attendanceRecordToday.isFetching.value"
    >今日打卡记录</NButton
  >
  <div v-for="r in attendanceRecordToday.data.value" :key="r.time">
    <NSplit />
    您于{{ new Date(r.time).toLocaleString() }} {{ r.type }},事由:{{ r.summary }}
  </div>

  <div>
    今日已记录毫秒数: {{ useWorkTimeOfToday(attendanceRecordToday.data.value, current_time) }}
  </div>

  <NInputNumber
    :placeholder="'输入要修改的目标值'"
    v-model:value="attendanceTargetUpdateRef.json.timeMs"
  >
  </NInputNumber>
  <NButton
    @click="
      () => {
        attendanceTargetUpdate.mutate(attendanceTargetUpdateRef)
      }
    "
    >修改目标</NButton
  >

  <NButton @click="() => attendanceTarget.refetch()" :loading="attendanceTarget.isFetching.value"
    >每日目标</NButton
  >
  <div>{{ attendanceTarget.data.value }}</div>
  <NProgress
    v-if="attendanceTarget.isFetched && leaveRecordToday.data.value?.timeMs"
    :percentage="
      (useWorkTimeOfToday(attendanceRecordToday.data.value, current_time) /
        leaveRecordToday.data.value.timeMs) *
      100
    "
    :processing="attendanceRecordToday.data.value?.at(-1)?.type == 'IN'"
  />

  <NButton @click="() => leaveRecordToday.refetch()" :loading="leaveRecordToday.isFetching.value"
    >今日请假</NButton
  >
  <div>
    {{ leaveRecordToday.data.value }}
  </div>

  <NDatePicker
    v-model:formatted-value="leaveRecordCreateRef.json.date as FormattedValue"
    value-format="yyyy-MM-dd"
    type="date"
  />
  <NInputNumber :placeholder="'小时数'" v-model:value="leaveRecordCreateRef.json.timeMs" />
  <NButton
    @click="
      () => {
        leaveRecordCreateRef.json.timeMs *= 3600 * 1000
        leaveRecordCreate.mutate(leaveRecordCreateRef)
      }
    "
    >请假</NButton
  >
  <div style="width: 100%; height: 400px">
    <VChart class="chart" :option="chartOptions"> </VChart>
  </div>
  {{}}
</template>

<script setup lang="ts">
import { useNow } from '@vueuse/core'
import { NButton, NTime, NSplit, NInput, NProgress, NDatePicker, NInputNumber } from 'naive-ui'
import { type InferResponseType } from 'hono/client'
import { computed, ref } from 'vue'
import { computeWorkTimeOfToday, groupByDate } from './hooks'
import {
  useAttendaceRecordCreateMutate,
  useAttendaceRecordQuery,
  type AttendanceRecordCreateDTO,
} from '@/services-composable/attendance-record'
import {
  useAttendanceTargetQuery,
  useAttendanceTargetUpdateMutate,
  useLeaveRecordCreateMutate,
  useLeaveRecordTodayQuery,
  type AttendanceTargetUpdateDTO,
  type LeaveRecordCreateDTO,
} from '@/services-composable/attendance-target'
import type { FormattedValue } from 'naive-ui/es/date-picker/src/interface'
import type { client } from '@/services-composable/common'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'

const attendanceRecordToday = useAttendaceRecordQuery('today')
const attendanceRecordWithIn7days = useAttendaceRecordQuery('withIn7days')

const attendanceRecordCreate = useAttendaceRecordCreateMutate()
const attendanceRecordCreateRef = ref<AttendanceRecordCreateDTO>({
  json: {
    time: new Date(),
    type: 'IN',
  },
})

export type AttendanceRecord = InferResponseType<typeof client.attendanceRecord.$get>[number]

const current_time = useNow()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useWorkTimeOfToday = (records: AttendanceRecord[] | undefined, _ticks: Date) => {
  if (!records) {
    return 0
  }
  return computeWorkTimeOfToday(records)
}

const attendanceTarget = useAttendanceTargetQuery()

const leaveRecordToday = useLeaveRecordTodayQuery()

const leaveRecordCreate = useLeaveRecordCreateMutate()
const leaveRecordCreateRef = ref<LeaveRecordCreateDTO>({
  json: { date: null, timeMs: 0 },
})

const attendanceTargetUpdate = useAttendanceTargetUpdateMutate()
const attendanceTargetUpdateRef = ref<AttendanceTargetUpdateDTO>({ json: { timeMs: 0 } })

const attendanceRecordByDate = computed(() => groupByDate(attendanceRecordWithIn7days.data.value))
const chartOptions = computed<EChartsOption>(() => {
  return {
    xAxis: {
      type: 'category',
      data: Array.from(attendanceRecordByDate.value.keys()),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        type: 'bar',
        data: Array.from(attendanceRecordByDate.value.values()).map((i) =>
          computeWorkTimeOfToday(i),
        ),
      },
    ],
  }
})
</script>
