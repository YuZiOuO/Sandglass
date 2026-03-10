<script setup lang="ts">
import { useGoogleCalendarEventsQuery } from '@/services-composable/third-party/google-calendar'
import { NCalendar, NEmpty, NTag } from 'naive-ui'

const props = defineProps<{
  calendarId?: string
}>()

const events = useGoogleCalendarEventsQuery(props.calendarId ?? '')
const isSameDay = (e: gapi.client.calendar.Event, y: number, m: number, d: number) => {
  const start = e.start
  if (!start) return false

  let ey: number, em: number, ed: number
  if (start.date) {
    ;[ey, em, ed] = start.date.split('-').map(Number)
  } else if (start.dateTime) {
    const dateObj = new Date(start.dateTime)
    ey = dateObj.getFullYear()
    em = dateObj.getMonth() + 1
    ed = dateObj.getDate()
  } else {
    console.error('Assertion Error: isSameDay')
    return false
  }

  return ey === y && em === m && ed === d
}
</script>

<template>
  <n-calendar style="height: 480px" #="{ year, month, date }" v-if="events.data.value?.items">
    <div
      v-for="e in events.data.value.items.filter((item) => isSameDay(item, year, month, date))"
      :key="e.id"
    >
      <NTag>{{ e.summary }} </NTag>
    </div>
  </n-calendar>
  <n-empty></n-empty>
</template>
