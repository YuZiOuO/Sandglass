<script setup lang="ts">
import EventsTimeline from '@/views/common/EventsTimeline.vue'
import type {
  EventsTimelineConfig,
  EventsTimelineDisplayPreset,
} from '@/views/common/EventsTimeline.vue'
import EventsTimelineFilterSelecter from '@/views/common/EventsTimelineFilterSelecter.vue'
import { NCard } from 'naive-ui'
import { ref } from 'vue'
defineProps<{ config: EventsTimelineConfig }>()
const displayPreset = ref<EventsTimelineDisplayPreset>()
</script>

<template>
  <n-card size="small" title="Flow">
    <template #header-extra>
      <events-timeline-filter-selecter v-model:value="displayPreset" />
    </template>
    <events-timeline
      :config="{
        ...config,
      }"
      :display-preset="displayPreset"
    />
  </n-card>
</template>
