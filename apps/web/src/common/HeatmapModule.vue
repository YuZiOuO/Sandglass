<template>
  <n-card>
    <n-thing>
      <!-- <template #header-extra>
        <n-button @click="() => {}" circle size="small">
          <template #icon>
            <LogoGithub />
          </template>
        </n-button>
      </template> -->
      <n-heatmap :loading="props.loading" :data="convertContributionToHeatmapData(props.data)">
        <template #footer> 点击这里绑定 </template>
      </n-heatmap>
    </n-thing>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NThing, NButton, NHeatmap, type HeatmapData } from 'naive-ui'

import { LogoGithub } from '@vicons/ionicons5'
import type { GithubContributionDTO } from '@/api'

const props = defineProps<{
  data: GithubContributionDTO[]
  loading: boolean
}>()

function convertContributionToHeatmapData(c: GithubContributionDTO[]): HeatmapData {
  return c.map((elem) => {
    return { timestamp: new Date(elem.date).valueOf(), value: elem.count }
  })
}
</script>
