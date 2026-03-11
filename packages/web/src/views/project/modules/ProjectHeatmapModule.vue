<script setup lang="ts">
import { useGithubListRepoCommitsQuery } from '@/services-composable/third-party/github'
import { NHeatmap, type HeatmapData } from 'naive-ui'
import { computed } from 'vue'

const props = defineProps<{
  owner?: string
  repo?: string
}>()

const lastYearToday = new Date()
lastYearToday.setHours(0, 0, 0, 0) // 防止query key抖动
lastYearToday.setFullYear(lastYearToday.getFullYear() - 1)

const commits = useGithubListRepoCommitsQuery(
  () => props.owner,
  () => props.repo,
  lastYearToday,
)

type Commits = NonNullable<ReturnType<typeof useGithubListRepoCommitsQuery>['data']['value']>
function commits2rawHeatmapData(c: Commits): HeatmapData {
  return c.map((item) => {
    return {
      timestamp: new Date(item.commit.author?.date ?? 0).getTime(),
      value: 1,
    }
  })
}

function aggregateRawHeatmapData(rawData: HeatmapData): HeatmapData {
  const aggregated = rawData.reduce(
    (acc, item) => {
      // 1. 将时间戳对齐到当天 0 点
      const date = new Date(item.timestamp)
      date.setHours(0, 0, 0, 0)
      const startOfDay = date.getTime()

      // 2. 累加逻辑
      if (item.value) {
        if (!acc[startOfDay]) {
          acc[startOfDay] = { timestamp: startOfDay, value: 0 }
        }
        acc[startOfDay].value += item.value
      }

      return acc
    },
    {} as Record<number, { timestamp: number; value: number }>,
  )
  return Object.values(aggregated)
}

function getLevel(value: number | null | undefined): number {
  if (!value || value <= 0) return 0
  const thresholds = [1, 3, 6, 10]
  // 过滤掉不满足条件的阈值，剩下的长度即为等级
  return thresholds.filter((t) => value >= t).length
}

const heatmapData = computed(() => {
  if (commits.data.value) {
    return aggregateRawHeatmapData(commits2rawHeatmapData(commits.data.value))
  } else {
    return undefined
  }
})
</script>

<template>
  <n-heatmap
    size="small"
    :first-day-of-week="6"
    :fill-calendar-leading="true"
    :show-week-labels="false"
    :show-month-labels="false"
    :loading="commits.isLoading.value"
    :data="
      heatmapData?.map((item) => {
        return {
          timestamp: item.timestamp,
          value: getLevel(item.value),
        }
      })
    "
    :tooltip="true"
  />
</template>
