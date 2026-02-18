<script setup lang="ts">
import { computed } from 'vue'
import { NCard } from 'naive-ui'
import { useAttendanceRecordQuery } from '@/services-composable/attendance-record'

const { data: attendanceRecords } = useAttendanceRecordQuery('withIn30days')

// Heatmap Data (Mock logic based on attendance)
const heatmapData = computed(() => {
  const days = []
  const today = new Date()
  for (let i = 0; i < 35; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    // Find records for this day
    const records = attendanceRecords.value as any[] | undefined
    const count = records?.filter((r: any) => {
      const rd = new Date(r.time)
      return rd.getDate() === d.getDate() && rd.getMonth() === d.getMonth()
    }).length || 0
    
    let intensity = 'bg-gray-200'
    if (count > 0) intensity = 'bg-green-200'
    if (count > 2) intensity = 'bg-green-400'
    if (count > 5) intensity = 'bg-green-600'
    
    days.push({ date: d, intensity })
  }
  return days.reverse()
})
</script>

<template>
  <n-card size="small" title="[ 效率热力图 ]">
    <div class="grid grid-cols-7 gap-1 p-2">
      <div 
        v-for="(day, i) in heatmapData" 
        :key="i"
        class="w-full pt-[100%] relative rounded-sm"
        :class="day.intensity"
        :title="day.date.toLocaleDateString()"
      ></div>
    </div>
  </n-card>
</template>
