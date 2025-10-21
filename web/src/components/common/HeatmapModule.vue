<template>
  <n-card>
    <n-thing>
      <template #header-extra>
        <n-button @click="() => {}" circle size="small">
          <template #icon>
            <LogoGithub />
          </template>
        </n-button>
      </template>
      <n-heatmap :data="props.values"></n-heatmap>
    </n-thing>
  </n-card>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { NCard, NThing, NButton, NHeatmap, type HeatmapData } from 'naive-ui'

import { LogoGithub } from '@vicons/ionicons5'

const props = defineProps({
  values: {
    type: Object as PropType<HeatmapData>,
    required: true,
  },
})
</script>
