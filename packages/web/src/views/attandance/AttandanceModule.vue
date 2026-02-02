<template>
  <NTime :time="current_time.getTime()" format="PPPP"> </NTime>
  <div></div>
  <NTime :time="current_time.getTime()" format="HH:mm:ss"> </NTime>
  <NButton @click="() => checkInOrOut('IN')">打上班卡</NButton>
  <NButton @click="() => checkInOrOut('OUT')">打下班卡</NButton>

  <NButton @click="getData" :loading="todayButtonLoading">查询今日打卡记录</NButton>
  <div v-for="r in recordsOfToday" :key="r.time">
    <NSplit />
    您于{{ new Date(r.time).toLocaleString() }} {{ r.type == 'IN' ? '签到' : '签退' }}
  </div>

  <div>今日已记录毫秒数: {{ useWorkTimeOfToday(recordsOfToday, current_time) }}</div>

  <NInput
    :placeholder="'输入要修改的目标值'"
    @input="
      async (c) => {
        inputTarget = c
      }
    "
  >
  </NInput>
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

  <NButton
    @click="
      async () => {
        const data = await (
          await client.attendanceTarget.$get({}, { headers: await useAuthHeader() })
        ).json()
        target = data?.timeMs ?? null
      }
    "
    >获取目标</NButton
  >
  <div>当前设定的每日目标: {{ target }}</div>
  <NProgress
    v-if="target"
    :percentage="(useWorkTimeOfToday(recordsOfToday, current_time) / target) * 100"
  />

  <NButton @click="useLeaveOfToday">查询今日请假</NButton>
  <div>
    今日请假记录
    {{ leaveOfToday }}
  </div>
</template>

<script setup lang="ts">
import { useNow } from '@vueuse/core'
import { NButton, NTime, NSplit, NInput, NProgress } from 'naive-ui'
import { useAccessToken } from '@/services-composable/firebase'
import type { AppType } from '@sandglass/apiv1'
import { hc, type InferResponseType } from 'hono/client'
import { ref } from 'vue'
import { computeWorkTimeOfToday } from './hooks'
import type { AttendanceLeaveRecord } from '../../../../schema/generated/prisma/client'

async function useAuthHeader() {
  return { Authorization: 'Bearer ' + (await useAccessToken()) }
}

const client = hc<AppType>(import.meta.env.SG_WEB_APIV1_BASEURL)
const checkInOrOut = async (type: 'IN' | 'OUT') => {
  const res = await client.attendanceRecord.$post(
    { json: { time: new Date(), type: type } },
    { headers: await useAuthHeader() },
  )
  console.log(res)
}

export type AttendanceRecord = InferResponseType<typeof client.attendanceRecord.today.$get>[number]

const recordsOfToday = ref<AttendanceRecord[]>([])
const todayButtonLoading = ref(false)
const getData = async () => {
  todayButtonLoading.value = true
  const res = await client.attendanceRecord.today.$get({}, { headers: await useAuthHeader() })
  recordsOfToday.value = await res.json()
  todayButtonLoading.value = false
}

const current_time = useNow()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useWorkTimeOfToday = (records: AttendanceRecord[], _ticks: Date) => {
  return computeWorkTimeOfToday(records)
}

const target = ref<number | null>(null)
const inputTarget = ref<string>()

type AttendanceLeaveRecord = InferResponseType<typeof client.attendanceTarget.leave.today.$get>
const leaveOfToday = ref<AttendanceLeaveRecord | null>(null)
const useLeaveOfToday = async () => {
  const res = await client.attendanceTarget.leave.today.$get({}, { headers: await useAuthHeader() })
  const data = await res.json()
  leaveOfToday.value = data
}
</script>
