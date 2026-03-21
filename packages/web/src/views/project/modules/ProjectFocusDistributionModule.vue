<!-- AI 生成模块（主要代码由 AI 生成） -->
<script setup lang="ts">
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { CustomChart, LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent } from 'echarts/components'
import { NSpin, NEmpty } from 'naive-ui'
import type {
  CallbackDataParams,
  CustomSeriesRenderItem,
} from 'echarts/types/dist/shared'
import type { TimeRange } from './ProjectFocusChartModule.vue'

use([CanvasRenderer, CustomChart, LineChart, TooltipComponent, GridComponent])

const props = defineProps<{
  ranges: TimeRange[]
  loading?: boolean
}>()

const ONE_MINUTE_MS = 60 * 1000
const ONE_HOUR_MS = 60 * 60 * 1000
const HOURS_PER_DAY = 24

// Gaussian-like kernel for smoothing hourly data
// Weights: Center=6, Neighbors=4, Far-neighbors=1
const SMOOTH_KERNEL = [1, 4, 6, 4, 1]
const SMOOTH_KERNEL_WEIGHT = SMOOTH_KERNEL.reduce((acc, n) => acc + n, 0)

const hourlyDurations = computed(() => {
  // 1. Initialize 24 buckets for each hour of the day
  const buckets = Array.from({ length: HOURS_PER_DAY }, (_, hour) => ({
    hour,
    duration: 0,
  }))

  // 2. Distribute duration of each time range into hour buckets
  for (const range of props.ranges) {
    let currentHour = Math.floor(range.startTime / ONE_HOUR_MS)
    let currentMs = range.startTime

    // Iterate through hours until we cover the entire range duration
    while (currentMs < range.endTime) {
      const nextHourStart = (currentHour + 1) * ONE_HOUR_MS
      
      // Determine the end of this segment: either the range end or the hour boundary
      const segmentEndMs = Math.min(range.endTime, nextHourStart)
      const duration = segmentEndMs - currentMs

      // Accumulate duration if valid hour index (0-23)
      if (currentHour >= 0 && currentHour < HOURS_PER_DAY) {
        buckets[currentHour].duration += duration
      }

      // Move to next segment
      currentMs = segmentEndMs
      currentHour++
    }
  }

  return buckets
})

const smoothedHours = computed(() => {
  const raw = hourlyDurations.value
  if (!raw.length) return []

  // 1. Apply Convolution Kernel for smoothing
  const smoothed = raw.map((bucket, index) => {
    let weighted = 0
    // Kernel window: [-2, -1, 0, 1, 2]
    for (let k = -2; k <= 2; k += 1) {
      const target = index + k
      // Only consider valid indices (no wrapping/padding logic for simplicity)
      if (target >= 0 && target < raw.length) {
        weighted += raw[target].duration * SMOOTH_KERNEL[k + 2]
      }
    }

    return {
      hour: bucket.hour,
      duration: bucket.duration,
      smooth: weighted / SMOOTH_KERNEL_WEIGHT,
    }
  })

  // 2. Normalize values to 0-1 range for plotting
  const maxSmooth = Math.max(...smoothed.map((item) => item.smooth), 1)
  return smoothed.map((item) => ({
    ...item,
    normalized: item.smooth / maxSmooth,
  }))
})

// Chart Configuration Constants
const CONFIG = {
  COLOR: '#5470c6',
  FILL_COLOR: 'rgba(84, 112, 198, 0.20)',
  LINE_WIDTH: 2,
  SYMBOL_SIZE: 6,
  SMOOTH_RATIO: 0.45,
  GRID: { TOP: 30, BOTTOM: 30, LEFT: 6, RIGHT: 10 },
  // Offset to center point within the hour slot (e.g. 12:30 for hour 12)
  OFFSET_CENTER: 0.5,
  X_AXIS_MAX: 1.1, // Slight padding for visualization
}

// Helper to format time range (e.g. "09:00 - 10:00")
const formatTimeRange = (hour: number) => {
  const next = (hour + 1) % HOURS_PER_DAY
  const fmt = (h: number) => h.toString().padStart(2, '0') + ':00'
  return `${fmt(hour)} - ${fmt(next)}`
}

const chartOption = computed(() => {
  const rows = smoothedHours.value
  if (!rows.length) return null

  // Custom renderer for the filled area background
  const renderArea: CustomSeriesRenderItem = (_params, api) => {
    // Top curve points
    const curvePoints = rows.map((row) =>
      api.coord([row.normalized, row.hour + CONFIG.OFFSET_CENTER]),
    )
    // Bottom baseline points (at x=0)
    const baselinePoints = rows
      .map((row) => api.coord([0, row.hour + CONFIG.OFFSET_CENTER]))
      .reverse()

    return {
      type: 'polygon',
      shape: { points: [...curvePoints, ...baselinePoints] },
      style: { fill: CONFIG.FILL_COLOR },
    }
  }

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: CallbackDataParams) => {
        const index = params.dataIndex ?? 0
        const row = rows[index]
        if (!row) return ''

        return [
          `<div style="font-weight:bold">${formatTimeRange(row.hour)}</div>`,
          `<div>累计专注: ${Math.round(row.duration / ONE_MINUTE_MS)} 分钟</div>`,
          `<div>热点强度: ${Math.round(row.normalized * 100)}%</div>`,
        ].join('')
      },
    },
    grid: {
      top: CONFIG.GRID.TOP,
      bottom: CONFIG.GRID.BOTTOM,
      left: CONFIG.GRID.LEFT,
      right: CONFIG.GRID.RIGHT,
    },
    // X-axis: Normalized intensity (0-1.1), hidden
    xAxis: {
      type: 'value',
      min: 0,
      max: CONFIG.X_AXIS_MAX,
      show: false,
    },
    // Y-axis: Hours (0-24), hidden but inverted (0 at top)
    yAxis: {
      type: 'value',
      min: 0,
      max: HOURS_PER_DAY,
      inverse: true,
      show: false,
    },
    series: [
      // Layer 1: Filled Area (Custom Shape)
      {
        type: 'custom',
        silent: true,
        data: [0], // Dummy data to trigger renderItem once
        renderItem: renderArea,
      },
      // Layer 2: Line Chart
      {
        type: 'line',
        smooth: CONFIG.SMOOTH_RATIO,
        showSymbol: true,
        symbolSize: CONFIG.SYMBOL_SIZE,
        itemStyle: { color: CONFIG.COLOR },
        lineStyle: { width: CONFIG.LINE_WIDTH },
        data: rows.map((row) => [row.normalized, row.hour + CONFIG.OFFSET_CENTER]),
      },
    ],
  }
})

</script>

<template>
  <div class="distribution-container">
    <div v-if="loading" class="loading-state">
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
