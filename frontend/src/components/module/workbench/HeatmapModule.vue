<template>
  <n-card>
    <n-thing>
      <template #header-extra>
        <n-button @click="requestAuthorization" circle size="small">
          <template #icon>
            <LogoGithub />
          </template>
        </n-button>
      </template>
      <CalendarHeatmap :values="props.values" :end-date="Date.now()" :max="10"
        :range-color="['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']" />
    </n-thing>
  </n-card>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { CalendarHeatmap, type Value } from 'vue3-calendar-heatmap'
import { NCard, NThing, NButton } from 'naive-ui';

import { LogoGithub } from '@vicons/ionicons5'
import { requestAuthorization } from '@/api/github_api';

const props = defineProps({
  values: {
    type: Object as PropType<Value[]>,
    required: true
  }
})

</script>
