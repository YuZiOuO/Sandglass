<template>
  <n-grid cols="s:1 m:3" x-gap="12" y-gap="12" responsive="screen">
    <n-gi :span="2">
      <NFlex vertical>
        <NCard>
          <AttendanceStatusModule />
        </NCard>

        <NCard>
          <AttendanceStatisticsModule />
        </NCard>
      </NFlex>
    </n-gi>
    <n-gi :span="1">
      <NFlex vertical>
        <NCard>
          <AttendanceActionsModule />
        </NCard>

        <NCard title="今日打卡记录">
          <template #header-extra>
            <EventsTimelineFilterSelecter v-model:value="displayPreset" />
          </template>
          <EventsTimeline
            :display-preset="displayPreset"
            :config="{
              attendance: {},
              github: {},
              googleCalendar: {},
              googleTask: {},
            }"
          />
        </NCard>
      </NFlex>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { NCard, NGrid, NGi, NFlex } from 'naive-ui'
import AttendanceStatisticsModule from './modules/AttendanceStatisticsModule.vue'
import AttendanceActionsModule from './modules/AttendanceActionsModule.vue'
import AttendanceStatusModule from './modules/AttendanceStatusModule.vue'
import EventsTimeline from '../common/EventsTimeline.vue'
import EventsTimelineFilterSelecter from '../common/EventsTimelineFilterSelecter.vue'
import type { EventsTimelineDisplayPreset } from '../common/EventsTimeline.vue'
import { ref } from 'vue'

const displayPreset = ref<EventsTimelineDisplayPreset>()
</script>
