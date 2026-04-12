<script setup lang="ts">
import { useGithubListRepoCommitsQuery } from '@/services-composable/third-party/github'
import { NHeatmap, NStatistic, NFlex, NNumberAnimation, NCollapseTransition, NButton, type HeatmapData } from 'naive-ui'
import { computed, ref } from 'vue'

const props = defineProps<{
  owner?: string
  repo?: string
}>()

const today = new Date()
today.setHours(0, 0, 0, 0) // 防止query key抖动
const halfYearAgo = new Date(today)
halfYearAgo.setMonth(halfYearAgo.getMonth() - 6)

const commits = useGithubListRepoCommitsQuery(
  () => props.owner,
  () => props.repo,
  halfYearAgo,
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

const totalCommits = computed(() => {
  return commits.data.value?.length ?? 0
})

// 判定数据跨度是否“值得”展示热图（至少有30天的跨度，否则就只有几列孤零零的格子）
const isHeatmapSpanEnough = computed(() => {
  if (!commits.data.value || commits.data.value.length === 0) return false
  const timestamps = commits.data.value.map((c) => new Date(c.commit.author?.date ?? 0).getTime())
  const min = Math.min(...timestamps)
  const max = Math.max(...timestamps)
  const daysSpan = (max - min) / (1000 * 60 * 60 * 24)
  return daysSpan >= 30
})

// 用户手动控制热图显示的覆盖状态 (null 代表完全跟随系统判断)
const userShowHeatmap = ref<boolean | null>(null)
const displayHeatmap = computed({
  get: () => userShowHeatmap.value ?? isHeatmapSpanEnough.value,
  set: (val) => {
    userShowHeatmap.value = val
  },
})

const heatmapData = computed(() => {
  if (commits.data.value) {
    return aggregateRawHeatmapData(commits2rawHeatmapData(commits.data.value))
  }
  return undefined
})
</script>

<template>
  <div class="py-2 px-3">
    <!-- 顶部控制栏：左侧数据组件，右侧控制操作 -->
    <NFlex align="center" justify="space-between" class="px-2 min-h-[60px]">
      <NStatistic label="近6月 GitHub 提交">
        <NNumberAnimation :from="0" :to="totalCommits" />
      </NStatistic>
      
      <!-- 用小按钮替代复选框，作为"展开/收起"的隐喻 -->
      <NButton 
        v-if="!commits.isLoading.value"
        size="tiny" 
        quaternary 
        :type="displayHeatmap ? 'primary' : 'default'"
        @click="displayHeatmap = !displayHeatmap"
      >
        {{ displayHeatmap ? '收起热图' : '展开热图详情' }}
      </NButton>
    </NFlex>
    
    <!-- 底部热图区域：利用动画折叠避免高度跳变造成的闪烁 -->
    <NCollapseTransition :show="displayHeatmap && !commits.isLoading.value">
      <div class="flex justify-center pt-2 pb-1 overflow-x-auto">
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
      </div>
    </NCollapseTransition>
  </div>
</template>
