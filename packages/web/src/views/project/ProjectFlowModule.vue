<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NTimeline, NTimelineItem } from 'naive-ui'
import { useGoogleCalendarEventsQuery } from '@/services-composable/google-calendar'
import { useAttendanceRecordQuery } from '@/services-composable/attendance-record'

const props = defineProps<{
  calendarId?: string
}>()

const { data: calendarEvents } = useGoogleCalendarEventsQuery(computed(() => props.calendarId || ''))
const { data: attendanceRecords } = useAttendanceRecordQuery('withIn30days')

// Combine tasks, calendar, and mock git for Flow
const flowItems = computed(() => {
  const items: any[] = []
  
  // Add recent calendar events
  const events = (calendarEvents.value as any)?.items
  if (events) {
    events.forEach((event: any) => {
      if (event.start?.dateTime) {
        items.push({
          type: 'event',
          time: new Date(event.start.dateTime),
          content: `📅 ${event.summary}`,
          color: 'info'
        })
      }
    })
  }

  // Add Attendance punches
  if (attendanceRecords.value) {
    (attendanceRecords.value as any[]).forEach((record: any) => {
      items.push({
        type: 'attendance',
        time: new Date(record.time), 
        content: record.type === 'IN' ? '⏱️ 开始专注' : '☕ 休息/结束',
        color: record.type === 'IN' ? 'success' : 'warning'
      })
    })
  }

  // Mock GitHub push
  items.push({
    type: 'git',
    time: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    content: '[GitHub] push code',
    color: 'grey'
  })

  // Sort by time desc
  return items.sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5)
})

// Format Helper
const formatTime = (date: Date) => {
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}
</script>

<template>
  <n-card size="small" title="3. 动态沉淀轴 (Flow)">
    <div class="py-2">
      <n-timeline>
        <n-timeline-item
          v-for="(item, index) in flowItems"
          :key="index"
          :type="item.color as any"
          :title="item.content"
          :time="formatTime(item.time)"
        />
      </n-timeline>
      <div v-if="flowItems.length === 0" class="text-gray-400 text-sm text-center">暂无动态</div>
    </div>
  </n-card>
</template>
