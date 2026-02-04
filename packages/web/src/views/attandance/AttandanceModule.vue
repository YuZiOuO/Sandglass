<template>
  <NTime :time="current_time.getTime()" format="PPPP"> </NTime>
  <div></div>
  <NTime :time="current_time.getTime()" format="HH:mm:ss"> </NTime>
  <NButton @click="() => checkInOrOut('IN')">打上班卡</NButton>
  <NButton @click="() => checkInOrOut('PAUSE')">暂停</NButton>
  <NButton @click="() => checkInOrOut('OUT')">打下班卡</NButton>
  <NInput v-model:value="clockDescription" placeholder="事由"></NInput>
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

  <NInput :placeholder="'输入要修改的目标值'" v-model:value="inputTarget"> </NInput>
  <NButton
    @click="
      async () => {
        client.attendanceTarget.$put(
          { json: { timeMs: Number(inputTarget) } },
          { headers: await useAuthHeader() },
        )
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
  />

  <NButton @click="() => leaveRecordToday.refetch()" :loading="leaveRecordToday.isFetching.value"
    >今日请假</NButton
  >
  <div>
    {{ leaveRecordToday.data.value }}
  </div>

  <NDatePicker v-model:formatted-value="datepickerInput" value-format="yyyy-MM-dd" type="date" />
  <NInputNumber :placeholder="'小时数'" v-model:value="leaveHoursInput" />
  <NButton @click="triggerLeave">请假</NButton>
</template>

<script setup lang="ts">
import { useNow } from '@vueuse/core'
import { NButton, NTime, NSplit, NInput, NProgress, NDatePicker, NInputNumber } from 'naive-ui'
import { useAccessToken } from '@/services-composable/firebase'
import type { AppType } from '@sandglass/api'
import { hc, type InferResponseType } from 'hono/client'
import { ref } from 'vue'
import { computeWorkTimeOfToday } from './hooks'
import {
  useAttendaceRecordTodayQuery,
  useAttendanceTargetQuery,
  useLeaveRecordTodayQuery,
} from '@/services-composable/attendance'

async function useAuthHeader() {
  return { Authorization: 'Bearer ' + (await useAccessToken()) }
}

const client = hc<AppType>(import.meta.env.SG_WEB_API_BASEURL)

const attendanceRecordToday = useAttendaceRecordTodayQuery()

const clockDescription = ref<string | null>(null)
const checkInOrOut = async (type: 'IN' | 'OUT' | 'PAUSE') => {
  const res = await client.attendanceRecord.$post(
    { json: { time: new Date(), type: type, summary: clockDescription.value } },
    { headers: await useAuthHeader() },
  )
  console.log(res)
}

export type AttendanceRecord = InferResponseType<typeof client.attendanceRecord.today.$get>[number]

const current_time = useNow()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useWorkTimeOfToday = (records: AttendanceRecord[] | undefined, _ticks: Date) => {
  if (!records) {
    return 0
  }
  return computeWorkTimeOfToday(records)
}

const attendanceTarget = useAttendanceTargetQuery()

const inputTarget = ref<string>()

const leaveRecordToday = useLeaveRecordTodayQuery()

const datepickerInput = ref<string | null>(null)
const leaveHoursInput = ref<number | null>(null)
const triggerLeave = async () => {
  const res = await client.attendanceTarget.leave.$put(
    {
      json: {
        date: datepickerInput.value!,
        timeMs: leaveHoursInput.value! * 3600 * 1000,
        summary: 'test',
      },
    },
    { headers: await useAuthHeader() },
  )
  console.log(await res.json())
}
</script>
