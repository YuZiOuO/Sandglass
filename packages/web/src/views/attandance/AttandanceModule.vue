<template>
  <NTime :time="current_time.getTime()" format="PPPP"> </NTime>
  <div></div>
  <NTime :time="current_time.getTime()" format="HH:mm:ss"> </NTime>
  <NButton @click="test">打上班卡</NButton>
  <NButton>打下班卡</NButton>
</template>

<script setup lang="ts">
import { useNow } from '@vueuse/core'
import { NButton, NTime } from 'naive-ui'
import { useAccessToken } from '@/services-composable/firebase'
import type { AppType } from '@sandglass/apiv1'
import { hc } from 'hono/client'

const client = hc<AppType>(import.meta.env.SG_WEB_APIV1_BASEURL)
const test = async () => {
  const res = await client.attendanceRecord.$post(
    { json: { time: new Date(), type: 'IN' } },
    { headers: { Authorization: 'Bearer ' + (await useAccessToken()) } },
  )
  console.log(res)
}

const current_time = useNow()
</script>
