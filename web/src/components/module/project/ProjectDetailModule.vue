<template>
  <NFlex :wrap="false">
    <NCard class="timeline">
      <ProjectSummaryModule :proj="project.data.value"> </ProjectSummaryModule>
      <TasksTimelineModule :tasklist-id="project.data.value?.tasklistId" />
    </NCard>
    <NCard class="content">
      <NCard> <CalendarModule :calendar-id="project.data.value?.calendarId" /> </NCard>
      <HeatmapModule :data="[]" :loading="true"></HeatmapModule>
      <NDivider dashed :title-placement="'left'">在这里放一些文本</NDivider>
    </NCard>
  </NFlex>
</template>
<script setup lang="ts">
import { NCard, NDivider, NFlex } from 'naive-ui'
import TasksTimelineModule from '../tasks/TasksTimelineModule.vue'
import HeatmapModule from '@/components/common/HeatmapModule.vue'
import ProjectSummaryModule from './ProjectSummaryModule.vue'
import { useProjectQuery } from '@/services-composable/project'
import CalendarModule from '../calendar/CalendarModule.vue'

const props = defineProps<{
  projectId: string | undefined
}>()

const project = useProjectQuery(() => props.projectId ?? '')
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
