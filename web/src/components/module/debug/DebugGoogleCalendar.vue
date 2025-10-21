<template>
  <NButton
    @click="
      async () => {
        cachedCalendarList = await googleCalendarStore.listCalendar()
      }
    "
    >listCalendar</NButton
  >
  <NCollapse v-if="cachedCalendarList?.items">
    <NCollapseItem
      v-for="field in Object.entries(cachedCalendarList.items)"
      :key="field[0]?.toString()"
      :title="field[0]"
    >
      {{ field[1] }}
    </NCollapseItem>
  </NCollapse>
</template>

<script setup lang="ts">
import { NButton, NCollapse, NCollapseItem } from 'naive-ui'
import { useGoogleCalendarStore } from '@/stores/google-calendar'

import { ref } from 'vue'

const googleCalendarStore = useGoogleCalendarStore()
const cachedCalendarList = ref<gapi.client.calendar.CalendarList>()
</script>
