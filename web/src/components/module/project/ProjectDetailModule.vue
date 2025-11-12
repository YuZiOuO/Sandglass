<template>
  <NFlex :wrap="false">
    <NCard class="timeline">
      <ProjectSummaryModule :proj="props.projectData"> </ProjectSummaryModule>
      <TasksTimelineModule
        :tasklist-id="props.projectData?.tasklistId"
        :tasks="props.tasksData"
        :loading="!props.tasksData"
      />
    </NCard>
    <NCard class="content">
      <NCard>
        <NCalendar class="calendar" #="{ year, month, date }" v-if="events && events.items">
          <NFlex class="calendar-container">
            <NTag
              v-for="eventOfTheDay in events.items.filter((elem) =>
                checkEventInDate(elem, { year, month, date }),
              )"
              :key="eventOfTheDay.start?.dateTime"
              class="calendar-tag"
            >
              <NText class="calendar-tag-text">{{ eventOfTheDay.summary }}</NText>
            </NTag>
          </NFlex>
        </NCalendar>
      </NCard>
      <HeatmapModule :data="[]" :loading="true"></HeatmapModule>
      <NDivider dashed :title-placement="'left'">在这里放一些文本</NDivider>
    </NCard>
  </NFlex>
</template>
<script setup lang="ts">
import type { ProjectDTO } from '@/api'
import { NCalendar, NCard, NDivider, NFlex, NTag, NText } from 'naive-ui'
import TasksTimelineModule from '../tasks/TasksTimelineModule.vue'
import HeatmapModule from '@/components/common/HeatmapModule.vue'
import ProjectSummaryModule from './ProjectSummaryModule.vue'

const props = defineProps<{
  projectData: ProjectDTO | undefined
  tasksData: gapi.client.tasks.Task[] | undefined
  events: gapi.client.calendar.Events | undefined
}>()

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

<style lang="css" scoped>
.timeline {
  flex-basis: 30%;
  flex-grow: 1;
}
.content {
  flex-basis: 70%;
}
/* .calendar {
  display: flex;
  height: 450px;
} */

.calendar-container {
  display: flex;
}
.calendar-tag-text {
  white-space: normal;
}
.calendar-tag {
  height: auto;
}
</style>
