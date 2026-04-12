<template>
  <NCard 
    size="small" 
    title="Flow" 
    class="flex flex-col min-h-0"
    content-class="flex flex-col flex-1 min-h-0"
    content-style="padding: 0;"
  >
    <template #header-extra>
      <events-timeline-filter-selecter v-model:value="displayPreset" />
    </template>
    
    <NScrollbar class="flex-1 min-h-0">
      <div style="padding: 12px;">
          <events-timeline
            :config="{
              ...config,
            }"
            :display-preset="displayPreset"
          />
        </div>
      </NScrollbar>
  </NCard>
</template>

<script setup lang="ts">
import EventsTimeline from '@/views/common/EventsTimeline.vue'
import type {
  EventsTimelineConfig,
  EventsTimelineDisplayPreset,
} from '@/views/common/EventsTimeline.vue'
import EventsTimelineFilterSelecter from '@/views/common/EventsTimelineFilterSelecter.vue'
import { NCard, NScrollbar } from 'naive-ui'
import { ref } from 'vue'
defineProps<{ config: EventsTimelineConfig }>()
const displayPreset = ref<EventsTimelineDisplayPreset>()
</script>
