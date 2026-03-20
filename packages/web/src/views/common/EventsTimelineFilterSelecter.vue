<script setup lang="ts">
import { type DropdownOption, NSelect } from 'naive-ui'
import type { EventsTimelineDisplayPreset } from './EventsTimeline.vue'

const model = defineModel<EventsTimelineDisplayPreset>('value', {
  default: () => 'today',
})

const dropdownOptions: DropdownOption[] = [
  {
    label: '今日',
    value: 'today',
  },
  {
    label: '7天内',
    value: 'withIn7days',
  },
  {
    label: '30天内',
    value: 'withIn30days',
  },
] as const
</script>

<template>
  <n-select trigger="hover" :options="dropdownOptions" v-model:value="model"></n-select>
</template>
