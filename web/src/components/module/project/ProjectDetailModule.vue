<template>
  <NFlex :wrap="false">
    <NCard class="timeline">
      <ProjectSummaryModule> </ProjectSummaryModule>
      <TasksTimelineModule
        :tasks="props.tasksData"
        :loading="props.tasksData.length === 0"
      ></TasksTimelineModule>
    </NCard>
    <NCard class="content">
      <NCard>
        <NCalendar class="calendar"></NCalendar>
      </NCard>
      <HeatmapModule :data="[]" :loading="true"></HeatmapModule>
      <NDivider dashed :title-placement="'left'">在这里放一些文本</NDivider>
    </NCard>
  </NFlex>
</template>
<script setup lang="ts">
import type { ProjectDTO } from '@/api'
import { NCalendar, NCard, NDivider, NFlex } from 'naive-ui'
import TasksTimelineModule from '../tasks/TasksTimelineModule.vue'
import HeatmapModule from '@/components/common/HeatmapModule.vue'
import ProjectSummaryModule from './ProjectSummaryModule.vue'

const props = defineProps<{
  projectData: ProjectDTO
  tasksData: gapi.client.tasks.Task[]
}>()
</script>

<style lang="css" scoped>
.timeline {
  flex-basis: 30%;
  flex-grow: 1;
}
.content {
  flex-basis: 70%;
}
.calendar {
  height: 450px;
}
</style>
