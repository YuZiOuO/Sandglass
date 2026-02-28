<!-- AI 生成模块（主要代码由 AI 生成） -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAttendanceRecordQuery } from '@/services-composable/attendance-record'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { CustomChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent
} from 'echarts/components'
import { NCard, NSpin, NEmpty, NRadioGroup, NRadioButton } from 'naive-ui'
import type { ComposeOption } from 'echarts/core'
import type { CustomSeriesOption } from 'echarts/charts'
import ProjectFocusDistributionModule from './ProjectFocusDistributionModule.vue'

use([
  CanvasRenderer,
  CustomChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent
])

const props = defineProps<{
  projectId: string
}>()

const rangeType = ref<'withIn7days' | 'withIn30days'>('withIn7days')
const daysCount = computed(() => rangeType.value === 'withIn7days' ? 7 : 30)
const dayMs = 24 * 60 * 60 * 1000

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
    labels.push(
      `${d.getMonth() + 1}/${d.getDate()} (${weekdays[d.getDay()]})`
    )
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

const chartData = computed(() => {
  if (!records.value?.length) {
    return []
  }

  const rangeStart = startDate.value.getTime()
  const dayLimit = daysCount.value
  const ranges: TimeRange[] = []
  const sorted = [...records.value].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
  )

  let currentStart: Date | null = null

  const processRange = (start: Date, end: Date, summary?: string) => {
    let current = new Date(start)
    while (current < end) {
      const currentDayStart = new Date(current)
      currentDayStart.setHours(0, 0, 0, 0)
      const nextDayStart = new Date(currentDayStart)
      nextDayStart.setDate(nextDayStart.getDate() + 1)
      const segmentEnd = end < nextDayStart ? end : nextDayStart
      const dayDiff = Math.round((currentDayStart.getTime() - rangeStart) / dayMs)

      if (dayDiff >= 0 && dayDiff < dayLimit) {
        const midnightTs = currentDayStart.getTime()
        ranges.push({
          dayIndex: dayDiff,
          startTime: current.getTime() - midnightTs,
          endTime: segmentEnd.getTime() - midnightTs,
          duration: segmentEnd.getTime() - current.getTime(),
          summary,
        })
      }

      current = segmentEnd
    }
  }

  for (const record of sorted) {
    const recordTime = parseRecordTime(record.time)
    if (record.type === 'IN') {
      currentStart = recordTime
    } else if (['OUT', 'PAUSE'].includes(record.type) && currentStart) {
      processRange(currentStart, recordTime, record.summary || undefined)
      currentStart = null
    }
  }

  if (currentStart) {
    const now = new Date()
    const effectiveEnd = now < endOfToday ? now : endOfToday
    if (currentStart < effectiveEnd) {
      processRange(currentStart, effectiveEnd, '进行中...')
    }
  }

  return ranges
})


const option = computed<ComposeOption<CustomSeriesOption>>(() => {
  const data = chartData.value
  
  if (data.length === 0) return {
    title: {
      text: '暂无数据',
      left: 'center',
      top: 'center'
    }
  }

  return {
    tooltip: {
      formatter: (params: any) => {
        const itemIndex = params.value[3]
        const item = data[itemIndex]
        if (!item) return ''
        
        const formatTime = (ms: number) => {
          const h = Math.floor(ms / 3600000)
          const m = Math.floor((ms % 3600000) / 60000)
          return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
        }
        
        const durationMin = Math.round(item.duration / 60000)
        
        return `
          <div style="font-weight:bold">${dateLabels.value[item.dayIndex]}</div>
          <div>${formatTime(item.startTime)} - ${formatTime(item.endTime)}</div>
          <div>时长: ${durationMin} 分钟</div>
          ${item.summary ? `<div>备注: ${item.summary}</div>` : ''}
        `
      }
    },
    grid: {
      top: 30,
      bottom: 30,
      left: 60,
      right: 20
    },
    xAxis: {
      type: 'category',
      data: dateLabels.value,
      boundaryGap: true,
      splitLine: {
        show: true,
        lineStyle: { type: 'dashed' }
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: dayMs,
      inverse: true,
      axisLabel: {
        formatter: (val: number) => {
          const h = Math.floor(val / 3600000)
          return `${h.toString().padStart(2, '0')}:00`
        }
      }
    },
    dataZoom: [
      {
        type: 'slider',
        show: daysCount.value > 10,
        xAxisIndex: [0],
        start: daysCount.value > 10 ? 50 : 0,
        end: 100
      },
      {
        type: 'inside',
        xAxisIndex: [0],
        zoomOnMouseWheel: false,
        moveOnMouseWheel: true 
      }
    ],
    series: [
      {
        type: 'custom',
        renderItem: (_params: any, api: any) => {
          const categoryIndex = api.value(0)
          const start = api.value(1)
          const end = api.value(2)
          const startPoint = api.coord([categoryIndex, start])
          const endPoint = api.coord([categoryIndex, end])
          const size = api.size?.([1, 0])
          const width = (size ? size[0] : 50) * 0.6
          if (!startPoint || !endPoint) return

          const x = startPoint[0] - width / 2
          const y = startPoint[1]
          let height = Math.abs(endPoint[1] - startPoint[1])
          if (height < 2) height = 2

          return {
            type: 'rect',
            shape: {
              x: x,
              y: y,
              width: width,
              height: height
            },
            style: {
              fill: '#5470c6',
              opacity: 0.8
            }
          }
        },
        itemStyle: {
          opacity: 0.8
        },
        encode: {
          x: 0,
          y: [1, 2],
          tooltip: [1, 2]
        },
        data: data.map((item, index) => ({
             value: [item.dayIndex, item.startTime, item.endTime, index]
        }))
      }
    ]
  }
})

function parseRecordTime(time: string | number | Date) {
  if (typeof time === 'string' && time.endsWith('Z')) {
    return new Date(time.slice(0, -1))
  }
  return new Date(time)
}
</script>

<template>
  <NCard title="专注时间轴 Timeline" size="small" class="mt-4">
    <template #header-extra>
      <NRadioGroup v-model:value="rangeType" size="small">
        <NRadioButton value="withIn7days">近7天</NRadioButton>
        <NRadioButton value="withIn30days">近30天</NRadioButton>
      </NRadioGroup>
    </template>
    
    <div class="chart-layout">
      <div class="timeline-pane chart-container">
        <div v-if="isLoading" class="loading-state">
          <NSpin />
        </div>
        <div v-else-if="!chartData.length" class="empty-state">
          <NEmpty :description="rangeType === 'withIn7days' ? '近7天暂无记录' : '近30天暂无记录'" />
        </div>
        <VChart v-else class="chart" :option="option" autoresize />
      </div>
      <div class="distribution-pane">
        <ProjectFocusDistributionModule :project-id="projectId" :range-type="rangeType" />
      </div>
    </div>
  </NCard>
</template>

<style scoped>
.chart-layout {
  height: 320px;
  width: 100%;
  display: flex;
  gap: 12px;
}

.timeline-pane {
  flex: 1;
  min-width: 0;
}

.distribution-pane {
  width: 160px;
  flex: 0 0 160px;
}

.chart-container {
  height: 100%;
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
  min-height: 300px;
}
</style>
