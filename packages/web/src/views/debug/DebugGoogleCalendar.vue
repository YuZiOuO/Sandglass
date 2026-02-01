<template>
  <NButton
    @click="
      async () => {
        await calendarList.refetch()
      }
    "
    >listCalendar</NButton
  >
  <NCollapse v-if="calendarList.data.value?.items">
    <NCollapseItem
      v-for="field in Object.entries(calendarList.data.value?.items)"
      :key="field[0]?.toString()"
      :title="field[0]"
    >
      {{ field[1] }}
    </NCollapseItem>
  </NCollapse>
</template>

<script setup lang="ts">
import { useCalendarListQuery } from '@/services-composable/google-calendar'
import { NButton, NCollapse, NCollapseItem } from 'naive-ui'

import { ref } from 'vue'

const calendarList = useCalendarListQuery()
</script>
