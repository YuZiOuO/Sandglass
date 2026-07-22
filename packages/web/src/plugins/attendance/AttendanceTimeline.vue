<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NEmpty, NPopconfirm, NTag, NTimeline, NTimelineItem } from 'naive-ui'

import type { AttendanceRecord } from '@/capability/attendance'

const props = defineProps<{
  records: readonly AttendanceRecord[]
  onRemove: (id: string) => void
}>()

const groups = computed(() => {
  const grouped = new Map<string, readonly AttendanceRecord[]>()
  for (const record of props.records) {
    const date = record.time.toLocaleDateString()
    grouped.set(date, [...(grouped.get(date) ?? []), record])
  }
  return [...grouped.entries()].reverse()
})

const labels = {
  IN: '签到 / 恢复',
  PAUSE: '暂停',
  OUT: '签退',
} as const

const tagTypes = {
  IN: 'success',
  PAUSE: 'warning',
  OUT: 'info',
} as const
</script>

<template>
  <n-empty v-if="!records.length" description="暂无考勤记录。" />
  <n-timeline v-else>
    <template v-for="[date, dayRecords] in groups" :key="date">
      <n-timeline-item
        v-for="record in dayRecords"
        :key="record.id"
        :time="record.time.toLocaleTimeString()"
      >
        <template #header>
          <span>{{ date }}</span>
        </template>
        <n-tag :type="tagTypes[record.type]" size="small">{{ labels[record.type] }}</n-tag>
        <n-popconfirm @positive-click="props.onRemove(record.id)">
          <template #trigger>
            <n-button size="tiny" quaternary type="error">删除</n-button>
          </template>
          删除这条考勤记录？
        </n-popconfirm>
      </n-timeline-item>
    </template>
  </n-timeline>
</template>
