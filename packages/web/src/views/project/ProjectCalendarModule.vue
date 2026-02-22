<script setup lang="ts">
import { NCard, NEmpty } from 'naive-ui'

defineProps<{
  calendarId?: string
}>()
</script>

<template>
  <n-card size="small" title="4. 沉淀历 (Calendar)">
    {{ calendarId }}
    <n-empty></n-empty>
  </n-card>
</template>
