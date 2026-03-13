<script setup lang="ts">
import EventsTimeline from '@/views/common/EventsTimeline.vue'
import type { EventsTimelineDisplayPreset } from '@/views/common/EventsTimeline.vue'
import EventsTimelineFilterSelecter from '@/views/common/EventsTimelineFilterSelecter.vue'
import { NCard } from 'naive-ui'
import { ref } from 'vue'
defineProps<{ projectId: string; tasklistId?: string }>()
const displayPreset = ref<EventsTimelineDisplayPreset>('today')
</script>

<template>
  <n-card size="small" title="Flow">
    <template #header-extra>
      <events-timeline-filter-selecter v-model:value="displayPreset" />
    </template>
    <events-timeline
      :attendance="{ preset: 'withIn30days', projectId: projectId }"
      :github="{
        owner: 'YuZiOuO',
        repo: 'Sandglass',
        since: new Date(new Date().setHours(0, 0, 0, 0)), // start of today
      }"
      :googleTask="
        tasklistId
          ? {
              TasklistId: tasklistId,
            }
          : undefined
      "
      :display-preset="displayPreset"
    />
  </n-card>
</template>
