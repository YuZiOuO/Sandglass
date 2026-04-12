<template>
  <NCard 
    size="small" 
    title="Flow" 
    class="flex-col-fill"
    content-class="flex-col-fill"
    content-style="padding: 0;"
  >
    <template #header-extra>
      <events-timeline-filter-selecter v-model:value="displayPreset" />
    </template>
    
    <div class="scroll-wrapper">
      <NScrollbar style="height: 100%;">
        <div style="padding: 12px;">
          <events-timeline
            :config="{
              ...config,
            }"
            :display-preset="displayPreset"
          />
        </div>
      </NScrollbar>
    </div>
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

<style>
.flex-col-fill {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.scroll-wrapper {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
