<template>
  <div style="width: 100%; height: 400px">
    <VChart class="chart" :option="chartOptions"> </VChart>
  </div>
</template>

<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import { computed } from 'vue'
import { computeWorkTimeOfToday, groupByDate } from './hooks'
import { useAttendanceRecordQuery } from '@/services-composable/attendance-record'
import VChart from 'vue-echarts'

const attendanceRecordWithIn30days = useAttendanceRecordQuery('withIn30days')
const attendanceRecordByDate = computed(() => groupByDate(attendanceRecordWithIn30days.data.value))
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
        data: Array.from(attendanceRecordByDate.value.values()).map(
          (i) => computeWorkTimeOfToday(i) / 1000 / 3600,
        ),
      },
    ],
  }
})
</script>
