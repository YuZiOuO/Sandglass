<!-- AI 生成模块（主要代码由 AI 生成） -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { CustomChart } from 'echarts/charts'
import {
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
} from 'echarts/components'
import { NCard, NSpin, NEmpty, NRadioGroup, NRadioButton } from 'naive-ui'
import type { ComposeOption } from 'echarts/core'
import type { CustomSeriesOption } from 'echarts/charts'
import type {
  CallbackDataParams,
  CustomSeriesRenderItemParams,
  CustomSeriesRenderItemAPI,
  CustomSeriesRenderItem,
} from 'echarts/types/dist/shared'
import {
  useAttendanceRecordQuery,
  type AttendanceRecordQueryType,
} from '@/services-composable/attendance-record'
import ProjectFocusDistributionModule from './ProjectFocusDistributionModule.vue'

// Internal type definition for UI logic
const AttendanceType = {
  IN: 'IN',
  OUT: 'OUT',
  PAUSE: 'PAUSE',
} as const
type AttendanceType = (typeof AttendanceType)[keyof typeof AttendanceType]

use([
  CanvasRenderer,
  CustomChart,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
])

const ONE_DAY_MS = 24 * 60 * 60 * 1000
const ONE_HOUR_MS = 60 * 60 * 1000
const ONE_MINUTE_MS = 60 * 1000

const props = defineProps<{
  projectId: string
}>()

const rangeType = ref<AttendanceRecordQueryType>('withIn7days')
const daysCount = computed(() => (rangeType.value === 'withIn7days' ? 7 : 30))

const today = new Date()
const endOfToday = new Date(today)
endOfToday.setHours(23, 59, 59, 999)

const startDate = computed(() => {
  const d = new Date(today)
  d.setDate(today.getDate() - (daysCount.value - 1))
  d.setHours(0, 0, 0, 0)
  return d
})

const { data: records, isLoading } = useAttendanceRecordQuery(
  rangeType,
  computed(() => props.projectId),
)

const dateLabels = computed(() => {
  const labels = []
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const count = daysCount.value
  const start = startDate.value

  for (let i = 0; i < count; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    labels.push(`${d.getMonth() + 1}/${d.getDate()} (${weekdays[d.getDay()]})`)
  }
  return labels
})

type TimeRange = {
  dayIndex: number
  startTime: number
  endTime: number
  duration: number
  summary?: string
}
export type { TimeRange }

const chartData = computed(() => {
  if (!records.value?.length) {
    return []
  }

  // 1. Prepare base dates and boundaries
  const rangeStart = startDate.value.getTime()
  const dayLimit = daysCount.value
  const ranges: TimeRange[] = []

  // 2. Sort records chronologically
  const sorted = [...records.value].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
  )

  let currentStart: Date | null = null

  // 3. Helper: Split a time range across midnight boundaries
  const processRange = (start: Date, end: Date, summary?: string) => {
    let current = new Date(start)
    
    // Iterate until we cover the full duration
    while (current < end) {
      // Calculate day boundaries
      const currentDayStart = new Date(current)
      currentDayStart.setHours(0, 0, 0, 0)
      
      const nextDayStart = new Date(currentDayStart)
      nextDayStart.setDate(nextDayStart.getDate() + 1)

      // Determine segment end (either range end OR midnight)
      const segmentEnd = end < nextDayStart ? end : nextDayStart
      
      // Calculate offset from chart start date
      const dayDiff = Math.round((currentDayStart.getTime() - rangeStart) / ONE_DAY_MS)

      // Only add segments within the requested window
      if (dayDiff >= 0 && dayDiff < dayLimit) {
        const midnightTs = currentDayStart.getTime()
        ranges.push({
          dayIndex: dayDiff,
          startTime: current.getTime() - midnightTs, // ms from midnight
          endTime: segmentEnd.getTime() - midnightTs, // ms from midnight
          duration: segmentEnd.getTime() - current.getTime(),
          summary,
        })
      }

      // Move cursor to next segment start
      current = segmentEnd
    }
  }

  // 4. Iterate records to pair IN/OUT events
  for (const record of sorted) {
    const recordTime = new Date(record.time)
    
    // Start session
    if (record.type === AttendanceType.IN) {
      currentStart = recordTime
    } 
    // End session (OUT/PAUSE) if we have a start
    else if (
      (
        [AttendanceType.OUT, AttendanceType.PAUSE] as AttendanceType[]
      ).includes(record.type as AttendanceType) &&
      currentStart
    ) {
      processRange(currentStart, recordTime, record.summary || undefined)
      currentStart = null
    }
  }

  // 5. Handle ongoing session (if User is currently working)
  if (currentStart) {
    const now = new Date()
    const effectiveEnd = now < endOfToday ? now : endOfToday
    if (currentStart < effectiveEnd) {
      processRange(currentStart, effectiveEnd, 'Working...')
    }
  }

  return ranges
})

// Constants for Data Dimensions (ECharts data array mapping)
// [dayIndex, startTime, endTime, rawItemIndex]
const DIM = {
  DAY: 0,
  START: 1,
  END: 2,
  RAW_INDEX: 3,
}

// Layout Constants
const LAYOUT = {
  SLIDER_THRESHOLD: 10, // Days count to trigger slider
  BAR_WIDTH_RATIO: 0.6,
  MIN_BAR_HEIGHT: 2,
  GRID: {
    TOP: 30,
    LEFT: 60,
    RIGHT: 20,
    BOTTOM_DEFAULT: 30,
    BOTTOM_WITH_SLIDER: 70,
  },
}

// Helper: Format milliseconds to HH:mm
const formatTime = (ms: number) => {
  const h = Math.floor(ms / (60 * 60 * 1000))
  const m = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000))
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

// Helper: Render timeline block
const renderItem: CustomSeriesRenderItem = (
  _params: CustomSeriesRenderItemParams,
  api: CustomSeriesRenderItemAPI,
) => {
  const categoryIndex = api.value(DIM.DAY) as number
  const start = api.value(DIM.START) as number
  const end = api.value(DIM.END) as number

  const startPoint = api.coord([categoryIndex, start])
  const endPoint = api.coord([categoryIndex, end])
  if (!startPoint || !endPoint) {
    // Return undefined implicitly if points are invalid
    // but strictly we should return undefined or a null-like object
    // explicitly returning undefined to match type
    return
  }

  // api.size returns number[] for cartesian coords
  const size = api.size?.([1, 0]) as number[] | undefined
  const width = (size ? size[0] : 50) * LAYOUT.BAR_WIDTH_RATIO

  // 6. Calculate position
  // Since yAxis is inverse (0 at top), smaller start time = top
  const x = startPoint[0] - width / 2
  const y = startPoint[1]
  const height = Math.max(
    Math.abs(endPoint[1] - startPoint[1]),
    LAYOUT.MIN_BAR_HEIGHT,
  )

  return {
    type: 'rect',
    shape: { x, y, width, height },
    style: { fill: '#5470c6', opacity: 0.8 },
  }
}

const option = computed<ComposeOption<CustomSeriesOption>>(() => {
  const data = chartData.value

  const showSlider = daysCount.value > LAYOUT.SLIDER_THRESHOLD

  return {
    tooltip: {
      formatter: (params: CallbackDataParams) => {
        const itemIndex = Array.isArray(params.value)
          ? params.value[DIM.RAW_INDEX]
          : undefined
        if (typeof itemIndex !== 'number') return ''
        const item = data[itemIndex]
        if (!item) return ''

        return [
          `<div style="font-weight:bold">${dateLabels.value[item.dayIndex]}</div>`,
          `<div>${formatTime(item.startTime)} - ${formatTime(item.endTime)}</div>`,
          `<div>时长: ${Math.round(item.duration / ONE_MINUTE_MS)} 分钟</div>`,
          item.summary ? `<div>备注: ${item.summary}</div>` : '',
        ].join('')
      },
    },
    grid: {
      top: LAYOUT.GRID.TOP,
      bottom: showSlider
        ? LAYOUT.GRID.BOTTOM_WITH_SLIDER
        : LAYOUT.GRID.BOTTOM_DEFAULT,
      left: LAYOUT.GRID.LEFT,
      right: LAYOUT.GRID.RIGHT,
    },
    xAxis: {
      type: 'category',
      data: dateLabels.value,
      boundaryGap: true,
      splitLine: {
        show: true,
        lineStyle: { type: 'dashed' },
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: ONE_DAY_MS,
      inverse: true,
      axisLabel: {
        formatter: (val: number) =>
          `${Math.floor(val / ONE_HOUR_MS).toString().padStart(2, '0')}:00`,
      },
    },
    dataZoom: [
      {
        type: 'slider',
        show: showSlider,
        xAxisIndex: [0],
        start: showSlider ? 50 : 0,
        end: 100,
        bottom: 10,
        height: 20,
      },
      {
        type: 'inside',
        xAxisIndex: [0],
        zoomOnMouseWheel: false,
        moveOnMouseWheel: true,
      },
    ],
    series: [
      {
        type: 'custom',
        renderItem,
        itemStyle: { opacity: 0.8 },
        encode: {
          x: DIM.DAY,
          y: [DIM.START, DIM.END],
          tooltip: [DIM.START, DIM.END],
        },
        data: data.map((item, index) => ({
          // Map data to simpler array for ECharts performance
          // [0:day, 1:start, 2:end, 3:index]
          value: [item.dayIndex, item.startTime, item.endTime, index],
        })),
      },
    ],
  }
})

</script>

<template>
  <NCard title="专注时间轴 Timeline" size="small" class="mt-4" :bordered="false">
    <template #header-extra>
      <NRadioGroup v-model:value="rangeType" size="small">
        <NRadioButton value="withIn7days" label="7天" />
        <NRadioButton value="withIn30days" label="30天" />
      </NRadioGroup>
    </template>

    <div class="chart-layout">
      <div class="timeline-pane">
        <div v-if="isLoading" class="loading-state">
          <NSpin />
        </div>
        <div v-else-if="!chartData.length" class="empty-state">
          <NEmpty :description="rangeType === 'withIn7days' ? '近7天暂无记录' : '近30天暂无记录'" />
        </div>
        <VChart v-else class="chart" :option="option" autoresize />
      </div>
      <div class="distribution-pane">
        <ProjectFocusDistributionModule :ranges="chartData" :loading="isLoading" />
      </div>
    </div>
  </NCard>
</template>

<style scoped>
.chart-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 160px;
  grid-template-rows: 320px;
  gap: 12px;
}

.timeline-pane,
.distribution-pane {
  min-width: 0;
  height: 100%;
  position: relative;
}

.loading-state,
.empty-state,
.chart {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 640px) {
  .chart-layout {
    grid-template-columns: 1fr;
    grid-template-rows: 300px 300px;
    height: auto;
  }
}
</style>
