<!-- AI 生成模块（主要代码由 AI 生成） -->
<script setup lang="ts">
import { computed } from 'vue'
import { useAttendanceRecordQuery } from '@/services-composable/attendance-record'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { CustomChart, LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent } from 'echarts/components'
import { NSpin, NEmpty } from 'naive-ui'
import type { AttendanceRecordQueryType } from '@/services-composable/attendance-record'

use([CanvasRenderer, CustomChart, LineChart, TooltipComponent, GridComponent])

const props = defineProps<{
  projectId: string
  rangeType: AttendanceRecordQueryType
}>()
const dayMs = 24 * 60 * 60 * 1000
const smoothKernel = [1, 4, 6, 4, 1]
const smoothKernelWeight = smoothKernel.reduce((acc, n) => acc + n, 0)

const { data: records, isLoading } = useAttendanceRecordQuery(
  computed(() => props.projectId),
  computed(() => props.rangeType),
)

const hourlyDurations = computed(() => {
  if (!records.value?.length) return []

  const buckets = Array.from({ length: 24 }, (_, hour) => ({ hour, duration: 0 }))
  const sortedRecords = [...records.value].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
  )
  let currentStart: Date | null = null

  const addToBucket = (hour: number, ms: number) => {
    if (hour >= 0 && hour < 24) buckets[hour].duration += ms
  }

  for (const record of sortedRecords) {
    const recordTime = parseRecordTime(record.time)
    if (record.type === 'IN') {
      currentStart = recordTime
    } else if (['OUT', 'PAUSE'].includes(record.type) && currentStart) {
      processDuration(currentStart, recordTime, addToBucket)
      currentStart = null
    }
  }

  if (currentStart) {
    const now = new Date()
    if (now.getTime() - currentStart.getTime() < dayMs) {
      processDuration(currentStart, now, addToBucket)
    }
  }

  return buckets
})

const smoothedHours = computed(() => {
  const raw = hourlyDurations.value
  if (!raw.length) return []

  const smoothed = raw.map((bucket, index) => {
    let weighted = 0
    for (let k = -2; k <= 2; k += 1) {
      const target = index + k
      if (target >= 0 && target < raw.length) {
        weighted += raw[target].duration * smoothKernel[k + 2]
      }
    }

    return {
      hour: bucket.hour,
      duration: bucket.duration,
      smooth: weighted / smoothKernelWeight,
    }
  })

  const maxSmooth = Math.max(...smoothed.map((item) => item.smooth), 1)
  return smoothed.map((item) => ({
    ...item,
    normalized: item.smooth / maxSmooth,
  }))
})

const chartOption = computed(() => {
  const rows = smoothedHours.value
  if (!rows.length) return null

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const index = params.dataIndex ?? 0
        const row = rows[index]
        if (!row) return ''

        const mins = Math.round(row.duration / 60000)
        const score = Math.round(row.normalized * 100)
        const nextHour = (row.hour + 1) % 24

        return `
          <div style="font-weight:bold">${row.hour.toString().padStart(2, '0')}:00 - ${nextHour.toString().padStart(2, '0')}:00</div>
          <div>累计专注: ${mins} 分钟</div>
          <div>热点强度: ${score}%</div>
        `
      },
    },
    grid: {
      top: 30,
      bottom: 30,
      left: 6,
      right: 10,
    },
    xAxis: {
      type: 'value',
      min: 0,
      max: 1.1,
      splitLine: { show: false },
      axisLabel: { show: false },
      axisTick: { show: false },
      axisLine: { show: false },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 24,
      inverse: true,
      splitLine: { show: false },
      axisLabel: { show: false },
      axisTick: { show: false },
      axisLine: { show: false },
    },
    series: [
      {
        type: 'custom',
        silent: true,
        data: [0],
        renderItem: (_params: any, api: any) => {
          const curvePoints = rows.map((row) => api.coord([row.normalized, row.hour + 0.5]))
          const baselinePoints = rows
            .slice()
            .reverse()
            .map((row) => api.coord([0, row.hour + 0.5]))

          return {
            type: 'polygon',
            shape: {
              points: [...curvePoints, ...baselinePoints],
            },
            style: {
              fill: 'rgba(84, 112, 198, 0.20)',
            },
          }
        },
      },
      {
        type: 'line',
        smooth: 0.45,
        showSymbol: true,
        symbolSize: 6,
        lineStyle: {
          width: 2,
          color: '#5470c6',
        },
        itemStyle: {
          color: '#5470c6',
        },
        data: rows.map((row) => [row.normalized, row.hour + 0.5]),
      },
    ],
  }
})

function processDuration(start: Date, end: Date, addFn: (hour: number, ms: number) => void) {
  let current = new Date(start)
  while (current < end) {
    const currentHour = current.getHours()
    const nextHour = new Date(current)
    nextHour.setHours(currentHour + 1, 0, 0, 0)

    const segmentEnd = nextHour < end ? nextHour : end
    addFn(currentHour, segmentEnd.getTime() - current.getTime())
    current = segmentEnd
  }
}

function parseRecordTime(time: string | number | Date) {
  if (typeof time === 'string' && time.endsWith('Z')) {
    return new Date(time.slice(0, -1))
  }
  return new Date(time)
}
</script>

<template>
  <div class="distribution-container">
    <div v-if="isLoading" class="loading-state">
      <NSpin size="small" />
    </div>
    <div v-else-if="!chartOption" class="empty-state">
      <NEmpty size="small" description="暂无热点" />
    </div>
    <VChart v-else class="chart" :option="chartOption" autoresize />
  </div>
</template>

<style scoped>
.distribution-container {
  height: 320px;
  width: 100%;
  position: relative;
}

.loading-state,
.empty-state {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart {
  height: 100%;
  width: 100%;
}
</style>
