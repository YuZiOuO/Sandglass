<template>
  <NCalendar class="calendar" #="{ year, month, date }" v-if="events && events.data.value?.items">
    <NFlex class="calendar-container">
      <NTag
        v-for="eventOfTheDay in events.data.value.items.filter((elem) =>
          checkEventInDate(elem, { year, month, date }),
        )"
        :key="eventOfTheDay.start?.dateTime"
        class="calendar-tag"
      >
        <NText class="calendar-tag-text">{{ eventOfTheDay.summary }}</NText>
      </NTag>
    </NFlex>
  </NCalendar>
</template>

<script setup lang="ts">
import { NFlex, NTag, NCalendar, NText } from 'naive-ui'
import { useEventListQuery } from '@/services-composable/google-calendar'

const props = defineProps<{ calendarId: string | undefined }>()

const events = useEventListQuery(() => props.calendarId ?? '')

function checkEventInDate(
  event: gapi.client.calendar.Event,
  date: { year: number; month: number; date: number },
) {
  if (!event.start || !event.start.dateTime) {
    return false
  }
  const start = new Date(event.start.dateTime)
  return (
    start.getFullYear() === date.year &&
    start.getMonth() === date.month &&
    start.getDay() === date.date
  )
}
</script>
