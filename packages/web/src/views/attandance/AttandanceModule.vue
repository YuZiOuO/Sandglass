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
</template>

<script setup lang="ts">
import { useNow } from '@vueuse/core'
import { NButton, NTime, NSplit } from 'naive-ui'
import { useAccessToken } from '@/services-composable/firebase'
import type { AppType } from '@sandglass/apiv1'
import { hc, type InferResponseType } from 'hono/client'
import { ref } from 'vue'

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

const recordsOfToday = ref<InferResponseType<typeof client.attendanceRecord.today.$get>>([])
const todayButtonLoading = ref(false)
const getData = async () => {
  todayButtonLoading.value = true
  const res = await client.attendanceRecord.today.$get({}, { headers: await useAuthHeader() })
  recordsOfToday.value = await res.json()
  todayButtonLoading.value = false
}

const current_time = useNow()
</script>
