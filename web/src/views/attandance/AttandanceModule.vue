<template>
  <NTime :time="current_time.getTime()" format="PPPP"> </NTime>
  <div></div>
  <NTime :time="current_time.getTime()" format="HH:mm:ss"> </NTime>
  <NButton>打上班卡</NButton>
  <NButton>打下班卡</NButton>
</template>

<script setup lang="ts">
import { useNow } from '@vueuse/core'
import { NButton, NTime } from 'naive-ui'

const current_time = useNow()
</script>
